/** Replay assistance added in v0.6, not a feature of the historical system. */
export const TOUR_STEPS = [
 {id:'overview', chapter:'业务主线', title:'先认路：追查一次登录异常', target:'.j-hero', business:'运营看到登录异常后，需要回答：什么时候发生、影响多少设备、具体是哪几台。', technical:'下面将实际操作配置、监控、分析与查询页面；它们读取同一批固定样本，而不是播放截图。', remember:'先配置数据语义，再发现问题，最后定位记录。'},
 {id:'definition', chapter:'业务主线', title:'先定义“这是什么事件”', target:'#rp-base-alias', business:'事件名称、别名与所属模型，决定业务在记录什么。这里自动打开登录异常的联动示例。', technical:'宿主通过 URL 传入 definitionId，Report 应用加载相应配置；不是由菜单直接维护表单。', remember:'配置端定义含义，不等于真实日志已经采集。'},
 {id:'fields', chapter:'业务主线', title:'事件由哪些字段组成', target:'.rp-tree', business:'设备、时间、产品、系统等字段让一条异常记录能够被解释、筛选和追踪。', technical:'字段树保存稳定 ID 与属性；列表、查询、详情通过 ID 引用字段，不复制三套互不相关的定义。', remember:'字段定义与页面展示配置是两层职责。'},
 {id:'panels', chapter:'业务主线', title:'同一字段，配置三种用途', target:'.rp-zone-tabs', business:'现在自动修改第一列的显示名称，并在独立演示会话里保存。列表、查询和详情各有自己的配置。', technical:'输入事件更新编辑状态，保存前校验；修改列表文案不应该改掉查询条件的文案或字段 ID。', remember:'注意：改的是展示配置，不是底层事实记录。'},
 {id:'preview', chapter:'业务主线', title:'配置确实改变页面', target:'.rp-preview-table', business:'刚保存的列名已经出现在预览表头。这里不是另一张写死的示例表。', technical:'已保存配置 → 字段投影 → 列表与筛选。表格数据仍来自 SDK 主线同一批记录。', remember:'界面发生变化，不意味着数据数量应该变化。'},
 {id:'source', chapter:'业务主线', title:'把数据来源讲清楚', target:'.stats-grid', business:'次数、设备数、计数样本行是三种口径。不能把“上报了几次”说成“影响了几个人”。', technical:'计数样本按 reports 展开；每条演示记录保留来源标识。UV 按 deviceId 去重，PV 累计上报次数。', remember:'固定 Mock 也能验证关系；这里没有真实采集服务。'},
 {id:'monitor', chapter:'业务主线', title:'在监控卡片发现异常', target:'[data-card-id="login"]', business:'监控负责展示整体趋势，让人找到需要进一步调查的时间段。', technical:'卡片由数据列表生成；筛选条件决定同一数据源的投影和聚合。', remember:'监控回答“哪里可能有问题”，不直接给出完整原因。'},
 {id:'window', chapter:'业务主线', title:'选中一个具体时段', target:'.sm-summary', business:'自动点击 04:00—04:30，记录这个窗口的设备数与上报次数，接下来逐页核对。', technical:'同一窗口使用左闭右开的时间范围；下钻必须携带事件、日期、窗口、大区、产品和平台。', remember:'跨页的重点不是跳转成功，而是条件不能丢。'},
 {id:'analysis', chapter:'业务主线', title:'从监控进入事件分析', target:'.analysis-table', business:'自动进入分析页，并核对这里的次数和设备数与刚才的监控窗口一致。', technical:'URL 上下文 → Shell → EBI → Mock API → 过滤聚合 → 表格；没有换成另一批随机数。', remember:'同一个窗口、同一批数据、同一套口径。'},
 {id:'devices', chapter:'业务主线', title:'从数量落到设备清单', target:'#ebi-page .table-scroll', business:'点击设备数，进入实际设备列表。每一行是一台设备，旁边是它的异常次数。', technical:'明细页消费上游查询上下文；设备汇总和记录明细不是相同的数据粒度。', remember:'设备数要能追溯到设备 ID，而不是孤立指标。'},
 {id:'group', chapter:'业务主线', title:'按系统分组，缩小排查范围', target:'.aggregate-bar', business:'自动切换分组聚合，并按操作系统分组，观察问题集中在哪一组。', technical:'页面壳保留公共上下文；分组视图改变聚合维度，但没有更换事实来源。', remember:'复用公共查询上下文，不把所有模式揉成一个巨型组件。'},
 {id:'group-detail', chapter:'业务主线', title:'点击一组，查看它的设备', target:'[role="dialog"] .table-scroll', business:'现在打开第一组设备的明细弹窗；弹窗只展示这一组，而不是再次显示全部设备。', technical:'分组值叠加公共条件；弹窗拥有独立加载和分页入口，可以复用设备表格。', remember:'复用视图，不等于让分页与加载状态互相串改。'},
 {id:'user', chapter:'业务主线', title:'追到同一设备的异常记录', target:'.data-module[data-module="abnormalData"]', business:'自动进入该设备的单用户查询，核对异常条数与设备行一致。', technical:'稳定 deviceId + 原时间窗口继续传递；七模块各管局部状态。来源没有提供的六类正常行为保持为空。', remember:'异常快照不能补造成完整用户旅程，也不能据此计算正常转化率。'},
 {id:'architecture', chapter:'技术拆解', title:'对着刚才的调用讲架构', target:'#jr-latest-query', business:'业务已经走通，现在回头看刚刚发生的查询，而不是背一串技术名词。', technical:'这一栏来自本会话真实执行记录，包含 getModule 的设备 ID、时间范围与返回数量。旁边展示宿主、应用、API、转换与存储的边界。', remember:'历史是 Vue2 / single-spa；现在是原生 ESM 复现，不能混为一谈。'},
 {id:'crm', chapter:'CRM 独立支线', title:'CRM 是另一条业务线', target:'.crm-activity-table', business:'运营配置活动、奖品与领奖规则。这不是异常日志的下一步，不伪造“抽奖触发告警”的关系。', technical:'CRM 与 EBI 共享宿主和通用服务，但保留独立状态和业务规则。', remember:'系统统一入口，不代表所有业务都有因果关系。'},
 {id:'prizes', chapter:'CRM 独立支线', title:'奖品树与表单的状态联动', target:'.crm-prize-layout', business:'自动改奖品 A 的名字，切到 B 再切回 A，检查修改没有消失。', technical:'用稳定奖品 ID 选择编辑对象；树与表单展示同一份编辑数据，切换时不丢缓存。', remember:'真正的难点是选择状态、编辑缓存与校验一起正确。'},
 {id:'validation', chapter:'CRM 独立支线', title:'故意超限，观察如何阻断', target:'.crm-errors', business:'故意把第一个奖品概率改成 60%，产品组合计变为 110%。下一步必须被阻断并定位到错误组。', technical:'校验按产品组汇总，错误状态映射回树和表单；这一步出现红色提示是预期演示结果。', remember:'“不能超过 100%”不等于“必须恰好 100%”。'},
 {id:'save', chapter:'CRM 独立支线', title:'修正、保存、重新打开', target:'#crm-save-state', business:'改回 20%，本组合计 70%，允许继续。保存后返回列表重开，确认奖品名称仍然正确。', technical:'编辑草稿与已保存结果分离。演示内保存到独立临时仓储，不发布活动，也不写入你的工作区。', remember:'完整闭环不是点一下保存，而是重开后值和规则仍然成立。'},
 {id:'recap', chapter:'收束', title:'走通了：现在用三句话讲清楚', target:'.j-stack', business:'第一，配置决定记录的含义和展示。第二，监控、分析、设备与单用户共享事实和上下文。第三，CRM 是独立配置闭环。', technical:'从用户动作开始，按 URL → 宿主 → 业务应用 → API / 转换 → 状态 → 展示解释。下方可导出本次实际执行结果。', remember:'演示证明现在能理解和操作，不自动证明当年的原创范围或生产指标。'}
];

