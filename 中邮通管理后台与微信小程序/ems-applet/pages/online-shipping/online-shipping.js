import {
  checkTokenAndLogin
} from '../../utils/authUtils.js';
import user from '../../wxapi/api/user.js';
import {
  Express,
  Express0
} from '../../utils/map.js';
import numeral from 'numeral';
import commonApi from '../../wxapi/api/common.js';
import {
  requestSubscribeMessage,
  checkIsAuthPhone,
  scanCode,
} from '../../utils/util.js';
import {
  usePCS
} from '../../utils/PCS.js';
// import utils, { checkIsAuthPhone } from './utils/util';

const Citys = usePCS();
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    payTypes: ['微信支付分', '微信支付'],
    payType: [],
    isPayScore:null,
    showFollowAccount: true,
    outOrderNo: '',
    navHeight: app.globalData.navHeight, //导航栏高度
    navTop: app.globalData.navTop, //导航栏距顶部距离
    navObj: app.globalData.navObj, //胶囊的高度
    navObjWid: app.globalData.navObjWid, //胶囊宽度+距右距离
    lockInit: false,
    order: {
      name: '',
    },
    sender: {
      name: '',
      phone: '',
      address: '',
    },
    recipient: {
      name: '',
      phone: '',
      address: '',
    },
    goodsType: ['日用品', '食品', '文件', '衣服', '数码产品', '其他'],
    message: ['带纸箱', '带文件袋', '上门前电话'],
    expressComs: [],
    expressIndex: 0,
    radioProtocol: false,
    radio: false,
    show0: false,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    activeKey: 0,
    timeList: ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'],
    radio1: '1',
    radio2: '1',
    radio3: '1',
    textareaAValue: '',
    goodsValue: undefined,
    btnGroup1: undefined,
    btnGroup2: undefined,
    autosize: {
      maxHeight: 50,
      minHeight: 50,
    },
    confirmDialog: {
      sender: '李晓寒',
      senderPhone: 18624093606,
      senderAddress: '北京北京市朝阳区七圣中街16号院8号楼，北京大众汽车集团（中国）',
      reseiver: '高新雨',
      reseiverPhone: 18241720826,
      reseiverAddress: '浙江省杭州市余杭区文一西路96路',
      bookTime: '明天09:00-12：00(快递员电联为准)',
      message: '无',
    },
    showCapacity: false,
    orderDisabled: true,
    ecard: {
      express: '',
      doorTime: '',
      goodsType: '',
      selectedExpressIcon: '',
      weight: 1,
    },
    cpInfoList: [],
    chargeDetails: {
      firstWeight: '',
      continueWeight: '',
      continueWeightPer: '',
      firstPrice: '',
      totalPrice: '',
      subtractionResult: 0,
    },
    weight: 1,
    showInfoBar: false,
    payScoreSignInfo: {},
  },

  onShowPayTypes() {
    if (this.data.isStationMaster) {
      this.setData({
        showPayTypes: true,
      })
    }
  },
  onCancelPayTypes() {
    this.setData({
      showPayTypes: false,
    })
  },
  onConfirmPayTypes(e) {
    this.onCancelPayTypes()
    console.log('e', e)
    const v = e.detail.value
    console.log('v', v)
    let isPayScore
    if (v === '微信支付分') {
      isPayScore = true
    }
    if (v === '微信支付') {
      isPayScore = false
    }
    this.setData({
      isPayScore
    })
  },
  goMy() {
    wx.navigateTo({
      url: '/pages/my/my',
    });
  },
  getUrlParams(url) {
    let o = {};
    if (url.indexOf('?') != -1) {
      let str = url.substr(url.indexOf('?') + 1).replace(/[#/|/#/]/g, '');
      // console.log(str);
      let strs = str.split('&');
      // console.log(strs);
      for (let i = 0; i < strs.length; i++) {
        o[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
      }
    }
    return o;
  },
  handleContact(e) {
    console.log('handleContact-----------');
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc90bdfac12f8a61a5',
      },
      corpId: 'ww44c82758bf3587d6',
      success(res) {
        console.log('success-res :>> ', res);
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('Citys :>> ', Citys);
    console.warn('options :>> ', options);
    console.log('app :>> ', app);
    let uid, shareCode;
    // options.q='https://waybill-galaxy.cainiao.com/user/wechat/411033/?uid=867672069444493&shareCode=9551&userVerified=false'
    // 扫码进来的
    if (options.q) {
      this.setData({
        scene: 1,
      });
      let decodeScene = decodeURIComponent(options.q);
      let urlParams = this.getUrlParams(decodeScene);
      console.warn('urlParams :>> ', urlParams);
      uid = urlParams.uid;
      shareCode = urlParams.shareCode;
      console.log('uid :>> ', uid);
      console.log('shareCode :>> ', shareCode);
      this.setData({
        loaded: true,
        uid,
        shareCode,
      });
      this.getInit();
    } else if (options.uid && options.shareCode) {
      //再来一单
      this.setData({
        scene: 1,
      });
      uid = options.uid;
      shareCode = options.shareCode;
      console.log('uid :>> ', uid);
      console.log('shareCode :>> ', shareCode);
      this.setData({
        loaded: true,
        uid,
        shareCode,
      });
      this.getInit();
    } else {
      // 搜索点进来的
      this.setData({
        scene: 2,
        show6: true,
      });
      wx.showToast({
        icon: 'none',
        title: '请从微信扫码寄件',
        duration: 2000,
      });
    }
    app.$bus.on('onDelAddressData', ids => {
      console.log('ids :>> ', ids);
      const senderId = this.data.sender.id;
      const recipientId = this.data.recipient.id;

      console.log('senderId :>> ', senderId);
      if (ids.includes(senderId)) {
        this.setData({
          sender: {},
        });
      }
      console.log('recipientId :>> ', recipientId);
      if (ids.includes(recipientId)) {
        this.setData({
          recipient: {},
        });
      }
    });

    app.$bus.on('onAddressData', addressData => {
      console.log('addressData :>> ', addressData);
      const {
        type,
        name,
        phone,
        town,
        address
      } = addressData;
      console.log('type :>> ', type);
      if (type == 1) {
        console.log('寄件人地址');
        this.setData({
          sender: {
            ...addressData,
            name,
            phone,
            address: town != null ? town + address : address,
          },
        });
      }
      if (type == 2) {
        console.log('收件人地址');
        this.setData({
          recipient: {
            ...addressData,
            name,
            phone,
            address: town != null ? town + address : address,
          },
        });
      }

      setTimeout(() => {
        this.getCapacity();
      }, 100);
    });

    this.queryFollow();
  },
  polling1(orderId) {
    wx.showLoading({
      title: '加载中...',
    })
    return new Promise((resolve, reject) => {
      const index = setInterval(() => {
        wx.api.common
          .payscoreStatus({
            orderId,
          })
          .then(res => {
            console.log('polling1-res :>> ', res);
            if (res.code == 0 && res?.data?.status == 1) {
              clearInterval(index);
              wx.hideLoading();
              wx.navigateTo({
                url: '/pages/order-success-payScore/order-success-payScore?id=' +
                  orderId,
              });
              clearTimeout(this.data.Timeout10);
            } else if (res.code == 0 && res?.data?.status == 0) {
              clearInterval(index);
              clearTimeout(this.data.Timeout10);
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: res?.data?.reason || '下单失败',
                showCancel: false,
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
              });
            }
          })
          .catch(err => {
            clearInterval(index);
            console.error(err);
            reject(err);
            wx.hideLoading();
            wx.showModal({
              title: '下单异常',
              content: '请重新下单',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F',
            });
          });
      }, 750);
      const Timeout10 = setTimeout(() => {
        clearInterval(index);
        console.log('轮询超时10s，无响应');
        console.error('没有查询到订单，跳转订单列表');
        wx.navigateTo({
          url: '/pages/order-history/order-history',
        });
      }, 1000 * 10);
      this.setData({
        Timeout10,
      });
    });
  },
  queryFollow() {
    wx.api.common.mpFollow({}).then(res => {
      console.log('res :>> ', res);
      const {
        isFollow,
        userId
      } = res?.data || {};
      const showFollowAccount = !(userId && isFollow);
      this.setData({
        showFollowAccount,
      });
    });
  },
  websocketMessage(data) {
    console.warn('1------------------------websocketMessage');
    console.log('websocketMessage-data------', data);
    app.globalData.isOrderSuccess = false;
    wx.showToast({
      icon: 'none',
      title: data,
      duration: 3000,
    });
  },
  WXPayScore(res) {
    const that = this;
    const {
      outOrderNo: out_order_no,
      serviceId: service_id
    } = res.data;
    this.setData({
      // show5: false,
      payScoreSignInfo: {
        ...res.data.payScoreSignInfo,
        service_id,
        out_order_no,
      },
    });
    this.setData({
      outOrderNo: out_order_no,
    });
    if (wx.openBusinessView) {
      const {
        mch_id,
        package: p,
        timestamp,
        nonce_str,
        sign_type,
        sign,
        service_id,
        out_order_no,
      } = this.data.payScoreSignInfo;
      const extraData = {
        mch_id,
        package: p,
        timestamp,
        nonce_str,
        sign_type,
        sign,
        service_id,
        out_order_no,
      };
      console.log('extraData :>> ', extraData);
      wx.openBusinessView({
        businessType: 'wxpayScoreUse',
        extraData,
        success: async () => {
          //dosomething
          console.log('成功');
          app.globalData.orderId = out_order_no;
          that.polling1(out_order_no);
          // let interval;
          // const handleErr = (res, last) => {
          //   if (res.code == 500 || res.data.code == 500) {
          //     clearInterval(interval);
          //     console.error('没有查询到订单，跳转订单列表');
          //     wx.navigateTo({
          //       url: '/pages/order-history/order-history',
          //     });
          //   }
          // };
          // const query = last => {
          //   wx.api.common
          //     .selectOrder({ orderId: out_order_no, showAlert: false })
          //     .then(res => {
          //       console.log('轮询订单详情-res :>> ', res);
          //       const { waybillCode, orderStatus } = res?.data || {};
          //       // 成功
          //       if (waybillCode && ['0', '1'].includes(orderStatus)) {
          //         clearInterval(interval);
          //         wx.navigateTo({
          //           url:
          //             '/pages/order-success-payScore/order-success-payScore?id=' +
          //             out_order_no,
          //         });
          //       }
          //       // 失败
          //       if (waybillCode == null && orderStatus === '-1') {
          //         clearInterval(interval);
          //         wx.showToast({
          //           title: '订单创建失败，请重新下单！',
          //           icon: 'none',
          //           image: '',
          //           duration: 2000,
          //           mask: false,
          //         });
          //       }

          //       // 没有
          //       handleErr(res);
          //     })
          //     .catch(res => {
          //       handleErr(res);
          //       console.error('websocketError-res :>> ', res);
          //     });
          // };
          // query();
          // interval = setInterval(() => {
          //   query();
          // }, 750);
          // setTimeout(() => {
          //   clearInterval(interval);
          // }, 1000 * 10);
        },
        fail(e) {
          //dosomething
          console.error('openBusinessView--------', e);
        },
        complete(e) {
          console.log('openBusinessView--------', e);
          //dosomething
        },
      });
    } else {
      //引导用户升级微信版本
      console.log('升级微信');
    }
  },
  getCapacity() {
    console.log('getCapacity');
    const that = this;
    if (
      this.data.order.name &&
      this.data.sender.name &&
      this.data.recipient.name
    ) {
      const {
        sender,
        recipient
      } = this.data;
      wx.showLoading({
        title: '运力查询中...',
      });
      const params = {
        printerUid: this.data.uid,
        shareCode: this.data.shareCode,
        sender: {
          mobile: sender.phone,
          name: sender.name,
          address: {
            city: sender.city,
            province: sender.province,
            district: sender.area,
            town: '',
            detail: sender.address,
          },
        },
        recipient: {
          mobile: recipient.phone,
          name: recipient.name,
          address: {
            city: recipient.city,
            province: recipient.province,
            district: recipient.area,
            town: '',
            detail: recipient.address,
          },
        },
      };
      wx.api.common
        .capacity(params)
        .then(res => {
          const {
            cpInfoList
          } = res?.data || {};
          if (!cpInfoList?.length) {
            wx.showModal({
              title: '提示',
              content: '运力查询为空',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '点击重试',
              confirmColor: '#3CC51F',
              success: result => {
                if (result.confirm) {
                  this.getCapacity();
                }
              },
              fail: () => {},
              complete: () => {},
            });

            return;
          }
          this.setData({
            cpInfoList,
            showInfoBar: true,
          });

          let expressComs = [];

          try {
            expressComs = cpInfoList.map(item => {
              const continuePrice =
                item.priceInfo.continuePrice !== null ?
                numeral(item.priceInfo.continuePrice).divide(100).value() :
                null;
              const continueWeight =
                item.priceInfo.continueWeight !== null ?
                numeral(item.priceInfo.continueWeight).divide(1000).value() :
                null;
              const firstPrice =
                item.priceInfo.firstPrice !== null ?
                numeral(item.priceInfo.firstPrice).divide(100).value() :
                null;
              const firstWeight =
                item.priceInfo.firstWeight !== null ?
                numeral(item.priceInfo.firstWeight).divide(1000).value() :
                null;

              return {
                firstPrice,
                firstWeight,
                continuePrice,
                continueWeight,
                name: item.cpName || Express0[item.cpCode]?.name || item?.cpCode,
                icon: item.cpUrl ||
                  Express0[item.cpCode]?.img ||
                  Express0['POST']?.img,
                cpCode: item.cpCode,
                branchCode: item.branchCode,
                brandCode: item.brandCode,
              };
            });
          } catch (error) {
            console.error(error);
          }

          console.log('expressComs :>> ', expressComs);
          this.setData({
            expressComs,
          });

          if (expressComs.length >= 1) {
            this.setData({
              'ecard.express': expressComs[0].name,
              'ecard.selectedExpressIcon': expressComs[0].icon,
              chargeDetails: {
                ...this.data.chargeDetails,
                ...expressComs[0],
              },
            });
            this.onChangeStepper({
              detail: 1,
            });
            this.checkExpressComs();
            this.onClosePop0();
          }
        })
        .catch(e => {
          wx.hideToast();
          console.error('运力------', e);
          if (e?.errMsg === 'request:fail timeout') {
            wx.showModal({
              title: '提示',
              content: '运力查询超时',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '点击重试',
              confirmColor: '#3CC51F',
              success: result => {
                if (result.confirm) {
                  getCapacity();
                }
              },
              fail: () => {},
              complete: () => {},
            });
          } else {
            wx.showModal({
              title: '提示',
              content: e?.message || '运力查询超时',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '点击重试',
              confirmColor: '#3CC51F',
              success: result => {
                if (result.confirm) {
                  that.getCapacity();
                }
              },
              fail: () => {},
              complete: () => {},
            });
          }
        })
        .finally(() => {
          wx.hideLoading();
        });
    }
  },
  checkExpressComs() {
    function showModal(content, title) {
      wx.showModal({
        title: title || '运力查询失败',
        content,
        showCancel: false,
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
      });
    }
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    console.error('selectedExpress----------------- :>> ', selectedExpress);

    if (['', null, undefined].includes(selectedExpress.cpCode)) {
      return showModal('cpCode为空');
    }
    if (selectedExpress.firstPrice == null) {
      return showModal('首价为空！');
    }
    if (selectedExpress.firstWeight == null) {
      return showModal('首重为空！');
    }
    if (selectedExpress.continuePrice == null) {
      return showModal('续价为空！');
    }
    if (selectedExpress.continueWeight == null) {
      return showModal('续重为空！');
    }
  },
  queryCapacity() {
    console.log('queryCapacity------');
    console.log('this.data.ecard.express :>> ', this.data.ecard.express);
    if (!this.data.ecard.express) {
      this.getCapacity();
    }
  },
  getInit() {
    checkTokenAndLogin().then(value => {
      checkIsAuthPhone();
      this.init().then(defaultSenderAddress => {
        wx.setStorageSync('defaultSenderAddress', defaultSenderAddress);
        this.setData({
          'sender.address': defaultSenderAddress.detail,
        });
      });
    });
  },
  onShow() {
    // 监听打印机信息
    if (this.data.scene == 1 && !this.data.order.name) {
      this.getInit();
    }
  },
  scanCode2() {
    const that = this;
    wx.scanCode({
      success: function (res) {
        that.setData({
          lockInit: false,
        });
        console.log('res :>> ', res);
        var url = res.result;
        console.log('扫码结果：' + url);
        let decodeScene = decodeURIComponent(url);
        let urlParams = that.getUrlParams(decodeScene);
        let uid = urlParams.uid;
        let shareCode = urlParams.shareCode;
        that.setData({
          scene: 1,
          uid,
          shareCode,
        });
        that.init().then(defaultSenderAddress => {
          wx.setStorageSync('defaultSenderAddress', defaultSenderAddress);
          that.setData({
            'sender.address': defaultSenderAddress.stationName,
            show6: false,
          });
        });
        // wx.reLaunch({
        //   url:
        //     '/pages/online-shipping/online-shipping' +
        //     `?uid=${uid}&shareCode=${shareCode}`,
        // });

        // 在这里可以对扫码结果进行处理
      },
      fail: function (res) {
        console.log('扫码失败');
        wx.showToast({
          icon: 'none',
          title: '扫码取消',
        });
        // 处理扫码失败的情况
      },
    });
  },
  onAgree(e) {
    wx.navigateTo({
      url: `/pages/bubble-counting-standard/bubble-counting-standard`,
    });
    // const { key } = e.currentTarget.dataset;
    // wx.showLoading({
    //   title: '加载中...',
    // });
    // commonApi
    //   .protocolH5({
    //     key,
    //   })
    //   .then(res => {
    //     const data = res.data;
    //     console.log('data :>> ', data);
    //     if (data) {
    //       wx.navigateTo({
    //         url: `/pages/webview/webview?url=${data}&title=${key}`,
    //       });
    //     }
    //   })
    //   .finally(() => {
    //     wx.hideLoading();
    //   });
  },
  async onClickSender() {
    console.log('this.data.sender :>> ', this.data.sender);
    if (this.data.sender.id) {
      wx.navigateTo({
        url: '/pages/new-address/new-address?type=1&edit=1&id=' +
          this.data.sender.id,
      });
    } else if (this.data.order.name && this.data.sender.address) {
      //说明刚扫码进来
      if (this.data.sender.name) {
        app.globalData.editUnsaveAddr = this.data.sender;
        wx.navigateTo({
          url: '/pages/new-address/new-address?type=1&editUnsaveAddr=1',
        });
      } else {
        wx.navigateTo({
          url: '/pages/new-address/new-address?type=1&addrDefault=' +
            this.data.sender.address,
        });
      }
    } else {
      await this.checkPrinter();
      // 跳转到新建地址
      wx.navigateTo({
        url: '/pages/new-address/new-address?type=1',
        success: () => {
          if (this.data.sender.name) {
            app.$bus.emit('editUnsaveAddr', this.data.recipient);
          }
        },
      });
    }
  },
  async onClickRecipient() {
    console.log('onClickRecipient----');
    if (this.data.recipient.id) {
      wx.navigateTo({
        url: '/pages/new-address/new-address?type=2&edit=1&id=' +
          this.data.recipient.id,
      });
    } else {
      await this.checkPrinter();
      // 跳转到新建地址
      console.log('this.data.recipient :>> ', this.data.recipient);
      console.log('this.data.recipient.name :>> ', this.data.recipient.name);

      if (this.data.recipient.name) {
        app.globalData.editUnsaveAddr = this.data.recipient;
        wx.navigateTo({
          url: '/pages/new-address/new-address?type=2&editUnsaveAddr=1',
        });
      } else {
        wx.navigateTo({
          url: '/pages/new-address/new-address?type=2',
        });
      }
    }
  },
  toOrderList() {
    wx.navigateTo({
      url: '/pages/order-history/order-history',
    });
  },
  async confirmOrder() {
    wx.showLoading({
      title: '校验中...',
    });
    // 1.查询打印机是否在线
    // await this.selectPrinter(true);  由于显示付款方式原因，暂不查询打印机。没必要

    // 2.先校验必填参数

    const {
      sender,
      recipient
    } = this.data;
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    const itemType = this.data.goodsType[this.data.btnGroup1];

    const showToast = title => {
      wx.showToast({
        icon: 'none',
        title,
      });
    };
    if (!sender.name) {
      return showToast('请完善寄件人信息');
    }
    if (!recipient.name) {
      return showToast('请完善收件人信息');
    }
    if (!selectedExpress.cpCode) {
      return showToast('请选择快递公司');
    }
    if (!this.data.weight) {
      return showToast('请输入物品重量');
    }
    if (!itemType) {
      return showToast('请选择物品类型');
    }

    console.log('this.data.weight :>> ', this.data.weight);

    // 3.再校验手机号

    let phone = wx.getStorageSync('phoneCode');
    console.error('phone-------------- :>> ', phone);
    if (!phone) {
      const userInfo = await wx.api.user.getUserInfo();
      const phone2 = userInfo?.data?.mobile;
      console.error('phone2-------------- :>> ', phone2);
      if (phone2) {
        wx.setStorageSync('phoneCode', phone2);
        return this.submitOrder();
      }
      wx.hideLoading();
      return wx.showModal({
        title: '请授权手机号',
        content: '为了验证您的身份信息，需要授权您的手机号,点击跳转授权页面',
        showCancel: true,
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            });
          } else {
            wx.hideLoading();
          }
        },
        fail: () => {},
        complete: () => {},
      });
    } else {
      this.submitOrder();
    }
  },
  async submitOrder() {
    wx.showLoading({
      title: '下单中...',
    });
    // 3.校验通知权限
    // try {
    const res = wx.getSystemInfoSync();
    console.log('res :>> ', res);
    console.log('res.platform :>> ', res.platform);
    if (res.platform === 'devtools') {
      // 当前在微信开发者工具环境
      console.log('在微信开发者工具环境中');
    } else {
      // 当前在真实设备环境
      console.log('在真实设备环境中');
      await requestSubscribeMessage();
    }
    // } catch (e) {
    //   // 处理获取系统信息失败的情况
    //   console.error('获取系统信息失败', e);
    // }
    const {
      sender,
      recipient
    } = this.data;
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    const itemType = this.data.goodsType[this.data.btnGroup1];
    const remark = this.data.textareaAValue;

    const province = sender.province;
    const city = sender.city;
    const predictPrice = this.data.chargeDetails.totalPrice;
    console.log('predictPrice :>> ', predictPrice);
    if ([0, null].includes(predictPrice)) {
      return wx.showToast({
        title: '预估价格为空！',
        icon: 'none',
        duration: 3000,
      });
    }

    const p = {
      payType: this.data.isPayScore ? 1 : 0,
      predictPrice: this.data.chargeDetails.totalPrice,
      userIdentifier: this.data.shareCode,
      userIdentifierType: 1,
      printerId: this.data.uid,
      province,
      city,
      cpConfig: {
        cpCode: selectedExpress.cpCode,
        branchCode: selectedExpress.branchCode,
        brandCode: selectedExpress.brandCode,
      },
      tradeOrderInfoDto: {
        logisticsServices: '',
        orderInfo: {
          orderChannelsType: selectedExpress.cpCode,
        },
        packageInfo: {
          volume: null,
          weight: +this.data.weight,
          items: [{
            count: 1,
            name: itemType,
          }, ],
        },
        recipient: {
          name: recipient.name,
          mobile: recipient.phone,
          address: {
            city: recipient.city,
            province: recipient.province,
            district: recipient.area,
            town: '',
            detail: recipient.address,
          },
        },
        customerTemplateDto: {
          customerTemplateUrl: 'http://cloudprint.cainiao.com/template/standard/529150/4',
          data: JSON.stringify({
            itemType,
            remark: remark || '',
          }),
        },
      },
      sender: {
        name: sender.name,
        mobile: sender.phone,
        address: {
          city: sender.city,
          province: sender.province,
          district: sender.area,
          town: '',
          detail: sender.address,
        },
        reaNameDto: {},
      },
    };

    console.log('p :>> ', p);
    commonApi
      .addOrder(p)
      .then(res => {
        console.log('addOrder-res :>> ', res);
        const orderId = res.data?.data;

        if (this.data.isPayScore) {
          this.WXPayScore(res);
        } else {
          wx.hideLoading();
          if (!res.code) {
            wx.navigateTo({
              url: '/pages/order-success/order-success?id=' + orderId,
            });
          }
        }
      })
      .catch(err => {
        console.error(err);
        wx.hideLoading();
        if (err.message) {
          wx.showModal({
            title: '提示',
            content: err.message,
            showCancel: false,
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
          });
        }
      });
  },
  init() {
    const lockInit = this.data.lockInit;
    const that = this;
    return new Promise(async (resolve, reject) => {
      if (lockInit) {
        console.warn('init请求中，不允许重复登录');
        return;
      }
      wx.showLoading({
        title: '加载中...',
      });
      that.setData({
        lockInit: true,
      });
      //   .then(async res => {
      console.error('2---------------------------------');
      try {
        const addr = await this.selectPrinter();
        console.error('5---------------------------------');
        resolve(addr);
        that.setData({
          lockInit: false,
        });
      } catch (error) {
        console.error(error);
        that.setData({
          lockInit: false,
        });
      }
      // })
      // .catch(e => {
      //   console.error(e);
      //   that.setData({
      //     lockInit: false,
      //   });
      // });
    });
  },
  showPrinterOffline() {
    wx.showModal({
      title: '提示',
      content: '打印机离线，请开启打印机重新下单',
      showCancel: true,
      cancelText: '去扫码',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: result => {
        if (result.cancel) {
          scanCode();
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  showPrinterEmpty(errorMsg) {
    wx.showModal({
      title: '提示',
      content: errorMsg || '查询不到打印设备，请重新扫码',
      showCancel: true,
      cancelText: '确定',
      cancelColor: '#000000',
      confirmText: '去扫码',
      confirmColor: '#3CC51F',
      success: result => {
        if (result.confirm) {
          scanCode();
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  checkPrinter() {
    return new Promise((resolve, reject) => {
      if (!this.data.uid || !this.data.shareCode) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '打印机信息为空',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '去扫码',
          confirmColor: '#3CC51F',
          success: result => {
            if (result.confirm) {
              scanCode();
            }
          },
          fail: () => {},
          complete: () => {},
        });

        console.warn('打印机信息为空，停止查询');
        return reject();
      }

      resolve();
    });
  },
  selectPrinter(noHideLoading) {
    return new Promise((resolve, reject) => {
      // 打印机信息为空，停止查询
      console.log('this.data.uid :>> ', this.data.uid);
      console.log('this.data.shareCode :>> ', this.data.shareCode);
      if (!this.data.uid || !this.data.shareCode) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '打印机信息为空，停止查询',
        // });
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '打印机信息为空',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '去扫码',
          confirmColor: '#3CC51F',
          success: result => {
            if (result.confirm) {
              scanCode();
            }
          },
          fail: () => {},
          complete: () => {},
        });

        console.warn('打印机信息为空，停止查询');
        return reject();
      }

      console.error('3---------------------------------');
      // 请求打印机接口
      function isString(value) {
        return typeof value === 'string';
      }
      wx.api.common
        .printer({
          stationId: this.data.uid,
          verCode: this.data.shareCode,
        })
        .then(res => {
          console.log('res :>> ', res);
          console.error('4---------------------------------');
          const data = res.data;
          let {
            payType,isPayScore
          } = data;
          // payType=undefined
          this.setData({
            payType,
            isPayScore
          })
          if(payType?.length){
            // 走新逻辑
            if (payType.length == 2) {
              this.setData({
                isStationMaster: true,
              })
            }
            if (payType.includes(0)) {
              this.setData({
                isPayScore: true
              })
            }
          }else{
            // 走旧逻辑
            this.setData({
              isPayScore
            })
          }
         
          const errorMsg = isString(res.data) ? res.data : res?.data?.errorMsg;
          const stationInfo = res?.data?.stationInfo;
          console.log('errorMsg :>> ', errorMsg);
          console.warn('stationInfo :>> ', stationInfo);
          if (errorMsg) {
            return this.showPrinterEmpty(errorMsg);
          } else if (errorMsg === undefined) {
            this.showPrinterEmpty();
            return reject();
          }

          const printerIsOnline = ['0', null].includes(
            stationInfo?.printerStatus
          );
          if (!printerIsOnline) {
            wx.showToast({
              icon: 'none',
              title: '打印机已离线',
              duration: 2000,
            });
          }
          // if (!printerIsOnline) {
          //   this.showPrinterOffline();
          //   reject();
          // } else {
          const addr = stationInfo.stationName || '';
          let defaultSenderAddress = {};
          if (stationInfo.defaultSenderAddress) {
            defaultSenderAddress = JSON.parse(
              JSON.stringify(stationInfo.defaultSenderAddress)
            );
            defaultSenderAddress.stationName = addr;
          }

          this.setData({
            'order.name': addr,
          });
          resolve(defaultSenderAddress);
          // }
        })
        .catch(e => {
          console.error(e);
          if (e?.errMsg === 'request:fail timeout') {
            wx.showModal({
              title: '提示',
              content: '打印机查询超时',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '去扫码',
              confirmColor: '#3CC51F',
              success: result => {
                if (result.confirm) {
                  scanCode();
                }
              },
              fail: () => {},
              complete: () => {},
            });
          }
        })
        .finally(value => {
          if (!noHideLoading) {
            wx.hideLoading();
          }
        });
    });
  },

  async goAddressBook(e) {
    const type = e.currentTarget.dataset.type;
    console.log('type', type);
    // 检查打印机
    await this.checkPrinter();
    wx.navigateTo({
      url: `/pages/address-book/address-book?type=${type}&emitType=1`,
    });
  },

  saveImageToPhotosAlbum(e) {
    const img = e.currentTarget.dataset.img;
    console.log('img :>> ', img);
    wx.showLoading({
      title: '保存中...',
    });

    const showFail = () => {
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000,
      });
      wx.hideLoading();
    };
    wx.downloadFile({
      url: img, // 替换为您的图片 URL
      success: function (res) {
        if (res.statusCode === 200) {
          var tempFilePath = res.tempFilePath;
          // tempFilePath 为下载后的临时文件路径
          // 接下来可以保存到相册或进行其他操作
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath, // 下载后的临时文件路径
            success: function (res) {
              console.log('保存成功', res);
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000,
              });
            },
            fail: function (error) {
              console.log('保存失败', error);
              showFail();
            },
          });
        } else {
          console.error('下载失败', res);
          showFail();
        }
      },
      fail: function (error) {
        console.error('下载失败', error);
        showFail();
      },
    });
  },

  toProhibitedItem() {
    wx.navigateTo({
      url: `/pages/prohibited-item/prohibited-item`,
    });

    // wx.showLoading({
    //   title: '加载中...',
    // });
    // commonApi
    //   .protocolH5({
    //     key: '禁寄物品',
    //   })
    //   .then(res => {
    //     const data = res.data;
    //     console.log('data :>> ', data);
    //     if (data) {
    //       wx.navigateTo({
    //         url: `/pages/webview/webview?url=${data}&title=禁寄物品`,
    //       });
    //     }
    //   })
    //   .finally(() => {
    //     wx.hideLoading();
    //   });
  },

  toServiceAgreement() {
    wx.navigateTo({
      url: `/pages/service-agreement/service-agreement`,
    });

    // commonApi
    //   .protocolH5({
    //     key: '下单服务协议',
    //   })
    //   .then(res => {
    //     const data = res.data;
    //     console.log('data :>> ', data);
    //     if (data) {
    //       wx.navigateTo({
    //         url: `/pages/webview/webview?url=${data}&title=下单服务协议`,
    //       });
    //     }
    //   })
    //   .finally(() => {
    //     wx.hideLoading();
    //   });
  },

  getPhoneNumber(e) {
    console.log('e :>> ', e);
    console.log('e.detail.code :>> ', e.detail.code);
    user
      .phoneCode({
        phoneCode: e.detail.code,
      })
      .then(res => {
        console.log('res :>> ', res);
      });
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: res => {
        console.log(res);
      },
    });
  },

  onBtnGroup1Click(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      btnGroup1: index,
    });
  },
  onBtnGroup2Click(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      btnGroup2: index,
    });
    const txt = this.data.message[index];
    this.setData({
      textareaAValue: txt,
    });
  },

  getTotalPrice(weight) {
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    const {
      firstWeight,
      continueWeight,
      continuePrice
    } = selectedExpress;
    if (weight < selectedExpress.firstWeight) {
      return selectedExpress.firstPrice;
    } else {
      const continueWeightActual = Number(weight) - Number(firstWeight);
      console.log('continueWeightActual :>> ', continueWeightActual);
      console.log('continueWeight :>> ', continueWeight);
      // 向上取整
      const continueWeightPer = Math.ceil(
        numeral(continueWeightActual).divide(continueWeight).value()
      );
      let total =
        Number(selectedExpress.firstPrice) + continueWeightPer * continuePrice;
      total = parseFloat(total.toFixed(2));

      console.log('total :>> ', total);

      return total;
    }
  },

  onChangeStepper(e) {
    console.log('e :>> ', e);
    const weight = e.detail;
    console.log('weight :>> ', weight);
    this.setData({
      weight,
    });
    console.log('this.data.weight :>> ', this.data.weight);
  },

  onClickPop2Btn() {
    const target = this.data.goodsType[this.data.btnGroup1];
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    if (!selectedExpress) {
      return wx.showToast({
        icon: 'none',
        title: '请先选择快递公司',
        duration: 2000,
      });
    }
    const {
      firstWeight,
      firstPrice,
      continuePrice,
      continueWeight
    } =
    selectedExpress;
    // const weight = Math.ceil(this.data.weight);
    const weight = this.data.weight;

    const totalPrice = this.getTotalPrice(weight);
    console.log('totalPrice :>> ', totalPrice);

    function preciseSubtraction(a, b) {
      return Number((a - b).toFixed(10)); // 保留10位小数
    }
    const subtractionResult = preciseSubtraction(totalPrice, firstPrice);
    console.log('totalPrice :>> ', totalPrice);
    console.log('firstPrice :>> ', firstPrice);
    console.log('subtractionResult :>> ', subtractionResult);
    const chargeDetails = {
      firstWeight,
      firstPrice,
      continuePrice,
      continueWeight,
      totalPrice,
      subtractionResult,
    };

    console.log('chargeDetails :>> ', chargeDetails);
    this.setData({
      'ecard.weight': weight,
      'ecard.goodsType': target,
      chargeDetails,
    });

    this.onClosePop2();
  },

  onClickProtocol(e) {
    const radioProtocol = !this.data.radioProtocol;
    console.log('radioProtocol :>> ', radioProtocol);
    this.setData({
      radioProtocol,
    });
    this.setData({
      orderDisabled: !radioProtocol,
    });
  },

  updateGoodsValue(event) {
    this.setData({
      goodsValue: event.detail,
    });
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value,
    });
  },

  onClosePop0(e) {
    const target = this.data.goodsType[this.data.btnGroup1];
    const selectedExpress = this.data.expressComs[this.data.expressIndex];
    const {
      firstWeight,
      firstPrice,
      continueWeightPer
    } = selectedExpress;
    const weight = this.data.weight;
    const totalPrice = this.getTotalPrice(weight);
    console.log('totalPrice :>> ', totalPrice);
    this.setData({
      'ecard.weight': weight,
      'ecard.goodsType': target,
      // 'ecard.express': this.data.expressName,
      // 'ecard.selectedExpressIcon': this.data.selectedExpressIcon,
      show0: false,
      chargeDetails: {
        ...selectedExpress,
        firstWeight,
        firstPrice,
        continueWeightPer,
        totalPrice,
      },
    });
  },
  onClosePop1(e) {
    this.setData({
      show1: false,
    });
  },
  onClosePop2(e) {
    this.setData({
      show2: false,
    });
  },
  onClosePop3(e) {
    this.setData({
      show3: false,
    });
  },
  onClosePop4(e) {
    this.setData({
      show4: false,
    });
  },
  onClose5(e) {
    this.setData({
      show5: false,
    });
  },
  onClose6(e) {
    this.setData({
      show6: false,
    });
  },
  onChange1(event) {
    console.log('onChange1');
    this.setData({
      radio1: event.detail,
      radio2: 0,
      radio3: 0,
    });
    this.onClosePop1();
  },
  onChange2(event) {
    console.log('onChange2');
    this.setData({
      radio2: event.detail,
      radio1: 0,
      radio3: 0,
    });
    this.onClosePop1();
  },
  onChange3(event) {
    console.log('onChange3');
    this.setData({
      radio3: event.detail,
      radio1: 0,
      radio2: 0,
    });
    this.onClosePop1();
  },

  onChange0(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick0(event) {
    const name = event.currentTarget.dataset.name;
    console.log('name :>> ', name);
    this.setData({
      expressIndex: name,
    });
    const target = this.data.expressComs[name];
    const expressName = Express0[target.cpCode].name;
    const selectedExpressIcon = Express0[target.cpCode].img;
    console.log('expressName :>> ', expressName);
    // this.setData({ expressName, selectedExpressIcon });
    this.setData({
      'ecard.express': expressName,
      'ecard.selectedExpressIcon': selectedExpressIcon,
    });
    this.onChangeStepper({
      detail: 1,
    });

    this.checkExpressComs();
  },

  onClick1(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio1: name,
    });
  },

  onClick2(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio2: name,
    });
  },

  onClick3(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio3: name,
    });
  },

  onChangeRadioDay0(e) {
    console.log('e :>> ', e);
  },

  expressComsChange(e) {
    this.setData({
      expressComs_index: +e.detail.value,
    });
  },

  onClickShow0() {
    this.checkSenderRecipient('show0');
  },
  onClickShow1() {
    this.setData({
      show1: true,
    });
  },
  checkSenderRecipient(show) {
    console.log('this.data.sender :>> ', this.data.sender);
    if (!this.data.sender.name) {
      return wx.showToast({
        icon: 'none',
        title: '请完善寄件人信息',
      });
    } else if (!this.data.recipient.name) {
      return wx.showToast({
        icon: 'none',
        title: '请完善收件人信息',
      });
    } else {
      this.setData({
        [show]: true,
      });
    }
  },
  onClickShow2() {
    this.checkSenderRecipient('show2');
    // if (!this.data.sender.name) {
    //   return wx.showToast({
    //     title: '请完善寄件人信息',
    //   });
    // } else if (!this.data.recipient.name) {
    //   return wx.showToast({
    //     title: '请完善收件人信息',
    //   });
    // } else {
    //   this.setData({
    //     show2: true,
    //   });
    // }
  },
  onClickShow3() {
    this.setData({
      show3: true,
    });
  },
  onClickShow4() {
    this.setData({
      show4: true,
    });
  },
  onChange(event) {
    const index = event.detail;
    console.log('index :>> ', index);
    this.setData({
      activeKey: index,
    });
    // Notify({ type: 'primary', message: event.detail });
  },
  onTextareaAValueChange(e) {
    const val = e.detail;
    if (val.toString().length > 1000) {
      return wx.showToast({
        icon: 'none',
        title: '备注过长',
      });
    }
  },
  closeFollowAccount() {
    this.setData({
      showFollowAccount: false,
    });
  },
  goFollow() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://mp.weixin.qq.com/s/SZYEd_SyfNtC1pdDiH3cWg',
    });
  },
  async toMy() {
    // 判断是否是新用户
    const isNewUser = await app.isNewUser();
    console.log('isNewUser :>> ', isNewUser);
    if (isNewUser) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    } else {
      wx.navigateTo({
        url: '/pages/my/my',
      });
    }
  },
  onShareAppMessage() {},
  onShareTimeline() {},
});