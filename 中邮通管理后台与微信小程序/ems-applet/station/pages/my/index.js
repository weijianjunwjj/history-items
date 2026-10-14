import { maskPhoneNumber, getCurrentDate } from '../../../utils/util.js';
const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  behaviors: [],
  properties: {},
  // 组件数据
  data: {
    isFirstOnShow: true, // 是否为首次执行onShow
    printerVos: [],
    protocol: false,
    pageNum: 1,
    pageSize: 20,
    phone: wx.getStorageSync('phoneCode')
      ? maskPhoneNumber(wx.getStorageSync('phoneCode'))
      : '****',
    curDate: getCurrentDate(),
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    // 页面初始化
    init(e) {
      const { pageNum, pageSize } = this.data;
      const userAccount = wx.getStorageSync('phoneCode');

      wx.api.station
        .myInfo({
          userAccount,
          pageNum,
          pageSize,
        })
        .then(({ data }) => {
          console.log('data :>> ', data);
          this.setData({
            user: data,
            printerVos: data.printerVos,
          });
        });
    },
    toOrders(){
      getApp().$bus.emit('PageCur', {
        name: 'orders',
        title: '订单',
        active:0
      });
    },
    onTap1() {
      this.toOrders()
      getApp().$bus.emit('orderSelect',1)
    },
    onTap2() {
      this.toOrders()
      getApp().$bus.emit('orderSelect',2)
    },
    onTap3() {
      this.toOrders()
      getApp().$bus.emit('orderSelect',5)
    },
    onClosePop2() {
      this.setData({
        protocol: false,
      });
    },
    onOpenPop2() {
      this.setData({
        protocol: true,
      });
    },
    toServiceAgreement() {
      wx.navigateTo({
        url: `/pages/service-agreement/service-agreement`,
      });
    },
  },
  // 组件生命周期
  lifetimes: {
    created(e) {
      this.init(e);
    },
    attached() {},
    ready() {},
    moved() {},
    detached() {},
  },
  definitionFilter() {},
  // 页面生命周期
  pageLifetimes: {
    // 页面被展示
    show() {
      const { isPageHidden } = this.data;

      // show事件发生前，页面不是处于隐藏状态时
      if (!isPageHidden) {
        return;
      }

      // 重新执行定时器等操作
    },
    // 页面被隐藏
    hide() {
      this.setData({
        isPageHidden: true,
      });

      // 清除定时器等操作
    },
    // 页面尺寸变化时
    resize() {},
  },
};

Component(componentOptions);
