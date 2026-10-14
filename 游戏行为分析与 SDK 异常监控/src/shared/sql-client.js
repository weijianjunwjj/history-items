/** Async SQL transport + synchronous view cache. A cache write is NOT a database acknowledgement.
 * UI save boundaries await flush(). Per-key CAS prevents silent stale-window overwrites.
 * One captured request ID survives ambiguous network failures and is safe to retry.
 */
const PREFIX='yyreplay:v1:';
export class SqlWorkspaceClient {
 constructor(bootstrap,{fetcher=globalThis.fetch.bind(globalThis),debounce=200,onChange=()=>{}}={}){
  this.fetcher=fetcher;this.token=bootstrap.token;this.database=bootstrap.database;this.revision=bootstrap.workspace.revision;
  this.versions=structuredClone(bootstrap.workspace.versions);this.values={local:new Map(),session:new Map()};
  for(const area of ['local','session'])for(const x of bootstrap.workspace.stores[area])this.values[area].set(x.key,x.value);
  this.pending=new Map();this.flight=null;this.task=null;this.timer=null;this.error=null;this.debounce=debounce;this.onChange=onChange;this.counter=0;
  this.stores=Object.fromEntries(['local','session'].map(a=>[a,this.storage(a)]));
 }
 storage(area){const self=this,transient=new Map();return {
  get length(){return self.values[area].size+transient.size;},key(i){return [...self.values[area].keys()].map(x=>PREFIX+x).concat([...transient.keys()])[i]??null;},
  getItem(full){if(transient.has(full))return transient.get(full);return self.values[area].get(full.slice(PREFIX.length))??null;},
  setItem(full,value){if(!full.startsWith(PREFIX))throw new Error('存储键不属于本项目');if(full.startsWith(PREFIX+'probe-')||full===PREFIX+'storage-check'){transient.set(full,String(value));return;}self.set(area,full.slice(PREFIX.length),String(value));},
  removeItem(full){if(transient.has(full)){transient.delete(full);return;}self.set(area,full.slice(PREFIX.length),null);}
 };}
 set(area,key,value){const old=this.values[area].get(key)??null;if(old===value)return;if(value===null)this.values[area].delete(key);else this.values[area].set(key,value);this.pending.set(area+':'+key,{area,key,value,generation:++this.counter});this.notify();clearTimeout(this.timer);if(!this.error)this.timer=setTimeout(()=>this.flush().catch(()=>{}),this.debounce);this.timer?.unref?.();}
 snapshot(){return {mode:'sqlite',revision:this.revision,pending:this.pending.size,saving:!!this.task,error:this.error?.message||null,conflict:this.error?.status===409,database:this.database};}
 notify(){this.onChange(this.snapshot());}
 async request(path,body){const response=await this.fetcher(path,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Replay-Token':this.token},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok){const e=new Error(data.error||'SQL请求失败');e.status=response.status;throw e;}return data;}
 async query(name,body){const data=await this.request('/api/query/'+name,body);return data;}
 flush(){clearTimeout(this.timer);if(this.task)return this.task;
  this.task=this.drain().finally(()=>{this.task=null;if(!this.pending.size)clearTimeout(this.timer);this.notify();});this.notify();return this.task;
 }
 async drain(){this.error=null;
  try{while(this.pending.size||this.flight){
   if(!this.flight){const captured=[...this.pending.values()];this.flight={request:{requestId:globalThis.crypto.randomUUID(),operations:captured.map(({area,key,value})=>({area,key,value,expected:this.versions[area][key]||0}))},captured};}
   const flight=this.flight;const result=await this.request('/api/workspace/commit',flight.request);
   this.revision=result.revision;for(const x of result.ack)this.versions[x.area][x.key]=x.revision;
   for(const x of flight.captured)if(this.pending.get(x.area+':'+x.key)?.generation===x.generation)this.pending.delete(x.area+':'+x.key);
   this.flight=null;this.notify();
  }}catch(e){this.error=e;
   // A known validation/conflict failure did not commit. An interrupted response may HAVE committed:
   // retain exactly the same request for an idempotent retry, never manufacture a success receipt.
   if(e.status&&e.status<500)this.flight=null;
   this.notify();throw e;
  }
  return {revision:this.revision};
 }
}
