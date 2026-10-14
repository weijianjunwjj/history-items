import {cp,mkdir,rm,readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'dist'),target=process.argv[2];
const names=['ebi','crm','report','monitor','journey','workbench'];
if(target&&!names.includes(target))throw new Error('未知子应用：'+target);
if(!target){await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(resolve(root,'src'),resolve(out,'src'),{recursive:true});}
else{await mkdir(resolve(out,'src/apps'),{recursive:true});await cp(resolve(root,'src/apps',target),resolve(out,'src/apps',target),{recursive:true});for(const dep of ['shared','domain','api','shell'])await cp(resolve(root,'src',dep),resolve(out,'src',dep),{recursive:true});for(const file of ['entry.js','standalone.js','styles.css'])await cp(resolve(root,'src',file),resolve(out,'src',file));}
await cp(resolve(root,'index.html'),resolve(out,'index.html'));
for(const name of target?[target]:names){
 const dir=resolve(out,'apps',name);await mkdir(dir,{recursive:true});
 const files=[];async function scan(path){for(const x of await readdir(path,{withFileTypes:true})){const p=resolve(path,x.name);if(x.isDirectory())await scan(p);else{const data=await readFile(p);files.push({path:relative(out,p).replaceAll('\\','/'),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}}}await scan(resolve(out,'src/apps',name));
 await writeFile(resolve(dir,'manifest.json'),JSON.stringify({name,version:'0.8.0',entry:`/src/apps/${name}/index.js`,lifecycle:['bootstrap','mount','update','unmount'],standalone:`/apps/${name}/index.html`,shared:['/src/shared/','/src/domain/','/api/'],files},null,2));
 await writeFile(resolve(dir,'index.html'),`<!doctype html><html lang="zh-CN" data-standalone="${name}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/src/styles.css"><link rel="icon" href="data:,"><title>${name} · 独立微应用</title></head><body><div id="shell">正在连接SQL并启动独立应用…</div><script type="module" src="/src/entry.js"></script></body></html>`);
}
await writeFile(resolve(out,'build-manifest.json'),JSON.stringify({version:'0.8.0',format:'native-esm-local-microfrontends',target:target||'all',repository:'SQLite via Node HTTP',entries:Object.fromEntries((target?[target]:names).map(n=>[n,`apps/${n}/manifest.json`])),note:'独立模块构建，共享本地服务；不是single-spa或原公司仓库。'},null,2));
console.log(`Built ${target||'all'} → dist. Database untouched.`);
