// pages/device/index.js
import api from '../../wxapi/api'
import { formatMins } from '../../utils/util'
import authUtils from "../../utils/authUtils";
import { deviceType } from '../../utils/global'

const app = getApp()

// pages/device/d.js
Component({
  /**
 * 组件的初始数据
 */
  options: {
    addGlobalClass: true
  },
  data: {
    top: '0px',
    listMode: 2,
    unfold: true,
    list: [],
    index: 0,
    deviceType,
    showList: false,
    deviceLength: 0,
    status: {
      running: 0,
      offline: 0,
      maintain: 0,
      fault: 0,
    },
    Custom: {},
    isAllReaded: false,
    userInfo: {}
  },
  lifetimes: {
    attached() {
      const Custom = app.globalData.Custom
      console.log('Custom', Custom);
      this.setData({
        Custom,
        userInfo: wx.getStorageSync('userInfo')
      })

      getApp().$bus.on('PageCur', name => {
        console.log('name', name);
        if (name === 'device') {
          this.init()
        }
      })
    }
  },
  pageLifetimes: {
    show: function () {
      this.init()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      console.log('init---');
      authUtils.checkTokenAndLogin()
        .then(async () => {
          this._getUserInfo()
          this.getMyDevices()
          this._isAllReaded()
        })
        .catch((e) => {
          console.error(e);
          wx.navigateTo({ url: '/pages/login/index' })
        });
    },
    async _isAllReaded() {
      const p = {
        userId: wx.getStorageSync('userInfo').id,
      }
      const { data } = await api.deviceMessageRecord(p)
      console.log('data', data);
      const AllReaded = data.content.every(_ => _.readFlag)
      console.log('AllReaded',AllReaded);
      if (AllReaded) {
        this.setData({
          isAllReaded:AllReaded
        })
      }
    },
    toNotice() {
      wx.navigateTo({
        url: '/pages/my/notice/index',
      })
    },
    // 获取用户信息
    async _getUserInfo() {
      try {
        const { data: userInfo } = await api.getUserInfo({});
        console.log('userInfo', userInfo);
        wx.setStorageSync('userInfo', userInfo)
        this.setData({
          userInfo
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getMyDevices() {
      // wx.showLoading({
      //   title: '加载中',
      // })


      try {
        const { data: list } = await api.myDevices()
        list.forEach((item, index, array) => {
          item.deviceData.workTime = formatMins(item.deviceData.workTime)
        })
        console.log('list', list);
        this.setData({
          list0: list,
          list,
          deviceLength: list.length
        })
        console.log('list', list);
        wx.setStorageSync('device-length', list.length)

        const running = list.filter((value) => value.status == 0).length
        const offline = list.filter((value) => value.status == 2).length
        const maintain = list.filter((value) => value.warnFlag == 1).length
        const fault = list.filter((value) => value.repairFlag == 1).length
        this.setData({
          status: {
            running, offline, maintain, fault
          }
        })
      } catch (error) {
        console.error(error);
      } finally {
        wx.hideLoading()
        this.setData({
          showList: true
        })
      }


    },

    onPickDeviceType: function (e) {
      const v = e.detail.value
      // console.log('picker发送选择改变，携带值为', v)
      const item = this.data.deviceType[v]
      const value = item.value
      const type = item.type
      if (type) {
        // console.log('type',type);
        // console.log('value',value);
        const list0 = this.data.list0
        const new_list = list0.filter(item => item[type] == value)
        // console.log('new_list',new_list);
        this.setData({ list: new_list })
      } else {
        this.setData({ list: this.data.list0 })
      }
      this.setData({
        index: e.detail.value
      })
    },


    query() {

    },


    onfold() {
      const unfold = this.data.unfold
      console.log(unfold);
      this.setData({
        unfold: !unfold
      })
    },

    toBlockMode() {
      this.setData({
        listMode: 2
      })
    },
    toLineMode() {
      this.setData({
        listMode: 1
      })
    }
  }
})
