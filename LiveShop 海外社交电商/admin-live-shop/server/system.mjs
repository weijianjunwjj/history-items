import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { fail, pageList, requireRecord } from './helpers.mjs';

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(String(password), salt, 64).toString('hex')}`;
}

export function verifyPassword(password, hash) {
  if (!hash) return false;
  const [salt, digest] = hash.split(':');
  const expected = Buffer.from(digest, 'hex');
  const actual = scryptSync(String(password), salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function publicUser(row) {
  const { passwordHash, password, ...user } = row;
  return user;
}

const groups = [
  ['商品管理', 'goods', 'ionicons5-CubeOutline', [['商品库', 'center'], ['商品列表', 'list'], ['商品分类', 'category'], ['商品规格', 'specs']]],
  ['活动管理', 'activity', 'ionicons5-GiftOutline', [['预约活动', 'reserved'], ['拼团活动', 'group'], ['众筹活动', 'crowd']]],
  ['订单管理', 'order', 'ionicons5-ReceiptOutline', [['商品订单', 'product'], ['拼团订单', 'group'], ['众筹订单', 'crowd'], ['充值订单', 'recharge']]],
  ['运营管理', 'operate', 'ionicons5-BarChartOutline', [['用户管理', 'user'], ['广告海报', 'poster'], ['数据统计', 'data-graph'], ['消息模板', 'message/template'], ['通知管理', 'message/inform']]],
  ['社区管理', 'community', 'ionicons5-ChatbubblesOutline', [['话题管理', 'topic'], ['动态管理', 'updates']]],
  ['推广管理', 'promotion', 'ionicons5-MegaphoneOutline', [['充值配置', 'recharge'], ['规则引擎', 'rule-engine']]],
  ['系统管理', 'system', 'ionicons5-SettingsOutline', [['管理员', 'user'], ['权限组', 'auth'], ['菜单管理', 'menu'], ['数据字典', 'dictionary'], ['操作日志', 'log']]],
];

export function seedSystem(store) {
  store.save('admins', {
    id: 1, username: 'admin', nickname: '本地管理员', passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin123'), status: 1,
    group_id: ['1'], head_img: '/api/assets/avatar.svg', userData: [{ last_login_ip: '127.0.0.1', last_login_time: '', login_times: 0 }],
  });
  store.save('roles', { id: 1, name: '超级管理员', remark: '本地系统全部权限', status: 1, rules: ['*'] });
  store.save('roles', { id: 2, name: '运营人员', remark: '可由管理员配置权限', status: 1, rules: [] });
  let id = 1;
  store.save('menus', { id: id++, fid: 0, title: '首页', level: 1, component: 'single/home', router: '/home', icon: 'ionicons5-HomeOutline', show: 1, sort: 0, auth: 0, method: 1 });
  for (const [title, path, icon, pages] of groups) {
    const fid = id++;
    store.save('menus', { id: fid, fid: 0, title, router: `/${path}`, component: '', icon, level: 1, show: 1, sort: fid, auth: 0, method: 1 });
    for (const [label, component] of pages) store.save('menus', { id: id++, fid, title: label, router: `/${path}/${component}`, component: `${path}/${component}`, icon: 'ionicons5-EllipseOutline', level: 2, show: 1, sort: id, auth: 0, method: 1 });
  }
  const dictionaries = {
    FILE_URL_PRE: [['本地文件路径', '/api/']],
    GOODS_TYPE: [['颜色', '1'], ['尺码', '2'], ['材质', '3'], ['重量', '4']],
    GOODS_CLASS: [['实物商品', '1'], ['虚拟商品', '2']],
    MESSAGE_TYPE: [['物流通知', '1'], ['服务通知', '2'], ['动态通知', '3']],
    AD_POSITIONS: [['首页轮播图', 'home_16_9'], ['社区顶部横幅', 'community_16_9'], ['活动页广告', 'activity_1_1'], ['个人中心广告', 'profile_1_1']],
  };
  let dictionaryId = 1;
  for (const [dictSn, values] of Object.entries(dictionaries)) for (const [label, value] of values) store.save('dictionaries', { id: dictionaryId++, dictSn, label, value, status: 1, remark: '本地初始化数据' });
  store.save('logs', { actionName: '初始化本地管理后台', uid: 1, nickName: '本地管理员', url: '/api/health', addTime: Math.floor(Date.now() / 1000), data: '已创建 SQLite 数据库和示例数据' });
}

export function menuTree(store, rules) {
  const rows = store.list('menus').sort((a, b) => a.sort - b.sort);
  const tree = fid => rows.filter(row => Number(row.fid) === Number(fid)).map(row => {
    const children = tree(row.id);
    return { ...row, key: row.id, ...(children.length ? { children } : {}) };
  });
  const menus = tree(0);
  if (!rules || rules.includes('*')) return menus;
  const filter = items => items.flatMap(item => {
    const children = filter(item.children || []);
    if (children.length || rules.includes(item.router) || item.router === '/home') return [{ ...item, ...(item.children ? { children } : {}) }];
    return [];
  });
  return filter(menus);
}

export function getAccess(store, user) {
  if (Number(user.id) === 1) return ['*'];
  return [...new Set((user.group_id || []).flatMap(id => {
    const role = store.get('roles', id);
    return role?.status === 1 ? role.rules || [] : [];
  }))];
}

export async function handleSystem({ path, query, body, store, user }) {
  const params = { ...query, ...body };
  const [resource, action] = path.split('/');
  const resources = { User: 'admins', Auth: 'roles', Dictionary: 'dictionaries', Log: 'logs', Menu: 'menus' };
  if (path === 'BasePrivate/userData') return publicUser(user);
  if (path === 'BasePrivate/userEditData') {
    const password = params.NewPasswords ?? params.password;
    const oldPassword = params.Password ?? params.oldPassword;
    const confirmation = params.ConfirmYourPassword ?? params.rePassword;
    if (password && !verifyPassword(oldPassword, user.passwordHash)) fail('原密码不正确');
    if (password && confirmation !== password) fail('两次密码输入不一致');
    return publicUser(store.save('admins', { ...user, nickname: params.NickName ?? params.nickname ?? user.nickname, ...(password ? { passwordHash: hashPassword(password) } : {}) }));
  }
  if (!resources[resource]) return undefined;
  const collection = resources[resource];
  if (resource === 'Auth' && action === 'authMenu') return menuTree(store, getAccess(store, user));
  if (resource === 'Auth' && action === 'groupUsers') return pageList(store.list('admins').filter(row => row.group_id?.includes(String(params.group_id ?? params.id))).map(publicUser), params);
  if (resource === 'Auth' && action === 'delMember') {
    const row = requireRecord(store, 'admins', params.uid ?? params.user_id ?? params.id);
    const groupId = params.group_id ?? params.gid;
    if (Number(row.id) === 1 && Number(groupId) === 1) fail('默认管理员不能移出管理组');
    return publicUser(store.save('admins', { ...row, group_id: row.group_id.filter(id => String(id) !== String(groupId)) }));
  }
  if (resource === 'Auth' && action === 'getRuleList') {
    const role = requireRecord(store, 'roles', params.group_id ?? params.id);
    const map = rows => rows.map(row => ({ ...row, key: row.router, ...(row.children ? { children: map(row.children) } : {}) }));
    return { list: map(menuTree(store)), rules: role.rules.includes('*') ? store.list('menus').map(row => row.router) : role.rules };
  }
  if (resource === 'Auth' && action === 'editRule') {
    if (Number(params.id) === 1) fail('超级管理员权限不能移除');
    return store.save('roles', { ...requireRecord(store, collection, params.id), rules: Array.isArray(params.rules) ? params.rules : [] });
  }
  if (resource === 'Dictionary' && action === 'getDictSn') return { list: store.list(collection).filter(row => row.dictSn === params.dictSn && row.status === 1) };
  if (resource === 'Menu' && action === 'index') return menuTree(store);
  if (action === 'index') return pageList(store.list(collection).map(row => resource === 'User' ? publicUser(row) : row).reverse(), params);
  if (['add', 'edit'].includes(action)) {
    const old = action === 'edit' ? requireRecord(store, collection, params.id) : {};
    let record = { status: 1, ...old, ...params };
    if (resource === 'User') {
      if (!params.username || !params.nickname) fail('账号和昵称不能为空');
      if (store.list(collection).some(row => row.username === params.username && String(row.id) !== String(params.id))) fail('账号已存在');
      if (action === 'add' && !params.password) fail('请输入密码');
      record.group_id = Array.isArray(params.group_id) ? params.group_id.map(String) : [];
      record.userData = old.userData || [{ last_login_ip: '', last_login_time: '', login_times: 0 }];
      if (params.password && params.password !== 'UsesOldPwd') record.passwordHash = hashPassword(params.password);
      delete record.password;
    }
    if (resource === 'Menu') {
      record.fid = Number(record.fid) || 0;
      if (record.fid && !store.get(collection, record.fid)) fail('父菜单不存在');
      let ancestor = record.fid;
      while (ancestor) {
        if (Number(ancestor) === Number(record.id)) fail('菜单不能循环嵌套');
        ancestor = store.get(collection, ancestor)?.fid;
      }
    }
    const result = store.save(collection, record);
    return resource === 'User' ? publicUser(result) : result;
  }
  if (action === 'changeStatus') {
    if (['User', 'Auth'].includes(resource) && Number(params.id) === 1 && Number(params.status) !== 1) fail('不能禁用默认管理员');
    return resource === 'User' ? publicUser(store.save(collection, { ...requireRecord(store, collection, params.id), status: Number(params.status) })) : store.save(collection, { ...requireRecord(store, collection, params.id), status: Number(params.status) });
  }
  if (['del', 'deleteByIds'].includes(action)) {
    let ids = Array.isArray(params.id) ? params.id : String(params.id ?? '').split(',');
    if (['User', 'Auth'].includes(resource) && ids.some(id => Number(id) === 1)) fail('不能删除默认管理员');
    if (resource === 'Menu') {
      const records = store.list(collection);
      const descendants = parent => records.filter(row => String(row.fid) === String(parent)).flatMap(row => [row.id, ...descendants(row.id)]);
      ids = ids.flatMap(id => [id, ...descendants(id)]);
    }
    return store.remove(collection, ids);
  }
  return undefined;
}
