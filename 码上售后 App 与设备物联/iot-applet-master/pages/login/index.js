// import {maRegister,APP_ID} from "../../wxapi/request";

// console.log('APP_ID',APP_ID);

Page({
  data: {
  },
  // 微信快捷登录
  getPhoneNumber(e) {
    console.log(e);
    console.log(e.detail);
    if (e.detail.iv) {
      // wx.login({
      //   success(res) {
      //     console.log(res);
      //     if (res.code) {
            wx.redirectTo({
              url: '/pages/index/index',
            })
      //     }
      //   }
      // });
    } else {
      wx.showToast({
        title: '为了联系到您，请授权手机号码',
        icon: 'none'
      });
    }
  },
  toSMSLoginPage(e){
    console.log(e);
    wx.navigateTo({
      url: './sms-login/index',
    })
  }
})
