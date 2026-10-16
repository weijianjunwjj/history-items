import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('本地跨域预约和一次性验证码在服务重启后保持 SQLite 状态', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'history-items-restart-'))
  const children = []
  const origin = 'http://localhost:8004'
  async function start() {
    const child = spawn(process.execPath, ['--input-type=module', '-e', `
      import { server, closeDatabase } from ${JSON.stringify(new URL('../server.mjs', import.meta.url).href)};
      server.listen(0, '127.0.0.1', () => process.send(server.address().port));
      process.on('message', () => server.close(() => { closeDatabase(); process.disconnect(); }));
    `], { env: { ...process.env, LAB_DB: join(dir, 'restart.sqlite'), LAB_NO_LISTEN: '1' }, stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })
    children.push(child)
    let stderr = ''
    child.stderr.on('data', chunk => { stderr += chunk })
    const port = await Promise.race([
      once(child, 'message').then(([port]) => port),
      once(child, 'exit').then(([code]) => { throw new Error('后端启动失败 ' + code + ': ' + stderr) })
    ])
    return {
      async api(path, body) {
        const response = await fetch('http://127.0.0.1:' + port + path, {
          method: body ? 'POST' : 'GET', headers: { origin, ...(body ? { 'content-type': 'application/json' } : {}) },
          ...(body ? { body: JSON.stringify(body) } : {})
        })
        return { status: response.status, body: await response.json() }
      },
      async stop() {
        const exited = once(child, 'exit')
        child.send('close')
        const [code] = await exited
        assert.equal(code, 0, stderr)
      }
    }
  }
  try {
    const first = await start()
    const phone = '13000000022'
    const sms = await first.api('/api/code?phone=' + phone)
    assert.equal(sms.status, 200)
    const payload = { userName: '重启验证', phone, carType: '测试车型', code: sms.body.data.demoCode }
    // 未使用的验证码也应落盘，重启后原页面仍能提交。
    await first.stop()
    const second = await start()
    const created = await second.api('/api/preBook', payload)
    assert.equal(created.status, 201)
    await second.stop()
    const third = await start()
    const list = await third.api('/api/lab/yadea/records')
    assert.ok(list.body.data.some(x => x.id === created.body.data.id && x.phone === phone))
    assert.equal((await third.api('/api/preBook', payload)).status, 400)
    await third.stop()
  } finally {
    await Promise.all(children.filter(child => child.exitCode === null).map(async child => {
      const exited = once(child, 'exit')
      child.kill()
      await exited
    }))
    await rm(dir, { recursive: true, force: true, maxRetries: 4, retryDelay: 50 })
  }
})
