// app.js
import $bus from './utils/Event'
import { getLocation, getMyDeviceL, getUserInfo } from './utils/util'
import utils from './utils/util'
App({
  onLaunch() {
    wx.app = this
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        console.log('capsule', capsule);
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

    // getLocation()


    wx.utils = utils

  
  },
  onShow() {
    // wx.hideTabBar()
  },
  $bus, // 中央处理事件
  getMyDeviceL,
  getUserInfo,
  globalData: {
    userInfo: null,
    statusBarHeight: 0,
    navBarHeight: 0,
    tabBarIndex: 0
  }
})
