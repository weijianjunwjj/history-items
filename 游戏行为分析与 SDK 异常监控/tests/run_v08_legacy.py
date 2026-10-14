from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess,json,sys
ROOT=Path(__file__).resolve().parents[1]
names=['browser_offline','browser_crm','browser_report','browser_monitor','browser_journey','browser_demo','browser_workspace','browser_demo_autoplay']
def run(name):
 try:
  p=subprocess.run([sys.executable,'tests/'+name+'.py'],cwd=ROOT,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,timeout=210)
  (ROOT/'docs'/f'{name}-output-v08.txt').write_text(p.stdout)
  print(name,'EXIT',p.returncode,p.stdout[-400:],flush=True)
  return name,p.returncode
 except Exception as e:
  (ROOT/'docs'/f'{name}-output-v08.txt').write_text(str(e))
  return name,1
with ThreadPoolExecutor(max_workers=2) as ex: results=dict(ex.map(run,names))
(ROOT/'docs'/'suite-exits-v08.json').write_text(json.dumps(results,indent=2))
if any(results.values()):raise SystemExit(1)
