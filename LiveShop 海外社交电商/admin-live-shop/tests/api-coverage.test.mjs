import test from 'node:test';
import assert from 'node:assert/strict';
import { collectEndpoints } from '../scripts/api-inventory.mjs';
import { createStore } from '../server/store.mjs';
import { seedSystem, handleSystem } from '../server/system.mjs';
import { seedCommerce, handleCommerce } from '../server/commerce.mjs';
import { seedOperations, handleOperations } from '../server/operations.mjs';

const mainEndpoints = new Set([
  'GET health',
  'POST Base/login',
  'POST Base/captcha',
  'POST User/logout',
  'POST BasePrivate/uploadFile',
]);

test('every frontend HTTP method and endpoint is recognized by the local backend', async t => {
  const endpoints = collectEndpoints();
  assert.ok(endpoints.length > 0, '没有找到前端接口，扫描路径可能失效');
  assert.equal(new Set(endpoints.map(endpoint => `${endpoint.method} ${endpoint.path}`)).size, endpoints.length, '接口清单不能重复');
  const store = createStore(':memory:');
  try {
    seedSystem(store);
    seedCommerce(store);
    seedOperations(store);
    const missing = [];
    let validationFailures = 0;
    for (const endpoint of endpoints) {
      const label = `${endpoint.method} ${endpoint.path}`;
      if (mainEndpoints.has(label)) continue;
      // Probe empty parameters on a savepoint. An add/edit handler may reject
      // missing fields or mutate a row, but neither affects another probe.
      store.db.exec('SAVEPOINT route_probe');
      try {
        const ctx = { ...endpoint, query: {}, body: {}, store, user: store.get('admins', 1), origin: 'http://127.0.0.1:8787' };
        let recognized = false;
        for (const handler of [handleSystem, handleCommerce, handleOperations]) {
          try {
            if (await handler(ctx) !== undefined) { recognized = true; break; }
          } catch (error) {
            assert.ok(error.apiCode || error.code || error.statusCode || error.status, `${label} 出现运行时异常：${error.stack || error.message}`);
            recognized = true;
            validationFailures++;
            break;
          }
        }
        if (!recognized) missing.push(`${label} (${endpoint.file})`);
      } finally {
        store.db.exec('ROLLBACK TO route_probe; RELEASE route_probe');
      }
    }
    t.diagnostic(`扫描 ${endpoints.length} 个方法与地址组合，${new Set(endpoints.map(endpoint => endpoint.path)).size} 个唯一地址；${validationFailures} 个接口正常拒绝空参数。`);
    assert.deepEqual(missing, [], `以下前端接口未实现：\n${missing.join('\n')}`);
  } finally {
    store.close();
  }
});
