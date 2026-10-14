from pathlib import Path
import json,shutil,traceback
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'docs'/'screenshots'; OUT.mkdir(exist_ok=True)
HTML=(ROOT/'直接打开演示.html').read_text(); results=[]; errors=[]; external=[]
def ok(name,detail=''):
 results.append({'name':name,'status':'PASS','detail':detail}); print('PASS',name,detail,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True)
 c=b.new_context(viewport={'width':1440,'height':1100},locale='zh-CN',accept_downloads=True)
 page=c.new_page(); page.on('pageerror',lambda e:errors.append(str(e))); page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.on('request',lambda r:external.append(r.url) if r.url.startswith(('http:','https:')) else None)
 page.on('dialog',lambda d:d.accept())
 def settled(idx):
  expect(page.locator('.auto-demo')).to_have_attribute('data-step',str(idx),timeout=30000)
  page.wait_for_function("!['loading','idle'].includes(document.querySelector('.auto-demo').dataset.status)",timeout=30000)
  if page.locator('.auto-demo').get_attribute('data-status')=='error':raise AssertionError(page.locator('.demo-proof').inner_text())
 def nextstep(idx):
  page.locator('[data-demo="next"]').click(); settled(idx)
 try:
  page.set_content(HTML,wait_until='load'); expect(page.locator('h1')).to_have_text('业务流程与技术架构')
  expect(page.locator('.j-hero [data-shell="demo"]')).to_be_visible();ok('D01 总览和全局按钮可进入自动演示')
  page.locator('[data-shell="nav"][data-path="/crm/activities"]').click();expect(page.locator('h1')).to_have_text('活动与抽奖配置')
  page.locator('[data-act="crm-edit"][data-id="DEMO-CFG-001"]').click();page.locator('#crm-base-configName').fill('我的原工作区草稿-不要覆盖')
  page.locator('[data-act="review"]').click();page.locator('#replay-note').fill('原工作区笔记-需要保留');page.locator('[data-act="save-note"]').click();page.keyboard.press('Escape')
  original_url=page.url
  page.locator('.topbar [data-shell="demo"]').click();page.locator('[data-demo="play"]').click();settled(0)
  expect(page.locator('.auto-demo')).to_have_attribute('data-status','paused');f=page.frame_locator('.demo-frame');expect(f.locator('h1')).to_have_text('业务流程与技术架构')
  expect(f.locator('.demo-start')).to_have_count(0);ok('D02 独立会话实际加载，默认自动播放可立即暂停，无递归播放器')
  page.wait_for_timeout(600);expect(page.locator('.auto-demo')).to_have_attribute('data-step','0');ok('D03 暂停停留当前站，不自动推进')
  for i in range(1,19):
   nextstep(i);proof=page.locator('.demo-proof').inner_text();ok(f'D{3+i:02} 第{i+1}站真实操作与结果核对',proof)
   if i==8:page.screenshot(path=str(OUT/'27-自动演示跨页核对.png'),full_page=True)
   if i==13:page.screenshot(path=str(OUT/'28-自动演示技术调用.png'),full_page=True)
   if i==16:page.screenshot(path=str(OUT/'29-自动演示预期校验.png'),full_page=True)
  page.locator('[data-demo="next"]').click();expect(page.locator('.auto-demo')).to_have_attribute('data-status','complete');ok('D22 全流程完成后停止，不无限循环')
  with page.expect_download() as data:page.locator('[data-demo="export"]').click()
  data.value.save_as(str(OUT/'demo-run-test.json'));report=json.loads((OUT/'demo-run-test.json').read_text());assert report['completedSteps']==19 and all(x['result'] for x in report['steps']);ok('D23 导出19站实际结果，不把未运行的步骤标为成功')
  page.locator('#demo-jump').select_option('8');settled(8);expect(page.locator('.auto-demo')).to_have_attribute('data-status','paused');expect(page.locator('.demo-proof')).to_contain_text('10 台 / 25 次');ok('D24 跳回事件分析会重建前置现场并核对10台25次')
  page.locator('[data-demo="previous"]').click();settled(7);expect(f.locator('#sm-point-devices')).to_have_text('10');ok('D25 上一步恢复监控窗口，不落在错误弹窗状态')
  page.locator('[data-demo="takeover"]').click();expect(page.locator('.auto-demo')).to_have_attribute('data-status','manual');expect(page.locator('.demo-highlight')).to_be_hidden();ok('D26 手动接管停止自动操作并移除高亮')
  page.locator('[data-demo="play"]').click();settled(7);page.locator('[data-demo="play"]').click();expect(page.locator('.auto-demo')).to_have_attribute('data-status','paused');ok('D27 手动接管后恢复播放先重建现场')
  page.locator('[data-demo="close"]').click();expect(page.locator('.auto-demo')).to_have_count(0);assert page.url==original_url;expect(page.locator('#crm-base-configName')).to_have_value('我的原工作区草稿-不要覆盖')
  page.locator('[data-act="review"]').click();expect(page.locator('#replay-note')).to_have_value('原工作区笔记-需要保留');page.keyboard.press('Escape');ok('D28 退出保留原URL、未保存草稿和笔记')
  # One real timed auto transition at 2x; no clock mocking.
  page.locator('.topbar [data-shell="demo"]').click();settled(0);page.locator('#demo-speed').select_option('2');page.wait_for_function("document.querySelector('.auto-demo').dataset.step==='1'",timeout=10000);page.locator('[data-demo="play"]').click();settled(1);ok('D29 自动计时实际推进到下一站，速度切换生效')
  # Missing business control is not silently skipped.
  f.locator('[data-act="rp-step"][data-step="1"]').evaluate_all('(els)=>els.forEach(el=>el.remove())');page.locator('[data-demo="next"]').click();page.wait_for_function("document.querySelector('.auto-demo').dataset.status==='error'",timeout=18000);expect(page.locator('.demo-proof')).to_contain_text('没有跳过');expect(page.locator('.auto-demo')).to_have_attribute('data-step','2');ok('D30 缺少目标按钮会超时停住，不假报成功')
  page.locator('[data-demo="play"]').click();settled(2);page.locator('[data-demo="play"]').click();ok('D31 失败后可以重建并重试当前步骤')
  # Trusted in-frame input takes over, leaving no runner to race the user.
  f.locator('[data-act="rp-step"][data-step="0"]').first.click();expect(page.locator('.auto-demo')).to_have_attribute('data-status','manual');ok('D32 用户直接点业务界面自动切换手动接管')
  for width in [1100,768]:
   page.set_viewport_size({'width':width,'height':1050});page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');assert page.locator('[data-demo="close"]').is_visible();assert page.locator('[data-demo="play"]').is_visible()
  page.screenshot(path=str(OUT/'30-自动演示窄屏.png'),full_page=True);ok('D33 1100/768宽度控制区可见，无整页横向溢出')
  page.locator('[data-demo="close"]').click();page.set_viewport_size({'width':1440,'height':1100})
  page.locator('.topbar [data-shell="demo"]').click();page.locator('[data-demo="close"]').click();page.wait_for_timeout(300);expect(page.locator('.auto-demo')).to_have_count(0);ok('D34 加载时关闭会取消任务，不继续驱动页面')
  assert not errors,errors;assert not external,external;ok('D35 无脚本错误、控制台错误、外部HTTP请求')
 except Exception as e:
  traceback.print_exc();results.append({'name':'FAILED','status':'FAIL','detail':str(e)});page.screenshot(path=str(ROOT/'docs'/'browser-demo-failure.png'),full_page=True);print('FAIL',str(e),flush=True)
 finally:
  (ROOT/'docs'/'browser-demo-results.json').write_text(json.dumps({'harness':'Chromium set_content; same-build native Blob ESM inside srcdoc; isolated in-memory store','results':results,'errors':errors,'external':external},ensure_ascii=False,indent=2));b.close()
if any(x['status']=='FAIL' for x in results):raise SystemExit(1)
