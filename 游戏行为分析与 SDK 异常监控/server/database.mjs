import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {EVENTS} from '../src/domain/data.js';
import {getMonitorSample,initialMonitorPreferences} from '../src/domain/monitor.js';
import {seedActivities,validateActivity} from '../src/domain/crm.js';
import {seedFields,seedEvents,validateField,validateEvent} from '../src/domain/report.js';
import {validateWorkspaceEntry} from '../src/domain/workspace.js';
export const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const stamp=()=>new Date().toISOString();
export class ConflictError extends Error {constructor(keys){super('另一个窗口已经修改了相同数据。当前修改未覆盖数据库；请先导出当前工作区，再刷新合并。');this.status=409;this.keys=keys;}}
export function openDatabase(path=resolve(ROOT,'data/replay.sqlite')){
 if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path,{timeout:5000});
 db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;');
 try {
  const v=Number(db.prepare('PRAGMA user_version').get().user_version);
  if(v>1)throw new Error('数据库版本高于本程序；未进行降级或覆盖。');
  if(v<1){db.exec('BEGIN IMMEDIATE');try{db.exec(readFileSync(resolve(ROOT,'server/migrations/001-initial.sql'),'utf8'));db.exec('PRAGMA user_version=1; COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}}
  seed(db);return new Repository(db,path);
 } catch(e){db.close();throw e;}
}
function seed(db){
 if(db.prepare('SELECT name FROM seed_versions WHERE name=?').get('v08-original-fixtures'))return;
 db.exec('BEGIN IMMEDIATE');try{
  const insert=db.prepare('INSERT INTO behavior_records VALUES(?,?,?,?,?,?,?,?,?)');
  for(const r of EVENTS)insert.run(r.id,r.date,r.timestamp,r.module,r.deviceId,r.channel,r.os,r.status,JSON.stringify(r));
  const sdk=db.prepare('INSERT INTO sdk_samples VALUES(?,?,?,?,?,?,?,?,?)');
  for(const r of getMonitorSample())sdk.run(r.id,r.eventId,r.day,r.minute,r.region,r.product,r.deviceId,r.os,r.reports);
  const defaults=[['crm:data',{version:1,activities:seedActivities()}],['report:data',{version:1,fields:seedFields(),events:seedEvents()}],['monitor:preferences',initialMonitorPreferences()]];
  for(const [key,value]of defaults){db.prepare('INSERT INTO workspace_state VALUES(?,?,?,?,?)').run('local',key,JSON.stringify(value),0,stamp());project(db,key,JSON.stringify(value));}
  db.prepare('INSERT INTO seed_versions VALUES(?,?)').run('v08-original-fixtures',stamp());db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}
}
function project(db,key,value){
 // Relational read models and the portable v0.7 snapshot commit in the SAME transaction.
 if(key==='crm:data'){
  const activities=value===null?seedActivities():JSON.parse(value).activities;
  for(const a of activities){const errors=a.status==='saved'?validateActivity(a):[];if(errors.length)throw new Error('CRM配置校验失败：'+errors[0].message);}
  db.exec('DELETE FROM crm_prizes; DELETE FROM crm_activities;');
  const aStmt=db.prepare('INSERT INTO crm_activities VALUES(?,?,?,?,?)'),pStmt=db.prepare('INSERT INTO crm_prizes VALUES(?,?,?,?,?,?,?)');
  for(const a of activities){aStmt.run(a.id,a.configName,a.gameProductId,a.status||'saved',JSON.stringify(a));for(const g of a.groups)for(const [i,p]of g.prizes.entries())pStmt.run(a.id,g.id,p.id,p.name,Number(p.probability)||0,i,JSON.stringify(p));}
 }
 if(key==='report:data'){
  const data=value===null?{fields:seedFields(),events:seedEvents()}:JSON.parse(value);
  for(const f of data.fields){const errors=validateField(f);if(errors.length)throw new Error('字段校验失败：'+errors[0]);}
  for(const e of data.events){const errors=validateEvent(e);if(errors.length)throw new Error('事件校验失败：'+errors[0].message);}
  db.exec('DELETE FROM report_fields; DELETE FROM report_events;');
  const fs=db.prepare('INSERT INTO report_fields VALUES(?,?,?,?)'),es=db.prepare('INSERT INTO report_events VALUES(?,?,?,?,?)');
  for(const f of data.fields)fs.run(f.id,f.alias,f.product,JSON.stringify(f));
  for(const e of data.events)es.run(e.id,e.alias,e.product,e.revision||0,JSON.stringify(e));
 }
}
export class Repository{
 constructor(db,path){this.db=db;this.path=path;this.closed=false;}
 workspace(){const stores={local:[],session:[]},versions={local:{},session:{}};for(const r of this.db.prepare('SELECT * FROM workspace_state ORDER BY area,key').all()){versions[r.area][r.key]=r.revision;if(r.value!==null)stores[r.area].push({key:r.key,value:r.value});}return {stores,versions,revision:this.db.prepare('SELECT revision FROM workspace_meta WHERE id=1').get().revision};}
 commit({requestId,operations}){
  if(typeof requestId!=='string'||!/^[a-zA-Z0-9:_-]{8,120}$/.test(requestId))throw new Error('请求标识无效');
  if(!Array.isArray(operations)||!operations.length||operations.length>100)throw new Error('提交条目数量无效');
  const hash=createHash('sha256').update(JSON.stringify(operations)).digest('hex');
  const old=this.db.prepare('SELECT * FROM committed_requests WHERE id=?').get(requestId);
  if(old){if(old.body_hash!==hash)throw new Error('相同请求标识不能用于不同内容');return {...JSON.parse(old.response),replayed:true};}
  const seen=new Set();for(const o of operations){if(!o||!Number.isSafeInteger(o.expected)||o.expected<0)throw new Error('缺少版本号');const id=o.area+':'+o.key;if(seen.has(id))throw new Error('提交中存在重复键');seen.add(id);validateWorkspaceEntry(o.area,o.key,o.value);}
  this.db.exec('BEGIN IMMEDIATE');try{
   const conflicts=[];for(const o of operations){const row=this.db.prepare('SELECT value,revision FROM workspace_state WHERE area=? AND key=?').get(o.area,o.key);if((row?.revision||0)!==o.expected&&(row?.value??null)!==o.value)conflicts.push({area:o.area,key:o.key});}
   if(conflicts.length)throw new ConflictError(conflicts);
   const rev=this.db.prepare('UPDATE workspace_meta SET revision=revision+1 WHERE id=1 RETURNING revision').get().revision;
   const upsert=this.db.prepare('INSERT INTO workspace_state VALUES(?,?,?,?,?) ON CONFLICT(area,key) DO UPDATE SET value=excluded.value,revision=excluded.revision,updated_at=excluded.updated_at');
   for(const o of operations){upsert.run(o.area,o.key,o.value,rev,stamp());if(o.area==='local')project(this.db,o.key,o.value);}
   const response={revision:rev,ack:operations.map(o=>({area:o.area,key:o.key,revision:rev})),committedAt:stamp()};
   this.db.prepare('INSERT INTO committed_requests VALUES(?,?,?)').run(requestId,hash,JSON.stringify(response));
   this.db.exec('COMMIT');return response;
  }catch(e){this.db.exec('ROLLBACK');throw e;}
 }
 datasets(){return {behavior:this.db.prepare('SELECT document FROM behavior_records ORDER BY timestamp,id').all().map(r=>JSON.parse(r.document)),monitor:this.sdkRows()};}
 sdkRows(where='',args=[]){return this.db.prepare(`SELECT id,event_id AS eventId,day,minute,region,product,device_id AS deviceId,os,reports FROM sdk_samples ${where}`).all(...args);}
 info(){const tables=['behavior_records','sdk_samples','crm_activities','crm_prizes','report_fields','report_events','workspace_state'];return {engine:'SQLite',sqlite:this.db.prepare('SELECT sqlite_version() version').get().version,schemaVersion:1,revision:this.workspace().revision,tables:tables.map(name=>({name,rows:this.db.prepare(`SELECT COUNT(*) n FROM ${name}`).get().n})),databaseFile:this.path,mode:'loopback-only',sampleNotice:'样本仍为固定模拟数据；不是生产日志。'};}
 backup(destination){if(existsSync(destination))throw new Error('备份目标已存在，未覆盖。');mkdirSync(dirname(destination),{recursive:true});this.db.prepare('VACUUM INTO ?').run(destination);return destination;}
 close(){if(!this.closed){this.db.close();this.closed=true;}}
}
