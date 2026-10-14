// pages/device/detail/index.js
import api from '../../../wxapi/api'
import { device_info } from '../../../utils/global'
import { formatMins, getLocation } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    mapData: {
      scale: 12,
      latitude: '',
      longitude: '',
      markers: [],
    },
    infos: {
      faultRecords: [],
      maintenanceRecords: [],
    },
    device_info
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({ item }) {
    const detail = JSON.parse(item)
    console.log('detail', detail);
    this.setData({
      detail
    })
    if (typeof detail.deviceData.workTime === "number") {
      detail.deviceData.workTime = formatMins(detail.deviceData.workTime)
    }
    this.init(detail)
    this.mapCtx = wx.createMapContext('myMap', this)
    // this.deviceList(options.id, { latitude: options.latitude, longitude: options.longitude });

  },
  getLocation: function (e) {
    let info = e.currentTarget.dataset
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        const {
          address
        } = that.data
        wx.openLocation({
          latitude: Number(info.lat),
          longitude: Number(info.lng),
          name: address.recommend,
          address: address.address,
          scale: 18
        })

        // wx.openLocation({//​使用微信内置地图查看位置。
        //   latitude: info.lat,//要去的纬度-地址
        //   longitude: info.lng,//要去的经度-地址
        //   name: "O'MALL华侨城商业中心",
        //   address: '华侨城商业中心'
        // })
      }
    })
  },
  async init(detail) {
    console.log('detail', detail);
    const { id, latitude, longitude } = detail

    api.getLocation({
      lat: latitude, lng: longitude
    }).then(res => {
      console.log(res);
      this.setData({ address: res.data })
    })

    wx.api.getMess({
      userId: wx.getStorageSync('userInfo').id,
      deviceId: id
    }).then(res => {
      const { data } = res
      console.log(data);
      const infos = {}
      infos.faultRecords = data.faultRecords
      infos.maintenanceRecords = data.maintenanceRecords
      this.setData({
        infos
      })
    })
    console.log(detail);
    this.setData({
      detail
    })
    const markers = [{
      id: id,
      latitude,
      longitude,
      iconPath: '/images/map-pin-danger.png',
      width: '120rpx',
      height: '120rpx',
      joinCluster: true
    }];
    this.setData({
      'mapData.markers': markers,
      'mapData.latitude': latitude,
      'mapData.longitude': longitude,
      'mapData.scale': 18
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },



  toRunLog() {
    wx.navigateTo({
      url: '/pages/running-log/index?id=' + this.data.detail.id,
    })
  }
})