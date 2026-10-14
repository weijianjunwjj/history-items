import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';import {spawn,spawnSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||major===22&&minor<16){console.error('需要 Node.js 22.16+，建议 Node 24。当前 '+process.version);process.exit(1);}
const port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535){console.error('PORT 必须为1—65535的整数');process.exit(1);}
const dev=process.argv.includes('--dev');
if(!dev){const child=spawnSync(process.execPath,[resolve(root,'scripts/build.mjs')],{cwd:root,stdio:'inherit'});if(child.status!==0)process.exit(child.status||1);}
let app;
try{const {createApplication}=await import('../server/server.mjs');app=createApplication({staticRoot:dev?root:resolve(root,'dist'),databasePath:process.env.REPLAY_DB?resolve(root,process.env.REPLAY_DB):undefined});const url=await app.listen(port);
 console.log(`\n友谊时光工作复盘 v0.8 · 本地微前端 + SQLite\n${url}\n数据库：${app.repository.path}\n数据只在本机；按 Ctrl+C 停止。终端出现 SQLite experimental 提示不等于运行失败。\n`);
 if(process.argv.includes('--open')){let cmd,args;if(process.platform==='win32'){cmd='cmd';args=['/c','start','',url];}else if(process.platform==='darwin'){cmd='open';args=[url];}else{cmd='xdg-open';args=[url];}const child=spawn(cmd,args,{stdio:'ignore',detached:true});child.on('error',()=>console.log('请手动打开 '+url));child.unref();}
 let stopping=false;async function stop(){if(stopping)return;stopping=true;await app.close();process.exit(0);}process.on('SIGINT',stop);process.on('SIGTERM',stop);
}catch(e){console.error(e.code==='EADDRINUSE'?`端口 ${port} 被占用。先停止已有进程，或设置 PORT 再运行。`:e.message);app?.repository.close();process.exitCode=1;}
