import { http } from '@/utils/http'

// 定义入参对象类型
interface Params {
  gender?: number;              // 性别，可选，例如：1 表示男，2 表示女
  rangeAge?: [number, number];   // 年龄范围，可选，例如：[18, 25] 表示 18 到 25 岁
  distance?: [number, number];   // 距离范围，可选，例如：[0, 100] 表示 0 到 100 公里
}

export const getHomeIndex = (params: Params) => {
  return http.post('/Home/index', params);
};

export const locInfoRecord = (location:number[]) => {
  return http.post('/Record/locInfo', {location});
};

export const getHomeUser = () => {
  return http.post('/Home/user');
};
export const getRecommendUser = () => {
  return http.get('/Recommend/user');
};

