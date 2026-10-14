import {createReportApi} from './report-api.js';
import {localStore} from '../shared/store.js';
import {buildDefinition,definitionId,flowDestination} from '../domain/journey.js';
import {unifiedEvents,unifiedContext} from '../domain/unified.js';
const api=createReportApi(localStore);
export function ensureDefinition(q){const id=definitionId(q),existing=api.listEvents().find(e=>e.id===id);if(existing)return existing;
 const event=buildDefinition(q);for(const n of event.fields){const field=api.listFields().find(f=>f.alias===n.alias&&f.product==='all');if(field)n.libraryId=field.id;else{const {children,...f}=n;f.id=n.libraryId;api.saveField(f);}}return api.saveEvent(event).saved;}
export function savedDefinition(q){return api.listEvents().find(e=>e.id===definitionId(q));}
export function stepDestination(key,input={}){const q=unifiedContext(input);if(key==='define')ensureDefinition(q);if(key==='monitor'){q.sdkFrom=0;q.sdkTo=720;q.product='';q.start=q.end='2026-04-08';delete q.deviceId;q.type='';}const id=input.deviceId||unifiedEvents(q)[0]?.deviceId;if(key==='user'&&!id)throw new Error('当前条件没有设备，请先返回监控选择其他时段。');return flowDestination(key,q,id);}
