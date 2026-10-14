/** In-memory replay request evidence. No network or personal data. */
let next=0;const entries=[];
export function trace(kind,name,request={},result={}){const item={id:++next,time:new Date().toISOString(),kind,name,request:JSON.parse(JSON.stringify(request)),result:JSON.parse(JSON.stringify(result))};entries.push(item);if(entries.length>70)entries.shift();return item;}
export function traceSnapshot(){return JSON.parse(JSON.stringify(entries));}
