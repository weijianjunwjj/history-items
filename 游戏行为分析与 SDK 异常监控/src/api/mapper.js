/** The replay transport deliberately exposes heads + positional rows. This mapper is new, not copied company code. */
export function toTable(payload){
 if(payload?.code!==0||!payload.data||!Array.isArray(payload.data.heads)||!Array.isArray(payload.data.list))throw new Error('接口响应格式不正确。');
 const {heads,list,...meta}=payload.data;const keys=heads.map(h=>h.field);
 if(new Set(keys).size!==keys.length)throw new Error('接口列字段重复。');
 return {...meta,rows:list.map(row=>{if(!Array.isArray(row)||row.length!==keys.length)throw new Error('接口列与行长度不匹配。');return Object.fromEntries(keys.map((k,i)=>[k,row[i]]));})};
}
export function rawTable(result,keys){return {code:0,data:{...result,rows:undefined,heads:keys.map(field=>({field})),list:result.rows.map(r=>keys.map(k=>r[k]))}};}
