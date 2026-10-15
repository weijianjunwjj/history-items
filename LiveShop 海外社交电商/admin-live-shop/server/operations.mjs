const DAY = 86400000;
const nowText = () => new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 19).replace('T', ' ');
const dateAgo = (days, time = '10:30:00') => `${new Date(Date.now() + 8 * 3600000 - days * DAY).toISOString().slice(0, 10)} ${time}`;
const dateKey = value => String(value || '').slice(0, 10);
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const error = (message, status = 400) => Object.assign(new Error(message), { code: status, status, statusCode: status });
const present = value => value !== undefined && value !== null && value !== '';
const contains = (value, query) => !present(query) || String(value ?? '').toLowerCase().includes(String(query).toLowerCase());
const same = (value, query) => !present(query) || String(value) === String(query);
const split = value => (Array.isArray(value) ? value : String(value || '').split(',')).map(value => String(value).trim()).filter(Boolean);

function required(record, keys) {
  for (const key of keys) if (!present(record[key]) || String(record[key]).trim() === '') throw error(`请填写 ${key}`);
}

function finite(record, keys, minimum = 0) {
  for (const key of keys) {
    if (!present(record[key]) || !Number.isFinite(Number(record[key])) || Number(record[key]) < minimum) throw error(`${key} 必须是大于等于 ${minimum} 的数字`);
    record[key] = Number(record[key]);
  }
}

function oneOf(record, key, values) {
  if (!values.includes(Number(record[key]))) throw error(`${key} 的值无效`);
  record[key] = Number(record[key]);
}

function page(list, params) {
  const count = list.length;
  const current = Math.max(1, Math.floor(number(params.page) || 1));
  const size = Math.min(1000, Math.max(1, Math.floor(number(params.pageSize ?? params.size ?? params.limit) || 10)));
  return { list: list.slice((current - 1) * size, current * size), count, page: current, pageSize: size };
}

function byTime(row, params, key = 'createdAt') {
  const value = String(row[key] || row.createAt || row.create_time || '');
  return (!present(params.startTime) || value >= String(params.startTime)) && (!present(params.endTime) || value <= String(params.endTime));
}

function find(store, collection, id) {
  if (!present(id)) throw error('缺少记录 ID');
  const record = store.get(collection, id) ?? store.list(collection).find(row => same(row.id ?? row.Id, id));
  if (!record) throw error('记录不存在或已经删除', 404);
  return record;
}

function remove(store, collection, params) {
  const ids = split(params.ids ?? params.id ?? params.Id);
  if (!ids.length) throw error('请选择要删除的记录');
  for (const id of ids) find(store, collection, id);
  store.remove(collection, ids);
  return { ids, deleted: ids.length };
}

function baseRecord(store, collection, action, params, defaults = {}) {
  const old = action === 'edit' ? find(store, collection, params.id ?? params.Id) : {};
  const timestamp = nowText();
  const result = { ...defaults, ...old, ...params, updatedAt: timestamp };
  if (action === 'add') {
    delete result.id;
    delete result.Id;
    result.createdAt = timestamp;
    result.createAt = timestamp;
  }
  return result;
}

function assets(data, origin) {
  if (!origin) return data;
  if (Array.isArray(data)) return data.map(value => assets(value, origin));
  if (data && typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, assets(value, origin)]));
  if (typeof data === 'string' && data.startsWith('/api/')) return data.split(',').map(value => value.startsWith('/api/') ? `${origin.replace(/\/$/, '')}${value}` : value).join(',');
  return data;
}

function postRecord(store, row) {
  const user = store.get('appUsers', row.userId);
  const linkTopic = split(row.linkTopic);
  return { ...row, userName: user?.nickname || row.userName || '本地管理员', nickname: user?.nickname || row.nickname || '本地管理员', linkTopic, createAt: row.createdAt, date: row.createdAt };
}

function topicRecord(store, row) {
  const posts = store.list('posts').filter(post => split(post.linkTopic).includes(row.name));
  return { ...row, heat: posts.reduce((sum, post) => sum + number(post.likeCount) + number(post.commentCount) + 1, 0), postCount: posts.length };
}

