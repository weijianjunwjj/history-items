import api from '../../../wxapi/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    birthDay: null,
    nickname: null,
    gender: null,
    email: null,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    const userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      console.log('userInfo缓存有值');
      this.setUserInfo(userInfo)
    }else{
      this._getUserInfo()
    }
    
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        console.log(res);
        this.updateUser(res.userInfo)
      }
    })
  },

  setUserInfo(userInfo){
    this.setData({
      userInfo: userInfo,
      birthDay: userInfo.birthday,
      nickname: userInfo.nickname,
      gender: { name: userInfo.sex },
      email: userInfo.mail
    })

    wx.setStorageSync('userInfo', userInfo)
  },

  // 获取用户信息
  async _getUserInfo() {
    try {
      const { data: userInfo } = await api.getUserInfo({});
      console.log(userInfo);
      this.setUserInfo(userInfo)
    } catch (error) {
      console.log(error)
    }
  },

  updateUser(info) {
    console.log('info', info)
    const p = `?avatar=${info.avatarUrl}`
    api.editUserInfo(p).then((res) => {
      wx.showToast({
        title: '同步成功',
        icon: 'none'
      })
      this._getUserInfo();
      getApp().$bus.emit('PageCur', 'my')
    }).catch((e) => {
      wx.showToast({
        title: '操作失败，请稍后重试',
        icon: 'none'
      })
    })
  },

  toLogout(){
    wx.clearStorage({
      success: (res) => {
        wx.redirectTo({
          url: '/pages/login/index',
        })
      },
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