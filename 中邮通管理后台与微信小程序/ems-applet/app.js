// app.js
import $bus from './utils/Event';
import utils, { checkIsAuthPhone } from './utils/util';
import api from './wxapi/api.js';
App({
  onLaunch() {
    wx.api = api;
    wx.utils = utils;
    wx.globalData = this.globalData;
    this.globalData.hasShownModal = false;
    wx.getSrc = path => {
      return `https://zyt-network.oss-cn-qingdao.aliyuncs.com/images` + path;
    };

    this.calcNavBarInfo();

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 当检查到新版本时，res.hasUpdate 会是 true
      if (res.hasUpdate) {
        console.log('检测到新版本');
      }
    });

    updateManager.onUpdateReady(function () {
      // 当新版本下载完成时，会触发这个事件
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 用户点击确定，小程序将重启并应用更新
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败时触发
      wx.showModal({
        title: '更新失败',
        content: '新版本下载失败，请检查网络设置并重试',
      });
    });
  },
  /**
   * @description 计算导航栏信息
   */
  calcNavBarInfo() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        //导航高度
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          navObjWid =
            res.windowWidth - menuButtonObject.right + menuButtonObject.width, // 胶囊按钮与右侧的距离 = windowWidth - right+胶囊宽度
          navHeight =
            statusBarHeight +
            menuButtonObject.height +
            (menuButtonObject.top - statusBarHeight) * 2;
        this.globalData.navHeight = navHeight; //导航栏总体高度
        this.globalData.navTop = navTop; //胶囊距离顶部距离
        this.globalData.navObj = menuButtonObject.height; //胶囊高度
        this.globalData.navObjWid = navObjWid; //胶囊宽度(包括右边距离)

        this.globalData.StatusBar = res.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar =
            capsule.bottom + capsule.top - res.statusBarHeight;
        } else {
          this.globalData.CustomBar = res.statusBarHeight + 50;
        }
        console.log(navHeight, navTop, menuButtonObject.height, navObjWid);
      },
      fail(err) {
        console.log(err);
      },
    });
  },
  onShow(res) {
    console.log('onShow-res----------- :>> ', res);
    const { printerId,shareCode } = res?.query;
    if (printerId) {
      this.globalData.printerId = printerId;
    }
    if (shareCode) {
      this.globalData.shareCode = shareCode;
    }
    
  },
  onHide() {
    this.globalData.isStationMaster = null;
  },
  async isNewUser() {
    let phone = wx.getStorageSync('phoneCode');
    if (!phone) {
      const userInfo = await wx.api.user.getUserInfo();
      const phone2 = userInfo?.data?.mobile;
      console.log('userInfo :>> ', userInfo);
      console.log('phone2 :>> ', phone2);
      if (phone2) {
        wx.setStorageSync('phoneCode', phone2);
        return 0;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  },
  async isStationMaster() {
    const Null = ['', undefined, null];
    if (Null.includes(this.globalData.isStationMaster)) {
      console.log('没缓存-' + this.globalData.isStationMaster);
      const mobile = wx.getStorageSync('phoneCode');
      const { data } = await wx.api.station.isStationMaster({ mobile });
      this.globalData.isStationMaster = data;
      return data;
    } else {
      console.log('有缓存-' + this.globalData.isStationMaster);
      return this.globalData.isStationMaster;
    }
  },

  $bus, // 中央处理事件
  globalData: {
    //全局数据管理
    printerId: null,
    shareCode:null,
    StatusBar: 0,
    Custom: 0,
    CustomBar: 0,
    navHeight: 0, //导航栏总体高度
    navTop: 0, //胶囊距离顶部距离
    navObj: 0, //胶囊高度
    navObjWid: 0, //胶囊宽度(包括右边距离)
    hasShownModal: false,
    userInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    tabBarIndex: 0,
    orderId: null,
    isOrderSuccess: null,
    query_id: null,
    timeout: null,
    isJump: null,
    isStationMaster: null,
    interval: null,
  },
});
