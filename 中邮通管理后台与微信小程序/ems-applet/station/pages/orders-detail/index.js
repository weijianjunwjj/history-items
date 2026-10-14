import { Express0 } from '../../../utils/map.js';
import { orderSelectName } from '../../utils/index.js';
import { calculateTimeDifference } from '../../../utils/util.js';
const app = getApp();
const pageOptions = {
  // 页面数据
  data: {
    isFirstOnShow: true, // 是否为首次执行onShow
    order: {
      statusName: '',
    },
    sender: {
      name: '李**',
      phone: '186****3606',
      address: '北京北京市朝阳区七圣中街16号院****',
    },
    recipient: {
      name: '李**',
      phone: '186****3606',
      address: '北京北京市朝阳区七圣中街16号院****',
    },
    show1: false,
    remainder: null,
    collectionTime: null,
  },
  // 页面载入时
  onLoad(e) {
    this.init(e);
    app.$bus.on('clearInterval',()=>{
      console.log("app.$bus.on('clearInterval'");
      clearInterval(this.data.interval)
    })
  },

  calculateTimeDifference(inputTime) {
    var inputDate = new Date(inputTime);
    var targetTime = new Date(inputDate.getTime() + 24 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      var now = new Date();
      var timeDifference = targetTime - now;

      console.log('timeDifference :>> ', timeDifference);

      if (timeDifference < 0) {
        clearInterval(interval);
        this.setData({ remainder: '倒计时结束' });
        return;
      }

      var hours = Math.floor(timeDifference / (1000 * 60 * 60));
      var minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
      var seconds = Math.floor(timeDifference / 1000) % 60;

      var formattedHours = hours.toString().padStart(2, '0') + '小时';
      var formattedMinutes = minutes.toString().padStart(2, '0') + '分';
      var formattedSeconds = seconds.toString().padStart(2, '0') + '秒';

      const remainder = formattedHours + formattedMinutes + formattedSeconds;

      console.log('remainder :>> ', remainder);

      this.setData({
        remainder,
      });
    }, 1000);

    this.setData({ interval });
    var app = getApp();
    app.globalData.interval = interval;
    wx.setStorageSync('interval', interval);
  },
  onClose1() {
    this.setData({
      show1: false,
    });
  },
  onOpen1() {
    this.setData({
      show1: true,
    });
  },
  copyC(e) {
    console.log('e :>> ', e);
    console.log('data :>> ', data);
    const data = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data,
      success() {
        console.log('设置粘贴板成功');
      },
    });
  },
  // 页面初始化
  init(e) {
    console.log('e :>> ', e);
    const userAccount = wx.getStorageSync('phoneCode');
    const params = {
      id: e.id,
      userAccount,
    };
    wx.api.station.findOrderInfo(params).then(res => {
      const { data } = res;
      console.log('data :>> ', data);
      // const remainder = calculateTimeDifference(data.createAt);
      const collectionTime = data.gotAt;
      if (data.createAt != null) {
        this.calculateTimeDifference(data.createAt); // 以目标时间作为参数
      }
      this.setData({
        // remainder,
        order: {
          ...data,
          collectionTime,
          orderSelect: e.orderSelect,
          statusName: orderSelectName[+e.orderSelect],
          name: Express0[data.cpCode].name || data.cpCode,
          img: Express0[data.cpCode].img || Express0['POST'].img,
        },
      });
    });
  },
  // 页面准备好时
  onReady() {},
  // 页面显示时
  onShow() {
    const { isFirstOnShow } = this.data;

    if (isFirstOnShow) {
      // 首次执行时
      this.setData({
        isFirstOnShow: false,
      });
      return;
    }
  },
  onHide() {
    console.log('onHide----------------------');
    // 页面隐藏时清除定时器
    console.log('this.data.interval :>> ', this.data.interval);
    if (this.data.interval) {
      clearInterval(this.data.interval);
      this.data.interval = null; // 清除引用
    }
  },
  // 页面卸载时
  onUnload() {
    console.log('onUnload----------------------');
    if (this.data.interval) {
      clearInterval(this.data.interval);
      this.data.interval = null; // 清除引用
    }
  },
  // 下拉页面时
  onPullDownRefresh() {},
  // 到达页面底部时
  onReachBottom() {},
  // 页面滚动时
  onPageScroll() {},
  // 分享时，注：onShareAppMessage不能为async异步函数，会导致不能及时取得返回值，使得分享设置无效
  onShareAppMessage() {
    /* const title = ''
    const path = ''
    const imageUrl = ``

    return {
      title,
      path,
      imageUrl,
    } */
  },
};

Page(pageOptions);
