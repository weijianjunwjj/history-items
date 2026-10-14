import commonApi from '../../wxapi/api/common.js';
import { getOrderStatusName, Express } from '../../utils/map.js';
import { debounce, scanCode, isPaid } from '../../utils/util.js';
import { checkTokenAndLogin } from '../../utils/authUtils.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: {
      status: '',
    },
    axis: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.warn('options :>> ', options);
    const { id, pay } = options;
    console.log('id :>> ', id);
    if (id != 'undefined') {
      checkTokenAndLogin().then(() => {
        this.init(id, pay);
      });
    }
  },
  scanCode,
  isPaid,
  cancelOrderInfo() {
    const item = this.data.order;
    console.log('item :>> ', item);
    const { cpCode, id, waybillCode } = item;
    const that = this;

    wx.showLoading({
      title: '订单取消中...',
    });
    wx.api.common
      .cancelOrderInfo({
        cpCode,
        orderId: id,
        waybillCode,
      })
      .then(res => {
        wx.showToast({
          title: '订单已取消',
        });
        setTimeout(() => {
          that.init(id);
        }, 400);
      })
      .finally(() => {
        wx.hideLoading();
      });
  },
  onClose1() {
    this.setData({
      show1: false,
    });
  },
  showDialog(e) {
    const { payAt } = e.currentTarget.dataset.item;
    console.log('payAt :>> ', payAt);
    if (payAt) {
      // 给定的日期字符串
      var dateString = payAt;
      // 创建一个新的Date对象
      var date = new Date(dateString);
      // 获取月、日和时间
      var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始计数的，所以要加1
      var day = date.getDate().toString().padStart(2, '0');
      var hours = date.getHours().toString().padStart(2, '0');
      var minutes = date.getMinutes().toString().padStart(2, '0');
      // 格式化成所需的格式
      var formattedDate = month + '月' + day + '日' + hours + ':' + minutes;
      this.setData({
        curTimes: formattedDate,
        show1: true,
      });
    }
  },
  init(id, pay) {
    wx.showLoading({
      title: '加载中...',
    });
    commonApi
      .selectOrder({
        orderId: id,
      })
      .then(res => {
        console.log('selectOrder-res :>> ', res);
        const data = res.data;
        let delivery = {};
        let recipientAddress = {};
        let pcr = '';
        let orderInfo = {};
        try {
          delivery = JSON.parse(data.delivery);
          recipientAddress = JSON.parse(data.recipientAddress);
          const { city, district, town, detail } = recipientAddress;
          pcr = city + district + town + detail;
          orderInfo = delivery?.orderInfo || {};
        } catch (error) {}

        const getAdress = _addr => {
          const addr = JSON.parse(_addr);
          const { province, city, district, town, detail } = addr;
          return province + city + district + town + detail;
        };

        const order = {
          ...data,
          recipientAddress,
          pcr,
          express: Express[data.cpCode],
          isPaid: isPaid(data.settleStatus),
          status: getOrderStatusName(data.orderStatus, data.logisiticsStatus),
          recipientAddress: getAdress(data.recipientAddress),
          orderInfo,
          itemType: data.packageInfoDto.items[0].name,
        };

        var isPay = function (order) {
          return (
            order.settleStatus == 1 ||
            order.settleStatus == 3 ||
            order.settleStatus == 5
          );
        };
        var isPrepay = function (order) {
          return order.prepayResponse && order.settleStatus === 0;
        };
        if (isPrepay(order) && !isPay(order)) {
          order.status = '';
        }

        this.setData({
          order,
        });
        if (id && pay) {
          this.pay(id);
        }
      })
      .catch(err => {
        console.error('selectOrder-err------', err);
      })
      .finally(() => {
        wx.hideLoading();
      });
  },

  onPay: debounce(function (e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.pay(id);
    }
  }, 300),

  pay(orderId) {
    if (!orderId) {
      return;
    }
    const that = this;
    commonApi
      .preparePay({
        orderId,
      })
      .then(res => {
        console.log('res :>> ', res);
        const data = JSON.parse(res.data);
        console.log('data :>> ', data);
        const { nonceStr, packageVal, paySign, signType, timeStamp } = data;

        const params = {
          timeStamp,
          nonceStr,
          package: packageVal,
          signType,
          paySign,
        };

        wx.requestPayment({
          ...params,
          success(res) {
            wx.showToast({
              title: '支付成功',
            });
            that.init(that.data.order.id);
            console.log('支付成功--------------');

            let params = {
              information: '',
              pageNum: 1,
              pageSize: 10,
              condition: 1,
            };
            console.log('params :>> ', params);

            commonApi.selectOrderList(params).then(res => {
              console.log('selectOrderList-res', res);
              const list = res.data.list;
              console.log('list :>> ', list);
              if (list.length) {
                // setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/order-history/order-history?active=1',
                });
                // }, 1000);
              }
            });
          },
          fail(res) {
            wx.showToast({
              icon: 'none',
              title: '用户已取消支付',
            });
            console.error(res);
          },
        });
      });
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.orderInfo.courierPhone,
    });
  },

  copyC(e) {
    const data = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data,
      success() {
        console.log('设置粘贴板成功');
      },
    });
  },
});
