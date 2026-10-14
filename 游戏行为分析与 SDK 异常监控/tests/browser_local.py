"""Native localhost verification for Codex on the user's machine.
No policy changes, remote relay, mocked transport or set_content substitution.
Exit 2 = entry blocked by managed browser; NOT a passed E2E test.
Runtime needs only Node; this optional test needs Python + Playwright.
"""
from pathlib import Path
import os, sys, json, tempfile, subprocess, time, socket, shutil, urllib.request, urllib.parse, traceback, platform
ROOT=Path(__file__).resolve().parents[1]
# Optional test tools may be installed in the ignored data directory without changing system Python.
if (ROOT/'data/test-tools/playwright').is_dir():sys.path.insert(0,str(ROOT/'data/test-tools'))
from playwright.sync_api import sync_playwright, expect
from browser_acceptance_checks import run_extra
OUT=ROOT/'docs/local-browser';OUT.mkdir(parents=True,exist_ok=True)
report={'harness':'real localhost HTTP + SQLite + Chromium/Edge','platform':platform.platform(),'python':sys.version.split()[0],'date':time.strftime('%Y-%m-%d'),'results':[],'errors':[],'consoleErrors':[]}
exit_code=0
with socket.socket() as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
base=f'http://127.0.0.1:{port}'
log=open(OUT/'server.log','w',encoding='utf-8')
with tempfile.TemporaryDirectory(prefix='youyi-sql-browser-') as temp:
 db=str(Path(temp)/'replay.sqlite');proc=None
 def start():
  p=subprocess.Popen(['node','scripts/start.mjs'],cwd=ROOT,env={**os.environ,'PORT':str(port),'REPLAY_DB':db},stdout=log,stderr=subprocess.STDOUT)
  for _ in range(150):
   if p.poll() is not None:raise RuntimeError('本地服务未启动，请看 docs/local-browser/server.log')
   try:urllib.request.urlopen(base+'/api/health',timeout=1).read();return p
   except Exception:time.sleep(.1)
  p.terminate();raise RuntimeError('本地服务启动超时')
 def stop():
  if proc and proc.poll() is None:proc.terminate();proc.wait(timeout=10)
 def data():return json.loads(urllib.request.urlopen(base+'/api/bootstrap').read())
 def ok(name):report['results'].append({'name':name,'status':'PASS'});print('PASS',name,flush=True)
 def settled(page):
  page.wait_for_function("() => window.__REPLAY_SQL__ && !window.__REPLAY_SQL__.snapshot().pending && !window.__REPLAY_SQL__.snapshot().saving",timeout=20000)
  state=page.evaluate('() => window.__REPLAY_SQL__.snapshot()');assert not state['error'],state
 try:
  proc=start()
  with sync_playwright() as p:
   exe=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser') or shutil.which('google-chrome')
   kwargs={'headless':True}
   if exe:kwargs['executable_path']=exe
   elif os.name=='nt':kwargs['channel']='msedge'
   b=p.chromium.launch(**kwargs);report['browser']=b.version
   ctx=b.new_context(viewport={'width':1500,'height':1080},locale='zh-CN',accept_downloads=True)
   ctx.set_default_timeout(10000)
   def observe_page(page):
    page.on('pageerror',lambda e:report['errors'].append(str(e)))
    page.on('console',lambda m:report['consoleErrors'].append(m.text) if m.type=='error' else None)
    page.on('dialog',lambda d:d.accept())
   ctx.on('page',observe_page)
   page=ctx.new_page()
   try:
    page.goto(base,timeout=15000);expect(page.locator('h1')).to_have_text('业务流程与技术架构');settled(page)
   except Exception as e:
    if 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(e):
     report['entry']={'status':'BLOCKED_BY_ENVIRONMENT','detail':str(e)};exit_code=2
    else:raise
   if exit_code!=2:
    report['entry']={'status':'PASS'};ok('L01 真实HTTP启动与SQLite初始化；无内存后备')
    page.locator('[data-shell="nav"][data-path="/workbench/database"]').click()
    page.locator('[data-act="db-query"]').click();expect(page.locator('#db-query-result')).to_contain_text('"devices": 10');expect(page.locator('#db-query-result')).to_contain_text('"events": 25');settled(page);ok('L02 数据库页面真实SQL核对10台/25次')
    page.screenshot(path=str(OUT/'database.png'),full_page=True)
    page.locator('[data-shell="nav"][data-path="/crm/activities"]').click();page.locator('[data-act="crm-edit"][data-id="DEMO-CFG-001"]').click()
    page.locator('#crm-base-configName').fill('本机SQL正式保存');page.locator('[data-act="crm-next"]').click();page.locator('[data-act="crm-next"]').click();page.locator('[data-act="crm-save"]').click();expect(page.locator('#toast')).to_contain_text('已保存');settled(page)
    page.locator('[data-act="crm-step"][data-step="0"]').click();page.locator('#crm-base-configName').fill('本机SQL未提交草稿')
    page.locator('[data-act="review"]').click();page.locator('#replay-note').fill('本机SQL跨刷新笔记');page.locator('[data-act="save-note"]').click();expect(page.locator('#note-status')).to_contain_text('已保存');settled(page);page.keyboard.press('Escape')
    page.reload();expect(page.locator('#crm-base-configName')).to_have_value('本机SQL未提交草稿');page.locator('[data-act="crm-back"]').click();expect(page.locator('.crm-activity-table')).to_contain_text('本机SQL正式保存');settled(page);ok('L03 浏览器刷新后正式配置与未提交草稿仍分开')
    stop();proc=start();page.reload();expect(page.locator('.crm-activity-table')).to_contain_text('本机SQL正式保存');settled(page)
    page.locator('[data-act="review"]').click();expect(page.locator('#replay-note')).to_have_value('本机SQL跨刷新笔记');page.keyboard.press('Escape');ok('L04 服务进程重启并刷新后SQL配置与笔记保留')
    q={'dataset':'sdk','flow':'sdk','start':'2026-04-08','end':'2026-04-08','region':'大陆','sdkEventId':'login','sdkFrom':240,'sdkTo':270,'eventType':'abnormalData'}
    page.goto(base+'/#/ebi/event?'+urllib.parse.urlencode(q));expect(page.locator('h1')).to_have_text('事件分析');page.locator('.analysis-table [data-act="drill"]').first.click();expect(page.locator('h1')).to_have_text('设备日志明细');expect(page.locator('.pagination>span b').first).to_have_text('10')
    page.locator('[data-act="open-user"][data-device="SDK-DEMO-1-1002"]').click();expect(page.locator('#device-query')).to_have_value('SDK-DEMO-1-1002');expect(page.locator('.data-module[data-module="abnormalData"] .module-toggle .tag')).to_have_text('4 条');settled(page);ok('L05 SQL事件分析→10台设备→同设备4条异常')
    page.locator('[data-shell="nav"][data-path="/workbench/data"]').click();settled(page)
    with page.expect_download() as dl:page.locator('[data-act="wb-export-backup"]').click()
    backup=OUT/'workspace.json';dl.value.save_as(str(backup))
    page.locator('#wb-backup-file').set_input_files(str(backup));expect(page.locator('.wb-import-preview')).to_be_visible();page.locator('#wb-restore-confirm').check()
    with page.expect_download() as dl:page.locator('[data-act="wb-restore"]').click()
    dl.value.save_as(str(OUT/'before-restore.json'));expect(page.locator('.wb-message')).to_contain_text('已恢复');settled(page);ok('L06 工作区JSON预览/确认/SQL事务恢复')
    page.locator('[data-shell="nav"][data-path="/crm/activities"]').click();page.locator('[data-act="review"]').click();settled(page)
    page.route('**/api/workspace/commit',lambda route:route.abort())
    page.locator('#replay-note').fill('故障期间的笔记');page.locator('[data-act="save-note"]').click();expect(page.locator('#sql-connection')).to_have_attribute('data-state','error')
    expect(page.locator('#note-status')).not_to_contain_text('已保存')
    note=next(x for x in data()['workspace']['stores']['local'] if x['key']=='note:crm');assert json.loads(note['value'])=='本机SQL跨刷新笔记'
    page.unroute('**/api/workspace/commit');page.locator('#sql-connection button').click();settled(page);assert json.loads(next(x for x in data()['workspace']['stores']['local'] if x['key']=='note:crm')['value'])=='故障期间的笔记';page.keyboard.press('Escape');expect(page.locator('.overlay')).to_have_count(0);ok('L07 写请求故障不假报成功，恢复后幂等重试；焦点在SQL重试按钮时Escape仍关闭复盘')
    page.locator('[data-act="review"]').click();settled(page)
    lost_requests=[]
    def lose_ack(route):
     response=route.fetch();assert response.status==200
     lost_requests.append(json.loads(route.request.post_data)['requestId']);route.abort()
    page.route('**/api/workspace/commit',lose_ack)
    page.locator('#replay-note').fill('事务已提交但响应丢失');page.locator('[data-act="save-note"]').click()
    expect(page.locator('#sql-connection')).to_have_attribute('data-state','error');expect(page.locator('#note-status')).not_to_contain_text('已保存')
    committed=data()['workspace'];assert json.loads(next(x for x in committed['stores']['local'] if x['key']=='note:crm')['value'])=='事务已提交但响应丢失'
    assert len(lost_requests)==1
    page.unroute('**/api/workspace/commit');retried=[]
    def retry_ack(route):
     retried.append(json.loads(route.request.post_data)['requestId']);route.continue_()
    page.route('**/api/workspace/commit',retry_ack);page.locator('#sql-connection button').click();settled(page)
    assert retried==lost_requests;assert data()['workspace']==committed
    page.unroute('**/api/workspace/commit');page.keyboard.press('Escape');ok('L07b SQL提交后响应丢失仍不报成功，同请求ID重试不重复写入')
    # Standalone app loads its own entry rather than the navigation shell.
    settled(page);solo=ctx.new_page();solo.goto(base+'/apps/ebi/index.html');expect(solo.locator('h1')).to_have_text('漏斗详情');assert solo.locator('.sidebar').count()==0;settled(solo);solo.close();ok('L08 EBI独立入口可启动并读取同一个SQL服务')
    run_extra(page,ctx,base,settled,data,ok,OUT)
    # Refresh parent revisions after another window to avoid intentional CAS conflicts on shared keys.
    page.reload();settled(page)
    if os.environ.get('REPLAY_BROWSER_AUTOPLAY','1')!='0':
     before=data()['workspace'];page.locator('[data-shell="demo"]').click();page.locator('#demo-speed').select_option('2')
     page.wait_for_function("() => document.querySelector('.auto-demo')?.dataset.status==='complete'",timeout=150000)
     snap=page.evaluate('() => window.__REPLAY_DEBUG__.demoSnapshot()');assert len(snap['receipts'])==19
     report['autoplay']=snap
     page.screenshot(path=str(OUT/'autoplay-complete.png'),full_page=True)
     page.locator('[data-demo="close"]').click();after=data()['workspace'];assert before==after;ok('L09 自动演示19站完成，SQL主工作区完全未变')
    assert not report['errors'],report['errors']
    assert not [e for e in report['consoleErrors'] if 'Content Security Policy' in e],report['consoleErrors']
    ok('L10 未捕获脚本错误与CSP错误为0（主动断网和冲突另列）')
   b.close()
 except Exception as e:
  exit_code=1;report['results'].append({'status':'FAIL','detail':str(e)});traceback.print_exc()
  try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
  except Exception:pass
 finally:
  stop();log.close()
  (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'exitCode':exit_code,'entry':report.get('entry'),'count':len(report['results'])},ensure_ascii=False))
sys.exit(exit_code)
