/** A replay-only adapter: SDK aggregate fixtures -> count-preserving event records.
 * One source row carries `reports`; expanded records are synthetic, NOT recovered production logs.
 * This file is the sole SDK->EBI identity/time normalization boundary. */
import {getMonitorSample,CATALOG,REGIONS,PRODUCTS,SNAPSHOT_DAY,PREVIOUS_DAY,SNAPSHOT_MINUTES,clock} from './monitor.js';
export const UNIFIED_DEFAULT={dataset:'sdk',flow:'sdk',start:SNAPSHOT_DAY,end:SNAPSHOT_DAY,region:'大陆',sdkEventId:'login',sdkFrom:0,sdkTo:SNAPSHOT_MINUTES,product:'',os:'',channel:'',eventType:'abnormalData'};
export function unifiedContext(input={}){
 const q={...UNIFIED_DEFAULT,...input};
 q.sdkFrom=Number(q.sdkFrom);q.sdkTo=Number(q.sdkTo);
 if(![SNAPSHOT_DAY,PREVIOUS_DAY].includes(q.start)||![SNAPSHOT_DAY,PREVIOUS_DAY].includes(q.end)||q.start>q.end)throw new Error('统一 SDK 样本仅覆盖 2026-04-07 / 04-08。');
 if(!CATALOG.some(c=>c.id===q.sdkEventId))throw new Error('SDK 事件标识无效。');
 if(!REGIONS.includes(q.region))throw new Error('SDK 大区无效。');
 if(q.product&&!PRODUCTS.includes(q.product))throw new Error('SDK 产品无效。');
 if(!['','Android','iOS'].includes(q.os))throw new Error('SDK 平台无效。');
 if(!Number.isInteger(q.sdkFrom)||!Number.isInteger(q.sdkTo)||q.sdkFrom<0||q.sdkTo>SNAPSHOT_MINUTES||q.sdkFrom>=q.sdkTo)throw new Error('SDK 时间窗口无效（左闭右开，00:00—12:00）。');
 return q;
}
export function sourceRows(input={}){const q=unifiedContext(input);if(q.channel&&q.channel!=='测试渠道')return [];return getMonitorSample().filter(r=>r.eventId===q.sdkEventId&&r.day>=q.start&&r.day<=q.end&&r.region===q.region&&(!q.os||r.os===q.os)&&(!q.product||r.product===q.product)&&(!q.deviceId||r.deviceId===q.deviceId)&&r.minute>=q.sdkFrom&&r.minute<q.sdkTo);}
export function unifiedEvents(input={}){return expandSourceRows(sourceRows(input));}
export function expandSourceRows(sources){const rows=[];for(const r of sources)for(let i=0;i<r.reports;i++)rows.push({
 id:`${r.id}:report:${i+1}`,sourceRecordId:r.id,dataset:'sdk',date:r.day,timestamp:`${r.day} ${clock(r.minute)}:${String(i).padStart(2,'0')}`,
 minute:r.minute,sdkEventId:r.eventId,region:r.region,product:r.product,deviceId:r.deviceId,userId:`SIM-U-${r.deviceId.slice(9)}`,
 channel:'测试渠道',os:r.os,version:'SDK样本',module:'abnormalData',status:'失败',message:CATALOG.find(c=>c.id===r.eventId).name,
 sessionId:'未提供（SDK异常快照）',attributes:{simulation:true,sourceRecordId:r.id,reportIndex:i+1,sourceReports:r.reports,eventId:r.eventId,product:r.product,region:r.region,note:'按reports计数展开；不是生产逐条日志。用户ID为演示关联，未虚构会话。'}
 });return rows;}
export function unifiedDevice(id){const r=getMonitorSample().find(x=>x.deviceId===id);return r?{deviceId:id,userId:`SIM-U-${id.slice(9)}`,channel:'测试渠道',os:r.os,version:'SDK样本',product:r.product,region:r.region}:null;}
export function scopeLabel(q){q=unifiedContext(q);return `${CATALOG.find(c=>c.id===q.sdkEventId).name} · ${q.start}${q.start!==q.end?' 至 '+q.end:''} · ${clock(q.sdkFrom)}—${clock(q.sdkTo)} · ${q.region} · ${q.os||'全部平台'} · ${q.product||'全部产品'}${q.deviceId?' · '+q.deviceId:''}${q.channel?' · '+q.channel:''}`;}
export function linkedQuery(id,query={},window={}){return unifiedContext({...UNIFIED_DEFAULT,region:query.region||'大陆',os:query.os||'',sdkEventId:id||'login',start:window.day||SNAPSHOT_DAY,end:window.day||SNAPSHOT_DAY,sdkFrom:window.start??0,sdkTo:window.end??SNAPSHOT_MINUTES,product:window.product||'',...(window.deviceId?{deviceId:window.deviceId}:{}),source:'sdk'});}
export function projectUnified(event,flat){return unifiedEvents(event.sdkScope||UNIFIED_DEFAULT).map(row=>{const aliases={device_id:row.deviceId,user_id:row.userId,reported_at:row.timestamp,event_id:row.sdkEventId,product:row.product,region:row.region,os:row.os,channel:row.channel,report_id:row.id,source_id:row.sourceRecordId,raw_payload:JSON.stringify(row.attributes),success:false};return {id:row.id,values:Object.fromEntries(flat.map(({node})=>[node.id,Object.hasOwn(aliases,node.alias)?aliases[node.alias]:'未采集（不补造）']))};});}
