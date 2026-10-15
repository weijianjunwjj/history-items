import http from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.mjs';
import { fail } from './helpers.mjs';
import { seedSystem, handleSystem, publicUser, verifyPassword, getAccess } from './system.mjs';
import { seedCommerce, handleCommerce } from './commerce.mjs';
import { seedOperations, handleOperations } from './operations.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json' };

function illustration(name) {
  if (name === 'avatar') return '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#e0e7ff"/><circle cx="80" cy="60" r="27" fill="#6366f1"/><path d="M25 145c0-55 110-55 110 0" fill="#6366f1"/></svg>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${name === 'poster' ? 960 : 400}" viewBox="0 0 640 400"><defs><linearGradient id="bg"><stop stop-color="#165dff"/><stop offset="1" stop-color="#30c7b5"/></linearGradient></defs><rect width="640" height="400" rx="24" fill="url(#bg)"/><circle cx="510" cy="90" r="130" fill="#fff" opacity=".12"/><path d="M245 115h150l20 155H225z" fill="#fff" opacity=".9"/><path d="M278 120v-20a42 42 0 0 1 84 0v20" stroke="#fff" stroke-width="12" fill="none"/><text x="320" y="335" text-anchor="middle" font-family="Arial" font-size="38" fill="white">LiveShop</text><text x="320" y="375" text-anchor="middle" font-family="sans-serif" font-size="18" fill="white">本地演示数据</text></svg>`;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20 * 1024 * 1024) fail('请求超过 20 MB 限制');
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    const form = await new Request('http://localhost', { method: 'POST', headers: { 'content-type': contentType }, body: buffer }).formData();
    return Object.fromEntries(form.entries());
  }
  if (!buffer.length) return {};
  if (contentType.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(buffer.toString('utf8')));
  try { return JSON.parse(buffer.toString('utf8')); } catch { fail('请求 JSON 格式不正确'); }
}

function send(res, data, code = 0, msg = '操作成功') {
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify({ code, data, msg }));
}

function isMutation(path) {
  return /\/(add|edit|del|deleteByIds|changeStatus|setOnSale|putOn|takeOff|ban|unban|refundAudit|changeShippingStatus|editRule|delMember|userEditData|uploadFile)$/.test(path);
}

function canAccess(path, access) {
  if (access.includes('*')) return true;
  if (['BasePrivate/userData', 'BasePrivate/userEditData', 'BasePrivate/uploadFile', 'Dictionary/getDictSn', 'Auth/authMenu'].includes(path)) return true;
  const routes = {
    User: ['/system/user'], Auth: ['/system/auth'], Menu: ['/system/menu'], Log: ['/system/log'], Dictionary: ['/system/dictionary'],
    Category: ['/goods/category'], Spec: ['/goods/specs'], Product: ['/goods/center', '/goods/list'],
    Activity: ['/activity/reserved', '/activity/group', '/activity/crowd'],
    GroupOrder: ['/order/product', '/order/group', '/order/crowd'], RechargeOrder: ['/order/recharge', '/operate/user'],
    AppUser: ['/operate/user'], IntegralRecord: ['/operate/user'], Advertisement: ['/operate/poster'],
    Statistic: ['/operate/data-graph'], Msg: ['/operate/message/template'], Notification: ['/operate/message/inform'],
    Topic: ['/community/topic'], Post: ['/community/updates'], SceneRule: ['/promotion/rule-engine'], Coin: ['/promotion/recharge'],
  };
  let allowed = routes[path.split('/')[0]] || [];
  if (!isMutation(path)) {
    if (path.startsWith('Category/') || path.startsWith('Spec/')) allowed = [...allowed, '/goods/center', '/goods/list'];
    if (path.startsWith('Auth/')) allowed = [...allowed, '/system/user'];
    if (path.startsWith('GroupOrder/') || path.startsWith('Post/')) allowed = [...allowed, '/operate/user'];
    if (path.startsWith('Topic/')) allowed = [...allowed, '/community/updates'];
  }
  return allowed.some(route => access.includes(route));
}

