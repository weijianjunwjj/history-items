import api from '../../../wxapi/api'
import { deviceType } from '../../../utils/global'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list0: [],
    list: [],
    index: 0,
    deviceType,
    searchV: ''
  },


  onPickDeviceType: function (e) {
    const v = e.detail.value
    const item = this.data.deviceType[v]
    const value = item.value
    const type = item.type
    if (type) {
      const list0 = this.data.list0
      const new_list = list0.filter(item => item[type] == value)
      this.setData({ list: new_list })
    } else {
      this.setData({ list: this.data.list0 })
    }
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { data } = await api.myDevices()

    this.setData({
      list0: data,
      list: data
    })
  },


  searchInput(e) {
    console.log(e);
    const v = e.detail.value.toLowerCase();
    console.log('v', v);
    let list=this.data.list0;
    if (v !== '') {
      list = this.data.list0.filter(item => item.productName.toLowerCase().includes(v) || item.sn.toLowerCase().includes(v))
    }
    this.setData({
      searchV: v,
      list
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