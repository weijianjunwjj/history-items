import {trace} from '../shared/trace.js';
import {clone,seedFields,seedEvents,validateField,validateEvent,changed} from '../domain/report.js';
/** Storage-backed simulated service; validation and persistence are atomic at the save boundary. */
export function createReportApi(storage,key='yyreplay:v1:report:data'){
 function load(){const raw=storage.getItem(key);if(raw===null)return {version:1,fields:seedFields(),events:seedEvents()};let data;try{data=JSON.parse(raw);}catch{throw new Error('日志配置存储损坏，未覆盖原数据。请先备份。');}if(data.version!==1||!Array.isArray(data.fields)||!Array.isArray(data.events))throw new Error('日志配置存储版本不兼容，未覆盖原数据。');return data;}
 function save(data){storage.setItem(key,JSON.stringify(data));}
 return {listFields:()=>clone(load().fields),listEvents:()=>clone(load().events),
 saveField(field){const errors=validateField(field);if(errors.length)throw new Error(errors[0]);const db=load();if(db.fields.some(f=>f.id!==field.id&&f.product===field.product&&f.alias===field.alias))throw new Error('同一产品已有该字段别名');const i=db.fields.findIndex(f=>f.id===field.id);if(i<0)db.fields.push(clone(field));else db.fields[i]=clone(field);save(db);return clone(field);},
 saveEvent(event){const errors=validateEvent(event);if(errors.length){const error=new Error(errors[0].message);error.validationErrors=errors;throw error;}const db=load();if(db.events.some(e=>e.id!==event.id&&e.product===event.product&&e.alias===event.alias))throw new Error('同一产品已有该事件别名');const i=db.events.findIndex(e=>e.id===event.id),prior=db.events[i];if(prior&&!changed(event,prior))return {saved:clone(prior),unchanged:true};const saved={...clone(event),revision:(prior?.revision||0)+1,savedAt:new Date().toISOString()};if(i<0)db.events.unshift(saved);else db.events[i]=saved;save(db);trace('mutation','saveEvent',{id:saved.id,alias:saved.alias},{revision:saved.revision,dataSource:saved.dataSource||'report training fixture'});return {saved:clone(saved),unchanged:false};}
 };
}