function userRecord(store, row) {
  const recharge = store.list('recharge_orders').filter(order => same(order.userId, row.Id) && number(order.paymentStatus) === 2);
  return {
    ...row,
    Id: row.id,
    height: String(row.height),
    weight: String(row.weight),
    registered_days: Math.max(0, Math.floor((Date.now() - Date.parse(`${row.create_time.replace(' ', 'T')}+08:00`)) / DAY)),
    postCount: store.list('posts').filter(post => same(post.userId, row.Id)).length,
    totalRechargeAmount: Number(recharge.reduce((sum, order) => sum + number(order.rechargeAmount ?? order.amount), 0).toFixed(2)),
  };
}

function notificationRecord(row) {
  const channels = split(row.gayType);
  return { ...row, inSite: channels.includes('1'), outSite: channels.includes('2') };
}

export function seedOperations(store) {
  const nicknames = ['星河旅人', '海风小铺', '纽约小鹿', '巴黎晴天', '东京慢生活', '夏日橙子', '温哥华阿白', '伦敦茶客', '晨光里的猫', '蓝莓可可', '山野清风', '加州拾光', '墨尔本晚霞', '悉尼云朵', '向日葵同学', '漫游小熊', '新加坡小雨', '葡萄汽水'];
  const users = nicknames.map((nickname, index) => ({
    id: index + 1, Id: index + 1, username: `member${String(index + 1).padStart(3, '0')}@example.com`, nickname,
    create_time: dateAgo(index < 4 ? 1 : (index + 2) * 6), birthDay: `${[2003, 1998, 1993, 1986, 1974, 1965][index % 6]}-${String(index % 12 + 1).padStart(2, '0')}-15`,
    weight: String(48 + index * 2), height: String(158 + index % 15), gender: index % 2 + 1,
    providerName: index % 3 ? 'google' : 'x', status: index > 15 ? 2 : 1, integral: 400 + index * 80,
    coin: 60 + index * 20, avator: '/api/assets/avatar.svg', avatar: '/api/assets/avatar.svg',
    onlineTotal: `${8 + index * 3} 小时`, mutualFollowersCount: 3 + index, followerCount: 25 + index * 7, followingCount: 12 + index * 2,
    version: 1, lastLoginAt: dateAgo(index < 12 ? 1 : 7), totalRechargeAmount: 0,
  }));
  store.replace('appUsers', users);

  const topicNames = ['今日好物分享', '海外生活日记', '运动与健康', '周末出游', '数码新体验', '小家大幸福'];
  store.replace('topics', topicNames.map((name, index) => ({ id: index + 1, name, heat: 0, nickname: '本地管理员', createAt: dateAgo(14 - index), createdAt: dateAgo(14 - index) })));
  const titles = ['我的便携咖啡杯开箱', '在海边度过轻松周末', '新耳机的降噪体验', '晨跑之后的早餐', '收纳后的小客厅', '旅行背包使用心得', '一起分享生活小确幸', '种下一盆阳台绿植', '我的第一份积分兑换', '雨天也要保持好心情', '轻松准备野餐清单', '今天的运动打卡'];
  const contents = ['材质细腻，随身携带很方便，日常通勤也能享受热咖啡。', '阳光和海风都刚刚好，拍下这一刻与大家分享。', '小巧实用的好物让生活更加轻松，期待你的使用心得。', '坚持一点点，生活就会变得更有活力，欢迎一起交流。'];
  store.replace('posts', Array.from({ length: 24 }, (_, index) => {
    const user = users[index % users.length];
    return { id: index + 1, title: titles[index % titles.length], content: `<p>${contents[index % contents.length]}</p>`,
      userId: user.Id, userName: user.nickname, nickname: user.nickname, linkTopic: [topicNames[index % 6]],
      mediaType: 1, mediaUrl: '/api/assets/product.svg', likeCount: 12 + index * 4, commentCount: 2 + index % 7,
      status: 1, createdAt: dateAgo(index % 10 + 1), createAt: dateAgo(index % 10 + 1), date: dateAgo(index % 10 + 1), version: 1 };
  }));
  store.replace('integralRecords', users.flatMap(user => Array.from({ length: 7 }, (_, index) => ({
    id: (user.Id - 1) * 7 + index + 1, userId: user.Id, createdAt: dateAgo(7 - index), type: [1, 3, 4, 10, 9, 7, 6][index],
    quantity: [10, 5, 5, 20, 3, 30, 15][index], total: user.integral - 88 + [10, 15, 20, 40, 43, 73, 88][index],
  }))));
  store.replace('advertisements', [
    { id: 1, name: '秋日好物精选', description: '精选实用生活好物，开启舒适日常。', locationId: 'home_16_9', sortId: 100, status: 1, openType: 1, picture: '/api/assets/banner.svg', jumpUrl: '', createdName: '本地管理员', createdAt: dateAgo(12) },
    { id: 2, name: '社区分享季', description: '记录海外生活，分享你的精彩瞬间。', locationId: 'community_16_9', sortId: 90, status: 1, openType: 4, picture: '/api/assets/banner.svg', jumpUrl: '/community', createdName: '本地管理员', createdAt: dateAgo(8) },
    { id: 3, name: '积分兑换上新', description: '日常互动积累积分，兑换喜欢的商品。', locationId: 'activity_1_1', sortId: 80, status: 2, openType: 2, picture: '/api/assets/poster.svg', jumpUrl: '/shop', createdName: '本地管理员', createdAt: dateAgo(5) },
  ]);
  store.replace('messages', [
    { id: 1, name: '订单发货通知', type: 1, msgSn: 'MSG000001', status: 2, content: '您的订单 {orderSn} 已发货，物流单号为 {trackingNumber}，请留意配送进度。', nickName: '本地管理员', createAt: dateAgo(14), gayType: '1,2' },
    { id: 2, name: '充值到账提醒', type: 2, msgSn: 'MSG000002', status: 2, content: '您的 ${amount} 充值已到账，共获得 {coinNum} 金币。感谢您的支持。', nickName: '本地管理员', createAt: dateAgo(13), gayType: '1' },
    { id: 3, name: '动态互动提醒', type: 3, msgSn: 'MSG000003', status: 2, content: '{nickname} 评论了您的动态，快来看看吧。', nickName: '本地管理员', createAt: dateAgo(12), gayType: '1' },
    { id: 4, name: '活动报名提醒', type: 2, msgSn: 'MSG000004', status: 1, content: '您已成功参与 {activityName}，可以在活动页查看最新进展。', nickName: '本地管理员', createAt: dateAgo(10), gayType: '1,2' },
  ]);
  store.replace('notifications', [
    { id: 1, templateType: 1, rule: 1, name: '物流通知', msgSn: 'NOT000001', content: '您的订单已发货，请在订单详情查看物流进度。', onSale: 2, status: 2, gayType: '1,2', creatorName: '本地管理员', createdAt: dateAgo(10) },
    { id: 2, templateType: 2, rule: 2, name: '服务通知', msgSn: 'NOT000002', content: '您的账户服务有新的进展，请查看详情。', onSale: 2, status: 2, gayType: '1', creatorName: '本地管理员', createdAt: dateAgo(8) },
    { id: 3, templateType: 3, rule: 3, name: '动态通知', msgSn: 'NOT000003', content: '有人与您的动态互动，快来查看新消息。', onSale: 1, status: 1, gayType: '1', creatorName: '本地管理员', createdAt: dateAgo(6) },
  ]);
  store.replace('sceneRules', ['被点赞', '被评论', '打招呼', '发布动态', '点赞', '评论'].map((scene, index) => ({
    id: index + 1, name: `${scene}积分奖励`, rule: 1, scene: index + 1, counts: [10, 10, 5, 3, 10, 10][index],
    integral: [3, 5, 2, 20, 2, 5][index], integralMax: [30, 50, 10, 60, 20, 50][index], createdAt: dateAgo(15),
  })));
  store.replace('coins', [
    { id: 1, gearName: '轻松体验', coinNum: 100, amount: 0.99, giftRatio: 0 },
    { id: 2, gearName: '日常优选', coinNum: 500, amount: 4.99, giftRatio: 5 },
    { id: 3, gearName: '畅享生活', coinNum: 1200, amount: 9.99, giftRatio: 10 },
    { id: 4, gearName: '超值礼遇', coinNum: 3000, amount: 24.99, giftRatio: 15 },
    { id: 5, gearName: '尊享礼包', coinNum: 6500, amount: 49.99, giftRatio: 20 },
  ]);
}

