// station/pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    PageCur: 'orders',
    title: '订单',
    list: [
      {
        index: 0,
        name: 'orders',
        text: '订单',
        iconPath: '../../../images/station/menu1.png',
        selectedIconPath: '../../../images/station/menu1_sel.png',
      },
      {
        index: 1,
        name: 'bills',
        text: '账单',
        iconPath: '../../../images/station/menu2.png',
        selectedIconPath: '../../../images/station/menu2_sel.png',
      },
      {
        index: 2,
        name: 'my',
        text: '我的',
        iconPath: '../../../images/station/menu3.png',
        selectedIconPath: '../../../images/station/menu3_sel.png',
      },
    ],
  },

  onTabChange(e) {
    console.log(e);
    const active = e.detail;
    const { name, text: title } = this.data.list[active];
    this.setData({
      PageCur: name,
      active,
      title,
    });
    // getApp().$bus.emit('PageCur', name);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getApp().$bus.on('PageCur', ({name,title,active})=>{
      this.setData({
        PageCur: name,
        title,
        active
      });
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
    const isAuthStation = wx.getStorageSync('agreeStatus');
    const mobile = wx.getStorageSync('phoneCode');
    if (!isAuthStation) {
      wx.api.station.findUserInfo({ mobile }).then(({ data }) => {
        console.error('data :>> ', data);
        if (data.agreeStatus == 1) {
          wx.setStorageSync('agreeStatus', 1);
        } else {
          wx.navigateTo({
            url: '/station/pages/login/login',
          });
        }
      });
    }
    console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊');

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    getApp().$bus.off('PageCur')
  },

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
