import {sqlClient} from '../shared/store.js';
import {trace} from '../shared/trace.js';
import {read,write,localStore,persistentStorageAvailable} from '../shared/store.js';
import {normalizePreferences,visibleCharts,summarizeChart,normalizeMonitorQuery} from '../domain/monitor.js';
export const MONITOR_STORAGE_KEY='monitor:preferences';
export function loadMonitorPreferences(){return normalizePreferences(read(MONITOR_STORAGE_KEY,null,localStore));}
export function saveMonitorPreferences(prefs){const safe=normalizePreferences(prefs);if(!write(MONITOR_STORAGE_KEY,safe,localStore))throw new Error('监控配置保存失败，请导出当前配置留存。');return {persistent:persistentStorageAvailable,value:safe};}
export async function queryMonitor(query,selectedIds){if(sqlClient()){const {result,meta}=await sqlClient().query('monitor',{q:query,selectedIds});trace('query','queryMonitor',{...query,selectedIds},meta);return result;}const q=normalizeMonitorQuery(query);trace('query','queryMonitor',{...q,selectedIds},{source:'SDK shared repository',operation:'时段聚合 / PV求和 / UV去重'});return {query:q,charts:visibleCharts(selectedIds,q).map(c=>summarizeChart(c.id,q)),computedAt:new Date().toISOString()};}
