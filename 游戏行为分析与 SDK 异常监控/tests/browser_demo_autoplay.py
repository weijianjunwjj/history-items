from pathlib import Path
import json,shutil,traceback,time
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parents[1];report={'mode':'real timers, 2x, no manual step advancing','status':'FAIL','errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True);page=b.new_page(viewport={'width':1440,'height':1000})
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 try:
  page.set_content((root/'直接打开演示.html').read_text());page.locator('.j-hero [data-shell="demo"]').click();page.locator('#demo-speed').select_option('2');start=time.monotonic()
  page.wait_for_function("['complete','error'].includes(document.querySelector('.auto-demo').dataset.status)",timeout=130000)
  state=page.evaluate('window.__REPLAY_DEBUG__.demoSnapshot()');report['elapsedSeconds']=round(time.monotonic()-start,2);report['snapshot']=state
  assert state['status']=='complete',state.get('error');assert len(state['receipts'])==19;assert not report['errors'];report['status']='PASS'
  page.screenshot(path=str(root/'docs/screenshots/31-自动播放完成.png'),full_page=True)
 except Exception as e:report['error']=str(e);traceback.print_exc()
 finally:b.close();(root/'docs/browser-demo-autoplay-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(report['status'],report.get('elapsedSeconds'),report.get('error',''))
if report['status']!='PASS':raise SystemExit(1)
