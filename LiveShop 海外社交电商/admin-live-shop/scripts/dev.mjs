import { spawn } from 'node:child_process';
import { createApp } from '../server/index.mjs';

const { server, store } = createApp();
const port = Number(process.env.API_PORT || 8787);
server.on('error', error => {
  console.error(`后端启动失败：${error.message}。检查 ${port} 端口是否被占用。`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`本地后端：http://127.0.0.1:${port}；账号：admin / admin123；验证码：1234`);
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], { stdio: 'inherit', env: process.env });
  let stopping = false;
  const stop = code => {
    if (stopping) return;
    stopping = true;
    vite.kill();
    server.close(() => { store.close(); process.exit(code); });
  };
  vite.on('exit', code => stop(code || 0));
  process.on('SIGINT', () => stop(0));
  process.on('SIGTERM', () => stop(0));
});
