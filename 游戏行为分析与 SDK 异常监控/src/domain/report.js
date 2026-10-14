/** New, sanitized reconstruction of report configuration. No company schema/SDK.
 * MAX_TREE_DEPTH and enum values are explicit demo choices, not historical claims.
 */
import {projectUnified} from './unified.js';
export const MAX_TREE_DEPTH=6;
export const PANELS={list:'列表展示',query:'查询条件',detail:'详情页'};
export const DATA_TYPES=['string','number','boolean','datetime','object'];
export const PRODUCTS=[['all','通用'],['star','星河纪事（模拟）'],['garden','花园物语（模拟）']];
export const REPORT_TYPES=[['client','客户端（模拟）'],['server','服务端（模拟）']];
export const MODELS=[['behavior','行为日志模型（模拟）'],['exception','异常日志模型（模拟）']];
export const clone=v=>JSON.parse(JSON.stringify(v));
export const uid=prefix=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export const isContainer=f=>f?.dataType==='object';
const aliasPattern=/^[A-Za-z_][A-Za-z0-9_]{0,29}$/;
const reserved=new Set(['__proto__','prototype','constructor']);
const validAlias=v=>aliasPattern.test(v||'')&&!reserved.has(v);
const has=(obj,k)=>Object.prototype.hasOwnProperty.call(obj,k);
export function makeField(id=uid('F')){return {id,product:'all',name:'',alias:'',reportType:'client',dataType:'string',restriction:'optional',supportQuery:true,description:''};}
export function seedFields(){return [
 {...makeField('F-device'),name:'设备标识',alias:'device_id',restriction:'required'},
 {...makeField('F-channel'),name:'渠道',alias:'channel'},
 {...makeField('F-time'),name:'上报时间',alias:'reported_at',dataType:'datetime',restriction:'required'},
 {...makeField('F-level'),name:'角色等级',alias:'level',dataType:'number'},
 {...makeField('F-success'),name:'是否成功',alias:'success',dataType:'boolean'},
 {...makeField('F-context'),name:'扩展信息',alias:'context',dataType:'object',supportQuery:false},
 {...makeField('F-raw'),name:'原始报文',alias:'raw_payload',supportQuery:false,description:'此字段不可加入查询条件。'},
 {...makeField('F-os'),name:'操作系统',alias:'os'}
 ];}
export function nodeFromField(field,id=uid('N')){return {...clone(field),id,libraryId:field.id,children:[]};}
export function walk(nodes,parentId='',path='',depth=1){const out=[];for(const node of nodes){const full=path?path+'.'+node.alias:node.alias;out.push({node,parentId,path:full,depth});out.push(...walk(node.children||[],node.id,full,depth+1));}return out;}
export function findNode(event,id){return walk(event.fields).find(x=>x.node.id===id)?.node||null;}
export function subtreeIds(node){return walk([node]).map(x=>x.node.id);}
export function makeEvent(id=uid('EV')){return {id,name:'',alias:'',product:'star',reportType:'client',model:'behavior',description:'',fields:[],panels:{list:[],query:[],detail:[]},revision:0,savedAt:null};}
export function makeItem(node){return {nodeId:node.id,label:node.name,width:160,queryConfig:{label:node.name,operator:node.dataType==='string'?'contains':'eq',required:false}};}
export function seedEvents(){const e={...makeEvent('DEMO-EVT-001'),name:'设备启动上报',alias:'device_start',description:'固定模拟事件，用于回忆字段定义与页面配置。',revision:1};
 const f=seedFields();e.fields=[0,1,2,5,6].map((i,j)=>nodeFromField(f[i],`N-${j+1}`));e.fields[3].children=[nodeFromField(f[3],'N-level'),nodeFromField(f[7],'N-os')];
 e.panels.list=['N-1','N-2','N-3','N-level'].map(id=>makeItem(findNode(e,id)));
 e.panels.query=['N-2','N-level'].map(id=>makeItem(findNode(e,id)));
 e.panels.detail=['N-1','N-2','N-3','N-level','N-os','N-5'].map(id=>makeItem(findNode(e,id)));return [e];}
