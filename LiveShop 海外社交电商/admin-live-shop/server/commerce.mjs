// Local commerce API rebuilt from the existing Vue forms and tables.
const PRODUCT_IMAGE = '/api/assets/product.svg';
const BANNER_IMAGE = '/api/assets/banner.svg';
const SPEC_NAMES = { 1: '颜色', 2: '尺码', 3: '材质', 4: '重量' };
const ORDER_STATUS = { 1: '待收货', 2: '已完成', 3: '已退款', 4: '退款申请', 5: '已拒绝', 6: '待支付', 7: '待发货', 8: '已发货' };

const present = value => value !== undefined && value !== null && value !== '';
const stamp = (offsetDays = 0) => new Date(Date.now() + (offsetDays * 24 + 8) * 3600000).toISOString().slice(0, 19).replace('T', ' ');
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status, code: status }); };
const required = (value, label) => { if (!present(value) || !String(value).trim()) fail(`${label}不能为空`); };
const idsOf = params => (Array.isArray(params.ids) ? params.ids : String(params.ids ?? params.id ?? '').split(',')).filter(present).map(String);
const find = (store, collection, id, label) => store.get(collection, id) ?? fail(`${label}不存在`, 404);
const textMatch = (row, value, keys) => !present(value) || keys.some(key => String(row[key] ?? '').toLowerCase().includes(String(value).trim().toLowerCase()));
const equal = (row, key, value) => !present(value) || String(row[key]) === String(value);
const dateMatch = (row, field, range) => !Array.isArray(range) || range.length !== 2 || (!range[0] || String(row[field]) >= range[0]) && (!range[1] || String(row[field]) <= (String(range[1]).length === 10 ? `${range[1]} 23:59:59` : range[1]));

function page(rows, params) {
  const current = Math.max(1, Number(params.page) || 1);
  const size = Math.max(1, Math.min(1000, Number(params.pageSize ?? params.limit ?? params.size) || 10));
  const list = Number(params.isAll) === 1 ? rows : rows.slice((current - 1) * size, current * size);
  return { list, count: rows.length, total: rows.length, pageInfo: { page: current, pageSize: size, total: rows.length, count: rows.length } };
}

function decorateProduct(record, store) {
  const cate = store.get('categories', record.categoryId);
  const sku = record.sku ?? record.SkuReply ?? [];
  const rule = record.ProductRule ?? {};
  return {
    ...record, key: record.id, cateName: cate?.name ?? '',
    className: record.className ?? ({ 1: '实物商品', 2: '虚拟商品' }[record.classId] ?? '实物商品'),
    priceOp: record.op, ruleType: Number(rule.RuleType ?? record.ruleType ?? 1),
    coin: String(rule.Coin ?? record.coin ?? ''), point: String(rule.Point ?? record.point ?? ''),
    stock: sku.reduce((sum, item) => sum + (Number(item.stock) || 0), 0),
    SkuReply: sku, sku,
  };
}

function normalizeProduct(params, previous = {}) {
  const record = { status: 1, payOnline: 1, nickName: '管理员', createdTime: stamp(), img: '', video: '', spec: [], sku: [], ...previous, ...params };
  delete record.id;
  required(record.name, '商品名称');
  required(record.categoryId, '商品类目');
  record.categoryId = Number(record.categoryId);
  record.classId = String(record.classId ?? 1);
  record.ProductRule = { RuleType: 1, Coin: '', Point: '', ...(previous.ProductRule ?? {}), ...(params.ProductRule ?? {}) };
  record.ProductRule.RuleType = Number(record.ProductRule.RuleType);
  record.ruleType = record.ProductRule.RuleType;
  record.coin = String(record.ProductRule.Coin ?? '');
  record.point = String(record.ProductRule.Point ?? '');
  record.img = Array.isArray(record.img) ? record.img.map(item => typeof item === 'string' ? item : item.url).filter(Boolean).join(',') : record.img;
  record.video = Array.isArray(record.video) ? record.video.map(item => typeof item === 'string' ? item : item.url).filter(Boolean).join(',') : record.video;
  record.sku = (record.sku ?? []).map((item, index) => ({ id: item.id || index + 1, attrGroup: '', remark: '标准款', coin: record.coin, point: record.point, specImg: record.img.split(',')[0], sale_num: 0, ...item, stock: Number(item.stock) || 0 }));
  record.itemNumber ||= previous.itemNumber || `LS${Date.now()}`;
  record.updatedAt = stamp();
  return record;
}

