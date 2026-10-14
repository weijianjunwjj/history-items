import {SqlWorkspaceClient} from './shared/sql-client.js';
import {installBehaviorSnapshot} from './domain/data.js';
import {installMonitorSnapshot} from './domain/monitor.js';
const shell=document.querySelector('#shell');
async function load(url){const response=await fetch(url,{credentials:'same-origin',signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('本地服务未就绪：'+response.status);return response.json();}
try{
 const [bootstrap,datasets]=await Promise.all([load('/api/bootstrap'),load('/api/datasets')]);
 installBehaviorSnapshot(datasets.behavior);installMonitorSnapshot(datasets.monitor);
 const client=new SqlWorkspaceClient(bootstrap,{onChange:s=>window.dispatchEvent(new CustomEvent('replay:sql-state',{detail:s}))});
 Object.defineProperty(window,'__REPLAY_SQL__',{value:client,writable:false});
 window.addEventListener('beforeunload',e=>{if(client.snapshot().pending||client.snapshot().saving){e.preventDefault();e.returnValue='';}});
 if(document.documentElement.dataset.standalone)await import('./standalone.js');else await import('./shell/index.js');
}catch(error){shell.replaceChildren();const box=document.createElement('div');box.className='boot error-box';const h=document.createElement('h1');h.textContent='本地服务连接失败';const p=document.createElement('p');p.textContent=error.message+'。请保持 npm start 的终端运行，然后刷新。本地版不会静默切回假保存模式。';const b=document.createElement('button');b.className='btn primary';b.textContent='重新连接';b.onclick=()=>location.reload();box.append(h,p,b);shell.append(box);console.error(error);}
