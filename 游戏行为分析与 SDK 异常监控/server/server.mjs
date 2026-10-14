import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {openDatabase,ROOT} from './database.mjs';
import {executeQuery} from './queries.mjs';
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'self' about:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'";
const fail=(status,message)=>Object.assign(new Error(message),{status});
async function bodyJSON(req){if(!String(req.headers['content-type']||'').startsWith('application/json'))throw fail(415,'只接受 application/json');let length=0;const parts=[];for await(const part of req){length+=part.length;if(length>8*1024*1024)throw fail(413,'请求超过8MB');parts.push(part);}try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw fail(400,'请求不是有效JSON');}}
export function createApplication({databasePath,staticRoot=resolve(ROOT,'dist'),repository}={}){
 const repo=repository||openDatabase(databasePath),token=randomBytes(24).toString('hex');let datasets;
 const server=createServer(async(req,res)=>{
  const baseHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':CSP,'X-Frame-Options':'SAMEORIGIN'};
  function send(status,value,type='application/json; charset=utf-8'){
   if(res.destroyed||res.headersSent)return;let buffer=Buffer.isBuffer(value)?value:Buffer.from(type.startsWith('application/json')?JSON.stringify(value):String(value));const headers={...baseHeaders,'Content-Type':type};
   if(req.method!=='HEAD'&&buffer.length>2048&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){buffer=gzipSync(buffer);headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding';}
   headers['Content-Length']=buffer.length;res.writeHead(status,headers);res.end(req.method==='HEAD'?undefined:buffer);
  }
  try{
   const port=server.address()?.port,host=req.headers.host;
   if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(host))throw fail(403,'仅允许本机 Host');
   const url=new URL(req.url,`http://${host}`),origin=req.headers.origin;
   if(url.pathname.startsWith('/api/')){
    const fetchSite=req.headers['sec-fetch-site'];
    // 本机浏览器环境实测 Origin 缺少端口；仅在浏览器确认 same-origin 且主机/协议仍完全一致时兼容。
    // 不接受跨端口来源、其他主机、null Origin 或缺少同源标记的请求；POST 仍须本进程令牌。
    const localOriginWithoutPort=fetchSite==='same-origin'&&origin===`http://${url.hostname}`;
    if(fetchSite==='cross-site'||origin&&origin!==`http://${host}`&&!localOriginWithoutPort)throw fail(403,'拒绝跨站API访问');
    if(req.method==='POST'){
     const supplied=String(req.headers['x-replay-token']||'');
     if(supplied.length!==token.length||!timingSafeEqual(Buffer.from(supplied),Buffer.from(token)))throw fail(403,'缺少本机请求凭证，请刷新页面');
     const data=await bodyJSON(req);
     if(url.pathname==='/api/workspace/commit')return send(200,repo.commit(data));
     const name=url.pathname.match(/^\/api\/query\/(analysis|devices|groups|module|monitor|summary)$/)?.[1];
     if(name){const started=performance.now(),result=executeQuery(repo,name,data);res.setHeader('X-Replay-Repository','sqlite');return send(200,{result,meta:{repository:'sqlite',operation:name,durationMs:Number((performance.now()-started).toFixed(2))}});}
     throw fail(404,'未找到API');
    }
    if(req.method!=='GET')throw fail(405,'方法不支持');
    if(url.pathname==='/api/health')return send(200,{ok:true,appVersion:'0.8.0',node:process.version,repository:'sqlite'});
    if(url.pathname==='/api/bootstrap')return send(200,{token,workspace:repo.workspace(),database:repo.info()});
    if(url.pathname==='/api/database')return send(200,repo.info());
    if(url.pathname==='/api/datasets'){datasets??=Buffer.from(JSON.stringify(repo.datasets()));return send(200,datasets);}
    throw fail(404,'未找到API');
   }
   if(!['GET','HEAD'].includes(req.method))throw fail(405,'方法不支持');
   let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{throw fail(400,'地址编码无效');}
   if(pathname==='/')pathname='/index.html';
   if(!(/^\/(src|apps)\//.test(pathname)||['/index.html','/build-manifest.json'].includes(pathname)))throw fail(404,'未找到资源');
   const path=resolve(staticRoot,'.'+pathname);
   if(path!==staticRoot&&!path.startsWith(staticRoot+sep)||pathname.includes('\\')||pathname.includes('\0'))throw fail(403,'资源路径无效');
   const info=await stat(path).catch(()=>null);if(!info?.isFile())throw fail(404,'未找到资源');
   return send(200,await readFile(path),MIME[extname(path)]||'application/octet-stream');
  }catch(e){const status=e.status||400;send(status,{error:e.message||'本地服务错误',...(e.keys?{conflicts:e.keys}:{}),committed:false});}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=1000;
 return {server,repository:repo,listen(port=4173){return new Promise((ok,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.off('error',reject);ok(`http://127.0.0.1:${server.address().port}`);});});},async close(){await new Promise(resolve=>server.close(resolve));repo.close();}};
}
