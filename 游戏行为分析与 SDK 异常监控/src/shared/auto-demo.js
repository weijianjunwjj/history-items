import {TOUR_STEPS,createTourPlayer} from '../domain/tour.js';
import {esc,download} from './dom.js';

const abortError=()=>new DOMException('演示操作已取消','AbortError');
function sleep(ms,signal){return new Promise((resolve,reject)=>{if(signal.aborted)return reject(abortError());const abort=()=>{clearTimeout(t);reject(abortError());};const t=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);signal.addEventListener('abort',abort,{once:true});});}
export function createAutoDemo({entryUrl}){
 let overlay,frame,stage,coach,player,highlight,focusReturn,bodyOverflow,priorInert,frameCleanup=()=>{},context={},target=null,closed=true;
 const doc=()=>frame?.contentDocument;
 const check=signal=>{if(signal.aborted||closed)throw abortError();};
 async function wait(fn,signal,description='页面操作完成'){
  const deadline=Date.now()+12000;
  while(true){check(signal);const value=fn();if(value)return value;if(Date.now()>deadline)throw new Error('未等到'+description+'。自动播放已停止，没有跳过这一步。');await sleep(45,signal);}
 }
 const visible=el=>!!(el&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
 const find=(selector,signal)=>wait(()=>{const el=doc()?.querySelector(selector);return visible(el)?el:null;},signal,selector);
 async function ready(signal){await wait(()=>doc()?.querySelector('h1'),signal,'业务页面');await wait(()=>!doc().querySelector('.loading'),signal,'查询返回');await sleep(70,signal);}
 async function click(selector,signal){const el=await find(selector,signal);check(signal);if(el.disabled)throw new Error('当前按钮不可操作：'+selector);el.scrollIntoView({block:'center',behavior:'instant'});if(typeof el.click==='function')el.click();else el.dispatchEvent(new frame.contentWindow.MouseEvent('click',{bubbles:true}));await sleep(60,signal);}
 async function fill(selector,value,signal){const el=await find(selector,signal);check(signal);el.value=value;el.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));await sleep(35,signal);}
 const text=selector=>doc().querySelector(selector)?.textContent.trim()||'';
 const number=s=>Number(String(s).replace(/[^\d.-]/g,''));
 const requireValue=(condition,message)=>{if(!condition)throw new Error(message);};
 async function run(index,signal,fast){
  let proof='';const id=TOUR_STEPS[index].id;target=null;highlight.hidden=true;
  if(id==='overview'){await ready(signal);proof='六步业务主线与 CRM 独立支线可见';}
  if(id==='definition'){await click('.j-hero [data-flow-open="define"]',signal);await find('#rp-base-alias',signal);requireValue(doc().querySelector('#rp-base-alias').value==='sdk_login_error','联动事件没有正确加载');proof='URL 指向同一个登录异常事件定义';}
  if(id==='fields'){await click('[data-act="rp-step"][data-step="1"]',signal);await find('.rp-tree-node',signal);proof=`字段树已加载 ${doc().querySelectorAll('.rp-tree-node').length} 个节点`;}
  if(id==='panels'){await click('[data-act="rp-step"][data-step="2"]',signal);await fill('#rp-item-label','设备标识 · 自动演示',signal);await click('[data-act="rp-save"]',signal);requireValue(text('#rp-save-state').includes('已保存'),'演示配置未保存');proof='列名已实际修改并保存到独立演示内存';}
  if(id==='preview'){await click('[data-act="rp-preview"]',signal);await find('.rp-preview-table',signal);requireValue(text('.rp-preview-table th').includes('设备标识 · 自动演示'),'保存的配置没有影响预览');context.total=number(text('#rp-preview-total'));proof=`新列名出现在表头；同源 ${context.total} 条上报记录`;}
  if(id==='source'){await click('#journey-guide [data-step="source"]',signal);await ready(signal);requireValue(number(text('#jr-record-count'))===context.total,'预览与共享来源记录数不一致');proof=`${text('#jr-source-count')} 行计数样本 → ${text('#jr-record-count')} 次上报 / ${text('#jr-device-count')} 台设备`;}
  if(id==='monitor'){await click('[data-flow-open="monitor"]',signal);await ready(signal);await find('[data-card-id="login"]',signal);requireValue(text('[data-card-id="login"] .sm-card-metrics').includes(String(context.total)),'监控与来源页上报数不同');proof=`登录异常卡片读取同源 ${context.total} 次上报`;}
  if(id==='window'){await click('[data-act="sm-point"][data-id="login"][data-bin="8"]',signal);await find('#sm-point-devices',signal);context.uv=number(text('#sm-point-devices'));context.pv=number(text('#sm-point-reports'));requireValue(context.uv>0&&context.pv>=context.uv,'演示时间窗口没有有效记录');proof=`04:00—04:30：${context.uv} 台设备 / ${context.pv} 次上报`;}
  if(id==='analysis'){await click('[data-act="sm-linked-analysis"]',signal);await ready(signal);await find('.analysis-table',signal);requireValue(number(text('.analysis-table [data-act="drill"]'))===context.uv,'监控与分析设备数不一致');requireValue(number(text('.analysis-table tbody tr td:nth-child(2)'))===context.pv,'监控与分析上报次数不一致');proof=`通过跨页核对：${context.uv} 台 / ${context.pv} 次，窗口参数完整`;}
  if(id==='devices'){await click('.analysis-table [data-act="drill"]',signal);await ready(signal);await find('[data-act="open-user"]',signal);proof=`设备清单保留原时间窗口；目标范围 ${context.uv} 台设备`;}
  if(id==='group'){await click('[data-act="view"][data-view="group"]',signal);await find('.aggregate-bar',signal);await click('[data-change="group-field"][value="os"]',signal);await ready(signal);const ch=doc().querySelector('[data-change="group-field"][value="channel"]');if(ch?.checked){await click('[data-change="group-field"][value="channel"]',signal);await ready(signal);}await find('[data-act="group-detail"]',signal);context.group=number(text('[data-act="group-detail"]'));proof=`按操作系统聚合，第一组 ${context.group} 台设备`;}
  if(id==='group-detail'){await click('[data-act="group-detail"]',signal);await ready(signal);const el=await find('[role="dialog"] [data-act="open-user"]',signal);const row=el.closest('tr');context.device=el.textContent.trim();context.devicePV=number(row.querySelector('td:nth-child(6)').textContent);requireValue(text('[role="dialog"] header p').includes(String(context.group)),'分组弹窗数量不匹配');proof=`只查看本组 ${context.group} 台；选中 ${context.device}，${context.devicePV} 次异常`;}
  if(id==='user'){await click('[role="dialog"] [data-act="open-user"]',signal);await ready(signal);const q=await find('#device-query',signal);requireValue(q.value===context.device,'下钻设备 ID 丢失');const tag=await find('.data-module[data-module="abnormalData"] .module-toggle .tag',signal);requireValue(number(tag.textContent)===context.devicePV,'单设备异常条数与设备行不一致');context.userHash=frame.contentWindow.location.hash;proof=`${context.device}：上游 ${context.devicePV} 次 = 单用户 ${context.devicePV} 条`;}
  if(id==='architecture'){await click('#journey-guide [data-tech]',signal);await ready(signal);await find('#jr-latest-query',signal);requireValue(text('#jr-latest-query').includes('getModule')&&text('#jr-latest-query').includes(context.device),'真实查询记录中缺少当前设备');proof='实际 getModule 请求、设备 ID、查询参数与结果已显示';}
  if(id==='crm'){await click('[data-act="jr-home"]',signal);await ready(signal);await click('[data-act="jr-crm"]',signal);await ready(signal);await find('.crm-activity-table',signal);proof='切换到独立 CRM 应用；没有伪造 SDK → 抽奖业务因果';}
  if(id==='prizes'){await click('[data-act="crm-edit"][data-id="DEMO-CFG-001"]',signal);await click('[data-act="crm-next"]',signal);await fill('#crm-prize-name','演示礼盒 · 切换不丢失',signal);await click('[data-act="crm-select-prize"][data-pid="P-02"]',signal);await click('[data-act="crm-select-prize"][data-pid="P-01"]',signal);requireValue(doc().querySelector('#crm-prize-name').value==='演示礼盒 · 切换不丢失','奖品切换丢失编辑值');proof='奖品 A → B → A，修改后的名称保留';}
  if(id==='validation'){await fill('#crm-prize-probability','60',signal);await click('[data-act="crm-next"]',signal);await find('.crm-errors',signal);requireValue(text('.crm-errors').includes('100%')&&text('.crm-step.active').includes('奖品设置'),'超限没有正确阻断');proof='预期校验通过：110% 被阻断，仍停留在奖品设置';}
  if(id==='save'){await fill('#crm-prize-probability','20',signal);await click('[data-act="crm-next"]',signal);await find('#crm-base-rewardRule',signal);await click('[data-act="crm-save"]',signal);requireValue(text('#crm-save-state').includes('已保存'),'CRM 未成功保存');await click('[data-act="crm-back"]',signal);await click('[data-act="crm-edit"][data-id="DEMO-CFG-001"]',signal);await click('[data-act="crm-step"][data-step="1"]',signal);requireValue(doc().querySelector('#crm-prize-name').value==='演示礼盒 · 切换不丢失'&&Number(doc().querySelector('#crm-prize-probability').value)===20,'CRM 重开后值未恢复');proof='70% 允许保存；返回列表重开，奖品名称与 20% 概率均保留';}
  if(id==='recap'){check(signal);const query=context.userHash?.split('?')[1]||'';frame.contentWindow.location.hash='#/journey/architecture'+(query?'?'+query:'');await ready(signal);await find('.j-stack',signal);proof='业务主线 + 技术调用 + CRM 配置闭环均已实际操作完成';}
  check(signal);if(!fast){target=await find(TOUR_STEPS[index].target,signal);target.scrollIntoView({block:'center',behavior:'instant'});await sleep(60,signal);positionHighlight();}
  return {proof,at:new Date().toISOString(),path:frame.contentWindow.location.hash};
 }
 function positionHighlight(){if(!target?.isConnected||!highlight||closed)return;const a=target.getBoundingClientRect(),b=frame.getBoundingClientRect(),s=stage.getBoundingClientRect();const left=Math.max(b.left,a.left+b.left),top=Math.max(b.top,a.top+b.top),right=Math.min(b.right,a.right+b.left),bottom=Math.min(b.bottom,a.bottom+b.top);if(right<=left||bottom<=top){highlight.hidden=true;return;}highlight.hidden=false;Object.assign(highlight.style,{left:(left-s.left)+'px',top:(top-s.top)+'px',width:(right-left)+'px',height:(bottom-top)+'px'});}
 async function reset(signal){
  frameCleanup();context={};target=null;frame?.remove();frame=document.createElement('iframe');frame.className='demo-frame';frame.dataset.replayDemoSession='true';frame.title='独立临时会话中的业务自动演示';stage.prepend(frame);
  const assets=[...document.querySelectorAll('head style,head link[rel="stylesheet"]')].map(n=>n.tagName==='STYLE'?n.outerHTML:`<link rel="stylesheet" href="${esc(n.href)}">`).join('');
  frame.srcdoc=`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>独立自动演示</title><link rel="icon" href="data:,">${assets}<style>html{scroll-behavior:auto!important}.sidebar-bottom{display:none}.demo-start{display:none!important}</style></head><body><div id="shell">正在加载独立演示…</div><script type="module" src="${esc(entryUrl)}"></script></body></html>`;
  await wait(()=>frame.contentWindow?.__REPLAY_DEBUG__&&doc()?.querySelector('h1'),signal,'独立演示入口');await ready(signal);
  const trusted=e=>{if(e.isTrusted&&!closed&&player.snapshot().status!=='manual')player.takeover();};
  doc().addEventListener('pointerdown',trusted,true);doc().addEventListener('keydown',trusted,true);doc().addEventListener('scroll',positionHighlight,true);
  frameCleanup=()=>{try{doc()?.removeEventListener('pointerdown',trusted,true);doc()?.removeEventListener('keydown',trusted,true);doc()?.removeEventListener('scroll',positionHighlight,true);}catch{}};
 }
 function render(state){
  if(closed)return;const step=TOUR_STEPS[Math.max(0,state.index)],last=state.receipts.find(x=>x.index===state.index);
  overlay.dataset.status=state.status;overlay.dataset.step=String(state.index);overlay.dataset.autoplay=String(state.autoplay);
  const busy=state.status==='loading',manual=state.status==='manual',finished=state.status==='complete';
  const status=busy?(state.preparing?'恢复步骤现场':'正在执行操作'):manual?'已手动接管':finished?'演示完成':state.status==='error'?'已停止 · 需要重试':state.autoplay?'自动播放中':'已暂停';
  overlay.querySelector('#demo-status').textContent=status;
  stage.querySelector('.demo-loading').hidden=!busy;stage.querySelector('.demo-loading span').textContent=state.preparing?`恢复到第 ${state.index+1} 步 · 已执行 ${state.preparedIndex+1} 步`:'正在执行当前业务操作…';
  if(manual){target=null;highlight.hidden=true;}else if(!busy)positionHighlight();
  coach.innerHTML=`<div class="demo-coach-heading"><div><span class="demo-chapter">${esc(step.chapter)} · ${state.index+1} / ${TOUR_STEPS.length}</span><h2 id="demo-step-title">${esc(step.title)}</h2></div><label class="demo-jump-label">跳到<select id="demo-jump" aria-label="跳到演示步骤" ${busy?'disabled':''}>${TOUR_STEPS.map((s,i)=>`<option value="${i}" ${state.index===i?'selected':''}>${i+1}. ${esc(s.title)}</option>`).join('')}</select></label></div>
  <div class="demo-narration" aria-live="polite"><p><b>业务在做什么</b>${esc(step.business)}</p><p><b>技术如何串联</b>${esc(step.technical)}</p><p class="demo-takeaway"><b>这一站记住</b>${esc(step.remember)}</p></div>
  <div class="demo-proof ${state.status==='error'?'demo-error':''}" role="status">${state.status==='error'?esc(state.error):manual?'已停止自动操作。你可以在上方页面自由尝试；重新播放会先恢复演示现场。':last?'✓ 实际结果：'+esc(last.proof):'正在操作真实页面，成功后才进入下一步。'}</div>
  <div class="demo-controls"><div><button type="button" data-demo="previous" class="btn" ${busy||state.index<=0||manual?'disabled':''}>← 上一步</button><button type="button" data-demo="play" class="btn primary">${state.autoplay?'Ⅱ 暂停':manual?'恢复现场并播放':finished?'↻ 从头重播':state.status==='error'?'重试这一步':'▶ 继续播放'}</button><button type="button" data-demo="next" class="btn" ${busy||manual||finished?'disabled':''}>${state.index===TOUR_STEPS.length-1?'完成演示':'下一步 →'}</button><label class="demo-speed-label">速度<select id="demo-speed" aria-label="自动演示播放速度">${[[0.5,'慢一点'],[1,'正常'],[2,'快速']].map(([v,t])=>`<option value="${v}" ${state.speed===v?'selected':''}>${t}</option>`).join('')}</select></label></div><div><button type="button" data-demo="takeover" class="btn" ${manual?'disabled':''}>我来操作</button><button type="button" data-demo="export" class="btn" ${!state.receipts.length?'disabled':''}>导出本次讲解与结果</button></div></div>`;
 }
 function exportResult(){const state=player.snapshot();download('友谊时光-自动演示讲解与结果.json',JSON.stringify({version:'0.6.0',simulation:true,createdAt:new Date().toISOString(),status:state.status,completedSteps:state.receipts.length,totalSteps:TOUR_STEPS.length,steps:TOUR_STEPS.map((s,i)=>({...s,result:state.receipts.find(x=>x.index===i)||null})),boundary:'本次新增导览。独立临时会话中的真实页面操作，不是公司生产系统；未执行步骤无结果。'},null,2),'application/json');}
 function close(){if(closed)return;closed=true;player.stop();frameCleanup();window.removeEventListener('resize',positionHighlight);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',key);overlay.remove();frame=null;document.body.style.overflow=bodyOverflow;document.querySelector('#shell').inert=priorInert;focusReturn?.isConnected&&focusReturn.focus();}
 function visibility(){if(document.hidden)player.pause();}
 function key(e){if(e.key==='Escape'){e.preventDefault();player.pause();overlay.querySelector('[data-demo="play"]')?.focus();}}
 function open(){
  if(!closed){overlay.querySelector('[data-demo="play"]')?.focus();return;}closed=false;focusReturn=document.activeElement;bodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';priorInert=document.querySelector('#shell').inert;document.querySelector('#shell').inert=true;
  overlay=document.createElement('section');overlay.className='auto-demo';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','业务与技术自动串联演示');
  overlay.innerHTML='<header class="demo-header"><div><span class="demo-logo">▶</span><div><strong>跟着流程走一遍</strong><small>独立临时会话 · 不改你的配置与笔记</small></div></div><div><span id="demo-status" class="tag success">准备演示</span><button type="button" class="btn" data-demo="close">结束并返回原工作区 ×</button></div></header><div class="demo-stage"><div class="demo-highlight" hidden><span>看这里</span></div><div class="demo-loading"><span>准备独立演示…</span></div></div><section class="demo-coach"></section>';
  document.body.append(overlay);stage=overlay.querySelector('.demo-stage');highlight=overlay.querySelector('.demo-highlight');coach=overlay.querySelector('.demo-coach');
  player=createTourPlayer({reset,run,notify:render});
  overlay.addEventListener('click',e=>{const action=e.target.closest('[data-demo]')?.dataset.demo;if(!action)return;if(action==='close')close();if(action==='play')player.snapshot().autoplay?player.pause():player.resume();if(action==='next')player.next();if(action==='previous')player.previous();if(action==='takeover')player.takeover();if(action==='export')exportResult();});
  overlay.addEventListener('change',e=>{if(e.target.id==='demo-speed')player.speed(e.target.value);if(e.target.id==='demo-jump')player.jump(Number(e.target.value));});
  window.addEventListener('resize',positionHighlight);document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',key);player.start(true);overlay.querySelector('[data-demo="close"]')?.focus();
 }
 return {open,close,snapshot:()=>closed?null:player.snapshot()};
}
