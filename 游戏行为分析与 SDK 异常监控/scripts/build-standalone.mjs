/** Package local source modules into an offline HTML. Modules remain native ESM via Blob URLs. */
import {readdir,readFile,writeFile} from 'node:fs/promises';import {resolve,relative,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),sources={};
async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,entry.name);if(entry.isDirectory())await scan(p);else if(entry.name.endsWith('.js'))sources[relative(root,p).replaceAll('\\','/')]=await readFile(p,'utf8');}}
await scan(resolve(root,'src'));
const css=await readFile(resolve(root,'src/styles.css'),'utf8');
const loader=String.raw`
const cache=new Map();
function resolveRef(base,ref){const parts=base.split('/');parts.pop();for(const bit of ref.split('/')){if(bit==='..')parts.pop();else if(bit!=='.')parts.push(bit);}return parts.join('/');}
function make(path){
 if(cache.has(path))return cache.get(path);
 if(!(path in SOURCES))throw new Error('离线模块不存在：'+path);
 const text=SOURCES[path].replace(/(\bfrom\s*|\bimport\s*\(\s*)(['"])([^'"]+)\2/g,(all,lead,quote,ref)=>{
  if(!ref.startsWith('.'))throw new Error('离线入口不允许远程依赖。');
  return lead+quote+make(resolveRef(path,ref))+quote;
 });
 const url=URL.createObjectURL(new Blob([text+'\n//# sourceURL='+path],{type:'text/javascript'}));cache.set(path,url);return url;
}
try{await import(make('src/shell/index.js'));}catch(error){document.querySelector('#shell').textContent='离线入口无法启动：'+error.message+'。请使用源码包中的 npm start 入口。';console.error(error);}
`;
const json=JSON.stringify(sources).replaceAll('<','\\u003c');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"><title>友谊时光 · 工作复盘</title><link rel="icon" href="data:,"><style>${css}</style></head><body><div id="shell"><div class="boot">正在打开工作复盘…</div></div><script type="module">const SOURCES=${json};${loader}</script></body></html>`;
await writeFile(resolve(root,'直接打开演示.html'),html,'utf8');console.log('Built 直接打开演示.html (native modules, no remote dependencies)');
