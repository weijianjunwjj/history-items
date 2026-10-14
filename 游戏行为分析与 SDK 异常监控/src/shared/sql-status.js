import {sqlClient} from './store.js';
export function installSqlStatus(){const client=sqlClient();if(!client)return;
 const box=document.createElement('div');box.id='sql-connection';box.className='sql-connection';box.setAttribute('role','status');
 const text=document.createElement('span'),retry=document.createElement('button'),link=document.createElement('a');retry.className='btn';retry.textContent='重试提交';link.textContent='备份 / 数据库';link.href='/#/workbench/database';box.append(text,retry,link);document.body.append(box);
 const render=()=>{const s=client.snapshot();box.dataset.state=s.error?'error':s.pending||s.saving?'pending':'saved';text.textContent=s.error?'SQL 未保存：'+s.error:s.pending||s.saving?`SQLite 正在写入 · ${s.pending} 项待确认`:`SQLite 已同步 · 修订 ${s.revision}`;retry.hidden=!s.error;};
 retry.onclick=()=>client.flush().catch(()=>{});window.addEventListener('replay:sql-state',render);render();
}
