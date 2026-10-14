import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DEFAULT_PORT,selectPorts,sameDatabaseFile,inspectRunningService,findRunningService,listenWithFallback} from '../scripts/port-launch.mjs';
import {createApplication} from '../server/server.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const openBrowser=process.env.REPLAY_TEST_OPEN_BROWSER==='1';

function runLauncher(env){
  return new Promise((done,reject)=>{
    const child=spawn(process.execPath,[join(root,'scripts/start.mjs'),...(openBrowser?['--open']:[])],{cwd:root,env:{...process.env,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});
    let output='';
    child.stdout.on('data',data=>output+=data);
    child.stderr.on('data',data=>output+=data);
    const timeout=setTimeout(()=>{child.kill();reject(new Error(`复用启动器未能正常退出：${output}`));},15000);
    child.once('error',error=>{clearTimeout(timeout);reject(error);});
    child.once('close',(code,signal)=>{clearTimeout(timeout);done({code,signal,output});});
  });
}

function serve(fn){
  const server=createServer(fn);
  return new Promise((resolve,reject)=>{
    server.once('error',reject);
    server.listen(0,'127.0.0.1',()=>resolve({server,port:server.address().port,close:()=>new Promise(ok=>server.close(ok))}));
  });
}
function wrap(server){return {listen(port){return new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(port,'127.0.0.1',()=>{server.off('error',reject);resolve(`http://127.0.0.1:${server.address().port}`)});
})}};}

test('默认端口可自动后退，手动PORT严格使用单端口',()=>{
  const value=selectPorts(undefined);
  assert.equal(value.explicit,false);
  assert.equal(value.ports[0],DEFAULT_PORT);
  assert.equal(value.ports.at(-1),DEFAULT_PORT+19);
  assert.deepEqual(selectPorts('4180'),{ports:[4180],explicit:true});
  assert.deepEqual(selectPorts('',{start:6000,count:3}),{ports:[6000,6001,6002],explicit:false});
});
test('端口格式拒绝不安全的数字、零和越界',()=>{
  for(const bad of ['NaN','0','65536','3.14','Infinity','-1','1abc'])assert.throws(()=>selectPorts(bad),/PORT/);
});
test('相同数据库路径才允许复用，名字相同但目录不同不能复用',()=>{
  assert.equal(sameDatabaseFile('/a/replay.sqlite','/a/replay.sqlite'),true);
  assert.equal(sameDatabaseFile('/a/replay.sqlite','/b/replay.sqlite'),false);
  assert.equal(sameDatabaseFile(undefined,'/a/replay.sqlite'),false);
});
test('实际HTTP探测：同一数据库复用，另一数据库不复用',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'replay-probe-'));
  const file=join(dir,'replay.sqlite');
  const resource=await serve((req,res)=>{
    res.setHeader('content-type','application/json');
    if(req.url==='/api/health')res.end(JSON.stringify({ok:true,appVersion:'0.8.0',repository:'sqlite'}));
    else if(req.url==='/api/database')res.end(JSON.stringify({databaseFile:file}));
    else {res.statusCode=404;res.end('{}')}
  });
  try{
    assert.equal(await inspectRunningService(resource.port,file),`http://127.0.0.1:${resource.port}`);
    assert.equal(await inspectRunningService(resource.port,join(dir,'other.sqlite')),null);
    assert.equal(await findRunningService([resource.port],file),`http://127.0.0.1:${resource.port}`);
  }finally{await resource.close();rmSync(dir,{recursive:true,force:true});}
});
test('错误程序占着端口时，不会误判为本项目',async()=>{
  const blocker=await serve((_,res)=>{res.writeHead(200,{'content-type':'text/html'});res.end('<h1>unrelated app</h1>')});
  try{assert.equal(await inspectRunningService(blocker.port,'/tmp/replay.sqlite'),null)}finally{await blocker.close()}
});
test('端口占用时实际回退到系统随机空闲端口，不结束占用者',async()=>{
  const blocked=await serve((_,res)=>res.end('unrelated'));
  const server=createServer((_,res)=>res.end('ours'));
  try{
    const events=[];
    const started=await listenWithFallback(wrap(server),{ports:[blocked.port],explicit:false,databaseFile:'/tmp/ours.sqlite',onOccupied:(p,c)=>events.push([p,c])});
    assert.equal(started.reused,false);
    assert.equal(started.ephemeral,true);
    assert.notEqual(started.port,blocked.port);
    assert.deepEqual(events,[[blocked.port,'EADDRINUSE']]);
    const response=await fetch(started.url);
    assert.equal(await response.text(),'ours');
    const still=await fetch(`http://127.0.0.1:${blocked.port}`);
    assert.equal(await still.text(),'unrelated');
  }finally{await new Promise(ok=>server.close(ok));await blocked.close()}
});
test('明确指定的端口被占用时不私自换端口',async()=>{
  const blocker=await serve((_,res)=>res.end('busy'));
  const server=createServer();
  try{
    await assert.rejects(()=>listenWithFallback(wrap(server),{ports:[blocker.port],explicit:true,databaseFile:'/tmp/replay.sqlite'}),/指定的端口/);
  }finally{await blocker.close()}
});
test('探测到竞态新启动的同库服务会复用并返回reused',async()=>{
  const blocker=await serve((_,res)=>res.end('already-running'));
  const server=createServer();
  try{
    const url=`http://127.0.0.1:${blocker.port}`;
    const result=await listenWithFallback(wrap(server),{ports:[blocker.port],explicit:false,databaseFile:'/tmp/same.sqlite',inspect:async()=>url});
    assert.equal(result.reused,true);
    assert.equal(result.url,url);
  }finally{await blocker.close()}
});

test(`真实启动器重复复用隔离 SQLite 服务后正常退出${openBrowser?'（打开系统浏览器）':''}`,{timeout:40000},async()=>{
  const dir=mkdtempSync(join(tmpdir(),'replay-launcher-'));
  const file=join(dir,'复用 回归.sqlite');
  const app=createApplication({databasePath:file});
  try{
    const url=await app.listen(0),port=new URL(url).port;
    const before=await (await fetch(url+'/api/bootstrap')).json();
    for(let attempt=0;attempt<2;attempt++){
      const result=await runLauncher({PORT:port,REPLAY_DB:file});
      assert.equal(result.code,0,result.output);
      assert.equal(result.signal,null,result.output);
      assert.match(result.output,/系统已经启动，本次只打开现有页面/);
      assert.doesNotMatch(result.output,/Assertion failed|UV_HANDLE_CLOSING|未能自动打开浏览器|构建失败/);
      assert.ok(app.server.listening,'原服务必须持续运行');
    }
    const after=await (await fetch(url+'/api/bootstrap')).json();
    assert.equal(after.token,before.token,'必须复用原服务，不能重启生成新令牌');
    assert.deepEqual(after.workspace,before.workspace,'重复打开不得修改 SQL 工作区');
    assert.deepEqual(after.database.tables,before.database.tables);
  }finally{await app.close();rmSync(dir,{recursive:true,force:true});}
});
