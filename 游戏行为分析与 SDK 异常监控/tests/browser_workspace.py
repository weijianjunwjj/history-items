from pathlib import Path
import json,shutil,traceback
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/screenshots';OUT.mkdir(exist_ok=True)
HTML=(ROOT/'直接打开演示.html').read_text();results=[];errors=[];external=[]
def ok(name):results.append({'name':name,'status':'PASS'});print('PASS',name,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True)
 c=b.new_context(viewport={'width':1500,'height':1100},locale='zh-CN',accept_downloads=True);c.set_default_timeout(6000)
 def setup(hash='#/workbench/recap'):
  pg=c.new_page();pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);pg.on('request',lambda r:external.append(r.url) if r.url.startswith(('http:','https:')) else None);pg.on('dialog',lambda d:d.accept());pg.evaluate('(v)=>location.hash=v',hash);pg.set_content(HTML,wait_until='load');pg.wait_for_selector('h1');return pg
 def nav(pg,path):pg.locator(f'[data-shell="nav"][data-path="{path}"]').click();pg.wait_for_timeout(160)
 def export(pg,filename):
  with pg.expect_download() as dl:pg.locator('[data-act="wb-export-backup"]').click()
  dest=OUT/filename;dl.value.save_as(str(dest));return json.loads(dest.read_text()),dest
 def key(payload,area,name):return next((x['value'] for x in payload['stores'][area] if x['key']==name),None)
 page=setup()
 try:
  expect(page.locator('h1')).to_have_text('我的复盘讲解');expect(page.locator('.recap-track')).to_have_count(4);expect(page.locator('[data-recap-field="contribution"]')).to_have_value('');expect(page.locator('#recap-outline')).to_contain_text('待本人补充');ok('W01 四张讲解卡有操作入口，空白不预填历史贡献')
  page.locator('[data-recap-field="business"]').fill('运营需要配置事件的列表、查询和详情。');page.locator('[data-recap-field="contribution"]').fill('我负责其中的字段配置和校验，平台本身是既有的。');page.locator('[data-recap-field="dataflow"]').fill('事件字段树 → 三套独立配置 → 保存转换 → 页面展示。');page.locator('#recap-state').select_option('uncertain');expect(page.locator('#recap-save-status')).to_contain_text('内存');page.locator('[data-act="wb-track"][data-track="crm"]').click();expect(page.locator('[data-recap-field="business"]')).to_have_value('');page.locator('[data-recap-field="business"]').fill('运营编辑活动与奖品，避免切换时丢数据。');page.locator('[data-recap-field="contribution"]').fill('在现有CRM里做奖品表单与选择联动。');page.locator('[data-act="wb-track"][data-track="report"]').click();expect(page.locator('[data-recap-field="dataflow"]')).to_contain_text('三套独立配置');ok('W02 两张卡内容隔离，切换恢复文字与回忆状态')
  page.screenshot(path=str(OUT/'32-我的复盘讲解.png'),full_page=True)
  with page.expect_download() as dl:page.locator('[data-act="wb-export-recaps"]').click()
  dl.value.save_as(str(OUT/'recap-export-v07.md'));md=(OUT/'recap-export-v07.md').read_text();assert '三套独立配置' in md and '在现有CRM' in md and '待本人补充' in md and 'R05' in md;ok('W03 实际导出Markdown保留两张卡、自述边界和历史索引')
  page.locator('[data-act="wb-open-business"]').click();expect(page.locator('h1')).to_have_text('上报事件与页面配置');page.locator('[data-act="rp-edit-event"][data-id="DEMO-EVT-001"]').click();page.locator('#rp-base-name').fill('工作区已保存事件');page.locator('[data-act="rp-step"][data-step="2"]').click();page.locator('[data-act="rp-save"]').click();expect(page.locator('#toast')).to_contain_text('已保存');page.locator('[data-act="rp-step"][data-step="0"]').click();page.locator('#rp-base-name').fill('工作区尚未提交的事件草稿');nav(page,'/crm/activities');page.locator('[data-act="crm-edit"][data-id="DEMO-CFG-001"]').click();page.locator('#crm-base-configName').fill('工作区已保存活动');page.locator('[data-act="crm-next"]').click();page.locator('[data-act="crm-next"]').click();page.locator('[data-act="crm-save"]').click();expect(page.locator('#toast')).to_contain_text('已保存');page.locator('[data-act="crm-step"][data-step="0"]').click();page.locator('#crm-base-configName').fill('工作区尚未提交的活动草稿');page.locator('[data-act="review"]').click();page.locator('#replay-note').fill('复盘笔记：未保存草稿和已保存结果要分开。');page.locator('[data-act="save-note"]').click();page.keyboard.press('Escape');nav(page,'/workbench/data');ok('W04 真实页面生成日志和CRM的已保存数据、独立草稿、笔记')
  expect(page.locator('h1')).to_have_text('备份与运行检查');expect(page.locator('.wb-diagnostics')).to_contain_text('内存后备');payload,backupfile=export(page,'workspace-roundtrip-v07.json');assert key(payload,'local','crm:data') and key(payload,'local','report:data');assert '尚未提交的事件草稿' in key(payload,'session','report:workspace');assert '已保存事件' in key(payload,'local','report:data');assert '复盘笔记' in key(payload,'local','note:crm');ok('W05 总备份实际包含配置、未提交草稿、笔记和讲解，不混成一份')
  page.screenshot(path=str(OUT/'33-工作区备份与检查.png'),full_page=True)
  fresh=setup('#/workbench/data');fresh.locator('#wb-backup-file').set_input_files(str(backupfile));expect(fresh.locator('.wb-import-preview')).to_be_visible();expect(fresh.locator('[data-act="wb-restore"]')).to_be_disabled();before,_=export(fresh,'workspace-before-restore-v07.json');assert key(before,'local','crm:data') is None;expect(fresh.locator('.wb-import-preview')).to_be_visible();ok('W06 新文档选文件只预览，不立即写入，恢复需单独确认')
  fresh.locator('#wb-restore-confirm').check()
  with fresh.expect_download() as dl:fresh.locator('[data-act="wb-restore"]').click()
  dl.value.save_as(str(OUT/'workspace-pre-restore-v07.json'));expect(fresh.locator('.wb-message')).to_contain_text('已恢复');restored,_=export(fresh,'workspace-restored-v07.json');assert restored['stores']==payload['stores'];assert key(json.loads((OUT/'workspace-pre-restore-v07.json').read_text()),'local','crm:data') is None;ok('W07 独立新文档导入后两分区逐条一致，恢复前备份确实下载')
  nav(fresh,'/crm/activities');expect(fresh.locator('#crm-base-configName')).to_have_value('工作区尚未提交的活动草稿');fresh.locator('[data-act="crm-back"]').click();expect(fresh.locator('.crm-activity-table')).to_contain_text('工作区已保存活动');expect(fresh.locator('.crm-draft-banner')).to_contain_text('工作区尚未提交的活动草稿');nav(fresh,'/report/events');expect(fresh.locator('#rp-base-name')).to_have_value('工作区尚未提交的事件草稿');nav(fresh,'/workbench/recap');expect(fresh.locator('[data-recap-field="business"]')).to_contain_text('运营需要配置事件');ok('W08 恢复后进入真实业务，CRM保存与草稿分开，日志草稿和讲解可继续编辑')
  nav(fresh,'/workbench/data');baseline,_=export(fresh,'workspace-error-before-v07.json');fresh.locator('#wb-backup-file').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{invalid'});expect(fresh.locator('.wb-message')).to_contain_text('不是有效');after,_=export(fresh,'workspace-error-after-v07.json');assert baseline['stores']==after['stores'];ok('W09 损坏JSON拒绝恢复，工作区逐条未变')
  fresh.locator('#wb-backup-file').set_input_files(str(backupfile));expect(fresh.locator('.wb-import-preview')).to_be_visible();fresh.locator('[data-act="wb-cancel-import"]').click();expect(fresh.locator('.wb-import-preview')).to_have_count(0);cancel,_=export(fresh,'workspace-cancel-after-v07.json');assert cancel['stores']==baseline['stores'];ok('W10 取消预览不丢当前数据，不暗中导入')
  legacy={'version':1,'exportedAt':'2026-10-13','notes':{'crm':'从旧版导入的笔记 <img src=x onerror=alert(1)>'}};fresh.locator('#wb-backup-file').set_input_files({'name':'旧版个人笔记.json','mimeType':'application/json','buffer':json.dumps(legacy,ensure_ascii=False).encode()});expect(fresh.locator('.wb-import-preview')).to_contain_text('仅合并');fresh.locator('#wb-restore-confirm').check()
  with fresh.expect_download() as dl:fresh.locator('[data-act="wb-restore"]').click()
  dl.value.save_as(str(OUT/'legacy-pre-restore-v07.json'));expect(fresh.locator('.wb-message')).to_contain_text('仅合并');merged,_=export(fresh,'workspace-legacy-merged-v07.json');assert key(merged,'local','crm:data')==key(baseline,'local','crm:data');assert key(merged,'local','recap:report')==key(baseline,'local','recap:report');nav(fresh,'/workbench');expect(fresh.locator('.note-grid')).to_contain_text('<img src=x');expect(fresh.locator('.note-grid img')).to_have_count(0);ok('W11 旧版笔记合并不清空业务／讲解，HTML样式文字不会执行')
  nav(fresh,'/workbench/data')
  with fresh.expect_download() as dl:fresh.locator('[data-act="wb-export-diagnostic"]').click()
  dl.value.save_as(str(OUT/'workspace-diagnostic-v07.json'));d=json.loads((OUT/'workspace-diagnostic-v07.json').read_text());assert d['local']['mode']=='内存后备' and d['local']['readWrite']=='PASS' and d['local']['crossRefresh']=='未在本检查中验证';assert 'notes' not in d and 'stores' not in d;ok('W12 运行检查区分内存和原生，不把一次回读当成跨刷新验证')
  for route in ['/workbench/recap','/workbench/data']:
   nav(fresh,route)
   for w in [1100,768]:
    fresh.set_viewport_size({'width':w,'height':1050});fresh.wait_for_timeout(100);assert fresh.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,w)
  fresh.screenshot(path=str(OUT/'34-复盘备份窄屏.png'),full_page=True);ok('W13 1100和768宽度可操作，无整页横向溢出')
  fresh.set_viewport_size({'width':1500,'height':1100});nav(fresh,'/workbench/recap');fresh.locator('[data-act="wb-demo"]').click();expect(fresh.locator('.auto-demo')).to_be_visible();fresh.wait_for_function("document.querySelector('.auto-demo').dataset.status==='playing'",timeout=20000);fresh.locator('[data-demo="close"]').click();expect(fresh.locator('[data-recap-field="business"]')).to_contain_text('运营需要配置事件');ok('W14 讲解卡可打开原自动演示，退出后文字未被隔离会话覆盖')
  assert not errors,errors;assert not external,external;ok('W15 新链路无脚本异常、控制台错误和外部HTTP请求')
 except Exception as e:
  traceback.print_exc();results.append({'name':'FAILED','status':'FAIL','detail':str(e)});page.screenshot(path=str(OUT/'workspace-failure-v07.png'),full_page=True)
 finally:
  (ROOT/'docs/browser-workspace-results.json').write_text(json.dumps({'harness':'Chromium set_content / same-build Blob ESM / independent opaque documents with memory fallback; not native storage persistence','results':results,'errors':errors,'external':external},ensure_ascii=False,indent=2));b.close()
if any(r['status']=='FAIL' for r in results):raise SystemExit(1)
