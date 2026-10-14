import { get, post, put, del } from '../request';

function _get(url, params, showAlert = true) {
  return get(`/station/master${url}`, { params, showAlert });
}
function _post(url, params) {
  return post(`/station/master${url}`, params);
}
function _put(url, params) {
  return put(`/station/master${url}`, params);
}
function _del(url, params) {
  return del(`/station/master${url}`, { params });
}

export default {
  /**
   * 订单列表
   */
  findOrderList: data => _post('/findOrderList', data),
  /**
   * 账单列表
   */
  findBillList: data => _post('/findBillList', data),
  /**
   * 账单统计
   */
  findBillStatisticsData: data => _get('/findBillStatisticsData', data),
  /**
   * 订单详情
   */
  findOrderInfo: data => _get('/findOrderInfo', data),
  /**
   * 登录
   */
  iAgree: data => _get('/iAgree', data),
  /**
   * 查询个人信息
   */
  findUserInfo: data => _get('/findUserInfo', data),
  /**
   * 查询是否站长
   */
  isStationMaster: data => _get('/isStationMaster', data),
  /**
   * 查询账单统计数据
   */
  findBillStatisticsData: data => _get('/findBillStatisticsData', data),
  /**
   * 账单列表
   */
  findBillList: data => _post('/findBillList', data),
  /**
   * 我的
   */
  myInfo: data => _post('/myInfo', data),


};