export function createApp(options = {}) {
  const dataDirectory = resolve(options.dataDirectory || process.env.DATA_DIR || join(projectRoot, 'server', 'data'));
  const store = createStore(options.database || join(dataDirectory, 'liveshop.sqlite'));
  if (!store.db.prepare("SELECT value FROM metadata WHERE key='initialized'").get()) {
    store.db.exec('BEGIN');
    try {
      seedSystem(store);
      seedCommerce(store);
      seedOperations(store);
      store.db.prepare('INSERT INTO metadata VALUES (?,?)').run('initialized', '1');
      store.db.exec('COMMIT');
    } catch (error) { store.db.exec('ROLLBACK'); store.close(); throw error; }
  }
  const captchas = new Map();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
      const path = decodeURIComponent(url.pathname).replace(/^\/api\/?/, '').replace(/^\/+|\/+$/g, '');
      if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
      if (url.pathname.startsWith('/api/assets/')) {
        res.writeHead(200, { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' });
        res.end(illustration(path.split('/').pop().replace('.svg', ''))); return;
      }
      if (url.pathname.startsWith('/api/uploads/')) {
        const filename = path.slice('uploads/'.length);
        if (!/^[\da-f-]+\.(png|jpe?g|gif|webp|mp4|webm|avi)$/i.test(filename)) { res.writeHead(404); res.end(); return; }
        const file = join(dataDirectory, 'uploads', filename);
        if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'x-content-type-options': 'nosniff' });
        res.end(await readFile(file)); return;
      }
      if (!url.pathname.startsWith('/api/')) {
        const dist = join(projectRoot, 'dist');
        const target = resolve(dist, `.${url.pathname}`);
        if (!target.startsWith(dist + sep) && target !== dist) { res.writeHead(404); res.end(); return; }
        const file = existsSync(target) && extname(target) ? target : join(dist, 'index.html');
        if (!existsSync(file)) { res.writeHead(404); res.end('请先运行 npm run build，或使用 npm run dev'); return; }
        res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' });
        res.end(await readFile(file)); return;
      }
      if (path === 'health') { send(res, { status: 'ok', database: 'SQLite', mode: 'local', collections: store.db.prepare('SELECT collection,COUNT(*) AS count FROM records GROUP BY collection').all() }); return; }
      const body = await readBody(req);
      const query = Object.fromEntries(url.searchParams);
      if (path === 'Base/captcha') {
        for (const [id, expires] of captchas) if (expires < Date.now()) captchas.delete(id);
        const captchaId = randomUUID();
        captchas.set(captchaId, Date.now() + 5 * 60 * 1000);
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><rect width="160" height="48" rx="6" fill="#eef4ff"/><text x="80" y="34" text-anchor="middle" font-family="monospace" font-size="32" letter-spacing="9" fill="#165dff">1234</text></svg>';
        send(res, { captchaId, picPath: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` }); return;
      }
      if (path === 'Base/login') {
        const expiry = captchas.get(body.captchaId);
        captchas.delete(body.captchaId);
        if (!expiry || expiry < Date.now() || String(body.captcha) !== '1234') fail('验证码错误或已过期');
        const user = store.list('admins').find(row => row.username === body.username);
        if (!user || user.status !== 1 || !verifyPassword(body.password, user.passwordHash)) fail('账号或密码错误');
        const token = randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        store.db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());
        store.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(token, String(user.id), expiresAt);
        const data = user.userData?.[0] || {};
        const updated = store.save('admins', { ...user, userData: [{ last_login_ip: req.socket.remoteAddress, last_login_time: new Date().toISOString(), login_times: (data.login_times || 0) + 1 }] });
        send(res, { token, expiresAt, access: getAccess(store, updated), user: publicUser(updated) }); return;
      }
      const token = req.headers['x-token'] || '';
      const session = store.db.prepare('SELECT uid FROM sessions WHERE token=? AND expires>?').get(String(token), Date.now());
      const user = session && store.get('admins', session.uid);
      if (!user || user.status !== 1) { send(res, null, 14, '请先登录'); return; }
      if (path === 'User/logout') {
        store.db.prepare('DELETE FROM sessions WHERE token=?').run(String(token));
        send(res, null); return;
      }
      const access = getAccess(store, user);
      if (!canAccess(path, access)) fail('当前账号没有操作权限', 403);
      if (path === 'BasePrivate/uploadFile') {
        const file = body.file;
        if (!file || typeof file.arrayBuffer !== 'function') fail('请选择上传文件');
        const extension = extname(file.name).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.avi'].includes(extension)) fail('仅支持常用图片或视频文件');
        const directory = join(dataDirectory, 'uploads');
        await mkdir(directory, { recursive: true });
        const filename = `${randomUUID()}${extension}`;
        await writeFile(join(directory, filename), Buffer.from(await file.arrayBuffer()));
        send(res, { file_name: `uploads/${filename}`, url: `/api/uploads/${filename}`, name: file.name }); return;
      }
      const ctx = { path, method: req.method, query, body, store, user, origin: url.origin };
      let result;
      for (const handler of [handleSystem, handleCommerce, handleOperations]) {
        result = await handler(ctx);
        if (result !== undefined) break;
      }
      if (result === undefined) { send(res, null, 404, `接口尚未实现：${path}`); return; }
      if (isMutation(path) && !path.startsWith('Log/')) store.save('logs', { actionName: path, uid: user.id, nickName: user.nickname, url: `/api/${path}`, addTime: Math.floor(Date.now() / 1000), data: JSON.stringify({ id: body.id ?? query.id, resultId: result?.id }) });
      send(res, result);
    } catch (error) {
      if (!error.apiCode && !error.code && !error.statusCode) console.error(error);
      if (!res.headersSent) send(res, null, error.apiCode || error.code || error.statusCode || 1, error.message || '服务器错误');
      else res.end();
    }
  });
  return { server, store, dataDirectory };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { server, store } = createApp();
  const port = Number(process.env.API_PORT || 8787);
  server.listen(port, '127.0.0.1', () => console.log(`LiveShop 本地后端：http://127.0.0.1:${port} | SQLite 数据持久化已启用`));
  const stop = () => server.close(() => { store.close(); process.exit(0); });
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
