// pages/sms-login/index.js
import { debounce } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      mobile: '',
      smsCode: '',
    },
    sendTime: '验证码',
    sendColor: '#363636',
    snsMsgWait: 60,
    smsFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 获取验证码
  sendCode: function () {
    if (this.data.smsFlag) {
      return console.log('禁止点击');
    }
    // 60秒后重新获取验证码
    var inter = setInterval(function () {
      this.setData({
        smsFlag: true,
        sendColor: '#cccccc',
        sendTime: this.data.snsMsgWait + 's后重发',
        snsMsgWait: this.data.snsMsgWait - 1
      });
      if (this.data.snsMsgWait < 0) {
        clearInterval(inter)
        this.setData({
          sendColor: '#363636',
          sendTime: '获取验证码',
          snsMsgWait: 60,
          smsFlag: false
        });
      }
    }.bind(this), 1000);
  },
  //mobileFormat表示输入是都符号电话号码规则
  validateMobile() {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.form.mobile.length == 0) {
      wx.showToast({
        title: '输入的手机号为空，，请重新输入！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        mobileFormat: false,
      })
    } else if (this.data.form.mobile.length < 11) {
      wx.showToast({
        title: '手机号长度有误，请重新输入！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        mobileFormat: false,
      })
    } else if (!myreg.test(this.data.form.mobile)) {
      wx.showToast({
        title: '手机号有误，请重新输入！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        mobileFormat: false,
      })
    } else {
      this.setData({
        mobileFormat: true,
      })
    }
  },

  mobileInput(e) {
    let value = e.detail.value.replace(/\D/g, '')
    this.setData({
      'form.mobile': value,
    })
    this.validateMobile()
  },

  onLogin: debounce(function () {
    this.validateMobile()
    if (this.data.mobileFormat) {
      console.log('手机校验通过');
      const params = this.data.form
      console.log(params);

      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  }, 300),

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