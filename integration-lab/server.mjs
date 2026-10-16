import http from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID, randomInt } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

const root = dirname(fileURLToPath(import.meta.url))
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 4300)
const dbFile = process.env.LAB_DB || join(root, 'data', 'lab.sqlite')
await mkdir(dirname(dbFile), { recursive: true })
const db = new DatabaseSync(dbFile)
db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;')
db.exec('CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, model TEXT NOT NULL, created_at TEXT NOT NULL)')
db.exec('CREATE TABLE IF NOT EXISTS demo_codes (phone TEXT PRIMARY KEY, code TEXT NOT NULL, expires_at INTEGER NOT NULL)')
db.exec('CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, device_sn TEXT NOT NULL, ticket_content TEXT NOT NULL, ticket_type TEXT NOT NULL, engineer_id TEXT, ticket_state INTEGER NOT NULL DEFAULT 1, ticket_result_content TEXT, created_at TEXT NOT NULL)')
db.exec('CREATE TABLE IF NOT EXISTS shipments (id TEXT PRIMARY KEY, tracking_no TEXT NOT NULL UNIQUE, recipient TEXT NOT NULL, status TEXT NOT NULL, updated_at TEXT NOT NULL)')
if (!db.prepare('SELECT 1 FROM tickets LIMIT 1').get()) {
  db.prepare('INSERT INTO tickets (id, device_sn, ticket_content, ticket_type, ticket_state, created_at) VALUES (?, ?, ?, ?, ?, ?)').run('T-1001', 'DEV-DEMO-001', '设备开机后无响应（演示）', 'DEVICE_FAULT', 1, new Date().toISOString())
}
if (!db.prepare('SELECT 1 FROM shipments LIMIT 1').get()) {
  db.prepare('INSERT INTO shipments (id, tracking_no, recipient, status, updated_at) VALUES (?, ?, ?, ?, ?)').run('S-1001', 'YT-DEMO-001', '演示收件人', '运输中', new Date().toISOString())
}

