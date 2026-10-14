import {installSqlStatus} from '../shared/sql-status.js';
import {sqlClient,flushStorage} from '../shared/store.js';
import {createAutoDemo} from '../shared/auto-demo.js';
import {renderGuide} from '../shared/flow-guide.js';
import {trace} from '../shared/trace.js';
import {createRuntime} from './runtime.js';
import {ROUTES,parseRoute,toHash,defaultRoute} from '../domain/route.js';
import {esc,icon} from '../shared/dom.js';
import {read,write,resetPreferences,persistentStorageAvailable,inDemoSession} from '../shared/store.js';
const demoSession=inDemoSession();if(demoSession&&!window.__REPLAY_DEMO_SESSION__)Object.defineProperty(window,'__REPLAY_DEMO_SESSION__',{value:true});const autoDemo=demoSession?null:createAutoDemo({entryUrl:import.meta.url});
const shell=document.querySelector('#shell');let tabs=read('tabs',[]).filter(t=>ROUTES[t.path]);let toastTimer;
const nav=(path,glyph)=>`<button class="nav-item" data-shell="nav" data-path="${path}">${icon(glyph)}<span>${ROUTES[path].title}</span></button>`;
shell.innerHTML=`<aside class="sidebar"><div class="brand"><div class="brand-mark">Y<span>·</span></div><div><strong>工作复盘</strong><small>YOUYI WORK REPLAY</small></div></div><div class="workspace-chip"><span class="workspace-icon">E</span><div><b>友谊时光 · EBI / CRM</b><small>脱敏功能复现</small></div><span class="status-dot"></span></div><nav><div class="nav-label">全局导览</div>${nav('/journey','layers')}${nav('/journey/architecture','book')}<div class="nav-label">行为分析</div>${nav('/ebi/funnel','chart')}${nav('/ebi/event','layers')}<div class="nav-label">行为查询</div>${nav('/ebi/device','table')}${nav('/ebi/user','user')}<div class="nav-label">日志上报配置</div>${nav('/report/fields','table')}${nav('/report/events','settings')}<div class="nav-label">CRM 营销配置</div>${nav('/crm/activities','layers')}<div class="nav-label">SDK 监控</div>${nav('/monitor/overview','chart')}<div class="nav-label">工作复盘</div>${nav('/workbench','book')}${nav('/workbench/recap','book')}${nav('/workbench/data','download')}${nav('/workbench/database','table')}</nav><div class="sidebar-bottom"><span class="version-pill">v0.8 · 本地 SQL</span><p>先操作，再回忆。<br>每一处复现都保留贡献边界。</p><button data-shell="reset" class="reset-link">${icon('reset',15)} 恢复初始演示状态</button></div></aside>
<div class="workspace"><header class="topbar"><div class="breadcrumb" id="breadcrumb"></div><div class="topbar-right">${demoSession?'':'<button type="button" class="btn primary demo-start" data-shell="demo">▶ 自动演示</button>'}<span class="demo-pill"><i></i> ${demoSession?'独立演示 · 仅临时内存':sqlClient()?'SQLite · 固定模拟样本':persistentStorageAvailable?'本地模拟数据':'临时会话 · 存储受限'}</span><span class="avatar">魏</span></div></header><div class="tabbar" id="tabbar"></div><div id="journey-guide" class="j-guide" hidden></div><main id="micro-content" class="main-content"></main><footer class="app-footer"><span>个人复盘演示 · 非公司生产系统</span><span id="runtime-state">Native ESM · 准备加载</span></footer></div><div id="toast" class="toast" role="status" aria-live="polite" hidden></div>`;
function toast(message,error=false){clearTimeout(toastTimer);const el=document.querySelector('#toast');el.textContent=message;el.classList.toggle('is-error',error);el.hidden=false;toastTimer=setTimeout(()=>el.hidden=true,4200);}
function navigate(path,query){const hash=toHash(path,query);if(location.hash===hash)return;location.hash=hash;}
const services={navigate,toast,getRuntime:()=>runtime.snapshot(),openDemo:()=>autoDemo?.open(),refreshWorkspaceTabs:()=>{tabs=read('tabs',[]).filter(t=>ROUTES[t.path]);renderNavigation(parseRoute(location.hash));}};const runtime=createRuntime(document.querySelector('#micro-content'),services);
Object.defineProperty(window,'__REPLAY_DEBUG__',{value:{snapshot:()=>runtime.snapshot(),demoSnapshot:()=>autoDemo?.snapshot()||null},writable:false});
function renderNavigation(route){
 const title=ROUTES[route.path];document.querySelector('#breadcrumb').innerHTML=`<span>工作经历复现</span><span>/</span><span>${title?.group||'未知页面'}</span><span>/</span><b>${title?.title||'未找到'}</b>`;
 document.querySelectorAll('[data-shell="nav"]').forEach(el=>{el.classList.toggle('active',el.dataset.path===route.path);if(el.dataset.path===route.path)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 document.querySelector('#tabbar').innerHTML=tabs.map(t=>`<div class="system-tab ${route.path===t.path?'active':''}"><button data-shell="tab" data-path="${t.path}"><span class="tab-dot"></span>${ROUTES[t.path].title}</button>${tabs.length>1?`<button class="tab-close" data-shell="close-tab" data-path="${t.path}" aria-label="关闭${ROUTES[t.path].title}">×</button>`:''}</div>`).join('');
}
async function handleRoute(){
 clearTimeout(toastTimer);document.querySelector('#toast').hidden=true;
 const route=parseRoute(location.hash);if(!ROUTES[route.path]){toast('这个演示地址不存在，已返回漏斗详情。',true);location.replace(defaultRoute('/ebi/funnel'));return;}
 const existing=tabs.find(t=>t.path===route.path);if(existing)existing.hash=location.hash;else tabs.push({path:route.path,hash:location.hash});write('tabs',tabs);renderNavigation(route);trace('navigation',route.path,route.query);renderGuide(document.querySelector('#journey-guide'),route,navigate,toast);
 try{await runtime.navigate(route);document.querySelector('#runtime-state').textContent=`Native ESM · ${runtime.snapshot().activeApp?.toUpperCase()||'—'} 已挂载`;}
 catch(error){document.querySelector('#micro-content').innerHTML=`<div class="error-box" role="alert"><h2>页面加载失败</h2><p>${esc(error.message)}</p><button data-shell="retry" class="btn">重新加载</button></div>`;console.error(error);}
}
shell.addEventListener('click',async e=>{const el=e.target.closest('[data-shell]');if(!el)return;const path=el.dataset.path;
 if(el.dataset.shell==='demo'){autoDemo?.open();return;}
 if(el.dataset.shell==='nav'||el.dataset.shell==='tab'){location.hash=tabs.find(t=>t.path===path)?.hash||defaultRoute(path);}
 if(el.dataset.shell==='close-tab'){const index=tabs.findIndex(t=>t.path===path);tabs=tabs.filter(t=>t.path!==path);write('tabs',tabs);if(parseRoute(location.hash).path===path)location.hash=tabs[Math.max(0,index-1)]?.hash||defaultRoute('/ebi/funnel');else renderNavigation(parseRoute(location.hash));}
 if(el.dataset.shell==='reset'&&confirm('清空页签、筛选、列设置及 CRM / 日志上报已保存配置和草稿、SDK 监控偏好与模拟处理状态，恢复固定样本。此操作不可撤销，请先导出配置。你的复盘笔记与讲解稿会保留。')){resetPreferences();try{await flushStorage();}catch(err){toast(err.message,true);return;}location.replace(defaultRoute('/ebi/funnel'));location.reload();}
 if(el.dataset.shell==='retry')location.reload();
});
window.addEventListener('hashchange',handleRoute);
if(!location.hash){if(demoSession)location.hash=defaultRoute('/journey');else location.replace(defaultRoute('/journey'));}else handleRoute();

installSqlStatus();