/** Cancellable playback; UI rendering and business actions are injected. */
export function createTourPlayer({steps=TOUR_STEPS, reset, run, notify=()=>{}, setTimer=setTimeout, clearTimer=clearTimeout}) {
 let state={index:-1,status:'idle',autoplay:false,speed:1,error:'',preparing:false,preparedIndex:-1,receipts:[]};
 let controller=null,timer=null,revision=0;
 const snapshot=()=>({...state,receipts:state.receipts.map(x=>({...x}))});
 const emit=()=>notify(snapshot());
 function clear(){if(timer!==null)clearTimer(timer);timer=null;}
 function schedule(){clear();if(state.status!=='playing'||!state.autoplay)return;timer=setTimer(()=>{timer=null;if(state.index===steps.length-1){state.status='complete';state.autoplay=false;emit();}else go(state.index+1,{autoplay:true});},8000/state.speed);}
 async function go(index,{autoplay=false,rebuild=false}={}){
  if(!Number.isInteger(index)||index<0||index>=steps.length)throw new RangeError('演示步骤超出范围');
  clear();controller?.abort();controller=new AbortController();const signal=controller.signal,ticket=++revision;
  const mustReset=rebuild||state.status==='idle'||state.status==='manual'||state.status==='error'||index!==state.index+1;
  state={...state,index,status:'loading',autoplay,error:'',preparing:mustReset,preparedIndex:-1};emit();
  try{
   if(mustReset){state.receipts=[];await reset(signal);for(let i=0;i<index;i++){if(signal.aborted)return;const data=await run(i,signal,true);if(signal.aborted)return;state.receipts.push({index:i,id:steps[i].id,...data});state.preparedIndex=i;emit();}}
   if(signal.aborted)return;const data=await run(index,signal,false);if(signal.aborted||ticket!==revision)return;
   state.receipts=state.receipts.filter(x=>x.index<index);state.receipts.push({index,id:steps[index].id,...data});state.preparing=false;state.status=state.autoplay?'playing':'paused';emit();schedule();
  }catch(error){if(signal.aborted||ticket!==revision)return;state.status='error';state.autoplay=false;state.preparing=false;state.error=error.message||String(error);emit();}
 }
 return {snapshot,start:(autoplay=true)=>go(0,{autoplay,rebuild:true}),jump:index=>go(index,{autoplay:false}),
  next(){if(state.status==='loading'||state.status==='manual')return;if(state.index>=steps.length-1){clear();state.status='complete';state.autoplay=false;emit();return;}return go(state.index+1,{autoplay:state.autoplay});},
  previous(){if(state.status==='loading'||state.index<=0)return;return go(state.index-1,{autoplay:false});},
  pause(){clear();state.autoplay=false;if(state.status==='playing')state.status='paused';emit();},
  resume(){if(['manual','error'].includes(state.status))return go(Math.max(0,state.index),{autoplay:true,rebuild:true});if(state.status==='complete')return go(0,{autoplay:true,rebuild:true});if(state.status==='idle')return go(0,{autoplay:true,rebuild:true});state.autoplay=true;if(state.status==='paused')state.status='playing';emit();schedule();},
  takeover(){clear();controller?.abort();revision++;state.status='manual';state.autoplay=false;state.preparing=false;emit();},
  speed(value){if(![0.5,1,2].includes(Number(value)))return;state.speed=Number(value);emit();schedule();},
  stop(){clear();controller?.abort();revision++;state.status='idle';state.autoplay=false;emit();}
 };
}