function categoryTree(store) {
  const products = store.list('products');
  const rows = store.list('categories').map(item => ({ ...item, key: item.id, label: item.name, value: item.id, goodsNum: products.filter(p => String(p.categoryId) === String(item.id)).length, children: [] }));
  const map = new Map(rows.map(item => [String(item.id), item]));
  const roots = [];
  for (const row of rows) {
    const parent = map.get(String(row.parentId));
    if (parent) parent.children.push(row);
    else roots.push(row);
  }
  return roots;
}

function saveSpecs(store, params) {
  const categoryId = Number(params.categoryId ?? params.id);
  find(store, 'categories', categoryId, '商品类目');
  if (!Array.isArray(params.spec)) fail('规格格式不正确');
  const existing = store.list('specs');
  let nextValueId = Math.max(0, ...existing.flatMap(item => (item.specVal ?? []).map(val => Number(val.id) || 0))) + 1;
  const next = [];
  const dictionaries = new Set();
  for (const item of params.spec) {
    const dictionaryId = Number(item.dictionaryId);
    if (!SPEC_NAMES[dictionaryId]) fail('请选择有效的规格名称');
    if (dictionaries.has(dictionaryId)) fail('规格名称不能重复');
    dictionaries.add(dictionaryId);
    const values = (item.specVal ?? []).map(value => ({ id: Number(value.id) || nextValueId++, val: String(value.val ?? value.label ?? value).trim() }));
    if (!values.length || values.some(value => !value.val)) fail('规格值不能为空');
    const prior = existing.find(row => row.categoryId === categoryId && row.dictionaryId === dictionaryId);
    next.push({ id: prior?.id, categoryId, dictionaryId, specName: SPEC_NAMES[dictionaryId], specVal: values, updatedAt: stamp() });
  }
  store.remove('specs', existing.filter(row => row.categoryId === categoryId && !dictionaries.has(row.dictionaryId)).map(row => row.id));
  return next.map(record => store.save('specs', record));
}

function normalizeActivity(params, previous = {}) {
  const row = { onSale: 1, participants: 0, bookingUser: 0, gender: [0, 0], integralTotal: 0, coinTotal: 0, creatorName: '管理员', createdAt: stamp(), reward: [], ...previous, ...params, updatedAt: stamp() };
  delete row.id;
  required(row.name, '活动名称');
  row.activityType = Number(row.activityType ?? row.type);
  if (![1, 2].includes(row.activityType)) fail('请选择有效的活动类型');
  for (const key of ['peopleMax', 'freight', 'coin', 'integral', 'ruleType', 'isAutoStart', 'onSale']) row[key] = Number(row[key]) || 0;
  if (row.peopleMax <= 0) fail('人数上限必须大于零');
  row.reward = Array.isArray(row.reward) ? row.reward : String(row.reward ?? '').split(',').filter(Boolean);
  row.gender = Array.isArray(row.gender) ? row.gender : [0, 0];
  return row;
}