function statistics(store, params) {
  const date = dateKey(params.date || dateAgo(1));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error('统计日期格式应为 YYYY-MM-DD');
  const users = store.list('appUsers');
  const newUsers = users.filter(user => dateKey(user.create_time) === date);
  const orders = store.list('orders');
  const recharges = store.list('recharge_orders').filter(order => number(order.paymentStatus) === 2);
  const targetRecharges = recharges.filter(order => dateKey(order.payTime || order.createdAt) === date);
  const buckets = [0, 0, 0, 0];
  for (const user of users) {
    const birthday = new Date(`${user.birthDay}T00:00:00+08:00`);
    const at = new Date(`${date}T12:00:00+08:00`);
    let age = at.getFullYear() - birthday.getFullYear();
    if (at.getMonth() < birthday.getMonth() || (at.getMonth() === birthday.getMonth() && at.getDate() < birthday.getDate())) age--;
    buckets[age <= 28 ? 0 : age <= 38 ? 1 : age <= 49 ? 2 : 3]++;
  }
  const recharge7d = Array.from({ length: 7 }, (_, index) => {
    const key = new Date(Date.parse(`${date}T12:00:00Z`) - (6 - index) * DAY).toISOString().slice(0, 10);
    return { date: key, name: key, value: Number(recharges.filter(order => dateKey(order.payTime || order.createdAt) === key).reduce((sum, order) => sum + number(order.rechargeAmount ?? order.amount), 0).toFixed(2)) };
  });
  const participation = new Map();
  for (const order of orders.filter(order => [1, 2].includes(number(order.type)))) {
    const key = order.activityId ?? order.activityName ?? order.type;
    const item = participation.get(key) || { id: key, name: order.activityName || '本地活动', participant: 0 };
    item.participant += number(order.quantity) || 1;
    participation.set(key, item);
  }
  return {
    date, incrMale: newUsers.filter(user => number(user.gender) === 1).length, incrFemale: newUsers.filter(user => number(user.gender) === 2).length,
    activeUser: users.filter(user => dateKey(user.lastLoginAt) === date && number(user.status) === 1).length,
    totalUser: users.length, crowdTotal: orders.filter(order => number(order.type) === 1).length, groupTotal: orders.filter(order => number(order.type) === 2).length,
    rechargeTotal: targetRecharges.length, rechargeAmount: Number(targetRecharges.reduce((sum, order) => sum + number(order.rechargeAmount ?? order.amount), 0).toFixed(2)),
    age: ['18-28', '29-38', '39-49', '50及以上'].map((name, index) => ({ name, total: buckets[index] })),
    activity: [...participation.values()], recharge7d,
  };
}

