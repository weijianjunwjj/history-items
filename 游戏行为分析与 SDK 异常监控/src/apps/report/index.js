import {flushStorage,sqlClient} from '../../shared/store.js';
import {createReportApi} from '../../api/report-api.js';
import {clone,makeField,makeEvent,walk,findNode,isContainer,addNode,moveNode,removeNode,reorder,addToPanel,validateBase,validateField,validateTree,validateItem,validateEvent,changed,serializeEvent,sampleRows,filterRows,operators,PANELS} from '../../domain/report.js';
import {read,write,localStore,persistentStorageAvailable} from '../../shared/store.js';
import {download} from '../../shared/dom.js';
import {reviewDrawer} from '../../shared/ui.js';
import {fieldLibrary,fieldModal,eventList,eventEditor,previewView,detailModal} from './views.js';
const api=createReportApi(localStore),workspaceKey='report:workspace';
let root,body,modal,services,state,drag=null,returnFocus=null;
const fieldKeys=new Set(['name','alias','product','reportType','dataType','restriction','supportQuery','description']);
const baseKeys=new Set(['name','alias','product','reportType','model','description']);
export async function bootstrap(){}
function persist(){if(!write(workspaceKey,{workspace:state.workspace,view:state.view==='editor'?'editor':'list'})&&!state.warned){state.warned=true;services.toast('草稿暂存失败，请先导出配置，避免刷新丢失。',true);}}
function refresh(){state.library=api.listFields();state.events=api.listEvents();}
function current(){return state.workspace?.draft;}
function node(){return current()?findNode(current(),state.workspace.nodeId):null;}
function item(){const w=state.workspace;return w?.draft.panels[w.panel].find(x=>x.nodeId===w.itemIds[w.panel]);}
function mark(){persist();const el=root.querySelector('#rp-save-state');if(el){const dirty=changed(current(),state.workspace.baseline);el.textContent=dirty?'未提交修改':'已保存 · 无改动';el.className='tag '+(dirty?'warning':'success');}}
function repair(){const w=state.workspace;if(!w)return;if(!findNode(w.draft,w.nodeId))w.nodeId=w.draft.fields[0]?.id||'';for(const p of Object.keys(PANELS))if(!w.draft.panels[p].some(x=>x.nodeId===w.itemIds[p]))w.itemIds[p]=w.draft.panels[p][0]?.nodeId||'';}
function render(){repair();body.innerHTML=state.view==='fields'?fieldLibrary(state):state.view==='editor'?eventEditor(state):state.view==='preview'?previewView(state):eventList(state);}
function showErrors(errors,{locate=false}={}){state.errors=errors;if(errors.length&&locate){const e=errors[0],w=state.workspace;w.step=e.step||0;if(e.panel)w.panel=e.panel;if(e.nodeId){w.nodeId=e.nodeId;if(e.panel)w.itemIds[e.panel]=e.nodeId;}}render();if(errors.length)services.toast(errors[0].message,true);return !errors.length;}
function guard(){const w=state.workspace;if(!w)return true;
 if(w.step===0)return showErrors(validateBase(w.draft).map(message=>({step:0,message})));
 if(w.step===1){const n=node();if(!n)return true;return showErrors(validateTree(w.draft).filter(e=>e.nodeId===n.id));}
 const x=item();if(x){const message=validateItem(w.draft,w.panel,x);if(message)return showErrors([{step:2,panel:w.panel,nodeId:x.nodeId,message}]);}state.errors=[];return true;
}
function validateAll(){return showErrors(validateEvent(current()),{locate:true});}
function chooseEvent(e){const w=state.workspace;if(w?.draft.id===e.id){state.view='editor';persist();render();return;}if(w&&changed(w.draft,w.baseline)&&!confirm('当前事件有未提交修改。放弃这份草稿并打开另一事件？'))return;
 state.workspace={draft:clone(e),baseline:e.revision?clone(e):null,step:0,nodeId:e.fields[0]?.id||'',panel:'list',itemIds:{list:e.panels.list[0]?.nodeId||'',query:e.panels.query[0]?.nodeId||'',detail:e.panels.detail[0]?.nodeId||''}};state.errors=[];state.view='editor';persist();render();}