export function seedCommerce(store) {
  if (store.get('commerce_meta', 1)) return;
  const categories = [
    { id: 1, parentId: 0, name: '数码家电' }, { id: 2, parentId: 1, name: '手机配件' }, { id: 3, parentId: 1, name: '智能设备' },
    { id: 4, parentId: 0, name: '生活日用' }, { id: 5, parentId: 4, name: '厨房用品' }, { id: 6, parentId: 4, name: '家居收纳' },
    { id: 7, parentId: 0, name: '运动户外' }, { id: 8, parentId: 7, name: '运动装备' }, { id: 9, parentId: 7, name: '旅行用品' },
  ].map(row => ({ ...row, goodsNum: 0, createdAt: stamp(-18) }));
  if (!store.list('categories').length) store.replace('categories', categories);
  if (!store.list('specs').length) {
    let valueId = 1;
    const specs = [];
    for (const categoryId of [2, 3, 5, 6, 8, 9]) {
      for (const [dictionaryId, values] of [[1, ['经典黑', '珍珠白']], [2, ['标准款', '升级款']]]) {
        specs.push({ id: specs.length + 1, categoryId, dictionaryId, specName: SPEC_NAMES[dictionaryId], specVal: values.map(val => ({ id: valueId++, val })) });
      }
    }
    store.replace('specs', specs);
  }
  const names = ['无线降噪蓝牙耳机', '磁吸便携充电宝', '智能运动手环', '不锈钢保温杯', '多功能厨房收纳盒', '折叠旅行背包', '轻量瑜伽垫', '桌面智能小夜灯'];
  const categoryIds = [2, 2, 3, 5, 6, 9, 8, 3];
  if (!store.list('products').length) {
    store.replace('products', names.map((name, index) => {
      const coin = String(19 + index * 8);
      return { id: index + 1, ...normalizeProduct({ name, categoryId: categoryIds[index], classId: '1', itemNumber: `LS2026${String(index + 1).padStart(4, '0')}`, intro: `${name}，为海外用户精选的实用好物，支持金币和积分兑换。`, brand: 'LiveShop Select', purPrice: String(35 + index * 14), op: String(29.9 + index * 10), freight: '5', img: PRODUCT_IMAGE, video: '', details: `<p><strong>${name}</strong></p><p>精选品质，适合日常使用。包装包含商品一件，支持标准配送。</p>`, status: index === 4 ? 1 : index === 6 ? 3 : 2, payOnline: 1, ProductRule: { RuleType: 3, Coin: coin, Point: String(500 + index * 100) }, spec: [{ specId: 1, specVal: ['经典黑', '珍珠白'] }, { specId: 2, specVal: ['标准款'] }], sku: ['经典黑', '珍珠白'].map((color, skuIndex) => ({ id: (index + 1) * 10 + skuIndex, attrGroup: '1,2', remark: `${color},标准款`, coin, point: String(500 + index * 100), stock: 60 + index * 11 + skuIndex * 8, specImg: PRODUCT_IMAGE, sale_num: 15 + index * 9 + skuIndex })), createdTime: stamp(-20 + index), nickName: ['运营管理员', '商品运营'][index % 2] }) };
    }));
  }
  const activityNames = ['秋季智能好物众筹', '品质家居升级计划', '运动健康新品众筹', '全球好物两人团', '旅行装备三人团', '厨房精品限时拼团'];
  if (!store.list('activities').length) store.replace('activities', activityNames.map((name, index) => ({ id: index + 1, ...normalizeActivity({ name, activityType: index < 3 ? 1 : 2, peopleMax: 100 + index * 30, participants: 28 + index * 8, shortDesc: '限时活动，邀请好友参与，兑换精选商品。', onSale: index === 2 || index === 5 ? 1 : 2, startTime: stamp(-3), endTime: stamp(15 + index), bookingDeadline: '', freight: 5, coin: 25 + index * 5, integral: 1000 + index * 200, ruleType: 3, isAutoStart: 1, banner: BANNER_IMAGE, reward: [PRODUCT_IMAGE], detail: `<p>${name}</p><p>活动达到参与人数后将按规则发放奖品。请查看参与规则并确认收货地址。</p>`, gender: [12 + index * 5, 16 + index * 3], integralTotal: 28000 + index * 1500, coinTotal: 700 + index * 100, createdAt: stamp(-10 + index), creatorName: '活动运营' }) })));
  if (!store.list('bookings').length) store.replace('bookings', ['智能家居新品预约', '冬季户外装备预售', '周年庆好物拼团预约'].map((name, index) => ({ id: index + 1, ...normalizeActivity({ name, activityType: index === 2 ? 2 : 1, peopleMax: 200 + index * 100, bookingUser: 38 + index * 12, shortDesc: '预约成功后将在活动开始时通知您。', startTime: stamp(10), endTime: stamp(30), bookingDeadline: stamp(8), freight: 5, coin: 30, integral: 1200, ruleType: 3, isAutoStart: 1, onSale: index === 1 ? 1 : 2, banner: BANNER_IMAGE, reward: [PRODUCT_IMAGE], detail: `<p>${name}</p><p>预约限额开放，活动开始后可参与兑换。</p>`, gender: [18 + index * 5, 20 + index * 7], createdAt: stamp(-5 + index) }) })));
  if (!store.list('orders').length) {
    const activities = store.list('activities');
    const products = store.list('products');
    const orders = Array.from({ length: 48 }, (_, index) => {
      const type = index < 24 ? 3 : index < 36 ? 1 : 2;
      const status = index % 8 + 1;
      const product = products[index % products.length];
      const activity = activities[(type === 1 ? 0 : 3) + index % 3];
      return { id: index + 1, orderSn: `LS${stamp().slice(0, 10).replaceAll('-', '')}${String(index + 1).padStart(6, '0')}`, type, activityType: type, userId: 1 + index % 12, activityId: type === 3 ? null : activity.id, activityName: type === 3 ? '' : activity.name, activityStatus: index % 3 ? 1 : 2, paiedCoin: Number(product.coin), paiedIntegral: Number(product.point), orderStatus: status, orderStatusMsg: ORDER_STATUS[status], refundStatus: status === 4 ? 1 : status === 3 ? 2 : status === 5 ? 3 : 0, refundReason: status === 4 ? '商品规格选择有误，申请退款' : '', refundAmount: Number(product.coin), payTime: stamp(-index % 12), createdAt: stamp(-index % 12), shippingSn: status === 1 || status === 8 ? `YT202610${String(index + 1).padStart(7, '0')}` : '', shippingStatus: status === 2 ? 3 : status === 1 || status === 8 ? 2 : 1, receiveName: ['陈晓雨', '王小明', '李佳宁', '张海'][index % 4], receivePhone: `1380000${String(1000 + index).padStart(4, '0')}`, receiveAddress: ['上海市浦东新区张江路 88 号', '广东省深圳市南山区科技园 12 号', '浙江省杭州市滨江区江南大道 66 号', '江苏省南京市建邺区江东路 100 号'][index % 4], zipcode: ['200120', '518000', '310000', '210000'][index % 4], orderGoods: [{ id: 1, productId: product.id, name: product.name, img: PRODUCT_IMAGE, spec: '经典黑 / 标准款', num: index % 3 + 1 }], rewardList: type === 3 ? [] : [{ id: 1, rewardSn: `REWARD2026${String(index + 1).padStart(7, '0')}`, rewardStatus: index % 3 ? 2 : 1 }] };
    });
    store.replace('orders', orders);
  }
  if (!store.list('recharge_orders').length) store.replace('recharge_orders', Array.from({ length: 18 }, (_, index) => ({ id: index + 1, orderSn: `RC202610${String(index + 1).padStart(8, '0')}`, userId: 1 + index % 12, payTime: stamp(-index % 10), createdAt: stamp(-index % 10), rechargeAmount: [10, 30, 50, 100][index % 4], paidAmount: [10, 30, 50, 100][index % 4], coinReceived: [100, 300, 550, 1200][index % 4], receivingAccount: 'local-demo@liveshop.test', paymentType: index % 2 + 1, paymentStatus: index % 7 === 0 ? 1 : 2 })));
  store.save('commerce_meta', { id: 1, version: 1, seededAt: stamp() });
}

