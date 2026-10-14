// pages/order-success/order-success.js
import { scanCode } from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show1:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id:options.id
    })
  },

  checkOrder(){
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?id='+this.data.id,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },

  anotherOrder() {
    scanCode()
  },
  gotIt(){
    this.setData({
      show1:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
