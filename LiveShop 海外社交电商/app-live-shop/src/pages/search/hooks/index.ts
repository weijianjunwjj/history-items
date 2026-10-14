const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_COUNT = 99;

// 获取历史记录
export function getSearchHistory() {
  const history = uni.getStorageSync(SEARCH_HISTORY_KEY);
  console.log('getSearchHistory-history', history)
  return history ? JSON.parse(history) : [];
}

// 添加一条新的搜索记录
export function addSearchRecord(query) {
  if (!query) return;

  let history = getSearchHistory();

  // 检查记录是否已存在，存在则删除旧的（避免重复）
  history = history.filter(item => item !== query);

  // 添加新记录到数组头部
  history.unshift(query);

  // 限制记录数量
  if (history.length > MAX_HISTORY_COUNT) {
    history = history.slice(0, MAX_HISTORY_COUNT);
  }

  console.log('history', history)

  // 保存到本地存储
  uni.setStorageSync(SEARCH_HISTORY_KEY, JSON.stringify(history));
}

// 清除搜索历史
export function clearSearchHistory() {
  uni.removeStorageSync(SEARCH_HISTORY_KEY);
}
