import { get, post, put, del } from '../request';

function _get(url, params) {
  return get(`/api/user/${url}`, { params });
}
function _post(url, params) {
  return post(`/api/user/${url}`, params);
}
function _put(url, params) {
  return put(`/api/user/${url}`, params);
}
function _del(url, params) {
  return del(`/api/user/${url}`, { params });
}

export default {
  /**
   * 解密手机号
   *
   * @param {params} params - 表单对象的集合
   *   @property {number} phoneCode - 手机号
   * @returns {boolean} true/false
   */
  phoneCode: ({ phoneCode }) => _get(`phoneCode`, { phoneCode }),
  /**
   * 获取个人信息
   */
  getUserInfo: () => get(`/api/user`),
  /**
   * 保护用户个人信息（昵称，头像，手机号）
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} name - 昵称
   *   @property {string} avatarUrl - 头像
   *   @property {string} phoneCode - 手机号
   *   @property {string} gender - 性别
   * @returns {boolean} true/false
   */
  savePersonInfo: ({ name, avatarUrl, phone, gender }) =>
    _post(`add`, { name, avatarUrl, mobile:phone, gender }),
};