function closeModal(){if(!modal)return;modal.innerHTML='';state.fieldDraft=null;returnFocus?.focus?.();returnFocus=null;}
function showModal(html){returnFocus=document.activeElement;modal.innerHTML=html;const target=modal.querySelector('input,textarea,button');target?.focus();}
function openField(f){state.fieldDraft=clone(f);state.fieldError='';showModal(fieldModal(state.fieldDraft,''));}
async function saveField(){try{api.saveField(state.fieldDraft);await flushStorage();if(!root)return;closeModal();refresh();render();services.toast(persistentStorageAvailable?'字段已保存到本机，可加入事件。':'字段已保存到临时会话；刷新前请导出事件配置。');}catch(e){state.fieldError=e.message;modal.innerHTML=fieldModal(state.fieldDraft,e.message);}}
function preview(e,back){state.preview={event:clone(e),filters:{},page:1,back};state.view='preview';render();}
function doStep(step){if(![0,1,2].includes(step)||!guard())return;const e=current();if(step>0){const errors=validateBase(e).map(message=>({step:0,message}));if(step>1)errors.push(...validateTree(e));if(errors.length)return showErrors(errors,{locate:true});}state.workspace.step=step;state.errors=[];persist();render();}
function reorderNode(id,to){const entry=walk(current().fields).find(x=>x.node.id===id);if(!entry)return;const array=entry.parentId?findNode(current(),entry.parentId).children:current().fields;if(reorder(array,id,to,'id')){mark();render();}}
function applyAddItem(id){if(!guard())return;addToPanel(current(),state.workspace.panel,id);state.workspace.itemIds[state.workspace.panel]=id;mark();render();services.toast('已加入当前区域，源字段仍然保留。');}
async function click(e){const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const act=el.dataset.act;
 try{
 if(act==='review'){showModal(reviewDrawer('report',{page:state.view,eventId:current()?.id}));return;}
 if(act==='close-modal')return closeModal();
 if(act==='save-note'){const ok=write('note:report',modal.querySelector('#replay-note').value,localStore);if(ok)await flushStorage();if(!modal)return;modal.querySelector('#note-status').textContent=ok?(persistentStorageAvailable?' 已保存到本机':' 已暂存；刷新前请导出'):' 保存失败';return;}
 if(!act.startsWith('rp-'))return;const a=act.slice(3),w=state.workspace,ev=current(),id=el.dataset.id;
 if(a==='new-field')return openField(makeField());
 if(a==='edit-field')return openField(state.library.find(f=>f.id===id));
 if(a==='save-field')return saveField();
 if(a==='reset-search'){state.keyword='';return render();}
 if(a==='new-event')return chooseEvent(makeEvent());
 if(a==='edit-event')return chooseEvent(state.events.find(x=>x.id===id));
 if(a==='preview-saved'){const saved=state.events.find(x=>x.id===id);return preview(saved,'list');}
 if(a==='resume'){state.view='editor';persist();return render();}
 if(a==='back'){state.view='list';state.errors=[];persist();return render();}
 if(a==='back-preview'){state.view=state.preview.back;state.preview=null;return render();}
 if(a==='preview-reset'){state.preview.filters={};state.preview.page=1;return render();}
 if(a==='preview-page'){const pages=Math.max(1,Math.ceil(filterRows(state.preview.event,state.preview.filters).length/10));state.preview.page=Math.max(1,Math.min(pages,Number(el.dataset.page)||1));return render();}
 if(a==='preview-detail'){const row=sampleRows(state.preview.event).find(x=>x.id===id);return showModal(detailModal(state.preview.event,row));}
 if(!w)return;
 if(a==='goto-error'){const error=state.errors[Number(el.dataset.index)];if(error){w.step=error.step||0;if(error.panel)w.panel=error.panel;if(error.nodeId){w.nodeId=error.nodeId;if(error.panel)w.itemIds[error.panel]=error.nodeId;}render();}return;}
 if(a==='step')return doStep(Number(el.dataset.step));
 if(a==='validate'){if(validateAll())services.toast('基础、字段树与三套配置全部校验通过。');return;}
 if(a==='discard'){if(!confirm('放弃未提交修改，恢复上次保存？新建未保存事件会移除。'))return;const saved=state.events.find(x=>x.id===ev.id);state.workspace=null;if(saved)chooseEvent(saved);else{state.view='list';persist();render();}return;}
 if(a==='save'){if(!validateAll())return;const snapshot=clone(ev);const result=api.saveEvent(snapshot);await flushStorage();if(!state||state.workspace!==w)return;const editedDuringSave=JSON.stringify(w.draft)!==JSON.stringify(snapshot);if(!editedDuringSave)w.draft=result.saved;w.baseline=clone(result.saved);refresh();persist();await flushStorage();if(!root)return;render();services.toast(editedDuringSave?'保存时的版本已提交；后续修改仍是草稿。':result.unchanged?'配置没有变化，未重复保存。':persistentStorageAvailable?'事件已保存到本机，返回列表可重开。':'事件已保存到临时会话，请导出配置备份。');return;}
 if(a==='export'){if(!validateAll())return;download('模拟上报配置-'+ev.id+'.json',JSON.stringify({version:'0.3.0',simulation:true,notice:'本次重建的配置结构；不含真实数据，不是公司生产接口。',payload:serializeEvent(ev),editingSnapshot:clone(ev)},null,2),'application/json');services.toast('配置已导出为 JSON，含可读编辑快照。');return;}
 if(a==='preview'){if(validateAll())preview(ev,'editor');return;}
 if(a==='select-node'){if(guard()){w.nodeId=id;state.errors=[];persist();render();}return;}
 if(a==='add-node'){const picked=root.querySelector('#rp-library-select')?.value;if(!guard())return;const f=state.library.find(x=>x.id===picked);if(!f)return;state.libraryPick=picked;const n=addNode(ev,f,isContainer(node())?w.nodeId:'');w.nodeId=n.id;mark();render();return;}
 if(a==='delete-node'){const n=findNode(ev,id);if(!n||!confirm('删除“'+n.name+'”及全部下级，并清理三个页面区域中的引用？保存前可以放弃修改撤销。'))return;removeNode(ev,id);state.errors=[];repair();mark();render();return;}
 if(a==='move-node-order'){if(guard())reorderNode(id,Number(el.dataset.to));return;}
 if(a==='panel'){if(!Object.hasOwn(PANELS,el.dataset.panel)||!guard())return;w.panel=el.dataset.panel;state.errors=[];persist();render();return;}
 if(a==='add-item')return applyAddItem(id);
 if(a==='select-item'){if(guard()){w.itemIds[w.panel]=id;persist();render();}return;}
 if(a==='remove-item'){ev.panels[w.panel]=ev.panels[w.panel].filter(x=>x.nodeId!==id);state.errors=[];repair();mark();render();return;}
 if(a==='move-item'){if(guard()&&reorder(ev.panels[w.panel],id,Number(el.dataset.to))){mark();render();}return;}
 }catch(error){services.toast(error.message||'操作失败，配置未保存。',true);}
}
function edit(e){const el=e.target,model=el.dataset.rpModel,key=el.name;if(!model)return;
 try{
 if(model==='field'&&state.fieldDraft&&fieldKeys.has(key)){state.fieldDraft[key]=el.type==='checkbox'?el.checked:el.value;if(key==='dataType'){if(isContainer(state.fieldDraft))state.fieldDraft.supportQuery=false;modal.innerHTML=fieldModal(state.fieldDraft,state.fieldError);}return;}
 const w=state.workspace;if(!w)return;
 if(model==='base'&&baseKeys.has(key))w.draft[key]=el.value;
 else if(model==='node'&&node()){
  const n=node();if(key==='parentId'){const value=el.value;if(!guard())return;moveNode(w.draft,n.id,value);mark();render();return;}
  if(!fieldKeys.has(key))return;
  if(key==='dataType'){
   if(n.children.length&&el.value!=='object'){el.value=n.dataType;throw new Error('请先移走下级字段，再改为非对象类型。');}
   if(el.value==='object'&&w.draft.panels.query.some(x=>x.nodeId===n.id)){el.value=n.dataType;throw new Error('该字段已用于查询，请先从查询条件移除。');}
   n.dataType=el.value;if(isContainer(n))n.supportQuery=false;for(const x of w.draft.panels.query.filter(x=>x.nodeId===n.id))if(!operators(n).some(y=>y[0]===x.queryConfig.operator))x.queryConfig.operator=operators(n)[0][0];
  }else if(key==='supportQuery'){
   if(!el.checked&&w.draft.panels.query.some(x=>x.nodeId===n.id)){el.checked=true;throw new Error('该字段已用于查询，请先从查询条件移除。');}n.supportQuery=el.checked;
  }else n[key]=el.value;
 }else if(model==='item'&&item()){
  const x=item();if(key==='queryLabel')x.queryConfig.label=el.value;else if(key==='operator')x.queryConfig.operator=el.value;else if(key==='required')x.queryConfig.required=el.checked;else if(['label','width'].includes(key))x[key]=el.value;else return;
 }else return;
 mark();if(el.tagName==='SELECT'||el.type==='checkbox')render();
 }catch(error){services.toast(error.message,true);if(model==='node'&&key==='parentId')render();}
}
function input(e){if(e.target.tagName!=='SELECT'&&e.target.type!=='checkbox')edit(e);}
function change(e){if(e.target.tagName==='SELECT'||e.target.type==='checkbox')edit(e);}
function submit(e){if(!e.target.dataset.rpForm)return;e.preventDefault();const kind=e.target.dataset.rpForm;
 if(kind==='search'){state.keyword=String(new FormData(e.target).get('keyword')||'').trim();render();}
 if(kind==='field')saveField();
 if(kind==='preview'){const form=Object.fromEntries(new FormData(e.target));const missing=state.preview.event.panels.query.find(x=>x.queryConfig.required&&!String(form[x.nodeId]||'').trim());if(missing){services.toast('请填写 '+missing.queryConfig.label,true);return;}state.preview.filters=form;state.preview.page=1;render();}
}
function dragstart(e){const n=e.target.closest('[data-source-id],[data-item-id],[data-tree-id]');if(!n)return;drag={kind:n.hasAttribute('data-source-id')?'source':n.hasAttribute('data-item-id')?'item':'tree',id:n.dataset.sourceId||n.dataset.itemId||n.dataset.treeId};e.dataTransfer.effectAllowed=drag.kind==='source'?'copy':'move';e.dataTransfer.setData('text/plain',drag.id);}
function dragover(e){if(!drag)return;const target=e.target.closest('[data-item-id],[data-drop-zone],[data-tree-id]');if(!target)return;if(drag.kind==='tree'?!target.dataset.treeId:!target.closest('[data-drop-zone]'))return;e.preventDefault();e.dataTransfer.dropEffect=drag.kind==='source'?'copy':'move';}
function drop(e){if(!drag)return;const d=drag;drag=null;const target=e.target.closest('[data-item-id],[data-drop-zone],[data-tree-id]');if(!target)return;e.preventDefault();try{
 if(d.kind==='source'&&target.closest('[data-drop-zone]'))applyAddItem(d.id);
 else if(d.kind==='item'&&target.closest('[data-drop-zone]')){const list=current().panels[state.workspace.panel];const to=target.dataset.itemId?list.findIndex(x=>x.nodeId===target.dataset.itemId):list.length-1;if(guard()&&reorder(list,d.id,to)){mark();render();}}
 else if(d.kind==='tree'&&target.dataset.treeId){const flat=walk(current().fields),a=flat.find(x=>x.node.id===d.id),b=flat.find(x=>x.node.id===target.dataset.treeId);if(!a||!b||a.parentId!==b.parentId)throw new Error('拖拽仅支持同级排序，跨层请修改“上级字段”。');const list=a.parentId?findNode(current(),a.parentId).children:current().fields;if(guard())reorderNode(d.id,list.findIndex(x=>x.id===b.node.id));}
 }catch(error){services.toast(error.message,true);}}
