import {
  get,
  post,
  put,
  del
} from '../request';
import {
  API_BASE_URL
} from '../request.js';

function _get(url, params, showAlert = true) {
  return get(`/api/${url}`, {
    params,
    showAlert
  });
}

function _post(url, params) {
  return post(`/api/${url}`, params);
}

function _put(url, params) {
  return put(`/api/${url}`, params);
}

function _del(url, params) {
  return del(`/api/${url}`, {
    params
  });
}

const printerId0 = '';
const verCode0 = '';
// const printerId0 = '867672069488037';
// const verCode0 = '0754';
export default {
  /**
   * 查询打印机接口
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} StringstationId - 打印机id
   *   @property {string} verCode - 共享码
   *   @property {string} extraInfo - 扩展字段
   * @returns {boolean} true/false
   */
  printer: ({
      stationId = printerId0,
      verCode = verCode0,
      extraInfo = ''
    }) =>
    // _post(`printer/select`, { stationId, verCode, extraInfo }),
    _post(`printer/query`, {
      stationId,
      verCode,
      extraInfo
    }),
  /**
   * 查询可⽤运⼒接口
   *
   *   @property {string} printerUid - 打印机id
   *   @property {string} shareCode - 打印机共享码
   *   @property {string} appkey - isv标识
   *   @property {string} weight - 预估重量
   *   @property {object} sender - 发货人信息
   *   @property {string} sender.mobile - 发货人手机号
   *   @property {string} sender.name - 发货人姓名
   *   @property {object} sender.address - 发货地址
   *   @property {string} sender.address.city - 发货城市
   *   @property {string} sender.address.province - 发货省
   *   @property {string} sender.address.district - 发货区
   *   @property {string} sender.address.town - 发货街道
   *   @property {string} sender.address.detail - 发货详细地址
   *   @property {object} recipient - 收货人信息
   *   @property {string} recipient.mobile - 收货人手机号
   *   @property {string} recipient.name - 收货人姓名
   *   @property {object} recipient.address - 收货地址
   *   @property {string} recipient.address.city - 收货城市
   *   @property {string} recipient.address.province - 收货省
   *   @property {string} recipient.address.district - 收货区
   *   @property {string} recipient.address.town - 收货街道
   *   @property {string} recipient.address.detail - 收货详细地址
   *   @property {string} cpCodes - 指定快递公司
   *   @property {string} extendInfo - 扩展字段
   */
  capacity: ({
      printerUid = printerId0,
      shareCode = verCode0,
      appkey = '',
      weight,
      sender,
      recipient,
      cpCodes = 'EMS',
      extendInfo = '',
    }) =>
    _post(`capacity`, {
      printerUid,
      shareCode,
      appkey,
      weight,
      sender,
      recipient,
      cpCodes,
      extendInfo,
    }),

  /**
   * 下单接口
   *
   *   @property {string} userIdentifier - 用户身份信息
   *   @property {number} userIdentifierType - 用户身份信息类型 , 0,手机号； 1, 打印机授权码
   *   @property {string} printerId - 打印机id
   *   @property {object} tradeOrderInfoDto - 请求面单信息
   *   @property {string} tradeOrderInfoDto.logisticsServices - 物流服务值
   *   @property {object} tradeOrderInfoDto.orderInfo - 订单信息
   *   @property {string} tradeOrderInfoDto.orderInfo.orderChannelsType - 订单渠道平台
   *   @property {object} tradeOrderInfoDto.packageInfo - 包裹信息
   *   @property {number} tradeOrderInfoDto.packageInfo.volume - 包裹信息-体积, 单位 ml
   *   @property {number} tradeOrderInfoDto.packageInfo.weight - 包裹信息-重量,单位 g
   *   @property {array[object]} tradeOrderInfoDto.packageInfo.items -  包裹信息-商品信息
   *   @property {object} tradeOrderInfoDto.packageInfo.items[item] -  包裹信息-商品信息
   *   @property {string} tradeOrderInfoDto.packageInfo.items.item.count -  包裹信息-数量
   *   @property {string} tradeOrderInfoDto.packageInfo.items.item.name -  包裹信息-名称
   *   @property {object} customerTemplateDto - 云打印自定义区域
   *   @property {string} customerTemplateDto.customerTemplateUrl - 自定义区域模版url
   *   @property {object} customerTemplateDto.data - 自定义变量数据，json
   *   @property {string} customerTemplateDto.data.itemType - 物品类型
   *   @property {string} customerTemplateDto.data.remark - 备注信息
   *   @property {object} sender - 发货人信息
   *   @property {string} sender.name - 发货人姓名
   *   @property {string} sender.mobile - 发货人手机号
   *   @property {object} sender.address - 发货人地址
   *   @property {string} sender.address.city - 发货人城市
   *   @property {string} sender.address.province - 发货人省
   *   @property {string} sender.address.district - 发货人区
   *   @property {string} sender.address.town - 发货人街道
   *   @property {string} sender.address.detail - 发货人详细地址
   *   @property {object} sender.realNameDto - 发货人实名信息-传空
   *   @property {object} recipient - 收件人信息
   *   @property {string} recipient.name - 收件人姓名
   *   @property {string} recipient.mobile - 收件人手机号
   *   @property {object} recipient.address - 收件人地址
   *   @property {string} recipient.address.city - 收件人城市
   *   @property {string} recipient.address.province - 收件人省
   *   @property {string} recipient.address.district - 收件人区
   *   @property {string} recipient.address.town - 收件人街道
   *   @property {string} recipient.address.detail - 收件人详细地址
   */
  addOrder: p => {
    const {
      userIdentifier = verCode0,
        userIdentifierType,
        printerId = printerId0,
        sender,
        tradeOrderInfoDto,
        recipient,
        customerTemplateDto,
    } = p;

    return _post(`order/addOrderInfo`, {
      ...p,
      userIdentifier,
      userIdentifierType,
      printerId,
      sender,
      tradeOrderInfoDto,
      recipient,
      customerTemplateDto,
    });
  },

  /**
   * 查询订单列表接口
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} orderId - 订单id
   * @returns {boolean} true/false
   */
  selectOrderList: p =>
    _get('order/orders', {
      ...p,
    }),
  /**
   * 查询订单详情接口
   *
   * @param {params} params - 表单对象的集合
   *   @property {string} orderId - 订单id
   * @returns {boolean} true/false
   */
  selectOrder: ({
      orderId,
      showAlert = true
    }) =>
    _get(
      'order/select', {
        orderId,
      },
      showAlert
    ),
  /**
   * 取消订单接口
   */
  cancelOrderInfo: ({
      cpCode,
      orderId,
      waybillCode
    }) =>
    _put('order/cancelOrderInfo', {
      cpCode,
      orderId,
      waybillCode,
    }),
  /**
   * 协议H5接口
   */
  protocolH5: ({
      key
    }) =>
    _get('config/select', {
      key,
    }),
  /**
   * 查询预支付信息接口
   */
  preparePay: ({
      orderId
    }) =>
    _get('order/preparePay', {
      orderId,
    }),
  /**
   * 查询支付分下单成功接口
   */
  queryQayScore: (query_id, orderId) =>
    _post(`order/query/payScore?queryId=${query_id}&orderId=${orderId}`),
  /**
   * 提交站点注册接口
   */
  siteRegister: data => _post('site/register', data),
  payscoreStatus: data => _get('noob/payscore/status', data),
  /**
   * 关注公众号
   */
  mpFollow: data => _get('mp/follow', data),
  /**
   * 关注公众号2
   */
  mpFollow2: data => _put('mp/redPack/follow', data),
  /**
   * 省市
   */
  getPriceTemplate: data => _post('site/getPriceTemplate', data),
  /**
   * 申请站点激活
   */
  registerAndActiveSite: data => _post('site/registerAndActiveSite', data),
 /**
   * 站点激活列表
   */
  activeList: data => _post('site/active/list', data),
  /**
   * 查看站点激活明细
   */
  siteDetail: id => _post(`site/detail/${id}`),
  /**
   * 查看场景
   */
  getsiteTypeList: () => _post(`site/getsiteTypeList`),
  /**
   * 上传文件
   */
  uploadFile: url => {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '上传中...',
      });
      wx.uploadFile({
        url: API_BASE_URL + '/api/site/upload',
        filePath: url, // 要上传的文件路径
        name: 'file', // 后端接收文件的字段名
        header: {
          Authorization: 'Bearer ' + wx.getStorageSync('token'),
        },
        success: res => {
          const data = JSON.parse(res.data);
          console.log('data :>> ', data);
          const url = data.data;
          console.log('url :>> ', url);
          if (url) {
            resolve(url);
          } else {
            reject();
            wx.showToast({
              title: '上传失败，请重新上传',
              icon: 'none',
            });
          }
        },
        complete: () => {
          wx.hideLoading();
        },
      });
    });
  },
};