import api from "../../../../wxapi/api";
import { validateMobile } from "../../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    checked: true,
    showAdd: true,
    shareNum: '',
    customName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({ id,customName }) {
    if(customName==='undefined'){
      customName=''
    }
    this.setData({ id,customName })
    id && this.getList()
  },
  async getList() {
    const { data } = await api.deviceChildUsers(this.data.id)
    console.log(data);
    this.setData({
      list: data
    })
  },
  onShowAdd() {
    this.setData({ showAdd: false })
  },
  onChange(e, f) {
    console.log('e', e);
    // 需要手动对 checked 状态进行更新
    const { detail } = e;
    const index = e.currentTarget.dataset.index
    // console.log('index,',index);
    // console.log('detail', detail);
    const list = this.data.list
    list[index].status = !detail
    this.setData({
      list
    })
  },
  onSave() {

    wx.api.updateDeviceName({
      id: this.data.id,
      customName: this.data.shareNum,
    }).then(res => {
      console.log(res);
      wx.showToast({
        title: '保存成功！',
      })
      this.setData({ customName:res.customName })
    })

  },
  mobileInput(e) {
    const { value } = e.detail
    this.setData({ shareNum: value })
  },
  async addPhone() {
    const num = this.data.shareNum
 
    if (validateMobile(num)) {
      if(num===wx.getStorageSync('phone')){
        return wx.showToast({
          title: '手机号不可以为用户自己',
          icon:'none'
        })
      }
      const { data } = await api.addSharePhone({
        deviceId: this.data.id,
        userPhone: num,
        // "status": ""
      })
      console.log('data', data);
      wx.showToast({
        title: '添加成功',
      })
      this.getList()
    }

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