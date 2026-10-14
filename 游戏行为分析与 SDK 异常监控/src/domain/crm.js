/** New, sanitized reconstruction. Demo enums/payload are NOT the production API contract. */
export const GAMES=[{id:'game-a',name:'示例游戏 · 星河'},{id:'game-b',name:'示例游戏 · 云海'},{id:'common',name:'通用奖池'}];
export const PRIZE_TYPES=[{id:'physical',name:'实物奖品'},{id:'game_item',name:'游戏道具'},{id:'virtual',name:'虚拟礼包'}];
export const COMPONENTS=[{id:'wheel',name:'幸运转盘'},{id:'cards',name:'翻牌抽奖'}];
export const clone=value=>JSON.parse(JSON.stringify(value));
export function makePrize(id){return {id,name:'',type:'physical',probability:0,stock:100,minStock:10,sku:'',gameResource:'',singleLimitType:'none',singleLimit:1,limitTimeType:'activity',limitTime:7};}
export function makeActivity(id){return {id,configName:'',componentType:'wheel',activityId:'DEMO-ACT-01',gameProductId:'game-a',rewardRule:'',groups:[{id:id+'-g1',productId:'game-a',prizes:[makePrize(id+'-p1')]}],status:'draft',savedAt:null};}
export function seedActivities(){
 const a=makeActivity('DEMO-CFG-001');Object.assign(a,{configName:'春日回馈 · 幸运转盘',rewardRule:'中奖后请按奖品说明提交领奖信息。所有奖品均为本地模拟，不会实际发放。',status:'saved',savedAt:'2026-03-10T08:00:00.000Z'});
 a.groups[0].prizes=[{...makePrize('P-01'),name:'星河周边礼盒',probability:25,stock:120,minStock:10,sku:'SIM-SKU-001',singleLimitType:'custom',singleLimit:1,limitTimeType:'days',limitTime:7},{...makePrize('P-02'),name:'游戏道具礼包',type:'game_item',gameResource:'SIM-ITEM-1001 × 10',probability:50,stock:600,minStock:50}];
 a.groups.push({id:'G-COMMON',productId:'common',prizes:[{...makePrize('P-03'),name:'通用虚拟礼包',type:'virtual',probability:80,stock:300,minStock:10}]});
 const b=makeActivity('DEMO-CFG-002');Object.assign(b,{configName:'新客欢迎 · 礼包配置',componentType:'cards',activityId:'DEMO-ACT-02',gameProductId:'game-b'});b.groups[0].productId='game-b';Object.assign(b.groups[0].prizes[0],{id:'P-04',name:'欢迎礼包',type:'virtual',probability:60,stock:500});
 return [a,b];
}
export const gameName=id=>GAMES.find(g=>g.id===id)?.name||'未知产品';
export const typeName=id=>PRIZE_TYPES.find(g=>g.id===id)?.name||'未知类型';
export function asNumber(value){return (typeof value==='number'||typeof value==='string')&&String(value).trim()!==''?Number(value):NaN;}
export function groupProbability(group){return group.prizes.reduce((sum,p)=>sum+(Number.isFinite(asNumber(p.probability))?asNumber(p.probability):0),0);}
export function validateActivity(a,{through=2}={}){
 const errors=[];const add=(step,field,message,groupId='',prizeId='')=>errors.push({step,field,message,groupId,prizeId});
 if(!a||!Array.isArray(a.groups)){add(0,'configName','配置结构无效。');return errors;}
 if(!String(a.configName||'').trim())add(0,'configName','请输入配置名称。');
 if(!COMPONENTS.some(x=>x.id===a.componentType))add(0,'componentType','请选择有效的组件类型。');
 if(!['DEMO-ACT-01','DEMO-ACT-02','DEMO-ACT-03'].includes(a.activityId))add(0,'activityId','请选择关联活动。');
 if(!GAMES.some(x=>x.id===a.gameProductId&&x.id!=='common'))add(0,'gameProductId','请选择游戏产品。');
 if(through<1)return errors;
 if(!a.groups.length)add(1,'groups','至少保留一个产品组。');
 const groupIds=new Set(),prizeIds=new Set(),products=new Set();
 for(const g of a.groups){
  if(!g.id||groupIds.has(g.id))add(1,'groups','产品组标识缺失或重复。',g.id);groupIds.add(g.id);
  if(!GAMES.some(x=>x.id===g.productId)||products.has(g.productId))add(1,'groups','产品组不存在或重复。',g.id);products.add(g.productId);
  if(!Array.isArray(g.prizes)||!g.prizes.length){add(1,'groups',gameName(g.productId)+'：至少添加一个奖品。',g.id);continue;}
  if(groupProbability(g)>100+1e-8)add(1,'probability',gameName(g.productId)+'：总概率不能超过 100%。',g.id);
  for(const p of g.prizes){
   const err=(f,msg)=>add(1,f,msg,g.id,p.id);const label=p.name||'未命名奖品';
   if(!p.id||prizeIds.has(p.id))err('id','奖品标识缺失或重复。');prizeIds.add(p.id);
   if(!String(p.name||'').trim())err('name','请输入奖品名称。');
   if(!PRIZE_TYPES.some(x=>x.id===p.type))err('type',label+'：请选择奖品类型。');
   const probability=asNumber(p.probability);if(!Number.isFinite(probability)||probability<0||probability>100)err('probability',label+'：中奖概率需为 0～100 的数字。');
   for(const [f,n]of [['stock','奖品库存'],['minStock','最低库存']])if(!Number.isSafeInteger(asNumber(p[f]))||asNumber(p[f])<0)err(f,label+'：'+n+'需为非负整数。');
   if(p.type==='physical'&&!String(p.sku||'').trim())err('sku',label+'：实物奖品需要 SKU 编码。');
   if(p.type==='game_item'){
    if(g.productId==='common')err('type','通用奖池不能配置游戏道具，请选择游戏产品组。');
    if(!String(p.gameResource||'').trim())err('gameResource',label+'：请输入游戏资源。');
   }
   if(!['none','custom'].includes(p.singleLimitType))err('singleLimitType','单人限制类型无效。');
   if(p.singleLimitType==='custom'&&(!Number.isSafeInteger(asNumber(p.singleLimit))||asNumber(p.singleLimit)<1))err('singleLimit',label+'：单人上限需为正整数。');
   if(!['activity','days'].includes(p.limitTimeType))err('limitTimeType','限领方式无效。');
   if(p.limitTimeType==='days'&&(!Number.isSafeInteger(asNumber(p.limitTime))||asNumber(p.limitTime)<1))err('limitTime',label+'：限领天数需为正整数。');
  }
 }
 if(through>=2&&!String(a.rewardRule||'').trim())add(2,'rewardRule','请填写领奖规则。');
 return errors;
}
/** Hidden values remain in editing cache, but are deliberately omitted from the demo submission. */
export function serializeActivity(a){return {id:a.id,configName:String(a.configName).trim(),componentType:a.componentType,activityId:a.activityId,gameProductId:a.gameProductId,rewardRule:String(a.rewardRule||'').trim(),groups:a.groups.map((g,i)=>({id:g.id,productId:g.productId,order:i+1,prizes:g.prizes.map((p,j)=>({id:p.id,name:String(p.name).trim(),type:p.type,probability:asNumber(p.probability),stock:asNumber(p.stock),minStock:asNumber(p.minStock),order:j+1,...(p.type==='physical'?{sku:String(p.sku).trim()}:{}),...(p.type==='game_item'?{gameResource:String(p.gameResource).trim()}:{}),singleLimitType:p.singleLimitType,...(p.singleLimitType==='custom'?{singleLimit:asNumber(p.singleLimit)}:{}),limitTimeType:p.limitTimeType,...(p.limitTimeType==='days'?{limitTime:asNumber(p.limitTime)}:{})}))}))};}
export function movePrize(group,prizeId,targetIndex){const from=group.prizes.findIndex(p=>p.id===prizeId);if(from<0||!Number.isInteger(targetIndex)||targetIndex<0||targetIndex>=group.prizes.length)return false;group.prizes.splice(targetIndex,0,group.prizes.splice(from,1)[0]);return true;}
export function removePrize(group,prizeId){const i=group.prizes.findIndex(p=>p.id===prizeId);if(i<0)return null;group.prizes.splice(i,1);return group.prizes[Math.min(i,group.prizes.length-1)]?.id||null;}
