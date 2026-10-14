import { get, post, put, del } from '../request';
import { is, url_params } from '../../utils/util.js';

function _get(url, params) {
  return get(`/api/address/${url}`, { params });
}
function _post(url, params) {
  return post(`/api/address/${url}`, params);
}
function _put(url, params) {
  return put(`/api/address/${url}`, params);
}
function _del(url, params) {
  return del(`/api/address/${url}`, params);
}

export default {
  /**
   * 新增地址簿
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} name - 姓名
   *   @property {number} phone - 手机号
   *   @property {string} province - 省
   *   @property {string} city - 市
   *   @property {string} area - 区
   *   @property {string} address - 详细地址
   *   @property {number} type - 人类型{1-寄件人，2-收件人}
   * @returns {boolean} 返回值的说明
   *   @property {boolean} prop - 是否成功
   */
  addressAdd: ({ name, phone, province, city, area, address, type }) =>
    _post(`addressAdd`, { name, phone, province, city, area, address, type }),

  /**
   * 地址查询
   *
   * @param {params} params - 表单对象的集合
   *   @property {number} type - 人类型{1-寄件人，2-收件人}
   * @returns {object} 返回值的说明
   *   @property {object} prop - address集合
   */
  selectAddress: (type, p0) => {
    const p = url_params(p0);
    return _get(`selectAddress/${type}?${p}`);
  },

  /**
   * 地址修改
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} id - id
   *   @property {string} name - 姓名
   *   @property {number} phone - 手机号
   *   @property {string} province - 省
   *   @property {string} city - 市
   *   @property {string} area - 区
   *   @property {string} address - 详细地址
   *   @property {number} type - 人类型{1-寄件人，2-收件人}
   * @returns {boolean} 返回值的说明
   *   @property {boolean} prop - 是否成功
   */
  addressUpdate: ({ id, name, phone, province, city, area, address, type }) =>
    _put(`addressUpdate`, {
      id,
      name,
      phone,
      province,
      city,
      area,
      address,
      type,
    }),

  /**
   * 地址详情
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} id - id
   */
  addressDetail: ({ id }) => _get(`selectid/${id}`),

  /**
   * 删除地址
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} ids - 把id用逗号隔开
   * @returns {object} 无返回值 null
   */
  addressDelete: ({ ids }) => del(`/api/address?ids=${ids}`),

  // /**
  //  * 设置默认地址
  //  *
  //  * @param {params} params - 表单对象的集合
  //  *   @property {string} id - id
  //  * @returns {object} 无返回值 null
  //  */
  // addressDelete: ({ id,type }) => _put(`default`,{id}),
};
