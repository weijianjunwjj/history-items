import {applications} from './apps.js';
/** Minimal native-ESM microfrontend host. NOT single-spa or a reproduction of the company's framework. */
import {trace} from '../shared/trace.js';
export function createRuntime(container,services){
 const definitions=applications;
 const booted=new Set();let active=null,latest=0,queue=Promise.resolve();const log=[];
 function record(app,event){trace('lifecycle',app+'.'+event);log.push({time:new Date().toLocaleTimeString('zh-CN',{hour12:false}),app,event});if(log.length>60)log.shift();}
 async function perform(route,ticket){
  if(ticket!==latest)return;const def=definitions.find(d=>d.match(route.path));if(!def)throw new Error('未找到对应微应用。');
  if(active?.name!==def.name){
   if(active){await active.module.unmount();record(active.name,'unmount');active=null;}
   if(ticket!==latest)return;
   const module=await def.load();if(ticket!==latest)return;for(const key of ["bootstrap","mount","update","unmount"])if(typeof module[key]!=="function")throw new Error(def.name+" 缺少生命周期："+key);
   if(!booted.has(def.name)){await module.bootstrap();booted.add(def.name);record(def.name,'bootstrap');}
   active={name:def.name,module};await module.mount({container,route,services});record(def.name,'mount');
  }else{await active.module.update(route);record(def.name,'update');}
 }
 return {navigate(route){const n=++latest;queue=queue.catch(()=>{}).then(()=>perform(route,n));return queue;},snapshot(){return {kind:'native-esm-microfrontends',registered:definitions.map(d=>d.name),activeApp:active?.name||null,bootstrapped:[...booted],log:[...log]};}};
}
