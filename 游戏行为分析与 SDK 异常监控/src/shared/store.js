export const PREFIX='yyreplay:v1:';
function memoryStorage(){const map=new Map();return {get length(){return map.size;},key:i=>[...map.keys()][i]??null,getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};}
export function inDemoSession(){if(typeof window==='undefined')return false;try{return window.__REPLAY_DEMO_SESSION__===true||window.frameElement?.dataset.replayDemoSession==='true';}catch{return false;}}
function availableStorage(name){if(typeof window!=='undefined'&&window.__REPLAY_SQL__&&!inDemoSession())return {store:window.__REPLAY_SQL__.stores[name==='localStorage'?'local':'session'],persistent:true};if(inDemoSession())return {store:memoryStorage(),persistent:false};try{const store=window[name];store.setItem(PREFIX+'storage-check','1');store.removeItem(PREFIX+'storage-check');return {store,persistent:true};}catch{return {store:memoryStorage(),persistent:false};}}
const session=availableStorage('sessionStorage'),local=availableStorage('localStorage');
export const sessionStore=session.store,localStore=local.store;
export const persistentStorageAvailable=local.persistent;
export const sessionStorageAvailable=session.persistent;
export function read(key,fallback,where=sessionStore){try{const v=JSON.parse(where.getItem(PREFIX+key));return v===null?fallback:v;}catch{return fallback;}}
export function write(key,value,where=sessionStore){try{where.setItem(PREFIX+key,JSON.stringify(value));return true;}catch{return false;}}
export function resetPreferences(){for(const where of [sessionStore,localStore]){const keys=Array.from({length:where.length},(_,i)=>where.key(i));for(const key of keys)if(key?.startsWith(PREFIX)&&!key.startsWith(PREFIX+'note:')&&!key.startsWith(PREFIX+'recap:'))where.removeItem(key);}}

export function sqlClient(){return typeof window!=='undefined'&&!inDemoSession()?window.__REPLAY_SQL__||null:null;}
export async function flushStorage(){return sqlClient()?.flush();}
export function storageLabel(){return sqlClient()?'SQLite 数据库':persistentStorageAvailable?'本机浏览器存储':'临时内存';}
