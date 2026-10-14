import {unifiedEvents,unifiedContext} from './unified.js';
import {EVENTS,STEPS,MODULES,CHANNELS,SYSTEMS,DEFAULT_CONTEXT,RANGE,dates,moduleTitle} from './data.js';
export function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||'') && Number.isFinite(+new Date(s+'T00:00:00Z')) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
export function validateContext(q,{funnel=false}={}){
 if(!validDate(q.start)||!validDate(q.end))throw new Error('请填写有效的开始、结束日期。');
 if(q.start>q.end)throw new Error('开始日期不能晚于结束日期。');
 if(q.dataset==='sdk'){unifiedContext(q);if(funnel)throw new Error('SDK异常快照没有完整转化步骤，不能伪造漏斗。');}
 if(q.dataset!=='sdk'&&(q.start<RANGE.start||q.end>RANGE.end))throw new Error(`本地样本仅覆盖 ${RANGE.start} 至 ${RANGE.end}，不是历史业务范围限制。`);
 if(funnel&&dates(q.start,q.end).length>7)throw new Error('漏斗详情最多查询连续 7 个自然日（含首尾）。');
 if(q.channel&&!CHANNELS.includes(q.channel))throw new Error('渠道参数无效。');
 if(q.os&&!SYSTEMS.includes(q.os))throw new Error('操作系统参数无效。');
 if(q.eventType&&!MODULES.some(m=>m.key===q.eventType))throw new Error('事件参数无效。');
 return q;
}
export function context(q={}) {return {...(q.dataset==='sdk'?unifiedContext(q):DEFAULT_CONTEXT),...Object.fromEntries(['start','end','channel','os','eventType','deviceId','source','dataset','flow','region','sdkEventId','sdkFrom','sdkTo','product'].filter(k=>q[k]!==undefined).map(k=>[k,String(q[k])]))};}
export function filterEvents(q,rows){rows=rows||(q.dataset==='sdk'?unifiedEvents(q):EVENTS);return rows.filter(r=>r.date>=q.start&&r.date<=q.end&&(!q.channel||r.channel===q.channel)&&(!q.os||r.os===q.os)&&(!q.deviceId||r.deviceId===q.deviceId));}
export function orderedFunnel(q,rows=EVENTS) {
 const events=filterEvents(q,rows),sessions=new Map();
 for(const r of events){const key=r.deviceId+'|'+r.sessionId; if(!sessions.has(key))sessions.set(key,[]); sessions.get(key).push(r);}
 const sets=STEPS.map(()=>new Set());
 for(const list of sessions.values()){
  let cursor='';
  for(let i=0;i<STEPS.length;i++){
   const next=list.filter(r=>r.module===STEPS[i]&&r.timestamp>=cursor).sort((a,b)=>a.timestamp.localeCompare(b.timestamp))[0];
   if(!next)break;sets[i].add(next.deviceId);cursor=next.timestamp;
  }
 }
 return STEPS.map((key,i)=>({key,title:moduleTitle(key),devices:sets[i].size,events:events.filter(r=>r.module===key).length,
  previous:i===0?null:(sets[i-1].size?sets[i].size/sets[i-1].size:null),overall:sets[0].size?sets[i].size/sets[0].size:null}));
}
export function analysis(q,mode='funnel',sourceRows) {
 validateContext(q,{funnel:mode==='funnel'});
 const per=(ctx)=>mode==='funnel'?orderedFunnel(ctx,sourceRows):(()=>{const rows=filterEvents(ctx,sourceRows).filter(r=>r.module===ctx.eventType);return [{key:ctx.eventType,title:moduleTitle(ctx.eventType),events:rows.length,devices:new Set(rows.map(r=>r.deviceId)).size}];})();
 return {summary:per(q),trend:dates(q.start,q.end).map(date=>({date,steps:per({...q,start:date,end:date})})),context:{...q}};
}
export function deviceRows(q,sourceRows) {
 const events=filterEvents(q,sourceRows).filter(r=>!q.eventType||r.module===q.eventType),map=new Map();
 for(const r of events){
  if(!map.has(r.deviceId))map.set(r.deviceId,{deviceId:r.deviceId,userId:r.userId,channel:r.channel,os:r.os,version:r.version,events:0,lastTime:r.timestamp,firstTime:r.timestamp});
  const d=map.get(r.deviceId);d.events++;if(r.timestamp>d.lastTime)d.lastTime=r.timestamp;if(r.timestamp<d.firstTime)d.firstTime=r.timestamp;
 }
 return [...map.values()].sort((a,b)=>a.deviceId.localeCompare(b.deviceId));
}
export const GROUP_FIELDS={channel:'渠道',os:'操作系统',version:'应用版本'};
export function aggregate(q,fields=['channel'],limit=30,sourceRows) {
 if(!fields.length||fields.some(f=>!Object.hasOwn(GROUP_FIELDS,f)))throw new Error('至少选择一个有效聚合字段。');
 const map=new Map();for(const d of deviceRows(q,sourceRows)){
  const values=Object.fromEntries(fields.map(f=>[f,d[f]])),key=JSON.stringify(values);
  if(!map.has(key))map.set(key,{key,values,devices:0,events:0});const g=map.get(key);g.devices++;g.events+=d.events;
 }
 const all=[...map.values()].sort((a,b)=>b.devices-a.devices||a.key.localeCompare(b.key));
 return {rows:all.slice(0,limit),total:all.length,truncated:all.length>limit};
}
export function groupDetails(q,values,sourceRows){return deviceRows(q,sourceRows).filter(r=>Object.entries(values).every(([k,v])=>Object.hasOwn(GROUP_FIELDS,k)&&r[k]===v));}
export function paginate(rows,page=1,pageSize=10){
 const size=[5,10,20,50].includes(Number(pageSize))?Number(pageSize):10;
 const pages=Math.max(1,Math.ceil(rows.length/size));const p=Math.max(1,Math.min(pages,Math.trunc(Number(page)||1)));
 return {rows:rows.slice((p-1)*size,p*size),total:rows.length,page:p,pageSize:size,pages};
}
export function moduleRows(q,key,state={},sourceRows){
 return filterEvents(q,sourceRows).filter(r=>r.module===key&&(!state.status||r.status===state.status)&&(!state.keyword||`${r.message} ${r.sessionId} ${JSON.stringify(r.attributes)}`.toLowerCase().includes(state.keyword.toLowerCase()))).sort((a,b)=>b.timestamp.localeCompare(a.timestamp)||a.id.localeCompare(b.id));
}
export function csv(rows,columns) {
 const quote=v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
 return '\ufeff'+[columns.map(c=>quote(c.label)).join(','),...rows.map(r=>columns.map(c=>quote(r[c.key])).join(','))].join('\r\n');
}
