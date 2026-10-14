

const app = getApp()
import api from '../../wxapi/api'
Page({
  data: {
    active: 0,
    PageCur: 'device',
    list: [
      {
        index: 0,
        name: 'device',
        text: "设备",
        iconPath: "../../images/tabbar/device.png",
        selectedIconPath: "../../images/tabbar/device1.png"
      },
      {
        index: 1,
        name: 'map',
        text: "地图",
        iconPath: "../../images/tabbar/map.png",
        selectedIconPath: "../../images/tabbar/map1.png"
      },
      {
        index: 2,
        name: 'data',
        text: "数据",
        iconPath: "../../images/tabbar/data.png",
        selectedIconPath: "../../images/tabbar/data1.png"
      },
      {
        index: 3,
        name: 'my',
        text: "我的",
        iconPath: "../../images/tabbar/my.png",
        selectedIconPath: "../../images/tabbar/my1.png"
      }
    ]
  },

  onLoad() {
  },
  onShow(){

  },


  onTabChange(e) {
    console.log(e);
    const active = e.detail
    const { name } = this.data.list[active]
    this.setData({
      PageCur: name,
      active
    })
    getApp().$bus.emit('PageCur',name)
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },

})
