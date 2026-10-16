const style = `
  .mini{font:14px/1.5 system-ui,"Microsoft Yahei",sans-serif;padding:25px;color:#e9f0ff;background:#141e32;min-height:62vh}
  .mini h3{font-size:19px;margin:0 0 8px}.mini p{color:#a4b7d4}
  .mini a{color:#9eb9ff}.mini button{cursor:pointer;background:#5a77ea;border:0;color:white;border-radius:7px;padding:9px 15px}
  .mini form{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.mini input{min-width:165px;flex:1;background:#0c1628;color:white;border:1px solid #445575;border-radius:7px;padding:10px}
  .mini table{border-collapse:collapse;width:100%;margin-top:15px}.mini td,.mini th{padding:10px;border-bottom:1px solid #354560;text-align:left;overflow-wrap:anywhere}
  .mini th{color:#a9b8d2}.mini .err{color:#ff9f9f}.mini .good{color:#9de2bb}.mini small{color:#a0b1cb}
  .mini .actions{display:flex;gap:7px;flex-wrap:wrap}.mini .actions button{font-size:12px;padding:5px 7px}
`;
const schemas = {
  yadea: { title: '骑行预约', fields: [['name', '客户姓名'], ['phone', '手机号码'], ['model', '意向车型']], keys: ['id', 'name', 'model', 'phone', 'createdAt'] },
  aftersales: { title: '售后工单', fields: [['deviceSn', '设备序列号'], ['ticketContent', '问题描述'], ['ticketType', '故障类型 DEVICE_FAULT']], keys: ['id', 'deviceSn', 'ticketContent', 'ticketState', 'engineerId'] },
  ems: { title: '物流运单', fields: [['trackingNo', '运单编号'], ['recipient', '收件人']], keys: ['id', 'trackingNo', 'recipient', 'status', 'updatedAt'] }
}
function el(tag, cls, text) {
  const node = document.createElement(tag)
  if (cls) node.className = cls
  if (text !== undefined) node.textContent = String(text)
  return node
}
function createPanel(target, system) {
  const ctrl = new AbortController()
  const wrap = el('section', 'mini')
  const h = el('h3', null, system.name)
  const p = el('p', null, '本面板与完整原项目相互独立，用于验证宿主挂载模式、HTTP 调用、持久化、状态更新。')
  const link = el('a', null, '打开原系统 →')
  link.href = system.url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  const status = el('p', null, '读取服务中……')
  const content = el('div')
  wrap.append(h, p, link, status, content)
  target.append(wrap)
  let disposed = false
  const schema = schemas[system.id]
  if (!schema) {
    status.className = 'good'
    status.textContent = '此项目已有独立的真实后端，不在实验台复制接口。请在新窗口启动并使用原应用；游戏监控内部已有原生 ESM 微应用。'
    return () => { disposed = true; ctrl.abort(); wrap.remove() }
  }
  const form = el('form')
  const inputs = {}
  for (const [key, label] of schema.fields) {
    const input = el('input')
    input.name = key
    input.placeholder = label
    input.required = true
    input.maxLength = key === 'ticketContent' ? 2000 : 200
    if (key === 'ticketType') input.value = 'DEVICE_FAULT'
    inputs[key] = input
    form.append(input)
  }
  const submit = el('button', null, '创建' + schema.title)
  submit.type = 'submit'
  form.append(submit)
  const table = el('table')
  content.append(form, table)
  async function jsonFetch(url, options) {
    const response = await fetch(url, { signal: ctrl.signal, ...options })
    const payload = await response.json()
    if (!response.ok || payload.code !== 0) throw new Error(payload.msg || '请求失败')
    return payload.data
  }
  async function mutate(url, body, method = 'POST') {
    return jsonFetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  }
  async function load() {
    const rows = await jsonFetch('/api/lab/' + system.id + '/records')
    if (disposed) return
    table.replaceChildren()
    const head = el('tr')
    for (const key of schema.keys) head.append(el('th', null, key))
    head.append(el('th', null, '操作'))
    table.append(head)
    for (const item of rows) {
      const tr = el('tr')
      for (const key of schema.keys) tr.append(el('td', null, item[key] ?? '—'))
      const buttons = el('td', 'actions')
      if (system.id === 'aftersales' && item.ticketState === 1) {
        const b = el('button', null, '派发')
        b.onclick = async () => { await attempt(() => mutate('/qrcode/work-ticket/dispatch', { id: item.id, engineerId: 'E-DEMO-01' })) }
        buttons.append(b)
      }
      if (system.id === 'aftersales' && item.ticketState === 2) {
        const b = el('button', null, '关闭')
        b.onclick = async () => { await attempt(() => mutate('/qrcode/work-ticket/close', { id: item.id, ticketResultContent: '本地演示已解决' })) }
        buttons.append(b)
      }
      if (system.id === 'ems' && item.status === '待揽收') {
        const b = el('button', null, '设为运输中')
        b.onclick = async () => { await attempt(() => mutate('/api/ems/shipments/' + encodeURIComponent(item.id), { status: '运输中' }, 'PATCH')) }
        buttons.append(b)
      }
      tr.append(buttons)
      table.append(tr)
    }
    status.className = 'good'
    status.textContent = '真实 HTTP → SQLite 查询成功，共 ' + rows.length + ' 条记录。可以新增后刷新页面，验证持久化。'
  }
  async function attempt(action) {
    try {
      await action()
      if (!disposed) await load()
    } catch (e) {
      if (e.name !== 'AbortError' && !disposed) {
        status.className = 'err'
        status.textContent = '请求失败：' + e.message
      }
    }
  }
  form.addEventListener('submit', async ev => {
    ev.preventDefault()
    const data = {}
    for (const [key] of schema.fields) data[key] = inputs[key].value.trim()
    await attempt(() => mutate('/api/lab/' + system.id + '/records', data))
    form.reset()
    if (inputs.ticketType) inputs.ticketType.value = 'DEVICE_FAULT'
  })
  attempt(load)
  return () => { disposed = true; ctrl.abort(); wrap.remove() }
}
let activeDispose = async () => {}
export async function bootstrap() { return undefined }
export async function mount({ element, system }) {
  await activeDispose()
  activeDispose = createPanel(element, system)
}
export async function unmount() {
  await activeDispose()
  activeDispose = async () => {}
}
export function defineMicroElement() {
  if (customElements.get('lab-micro-panel')) return
  customElements.define('lab-micro-panel', class extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' })
      const sheet = el('style', null, style)
      shadow.append(sheet)
      this.dispose = createPanel(shadow, this.system)
    }
    disconnectedCallback() { this.dispose?.() }
  })
}
