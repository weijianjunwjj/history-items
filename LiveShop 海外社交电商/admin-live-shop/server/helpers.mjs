export function fail(message, code = 1) {
  throw Object.assign(new Error(message), { apiCode: code });
}

export function pageList(records, params = {}) {
  let list = records;
  const keyword = params.keywords ?? params.keyword ?? params.search;
  if (keyword) list = list.filter(row => JSON.stringify(row).toLowerCase().includes(String(keyword).toLowerCase()));
  for (const key of ['status', 'dictSn']) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') list = list.filter(row => String(row[key]) === String(params[key]));
  }
  const count = list.length;
  const page = Math.max(1, Number(params.page) || 1);
  const size = Math.min(1000, Math.max(1, Number(params.size ?? params.pageSize ?? params.limit) || 10));
  return { list: list.slice((page - 1) * size, page * size), count, total: count, page, size };
}

export function requireRecord(store, collection, id) {
  const row = store.get(collection, id);
  if (!row) fail('记录不存在');
  return row;
}
