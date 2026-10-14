import {flushStorage,sqlClient} from '../../shared/store.js';
import {reviewDrawer,columnDialog} from '../../shared/ui.js';
import {write,localStore,persistentStorageAvailable} from '../../shared/store.js';
const loaders={funnel:()=>import('./pages/analysis.js'),event:()=>import('./pages/analysis.js'),device:()=>import('./pages/device.js'),user:()=>import('./pages/user.js')};
let root,modalRoot,page,services,route,lastPath='',changeSeq=0,restoreFocus;
export async function bootstrap(){ /* The business app owns no DOM until mounted. */ }
function closeModal(notify=true){if(modalRoot)modalRoot.innerHTML='';document.body.classList.remove('modal-open');if(notify)page?.onModalClose?.();if(restoreFocus?.isConnected)restoreFocus.focus();}
function openModal(html){restoreFocus=document.activeElement;modalRoot.innerHTML=html;document.body.classList.add('modal-open');queueMicrotask(()=>modalRoot.querySelector('button,textarea,input')?.focus());}
function selectedColumns(){const keys=[...modalRoot.querySelectorAll('.column-item input:checked')].map(i=>i.dataset.colCheck);if(!keys.length)throw new Error('至少保留一列。');return keys;}
async function click(e){
 if(e.target.classList.contains('overlay')){closeModal();return;}
 const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
 try{
 const act=el.dataset.act;
 if(act==='review'){openModal(reviewDrawer(page.key,page.query));return;}
 if(act==='close-modal'){closeModal();return;}
 if(act==='save-note'){const ok=write('note:'+el.dataset.noteKey,modalRoot.querySelector('#replay-note').value,localStore);if(ok)await flushStorage();if(!modalRoot)return;modalRoot.querySelector('#note-status').textContent=ok?(persistentStorageAvailable?' 已保存到本机':' 已暂存；刷新前请导出笔记'):' 存储失败，请复制保存';return;}
 if(act==='copy-link'){const text=modalRoot.querySelector('#share-url');try{await navigator.clipboard.writeText(text.value);modalRoot.querySelector('#copy-status').textContent='链接已复制。';}catch{text.focus();text.select();modalRoot.querySelector('#copy-status').textContent='浏览器未允许自动复制。链接已选中，请按 Ctrl+C / ⌘C。';}return;}
 if(act==='column-up'||act==='column-down'){const item=el.closest('.column-item');const sibling=act==='column-up'?item.previousElementSibling:item.nextElementSibling;if(sibling){if(act==='column-up')item.parentElement.insertBefore(item,sibling);else item.parentElement.insertBefore(sibling,item);}const rows=[...item.parentElement.children];rows.forEach((r,i)=>{r.querySelector('[data-act="column-up"]').disabled=i===0;r.querySelector('[data-act="column-down"]').disabled=i===rows.length-1;});return;}
 page?.onClick?.(el);
 }catch(error){services.toast(error.message,true);}
}
function change(e){page?.onChange?.(e.target);}
function submit(e){e.preventDefault();page?.onSubmit?.(e.target);}
function keydown(e){if(e.key==='Escape'){closeModal();return;}if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-act]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
 if(e.key==='Tab'&&modalRoot?.firstElementChild){const nodes=[...modalRoot.querySelectorAll('button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]')].filter(n=>n.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
}
export async function mount(props){root=props.container;services=props.services;root.innerHTML='<div id="ebi-page"></div><div id="ebi-modal"></div>';modalRoot=root.querySelector('#ebi-modal');root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('submit',submit);root.addEventListener('keydown',keydown);await update(props.route);}
export async function update(next){route=next;const token=++changeSeq;const key=route.path.split('/').at(-1);if(!loaders[key])throw new Error('未知业务页面。');
 if(lastPath===route.path&&page){closeModal();return page.update(route.query);}
 page?.destroy();closeModal();lastPath=route.path;const module=await loaders[key]();if(token!==changeSeq)return;
 page=module.createPage({root:root.querySelector('#ebi-page'),route,navigate:services.navigate,toast:services.toast,openModal,closeModal:()=>closeModal(false),columns:(cols,keys,scope)=>openModal(columnDialog(cols,keys,scope)),selectedColumns});await page.start();
}
export async function unmount(){changeSeq++;page?.destroy();page=null;lastPath='';closeModal(false);root.removeEventListener('click',click);root.removeEventListener('change',change);root.removeEventListener('submit',submit);root.removeEventListener('keydown',keydown);root.innerHTML='';root=null;}