export async function handleOperations(ctx) {
  const { store } = ctx;
  const path = String(ctx.path).replace(/^\/+/, '').replace(/^api\//, '').replace(/\/+$/, '').replace(/^Notification\/add\}$/, 'Notification/add');
  const [resource, action] = path.split('/');
  const resources = ['AppUser', 'Post', 'Topic', 'IntegralRecord', 'Advertisement', 'Msg', 'Notification', 'SceneRule', 'Coin', 'Statistic'];
  if (!resources.includes(resource)) return undefined;
  const params = { ...(ctx.query || {}), ...(ctx.body || {}) };
  const finish = result => assets(result, ctx.origin);

  if (resource === 'Statistic' && action === 'detail') return statistics(store, params);
  if (resource === 'IntegralRecord' && action === 'index') return finish(page(store.list('integralRecords').filter(row => same(row.userId, params.userId)).sort((a, b) => b.id - a.id), params));

  if (resource === 'AppUser') {
    if (action === 'index') return finish(page(store.list('appUsers').filter(row => contains(row.nickname, params.nickname) && contains(row.username, params.username) && same(row.Id, params.id) && same(row.providerName, params.providerName) && same(row.status, params.status) && byTime(row, params, 'create_time')).map(row => userRecord(store, row)), params));
    if (action === 'detail' || action === 'details') return finish(userRecord(store, find(store, 'appUsers', params.userId ?? params.id ?? params.Id)));
    if (action === 'del') {
      const removed = remove(store, 'appUsers', params);
      const posts = store.list('posts').filter(post => removed.ids.includes(String(post.userId)));
      if (posts.length) store.remove('posts', posts.map(post => post.id));
      return removed;
    }
    if (['ban', 'unban', 'edit'].includes(action)) {
      const old = find(store, 'appUsers', params.Id ?? params.id ?? params.userId);
      if (action === 'edit' && present(params.version) && number(params.version) !== number(old.version)) throw error('用户资料已被更新，请刷新后重试', 409);
      const record = { ...old, updatedAt: nowText(), version: number(old.version) + 1 };
      if (action === 'ban' || action === 'unban') record.status = action === 'ban' ? 2 : 1;
      else {
        for (const key of ['nickname', 'gender', 'height', 'weight', 'birthDay', 'avator']) if (params[key] !== undefined) record[key] = params[key];
        oneOf(record, 'gender', [1, 2]);
        finite(record, ['height', 'weight'], 1);
        if (record.height > 300 || record.weight > 500) throw error('身高或体重超出合理范围');
        record.height = String(record.height);
        record.weight = String(record.weight);
      }
      return finish(userRecord(store, store.save('appUsers', record)));
    }
  }

  if (resource === 'Post') {
    if (action === 'index') return finish(page(store.list('posts').filter(row => contains(row.title, params.title ?? params.keywords) && contains(split(row.linkTopic).join(','), params.topic) && same(row.userId, params.userId) && same(row.status, params.status) && byTime(row, params)).sort((a, b) => b.id - a.id).map(row => postRecord(store, row)), params));
    if (action === 'details' || action === 'detail') return finish(postRecord(store, find(store, 'posts', params.id)));
    if (action === 'del') return remove(store, 'posts', params);
    if (action === 'add' || action === 'edit') {
      const record = baseRecord(store, 'posts', action, params, { userId: 1, likeCount: 0, commentCount: 0, status: 1, mediaType: 1 });
      required(record, ['title', 'content', 'mediaUrl']);
      oneOf(record, 'mediaType', [1, 2]);
      if (params.newTopic !== undefined || params.linkTopic !== undefined) record.linkTopic = split(params.newTopic ?? params.linkTopic);
      if (!record.linkTopic?.length) throw error('请填写话题');
      find(store, 'appUsers', record.userId);
      for (const name of record.linkTopic) {
        if (!store.list('topics').some(topic => topic.name === name)) store.save('topics', { name, heat: 0, nickname: '本地管理员', createAt: nowText(), createdAt: nowText() });
      }
      delete record.newTopic;
      record.version = number(record.version) + 1;
      return finish(postRecord(store, store.save('posts', record)));
    }
  }

  if (resource === 'Topic') {
    if (action === 'index') return page(store.list('topics').filter(row => contains(row.name, params.keyword ?? params.name)).map(row => topicRecord(store, row)).sort((a, b) => b.heat - a.heat), params);
    if (action === 'details' || action === 'detail') {
      const topic = find(store, 'topics', params.id);
      const result = page(store.list('posts').filter(row => split(row.linkTopic).includes(topic.name)).map(row => postRecord(store, row)), params);
      return finish({ ...result, list: { ...topicRecord(store, topic), dynamic: result.list } });
    }
    if (action === 'del') {
      const ids = split(params.ids ?? params.id);
      const names = ids.map(id => find(store, 'topics', id).name);
      const removed = remove(store, 'topics', params);
      for (const post of store.list('posts')) {
        if (split(post.linkTopic).some(name => names.includes(name))) store.save('posts', { ...post, linkTopic: split(post.linkTopic).filter(name => !names.includes(name)) });
      }
      return removed;
    }
    if (action === 'add' || action === 'edit') {
      const old = action === 'edit' ? find(store, 'topics', params.id) : null;
      const record = baseRecord(store, 'topics', action, params, { heat: 0, nickname: '本地管理员' });
      required(record, ['name']);
      record.name = String(record.name).trim();
      if (store.list('topics').some(topic => topic.name === record.name && topic.id !== record.id)) throw error('该话题已经存在');
      const saved = store.save('topics', record);
      if (old && old.name !== saved.name) for (const post of store.list('posts')) {
        if (split(post.linkTopic).includes(old.name)) store.save('posts', { ...post, linkTopic: split(post.linkTopic).map(name => name === old.name ? saved.name : name) });
      }
      return topicRecord(store, saved);
    }
  }

  if (resource === 'Advertisement') {
    if (action === 'index') return finish(page(store.list('advertisements').filter(row => contains(row.name, params.name) && same(row.openType, params.openType) && same(row.status, params.status)).sort((a, b) => b.sortId - a.sortId), params));
    if (action === 'del') return remove(store, 'advertisements', params);
    if (action === 'putOn' || action === 'takeOff') return finish(store.save('advertisements', { ...find(store, 'advertisements', params.id), status: action === 'putOn' ? 1 : 2, updatedAt: nowText() }));
    if (action === 'add' || action === 'edit') {
      const record = baseRecord(store, 'advertisements', action, params, { createdName: '本地管理员', status: 1, sortId: 0, openType: 1 });
      required(record, ['name', 'description', 'picture', 'locationId']);
      oneOf(record, 'openType', [1, 2, 3, 4]);
      oneOf(record, 'status', [1, 2]);
      finite(record, ['sortId']);
      record.locationId = String(record.locationId);
      if (record.openType !== 1) required(record, ['jumpUrl']);
      return finish(store.save('advertisements', record));
    }
  }

  if (resource === 'Msg') {
    if (action === 'index') return page(store.list('messages').filter(row => contains(row.name, params.name) && same(row.type, params.type) && same(row.status, params.status)), params);
    if (action === 'del') return remove(store, 'messages', params);
    if (action === 'changeStatus') {
      const record = { ...find(store, 'messages', params.id), status: params.status, updatedAt: nowText() };
      oneOf(record, 'status', [1, 2]);
      return store.save('messages', record);
    }
    if (action === 'add' || action === 'edit') {
      const record = baseRecord(store, 'messages', action, params, { status: 1, nickName: '本地管理员', gayType: '1' });
      required(record, ['name', 'content', 'type']);
      oneOf(record, 'type', [1, 2, 3]);
      record.gayType = split(record.gayType).join(',');
      let saved = store.save('messages', record);
      if (!saved.msgSn) saved = store.save('messages', { ...saved, msgSn: `MSG${String(saved.id).padStart(6, '0')}` });
      return saved;
    }
  }

  if (resource === 'Notification') {
    if (action === 'index') return page(store.list('notifications').filter(row => contains(row.name, params.name) && same(row.templateType, params.templateType)).map(notificationRecord), { pageSize: 1000, ...params });
    if (action === 'del') return remove(store, 'notifications', params);
    if (action === 'changeStatus') {
      const record = { ...find(store, 'notifications', params.id), updatedAt: nowText() };
      const status = params.onSale ?? params.status;
      if (present(status)) {
        record.onSale = status;
        oneOf(record, 'onSale', [1, 2]);
        record.status = record.onSale;
      }
      if (params.gayType !== undefined) record.gayType = split(params.gayType).join(',');
      if (!present(status) && params.gayType === undefined) throw error('请选择通知状态或渠道');
      return notificationRecord(store.save('notifications', record));
    }
    if (action === 'add' || action === 'edit') {
      const actualAction = params.id ? 'edit' : action;
      const record = baseRecord(store, 'notifications', actualAction, params, { onSale: 1, status: 1, creatorName: '本地管理员', gayType: '1' });
      oneOf(record, 'templateType', [1, 2, 3]);
      const template = store.list('messages').find(message => number(message.type) === record.templateType);
      record.rule = record.templateType;
      record.name = ['物流通知', '服务通知', '动态通知'][record.templateType - 1];
      record.content = params.content || template?.content || '您的服务有新的进展，请查看通知详情。';
      record.gayType = split(record.gayType).join(',');
      let saved = store.save('notifications', record);
      if (!saved.msgSn) saved = store.save('notifications', { ...saved, msgSn: `NOT${String(saved.id).padStart(6, '0')}` });
      return notificationRecord(saved);
    }
  }

  if (resource === 'SceneRule') {
    if (action === 'index') return page(store.list('sceneRules').filter(row => contains(row.name, params.name) && same(row.scene, params.scene)), params);
    if (action === 'del') return remove(store, 'sceneRules', params);
    if (action === 'add' || action === 'edit') {
      const record = baseRecord(store, 'sceneRules', action, params, { rule: 1 });
      required(record, ['name']);
      oneOf(record, 'scene', [1, 2, 3, 4, 5, 6]);
      record.rule = Number(record.rule) || 1;
      oneOf(record, 'rule', [1, 2]);
      finite(record, ['counts', 'integral']);
      record.integralMax = record.counts * record.integral;
      return store.save('sceneRules', record);
    }
  }

  if (resource === 'Coin') {
    if (action === 'index') return store.list('coins').sort((a, b) => a.amount - b.amount);
    if (action === 'del') return remove(store, 'coins', params);
    if (action === 'add' || action === 'edit') {
      const record = baseRecord(store, 'coins', action, params);
      required(record, ['gearName']);
      finite(record, ['coinNum', 'amount', 'giftRatio']);
      if (record.giftRatio > 100) throw error('赠送比例不能超过 100%');
      return store.save('coins', record);
    }
  }
  return undefined;
}
