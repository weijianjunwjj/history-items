/** Portable JSON backups of this app's allowlisted keys only. No network, SQL or execution. */
import {PREFIX} from '../shared/store.js';
import {ROUTES} from './route.js';
import {RECAP_TRACKS,RECAP_FIELDS,RECALL_STATES} from './recap.js';
export const BACKUP_FORMAT='youyi-replay-workspace';
export const MAX_BACKUP_BYTES=8*1024*1024;
const noteIds=['funnel','event','device','user','crm','report','monitor'];
const localKeys=['crm:data','report:data','monitor:preferences','device-columns',...noteIds.map(x=>'note:'+x),...RECAP_TRACKS.map(x=>'recap:'+x.id)];
const sessionKeys=['tabs','funnel','event','device','user','crm:workspace','report:workspace'];
const sets={local:new Set(localKeys),session:new Set(sessionKeys)};
const clone=x=>JSON.parse(JSON.stringify(x));
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
function require(ok,message){if(!ok)throw new Error(message);}
function safeJSON(value,depth=0,budget={count:0}){require(++budget.count<=100000&&depth<=32,'备份结构过深或条目过多。');if(value===null)return;if(typeof value==='number'){require(Number.isFinite(value),'备份含无效数值。');return;}if(['boolean','string'].includes(typeof value))return;require(typeof value==='object','备份含不支持的数据。');for(const [k,v]of Object.entries(value)){require(!['__proto__','prototype','constructor'].includes(k),'备份含保留键，已拒绝导入。');safeJSON(v,depth+1,budget);}}
const array=(v,max=2000)=>Array.isArray(v)&&v.length<=max;
function fieldShape(f){return object(f)&&['id','name','alias','dataType','product','reportType','restriction'].every(k=>typeof f[k]==='string')&&typeof f.supportQuery==='boolean';}
function eventShape(e){if(!object(e)||!['id','name','alias','product','reportType','model'].every(k=>typeof e[k]==='string')||!array(e.fields)||!object(e.panels))return false;const tree=fs=>fs.every(f=>fieldShape(f)&&array(f.children)&&tree(f.children));return tree(e.fields)&&['list','query','detail'].every(k=>array(e.panels[k])&&e.panels[k].every(p=>object(p)&&typeof p.nodeId==='string'&&typeof p.label==='string'&&object(p.queryConfig)&&typeof p.queryConfig.label==='string'));}
function activityShape(a){return object(a)&&['id','configName','componentType','activityId','gameProductId','rewardRule'].every(k=>typeof a[k]==='string')&&array(a.groups)&&a.groups.every(g=>object(g)&&typeof g.id==='string'&&typeof g.productId==='string'&&array(g.prizes)&&g.prizes.every(p=>object(p)&&['id','name','type','sku','gameResource','singleLimitType','limitTimeType'].every(k=>typeof p[k]==='string')));}
function validateValue(key,v){
 if(key.startsWith('note:'))return typeof v==='string'&&v.length<=60000;
 if(key.startsWith('recap:'))return object(v)&&v.version===1&&Object.hasOwn(RECALL_STATES,v.status)&&RECAP_FIELDS.every(f=>typeof v[f.id]==='string'&&v[f.id].length<=6000);
 if(key==='device-columns')return array(v,100)&&v.every(x=>typeof x==='string');
 if(key==='tabs')return array(v,50)&&v.every(t=>object(t)&&Object.hasOwn(ROUTES,t.path)&&typeof t.hash==='string'&&t.hash.startsWith('#'+t.path)&&t.hash.length<30000);
 if(key==='crm:data')return object(v)&&v.version===1&&array(v.activities,500)&&v.activities.every(activityShape);
 if(key==='report:data')return object(v)&&v.version===1&&array(v.fields)&&v.fields.every(fieldShape)&&array(v.events,500)&&v.events.every(eventShape);
 if(key==='monitor:preferences')return object(v)&&v.version===1&&array(v.selectedIds,10)&&v.selectedIds.every(x=>typeof x==='string')&&object(v.query)&&object(v.notifications)&&object(v.alerts);
 if(key==='crm:workspace')return object(v)&&(!v.workspace||(object(v.workspace)&&activityShape(v.workspace.draft)))&&['list','editor'].includes(v.view);
 if(key==='report:workspace')return object(v)&&(!v.workspace||(object(v.workspace)&&eventShape(v.workspace.draft)))&&['list','editor'].includes(v.view);
 if(['funnel','event','device','user'].includes(key))return object(v)&&object(v.q)&&Object.values(v.q).every(x=>x===null||['string','number','boolean'].includes(typeof x))&&(key!=='user'||object(v.modules))&&(key!=='device'||array(v.fields,100));
 return false;
}
export function collectOwned(store,area){const rows=[];for(let i=0;i<store.length;i++){const full=store.key(i);if(!full?.startsWith(PREFIX))continue;const key=full.slice(PREFIX.length);if(sets[area].has(key))rows.push({key,value:store.getItem(full)});}return rows.sort((a,b)=>a.key.localeCompare(b.key));}
export function createBackup(stores,{appVersion='0.8.0',now=new Date().toISOString()}={}){return {format:BACKUP_FORMAT,version:1,appVersion,createdAt:now,scope:'个人复盘、已保存配置、草稿与页内状态；不含浏览器其他站点数据，不含自动演示临时会话或历史证据原文。',stores:{local:collectOwned(stores.local,'local'),session:collectOwned(stores.session,'session')}};}
export function parseBackup(text){
 require(typeof text==='string'&&new TextEncoder().encode(text).length<=MAX_BACKUP_BYTES,'文件超过8MB上限或不是文本。');let payload;try{payload=JSON.parse(text);}catch{throw new Error('文件不是有效的 JSON，尚未更改工作区。');}safeJSON(payload);require(object(payload),'备份应为对象。');
 // v0.1–v0.6 exported notes are intentionally merge-only; do not delete unrelated data.
 if(payload.version===1&&object(payload.notes)&&!payload.format){const rows=Object.entries(payload.notes).map(([id,value])=>{require(noteIds.includes(id)&&typeof value==='string'&&value.length<=60000,'旧版笔记内容无效。');return {key:'note:'+id,value:JSON.stringify(value)};});require(rows.length>0,'旧版笔记为空。');return {format:BACKUP_FORMAT,version:1,legacyNotes:true,appVersion:'旧版笔记',createdAt:payload.exportedAt||null,stores:{local:rows,session:[]}};}
 require(payload.format===BACKUP_FORMAT&&payload.version===1,'不支持该备份格式／版本。这里只接收整工作区备份或旧版个人复盘笔记。');require(object(payload.stores),'备份缺少存储分区。');
 for(const area of ['local','session']){require(array(payload.stores[area],300),'备份存储分区无效。');const seen=new Set();for(const row of payload.stores[area]){require(object(row)&&typeof row.key==='string'&&sets[area].has(row.key),'备份包含不支持的键或错误分区。');require(!seen.has(row.key),'备份包含重复键。');seen.add(row.key);require(typeof row.value==='string','备份条目必须为JSON文本。');let value;try{value=JSON.parse(row.value);}catch{throw new Error('备份条目损坏：'+row.key);}safeJSON(value);require(validateValue(row.key,value),'备份数据结构不兼容：'+row.key);}}
 require(['local','session'].every(a=>Object.keys(payload.stores).includes(a)),'分区不完整');
 if(payload.legacyNotes===true)require(payload.stores.session.length===0&&payload.stores.local.every(x=>x.key.startsWith('note:')),'旧版笔记仅允许合并笔记键。');
 return {...payload,legacyNotes:payload.legacyNotes===true};
}
export function backupSummary(data){return ['local','session'].flatMap(area=>data.stores[area].map(x=>({area,key:x.key,bytes:new TextEncoder().encode(x.value).length})));}
export function restoreBackup(data,stores){
 const safe=parseBackup(JSON.stringify(data)); // Validate immediately before any mutation too.
 const before={local:collectOwned(stores.local,'local'),session:collectOwned(stores.session,'session')};
 try{for(const area of ['local','session']){const store=stores[area];if(!safe.legacyNotes)for(const row of before[area])store.removeItem(PREFIX+row.key);for(const row of safe.stores[area])store.setItem(PREFIX+row.key,row.value);for(const row of safe.stores[area])require(store.getItem(PREFIX+row.key)===row.value,'恢复后回读不一致。');}}
 catch(cause){let rollbackComplete=true;for(const area of ['local','session']){try{for(const row of collectOwned(stores[area],area))stores[area].removeItem(PREFIX+row.key);for(const row of before[area])stores[area].setItem(PREFIX+row.key,row.value);require(JSON.stringify(collectOwned(stores[area],area))===JSON.stringify(before[area]),'rollback mismatch');}catch{rollbackComplete=false;}}const error=new Error(rollbackComplete?'恢复失败，已回退到恢复前的工作区。':'恢复失败，存储持续拒绝写入，回退不完整。请保留刚下载的恢复前备份，勿关闭页面。');error.rollbackComplete=rollbackComplete;error.cause=cause;throw error;}
 return {restored:backupSummary(safe).length,legacyNotes:safe.legacyNotes};
}

/** Server and client share the same bounded allowlist; SQL stores never accept arbitrary browser keys. */
export function validateWorkspaceEntry(area,key,value){
 require(sets[area]?.has(key),'工作区键或分区不受支持：'+key);
 if(value===null)return;
 require(typeof value==='string'&&new TextEncoder().encode(value).length<=MAX_BACKUP_BYTES,'条目超过大小限制');
 let data;try{data=JSON.parse(value);}catch{throw new Error('条目不是有效JSON：'+key);}
 safeJSON(data);require(validateValue(key,data),'条目结构不兼容：'+key);
}
