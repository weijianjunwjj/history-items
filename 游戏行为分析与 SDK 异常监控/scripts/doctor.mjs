import {resolve} from 'node:path';import {existsSync,mkdirSync,writeFileSync,unlinkSync} from 'node:fs';import {openDatabase,ROOT} from '../server/database.mjs';
const checks=[];
try{const [major,minor]=process.versions.node.split('.').map(Number);if(major<22||major===22&&minor<16)throw new Error('需要Node22.16+');checks.push({check:'Node',status:'PASS',value:process.version});
 const dir=resolve(ROOT,'data');mkdirSync(dir,{recursive:true});const probe=resolve(dir,'.doctor-'+process.pid);writeFileSync(probe,'probe',{flag:'wx'});unlinkSync(probe);checks.push({check:'数据库目录写入权限',status:'PASS'});
 const repo=openDatabase(process.env.REPLAY_DB?resolve(ROOT,process.env.REPLAY_DB):undefined);try{const result=repo.db.prepare('PRAGMA quick_check').get();if(Object.values(result)[0]!=='ok')throw new Error('SQLite完整性检查失败');checks.push({check:'SQLite schema / seed / quick_check',status:'PASS',tables:repo.info().tables});}finally{repo.close();}
 checks.push({check:'构建入口',status:existsSync(resolve(ROOT,'dist/index.html'))?'PASS':'NOT_BUILT',note:'npm start 会自动构建'});
 console.log(JSON.stringify({ok:true,checks,boundary:'命令行自检不等于浏览器端或Windows/macOS验收。'},null,2));
}catch(error){console.error(JSON.stringify({ok:false,checks,error:error.message},null,2));process.exitCode=1;}
