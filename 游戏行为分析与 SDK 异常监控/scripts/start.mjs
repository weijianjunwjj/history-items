import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn, spawnSync} from 'node:child_process';
import {DEFAULT_PORT,selectPorts,findRunningService,listenWithFallback} from './port-launch.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22 || (major===22 && minor<16)){
  console.error(`需要 Node.js 22.16+（建议 Node 24），当前 ${process.version}`);
  process.exit(1);
}
let selection;
try{selection=selectPorts(process.env.PORT);}catch(e){console.error(e.message);process.exit(1);}

const databaseFile=process.env.REPLAY_DB?resolve(root,process.env.REPLAY_DB):resolve(root,'data/replay.sqlite');
const dev=process.argv.includes('--dev');
const shouldOpen=process.argv.includes('--open');

function openBrowser(url){
  let command,args;
  if(process.platform==='win32'){
    command='powershell.exe';args=['-NoProfile','-NonInteractive','-Command',`Start-Process -FilePath '${url}'`];
  }else if(process.platform==='darwin'){
    command='open';args=[url];
  }else{
    command='xdg-open';args=[url];
  }
  try{
    const child=spawn(command,args,{detached:true,stdio:'ignore',windowsHide:true});
    child.once('error',()=>console.log(`未能自动打开浏览器，请手动访问：${url}`));
    child.unref();
  }catch{
    console.log(`未能自动打开浏览器，请手动访问：${url}`);
  }
}

// 重复双击时，先找已运行的“同一个数据库”服务；不重新构建、启动或占端口。
const existing=await findRunningService(selection.ports,databaseFile);
if(existing){
  console.log(`\n✓ 系统已经启动，本次只打开现有页面：${existing}\n✓ 没有创建新进程、修改数据库或重建资源。\n`);
  if(shouldOpen)openBrowser(existing);
  process.exit(0);
}

if(!dev){
  const result=spawnSync(process.execPath,[resolve(root,'scripts/build.mjs')],{cwd:root,stdio:'inherit'});
  if(result.error){console.error('构建失败：'+result.error.message);process.exit(1);}
  if(result.status!==0)process.exit(result.status||1);
}

let app;
try{
  const {createApplication}=await import('../server/server.mjs');
  app=createApplication({staticRoot:dev?root:resolve(root,'dist'),databasePath:databaseFile});
  const occupied=[];
  const status=await listenWithFallback(app,{...selection,databaseFile,onOccupied:(port,code)=>occupied.push({port,code})});
  if(status.reused){
    // 两次启动发生竞态时本进程尚未监听；只关闭自己新开的 SQLite 连接。
    app.repository.close();app=null;
    console.log(`\n✓ 检测到另一实例刚刚启动，复用页面：${status.url}\n`);
    if(shouldOpen)openBrowser(status.url);
    process.exit(0);
  }
  if(occupied.length){
    const numbers=occupied.map(({port})=>port).join('、');
    console.log(`\n提示：端口 ${numbers} 已被占用或不可用，已自动换用 ${status.port}，没有结束任何进程。`);
  }
  console.log(`\n==================================================\n  友谊时光工作复盘 · 本地微前端 + SQLite\n  访问地址：${status.url}\n  SQLite：${app.repository.path}\n  双击启动脚本会自动复用此服务。\n  请保留本窗口；按 Ctrl+C 停止服务。\n==================================================\n`);
  if(shouldOpen)openBrowser(status.url);
  let stopping=false;
  async function stop(){
    if(stopping)return;
    stopping=true;
    try{await app.close();process.exit(0);}catch(e){console.error('停止失败：'+e.message);process.exit(1);}
  }
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(e){
  console.error(e?.message||e);
  try{app?.repository.close();}catch{}
  if(e?.code==='EADDRINUSE')console.error(`另一个程序占用了指定端口。移除 PORT 环境变量即可启用自动选择。默认从 ${DEFAULT_PORT} 开始。`);
  process.exitCode=1;
}
