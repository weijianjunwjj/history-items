// station/pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    protocol1: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  onClosePop1() {
    this.setData({
      protocol1: false,
    });
  },
  onOpenPop1() {
    this.setData({
      protocol1: true,
    });
  },

  toServiceAgreement() {
    wx.navigateTo({
      url: `/pages/service-agreement/service-agreement`,
    });
  },

  onAgree() {
    const userAccount = wx.getStorageSync('phoneCode');
    wx.showLoading({
      title: '登录中...',
    })
    wx.api.station.iAgree({ userAccount }).then(({ code }) => {
      wx.hideLoading();
      if (code == 0) {
        wx.setStorageSync('isAuthStation', 1);
        wx.showToast({
          title: '登录成功',
        })
        
        wx.redirectTo({
          url: '/station/pages/home/home',
        });
      }
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
