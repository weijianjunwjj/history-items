// pages/order-success/order-success.js
import { scanCode } from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show1: true,
    show2: false,
    show3: false,
  },

  onClose2() {
    this.onCloseShow2();
    const dialogPlayed = wx.getStorageSync('dialogPlayed');
    console.log('dialogPlayed :>> ', dialogPlayed);
    if(!dialogPlayed){
      this.setData({
        show3: true,
      });
    }
  },
  onCloseShow2() {
    this.setData({
      show2: false,
    });
  },
  onClose3() {
    wx.setStorageSync('dialogPlayed', 1);
    this.setData({
      show3: false,
    });
  },
  goFollow() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://mp.weixin.qq.com/s/SZYEd_SyfNtC1pdDiH3cWg',
    });
  },
  goFollow2() {
    this.onClose3();
    wx.api.common.mpFollow2().then((res) => {
      console.log('res :>> ', res);
    })
    this.setData({
      show2: true,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options :>> ', options);
    this.setData({
      id:options.id
    })
    this.queryFollow()
  },

  queryFollow() {
    wx.api.common.mpFollow({}).then(res => {
      console.log('res :>> ', res);
      const { isFollow, userId } = res?.data || {};
      const show2 = !(userId && isFollow);
      this.setData({
        show2,
      });
    });
  },

  checkOrder() {
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?id=' + this.data.id,
      success: result => {},
      fail: () => {},
      complete: () => {},
    });
  },

  anotherOrder() {
    scanCode();
  },
  gotIt() {
    this.setData({
      show1: false,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({
      show2:false,
      show3:false,
    })
  },

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
