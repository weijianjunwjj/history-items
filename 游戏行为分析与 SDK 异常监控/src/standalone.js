import {applications} from './shell/apps.js';
import {parseRoute,toHash,defaultRoute} from './domain/route.js';
import {installSqlStatus} from './shared/sql-status.js';
const def=applications.find(a=>a.name===document.documentElement.dataset.standalone);
if(!def)throw new Error('独立应用标识无效');
const shell=document.querySelector('#shell');shell.innerHTML='<header class="standalone-header"><a href="/">← 返回主应用</a><strong></strong><span>独立加载 · 同一个本地 SQL 服务</span></header><main id="micro-content" class="main-content"></main><div id="toast" class="toast" hidden></div>';
shell.querySelector('strong').textContent=def.title;const module=await def.load();const log=[];let mounted=false,queue=Promise.resolve();
const services={navigate(path,q){if(!def.match(path)){location.href='/'+toHash(path,q);return;}location.hash=toHash(path,q);},toast(message){const n=document.querySelector('#toast');n.textContent=message;n.hidden=false;setTimeout(()=>n.hidden=true,4000);},getRuntime:()=>({activeApp:def.name,kind:'standalone-native-esm',registered:[def.name],log}),openDemo(){location.href='/';}};
window.__REPLAY_DEBUG__={snapshot:services.getRuntime};
async function render(){let r=parseRoute(location.hash);if(!def.match(r.path)){location.hash=defaultRoute(def.defaultPath);return;}if(!mounted){await module.bootstrap();log.push({app:def.name,event:'bootstrap'});await module.mount({container:document.querySelector('#micro-content'),route:r,services});mounted=true;log.push({app:def.name,event:'mount'});}else{await module.update(r);log.push({app:def.name,event:'update'});}}
function route(){queue=queue.catch(()=>{}).then(render).catch(e=>services.toast(e.message));}
window.addEventListener('hashchange',route);if(!location.hash)location.hash=defaultRoute(def.defaultPath);else route();installSqlStatus();