function keydown(e){if(!modal?.firstChild)return;if(e.key==='Escape'){closeModal();return;}if(e.key==='Tab'){const list=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),select,textarea')].filter(n=>n.getClientRects().length),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}
const events={click,input,change,submit,dragstart,dragover,drop,dragend:()=>drag=null};
function applyDeepLink(route){if(route.path!=='/report/events'||!route.query.definitionId)return;const ev=state.events.find(x=>x.id===route.query.definitionId);if(ev){chooseEvent(ev);if(route.query.preview==='1'&&state.workspace?.draft.id===ev.id)preview(ev,'editor');}else services.toast('联动事件尚未创建，请先从业务流程打开事件配置。',true);}
export async function mount(props){root=props.container;services=props.services;const cached=read(workspaceKey,{});let w=cached.workspace;
 if(w&&(!w.draft||!Array.isArray(w.draft.fields)||!w.draft.panels||!Object.keys(PANELS).every(p=>Array.isArray(w.draft.panels[p]))||![0,1,2].includes(w.step)||!w.itemIds))w=null;
 state={workspace:w||null,view:props.route.path==='/report/fields'?'fields':w&&cached.view==='editor'?'editor':'list',library:[],events:[],keyword:'',errors:[],fieldDraft:null,fieldError:'',preview:null,warned:false};refresh();root.innerHTML='<div id="rp-page"></div><div id="rp-modal"></div>';body=root.querySelector('#rp-page');modal=root.querySelector('#rp-modal');for(const [type,handler]of Object.entries(events))root.addEventListener(type,handler);document.addEventListener('keydown',keydown);render();applyDeepLink(props.route);}
export async function update(route){closeModal();state.view=route.path==='/report/fields'?'fields':state.workspace?'editor':'list';state.keyword='';refresh();render();applyDeepLink(route);}
export async function unmount(){persist();document.removeEventListener('keydown',keydown);closeModal();for(const [type,handler]of Object.entries(events))root.removeEventListener(type,handler);root.innerHTML='';root=body=modal=null;state=null;drag=null;}
