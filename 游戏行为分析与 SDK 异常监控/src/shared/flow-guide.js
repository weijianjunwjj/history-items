import {FLOW_STEPS} from '../domain/journey.js';
import {scopeLabel,UNIFIED_DEFAULT,unifiedContext} from '../domain/unified.js';
import {stepDestination} from '../api/journey-api.js';
import {esc} from './dom.js';
export function renderGuide(root,route,navigate,toast){root.onclick=null;root.hidden=true;
 if(route.query.flow==='crm'){root.hidden=false;root.innerHTML='<div class="j-guide-head"><b>CRM 独立业务线</b><span>活动 → 基础 → 奖品与概率 → 规则 → 保存回显</span><button class="btn" data-home>回业务总览</button></div><small>与日志线共享宿主与通用服务，不代表业务自动联动。</small>';root.onclick=e=>{if(e.target.closest('[data-home]'))navigate('/journey');};return;}
 if(route.query.flow!=='sdk'||route.path.startsWith('/journey'))return;
 let q;try{q=unifiedContext(route.query);}catch{return;}
 const active=FLOW_STEPS.findIndex(s=>s.path===route.path);root.hidden=false;root.innerHTML=`<div class="j-guide-head"><b>联动主线</b><span>${esc(scopeLabel(q))}</span><button class="btn" data-home>业务总览</button><button class="btn" data-tech>技术数据流</button></div><div class="j-guide-steps">${FLOW_STEPS.map((s,i)=>`<button type="button" class="${active===i?'active':''}" data-step="${s.key}" ${active===i?'aria-current="step"':''}>${i+1}. ${s.label}</button>`).join('')}</div><small>${active>=0?FLOW_STEPS[active].detail:''} · 当前关联为演示新增。</small>`;
 root.onclick=e=>{try{const key=e.target.closest('[data-step]')?.dataset.step;if(key){const d=stepDestination(key,q);navigate(d.path,d.query);}if(e.target.closest('[data-home]'))navigate('/journey',q);if(e.target.closest('[data-tech]'))navigate('/journey/architecture',q);}catch(error){toast(error.message,true);}};
}