const systems = [
  { id: 'liveshop', name: 'LiveShop 海外社交电商', url: 'http://127.0.0.1:5173', port: 5173, backend: '独立 Node + SQLite', note: '原项目已有完整本地后台 API，不由本实验台替代' },
  { id: 'yadea', name: '雅迪电动车品牌官网', url: 'http://127.0.0.1:8003', port: 8003, backend: '本实验台：预约骑行接口', note: '生产短信和预约服务未接入' },
  { id: 'game', name: '游戏行为分析与 SDK 异常监控', url: 'http://127.0.0.1:4173', port: 4173, backend: '独立 Node + SQLite', note: '原项目内部已有六个 ESM 微应用' },
  { id: 'aftersales', name: '码上售后 App 与设备物联', url: 'http://127.0.0.1:8888', port: 8888, backend: '本实验台：售后工单接口', note: '真实 IoT、视频通话、外部登录尚不可用' },
  { id: 'ems', name: '中邮通管理后台与微信小程序', url: 'http://127.0.0.1:5174', port: 5174, backend: '本实验台：物流单接口', note: '当前仓库 ems-backend 缺少 src，完整后台无法直接启动' }
]
const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
  res.end(JSON.stringify(body))
}
const ok = (res, data, status = 200) => json(res, status, { code: 0, msg: 'ok', data })
const error = (res, status, message) => json(res, status, { code: status, msg: message, data: null })
const required = (body, key, max = 200) => {
  const value = body[key]
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(key + ' 必须是非空字符串（不超过 ' + max + ' 字）')
  return value.trim()
}
async function bodyOf(req) {
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw new Error('仅支持 application/json')
  let raw = ''
  for await (const chunk of req) {
    raw += chunk.toString('utf8')
    if (raw.length > 1024 * 1024) throw new Error('请求体不得超过 1 MB')
  }
  const body = JSON.parse(raw || '{}')
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('需要 JSON 对象')
  return body
}
const rows = (table) => {
  if (table === 'yadea') return db.prepare('SELECT id, name, phone, model, created_at AS createdAt FROM bookings ORDER BY created_at DESC').all()
  if (table === 'aftersales') return db.prepare('SELECT id, device_sn AS deviceSn, ticket_content AS ticketContent, ticket_type AS ticketType, engineer_id AS engineerId, ticket_state AS ticketState, ticket_result_content AS ticketResultContent, created_at AS createTime FROM tickets ORDER BY created_at DESC').all()
  if (table === 'ems') return db.prepare('SELECT id, tracking_no AS trackingNo, recipient, status, updated_at AS updatedAt FROM shipments ORDER BY updated_at DESC').all()
  return null
}
function createBooking(b) {
  const item = { id: randomUUID(), name: required({ name: b.name ?? b.userName }, 'name'), phone: required(b, 'phone', 30), model: required({ model: b.model ?? b.carType }, 'model'), createdAt: new Date().toISOString() }
  db.prepare('INSERT INTO bookings VALUES (?, ?, ?, ?, ?)').run(item.id, item.name, item.phone, item.model, item.createdAt)
  return item
}
function createTicket(b) {
  const item = { id: randomUUID(), deviceSn: required(b, 'deviceSn'), ticketContent: required(b, 'ticketContent', 2000), ticketType: typeof b.ticketType === 'string' ? b.ticketType : 'DEVICE_FAULT', engineerId: null, ticketState: 1, ticketResultContent: null, createTime: new Date().toISOString() }
  db.prepare('INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(item.id, item.deviceSn, item.ticketContent, item.ticketType, null, 1, null, item.createTime)
  return item
}
function createShipment(b) {
  const item = { id: randomUUID(), trackingNo: required(b, 'trackingNo'), recipient: required(b, 'recipient'), status: '待揽收', updatedAt: new Date().toISOString() }
  db.prepare('INSERT INTO shipments VALUES (?, ?, ?, ?, ?)').run(item.id, item.trackingNo, item.recipient, item.status, item.updatedAt)
  return item
}
function updateTicket(b, state) {
  const id = required(b, 'id')
  const old = db.prepare('SELECT ticket_state FROM tickets WHERE id = ?').get(id)
  if (!old) return { missing: true }
  if (old.ticket_state === 3) return { conflict: true }
  if (state === 2 && old.ticket_state !== 1) return { conflict: true }
  if (state === 3 && old.ticket_state === 1) return { conflict: true }
  if (state === 2) db.prepare('UPDATE tickets SET ticket_state = 2, engineer_id = ? WHERE id = ?').run(required(b, 'engineerId'), id)
  else db.prepare('UPDATE tickets SET ticket_state = 3, ticket_result_content = ? WHERE id = ?').run(required(b, 'ticketResultContent'), id)
  return { id, ticketState: state }
}
function isLocalOrigin(origin) {
  try {
    const url = new URL(origin)
    // 浏览器 Origin 必须是完整、规范的 HTTP(S) 来源；仅放行回环主机，端口可随开发服务变化。
    return url.origin === origin &&
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
      !url.username && !url.password
  } catch {
    return false
  }
}
const publicFiles = { '/': ['index.html', 'text/html; charset=utf-8'], '/index.html': ['index.html', 'text/html; charset=utf-8'], '/microapps.mjs': ['microapps.mjs', 'text/javascript; charset=utf-8'] }
export const closeDatabase = () => db.close()
export const server = http.createServer(async (req, res) => {
  try {
    const origin = req.headers.origin
    if (origin !== undefined && !isLocalOrigin(origin)) return error(res, 403, '仅允许本机实验台的来源')
    if (origin) res.setHeader('access-control-allow-origin', origin)
    res.setHeader('vary', 'Origin')
    res.setHeader('access-control-allow-methods', 'GET, POST, PATCH, OPTIONS')
    res.setHeader('access-control-allow-headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.writeHead(204).end()
    const url = new URL(req.url, 'http://localhost')
    const path = url.pathname
    if (req.method === 'GET' && publicFiles[path]) {
      const [file, mime] = publicFiles[path]
      const content = await readFile(join(root, 'public', file))
      res.writeHead(200, { 'content-type': mime, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' })
      return res.end(content)
    }
    if (req.method === 'GET' && path === '/api/health') return ok(res, { status: 'ok', database: 'sqlite', systems: systems.length })
    if (req.method === 'GET' && path === '/api/systems') return ok(res, systems)
    const match = path.match(/^\/api\/lab\/(yadea|aftersales|ems)\/records$/)
    if (match && req.method === 'GET') return ok(res, rows(match[1]))
    if (match && req.method === 'POST') {
      const body = await bodyOf(req)
      try {
        return ok(res, match[1] === 'yadea' ? createBooking(body) : match[1] === 'aftersales' ? createTicket(body) : createShipment(body), 201)
      } catch (err) {
        if (String(err.message).includes('UNIQUE')) return error(res, 409, '运单号已存在')
        throw err
      }
    }
    if (req.method === 'GET' && path === '/qrcode/work-ticket/list') return ok(res, { items: rows('aftersales'), total: rows('aftersales').length })
    if (req.method === 'GET' && path === '/qrcode/work-ticket/types') return ok(res, { DEVICE_DOUBT: '设备疑问', DEVICE_FAULT: '设备故障' })
    if (req.method === 'GET' && /^\/qrcode\/work-ticket\/get\/[^/]+$/.test(path)) {
      const item = rows('aftersales').find(x => x.id === decodeURIComponent(path.split('/').pop()))
      return item ? ok(res, item) : error(res, 404, '未找到工单')
    }
    if (req.method === 'POST' && path === '/qrcode/work-ticket/add') return ok(res, createTicket(await bodyOf(req)), 201)
    if (req.method === 'POST' && ['/qrcode/work-ticket/dispatch', '/qrcode/work-ticket/close'].includes(path)) {
      const result = updateTicket(await bodyOf(req), path.endsWith('/dispatch') ? 2 : 3)
      return result.missing ? error(res, 404, '未找到工单') : result.conflict ? error(res, 409, '工单状态不允许此操作') : ok(res, result)
    }
    if (req.method === 'GET' && path === '/api/ems/shipments') return ok(res, rows('ems'))
    if (req.method === 'POST' && path === '/api/ems/shipments') return ok(res, createShipment(await bodyOf(req)), 201)
    if (req.method === 'PATCH' && /^\/api\/ems\/shipments\/[^/]+$/.test(path)) {
      const id = decodeURIComponent(path.split('/').pop())
      const status = required(await bodyOf(req), 'status')
      const changes = db.prepare('UPDATE shipments SET status=?, updated_at=? WHERE id=?').run(status, new Date().toISOString(), id)
      return changes.changes ? ok(res, { id, status }) : error(res, 404, '运单不存在')
    }
    if (req.method === 'GET' && path === '/api/code') {
      const phone = required({ phone: url.searchParams.get('phone') }, 'phone', 30)
      const code = String(randomInt(100000, 1000000))
      db.prepare('INSERT INTO demo_codes (phone, code, expires_at) VALUES (?, ?, ?) ON CONFLICT(phone) DO UPDATE SET code=excluded.code, expires_at=excluded.expires_at').run(phone, code, Date.now() + 600000)
      return json(res, 200, { status: 200, code: 0, msg: '本地演示码仅返回页面，不发送短信', data: { delivery: 'local_only', demoCode: code } })
    }
    if (req.method === 'POST' && path === '/api/preBook') {
      const body = await bodyOf(req)
      if (body.code !== undefined) {
        const phone = required(body, 'phone', 30)
        const row = db.prepare('SELECT code, expires_at FROM demo_codes WHERE phone=?').get(phone)
        if (!row || row.code !== String(body.code) || row.expires_at < Date.now()) return error(res, 400, '验证码不正确或已过期（仅本地演示）')
      }
      const booking = createBooking(body)
      if (body.code !== undefined) db.prepare('DELETE FROM demo_codes WHERE phone=?').run(body.phone)
      return json(res, 201, { status: 200, code: 0, msg: '本地预约保存成功', data: booking })
    }
    return error(res, 404, '未实现该接口：' + req.method + ' ' + path)
  } catch (err) {
    if (err instanceof SyntaxError || /必须|仅支持|不得|需要 JSON/.test(String(err.message))) return error(res, 400, err.message)
    if (String(err.message).includes('UNIQUE')) return error(res, 409, '唯一键冲突')
    console.error('[lab]', err)
    return error(res, 500, '服务内部错误')
  }
})
if (process.env.LAB_NO_LISTEN !== '1') server.listen(port, host, () => console.log('集成实验台 http://' + host + ':' + port))
