import {MODULES} from './data.js';
export const EVENT_COLUMNS=[{key:'timestamp',label:'发生时间'},{key:'status',label:'结果'},{key:'message',label:'事件说明'},{key:'sessionId',label:'会话标识'},{key:'version',label:'应用版本'},{key:'channel',label:'渠道'},{key:'attributes',label:'扩展参数'}];
export const DEVICE_COLUMNS=[{key:'deviceId',label:'设备 ID'},{key:'userId',label:'用户 ID'},{key:'channel',label:'渠道'},{key:'os',label:'操作系统'},{key:'version',label:'应用版本'},{key:'events',label:'事件次数'},{key:'lastTime',label:'最近发生时间'}];
export const DEFAULT_EVENT_COLS=['timestamp','status','message','sessionId','attributes'];
export function newModules(){return Object.fromEntries(MODULES.map((m,i)=>[m.key,{expanded:i===0,loaded:false,page:1,pageSize:5,status:'',keyword:'',columns:[...DEFAULT_EVENT_COLS]}]));}
export function sanitizeModules(input={}){
 const out=newModules();for(const m of MODULES){const s=input?.[m.key];if(!s||typeof s!=='object')continue;const target=out[m.key];
  target.expanded=typeof s.expanded==='boolean'?s.expanded:target.expanded;
  target.page=Math.min(10000,Math.max(1,Math.trunc(Number(s.page)||1)));
  target.pageSize=[5,10,20,50].includes(Number(s.pageSize))?Number(s.pageSize):5;
  target.status=['成功','失败'].includes(s.status)?s.status:'';target.keyword=typeof s.keyword==='string'?s.keyword.slice(0,120):'';
  if(Array.isArray(s.columns)){const cols=[...new Set(s.columns)].filter(x=>EVENT_COLUMNS.some(c=>c.key===x));if(cols.length)target.columns=cols;}
 }return out;
}
export function decodeShare(value){if(!value)return null;if(value.length>12000)throw new Error('分享状态过长。');let obj;try{obj=JSON.parse(value)}catch{throw new Error('分享参数损坏，无法恢复模块状态。');}if(obj.v!==1||!obj.modules)throw new Error('分享状态版本不支持。');return sanitizeModules(obj.modules);}
export function encodeShare(modules){return JSON.stringify({v:1,modules:sanitizeModules(modules)});}
