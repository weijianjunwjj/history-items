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
  return { status: response.status, body: await response.json() }
}
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
  const sms = await api('/api/code')
  assert.equal(sms.body.data.delivery, 'not_sent')
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
