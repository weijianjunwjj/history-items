import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { createApp } from '../server/index.mjs';

test('local backend works over HTTP and persists in an isolated SQLite database', async t => {
  const dataDirectory = await mkdtemp(join(tmpdir(), 'liveshop-backend-test-'));
  let app;
  let base;
  let token = '';
  let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  let persistentTopic;
  let shippedOrder;
  let initialProductCount;
  let uploadedPath;
  let uploadedBytes;

  async function start() {
    app = createApp({ dataDirectory });
    await new Promise((resolve, reject) => {
      app.server.once('error', reject);
      app.server.listen(0, '127.0.0.1', resolve);
    });
    base = `http://127.0.0.1:${app.server.address().port}`;
  }
  async function stop() {
    if (!app) return;
    await new Promise((resolve, reject) => app.server.close(error => error ? reject(error) : resolve()));
    app.store.close();
    app = undefined;
  }
  t.after(async () => {
    await stop();
    // Only remove the directory returned by mkdtemp, never a user data folder.
    assert.equal(dirname(resolve(dataDirectory)).toLowerCase(), resolve(tmpdir()).toLowerCase());
    assert(basename(dataDirectory).startsWith('liveshop-backend-test-'));
    await rm(dataDirectory, { recursive: true, force: true });
  });
  async function api(path, body = {}, options = {}) {
    const { method = 'POST', auth = token } = options;
    const url = new URL(`/api/${path}`, base);
    if (method === 'GET') for (const [key, value] of Object.entries(body)) if (value !== undefined) url.searchParams.set(key, String(value));
    const response = await fetch(url, { method, headers: { 'content-type': 'application/json', 'x-token': auth }, ...(method === 'GET' ? {} : { body: JSON.stringify(body) }) });
    assert.equal(response.status, 200, path);
    return response.json();
  }
  async function ok(path, body = {}, options) {
    const result = await api(path, body, options);
    assert.equal(result.code, 0, `${path}: ${result.msg}`);
    return result.data;
  }
  async function login(username = 'admin', password = adminPassword) {
    const captcha = await ok('Base/captcha', {}, { auth: '' });
    assert(captcha.picPath.startsWith('data:image/svg+xml;base64,'));
    return ok('Base/login', { username, password, captcha: '1234', captchaId: captcha.captchaId }, { auth: '' });
  }
  await start();

  await t.test('authentication, seed contracts, pagination and module details', async () => {
    const denied = await api('Product/center/index', {}, { auth: '' });
    assert.equal(denied.code, 14);
    const invalidCaptcha = await api('Base/login', { username: 'admin', password: adminPassword, captcha: 'wrong', captchaId: 'missing' }, { auth: '' });
    assert.notEqual(invalidCaptcha.code, 0);
    const session = await login();
    token = session.token;
    assert(session.access.includes('*'));
    assert.equal(session.user.passwordHash, undefined);
    const listPaths = ['User/index', 'Auth/index', 'Dictionary/index', 'Log/index', 'Category/index', 'Product/center/index', 'Product/index', 'Activity/index', 'Activity/booking/index', 'GroupOrder/index', 'GroupOrder/goods/index', 'GroupOrder/crowd/index', 'GroupOrder/group/index', 'RechargeOrder/index', 'AppUser/index', 'Post/index', 'Topic/index', 'IntegralRecord/index', 'Advertisement/index', 'Msg/index', 'Notification/index', 'SceneRule/index'];
    await Promise.all(listPaths.map(async path => {
      const result = await ok(path, { page: 1, pageSize: 2, size: 2, limit: 2 });
      assert(Array.isArray(result.list), `${path} list`);
      assert(result.count > 0, `${path} count`);
      assert(result.list.length <= 2, `${path} pagination`);
    }));
    const categories = await ok('Category/index', { isAll: 1 });
    assert(categories.list[0].children.length > 0);
    const product = await ok('Product/details', { id: 1 }, { method: 'GET' });
    assert(Array.isArray(product.SkuReply));
    assert(Array.isArray(product.spec));
    assert(product.ruleType > 0);
    assert.equal(typeof product.coin, 'string');
    assert.equal(product.stock, product.SkuReply.reduce((sum, sku) => sum + sku.stock, 0));
    initialProductCount = (await ok('Product/center/index')).count;
    const specifications = await ok('Spec/getById', { id: 2 }, { method: 'GET' });
    assert(Array.isArray(specifications[0].spec[0].specVal));
    const values = await ok('Spec/index/details', { id: 2 }, { method: 'GET' });
    assert(values.every(row => row.id && row.dictionaryId && row.specName && row.specVal));
    assert((await ok('Spec/details', { id: specifications[0].id })).spec.length);
    assert(Array.isArray(await ok('Auth/authMenu')));
    assert(Array.isArray(await ok('Menu/index')));
    assert(Array.isArray((await ok('Auth/getRuleList', { group_id: 1 })).rules));
    assert((await ok('Dictionary/getDictSn', { dictSn: 'GOODS_TYPE' }, { method: 'GET' })).list.length >= 4);
    assert((await ok('Dictionary/getDictSn', { dictSn: 'FILE_URL_PRE' })).list[0].value);
    assert.equal((await ok('BasePrivate/userData')).username, 'admin');
    const appUser = await ok('AppUser/detail', { userId: 1 }, { method: 'GET' });
    assert.equal(appUser.Id, 1);
    assert.equal(typeof appUser.height, 'string');
    assert(appUser.totalRechargeAmount >= 0);
    assert(Array.isArray((await ok('Post/details', { id: 1 })).linkTopic));
    assert(Array.isArray((await ok('Topic/details', { id: 1 })).list.dynamic));
    assert(Array.isArray(await ok('Coin/index')));
    const statistics = await ok('Statistic/detail');
    assert.equal(statistics.totalUser, (await ok('AppUser/index')).count);
    assert.equal(statistics.recharge7d.length, 7);
    assert(statistics.activity.length > 0);
    assert.equal((await api('DoesNotExist/index')).code, 404);
    assert.equal((await api('Product/details', { id: 999999 })).code, 404);
  });

  await t.test('category, specifications and product CRUD validate relationships', async () => {
    const parent = await ok('Category/add', { name: 'HTTP 测试商品类目', parentId: 0 });
    const child = await ok('Category/add', { name: 'HTTP 子类目', parentId: parent.id });
    await ok('Category/edit', { id: child.id, name: '已编辑子类目', parentId: parent.id });
    assert.notEqual((await api('Category/edit', { id: parent.id, name: '循环类目', parentId: child.id })).code, 0);
    const savedSpecs = await ok('Spec/add', { categoryId: child.id, spec: [{ dictionaryId: 1, specVal: [{ val: '红色' }, { val: '蓝色' }] }] });
    assert.equal(savedSpecs.length, 1);
    await ok('Spec/edit', { categoryId: child.id, spec: [{ dictionaryId: 2, specVal: [{ val: '加大号' }] }] });
    const specs = await ok('Spec/getById', { id: child.id });
    assert.equal(specs.length, 1);
    assert.equal(specs[0].spec[0].dictionaryId, 2);
    assert.equal(specs[0].spec[0].specVal[0].val, '加大号');
    const product = await ok('Product/add', { name: 'HTTP 测试商品', categoryId: child.id, classId: '1', itemNumber: 'HTTPPRODUCT001', purPrice: '12', op: '29', img: '/api/assets/product.svg', ProductRule: { RuleType: 3, Coin: '20', Point: '100' }, spec: [{ specId: 2, specVal: ['加大号'] }], sku: [{ attrGroup: '2', remark: '加大号', stock: 33, coin: '20', point: '100', specImg: '/api/assets/product.svg' }] });
    assert.equal(product.stock, 33);
    await ok('Product/edit', { id: product.id, name: 'HTTP 商品编辑结果', categoryId: child.id });
    await ok('Product/changeStatus', { id: product.id, status: 2 });
    const found = await ok('Product/details', { id: product.id });
    assert.equal(found.name, 'HTTP 商品编辑结果');
    assert.equal(found.status, 2);
    assert.equal((await ok('Product/index', { name: 'HTTP 商品编辑结果' })).count, 1);
    assert.notEqual((await api('Category/del', { id: parent.id })).code, 0);
    await ok('Product/del', { id: product.id }, { method: 'GET' });
    assert.equal((await api('Product/details', { id: product.id })).code, 404);
    await ok('Spec/del', { id: specs[0].id });
    assert.equal((await ok('Spec/getById', { id: child.id })).length, 0);
    await ok('Category/del', { id: parent.id });
    assert.equal((await ok('Category/index', { isAll: 1 })).list.some(row => row.id === parent.id), false);
  });

  await t.test('activity and booking edits, publishing and deletion persist', async () => {
    for (const prefix of ['Activity', 'Activity/booking']) {
      const activity = await ok(`${prefix}/add`, { name: 'HTTP 活动', activityType: 2, peopleMax: 20, reward: ['/api/assets/product.svg'], gender: [0, 0] });
      await ok(`${prefix}/edit`, { id: activity.id, name: 'HTTP 活动编辑结果', activityType: 2, peopleMax: 30 });
      await ok(`${prefix}/setOnSale`, { id: activity.id, onSale: 2 });
      let list = await ok(`${prefix}/index`, { name: 'HTTP 活动编辑结果' });
      assert.equal(list.count, 1);
      assert.equal(list.list[0].peopleMax, 30);
      assert.equal(list.list[0].onSale, 2);
      assert(Array.isArray(list.list[0].gender));
      assert(Array.isArray(list.list[0].reward));
      assert.notEqual((await api(`${prefix}/del`, { id: activity.id })).code, 0);
      await ok(`${prefix}/setOnSale`, { id: activity.id, onSale: 1 });
      await ok(`${prefix}/del`, { id: activity.id });
      list = await ok(`${prefix}/index`, { name: 'HTTP 活动编辑结果' });
      assert.equal(list.count, 0);
    }
  });

  await t.test('refund auditing and shipping change real order state', async () => {
    const pending = await ok('GroupOrder/index', { orderStatus: 4, pageSize: 100 });
    assert(pending.list.length >= 2);
    await ok('GroupOrder/refundAudit', { id: pending.list[0].id, action: 1 });
    await ok('GroupOrder/refundAudit', { id: pending.list[1].id, action: 2, reason: '订单已按约定履行' });
    const after = await ok('GroupOrder/index', { pageSize: 100 });
    assert.equal(after.list.find(row => row.id === pending.list[0].id).orderStatus, 3);
    assert.equal(after.list.find(row => row.id === pending.list[1].id).orderStatus, 5);
    assert.notEqual((await api('GroupOrder/refundAudit', { id: pending.list[0].id, action: 1 })).code, 0);
    shippedOrder = (await ok('GroupOrder/goods/index', { orderStatus: 7 })).list[0];
    assert.notEqual((await api('GroupOrder/changeShippingStatus', { id: shippedOrder.id, shippingStatus: 2 })).code, 0);
    await ok('GroupOrder/changeShippingStatus', { id: shippedOrder.id, shippingStatus: 2, shippingSn: 'HTTPTRACK20260001' });
    const shipped = (await ok('GroupOrder/goods/index', { orderStatus: 8, pageSize: 100 })).list.find(row => row.id === shippedOrder.id);
    assert.equal(shipped.shippingSn, 'HTTPTRACK20260001');
    assert.equal(shipped.shippingStatus, 2);
    assert((await ok('GroupOrder/index', { userId: 1, typeList: [1, 2] })).list.every(row => row.userId === 1 && [1, 2].includes(row.type)));
    const recharge = await ok('RechargeOrder/index', { userId: 1, paymentStatus: 2 });
    assert(recharge.list.every(row => row.userId === 1 && row.paymentStatus === 2));
  });

  await t.test('system roles, dictionaries, member management and menu relationships', async () => {
    const role = await ok('Auth/add', { name: 'HTTP 测试权限组', remark: '回归测试', rules: [], status: 1 });
    await ok('Auth/edit', { id: role.id, name: 'HTTP 已编辑权限组' });
    await ok('Auth/editRule', { id: role.id, rules: ['/goods/center'] });
    assert.deepEqual((await ok('Auth/getRuleList', { group_id: role.id })).rules, ['/goods/center']);
    await ok('Auth/changeStatus', { id: role.id, status: 0 });
    await ok('Auth/changeStatus', { id: role.id, status: 1 });
    const member = await ok('User/add', { username: 'http-role-member', nickname: 'HTTP 权限组成员', password: 'member123', group_id: [String(role.id)], status: 1 });
    assert.equal((await ok('Auth/groupUsers', { group_id: role.id })).list[0].id, member.id);
    await ok('Auth/delMember', { uid: member.id, group_id: role.id });
    assert.equal((await ok('Auth/groupUsers', { group_id: role.id })).count, 0);
    await ok('User/changeStatus', { id: member.id, status: 0 });
    await ok('User/del', { id: member.id });
    await ok('Auth/del', { id: role.id });
    assert.notEqual((await api('User/del', { id: 1 })).code, 0);
    assert.notEqual((await api('Auth/changeStatus', { id: 1, status: 0 })).code, 0);
    const dictionary = await ok('Dictionary/add', { dictSn: 'HTTP_TEST', label: 'UTF-8 标签 🛍️', value: '初始值', status: 1 });
    await ok('Dictionary/edit', { id: dictionary.id, value: '修改后的值' });
    assert.equal((await ok('Dictionary/getDictSn', { dictSn: 'HTTP_TEST' })).list[0].value, '修改后的值');
    await ok('Dictionary/del', { id: dictionary.id });
    assert.equal((await ok('Dictionary/getDictSn', { dictSn: 'HTTP_TEST' })).list.length, 0);
    const menu = await ok('Menu/add', { title: 'HTTP 测试菜单', fid: 0, router: '/http-test', component: '', sort: 99 });
    const child = await ok('Menu/add', { title: 'HTTP 子菜单', fid: menu.id, router: '/http-test/child', component: 'goods/list', sort: 100 });
    assert.notEqual((await api('Menu/edit', { id: menu.id, fid: child.id })).code, 0);
    await ok('Menu/edit', { id: child.id, title: 'HTTP 已编辑菜单' });
    assert.equal((await ok('Menu/index')).find(row => row.id === menu.id).children[0].title, 'HTTP 已编辑菜单');
    await ok('Menu/del', { id: menu.id });
    assert.equal((await ok('Menu/index')).some(row => row.id === menu.id), false);
  });

  await t.test('operations edits, linked topic updates and configuration CRUD', async () => {
    const user = await ok('AppUser/detail', { userId: 1 });
    const edited = await ok('AppUser/edit', { Id: user.Id, nickname: 'HTTP 测试用户', height: '175', weight: '65', gender: 1, version: user.version });
    assert.equal(edited.nickname, 'HTTP 测试用户');
    assert.equal((await api('AppUser/edit', { Id: user.Id, nickname: '旧版本', version: user.version })).code, 409);
    assert.equal((await ok('AppUser/ban', { Id: user.Id })).status, 2);
    assert.equal((await ok('AppUser/unban', { Id: user.Id })).status, 1);
    const topic = await ok('Topic/add', { name: 'HTTP 测试话题' });
    const post = await ok('Post/add', { title: 'HTTP 测试动态', content: 'UTF-8 中文与 emoji 🛍️', mediaUrl: '/api/assets/product.svg', mediaType: 1, userId: 1, linkTopic: [topic.name] });
    await ok('Topic/edit', { id: topic.id, name: 'HTTP 已更新话题' });
    assert((await ok('Post/details', { id: post.id })).linkTopic.includes('HTTP 已更新话题'));
    await ok('Post/edit', { id: post.id, title: 'HTTP 动态编辑结果' });
    assert.equal((await ok('Topic/details', { id: topic.id })).list.dynamic[0].title, 'HTTP 动态编辑结果');
    await ok('Post/del', { id: post.id });
    await ok('Topic/del', { id: topic.id });
    persistentTopic = await ok('Topic/add', { name: 'HTTP SQLite 持久化话题 🛍️' });
    const fixtures = [
      ['Advertisement', { name: 'HTTP 广告', description: '测试广告说明', picture: '/api/assets/banner.svg', locationId: 'home_16_9', openType: 1, sortId: 1, status: 1 }, { name: 'HTTP 广告编辑结果' }],
      ['Msg', { name: 'HTTP 消息模板', content: '消息模板正文', type: 2, gayType: '1,2' }, { content: '已修改模板正文' }],
      ['Notification', { templateType: 2, gayType: '1,2', onSale: 1 }, { content: '已修改通知正文' }],
      ['SceneRule', { name: 'HTTP 规则', scene: 1, rule: 1, counts: 5, integral: 3 }, { counts: 6 }],
      ['Coin', { gearName: 'HTTP 充值档位', coinNum: 100, amount: 1, giftRatio: 0 }, { amount: 2 }],
    ];
    for (const [resource, fixture, update] of fixtures) {
      const saved = await ok(`${resource}/add`, fixture);
      const updated = await ok(`${resource}/edit`, { ...fixture, ...update, id: saved.id });
      for (const [key, value] of Object.entries(update)) assert.equal(updated[key], value, `${resource} edit ${key}`);
      if (resource === 'SceneRule') assert.equal(updated.integralMax, 18);
      if (resource === 'Advertisement') {
        assert.equal((await ok(`${resource}/takeOff`, { id: saved.id })).status, 2);
        assert.equal((await ok(`${resource}/putOn`, { id: saved.id })).status, 1);
      }
      if (resource === 'Msg') assert.equal((await ok(`${resource}/changeStatus`, { id: saved.id, status: 2 })).status, 2);
      if (resource === 'Notification') {
        const published = await ok(`${resource}/changeStatus`, { id: saved.id, onSale: 2, gayType: '2' });
        assert.equal(published.inSite, false);
        assert.equal(published.outSite, true);
      }
      await ok(`${resource}/del`, { id: saved.id });
      const list = await ok(`${resource}/index`, { pageSize: 1000 });
      assert.equal((Array.isArray(list) ? list : list.list).some(row => row.id === saved.id), false);
    }
  });

  await t.test('uploads round-trip bytes, old-password sentinel and own-profile capitalized fields', async () => {
    const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1sAAAAASUVORK5CYII=', 'base64');
    const form = new FormData();
    form.set('file', new Blob([bytes], { type: 'image/png' }), 'tiny-test.png');
    const response = await fetch(`${base}/api/BasePrivate/uploadFile`, { method: 'POST', headers: { 'x-token': token }, body: form });
    const result = await response.json();
    assert.equal(result.code, 0, result.msg);
    uploadedPath = result.data.url;
    uploadedBytes = bytes;
    const image = await fetch(`${base}${result.data.url}`);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get('content-type'), 'image/png');
    assert.deepEqual(Buffer.from(await image.arrayBuffer()), bytes);
    const account = await ok('User/add', { username: 'http-user', nickname: 'HTTP 管理员', password: 'preserved123', group_id: ['1'], status: 1 });
    await ok('User/edit', { id: account.id, username: account.username, nickname: 'HTTP 改名管理员', password: 'UsesOldPwd', group_id: ['1'], status: 1 });
    const accountSession = await login('http-user', 'preserved123');
    assert(accountSession.token);
    assert.equal(accountSession.user.passwordHash, undefined);
    const restricted = await ok('User/add', { username: 'http-readonly', nickname: 'HTTP 只读运营', password: 'readonly123', group_id: ['2'], status: 1 });
    const readonlySession = await login(restricted.username, 'readonly123');
    assert.equal((await api('Product/add', { name: '禁止添加' }, { auth: readonlySession.token })).code, 403);
    const current = await ok('BasePrivate/userData');
    assert.notEqual((await api('BasePrivate/userEditData', { NickName: 'HTTP 管理员', Password: 'wrong', NewPasswords: 'updated123', ConfirmYourPassword: 'updated123' })).code, 0);
    assert.notEqual((await api('BasePrivate/userEditData', { NickName: 'HTTP 管理员', Password: adminPassword, NewPasswords: 'updated123', ConfirmYourPassword: 'different' })).code, 0);
    const updated = await ok('BasePrivate/userEditData', { NickName: 'HTTP 持久化管理员', Password: adminPassword, NewPasswords: 'updated123', ConfirmYourPassword: 'updated123' });
    assert.equal(updated.id, current.id);
    assert.equal(updated.nickname, 'HTTP 持久化管理员');
    assert.equal(updated.passwordHash, undefined);
    adminPassword = 'updated123';
    const previousToken = token;
    await ok('User/logout');
    assert.equal((await api('AppUser/index', {}, { auth: previousToken })).code, 14);
    token = (await login()).token;
  });

  await t.test('SQLite reopening preserves edits, passwords, uploads and deleted records', async () => {
    const beforeTopicCount = (await ok('Topic/index')).count;
    await stop();
    await start();
    token = (await login()).token;
    const topic = (await ok('Topic/index', { name: persistentTopic.name })).list[0];
    assert.equal(topic.id, persistentTopic.id);
    assert.equal(topic.name, 'HTTP SQLite 持久化话题 🛍️');
    assert.equal((await ok('Topic/index')).count, beforeTopicCount);
    assert.equal((await ok('Product/center/index')).count, initialProductCount);
    assert.equal((await ok('Category/index', { isAll: 1 })).count, 3);
    const shipment = (await ok('GroupOrder/goods/index', { orderStatus: 8, pageSize: 100 })).list.find(row => row.id === shippedOrder.id);
    assert.equal(shipment.shippingSn, 'HTTPTRACK20260001');
    assert.equal((await ok('AppUser/detail', { userId: 1 })).nickname, 'HTTP 测试用户');
    assert.equal((await ok('BasePrivate/userData')).nickname, 'HTTP 持久化管理员');
    const image = await fetch(`${base}${uploadedPath}`);
    assert.equal(image.status, 200);
    assert.deepEqual(Buffer.from(await image.arrayBuffer()), uploadedBytes);
  });
});
