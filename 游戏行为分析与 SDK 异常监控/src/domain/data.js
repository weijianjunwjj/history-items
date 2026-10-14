/** Synthetic dataset only. No production IDs, credentials, or business records. */
export const DATA_VERSION = 'synthetic-2026-02-v1';
export const RANGE = { start: '2026-02-09', end: '2026-02-22' };
export const DEFAULT_CONTEXT = {start:'2026-02-16',end:'2026-02-22',channel:'',os:'',eventType:'deviceStart'};
export const CHANNELS = ['官方渠道','应用商店','联运渠道','测试渠道'];
export const SYSTEMS = ['Android','iOS'];
export const MODULES = [
 {key:'deviceActivate',title:'设备激活'}, {key:'deviceStart',title:'设备启动'},
 {key:'loginGame',title:'登录游戏'}, {key:'deviceRole',title:'设备创角'},
 {key:'abnormalData',title:'异常数据'}, {key:'gameProcess',title:'游戏启动过程数据'},
 {key:'patchDownload',title:'补丁下载数据'}
];
export const STEPS = ['deviceStart','loginGame','deviceRole'];
export const moduleTitle = k => MODULES.find(x=>x.key===k)?.title || k;
export function hash(s) { let h=2166136261; for (const c of String(s)) h=Math.imul(h^c.charCodeAt(0),16777619); return h>>>0; }
export function dates(start,end) {
 const a=[]; let d=new Date(start+'T00:00:00Z'); const last=new Date(end+'T00:00:00Z');
 for(let guard=0;Number.isFinite(+d)&&d<=last&&guard<400;guard++,d.setUTCDate(d.getUTCDate()+1))a.push(d.toISOString().slice(0,10));
 return a;
}
export const DEVICES = Array.from({length:72},(_,i)=>({
 deviceId:`DEMO-D${String(1001+i)}`,userId:`DEMO-U${String(2001+i)}`,
 channel:CHANNELS[i%4],os:SYSTEMS[Math.floor(i/4)%2],version:['2.4.0','2.4.1','2.5.0'][Math.floor(i/8)%3]
}));
function generate() {
 const rows=[];
 for(const [dayIndex,date] of dates(RANGE.start,RANGE.end).entries()) {
  for(const [i,d] of DEVICES.entries()) {
   // A device is active according to a fixed hash, never Math.random(). D1001 is the stable demo device.
   if(i>0 && hash(`${date}:${i}:active`)%100 > 57+dayIndex%5*5)continue;
   const add=(key,minute,session,status='成功',seq=0)=>{
    const hour=8+Math.floor(minute/60),min=minute%60;
    const timestamp=`${date} ${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(seq%60).padStart(2,'0')}`;
    rows.push({...d,id:`${date}-${i}-${session}-${key}-${seq}`,date,timestamp,module:key,
     sessionId:`SIM-${dayIndex}-${i}-${session}`,status,
     message:key==='abnormalData'?'模拟网络请求超时':`${moduleTitle(key)}记录`,
     attributes:{demo:true,build:d.version,source:'replay-fixture',durationMs:120+hash(`${date}${i}${key}${seq}`)%2800,sequence:seq}
    });
   };
   if(dayIndex===7+(i%7)) add('deviceActivate',i%60,'activation');
   // Every completed step is ordered within the same synthetic session.
   for(let session=0;session<3+(i%4);session++) {
    const minute=60+session*60+i%45;
    add('deviceStart',minute,session,'成功',0);
    add('deviceStart',minute,session,'成功',1); // PV differs from UV.
    add('gameProcess',minute+1,session,'成功',0);
    const logged=i===0||hash(`${date}:${i}:${session}:login`)%100<68;
    if(logged){add('loginGame',minute+3,session);if(i===0||hash(`${date}:${i}:${session}:role`)%100<35)add('deviceRole',minute+6,session);}
    if(hash(`${date}:${i}:${session}:error`)%100<18)add('abnormalData',minute+8,session,'失败');
    if(session===0 && i%3===0)add('patchDownload',minute+9,session,i%9===0?'失败':'成功');
   }
  }
 }
 return rows.sort((a,b)=>a.timestamp.localeCompare(b.timestamp)||a.id.localeCompare(b.id));
}
export let EVENTS = generate();
/** SQL-backed startup snapshot. The isolated demo keeps the deterministic fixture. */
export function installBehaviorSnapshot(rows){if(!Array.isArray(rows))throw new Error("行为快照无效");EVENTS=rows;}
