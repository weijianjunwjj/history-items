import { maskPhoneNumber } from '../../utils/util.js';

const app = getApp();

// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    appId: 'wx8abaf00ee8c3202e',
    user: {
      phone: '',
      curTime: null,
    },
    extraData: {
      // 把1221数字换成你的产品ID，否则会跳到别的产品
      id: '622266',
      // 自定义参数，具体参考文档
      customData: {
        clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
      },
    },
    isStationMaster: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let phoneCode = wx.getStorageSync('phoneCode');
    if (phoneCode) {
      phoneCode = maskPhoneNumber(phoneCode);
    } else {
      phoneCode = '****' || '点击授权手机号';
    }
    this.setData({
      'user.phone': phoneCode,
    });
    // const isStationMaster = await app.isStationMaster();
    // console.log('isStationMaster :>> ', isStationMaster);
    // this.setData({
    //   isStationMaster
    // })
  },
  async onShow() {
    const isStationMaster = await app.isStationMaster();
    console.log('isStationMaster :>> ', isStationMaster);
    this.setData({
      isStationMaster,
    });
  },

  closeShow1() {
    this.setData({
      show1: false,
    });
  },
  openShow1() {
    this.setData({
      show1: true,
    });
  },

  toAllOrder() {
    wx.navigateTo({
      url: '/pages/order-history/order-history',
    });
  },
  toAddress() {
    wx.navigateTo({
      url: '/pages/address-book/address-book?type=1&selectNoJump=1',
    });
  },
  toMyStation() {
    wx.navigateTo({
      url: '/station/pages/home/home',
    });
  },
  // async toMyStation() {
  //   // 判断是否是新用户
  //   const isNewUser = await app.isNewUser();
  //   console.log('isNewUser :>> ', isNewUser);
  //   if (isNewUser) {
  //     wx.navigateTo({
  //       url: '/pages/login/login',
  //     });
  //   } else {
  //     wx.navigateTo({
  //       url: '/station/pages/home/home',
  //     });
  //   }
  // },
  toApplyStation() {
    wx.navigateTo({
      url: '/pages/station-master/station-master',
    });
  },
  toActiveRecord() {
    wx.navigateTo({
      url: '/pages/active-history/active-history',
    });
  },
  feedback() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e', // 目标为兔小巢社区小程序AppID(固定)
      extraData: {
        // 需要传递的参数
        id: '622266', // 把1221数字换成你的产品ID，否则会不成功
        customData: {
          clientInfo: ' iPhone OS 10.3.1 / 3.2.0.43 / 0 ',
        },
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
