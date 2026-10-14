import {DEFAULT_CONTEXT} from './data.js';
export const ROUTES={
 '/journey':{title:'业务流程总览',group:'全局导览'},'/journey/source':{title:'统一上报样本',group:'全局导览'},'/journey/architecture':{title:'技术架构与调用',group:'全局导览'},
 '/ebi/funnel':{title:'漏斗详情',group:'行为分析'},'/ebi/event':{title:'事件分析',group:'行为分析'},
 '/ebi/device':{title:'设备日志明细',group:'行为查询'},'/ebi/user':{title:'单用户行为查询',group:'行为查询'},
 '/report/fields':{title:'通用字段定义',group:'日志上报配置'},'/report/events':{title:'上报事件与页面配置',group:'日志上报配置'},
 '/crm/activities':{title:'活动与抽奖配置',group:'CRM 营销配置'},
 '/monitor/overview':{title:'实时异常事件监控',group:'SDK 监控'},
 '/workbench/database':{title:'本地数据库与服务',group:'工作复盘'},
 '/workbench':{title:'架构与覆盖清单',group:'工作复盘'},
 '/workbench/recap':{title:'我的复盘讲解',group:'工作复盘'},'/workbench/data':{title:'备份与运行检查',group:'工作复盘'}
};
export function parseRoute(hash){const text=(hash||'').replace(/^#/,'')||'/journey';const i=text.indexOf('?');const path=i<0?text:text.slice(0,i);return {path,query:Object.fromEntries(new URLSearchParams(i<0?'':text.slice(i+1)))};}
export function toHash(path,query={}){const params=new URLSearchParams();for(const [k,v]of Object.entries(query))if(v!==undefined&&v!==null&&v!=='')params.set(k,String(v));return '#'+path+(params.size?'?'+params:'');}
export function defaultRoute(path){return toHash(path,path.startsWith('/ebi')?{...DEFAULT_CONTEXT,...(path==='/ebi/user'?{deviceId:'DEMO-D1001'}:{})}:{});}
