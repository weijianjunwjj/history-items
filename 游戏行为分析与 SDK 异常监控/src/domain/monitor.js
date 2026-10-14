/** Fixed, synthetic SDK sample. No original-company identifiers or notification services. */
export const SNAPSHOT_DAY='2026-04-08';
export const PREVIOUS_DAY='2026-04-07';
export const SNAPSHOT_MINUTES=720;
export const MAX_CHARTS=10;
export const REGIONS=['大陆','台湾','日本','国际','韩国','德法','海外'];
export const TYPES=['重要接口','游戏异常','充值异常','其他'];
export const PRODUCTS=['星河计划（模拟）','云海物语（模拟）','山岚之旅（模拟）'];
export const CATALOG=[
 ['login','登录接口异常','重要接口','登录调用返回错误或超时'],['start','启动流程异常','游戏异常','启动过程中出现失败记录'],
 ['payment','支付回调异常','充值异常','支付回调未按预期完成'],['download','补丁下载异常','其他','补丁拉取与下载失败'],
 ['account','账号鉴权异常','重要接口','账号鉴权接口错误'],['role','角色创建异常','游戏异常','角色创建流程失败'],
 ['order','订单创建异常','充值异常','订单创建接口异常'],['network','网络连接异常','其他','网络连接中断'],
 ['session','会话接口异常','重要接口','会话检查返回异常'],['resource','资源加载异常','游戏异常','资源加载失败'],
 ['receipt','凭证校验异常','充值异常','支付凭证校验失败'],['reporting','日志上传异常','其他','日志批次上传失败']
].map(([id,name,type,description],i)=>({id,name,type,description,threshold:5+i%4}));
export const DEFAULT_MONITOR_QUERY={region:'大陆',type:'',os:'',grain:30,metric:'devices'};
const catalogIds=new Set(CATALOG.map(x=>x.id));
export function normalizeMonitorQuery(q={}){
 const region=q.region??DEFAULT_MONITOR_QUERY.region,type=q.type??'',os=q.os??'',grain=Number(q.grain??30),metric=q.metric??'devices';
 if(!REGIONS.includes(region))throw new Error('大区无效。');
 if(type&&!TYPES.includes(type))throw new Error('监控类型无效。');
 if(!['','iOS','Android'].includes(os))throw new Error('平台无效。');
 if(![5,15,30,60].includes(grain))throw new Error('时间粒度只能为 5 / 15 / 30 / 60 分钟。');
 if(!['devices','reports'].includes(metric))throw new Error('指标无效。');
 return {region,type,os,grain,metric};
}
export function normalizeSelection(ids){
 if(!Array.isArray(ids)||ids.length>MAX_CHARTS)throw new Error(`最多选择 ${MAX_CHARTS} 个图表。`);
 if(ids.some(x=>!catalogIds.has(x)))throw new Error('图表 ID 无效。');
 if(new Set(ids).size!==ids.length)throw new Error('同一个图表不能重复添加。');
 return [...ids];
}
export function moveChart(ids,id,to){const list=normalizeSelection(ids),from=list.indexOf(id);if(from<0||!Number.isInteger(to)||to<0||to>=list.length)throw new Error('排序目标无效。');list.splice(from,1);list.splice(to,0,id);return list;}
export function initialMonitorPreferences(){return {version:1,selectedIds:CATALOG.slice(0,4).map(x=>x.id),query:{...DEFAULT_MONITOR_QUERY},notifications:{},alerts:{},autoRefresh:false};}
export function normalizePreferences(value){
 const defaults=initialMonitorPreferences();if(!value||typeof value!=='object')return defaults;
 let selectedIds=defaults.selectedIds,query=defaults.query;
 try{selectedIds=normalizeSelection(value.selectedIds);}catch{}
 try{query=normalizeMonitorQuery(value.query);}catch{}
 const notifications={};for(const c of CATALOG)notifications[c.id]=value.notifications?.[c.id]===true;
 const alerts={};for(const [key,a]of Object.entries(value.alerts||{}))if(key.length<120&&['processing','done'].includes(a?.status)&&typeof a.reason==='string'&&a.reason.length<=200)alerts[key]={status:a.status,reason:a.reason,updatedAt:String(a.updatedAt||'')};
 return {...defaults,selectedIds,query,notifications,alerts,autoRefresh:value.autoRefresh===true};
}
let sampleCache;
export function installMonitorSnapshot(rows){if(!Array.isArray(rows))throw new Error("监控快照无效");sampleCache=rows;}
export function getMonitorSample(){
 if(sampleCache)return sampleCache;
 const rows=[];
 for(let ci=0;ci<CATALOG.length;ci++)for(let di=0;di<2;di++)for(let ri=0;ri<REGIONS.length;ri++)for(let device=0;device<30;device++){
  if((device+ci+ri+di*2)%7===0)continue;
  for(let n=0;n<7+(device+ci+di)%4;n++){
   const minute=((device*17+n*19+ci*7+ri*11+di*13)%144)*5;
   rows.push(Object.freeze({id:`S-${ci}-${di}-${ri}-${device}-${n}`,eventId:CATALOG[ci].id,day:di?PREVIOUS_DAY:SNAPSHOT_DAY,minute,
    region:REGIONS[ri],product:PRODUCTS[device%3],deviceId:`SDK-DEMO-${ri+1}-${String(1000+device)}`,os:device%2?'Android':'iOS',reports:1+(device+n+ci+di)%4}));
  }
 }
 sampleCache=Object.freeze(rows);return sampleCache;
}
export function clock(minute){return String(Math.floor(minute/60)).padStart(2,'0')+':'+String(minute%60).padStart(2,'0');}
export function intervalLabel(start,grain){return clock(start)+'—'+clock(start+grain);}
export function stats(rows){return {devices:new Set(rows.map(x=>x.deviceId)).size,reports:rows.reduce((sum,x)=>sum+x.reports,0)};}
export function selectMonitorRows(eventId,query,day=SNAPSHOT_DAY,start=0,end=SNAPSHOT_MINUTES,rows=getMonitorSample()){
 if(!catalogIds.has(eventId))throw new Error('监控事件不存在。');const q=normalizeMonitorQuery(query);
 if(![SNAPSHOT_DAY,PREVIOUS_DAY].includes(day)||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>SNAPSHOT_MINUTES||start>=end)throw new Error('样本时段无效。');
 return rows.filter(x=>x.eventId===eventId&&x.region===q.region&&(!q.os||x.os===q.os)&&x.day===day&&x.minute>=start&&x.minute<end);
}
export function summarizeChart(eventId,query,rows=getMonitorSample()){
 const q=normalizeMonitorQuery(query),today=selectMonitorRows(eventId,q,SNAPSHOT_DAY,0,SNAPSHOT_MINUTES,rows),yesterday=selectMonitorRows(eventId,q,PREVIOUS_DAY,0,SNAPSHOT_MINUTES,rows);
 const bins=Array.from({length:SNAPSHOT_MINUTES/q.grain},(_,index)=>{
  const start=index*q.grain,matched=today.filter(x=>x.minute>=start&&x.minute<start+q.grain),prior=yesterday.filter(x=>x.minute>=start&&x.minute<start+q.grain);
  return {index,start,end:start+q.grain,label:intervalLabel(start,q.grain),today:stats(matched),yesterday:stats(prior),products:PRODUCTS.map(product=>({product,...stats(matched.filter(x=>x.product===product))}))};
 });
 return {...CATALOG.find(x=>x.id===eventId),totals:stats(today),previous:stats(yesterday),bins};
}
export function visibleCharts(ids,query){const q=normalizeMonitorQuery(query);return normalizeSelection(ids).map(id=>CATALOG.find(x=>x.id===id)).filter(c=>!q.type||c.type===q.type);}
export function deviceBreakdown(rows){const map=new Map();for(const r of rows){if(!map.has(r.deviceId))map.set(r.deviceId,{deviceId:r.deviceId,product:r.product,os:r.os,reports:0,lastMinute:0});const d=map.get(r.deviceId);d.reports+=r.reports;d.lastMinute=Math.max(d.lastMinute,r.minute);}return [...map.values()].sort((a,b)=>a.deviceId.localeCompare(b.deviceId));}
/** Demo detection uses hourly windows; unaffected by the visual chart's grain/metric. */
export function alertBatches(eventId,query){const chart=summarizeChart(eventId,{...query,grain:60});return chart.bins.filter(x=>x.today.devices>=chart.threshold).slice(-4).map(x=>({...x,id:`${eventId}-${x.start}`,time:clock(x.end),productCount:x.products.filter(p=>p.devices).length,rule:`样例规则：1小时去重设备数 ≥ ${chart.threshold}`}));}
export function alertKey(eventId,query){normalizeSelection([eventId]);const q=normalizeMonitorQuery(query);return [eventId,q.region,q.os||'all',SNAPSHOT_DAY].join('|');}
export function setAlertStatus(preferences,eventId,query,status,reason='',now=new Date().toISOString()){
 if(!['processing','done'].includes(status))throw new Error('处理状态无效。');
 const trimmed=String(reason).trim();if(trimmed.length>200)throw new Error('告警原因不能超过 200 字。');if(status==='done'&&!trimmed)throw new Error('处理完成前，请填写告警原因。');
 const prefs=normalizePreferences(preferences);prefs.alerts[alertKey(eventId,query)]={status,reason:trimmed,updatedAt:now};return prefs;
}
export function exportMonitorPreferences(prefs){return {format:'youyi-monitor-demo-v1',simulation:true,snapshotDate:SNAPSHOT_DAY,note:'仅演示偏好和本地模拟处理结果；无通知、无后台告警任务。',preferences:normalizePreferences(prefs)};}
export function createPageTicker(tick,{set=setInterval,clear=clearInterval,interval=300000}={}){let enabled=false,visible=true,handle=null;
 function sync(){if(handle!==null){clear(handle);handle=null;}if(enabled&&visible)handle=set(tick,interval);}
 return {enable(value){enabled=!!value;sync();},setVisible(value){visible=!!value;sync();},stop(){enabled=false;sync();},get active(){return handle!==null;}};
}
