import api from '../../wxapi/api'
import {diffTime} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { id } = options
    const { data } = await api.getDataRecord({ deviceId: id })
    console.log(data);
    const list = Object.entries(data).map((item) => {
      const title = item[0]
      const content = item[1]
      content.forEach(item=>{
        item.diffTime=diffTime(item.startTime,item.endTime)
        item.startTime=item.startTime.split(' ')[1]
        item.endTime=item.endTime.split(' ')[1]
      })
      return { title, content }
    })
    console.log('list',list);

    this.setData({
      list
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