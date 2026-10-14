// pages/my/device-admin/index.js
import api from '../../../wxapi/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  async getMyDevices() {
    const { data: list } = await api.myDevices()
    this.setData({
      list
    })
    console.log('list', list);
  },

  toDetail(e) {
    console.log('e', e);
    const { id,customName,ownerStatus } = e.currentTarget.dataset.item
    console.log('ownerStatus',ownerStatus);
    if(!ownerStatus){
      wx.navigateTo({
        url: '/pages/my/device-admin/device-share/index'+`?id=${id}&customName=${customName}`,
      })
    }
   
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
    this.getMyDevices()
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