from pathlib import Path
import json, traceback, os, shutil
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs'/'screenshots';OUT.mkdir(parents=True,exist_ok=True)
HTML=(ROOT/'直接打开演示.html').read_text();results=[];errors=[];external=[]
def passed(name,detail=''):
 results.append({'name':name,'status':'PASS','detail':detail});print('PASS',name,detail,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),headless=True)
 context=b.new_context(viewport={'width':1440,'height':1100},locale='zh-CN',accept_downloads=True)
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http:','https:')) else None);page.on('dialog',lambda d:d.accept())
 def act(name,extra=''):return page.locator('[data-act="sm-'+name+'"]'+extra).first
 def cards():return page.locator('.sm-grid > .sm-card').evaluate_all('(els)=>els.map(x=>x.dataset.cardId)')
 def chosen():return page.locator('[data-sm-selected]').evaluate_all('(els)=>els.map(x=>x.dataset.smSelected)')
 def close():page.keyboard.press('Escape');expect(page.locator('.overlay')).to_have_count(0)
 def ready():page.wait_for_timeout(100)
 try:
  page.evaluate("""() => {location.hash='#/monitor/overview';window.__sdkTimers=new Set();const s=window.setInterval.bind(window),c=window.clearInterval.bind(window);window.setInterval=(fn,ms,...args)=>{const id=s(fn,ms,...args);if(ms===300000)__sdkTimers.add(id);return id;};window.clearInterval=id=>{__sdkTimers.delete(id);return c(id);};}""")
  page.set_content(HTML,wait_until='load');expect(page.locator('h1')).to_have_text('实时异常事件监控');expect(page.locator('.sm-grid > .sm-card')).to_have_count(4)
  assert cards()==['login','start','payment','download'];assert page.evaluate('window.__REPLAY_DEBUG__.snapshot().activeApp')=='monitor'
  page.screenshot(path=str(OUT/'17-SDK监控概览.png'),full_page=True)
  passed('M01 独立监控应用挂载，固定快照4张循环卡片')
  before=page.locator('[data-card-id="login"] .sm-card-metrics strong').all_inner_texts();page.locator('[data-sm-query="os"]').select_option('iOS');ready()
  after=page.locator('[data-card-id="login"] .sm-card-metrics strong').all_inner_texts();assert before!=after;assert 'os=iOS' in page.url
  passed('M02 平台筛选真正改变数据并更新URL',str(before)+' → '+str(after))
  act('region','[data-value="日本"]').click();ready();expect(act('region','[data-value="日本"]')).to_have_attribute('aria-selected','true')
  act('region','[data-value="大陆"]').click();page.locator('[data-sm-query="os"]').select_option('');ready()
  passed('M03 大区切换与平台回显正常，条件不混用')
  act('type','[data-value="游戏异常"]').click();ready();assert cards()==['start'];act('choose').click();assert len(chosen())==4;close();act('type','[data-value=""]').click();ready();assert len(cards())==4
  passed('M04 类型过滤只影响可见卡片，已选顺序不丢失')
  page.locator('[data-sm-query="grain"]').select_option('15');ready();expect(page.locator('[data-card-id="login"] [data-act="sm-point"]')).to_have_count(48)
  page.locator('[data-sm-query="metric"]').select_option('reports');ready();expect(page.locator('[data-card-id="login"] svg[role="img"]')).to_have_attribute('aria-label','登录接口异常，上报次数，今日柱状与昨日虚线')
  page.locator('[data-sm-query="grain"]').select_option('30');page.locator('[data-sm-query="metric"]').select_option('devices');ready();expect(page.locator('[data-sm-query="grain"]')).to_have_value('30');expect(page.locator('[data-card-id="login"] [data-act="sm-point"]')).to_have_count(24)
  passed('M05 时间粒度改桶数，指标切换按次数/设备数绘图')
  act('point','[data-id="login"][data-bin="8"]').click();expected=int(page.locator('#sm-point-devices').inner_text());pv=int(page.locator('#sm-point-reports').inner_text())
  total=sum(int(x) for x in page.locator('.sm-distribution-table [data-act="sm-devices"]').all_inner_texts());assert total==expected
  act('devices').click();expect(page.locator('#sm-device-total')).to_have_text(str(expected));expect(page.locator('#sm-device-reports')).to_have_text(str(pv));act('back').click()
  passed('M06 整段选点→产品分布→全部设备清单，UV/PV一致',f'{expected} 台 / {pv} 次')
  row=page.locator('.sm-distribution-table tbody tr').first;number=int(row.locator('[data-act="sm-devices"]').inner_text());row.locator('[data-act="sm-devices"]').click()
  expect(page.locator('#sm-device-total')).to_have_text(str(number));assert all('星河计划' in s for s in page.locator('.sm-modal tbody tr').all_inner_texts());act('back').click()
  passed('M07 产品设备数下钻只显示所选产品样本')
  act('point-day','[data-value="2026-04-07"]').click();expect(page.locator('.sm-point-heading')).to_contain_text('2026-04-07');act('devices').click()
  with page.expect_download() as info:act('device-export').click()
  info.value.save_as(str(OUT/'monitor-devices-test.csv'));csv=(OUT/'monitor-devices-test.csv').read_text('utf-8-sig');assert 'SDK-DEMO-' in csv and '模拟' in csv
  close();passed('M08 昨日同期使用独立样本，导出真实CSV')
  act('fullscreen','[data-id="login"]').click();expect(page.locator('.sm-full-modal')).to_be_visible();expect(page.locator('.sm-full-modal [data-act="sm-point"]')).to_have_count(24);close()
  passed('M09 放大图表复用相同数据与选点能力')
  original=cards();act('choose').click();assert chosen()==original;act('choice-remove','[data-id="start"]').click();act('choice-add','[data-id="account"]').click();close();assert cards()==original
  passed('M10 选择器打开读取当前列表，取消不污染页面')
  act('choose').click();page.locator('#sm-chart-search').fill('凭证');expect(page.locator('.sm-choice-row')).to_have_count(1);expect(page.locator('.sm-choice-row')).to_contain_text('凭证校验异常');page.locator('#sm-chart-search').fill('');page.locator('#sm-choice-type').select_option('重要接口');expect(page.locator('.sm-choice-row')).to_have_count(2)
  page.locator('#sm-choice-type').select_option('');page.locator('[data-sm-available="account"]').drag_to(page.locator('[data-sm-drop="selected"]'));assert 'account' in chosen();expect(page.locator('[data-sm-available="account"]')).to_have_count(0)
  passed('M11 搜索/类型筛选与真实拖入可选图表')
  page.locator('[data-sm-selected="account"]').drag_to(page.locator('[data-sm-selected="login"]'));assert chosen()[0]=='account';act('choice-move','[data-id="account"][data-to="1"]').click();assert chosen()[1]=='account';ids=chosen()
  page.screenshot(path=str(OUT/'18-SDK图表选择.png'),full_page=True);act('choice-confirm').click();ready();assert cards()==ids
  passed('M12 选择器拖拽和按钮排序，确认与页面同步')
  # Keep source and target visible: Chromium drag_to across separately auto-scrolled
  # cards started on the wrong row (captured dragstart id=start, requested=download).
  page.set_viewport_size({'width':1440,'height':1900})
  page.locator('[data-card-id="download"] .sm-handle').drag_to(page.locator('[data-card-id="login"] .sm-handle'));ready();assert cards()[0]=='download'
  page.set_viewport_size({'width':1440,'height':1100});act('choose').click();assert chosen()==cards();close()
  passed('M13 页面拖拽排序后重新打开选择器仍一致')
  act('choose').click()
  while len(chosen())<10:act('choice-add').click()
  expect(page.locator('#sm-selection-count')).to_have_text('10 / 10');expect(act('choice-add')).to_be_disabled();over=page.locator('[data-sm-available]').first
  over.drag_to(page.locator('[data-sm-drop="selected"]'));expect(page.locator('#toast')).to_contain_text('最多选择 10');assert len(chosen())==10
  act('choice-confirm').click();ready();assert len(cards())==10
  passed('M14 图表上限10，点击禁用与拖入校验一致')
  act('choose').click()
  for id in chosen():act('choice-remove',f'[data-id="{id}"]').click()
  act('choice-confirm').click();ready();expect(page.locator('.sm-empty')).to_contain_text('尚未选择图表');act('choose').click()
  for id in ['login','start','payment','download']:act('choice-add',f'[data-id="{id}"]').click()
  act('choice-confirm').click();ready();assert len(cards())==4
  passed('M15 空选择有明确入口，可恢复4卡片')
  act('notify','[data-id="login"]').click();expect(page.locator('.sm-modal')).to_contain_text('不会连接友信');close();expect(act('notify','[data-id="login"]')).to_have_text('关注')
  act('notify','[data-id="login"]').click();act('notify-confirm').click();expect(act('notify','[data-id="login"]')).to_have_text('已关注');expect(act('notify','[data-id="start"]')).to_have_text('关注')
  passed('M16 本地关注需确认，其他卡片独立且无真实通知')
  act('alerts','[data-id="login"]').click();expect(page.locator('.sm-alert-table tbody tr')).to_have_count(4);act('process','[data-status="done"]').click();expect(page.locator('.sm-error')).to_contain_text('请填写告警原因')
  passed('M17 复合铃铛打开告警明细，空原因阻断完成')
  page.locator('#sm-reason').fill('模拟网络超时；已核对数据。');page.locator('[data-sm-analysis]').nth(0).check();page.locator('[data-sm-analysis]').nth(1).check();expect(page.locator('#sm-reason')).to_have_value('模拟网络超时；已核对数据。')
  naive=sum(int(page.locator('.sm-alert-table [data-act="sm-devices"]').nth(i).inner_text()) for i in [0,1])
  unique=int(page.locator('#sm-analysis-devices').inner_text());assert unique<=naive;expect(page.locator('.sm-analysis')).to_contain_text('已选 2 个')
  page.screenshot(path=str(OUT/'19-SDK告警详情.png'),full_page=True)
  passed('M18 分析复选联动去重汇总且原因草稿保留',f'两窗口直接相加{naive}台，合并去重{unique}台')
  num=int(act('devices').inner_text());act('devices').click();expect(page.locator('#sm-device-total')).to_have_text(str(num));act('back').click();expect(page.locator('#sm-reason')).to_have_value('模拟网络超时；已核对数据。');expect(page.locator('[data-sm-analysis]:checked')).to_have_count(2)
  close();act('alerts','[data-id="login"]').click();expect(page.locator('#sm-reason')).to_have_value('');expect(page.locator('.sm-alert-context')).to_contain_text('待处理')
  passed('M19 告警设备数→返回保留草稿，取消不提交原因/状态')
  page.locator('#sm-reason').fill('模拟：正在核对网络配置');act('process','[data-status="processing"]').click();expect(page.locator('[data-card-id="login"] .sm-card-status')).to_contain_text('模拟处理中')
  act('alerts','[data-id="login"]').click();expect(page.locator('#sm-reason')).to_have_value('模拟：正在核对网络配置');page.locator('#sm-reason').fill('模拟：修复完成');act('process','[data-status="done"]').click()
  expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text('0');expect(page.locator('[data-card-id="start"] .sm-badge')).to_have_text('4')
  passed('M20 模拟处理中→完成→重开回显；其他事件不串改')
  page.locator('[data-sm-query="os"]').select_option('iOS');ready();expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text('4');page.locator('[data-sm-query="os"]').select_option('');ready();expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text('0')
  before=page.locator('[data-card-id="login"] .sm-card-metrics strong').all_inner_texts();act('refresh-card','[data-id="login"]').click();ready();assert before==page.locator('[data-card-id="login"] .sm-card-metrics strong').all_inner_texts();expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text('0')
  passed('M21 模拟处理按平台隔离，固定快照重算不随机刷新或重置状态')
  page.locator('[data-sm-auto]').check();expect(page.locator('[data-timer-active]')).to_have_attribute('data-timer-active','true');assert page.evaluate('__sdkTimers.size')==1
  page.locator('[data-act="review"]').click();page.locator('#replay-note').fill('图表列表共享，弹窗草稿局部，筛选联动是本次补全。');page.locator('[data-act="save-note"]').click();close()
  page.locator('[data-shell="nav"][data-path="/workbench"]').click();expect(page.locator('h1')).to_have_text('架构与覆盖清单');assert page.evaluate('__sdkTimers.size')==0;expect(page.locator('.note-grid')).to_contain_text('图表列表共享')
  page.locator('[data-shell="nav"][data-path="/monitor/overview"]').click();expect(page.locator('.sm-grid > .sm-card')).to_have_count(4);expect(act('notify','[data-id="login"]')).to_have_text('已关注');expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text('0');assert page.evaluate('__sdkTimers.size')==1
  page.locator('[data-sm-auto]').uncheck();assert page.evaluate('__sdkTimers.size')==0
  passed('M22 卸载清理定时器、返回只恢复1个；配置与笔记同会话恢复')
  with page.expect_download() as info:act('export').click()
  info.value.save_as(str(OUT/'monitor-preferences-test.json'));data=json.loads((OUT/'monitor-preferences-test.json').read_text());assert data['simulation'] is True and data['preferences']['notifications']['login'] is True;assert len(data['preferences']['selectedIds'])==4
  passed('M23 导出真实JSON，包含顺序/关注/模拟处理，明确simulation标记')
  act('point','[data-id="login"][data-bin="2"]').focus();page.keyboard.press('Enter');expect(page.locator('[role="dialog"]')).to_be_visible();page.keyboard.press('Escape');expect(page.locator('[role="dialog"]')).to_have_count(0)
  for width in [1100,768]:
   page.set_viewport_size({'width':width,'height':1000});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');act('choose').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');close()
  page.screenshot(path=str(OUT/'20-SDK监控窄屏.png'),full_page=True)
  passed('M24 键盘选点/Escape与1100、768宽度无横向溢出')
  assert not errors,errors;assert not external,external
  passed('M25 全程无脚本异常、控制台错误和外部HTTP请求')
 except Exception as e:
  traceback.print_exc();results.append({'name':'FAILED','status':'FAIL','detail':str(e)});page.screenshot(path=str(ROOT/'docs'/'monitor-browser-failure.png'),full_page=True)
 finally:
  (ROOT/'docs'/'browser-monitor-results.json').write_text(json.dumps({'harness':'Chromium set_content / native Blob modules / opaque-origin memory fallback. Not native storage persistence.','results':results,'errors':errors,'externalRequests':external},ensure_ascii=False,indent=2));b.close()
if any(x['status']=='FAIL' for x in results):raise SystemExit(1)
