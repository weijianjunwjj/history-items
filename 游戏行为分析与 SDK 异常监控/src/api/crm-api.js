import {clone,seedActivities,validateActivity,serializeActivity} from '../domain/crm.js';
/** Storage-backed mock API. No network, publishing, inventory consumption, or real draw. */
export function createCrmApi(storage,key='yyreplay:v1:crm:data'){
 function list(){const raw=storage.getItem(key);if(raw===null)return seedActivities();let db;try{db=JSON.parse(raw);}catch{throw new Error('本地 CRM 配置无法读取。请先导出已有资料，再恢复初始演示状态。');}if(db.version!==1||!Array.isArray(db.activities))throw new Error('本地 CRM 数据版本不兼容。');return clone(db.activities);}
 return {list,save(activity){const errors=validateActivity(activity);if(errors.length){const e=new Error(errors[0].message);e.validationErrors=errors;throw e;}const saved={...clone(activity),status:'saved',savedAt:new Date().toISOString()};const all=list();const i=all.findIndex(x=>x.id===saved.id);if(i<0)all.unshift(saved);else all[i]=saved;
  // Writing first means a quota failure must not be reported as a successful save.
  storage.setItem(key,JSON.stringify({version:1,activities:all}));return {saved:clone(saved),payload:serializeActivity(saved)};}};
}
