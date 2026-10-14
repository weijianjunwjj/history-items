// webview.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.url) {
      const url=options.url
      console.log('url :>> ', url);
      this.setData({
        url,
      });
    }
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title,
      });
    }
  },

  /**
   * 监听 web-view 组件发送的消息
   */
  handleWebViewMessage: function (event) {
    console.log('收到消息:', event.detail);
    // 处理接收到的消息
  },
});