export async function handleCommerce(ctx) {
  const { store } = ctx;
  const params = { ...(ctx.query ?? {}), ...(ctx.body ?? {}) };
  const path = String(ctx.path).replace(/^\/+|\/+$/g, '').replace(/^api\//i, '').toLowerCase();

  if (path === 'category/index') return page(categoryTree(store), params);
  if (path === 'category/add' || path === 'category/edit') {
    const prior = path.endsWith('/edit') ? find(store, 'categories', params.id, '类目') : {};
    required(params.name, '类目名称');
    const parentId = Number(params.parentId ?? prior.parentId ?? 0);
    if (parentId) find(store, 'categories', parentId, '父级类目');
    if (parentId && String(parentId) === String(params.id)) fail('类目不能作为自身的父级');
    const isDescendant = id => store.list('categories').filter(row => String(row.parentId) === String(id)).some(row => String(row.id) === String(parentId) || isDescendant(row.id));
    if (params.id && parentId && isDescendant(params.id)) fail('不能将类目移动到自己的子级');
    return store.save('categories', { ...prior, ...(path.endsWith('/edit') ? { id: prior.id } : {}), name: String(params.name).trim(), parentId, createdAt: prior.createdAt ?? stamp(), updatedAt: stamp() });
  }
  if (path === 'category/del') {
    const ids = new Set(idsOf(params));
    if (!ids.size) fail('请选择要删除的类目');
    const all = store.list('categories');
    let changed = true;
    while (changed) { changed = false; for (const row of all) if (ids.has(String(row.parentId)) && !ids.has(String(row.id))) { ids.add(String(row.id)); changed = true; } }
    if (store.list('products').some(row => ids.has(String(row.categoryId)))) fail('该类目存在关联商品，请先移除商品');
    store.remove('categories', [...ids]);
    store.remove('specs', store.list('specs').filter(row => ids.has(String(row.categoryId))).map(row => row.id));
    return { deletedIds: [...ids] };
  }

  if (path === 'spec/getbyid') return store.list('specs').filter(row => String(row.categoryId) === String(params.id ?? params.categoryId)).map(row => ({ id: row.id, CateId: row.categoryId, categoryId: row.categoryId, spec: [{ dictionaryId: row.dictionaryId, specName: row.specName, specVal: row.specVal }] }));
  if (path === 'spec/index/details') return store.list('specs').filter(row => String(row.categoryId) === String(params.id ?? params.categoryId)).flatMap(row => row.specVal.map(value => ({ id: value.id, categoryId: row.categoryId, dictionaryId: row.dictionaryId, specName: row.specName, specVal: value.val })));
  if (path === 'spec/details') { const row = find(store, 'specs', params.id, '规格'); return { ...row, CateId: row.categoryId, spec: [{ dictionaryId: row.dictionaryId, specVal: row.specVal }] }; }
  if (path === 'spec/add' || path === 'spec/edit') return saveSpecs(store, params);
  if (path === 'spec/del') { const ids = idsOf(params); if (!ids.length) fail('请选择规格'); store.remove('specs', ids); return { deletedIds: ids }; }

  if (path === 'product/center/index' || path === 'product/index') {
    let rows = store.list('products').map(row => decorateProduct(row, store)).filter(row => textMatch(row, params.name ?? params.keywords, ['name', 'intro']) && textMatch(row, params.ItemNumber ?? params.itemNumber, ['itemNumber']) && equal(row, 'classId', params.classId) && equal(row, 'categoryId', params.categoryId) && equal(row, 'status', params.status));
    if (path === 'product/index') rows = rows.flatMap(row => (row.sku.length ? row.sku : [{}]).map(sku => ({ ...row, skuId: sku.id, specName: (sku.attrGroup ?? '').split(',').map(id => SPEC_NAMES[id]).filter(Boolean).join(' / '), specVal: sku.remark ?? '', stock: sku.stock ?? 0, sale_num: sku.sale_num ?? 0, price: [Number(sku.coin) ? `${sku.coin} 金币` : '', Number(sku.point) ? `${sku.point} 积分` : ''].filter(Boolean).join(' + ') })));
    return page(rows, params);
  }
  if (path === 'product/details') return decorateProduct(find(store, 'products', params.id, '商品'), store);
  if (path === 'product/add' || path === 'product/edit') {
    const prior = path.endsWith('/edit') ? find(store, 'products', params.id, '商品') : {};
    const record = normalizeProduct(params, prior);
    find(store, 'categories', record.categoryId, '商品类目');
    if (store.list('products').some(row => row.itemNumber === record.itemNumber && String(row.id) !== String(prior.id))) fail('商品编号已存在');
    return decorateProduct(store.save('products', { ...record, ...(prior.id ? { id: prior.id } : {}) }), store);
  }
  if (path === 'product/del') { const ids = idsOf(params); if (!ids.length) fail('请选择商品'); store.remove('products', ids); return { deletedIds: ids }; }
  if (path === 'product/changestatus') { const row = find(store, 'products', params.id, '商品'); if (![1, 2, 3, 4].includes(Number(params.status))) fail('商品状态不正确'); return store.save('products', { ...row, status: Number(params.status), updatedAt: stamp() }); }

  const activityRoute = path.match(/^activity\/(booking\/)?(index|add|edit|del|setonsale)$/);
  if (activityRoute) {
    const collection = activityRoute[1] ? 'bookings' : 'activities';
    const action = activityRoute[2];
    if (action === 'index') return page(store.list(collection).filter(row => textMatch(row, params.name, ['name', 'shortDesc']) && equal(row, 'activityType', params.type ?? params.activityType) && dateMatch(row, 'createdAt', params.rangeTime)), params);
    if (action === 'add' || action === 'edit') { const prior = action === 'edit' ? find(store, collection, params.id, '活动') : {}; const row = normalizeActivity(params, prior); return store.save(collection, { ...row, ...(prior.id ? { id: prior.id } : {}) }); }
    if (action === 'del') { const ids = idsOf(params); if (!ids.length) fail('请选择活动'); const active = store.list(collection).filter(row => ids.includes(String(row.id))).some(row => row.onSale === 2); if (active) fail('请先下架活动再删除'); store.remove(collection, ids); return { deletedIds: ids }; }
    if (action === 'setonsale') { const row = find(store, collection, params.id, '活动'); if (![1, 2].includes(Number(params.onSale))) fail('活动上下架状态不正确'); return store.save(collection, { ...row, onSale: Number(params.onSale), updatedAt: stamp() }); }
  }

  if (['grouporder/index', 'grouporder/goods/index', 'grouporder/crowd/index', 'grouporder/group/index'].includes(path)) {
    const kind = ({ 'grouporder/goods/index': 3, 'grouporder/crowd/index': 1, 'grouporder/group/index': 2 })[path];
    const typeList = Array.isArray(params.typeList) ? params.typeList.map(Number) : null;
    return page(store.list('orders').filter(row => (!kind || row.type === kind) && equal(row, 'type', params.type) && (!typeList || typeList.includes(row.type)) && equal(row, 'userId', params.userId) && equal(row, 'orderStatus', params.orderStatus) && equal(row, 'activityStatus', params.activityStatus) && textMatch(row, params.activityName, ['activityName']) && textMatch(row, params.orderSn, ['orderSn']) && dateMatch(row, 'payTime', params.payTime)), params);
  }
  if (path === 'grouporder/refundaudit') {
    const row = find(store, 'orders', params.id, '订单');
    if (Number(row.refundStatus) !== 1) fail('该订单没有待审核的退款申请');
    const action = Number(params.action);
    if (![1, 2].includes(action)) fail('退款审核操作不正确');
    if (action === 2) required(params.reason, '拒绝理由');
    const orderStatus = action === 1 ? 3 : 5;
    return store.save('orders', { ...row, refundStatus: action === 1 ? 2 : 3, orderStatus, orderStatusMsg: ORDER_STATUS[orderStatus], refundAuditReason: params.reason ?? '', refundAuditAt: stamp(), updatedAt: stamp() });
  }
  if (path === 'grouporder/changeshippingstatus') {
    const row = find(store, 'orders', params.id, '订单');
    const shippingStatus = Number(params.shippingStatus);
    if (![1, 2, 3].includes(shippingStatus)) fail('物流状态不正确');
    if ([3, 4, 5, 6].includes(Number(row.orderStatus))) fail('当前订单状态不可更新物流');
    if (shippingStatus === 2) required(params.shippingSn, '物流单号');
    const orderStatus = shippingStatus === 3 ? 2 : shippingStatus === 2 ? 8 : 7;
    return store.save('orders', { ...row, shippingStatus, shippingSn: String(params.shippingSn ?? ''), orderStatus, orderStatusMsg: ORDER_STATUS[orderStatus], updatedAt: stamp() });
  }
  if (path === 'rechargeorder/index') return page(store.list('recharge_orders').filter(row => equal(row, 'userId', params.userId) && equal(row, 'paymentStatus', params.paymentStatus) && dateMatch(row, 'payTime', params.payTime)), params);
  return undefined;
}
