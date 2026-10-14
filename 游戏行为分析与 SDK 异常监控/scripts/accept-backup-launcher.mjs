/** Windows-only acceptance: launches the existing .cmd with an isolated backup copy. */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {copyFileSync,existsSync,mkdirSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'node:net';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {openDatabase} from '../server/database.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const reportPath=resolve(root,'docs/windows-acceptance/backup-launcher-results.json');
const stamp=new Date().toISOString().replaceAll(':','-').replaceAll('.','-');
const area=resolve(root,'data/windows-acceptance',`启动 备份验收-${stamp}`);
const dbPath=resolve(area,'恢复副本.sqlite');
const restoredPath=resolve(area,'再次恢复副本.sqlite');
const backupPath=resolve(area,'一致性 备份.sqlite');
const outside=resolve(area,'非项目启动目录');
const mainUrl=process.env.ACCEPT_MAIN_URL||'http://127.0.0.1:4173';
const holdMs=Number(process.env.ACCEPT_BROWSER_HOLD_MS||0);
const owned=new Set();
const logs=[];
const result={date:new Date().toISOString(),platform:process.platform,node:process.version,status:'RUNNING',scope:'仅在新的独立数据库副本测试；保留主库及已有备份。',mainUrl,checks:[],defaultBrowser:{status:'NOT_OBSERVED',description:'既有 Windows 启动器 --open 调用系统默认浏览器；Shell 成功发起打开不等于已观测页面 UI。'},paths:{dbPath,backupPath,restoredPath,outside},cleanup:[]};
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const delay=ms=>new Promise(ok=>setTimeout(ok,ms));
const check=(name,detail)=>result.checks.push({name,status:'PASS',detail});
async function getJson(url){const response=await fetch(url,{signal:AbortSignal.timeout(2000)});assert.equal(response.status,200,`${url}: ${response.status}`);return response.json();}
async function freePort(){const server=createServer();await new Promise((ok,bad)=>{server.once('error',bad);server.listen(0,'127.0.0.1',ok);});const port=server.address().port;await new Promise(ok=>server.close(ok));return port;}
function inspect(file){const db=new DatabaseSync(file,{readOnly:true});try{return {header:readFileSync(file).subarray(0,16).toString(),quickCheck:db.prepare('PRAGMA quick_check').get().quick_check,tables:['behavior_records','sdk_samples','crm_activities','crm_prizes','report_fields','report_events','workspace_state'].map(name=>({name,rows:db.prepare(`SELECT COUNT(*) rows FROM ${name}`).get().rows})),workspace:db.prepare('SELECT area,key,value,revision FROM workspace_state ORDER BY area,key').all()};}finally{db.close();}}
function ownNodePid(entry){assert.ok(owned.has(entry)&&logs.includes(entry),'只读取本验收创建并记录的启动器子进程');const pid=Number(entry.stderr.match(/\(node:(\d+)\) ExperimentalWarning: SQLite/)?.[1]);assert.ok(Number.isSafeInteger(pid)&&pid>0,'由自己创建的启动器 stderr SQLite 警告读取子进程 PID');return pid;}
function verifyCopy(entry,databaseFile){assert.ok([dbPath,restoredPath].includes(resolve(entry.file)),'只允许本次验收创建的独立副本');assert.equal(resolve(databaseFile),resolve(entry.file),'HTTP 数据库必须为该启动器的独立副本');assert.notEqual(resolve(databaseFile),resolve(result.mainDatabase),'不得操作主库服务');entry.databasePathVerified=true;}
async function launch(file,label){
 const port=await freePort(),url=`http://127.0.0.1:${port}`;
 const launcher=spawn(process.env.ComSpec||'cmd.exe',['/d','/s','/c',`""${resolve(root,'start-windows.cmd')}""`],{cwd:outside,env:{...process.env,PORT:String(port),REPLAY_DB:file,NODE_OPTIONS:'--trace-warnings',NODE_NO_WARNINGS:''},stdio:['pipe','pipe','pipe'],windowsHide:true,windowsVerbatimArguments:true});
 let output='',stderr='';launcher.stdout.on('data',b=>output+=b.toString('utf8'));launcher.stderr.on('data',b=>{const text=b.toString('utf8');output+=text;stderr+=text;});
 let exited=false,exitCode=null;launcher.once('exit',code=>{exited=true;exitCode=code;});
 const entry={launcher,label,url,file,databasePathVerified:false,get output(){return output;},get stderr(){return stderr;},get exited(){return exited;},get exitCode(){return exitCode;}};logs.push(entry);owned.add(entry);
 let health,last;
 for(let n=0;n<80;n++){try{health=await getJson(url+'/api/health');break;}catch(error){last=error;if(exited)throw new Error(`启动器提前退出 ${exitCode}: ${output}`);await delay(250);}}
 if(!health)throw new Error(`启动器未就绪: ${last?.message}\n${output}`);
 entry.nodePid=ownNodePid(entry);
 const bootstrap=await getJson(url+'/api/bootstrap');verifyCopy(entry,bootstrap.database.databaseFile);assert.equal(health.repository,'sqlite');
 check(label+'：从非项目 cwd 一键启动',{url,launcherPid:launcher.pid,nodePid:entry.nodePid,databaseFile:bootstrap.database.databaseFile,health});
 console.log(JSON.stringify({event:'LAUNCHER_READY',label,url,nodePid:entry.nodePid,databaseFile:bootstrap.database.databaseFile}));
 result.defaultBrowser={status:'OPEN_REQUESTED',description:'start-windows.cmd → node scripts/start.mjs --open；系统默认浏览器由现有启动逻辑调用。需要单独 UI 证据确认真实页面。',urls:[...(result.defaultBrowser.urls||[]),url]};
 return {entry,bootstrap};
}
async function stop(entry){
 if(!owned.has(entry))return;
 assert.ok(logs.includes(entry),'只停止本验收记录的启动器');
 if(!entry.nodePid&&entry.stderr.includes('ExperimentalWarning: SQLite'))entry.nodePid=ownNodePid(entry);
 if(entry.nodePid){assert.equal(entry.nodePid,ownNodePid(entry),'PID 必须来自此启动器自己的 stderr');if(!entry.databasePathVerified)verifyCopy(entry,(await getJson(entry.url+'/api/database')).databaseFile);assert.equal(entry.databasePathVerified,true,'停止 Node 前必须用 HTTP 核实独立测试副本');try{process.kill(entry.nodePid);result.cleanup.push({pid:entry.nodePid,kind:'owned-node',status:'STOPPED',ownership:'自己创建的启动器 stderr SQLite 警告 PID，并以 HTTP databaseFile 核对测试副本'});}catch(error){if(error.code!=='ESRCH')throw error;result.cleanup.push({pid:entry.nodePid,kind:'owned-node',status:'ALREADY_STOPPED'});}}
 if(!entry.exited){entry.launcher.stdin.end('x\r\n');for(let n=0;n<30&&!entry.exited;n++)await delay(100);if(!entry.exited){entry.launcher.kill();for(let n=0;n<10&&!entry.exited;n++)await delay(100);}}
 result.cleanup.push({pid:entry.launcher.pid,kind:'owned-cmd',status:entry.exited?'STOPPED':'UNKNOWN',exitCode:entry.exitCode});owned.delete(entry);
}

let before;
try{
 assert.equal(process.platform,'win32','本脚本只验收 Windows 原生启动');assert.ok(Number.isFinite(holdMs)&&holdMs>=0&&holdMs<=60000,'浏览器观测等待必须在 0—60 秒');
 mkdirSync(area,{recursive:true});mkdirSync(outside,{recursive:true});mkdirSync(dirname(reportPath),{recursive:true});
 before=await getJson(mainUrl+'/api/bootstrap');result.mainWorkspaceBefore=digest(before.workspace);result.mainDatabase=before.database.databaseFile;
 const sources=readdirSync(resolve(root,'data/backups')).filter(name=>name.endsWith('.sqlite')).sort();assert.ok(sources.length,'必须先创建已有主库一致性备份');
 const source=resolve(root,'data/backups',sources[0]);result.paths.source=source;const sourceHash=createHash('sha256').update(readFileSync(source)).digest('hex');result.sourceHashBefore=sourceHash;
 const sourceInfo=inspect(source);assert.equal(sourceInfo.header,'SQLite format 3\0');assert.equal(sourceInfo.quickCheck,'ok');assert.equal(sourceInfo.tables.find(x=>x.name==='behavior_records').rows,12923);assert.equal(sourceInfo.tables.find(x=>x.name==='sdk_samples').rows,36720);check('已有备份为真实且一致的 SQLite',{source,header:'SQLite format 3',quickCheck:sourceInfo.quickCheck,tables:sourceInfo.tables});
 copyFileSync(source,dbPath);assert.equal(existsSync(dbPath+'-wal'),false);assert.equal(existsSync(dbPath+'-shm'),false);
 const first=await launch(dbPath,'首次启动');const html=await fetch(first.entry.url);assert.equal(html.status,200);assert.match(await html.text(),/src\/entry\.js/);check('恢复副本 HTTP 页面与数据库路径',{url:first.entry.url,databaseFile:first.bootstrap.database.databaseFile,httpStatus:200});
 const note='Windows 一键启动／一致性备份验收：仅测试副本；中文、空格路径与进程重开。';
 const response=await fetch(first.entry.url+'/api/workspace/commit',{method:'POST',headers:{'Content-Type':'application/json','X-Replay-Token':first.bootstrap.token},body:JSON.stringify({requestId:'accept-'+randomUUID(),operations:[{area:'local',key:'note:crm',expected:first.bootstrap.workspace.versions.local['note:crm']||0,value:JSON.stringify(note)}]})});assert.equal(response.status,200);const ack=await response.json();const refreshed=await getJson(first.entry.url+'/api/bootstrap');assert.equal(JSON.parse(refreshed.workspace.stores.local.find(row=>row.key==='note:crm').value),note);check('独立副本 HTTP 保存及重新读取',{key:'note:crm',revision:ack.revision});
 if(holdMs){console.log(`BROWSER_OBSERVATION_WINDOW ${holdMs}ms ${first.entry.url}`);await delay(holdMs);}
 const backupRepo=openDatabase(dbPath);try{backupRepo.backup(backupPath);}finally{backupRepo.close();}const backupInfo=inspect(backupPath);assert.equal(backupInfo.header,'SQLite format 3\0');assert.equal(backupInfo.quickCheck,'ok');assert.equal(JSON.parse(backupInfo.workspace.find(row=>row.key==='note:crm').value),note);check('服务运行中 VACUUM INTO 一致性备份',{backupPath,header:'SQLite format 3',quickCheck:'ok',tables:backupInfo.tables});
 await stop(first.entry);
 const restarted=await launch(dbPath,'同副本服务重开');assert.notEqual(restarted.bootstrap.token,first.bootstrap.token);assert.equal(JSON.parse(restarted.bootstrap.workspace.stores.local.find(row=>row.key==='note:crm').value),note);check('服务重开后笔记保留与请求令牌轮换',{persistedNote:true,tokenChanged:true});await stop(restarted.entry);
 copyFileSync(backupPath,restoredPath);const restored=await launch(restoredPath,'一致性备份恢复');assert.equal(JSON.parse(restored.bootstrap.workspace.stores.local.find(row=>row.key==='note:crm').value),note);assert.deepEqual(restored.bootstrap.database.tables,backupInfo.tables);check('一致性备份复制为新 REPLAY_DB 后启动',{databaseFile:restored.bootstrap.database.databaseFile,persistedNote:true,tableCountsMatch:true});await stop(restored.entry);
 const finalDb=inspect(dbPath),restoredDb=inspect(restoredPath);assert.equal(finalDb.quickCheck,'ok');assert.equal(restoredDb.quickCheck,'ok');check('测试副本重开后 SQLite quick_check',{originalCopy:finalDb.quickCheck,restoredCopy:restoredDb.quickCheck});
 const after=await getJson(mainUrl+'/api/bootstrap');result.mainWorkspaceAfter=digest(after.workspace);assert.equal(result.mainWorkspaceAfter,result.mainWorkspaceBefore,'主库工作区不得被验收修改');assert.deepEqual(after.database.tables,before.database.tables);check('主库 workspace、修订及表行数前后不变',{workspaceHash:result.mainWorkspaceBefore,tables:after.database.tables,revision:after.database.revision});
 result.sourceHashAfter=createHash('sha256').update(readFileSync(source)).digest('hex');assert.equal(result.sourceHashAfter,sourceHash);check('已有一致性备份未被改写',{sha256:sourceHash});result.status='PASS';
}catch(error){result.status='FAIL';result.error=error.stack||String(error);process.exitCode=1;}
finally{
 for(const entry of [...owned]){try{await stop(entry);}catch(error){result.cleanup.push({pid:entry.launcher.pid,status:'FAIL',error:error.message});result.status='FAIL';process.exitCode=1;}}
 result.logs=logs.map(entry=>({label:entry.label,url:entry.url,launcherPid:entry.launcher.pid,nodePid:entry.nodePid,exitCode:entry.exitCode,output:entry.output}));result.completedAt=new Date().toISOString();mkdirSync(dirname(reportPath),{recursive:true});writeFileSync(reportPath,JSON.stringify(result,null,2)+'\n','utf8');console.log(`Windows 启动／备份验收 ${result.status}：${result.checks.length}项；${reportPath}`);if(result.error)console.error(result.error);
}
