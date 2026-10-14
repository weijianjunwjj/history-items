import { isCanSavePerosnInfo, savePerosnInfo } from '../../utils/util.js';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
  },

  onChange(e) {
    this.setData({
      checked: e.detail,
    });
  },

  getPhoneNumber(e) {
    console.log('e :>> ', e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.showLoading({
        title: '加载中...',
      });
      wx.api.user
        .phoneCode({
          phoneCode: e.detail.code,
        })
        .then(res => {
          console.log('res :>> ', res);
          wx.setStorageSync('phoneCode', res.data);
          wx.showToast({
            title: '授权成功',
          });
          wx.navigateBack({
            delta: 1,
          });
          savePerosnInfo();
          app.isStationMaster();
          wx.hideLoading();
        });
    }
  },
  toPaper() {
    wx.openPrivacyContract({
      success: res => {
        console.log('openPrivacyContract success');
      },
      fail: res => {
        console.error('openPrivacyContract fail', res);
        wx.showModal({
          title: '提示',
          content: '打开《逍遥邮隐私政策》失败，请联系微信客服！',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
