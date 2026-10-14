/** Reflection scaffolds only. Blank user fields are not evidence of past contribution. */
import {EVIDENCE} from '../shared/evidence.js';
export const RECAP_TRACKS=[
 {id:'report',title:'日志上报与页面配置',subtitle:'配置端：字段如何变成可查询的页面',route:'/report/events',evidence:['report'],steps:['定义事件与字段','配置列表／查询／详情','保存后重开','用预览核对配置'],question:'三个区域用了同一字段，为什么配置不能互相覆盖？',boundary:'既有 EBI 动态平台不是个人从零研发；本次效果预览、6层上限和快照策略不等于历史实现。'},
 {id:'analysis',title:'分析、设备与单用户查询',subtitle:'查询端：从一张图追到一台设备',route:'/ebi/funnel',evidence:['funnel','event','device','user'],steps:['图表选中日期','下钻设备并核对条件','分组后打开该组设备','查看同设备的局部模块'],question:'哪些是公共查询状态，哪些必须属于某个模块或弹窗？',boundary:'SDK→EBI 统一来源是本次新增串联；正常漏斗与异常快照是两套样本。VTable 仅维护／修 Bug，请求乱序保护不是当年的排障经历。'},
 {id:'crm',title:'CRM 活动与奖品配置',subtitle:'编辑端：选择、缓存、校验与保存',route:'/crm/activities',evidence:['crm'],steps:['修改奖品 A','切换 B 再回 A','组内概率超100%时阻断','修正后保存并重开'],question:'树负责选择、表单负责编辑时，谁拥有选中ID和未保存数据？',boundary:'复现不触发真实抽奖、发奖和库存操作；不是个人从零实现整套 CRM。概率限制为不超过100%，不是必须恰好100%。'},
 {id:'monitor',title:'SDK 监控与图表选择',subtitle:'监控端：共享顺序、局部草稿和下钻',route:'/monitor/overview',evidence:['monitor'],steps:['拖动监控卡片','打开选择器核对数量和顺序','打开铃铛详情','解释确认和取消的状态边界'],question:'为什么选择器取消不应污染页面？两个视图怎样共用顺序？',boundary:'历史开发讨论不等于完整大版本上线；当前告警处理、筛选和设备核对是本地演示，不是真实监控服务。'}
];
export const RECAP_FIELDS=[
 {id:'business',label:'业务问题',hint:'谁在用？需要解决什么问题？不要从技术栈开始。'},
 {id:'contribution',label:'我实际负责什么',hint:'写本人实现、在既有能力上改造或维护；不确定就保留待核实。'},
 {id:'dataflow',label:'数据和状态怎么走',hint:'选一个实际操作，按入口参数 → 状态 → 接口／转换 → 展示讲清。'},
 {id:'difficulty',label:'当时的具体问题与处理',hint:'只写确实记得的现象和改法。不把今天增加的保护编成过去的排障。'},
 {id:'outcome',label:'结果与证据',hint:'写能核实的结果；没有历史指标就不填百分比。'},
 {id:'correction',label:'待确认／和当年不同的地方',hint:'例如字段名、最终落地状态、原组件职责。这里不会覆盖原始证据。'}
];
export const RECALL_STATES={unreviewed:'尚未复盘',uncertain:'有待核实',recalled:'已自行回忆核对'};
export function trackById(id){return RECAP_TRACKS.find(x=>x.id===id)||RECAP_TRACKS[0];}
export function emptyRecap(){return {version:1,status:'unreviewed',updatedAt:null,...Object.fromEntries(RECAP_FIELDS.map(f=>[f.id,'']))};}
export function normalizeRecap(value){const result=emptyRecap();if(!value||typeof value!=='object')return result;result.status=Object.hasOwn(RECALL_STATES,value.status)?value.status:'unreviewed';result.updatedAt=typeof value.updatedAt==='string'?value.updatedAt:null;for(const f of RECAP_FIELDS)result[f.id]=typeof value[f.id]==='string'?value[f.id].slice(0,6000):'';return result;}
export function recapSummary(value){const v=normalizeRecap(value);return {filled:RECAP_FIELDS.filter(f=>v[f.id].trim()).length,status:RECALL_STATES[v.status]};}
export function referenceFor(track){return track.evidence.map(key=>({key,...EVIDENCE[key]}));}
export function renderRecapMarkdown(entries,now=new Date().toISOString()){
 const lines=['# 友谊时光 · 我的工作复盘','',`导出时间：${now}`,'','这是本人填写的复盘材料，不是公司证明或自动确认的历史成果。空项明确保留“待本人补充”；自述核对状态不代表独立核验。',''];
 for(const track of RECAP_TRACKS){const v=normalizeRecap(entries[track.id]);lines.push(`## ${track.title}`,'',`回忆状态：${RECALL_STATES[v.status]}`,'','### 30秒讲解顺序','',`业务问题：${v.business.trim()||'待本人补充'}`,`我的范围：${v.contribution.trim()||'待本人补充'}`,`结果与依据：${v.outcome.trim()||'待本人补充'}`,'','### 2分钟展开','');for(const f of RECAP_FIELDS)lines.push(`**${f.label}**`,v[f.id].trim()||'待本人补充','');lines.push('### 操作与追问','',track.steps.join(' → '),'',`追问：${track.question}`,'','### 不要混淆','',track.boundary,'','### 历史定位（索引，不是本次测量）','');for(const e of referenceFor(track))for(const s of e.sources)lines.push(`- ${s[0]} · ${s[1]} · ${s[2]}`);lines.push('');}
 return lines.join('\n');
}
