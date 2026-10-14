import {validateContext,analysis,deviceRows,aggregate,groupDetails,moduleRows,paginate,GROUP_FIELDS} from '../src/domain/queries.js';
import {unifiedContext,expandSourceRows} from '../src/domain/unified.js';
import {normalizeMonitorQuery,visibleCharts,summarizeChart} from '../src/domain/monitor.js';
import {EVENT_COLUMNS,DEVICE_COLUMNS} from '../src/domain/modules.js';
import {rawTable,toTable} from '../src/api/mapper.js';
function sdkScope(input){const q=unifiedContext(input),clauses=['event_id=?','region=?','day>=?','day<=?','minute>=?','minute<?'],args=[q.sdkEventId,q.region,q.start,q.end,q.sdkFrom,q.sdkTo];for(const [key,col]of [['os','os'],['product','product'],['deviceId','device_id']])if(q[key]){clauses.push(col+'=?');args.push(q[key]);}if(q.channel&&q.channel!=='测试渠道')clauses.push('0=1');return {where:'WHERE '+clauses.join(' AND '),args};}
export function queryRecords(repo,q){validateContext(q);if(q.dataset==='sdk'){const {where,args}=sdkScope(q);return expandSourceRows(repo.sdkRows(where,args));}const where=['day>=?','day<=?'],args=[q.start,q.end];for(const [key,col]of [['channel','channel'],['os','os'],['deviceId','device_id']])if(q[key]){where.push(col+'=?');args.push(q[key]);}return repo.db.prepare('SELECT document FROM behavior_records WHERE '+where.join(' AND ')+' ORDER BY timestamp,id').all(...args).map(r=>JSON.parse(r.document));}
export function sqlSummary(repo,input){validateContext(input);if(input.dataset==='sdk'){const {where,args}=sdkScope(input);return repo.db.prepare('SELECT COUNT(DISTINCT device_id) devices, COALESCE(SUM(reports),0) events, COUNT(*) countedRows FROM sdk_samples '+where).get(...args);}
 const clauses=['day>=?','day<=?'],args=[input.start,input.end];for(const [k,col]of [['os','os'],['channel','channel'],['deviceId','device_id'],['eventType','module']])if(input[k]){clauses.push(col+'=?');args.push(input[k]);}return repo.db.prepare('SELECT COUNT(DISTINCT device_id) devices, COUNT(*) events FROM behavior_records WHERE '+clauses.join(' AND ')).get(...args);
}
export function executeQuery(repo,name,body={}){
 const q=body.q||{};
 if(name==='monitor'){const query=normalizeMonitorQuery(q),cards=visibleCharts(body.selectedIds,query),where=['region=?'],args=[query.region];if(query.os){where.push('os=?');args.push(query.os);}const rows=repo.sdkRows('WHERE '+where.join(' AND '),args);return {query,charts:cards.map(c=>summarizeChart(c.id,query,rows)),computedAt:new Date().toISOString()};}
 if(name==='summary')return sqlSummary(repo,q);
 const rows=queryRecords(repo,q);
 if(name==='analysis')return {...analysis(q,body.mode,rows),sqlSummary:body.mode==='funnel'?undefined:sqlSummary(repo,q)};
 if(name==='devices'){if(body.group&&Object.keys(body.group).some(k=>!Object.hasOwn(GROUP_FIELDS,k)))throw new Error('聚合字段不受支持');const data=body.group?groupDetails(q,body.group,rows):deviceRows(q,rows);return toTable(rawTable(paginate(data,body.page,body.pageSize),DEVICE_COLUMNS.map(c=>c.key)));}
 if(name==='groups')return aggregate(q,body.fields,30,rows);
 if(name==='module'){const data=moduleRows(q,body.key,body.state||{},rows);return toTable(rawTable(paginate(data,body.state?.page,body.state?.pageSize),['id',...EVENT_COLUMNS.map(c=>c.key)]));}
 throw new Error('未知查询');
}
