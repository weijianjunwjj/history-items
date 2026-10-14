import {getAnalysis} from '../../../api/mock-api.js';
import {analysis,validateContext,context} from '../../../domain/queries.js';
import {DEFAULT_CONTEXT,moduleTitle} from '../../../domain/data.js';
import {read,write} from '../../../shared/store.js';
import {esc,num,pct,button,formObject,icon} from '../../../shared/dom.js';
import {heading,filters,contextStrip} from '../../../shared/ui.js';
function trendChart(trend,selectedDate,mode){
 const w=1000,h=240,left=48,right=28,top=20,bottom=43,plotH=h-top-bottom,plotW=w-left-right;
 const max=Math.max(5,...trend.flatMap(d=>d.steps.map(s=>s.devices)));const topV=Math.ceil(max/5)*5;
 const x=i=>left+(trend.length===1?plotW/2:i*plotW/(trend.length-1));const y=v=>top+plotH*(1-v/topV);
 const series=trend[0]?.steps||[];
 const lines=series.map((s,k)=>`<path class="chart-line series-${k}" d="${trend.map((d,i)=>(i?'L':'M')+x(i)+','+y(d.steps[k].devices)).join(' ')}"/>${trend.map((d,i)=>`<circle class="chart-point series-${k}" cx="${x(i)}" cy="${y(d.steps[k].devices)}" r="${d.date===selectedDate?5:3}"/>`).join('')}`).join('');
 const grid=Array.from({length:6},(_,i)=>{const v=topV*i/5;return `<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" class="grid-line"/><text x="${left-12}" y="${y(v)+4}" text-anchor="end" class="axis-label">${Math.round(v)}</text>`}).join('');
 return `<svg class="trend-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="设备趋势图；点击日期选中，数据表随之变化"><text x="0" y="12" class="axis-label">设备数</text>${grid}${selectedDate?(()=>{const i=trend.findIndex(t=>t.date===selectedDate);return i<0?'':`<rect x="${x(i)-20}" y="${top}" width="40" height="${plotH}" class="selection-band"/><line x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${h-bottom}" class="selected-line"/>`;})():''}${lines}${trend.map((d,i)=>{
 const dx=trend.length===1?plotW:plotW/(trend.length-1);const first=i===0?left:x(i)-dx/2,last=i===trend.length-1?w-right:x(i)+dx/2;
 return `<g role="button" tabindex="0" data-act="pick-date" data-date="${d.date}" aria-label="选择 ${d.date}，${d.steps[0].devices} 台设备"><rect x="${first}" y="${top}" width="${last-first}" height="${plotH+35}" class="chart-hit"/><text x="${x(i)}" y="${h-12}" text-anchor="middle" class="axis-label ${selectedDate===d.date?'selected-label':''}">${d.date.slice(5).replace('-','/')}</text><title>${d.date} · ${d.steps.map(s=>`${s.title} ${s.devices} 台`).join(' / ')}</title></g>`;
 }).join('')}</svg>`;
}
export function createPage(ctx){
 const mode=ctx.route.path.endsWith('/event')?'event':'funnel';const key=mode;
 const cached=read(key,null);let state={q:context(ctx.route.query),selectedDate:'',metric:'devices',...cached};
 let result=null,error='',busy=false,seq=0,dead=false;
 function save(){write(key,state);}
 function updateQuery(query){
  const q=context(query);if(JSON.stringify(q)!==JSON.stringify(state.q)){state.q=q;state.selectedDate='';}
  return load();
 }
 async function load(){const token=++seq;busy=true;error='';render();try{validateContext(state.q,{funnel:mode==='funnel'});const data=await getAnalysis(state.q,mode);if(dead||token!==seq)return;result=data;if(state.selectedDate&&!data.trend.some(t=>t.date===state.selectedDate))state.selectedDate='';}catch(e){if(!dead&&token===seq){error=e.message;result=null;}}finally{if(!dead&&token===seq){busy=false;save();render();}}}
 function detail(){return state.selectedDate?result.trend.find(x=>x.date===state.selectedDate).steps:result.summary;}
 function render(){
  const summary=result?.summary||[];const first=summary[0],last=summary.at(-1);
  ctx.root.innerHTML=`${heading(key,mode==='funnel'?'漏斗详情':'事件分析',mode==='funnel'?'从步骤转化到设备明细，沿真实业务关系重新走一遍。':'先区分事件次数与去重设备数，再定位具体设备。')}
  <section class="panel filter-panel">${filters(state.q,{event:mode==='event'})}<div class="filter-foot">${mode==='funnel'?'漏斗查询最多 7 个自然日；':'本次未额外推定原事件页的最大日期跨度；'}${state.q.dataset==='sdk'?'统一 SDK 样本 2026/04/07—04/08；窗口与产品条件见下方':'样本日期 2026/02/09—02/22'} · 数据为确定性模拟</div></section>
  ${error?`<div class="error-box" role="alert">${esc(error)}</div>`:''}
  ${contextStrip(state.q)}
  <div class="stats-grid"><div class="stat"><span>${mode==='funnel'?'进入漏斗设备':'去重设备'}</span><strong>${first?num(first.devices):'—'}<small>台</small></strong><p>${mode==='funnel'?'第一步：设备启动':'当前事件 · 区间去重'}</p></div><div class="stat"><span>${mode==='funnel'?'完成末步设备':'事件发生次数'}</span><strong>${last?num(mode==='funnel'?last.devices:first.events):'—'}<small>${mode==='funnel'?'台':'次'}</small></strong><p>${mode==='funnel'?'第三步：设备创角':'同一设备可产生多次事件'}</p></div><div class="stat"><span>${mode==='funnel'?'整体转化率':'设备平均事件次数'}</span><strong>${last?(mode==='funnel'?pct(last.overall):(first.devices? (first.events/first.devices).toFixed(2):'—')):'—'}</strong><p>${mode==='funnel'?'同会话有序步骤 · 区间设备去重':'事件次数 ÷ 去重设备数'}</p></div><div class="stat route-stat"><span>这条链怎么走</span><div class="mini-flow">分析 ${icon('arrow',13)} 设备 ${icon('arrow',13)} 单用户</div><p>点击趋势选日，再点击下表设备数。</p></div></div>
  <section class="panel chart-panel"><div class="panel-head"><div><h2>${mode==='funnel'?'步骤设备趋势':'事件设备趋势'}</h2><p>整列可点击，也可用键盘选择日期。</p></div><div class="legend">${summary.map((s,i)=>`<span><i class="series-bg-${i}"></i>${s.title}</span>`).join('')}</div></div>${busy?'<div class="loading">正在按查询上下文计算…</div>':result?trendChart(result.trend,state.selectedDate,mode):'<div class="empty">请修正查询条件。</div>'}</section>
  ${result&&!busy?`<section class="panel"><div class="panel-head"><div><h2>${mode==='funnel'?'步骤转化明细':'事件明细'} <span class="tag">${state.selectedDate||'整个查询区间'}</span></h2><p>蓝色设备数可下钻；它与下游设备列表使用同一口径。</p></div>${state.selectedDate?button('取消日期选中','clear-date'):''}</div><div class="table-scroll"><table class="analysis-table"><thead><tr><th>${mode==='funnel'?'漏斗步骤':'行为事件'}</th><th>事件次数</th><th>去重设备数</th>${mode==='funnel'?'<th>上一步转化率</th><th>整体转化率</th>':'<th>每设备事件次数</th>'}<th>操作</th></tr></thead><tbody>${detail().map((s,i)=>`<tr><td><span class="step-number">${String(i+1).padStart(2,'0')}</span><b>${s.title}</b></td><td class="numeric">${num(s.events)}</td><td><button class="text-link numeric" data-act="drill" data-event="${s.key}" ${s.devices?'':'disabled'}>${num(s.devices)}</button></td>${mode==='funnel'?`<td>${pct(s.previous)}</td><td><div class="rate-cell"><div class="rate-track"><i style="width:${Math.max(0,Math.min(100,(s.overall||0)*100))}%"></i></div>${pct(s.overall)}</div></td>`:`<td>${s.devices?(s.events/s.devices).toFixed(2):'—'}</td>`}<td>${button('查看设备 '+icon('arrow',13),'drill',`data-event="${s.key}" ${s.devices?'':'disabled'}`,'text-link')}</td></tr>`).join('')}</tbody></table></div><div class="panel-foot">${mode==='funnel'?'演示算法：同一会话内按设备启动 → 登录游戏 → 设备创角顺序完成；区间按设备去重。不是对原生产算法的断言。':'事件次数为日志行数；设备数为 deviceId 去重数。'}</div></section>`:''}`;
 }
 return {key,get query(){return state.q;},start:()=>updateQuery(ctx.route.query),update:updateQuery,
  onSubmit(form){if(form.dataset.form==='query'){const values=formObject(form);const q={...state.q,...values};try{validateContext(q,{funnel:mode==='funnel'});if(JSON.stringify(q)===JSON.stringify(state.q))load();else ctx.navigate(ctx.route.path,q);}catch(e){ctx.toast(e.message,true);}}},
  onClick(el){const act=el.dataset.act;if(act==='pick-date'){state.selectedDate=el.dataset.date;save();render();}if(act==='clear-date'){state.selectedDate='';save();render();}if(act==='drill'){ctx.navigate('/ebi/device',{...state.q,...(state.selectedDate?{start:state.selectedDate,end:state.selectedDate}:{}),eventType:el.dataset.event,source:mode});}if(act==='reset-query'){state.q=context(DEFAULT_CONTEXT);state.selectedDate='';ctx.navigate(ctx.route.path,state.q);load();}},
  destroy(){dead=true;seq++;save();}
 };
}
