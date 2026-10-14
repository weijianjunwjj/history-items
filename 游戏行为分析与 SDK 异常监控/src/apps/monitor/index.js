import {flushStorage,sqlClient} from '../../shared/store.js';
import {linkedQuery} from '../../domain/unified.js';
import {normalizeMonitorQuery,normalizeSelection,moveChart,alertKey,setAlertStatus,exportMonitorPreferences,createPageTicker,selectMonitorRows,deviceBreakdown,clock} from '../../domain/monitor.js';
import {loadMonitorPreferences,saveMonitorPreferences,queryMonitor} from '../../api/monitor-api.js';
import {monitorPage,chooserView,pointView,deviceModalView,alertsView,notificationView,fullscreenView} from './views.js';
import {reviewDrawer} from '../../shared/ui.js';
import {download} from '../../shared/dom.js';
import {write,localStore,persistentStorageAvailable} from '../../shared/store.js';
let routeQuery={};
let root,pageRoot,modalRoot,services,state,dialog=null,ticker=null,version=0,restoreFocus=null;
export async function bootstrap(){}
async function save(message){try{const result=saveMonitorPreferences(state.prefs);await flushStorage();if(message)services.toast(message+(result.persistent?'（已保存本机）':'（临时会话；刷新前请导出）'));return true;}catch(e){services.toast(e.message,true);return false;}}
function paint(){if(!root)return;state.timerActive=ticker.active;pageRoot.innerHTML=monitorPage(state);}
async function refresh(id){const request=++version;const result=await queryMonitor(state.prefs.query,state.prefs.selectedIds);if(!root||request!==version)return;state.charts=result.charts;state.computedAt=result.computedAt;if(id)state.refreshed[id]=true;paint();}
function preserveDialogFocus(fn){const active=document.activeElement,id=active?.id,start=active?.selectionStart,end=active?.selectionEnd;fn();const target=id?modalRoot.querySelector('#'+id):null;if(target){target.focus();if(typeof start==='number')try{target.setSelectionRange(start,end);}catch{}}}
function paintDialog(){if(!dialog||!modalRoot)return;const html=dialog.kind==='choose'?chooserView(dialog):dialog.kind==='point'?pointView(dialog,state.prefs.query):dialog.kind==='devices'?deviceModalView(dialog,state.prefs.query):dialog.kind==='alerts'?alertsView(dialog,state):dialog.kind==='notify'?notificationView(dialog,state):dialog.kind==='fullscreen'?fullscreenView(dialog,state):reviewDrawer('monitor',state.prefs.query);modalRoot.innerHTML=html;document.body.classList.add('modal-open');queueMicrotask(()=>{if(dialog&&modalRoot&&!modalRoot.contains(document.activeElement))modalRoot.querySelector('button,input,select,textarea')?.focus();});}
function open(d){restoreFocus=document.activeElement;dialog=d;paintDialog();queueMicrotask(()=>modalRoot?.querySelector('button,input,select,textarea')?.focus());}
function close(){dialog=null;if(modalRoot)modalRoot.innerHTML='';document.body.classList.remove('modal-open');if(restoreFocus?.isConnected)restoreFocus.focus();}
function applyQuery(patch){const q=normalizeMonitorQuery({...state.prefs.query,...patch});state.prefs.query=q;services.navigate('/monitor/overview',{...(routeQuery.flow==='sdk'?{...routeQuery}:{}),...q});}
function selectedAdd(id){dialog.ids=normalizeSelection([...dialog.ids,id]);paintDialog();}
function exportDevices(){const d=dialog;let rows=selectMonitorRows(d.id,state.prefs.query,d.day,d.start,d.end);if(d.product)rows=rows.filter(x=>x.product===d.product);const csvCell=v=>'"'+String(v).replaceAll('"','""')+'"';const lines=[['设备ID（模拟）','产品','平台','上报次数','最近时间'],...deviceBreakdown(rows).map(x=>[x.deviceId,x.product,x.os,x.reports,clock(x.lastMinute)])];download('SDK-模拟设备清单.csv','\uFEFF'+lines.map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');}
async function click(e){if(e.target.classList.contains('overlay')){close();return;}const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const act=el.dataset.act,id=el.dataset.id;
 try{
  if(['sm-linked-analysis','sm-linked-devices','sm-linked-user'].includes(act)){const d=dialog;const window=d.kind==='point'?{day:d.day,start:d.bin*state.prefs.query.grain,end:(d.bin+1)*state.prefs.query.grain}:d;const q=linkedQuery(d.id,state.prefs.query,{...window,...(el.dataset.device?{deviceId:el.dataset.device}:{})});services.navigate(act==='sm-linked-user'?'/ebi/user':act==='sm-linked-analysis'?'/ebi/event':'/ebi/device',q);return;}
  if(act==='review'){open({kind:'review'});return;}
  if(act==='save-note'){const ok=write('note:monitor',modalRoot.querySelector('#replay-note').value,localStore);if(ok)await flushStorage();if(!modalRoot)return;modalRoot.querySelector('#note-status').textContent=ok?(persistentStorageAvailable?'已保存到本机':'已暂存，刷新前请导出笔记'):'保存失败，请复制留存';return;}
  if(act==='close-modal'||act==='sm-close'){close();return;}
  if(act==='sm-region'){applyQuery({region:el.dataset.value});return;}
  if(act==='sm-type'){applyQuery({type:el.dataset.value});return;}
  if(act==='sm-refresh'||act==='sm-refresh-card'){await refresh(id);if(dialog?.kind==='fullscreen')paintDialog();services.toast('固定快照已重新计算，未生成新的随机数据。');return;}
  if(act==='sm-choose'){open({kind:'choose',ids:[...state.prefs.selectedIds],search:'',type:''});return;}
  if(act==='sm-choice-add'){selectedAdd(id);return;}
  if(act==='sm-choice-remove'){dialog.ids=dialog.ids.filter(x=>x!==id);paintDialog();return;}
  if(act==='sm-choice-move'){dialog.ids=moveChart(dialog.ids,id,Number(el.dataset.to));paintDialog();return;}
  if(act==='sm-choice-confirm'){state.prefs.selectedIds=normalizeSelection(dialog.ids);if(!await save('图表数量与顺序已更新'))return;close();await refresh();return;}
  if(act==='sm-fullscreen'){open({kind:'fullscreen',id});return;}
  if(act==='sm-point'){open({kind:'point',id,bin:Number(el.dataset.bin)});return;}
  if(act==='sm-point-day'){dialog.day=el.dataset.value;paintDialog();return;}
  if(act==='sm-devices'){const parent=dialog;dialog={kind:'devices',id,start:Number(el.dataset.start),end:Number(el.dataset.end),day:el.dataset.day,product:el.dataset.product||'',page:1,parent};paintDialog();return;}
  if(act==='sm-device-page'){dialog.page=Number(el.dataset.page);paintDialog();return;}
  if(act==='sm-device-export'){exportDevices();return;}
  if(act==='sm-back'){dialog=dialog.parent;if(dialog)paintDialog();else close();return;}
  if(act==='sm-alerts'){const saved=state.prefs.alerts[alertKey(id,state.prefs.query)];open({kind:'alerts',id,reason:saved?.reason||'',analysis:[],error:''});return;}
  if(act==='sm-process'){
   try{const prefs=setAlertStatus(state.prefs,dialog.id,state.prefs.query,el.dataset.status,dialog.reason);if(!confirm(el.dataset.status==='done'?'仅在本地模拟标记为已完成，不会影响公司告警。确认？':'仅在本地模拟设置为处理中，不会暂停或发送真实通知。确认？'))return;state.prefs=prefs;if(!await save('模拟处理状态已更新'))return;close();await refresh();}catch(err){dialog.error=err.message;paintDialog();}return;
  }
  if(act==='sm-notify'){open({kind:'notify',id});return;}
  if(act==='sm-notify-confirm'){state.prefs.notifications[id]=!state.prefs.notifications[id];if(!await save('本地关注标记已更新，不发送通知'))return;close();paint();return;}
  if(act==='sm-export'){download('SDK-监控演示配置.json',JSON.stringify(exportMonitorPreferences(state.prefs),null,2),'application/json');return;}
 }catch(error){services.toast(error.message,true);}
}
function input(e){try{if(e.target.id==='sm-reason'){dialog.reason=e.target.value;modalRoot.querySelector('#sm-reason-count').textContent=dialog.reason.length;dialog.error='';return;}if(e.target.id==='sm-chart-search'){dialog.search=e.target.value.trim();preserveDialogFocus(paintDialog);}}catch(error){services.toast(error.message,true);}}
function change(e){try{const el=e.target;if(el.dataset.smQuery){applyQuery({[el.dataset.smQuery]:el.value});return;}if(el.hasAttribute('data-sm-auto')){state.prefs.autoRefresh=el.checked;ticker.enable(el.checked);save();paint();return;}if(el.id==='sm-choice-type'){dialog.type=el.value;paintDialog();return;}if(el.dataset.smAnalysis){dialog.analysis=el.checked?[...new Set([...dialog.analysis,el.dataset.smAnalysis])]:dialog.analysis.filter(x=>x!==el.dataset.smAnalysis);paintDialog();}}catch(error){services.toast(error.message,true);}}
function keydown(e){if(e.key==='Escape'){close();return;}if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-act]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
 if(e.key==='Tab'&&dialog){const nodes=[...modalRoot.querySelectorAll('button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]')].filter(n=>n.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
function dragstart(e){if(e.target.closest('button,input,select,textarea')){e.preventDefault();return;}const row=e.target.closest('[data-sm-selected],[data-sm-available],[data-card-id]');if(!row)return;const value={id:row.dataset.smSelected||row.dataset.smAvailable||row.dataset.cardId,kind:row.hasAttribute('data-sm-available')?'available':row.hasAttribute('data-sm-selected')?'selected':'card'};e.dataTransfer.setData('application/x-youyi-monitor',JSON.stringify(value));e.dataTransfer.effectAllowed='move';}
function dragover(e){if(e.target.closest('[data-sm-drop],.sm-selection-row,.sm-grid')){e.preventDefault();e.dataTransfer.dropEffect='move';}}
function drop(e){e.preventDefault();try{const raw=e.dataTransfer.getData('application/x-youyi-monitor');if(!raw)return;const drag=JSON.parse(raw);normalizeSelection([drag.id]);
 if(dialog?.kind==='choose'&&e.target.closest('[data-sm-drop="selected"]')){
  if(drag.kind==='available'){selectedAdd(drag.id);return;}const target=e.target.closest('[data-sm-selected]')?.dataset.smSelected;if(drag.kind==='selected'&&target){dialog.ids=moveChart(dialog.ids,drag.id,dialog.ids.indexOf(target));paintDialog();}return;
 }
 if(!dialog&&drag.kind==='card'){const target=e.target.closest('[data-card-id]')?.dataset.cardId;if(target&&target!==drag.id){state.prefs.selectedIds=moveChart(state.prefs.selectedIds,drag.id,state.prefs.selectedIds.indexOf(target));save();refresh();}}
 }catch(error){services.toast(error.message,true);}}
function visibility(){if(!ticker)return;ticker.setVisible(!document.hidden);paint();}
export async function mount(props){root=props.container;services=props.services;state={prefs:loadMonitorPreferences(),charts:[],computedAt:'',refreshed:{},timerActive:false};root.innerHTML='<div id="sm-page"></div><div id="sm-modal"></div>';pageRoot=root.querySelector('#sm-page');modalRoot=root.querySelector('#sm-modal');
 ticker=createPageTicker(()=>refresh().catch(error=>services.toast(error.message,true)));ticker.setVisible(!document.hidden);ticker.enable(state.prefs.autoRefresh);
 for(const [name,fn]of Object.entries({click,input,change,dragstart,dragover,drop}))root.addEventListener(name,fn);document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',keydown);await update(props.route);
}
export async function update(route){routeQuery={...route.query};close();try{if(Object.keys(route.query).length)state.prefs.query=normalizeMonitorQuery(route.query);save();}catch(error){services.toast(error.message,true);}await refresh();}
export async function unmount(){version++;ticker?.stop();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',keydown);close();for(const [name,fn]of Object.entries({click,input,change,dragstart,dragover,drop}))root.removeEventListener(name,fn);root.innerHTML='';root=null;pageRoot=null;modalRoot=null;state=null;ticker=null;}