export function validateField(f){const errors=[];
 if(!String(f.name||'').trim()||f.name.length>30)errors.push('字段名称必填，最多 30 字');
 if(!validAlias(f.alias))errors.push('字段别名需为不超过 30 位的英文标识符，不能使用保留名称');
 if(!DATA_TYPES.includes(f.dataType))errors.push('请选择有效数据类型');
 if(!PRODUCTS.some(x=>x[0]===f.product))errors.push('请选择游戏产品');
 if(!REPORT_TYPES.some(x=>x[0]===f.reportType))errors.push('请选择上报类型');
 if(!['required','optional'].includes(f.restriction))errors.push('请选择上报限制');
 if(typeof f.supportQuery!=='boolean')errors.push('查询支持必须为布尔值');
 if(isContainer(f)&&f.supportQuery)errors.push('本演示对象节点只作容器，不可直接查询');return errors;
}
export function validateBase(event){const errors=[];
 if(!String(event.name||'').trim()||event.name.length>30)errors.push('事件名称必填，最多 30 字');
 if(!validAlias(event.alias))errors.push('事件别名需为不超过 30 位的英文标识符，不能使用保留名称');
 if(!PRODUCTS.some(x=>x[0]===event.product))errors.push('请选择游戏产品');
 if(!REPORT_TYPES.some(x=>x[0]===event.reportType))errors.push('请选择上报类型');
 if(!MODELS.some(x=>x[0]===event.model))errors.push('请选择所属模型');return errors;
}
export function validateTree(event){const errors=[],ids=new Set();
 if(!event.fields.length)errors.push({step:1,message:'至少添加一个事件字段'});
 function visit(nodes,depth){const aliases=new Set();for(const n of nodes){
  for(const message of validateField(n))errors.push({step:1,nodeId:n.id,message});
  if(ids.has(n.id))errors.push({step:1,nodeId:n.id,message:'字段 ID 重复'});ids.add(n.id);
  if(aliases.has(n.alias))errors.push({step:1,nodeId:n.id,message:'同级字段别名不可重复'});aliases.add(n.alias);
  if(depth>MAX_TREE_DEPTH)errors.push({step:1,nodeId:n.id,message:`字段树超过演示深度上限 ${MAX_TREE_DEPTH}`});
  if(!isContainer(n)&&n.children?.length)errors.push({step:1,nodeId:n.id,message:'只有对象字段可以有下级节点'});
  visit(n.children||[],depth+1);
 }}visit(event.fields,1);return errors;
}
export function operators(node){return node.dataType==='number'?[['eq','等于'],['gte','大于等于'],['lte','小于等于']]:node.dataType==='string'?[['contains','包含'],['eq','等于']]:[['eq','等于']];}
export function validateItem(event,panel,item){const n=findNode(event,item.nodeId);if(!n)return '关联字段不存在';
 if(panel==='query'){
  if(!n.supportQuery||isContainer(n))return '该字段不可作为查询条件';
  if(!String(item.queryConfig?.label||'').trim())return '查询显示文案不能为空';
  if(!operators(n).some(x=>x[0]===item.queryConfig?.operator))return '查询操作符与字段数据类型不兼容';
 }else if(!String(item.label||'').trim())return '显示文案不能为空';
 if(panel==='list'&&(!Number.isInteger(Number(item.width))||Number(item.width)<80||Number(item.width)>600))return '列宽应为 80～600 的整数（演示约束）';return '';
}
export function validateEvent(event){const errors=validateBase(event).map(message=>({step:0,message}));errors.push(...validateTree(event));
 if(!event.panels.list.length)errors.push({step:2,panel:'list',message:'列表展示至少保留一个字段（演示约束）'});
 for(const panel of Object.keys(PANELS)){const seen=new Set();for(const item of event.panels[panel]){const msg=validateItem(event,panel,item);if(msg)errors.push({step:2,panel,nodeId:item.nodeId,message:msg});if(seen.has(item.nodeId))errors.push({step:2,panel,nodeId:item.nodeId,message:'同一区域不可重复配置字段'});seen.add(item.nodeId);}}return errors;
}
export function addToPanel(event,panel,nodeId){if(!has(PANELS,panel))throw new Error('未知配置区域');const n=findNode(event,nodeId);if(!n)throw new Error('字段不存在');if(panel==='query'&&(!n.supportQuery||isContainer(n)))throw new Error('该字段不可作为查询条件');if(event.panels[panel].some(x=>x.nodeId===nodeId))throw new Error('该字段已在当前区域，不可重复加入');event.panels[panel].push(makeItem(n));}
export function reorder(items,id,to,key='nodeId'){const i=items.findIndex(x=>x[key]===id);if(i<0||!Number.isInteger(to)||to<0||to>=items.length||i===to)return false;items.splice(to,0,items.splice(i,1)[0]);return true;}
export function addNode(event,field,parentId='',id=uid('N')){const parent=parentId?findNode(event,parentId):null;if(parentId&&!parent)throw new Error('上级字段不存在');if(parent&&!isContainer(parent))throw new Error('只能添加到对象字段下');const list=parent?parent.children:event.fields;
 if(list.some(n=>n.alias===field.alias))throw new Error('同级字段别名不可重复');const depth=parent?walk(event.fields).find(x=>x.node.id===parent.id).depth+1:1;if(depth>MAX_TREE_DEPTH)throw new Error(`最多 ${MAX_TREE_DEPTH} 层（演示上限）`);const n=nodeFromField(field,id);list.push(n);return n;
}
export function moveNode(event,id,parentId=''){const flat=walk(event.fields),entry=flat.find(x=>x.node.id===id),parent=parentId?flat.find(x=>x.node.id===parentId):null;if(!entry)throw new Error('字段不存在');if(parentId&&!parent)throw new Error('上级字段不存在');if(parent&&!isContainer(parent.node))throw new Error('只能移动到对象字段下');if(subtreeIds(entry.node).includes(parentId))throw new Error('不能移动到自身或后代节点下');if(entry.parentId===parentId)return false;
 const subtreeDepth=Math.max(...walk([entry.node]).map(x=>x.depth));if((parent?.depth||0)+subtreeDepth>MAX_TREE_DEPTH)throw new Error(`移动后超过 ${MAX_TREE_DEPTH} 层`);
 const target=parent?parent.node.children:event.fields;if(target.some(x=>x.alias===entry.node.alias))throw new Error('目标层级存在同名别名');const source=entry.parentId?findNode(event,entry.parentId).children:event.fields;source.splice(source.indexOf(entry.node),1);target.push(entry.node);return true;
}
export function removeNode(event,id){const entry=walk(event.fields).find(x=>x.node.id===id);if(!entry)return false;const gone=new Set(subtreeIds(entry.node)),source=entry.parentId?findNode(event,entry.parentId).children:event.fields;source.splice(source.indexOf(entry.node),1);for(const p of Object.keys(PANELS))event.panels[p]=event.panels[p].filter(x=>!gone.has(x.nodeId));return true;}
/** Include meaningful editor data, including inactive cached config, but not save metadata. */
export function semanticSnapshot(event){const {revision,savedAt,...body}=event;return JSON.stringify(body);}
export function changed(event,baseline){return !baseline||semanticSnapshot(event)!==semanticSnapshot(baseline);}
export function serializeEvent(event){return {...(event.dataSource?{dataSource:event.dataSource,sdkScope:clone(event.sdkScope)}:{}),id:event.id,name:event.name,alias:event.alias,product:event.product,reportType:event.reportType,model:event.model,description:event.description,fields:clone(event.fields),panels:Object.fromEntries(Object.keys(PANELS).map(p=>[p,event.panels[p].map((x,i)=>({nodeId:x.nodeId,path:walk(event.fields).find(f=>f.node.id===x.nodeId)?.path,order:i+1,...(p==='query'?{queryConfig:clone(x.queryConfig)}:{label:x.label,...(p==='list'?{width:Number(x.width)}:{})})}))]))};}
/** Deterministic samples indexed by node id; same sample feeds list/filter/detail. */
export function sampleRows(event,count=24){const fields=walk(event.fields);if(event.dataSource==='sdk')return projectUnified(event,fields);return Array.from({length:count},(_,i)=>{const values={};for(const {node:n,path}of fields){let v;
 if(isContainer(n)){v='{ 模拟嵌套对象 }';}else if(n.dataType==='number')v=5+(i%8)*5;else if(n.dataType==='boolean')v=i%2===0;else if(n.dataType==='datetime')v=`2025-10-${String(20+i%4).padStart(2,'0')} 10:${String(i%60).padStart(2,'0')}:00`;else if(n.alias==='device_id')v=`DEMO-D${1001+i}`;else if(n.alias==='channel')v=['官方渠道','渠道 A','渠道 B'][i%3];else if(n.alias==='os')v=['Android','iOS'][i%2];else v=`${n.name} · 样本${i%5+1}`;
 values[n.id]=v;}
 return {id:`SAMPLE-${i+1}`,values};});}
export function filterRows(event,filters={}){const items=event.panels.query;return sampleRows(event).filter(row=>items.every(item=>{const input=String(filters[item.nodeId]??'').trim();if(!input)return true;const node=findNode(event,item.nodeId),v=row.values[item.nodeId],op=item.queryConfig.operator;if(node.dataType==='number'){const n=Number(input);return Number.isFinite(n)&&(op==='gte'?v>=n:op==='lte'?v<=n:v===n);}return op==='contains'?String(v).toLowerCase().includes(input.toLowerCase()):String(v)===input;}));}
