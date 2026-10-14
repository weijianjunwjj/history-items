// pages/my/notice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0,
    deviceType: [
      { label: '全部消息', value: '' },
      { label: '系统通知', value: 'system' },
      { label: '故障报警', value: 'fault' },
      { label: '维保提醒', value: 'maintenance' },
    ],
    mapp: {
      'fault': 'def-bg1',
      'maintenance': 'def-bg2',
      'system': 'hide',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },
  async init(messageType) {
    const p = {
      userId: wx.getStorageSync('userInfo').id,
    }
    if(messageType){
        p.messageType=messageType
    }
    
    console.log(p);
    const { data } = await wx.api.deviceMessageRecord(p)
    const arr = data.content
    arr.forEach(item => {
      item.date = item.createTime.split(' ')[0]
      item.time = item.createTime.split(' ')[1]
    })

    const arr2 = wx.utils.sort(arr, 'createTime0')

    const arr3 = arr2.map(item => {
      return {
        title: item[0].date,
        content: item
      }
    })
    console.log('arr3', arr3);
    this.setData({
      list: arr3
    })
  },
  async onReaded(e) {
    console.log(e);
    const { id } = e.currentTarget.dataset.item
    await wx.api.readMessage({
      id,
      userId: wx.getStorageSync('userInfo').id
    })
    this.init()
    console.log(this.data.list);

  },
  async onReadedAll(e) {
    await wx.api.readAllMessage({
      userId: wx.getStorageSync('userInfo').id
    })
    this.init()
    console.log(this.data.list);

  },
  onPickDeviceType: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const index = e.detail.value
    this.setData({
      index
    })
    const value = this.data.deviceType[index].value
    this.init(value)
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