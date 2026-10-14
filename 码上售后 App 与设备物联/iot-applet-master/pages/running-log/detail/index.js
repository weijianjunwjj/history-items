// pages/running-log/detail/index.js
import { device_info } from '../../../utils/global'
import { formatMins } from '../../../utils/util'
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
    device_info
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({ id }) {
    console.log(wx.api);
    const { data } = await wx.api.getDataRecordById(id)
    console.log(data);
    data.workTime = formatMins(data.workTime)
    data.address = wx.getStorageSync('address')
    data.latitude = wx.getStorageSync('lat')
    data.longitude = wx.getStorageSync('lng')
    const { latitude, longitude } = data

    const markers = [{
      id: id,
      latitude,
      longitude,
      iconPath: '/images/map-pin-danger.png',
      width: '120rpx',
      height: '120rpx',
      joinCluster: true
    }];
    console.log('markers', markers);
    this.setData({
      detail: data,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})