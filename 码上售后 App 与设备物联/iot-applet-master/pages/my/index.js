// pages/my/index.js
// import { myDevices } from '../../../wxapi/api'

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    deviceLength: 0,
    userInfo: {}
  },
  lifetimes: {
    async attached() {
      console.log('my-attached');

      getApp().$bus.on('PageCur', name => {
        console.log('name', name);
        if (name === 'my') {
          this.init()
        }
      })

    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async init() {
      const app = getApp()
      console.log('init---');
      const [userInfo,device] = await Promise.all([app.getUserInfo(), app.getMyDeviceL()])
      this.setData({
        deviceLength: device,
        userInfo: userInfo,
      })
    },
    to_tab1() {
      wx.navigateTo({
        url: '/pages/my/device-admin/index',
      })
    },
    to_tab2() {
      wx.navigateTo({
        url: '/pages/my/notice/index',
      })
    },
    to_tab3() {
      wx.navigateTo({
        url: '/pages/my/set/index',
      })
    },
  }
})
