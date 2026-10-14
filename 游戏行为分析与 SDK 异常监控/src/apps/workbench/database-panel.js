import {sqlClient,flushStorage} from '../../shared/store.js';
import {esc,button} from '../../shared/dom.js';
import {UNIFIED_DEFAULT} from '../../domain/unified.js';
export function createDatabasePanel(root,services){let alive=true,info=sqlClient()?.database,result=null,error='';
 function render(){if(!alive)return;const state=sqlClient()?.snapshot();root.innerHTML=`<div class="page-heading"><div><div class="eyebrow">LOCAL PROJECT / SQLITE</div><h1>本地数据库与服务</h1><p>配置、草稿、笔记写入本机SQL；示例数据仍是模拟样本，不连接公司服务。</p></div>${button('工作区导入 / 导出','db-backup','','btn primary')}</div><section class="panel"><div class="panel-head"><h2>${state?'Node HTTP → SQLite':'独立演示：临时内存'}</h2><span class="tag">v0.8</span></div><p>${state?`数据库：<code>${esc(info?.databaseFile)}</code> · SQLite ${esc(info?.sqlite)} · Schema ${info?.schemaVersion} · 服务端修订 ${info?.revision}`:'自动演示不会写入你的SQLite。请返回主工作区查看本地服务。'}</p><p class="notice">${esc(state?.error||error||'保存按钮等待数据库确认；输入时先暂存并异步写入。发生离线或版本冲突时不假报保存成功。')}</p><div class="wb-actions">${button('刷新数据库状态','db-refresh')}${button('提交待写入数据','db-flush')}${button('SQL核对 10台 / 25次','db-query')}</div><div class="table-scroll"><table><thead><tr><th>实际SQL表</th><th>行数</th></tr></thead><tbody>${(info?.tables||[]).map(t=>`<tr><td><code>${esc(t.name)}</code></td><td>${t.rows}</td></tr>`).join('')}</tbody></table></div>${result?`<pre id="db-query-result">${esc(JSON.stringify(result,null,2))}</pre>`:''}</section><section class="panel"><h2>实际数据路径</h2><pre class="sql-architecture">Shell 菜单 / 多页签 / URL
  → 独立 ESM 子应用入口 → bootstrap / mount / update / unmount
  → 异步 HTTP API → 参数校验 → SQL 参数化查询 / 事务
  → 固定业务转换 → mapper → 页面状态 → 图表 / 表格

配置 / 笔记 / 草稿 → 待写缓存 → 版本检查 → SQLite COMMIT → 已同步
旧 v0.7 工作区 JSON → 预览 / 确认 → 同一事务恢复 → 刷新重读
19站自动演示 → 独立临时内存 → 不覆盖主工作区SQL</pre><p>SQLite 内保存了活动、奖品、字段、事件的结构化表；复杂字段树保留JSON。暂存接口兼容旧版键名，避免为了换存储重写业务。正常行为样本和SDK计数样本分表，不伪造缺失的正常行为。</p><p>原生ESM宿主不是single-spa。它有独立入口和生命周期，不含生产级脚本沙箱、独立依赖版本治理或跨域部署。</p></section>`;}
 async function refresh(){if(!sqlClient())return;const r=await fetch('/api/database');if(!r.ok)throw new Error('服务状态读取失败');info=await r.json();}
 async function click(e){const a=e.target.closest('[data-act]')?.dataset.act;try{if(a==='db-backup')services.navigate('/workbench/data');if(a==='db-refresh'){await refresh();error='';render();}if(a==='db-flush'){await flushStorage();await refresh();error='';render();}if(a==='db-query'){if(!sqlClient())throw new Error('独立演示不发SQL请求');result=await sqlClient().query('summary',{q:{...UNIFIED_DEFAULT,sdkFrom:240,sdkTo:270}});error='';render();}}catch(e){error=e.message;render();}}
 root.addEventListener('click',click);render();refresh().then(render).catch(e=>{error=e.message;render();});return {destroy(){alive=false;root.removeEventListener('click',click);}};
}
