import {makeEvent,makeField,nodeFromField,makeItem} from './report.js';
import {UNIFIED_DEFAULT,unifiedContext} from './unified.js';
export const FLOW_STEPS=[{key:'define',label:'事件与字段配置',path:'/report/events',question:'什么事件、哪些字段、怎样展示？',detail:'配置管理定义数据语义；不等同于真实 SDK 上报。'},
 {key:'source',label:'统一上报样本',path:'/journey/source',question:'数据实际来自哪里？',detail:'固定 SDK 快照是主线唯一事实源；每条 reports 展开为可追溯记录。'},
 {key:'monitor',label:'监控发现异常',path:'/monitor/overview',question:'哪个时段、产品或平台异常？',detail:'从图表时段或铃铛定位窗口，再带同一条件下钻。'},
 {key:'analysis',label:'事件分析',path:'/ebi/event',question:'多少次，多少台，是否同一口径？',detail:'从同一批记录计算 PV / UV，不按页面重新造数据。'},
 {key:'devices',label:'设备与分组',path:'/ebi/device',question:'究竟是哪些设备？',detail:'保留日期、窗口、事件、大区、产品、平台与设备标识。'},
 {key:'user',label:'单用户定位',path:'/ebi/user',question:'这台设备留下了什么记录？',detail:'异常模块展示同一设备；其他六模块没数据就留空，不编造行为。'}];
export function definitionId(q={}){return 'DEMO-SDK-'+(q.sdkEventId||'login');}
export function buildDefinition(q={}){const scope=unifiedContext(q),e=makeEvent(definitionId(scope));e.name='SDK '+scope.sdkEventId+' 异常上报（联动演示）';e.alias='sdk_'+scope.sdkEventId+'_error';e.product='all';e.dataSource='sdk';e.sdkScope=scope;e.description='本次新增联动配置，非历史原协议；SDK快照→投影字段→监控→EBI。';
 const fs=[['device_id','设备标识'],['user_id','用户标识（模拟关联）'],['reported_at','上报时间'],['event_id','SDK事件'],['product','产品'],['region','大区'],['os','操作系统'],['report_id','明细记录ID'],['source_id','原始样本ID']];
 e.fields=fs.map(([alias,name],i)=>nodeFromField({...makeField('F-bridge-'+alias),alias,name,description:'联动样本字段；不是公司字段全集。'},'N-bridge-'+i));
 e.panels.list=[0,2,4,6].map(i=>makeItem(e.fields[i]));e.panels.query=[0,4,6].map(i=>makeItem(e.fields[i]));e.panels.detail=e.fields.map(makeItem);return e;}
export function flowDestination(key,input={},deviceId=''){const q=unifiedContext(input);const step=FLOW_STEPS.find(s=>s.key===key);if(!step)throw new Error('未知流程步骤');const query={...q};if(key==='define')query.definitionId=definitionId(q);if(key==='user'&&deviceId)query.deviceId=deviceId;return {path:step.path,query};}
