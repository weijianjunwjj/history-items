import {flushStorage,sqlClient} from '../../shared/store.js';
import {read,write,localStore,persistentStorageAvailable} from '../../shared/store.js';
import {createCrmApi} from '../../api/crm-api.js';
import {clone,makeActivity,makePrize,validateActivity,serializeActivity,movePrize,removePrize,GAMES} from '../../domain/crm.js';
import {list,editor,tree} from './views.js';
import {esc,download} from '../../shared/dom.js';
import {reviewDrawer} from '../../shared/ui.js';
let root,services,body,modal,state,restoreFocus,drag;
const api=createCrmApi(localStore),workspaceKey='crm:workspace';
const baseFields=new Set(['configName','componentType','activityId','gameProductId','rewardRule']);
const prizeFields=new Set(['type','name','probability','stock','minStock','sku','gameResource','singleLimitType','singleLimit','limitTimeType','limitTime']);
const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
export async function bootstrap(){}
function currentGroup(){return state.workspace?.draft.groups.find(g=>g.id===state.workspace.groupId);}
function currentPrize(){return currentGroup()?.prizes.find(p=>p.id===state.workspace.prizeId);}
function persist(){const ok=write(workspaceKey,{workspace:state.workspace,view:state.view});if(!ok&&!state.warned){state.warned=true;services.toast('草稿暂存失败，请导出配置备份。',true);}}
function repairSelection(){const w=state.workspace;if(!w)return;let g=w.draft.groups.find(g=>g.id===w.groupId);if(!g){g=w.draft.groups[0];w.groupId=g?.id||'';}if(!g?.prizes.some(p=>p.id===w.prizeId))w.prizeId=g?.prizes[0]?.id||'';}
function render(){if(!body)return;body.innerHTML=state.view==='editor'&&state.workspace?editor(state):list(state);}
function changed(){state.workspace.dirty=true;persist();const node=root.querySelector('#crm-save-state');if(node){node.textContent='有未提交修改';node.className='tag warning';}}
function chooseActivity(a){if(state.workspace?.dirty&&state.workspace.draft.id!==a.id&&!confirm('切换配置会放弃当前未提交草稿。继续吗？'))return;if(state.workspace?.draft.id!==a.id){state.workspace={draft:clone(a),step:0,groupId:a.groups[0]?.id||'',prizeId:a.groups[0]?.prizes[0]?.id||'',dirty:false};}state.view='editor';state.errors=[];repairSelection();persist();render();}
function validate(through=2,{locate=false}={}){state.errors=validateActivity(state.workspace.draft,{through});if(state.errors.length&&locate){const e=state.errors[0];state.workspace.step=e.step;if(e.groupId){state.workspace.groupId=e.groupId;state.folded[e.groupId]=false;}if(e.prizeId)state.workspace.prizeId=e.prizeId;repairSelection();}persist();render();return !state.errors.length;}
function goStep(step){const w=state.workspace;if(step>w.step&&!validate(step-1,{locate:true}))return;w.step=Math.max(0,Math.min(2,step));state.errors=[];persist();render();}
function closeModal(){if(!modal)return;modal.innerHTML='';document.body.classList.remove('modal-open');if(restoreFocus?.isConnected)restoreFocus.focus();restoreFocus=null;}
function showReview(){restoreFocus=document.activeElement;modal.innerHTML=reviewDrawer('crm',{step:state.workspace?.step,configId:state.workspace?.draft.id});document.body.classList.add('modal-open');queueMicrotask(()=>modal.querySelector('button')?.focus());}
function goError(index){const e=state.errors[index];if(!e)return;state.workspace.step=e.step;if(e.groupId){state.workspace.groupId=e.groupId;state.folded[e.groupId]=false;}if(e.prizeId)state.workspace.prizeId=e.prizeId;repairSelection();persist();render();root.querySelector(`[data-model][name="${e.field}"]`)?.focus();}
function exportConfig(){if(!validate(2,{locate:true}))return;const a=state.workspace.draft;download('模拟配置-'+a.id+'.json',JSON.stringify({version:'0.2.0',simulation:true,notice:'演示提交结构，不是原公司接口；未真实发布或发奖。',payload:serializeActivity(a),editingSnapshot:clone(a)},null,2),'application/json');services.toast('配置已导出，包含提交数据与可读编辑快照。');}
async function click(e){const button=e.target.closest('[data-act]');if(e.target.classList.contains('overlay'))return closeModal();if(!button||button.disabled)return;
 const act=button.dataset.act;
 try{
  if(act==='review')return showReview();if(act==='close-modal')return closeModal();
  if(act==='save-note'){const ok=write('note:crm',modal.querySelector('#replay-note').value,localStore);if(ok)await flushStorage();if(!modal)return;modal.querySelector('#note-status').textContent=ok?(persistentStorageAvailable?' 已保存到本机':' 已暂存，请在刷新前导出笔记'):' 保存失败，请复制备份';return;}
  if(!act.startsWith('crm-'))return;const name=act.slice(4),w=state.workspace;
  if(name==='new')return chooseActivity(makeActivity(uid('DEMO-CFG')));
  if(name==='edit'){const a=state.activities.find(a=>a.id===button.dataset.id);if(a)chooseActivity(a);return;}
  if(name==='reset-search'){state.keyword='';state.status='';return render();}
  if(name==='resume'){state.view='editor';persist();return render();}
  if(name==='back'){state.view='list';state.errors=[];persist();return render();}
  if(!w)return;
  if(name==='step')return goStep(Number(button.dataset.step));if(name==='next')return goStep(w.step+1);
  if(name==='validate'){if(validate(2,{locate:true}))services.toast('全部配置校验通过。各产品组概率均未超过 100%。');return;}
  if(name==='goto-error')return goError(Number(button.dataset.index));
  if(name==='export')return exportConfig();
  if(name==='save'){
   if(!validate(2,{locate:true}))return;const snapshot=clone(w.draft);const {saved}=api.save(snapshot);await flushStorage();if(!state||state.workspace!==w)return;const editedDuringSave=JSON.stringify(w.draft)!==JSON.stringify(snapshot);if(!editedDuringSave){w.draft=saved;w.dirty=false;}state.activities=api.list();persist();await flushStorage();if(!root)return;render();services.toast(editedDuringSave?'已提交保存时的版本，后续编辑仍是未提交草稿。':persistentStorageAvailable?'已保存到本机。返回列表后可重新打开。':'已保存到临时会话；刷新会丢失，请导出配置。');return;
  }
  if(name==='discard'){
   if(!confirm('放弃当前未提交修改，回到上次保存版本？未保存的新配置会被移除。'))return;
   const saved=state.activities.find(a=>a.id===w.draft.id);state.workspace=null;state.errors=[];state.view='list';persist();if(saved)chooseActivity(saved);else render();return;
  }
  const g=w.draft.groups.find(g=>g.id===button.dataset.gid);
  if(name==='select-prize'){if(!g?.prizes.some(p=>p.id===button.dataset.pid))return;w.groupId=g.id;w.prizeId=button.dataset.pid;persist();return render();}
  if(name==='fold-group'&&g){state.folded[g.id]=!state.folded[g.id];return render();}
  if(name==='add-prize'&&g){const p=makePrize(uid('P'));g.prizes.push(p);state.folded[g.id]=false;w.groupId=g.id;w.prizeId=p.id;changed();render();root.querySelector('#crm-prize-name')?.focus();return;}
  if(name==='delete-prize'&&g){const p=g.prizes.find(p=>p.id===button.dataset.pid);if(!p||!confirm('删除奖品“'+(p.name||'未命名奖品')+'”？保存前可通过放弃修改撤销。'))return;const next=removePrize(g,p.id);if(w.prizeId===p.id)w.prizeId=next;state.errors=[];changed();repairSelection();return render();}
  if(name==='move'&&g){if(movePrize(g,button.dataset.pid,Number(button.dataset.to))){changed();render();}return;}
  if(name==='add-group'){const id=root.querySelector('#crm-group-select')?.value;if(!GAMES.some(x=>x.id===id)||w.draft.groups.some(x=>x.productId===id))return;const group={id:uid('G'),productId:id,prizes:[makePrize(uid('P'))]};w.draft.groups.push(group);w.groupId=group.id;w.prizeId=group.prizes[0].id;changed();return render();}
  if(name==='delete-group'&&g){if(!confirm('移除这个产品组及其中全部奖品？保存前可通过放弃修改撤销。'))return;w.draft.groups=w.draft.groups.filter(x=>x!==g);state.errors=[];changed();repairSelection();return render();}
 }catch(error){services.toast(error.message||'操作失败，请检查本地存储空间。',true);}
}
function editInput(e){const el=e.target;if(!state.workspace||!el.dataset.model)return;const model=el.dataset.model,key=el.name;
 if(model==='base'&&baseFields.has(key))state.workspace.draft[key]=el.value;
 else if(model==='prize'&&prizeFields.has(key)&&currentPrize())currentPrize()[key]=el.value;else return;
 changed();
 if(el.tagName==='SELECT'){render();return;}
 const title=root.querySelector('[data-live="config-name"]');if(title&&key==='configName')title.textContent=el.value||'新建活动配置';
 if(model==='prize'&&['name','probability'].includes(key)){const t=root.querySelector('#crm-tree');if(t)t.innerHTML=tree(state);const h=root.querySelector('[data-live="prize-name"]');if(h)h.textContent=currentPrize().name||'未命名奖品';}
}
function input(e){if(e.target.tagName!=='SELECT')editInput(e);}function change(e){if(e.target.tagName==='SELECT')editInput(e);}
function submit(e){e.preventDefault();if(e.target.dataset.crmForm==='search'){const f=new FormData(e.target);state.keyword=String(f.get('keyword')||'').trim();state.status=String(f.get('status')||'');render();}else if(e.target.dataset.crmForm&&state.workspace)goStep(Math.min(2,state.workspace.step+1));}
function dragStart(e){const n=e.target.closest('.crm-prize-node');if(!n)return;drag={groupId:n.dataset.gid,prizeId:n.dataset.prizeId};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',drag.prizeId);}
function dragOver(e){const n=e.target.closest('.crm-prize-node');if(n&&drag&&n.dataset.gid===drag.groupId){e.preventDefault();e.dataTransfer.dropEffect='move';}}
function drop(e){const n=e.target.closest('.crm-prize-node');if(!n||!drag||drag.groupId!==n.dataset.gid)return;e.preventDefault();const g=state.workspace.draft.groups.find(g=>g.id===drag.groupId);if(g&&movePrize(g,drag.prizeId,g.prizes.findIndex(p=>p.id===n.dataset.prizeId))){changed();render();}drag=null;}
function dragEnd(){drag=null;}
function keydown(e){if(e.key==='Escape'&&modal.firstChild){closeModal();return;}if(e.key==='Tab'&&modal.firstChild){const nodes=[...modal.querySelectorAll('button:not([disabled]),textarea,input,select,[tabindex="0"]')].filter(n=>n.getClientRects().length),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
const events={click,input,change,submit,dragstart:dragStart,dragover:dragOver,drop,dragend:dragEnd};
export async function mount(props){root=props.container;services=props.services;const cached=read(workspaceKey,{});let workspace=cached.workspace; // Only accept the shape this version writes; never execute imported content.
 if(workspace&&(!workspace.draft||!Array.isArray(workspace.draft.groups)||![0,1,2].includes(workspace.step)))workspace=null;
 state={activities:api.list(),workspace:workspace||null,view:workspace&&cached.view==='editor'?'editor':'list',errors:[],folded:{},keyword:'',status:'',warned:false};repairSelection();
 root.innerHTML='<div id="crm-page"></div><div id="crm-modal"></div>';body=root.querySelector('#crm-page');modal=root.querySelector('#crm-modal');for(const [event,handler]of Object.entries(events))root.addEventListener(event,handler);document.addEventListener('keydown',keydown);render();}
export async function update(){render();}
export async function unmount(){persist();document.removeEventListener('keydown',keydown);closeModal();for(const [event,handler]of Object.entries(events))root.removeEventListener(event,handler);root.innerHTML='';root=null;body=null;modal=null;drag=null;state=null;}
