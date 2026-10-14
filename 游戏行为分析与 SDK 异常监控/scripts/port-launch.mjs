/**
 * 启动器专用：判断某个本机端口是否运行了“使用同一 SQLite 文件”的本项目。
 * 不会杀进程、抢端口或修改数据库。
 */
import {resolve} from 'node:path';

export const DEFAULT_PORT = 4173;
export const FALLBACK_COUNT = 20;

export function selectPorts(rawPort, {start=DEFAULT_PORT, count=FALLBACK_COUNT}={}) {
  const supplied = rawPort !== undefined && String(rawPort).trim() !== '';
  const first = supplied ? Number(rawPort) : start;
  if (!Number.isSafeInteger(first) || first < 1 || first > 65535) {
    throw new Error('PORT 必须是 1—65535 的整数。');
  }
  if (supplied) return {ports:[first], explicit:true};
  return {ports:Array.from({length:Math.min(count,65536-first)}, (_,i)=>first+i), explicit:false};
}

export function sameDatabaseFile(actual, expected) {
  if(typeof actual!=='string'||!actual.trim()||typeof expected!=='string'||!expected.trim())return false;
  const normalize=(value)=>{
    const p=resolve(value);
    return process.platform==='win32'?p.toLowerCase():p;
  };
  return normalize(actual)===normalize(expected);
}

export async function inspectRunningService(port, databaseFile, {fetchFn=fetch, timeoutMs=650}={}) {
  // 必须检查数据库完整路径；只凭「HTTP 200」或同样的产品名可能误打开其他项目。
  const url=`http://127.0.0.1:${port}`;
  const controller = new AbortController();
  const timeout=setTimeout(()=>controller.abort(),timeoutMs);
  timeout.unref?.();
  try {
    const opts={method:'GET',redirect:'error',signal:controller.signal};
    const health=await fetchFn(`${url}/api/health`,opts);
    if(!health.ok)return null;
    const h=await health.json();
    if(!h?.ok||h.repository!=='sqlite'||typeof h.appVersion!=='string')return null;
    const db=await fetchFn(`${url}/api/database`,opts);
    if(!db.ok)return null;
    const info=await db.json();
    return sameDatabaseFile(info.databaseFile,databaseFile)?url:null;
  }catch{return null;}
  finally{clearTimeout(timeout);}
}

export async function findRunningService(ports, databaseFile, options={}) {
  // 并发扫描，避免前面端口被别的软件占用时一个接一个超时。
  const matches=await Promise.all(ports.map(port=>inspectRunningService(port,databaseFile,options)));
  return matches.find(Boolean)||null;
}

export async function listenWithFallback(app, {ports, explicit, databaseFile, onOccupied=()=>{}, inspect=inspectRunningService}) {
  for (const port of ports) {
    try {
      const url=await app.listen(port);
      return {url, port:Number(new URL(url).port), reused:false};
    } catch(e) {
      if(!['EADDRINUSE','EACCES'].includes(e?.code))throw e;
      if(e.code==='EADDRINUSE'){
        // 处理「检查之后，另一个启动器刚好抢先完成启动」的竞态。
        const existing=await inspect(port,databaseFile);
        if(existing)return {url:existing,port,reused:true};
      }
      onOccupied(port,e.code);
      if(explicit)throw Object.assign(new Error(`指定的端口 ${port} 无法使用（${e.code}），取消自动更换。`),{code:e.code});
    }
  }
  // 前20个固定候选都不可用时由系统分配临时空闲端口；仍只监听 127.0.0.1。
  const url=await app.listen(0);
  return {url,port:Number(new URL(url).port),reused:false,ephemeral:true};
}
