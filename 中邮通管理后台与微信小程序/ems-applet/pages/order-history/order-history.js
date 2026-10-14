// pages/order-history/order-history.js
import commonApi from '../../wxapi/api/common';
import { Express, getOrderStatusName } from '../../utils/map.js';
import { throttle, unique_obj_arr2 } from '../../utils/util.js';
// import JSEncrypt from '../../utils/jsencrypt.min.js';
// import { Base64 } from '../../utils/base64.min.js';
// // 定义公钥
// const publicKey =
//   'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3AiZSJ9dlvtssM+KIng6sz/zvIM8vUdopeoZh9JmIEXHvLI1XkkASUIOFXimacVL2ZBloLHcVNtfZyAdiJSrNaoO1k+8NsG1Lwm1QBz+vCyiC2eAjMPMKygs3PiigasSg+mMklYTn1N62n2OT9mSii2gAEaYWOxNYxtB3vFWc7QIDAQAB';
// // 创建JSEncrypt对象
// const encryptor = new JSEncrypt();

// function encryptByPublicKey(publicKeyText, text) {
//   // 设置公钥
//   encryptor.setPublicKey(publicKey);

//   // 执行加密操作
//   const encrypted = encryptor.encrypt(text);

//   // 返回加密结果
//   return encrypted;
// }

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Express,
    list: [],
    payList: [],
    active: 1,
    loading: false,
    loading2: false,
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    params2: {
      pageNum: 1,
      pageSize: 10,
      condition: 1,
    },
    isEnd2: false,
    refresherTriggered: true,
    refresherTriggered2: true,
    total: 0,
    total2: 0,
    lowerThreshold: 500,
    lowerThreshold2: 500,
    curTimes: null,
    show1: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const active = +options?.active;
    console.log('active :>> ', active);
    if (wx.utils.is('number', active)) {
      this.setData({ active });
    }
    // this.testPay();
  },
  onShow() {
    console.warn('onShow--------------------');
    this.init();
    this.init2();
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
  onClose1() {
    this.setData({
      show1: false,
    });
  },
  onTabChange(e) {
    console.log('e :>> ', e);
    const { index } = e.detail;
    this.setData({
      active: index,
    });
    console.log('index :>> ', index);
  },
  onOpen(e) {
    console.log('e :>> ', e);
    const index = e.detail;
    const activeNames = [index];
    this.setData({
      [`payList[${index}].activeNames`]: activeNames,
    });
  },
  onClose(e) {
    console.log('e :>> ', e);
    const index = e.detail;
    const activeNames = [];
    this.setData({
      [`payList[${index}].activeNames`]: activeNames,
    });
  },
  onOpen2(e) {
    console.log('e :>> ', e);
    const index = e.detail;
    const activeNames = [index];
    this.setData({
      [`list[${index}].activeNames`]: activeNames,
    });
  },
  onClose2(e) {
    console.log('e :>> ', e);
    const index = e.detail;
    const activeNames = [];
    this.setData({
      [`list[${index}].activeNames`]: activeNames,
    });
  },
  onSearch: throttle(function (e) {
    const val = e.detail;
    this.setData({
      active: 1,
    });
    console.log('this.data.active :>> ', this.data.active);
    this.init(val, true, true);
  }, 100),
  init(information = '', noPage = false, isSearch = false) {
    console.warn('init------');

    return new Promise((resolve, reject) => {
      let params = { information };
      console.log('noPage :>> ', noPage);
      console.log('isSearch :>> ', isSearch);
      // if (isSearch) {
      //   // 加密
      //   params.information = params.information.toString();
      //   console.log('params.information :>> ', params.information);
      //   // 调用加密函数
      //   const encryptedParams = encryptByPublicKey(publicKey, information);
      //   // 使用Base64编码加密结果
      //   // const encryptedParamsBase64 = Base64.encode(encryptedParams);
      //   // console.log('encryptedParamsBase64 :>> ', encryptedParamsBase64);
      //   params.information = encryptedParams;
      // }

      if (!noPage) {
        params = { ...params, ...this.data.params };
      }
      console.log('params :>> ', params);
      wx.showLoading({
        title: '加载中...',
      });
      commonApi
        .selectOrderList({ ...params })
        .then(res => {
          console.log('selectOrderList-res', res);
          const arr = (res?.data?.list || []).map(item => {
            let delivery = {};
            let orderInfo = {};
            try {
              delivery = JSON.parse(item.delivery);
              orderInfo = delivery?.orderInfo || {};
            } catch (error) {}

            const getAdress = _addr => {
              const addr = JSON.parse(_addr);
              const { province, city, district, town, detail } = addr;
              return province + city + district + town + detail;
            };

            return {
              ...item,
              activeNames: [],
              isOpen: false,
              recipientAddress: getAdress(item.recipientAddress),
              status: getOrderStatusName(
                item.orderStatus,
                item.logisiticsStatus
              ),
              courierName: orderInfo.courierName,
              courierPhone: orderInfo.courierPhone,
            };
          });
          console.log('arr.length :>> ', arr.length);
          console.error(
            'this.data.params.pageSize :>> ',
            this.data.params.pageSize
          );
          // if (
          //   (this.data.params.pageNum != 1 &&
          //     arr.length < this.data.params.pageSize) ||
          //   arr.length == 0
          // ) {
          //   this.setData({
          //     loading: false,
          //     isEnd: true,
          //   });
          //   if (!isSearch) {
          //     return wx.showToast({
          //       icon: 'none',
          //       title: '到底了~',
          //     });
          //   }
          // } else {
          //   this.setData({
          //     isEnd: false,
          //   });
          // }
          let list;
          if (!noPage) {
            const arr1 = [...this.data.list];
            const arr2 = [...arr];
            list = unique_obj_arr2(arr1, arr2, 'id');
            console.log('list :>> ', list);
          } else {
            list = arr;
          }
          console.error('list :>> ', list);

          this.setData({
            list,
            total: res?.data?.total || 0,
            loading: false,
          });
          resolve();
          console.log('arr :>> ', arr);
        })
        .catch(err => {
          reject();
        })
        .finally(() => {
          wx.hideLoading();
        });
    });
  },
  init2(information = '', noPage = false, isSearch = false) {
    console.warn('init2------');
    return new Promise((resolve, reject) => {
      let params = { information };
      console.log('noPage :>> ', noPage);
      if (!noPage) {
        params = { ...params, ...this.data.params2 };
      }
      console.log('params :>> ', params);
      wx.showLoading({
        title: '加载中...',
      });
      commonApi
        .selectOrderList(params)
        .then(res => {
          console.log('selectOrderList-res', res);
          const arr = res.data.list.map(item => {
            let delivery = {};
            let orderInfo = {};
            try {
              delivery = JSON.parse(item.delivery);
              orderInfo = delivery?.orderInfo || {};
            } catch (error) {}

            const getAdress = _addr => {
              const addr = JSON.parse(_addr);
              const { province, city, district, town, detail } = addr;
              return province + city + district + town + detail;
            };

            return {
              ...item,
              activeNames: [],
              isOpen: false,
              recipientAddress: getAdress(item.recipientAddress),
              status: getOrderStatusName(
                item.orderStatus,
                item.logisiticsStatus
              ),
              courierName: orderInfo.courierName,
              courierPhone: orderInfo.courierPhone,
            };
          });
          let payList;
          if (!noPage) {
            const arr1 = [...this.data.payList];
            const arr2 = [...arr];
            payList = unique_obj_arr2(arr1, arr2, 'id');
          } else {
            payList = arr;
          }
          console.log('noPage :>> ', noPage);
          console.error('payList :>> ', payList);
          this.setData({
            active: payList.length ? 0 : 1,
            payList,
            total2: res.data.total,
            loading2: false,
          });
          resolve();
          console.log('arr :>> ', arr);
        })
        .catch(err => {
          reject();
        })
        .finally(() => {
          wx.hideLoading();
        });
    });
  },
  refresherpulling() {
    console.log('refresherpulling---');
    this.setData({
      refresherTriggered: true,
    });
  },
  refresherpulling2() {
    console.log('refresherpulling2---');
    this.setData({
      refresherTriggered2: true,
    });
  },
  refresherrefresh() {
    console.log('refresherrefresh---');
    this.setData({
      list: [],
      params: {
        pageNum: 1,
        pageSize: this.data.params.pageSize,
      },
    });

    this.init('', '', true).then(() => {
      setTimeout(() => {
        this.setData({
          refresherTriggered: false,
        });
      }, 200);
    });
  },
  refresherrefresh2() {
    console.log('refresherrefresh2---');
    this.setData({
      payList: [],
      params2: {
        pageNum: 1,
        pageSize: this.data.params2.pageSize,
        condition: 1,
      },
    });

    this.init2('', '', true).then(() => {
      setTimeout(() => {
        this.setData({
          refresherTriggered2: false,
        });
      }, 200);
    });
  },
  loadMore() {
    console.log('loadMore----------');
    if (this.data.loading) {
      return;
    }

    const pageNum = this.data.params.pageNum;
    const totalPages = Math.ceil(this.data.total / this.data.params.pageSize);
    console.log('pageNum :>> ', pageNum);
    console.log('totalPages :>> ', totalPages);
    if (pageNum + 1 > totalPages) {
      return wx.showToast({
        icon: 'none',
        title: '到底了~',
      });
    }
    // if (this.data.isEnd) {
    //   return wx.showToast({
    //     icon: 'none',
    //     title: '到底了~',
    //   });
    // }
    this.setData({
      loading: true,
    });
    const num = +this.data.params.pageNum + 1;
    this.setData({
      'params.pageNum': num,
    });
    this.init();
  },
  loadMore2() {
    console.log('loadMore2----------');
    if (this.data.loading2) {
      return;
    }
    const pageNum = this.data.params2.pageNum;
    const totalPages = Math.ceil(this.data.total / this.data.params2.pageSize);
    console.log('pageNum :>> ', pageNum);
    console.log('totalPages :>> ', totalPages);
    if (pageNum + 1 > totalPages) {
      return wx.showToast({
        icon: 'none',
        title: '到底了~',
      });
    }
    this.setData({
      loading2: true,
    });
    const num = +this.data.params2.pageNum + 1;
    this.setData({
      'params2.pageNum': num,
    });
    this.init2();
  },
  bindscrolltolower() {
    console.log('bindscrolltolower------------');
    this.loadMore();
  },
  bindscrolltolower2() {
    console.log('bindscrolltolower2------------');
    this.loadMore2();
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
  toDetail(e) {
    const item = e.currentTarget.dataset.item;
    console.log('item :>> ', item);
    const { id } = item;
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?id=' + id,
    });
  },
  testPay() {
    const params = {
      nonceStr: '7OqAP1v5d2MpF3jhIsMZoKSv6bjZosfh',
      package: 'prepay_id=wx09080953126402a78592f92897a4360000',
      signType: 'RSA',
      paySign:
        'hG8itBLIlH69u6qNPaK98hiPbg7wwERamPtbyA7JvLgvFSUlkBf+9tqcDb8nHhP9elNcOHe/5pHDga4EEtfJSvtshFIIM2jKm6PtYI7GHz3MjiSNcvx/Kq1wth9044wp0lRYmQ8zGsaqn3fsXQEiz4RmqETwmbK5nTwiPT54nC7K5NBomtIzrKb4x0RXjo3uPy19FlLjE02Yyp5EnnkhuPCi9U0GRd3mfwvHtlBum/YJQvWowN/OxqXDNQL2r65irzb0rdi3bUrwp2BTjThzMWZApsWFWESoWasuMop607oO/k/4Dx51FGIEk/FunN8yyD1OaB8c36imV9lWOuaUqQ==',
      timeStamp: '1699488593',
    };

    const that = this;

    wx.requestPayment({
      ...params,
      success(res) {
        wx.showToast({
          title: '支付成功',
        });
        console.warn('初始化-------------------------------------------');
        that.init();
        that.init2();
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '用户已取消支付',
        });
        console.error(res);
      },
    });
  },
  toPay(e) {
    console.log('支付中。。。');
    const { id } = e.currentTarget.dataset.item;
    const that = this;

    if (id) {
      wx.showLoading({
        title: '加载中...',
      });
      commonApi
        .preparePay({
          orderId: id,
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
              that.setData({
                list: [],
                payList: [],
              });
              that.init();
              that.init2();
              wx.showToast({
                title: '支付成功',
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
        })
        .finally(() => {
          wx.hideLoading();
        });
    }
  },
  cancelOrderInfo(e) {
    const item = e.currentTarget.dataset.item;
    console.log('item :>> ', item);
    const { cpCode, id, waybillCode } = item;
    const that = this;

    wx.showLoading({
      title: '订单取消中...',
    });
    commonApi
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
          const currentPage = +this.data.params.pageNum;
          this.setData({
            params: {
              pageNum: 1,
              pageSize: currentPage * 10,
            },
          });
          that.init();
        }, 400);
      })
  },
  getDelivery(item) {
    return item;
  },
});
