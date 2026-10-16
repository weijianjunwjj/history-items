import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const dir = await mkdtemp(join(tmpdir(), 'history-items-lab-'))
process.env.LAB_DB = join(dir, 'test.sqlite')
process.env.LAB_NO_LISTEN = '1'
const { server, closeDatabase } = await import('../server.mjs')
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const url = 'http://127.0.0.1:' + server.address().port
after(async () => {
  await new Promise(resolve => server.close(resolve))
  closeDatabase()
  await rm(dir, { recursive: true, force: true, maxRetries: 4, retryDelay: 50 })
})
async function api(path, method = 'GET', body, headers = {}) {
  const response = await fetch(url + path, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) })
  return { status: response.status, headers: response.headers, body: await response.json() }
}
test('本机来源允许开发端口变化，并返回浏览器需要的 CORS 头', async () => {
  const systems = await api('/api/systems')
  const registeredOrigins = systems.body.data.flatMap(system => [system.url, system.url.replace('127.0.0.1', 'localhost')])
  for (const origin of [...registeredOrigins, 'http://localhost', 'http://127.0.0.1', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8004', 'http://127.0.0.1:8005', 'http://localhost:53127', 'http://[::1]:5175', 'https://localhost:3443', new URL(url).origin]) {
    const result = await api('/api/health', 'GET', undefined, { origin })
    assert.equal(result.status, 200, origin)
    assert.equal(result.headers.get('access-control-allow-origin'), origin)
    assert.equal(result.headers.get('vary'), 'Origin')
    const preflight = await fetch(url + '/api/preBook', {
      method: 'OPTIONS', headers: { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' }
    })
    assert.equal(preflight.status, 204, origin)
    assert.equal(await preflight.text(), '')
    assert.equal(preflight.headers.get('access-control-allow-origin'), origin)
    assert.match(preflight.headers.get('access-control-allow-methods'), /POST/)
    assert.equal(preflight.headers.get('access-control-allow-headers'), 'Content-Type')
    assert.equal(preflight.headers.get('access-control-allow-credentials'), null)
  }
})
test('外部、伪造及非 HTTP 来源的请求和预检仍被拒绝', async () => {
  for (const origin of ['', 'https://attacker.example', 'http://localhost.attacker.example:3000', 'http://127.0.0.1.attacker.example', 'http://localhost@attacker.example', 'http://attacker.example@localhost:3000', 'http://192.168.1.20:3000', 'http://0.0.0.0:3000', 'null', 'file://', 'ftp://localhost:3000', 'http://localhost:3000/path', 'http://localhost:3000?x=1', 'http://localhost:3000#x', 'http://localhost:65536', 'http://localhost:3000 http://attacker.example']) {
    for (const method of ['GET', 'OPTIONS', 'POST']) {
      const result = await api('/api/preBook', method, method === 'POST' ? { userName: '拒绝写入', phone: '13000000001', carType: '测试车型' } : undefined, { origin })
      assert.equal(result.status, 403, method + ' ' + origin)
      assert.equal(result.body.msg, '仅允许本机实验台的来源')
      assert.equal(result.headers.get('access-control-allow-origin'), null)
    }
  }
  const records = await api('/api/lab/yadea/records')
  assert.equal(records.body.data.some(x => x.name === '拒绝写入'), false)
})
test('雅迪桌面及移动原表单在变动端口下获取演示码并保存预约', async () => {
  for (const [index, origin] of ['http://localhost:8004', 'http://127.0.0.1:3000'].entries()) {
    const phone = '1300000001' + index
    const headers = { origin }
    const sms = await api('/api/code?phone=' + phone, 'GET', undefined, headers)
    assert.equal(sms.status, 200)
    assert.equal(sms.body.status, 200)
    assert.equal(sms.body.data.delivery, 'local_only')
    assert.match(sms.body.data.demoCode, /^\d{6}$/)
    const payload = { userName: '原预约页面', userSex: '男士', province: '江苏省', city: '无锡市', coutry: '中国', userAddress: '测试街道', carType: '测试车型', carSeries: '测试车型', phone, code: sms.body.data.demoCode }
    assert.equal((await api('/api/preBook', 'POST', { ...payload, code: '000000' }, headers)).status, 400)
    const saved = await api('/api/preBook', 'POST', payload, headers)
    assert.equal(saved.status, 201)
    assert.equal(saved.body.status, 200)
    const list = await api('/api/lab/yadea/records', 'GET', undefined, headers)
    assert.ok(list.body.data.some(x => x.id === saved.body.data.id && x.model === payload.carType))
    assert.equal((await api('/api/preBook', 'POST', payload, headers)).status, 400)
    assert.equal((await api('/api/not-implemented', 'GET', undefined, headers)).status, 404)
  }
})
test('system registry and health are backed by a live local server', async () => {
  const health = await api('/api/health')
  assert.equal(health.status, 200)
  assert.equal(health.body.data.database, 'sqlite')
  const systems = await api('/api/systems')
  assert.equal(systems.body.data.length, 5)
})
test('yadea appointment persists through real HTTP', async () => {
  const payload = { name: '演示用户', phone: '13000000000', model: '测试车型' }
  const created = await api('/api/preBook', 'POST', payload)
  assert.equal(created.status, 201)
  assert.ok(created.body.data.id)
  const list = await api('/api/lab/yadea/records')
  assert.ok(list.body.data.some(x => x.id === created.body.data.id))
  const sms = await api('/api/code?phone=13000000000')
  assert.equal(sms.body.data.delivery, 'local_only')
  assert.match(sms.body.data.demoCode, /^\d{6}$/)
  const legacy = await api('/api/preBook', 'POST', { userName: '传统页面用户', phone: '13000000000', carType: '演示车型', code: sms.body.data.demoCode })
  assert.equal(legacy.status, 201)
  assert.equal(legacy.body.status, 200)
  const invalid = await api('/api/preBook', 'POST', { userName: '重复使用验证码', phone: '13000000000', carType: '演示车型', code: sms.body.data.demoCode })
  assert.equal(invalid.status, 400)
})
test('after-sales ticket must be assigned before close and cannot be closed twice', async () => {
  const created = await api('/qrcode/work-ticket/add', 'POST', { deviceSn: 'TEST-01', ticketContent: '设备不启动', ticketType: 'DEVICE_FAULT' })
  assert.equal(created.status, 201)
  const id = created.body.data.id
  const premature = await api('/qrcode/work-ticket/close', 'POST', { id, ticketResultContent: '完成' })
  assert.equal(premature.status, 409)
  const assigned = await api('/qrcode/work-ticket/dispatch', 'POST', { id, engineerId: 'E001' })
  assert.equal(assigned.body.data.ticketState, 2)
  const closed = await api('/qrcode/work-ticket/close', 'POST', { id, ticketResultContent: '本地维修完成' })
  assert.equal(closed.body.data.ticketState, 3)
  const double = await api('/qrcode/work-ticket/close', 'POST', { id, ticketResultContent: '重复' })
  assert.equal(double.status, 409)
  const get = await api('/qrcode/work-ticket/get/' + id)
  assert.equal(get.body.data.ticketResultContent, '本地维修完成')
})
test('EMS shipment unique tracking number and status update', async () => {
  const create = await api('/api/ems/shipments', 'POST', { trackingNo: 'TEST-EMS-01', recipient: '本地测试' })
  assert.equal(create.status, 201)
  const duplicate = await api('/api/ems/shipments', 'POST', { trackingNo: 'TEST-EMS-01', recipient: '重复测试' })
  assert.equal(duplicate.status, 409)
  const changed = await api('/api/ems/shipments/' + create.body.data.id, 'PATCH', { status: '已签收' })
  assert.equal(changed.body.data.status, '已签收')
  const list = await api('/api/lab/ems/records')
  assert.equal(list.body.data.find(x => x.id === create.body.data.id).status, '已签收')
})
test('unimplemented endpoints fail visibly, and malformed inputs are rejected', async () => {
  assert.equal((await api('/api/anything')).status, 404)
  assert.equal((await api('/api/lab/yadea/records', 'POST', { name: '' })).status, 400)
  assert.equal((await api('/api/systems', 'GET', undefined, { origin: 'https://attacker.example' })).status, 403)
})
test('index and ESM entry are actually served', async () => {
  const index = await fetch(url + '/')
  assert.equal(index.status, 200)
  assert.match(await index.text(), /微前端实验台/)
  const esm = await fetch(url + '/microapps.mjs')
  assert.equal(esm.status, 200)
  assert.match(await esm.text(), /function unmount/)
})
