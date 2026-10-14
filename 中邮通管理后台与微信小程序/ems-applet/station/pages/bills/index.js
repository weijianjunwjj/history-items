import { unique_obj_arr2 } from '../../../utils/util.js';
import { Express0 } from '../../../utils/map.js';
import { calculateTimeDifference } from '../../../utils/util.js';

const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
    // 组件可选值：isolated | apply-shared | shared
    // 页面组件可选值：page-isolated | page-apply-shared | page-shared
    styleIsolation: 'shared',
  },
  behaviors: [],
  properties: {},
  // 组件数据
  data: {
    isFirstOnShow: true, // 是否为首次执行onShow
    list_sel: null,
    option1: [
      { text: '全部', value: null },
      { text: '已收款', value: 7 },
      { text: '未收款', value: 8 },
    ],
    list: [],
    pageNum: 1,
    pageSize: 20,
    dayReceivedIncome: 0,
    monthReceivedIncome: 0,
    totalReceivedIncome: 0,
    unReceivedIncome: 0,
    weekReceivedIncome: 0,
    loading: false,
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    pages: 0,
    total: 0,
    orderSelect: null,
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    getList(noPage) {
      const userAccount = wx.getStorageSync('phoneCode');
      const { orderSelect } = this.data;
      const { pageNum, pageSize } = this.data.params;
      wx.showLoading({
        title: '加载中...',
      });
      wx.api.station
        .findBillList({
          orderSelect,
          userAccount,
          pageNum,
          pageSize,
          orderSelect,
        })
        .then(res => {
          console.log('res :>> ', res);
          const { data: data0 } = res;
          const data = data0.list.map(item => {
            return {
              ...item,
              showStatus: 1,
              name: Express0[item.cpCode].name || item.cpCode,
              img: Express0[item.cpCode].img || Express0['POST'].img,
            };
          });
          console.log('data :>> ', data);

          let list = null;
          if (!noPage) {
            const arr1 = [...this.data.list];
            const arr2 = [...data];
            console.log('arr1 :>> ', arr1);
            console.log('arr2 :>> ', arr2);
            if (arr1.length) {
              list = unique_obj_arr2(arr1, arr2, 'id');
            } else {
              list = data;
            }
            console.log('list :>> ', list);
          } else {
            list = data;
          }

          this.setData({
            list,
            pages: data0.pages,
            total: data0.total,
            loading: false,
          });
          wx.hideLoading();
        });
    },
    // 页面初始化
    init() {
      const userAccount = wx.getStorageSync('phoneCode');

      this.getList();
      wx.api.station
        .findBillStatisticsData({ userAccount })
        .then(({ data }) => {
          console.log('data :>> ', data);
          const {
            dayReceivedIncome,
            monthReceivedIncome,
            totalReceivedIncome,
            unReceivedIncome,
            weekReceivedIncome,
          } = data;
          this.setData({
            dayReceivedIncome,
            monthReceivedIncome,
            totalReceivedIncome,
            unReceivedIncome,
            weekReceivedIncome,
          });
        });

      // this.setData({
      //   'tab1.list': [
      //     {
      //       img: '../../../images/station/express.png',
      //       express: '邮政速运',
      //       express: '邮政速运',
      //     },
      //   ],
      // });
    },
    onMenuChange(e) {
      console.log('e :>> ', e);
      const orderSelect = e.detail;
      this.setData({
        orderSelect,
      });
      this.setData({
        'param.pageNum': 1,
      });
      this.setData({
        list: [],
      });
      this.getList(1);
    },
    isOrderTimeExceeds24Hours(orderTimeStr) {
     // 将输入的时间字符串转换为时间戳
    var orderTime = new Date(orderTimeStr).getTime();

    // 获取当前时间的时间戳
    var currentTime = new Date().getTime();

    // 计算下单时间与当前时间的差值（单位：毫秒）
    var timeDifference = currentTime - orderTime;

    // 将差值转换为小时
    var hoursDifference = timeDifference / (1000 * 60 * 60);

    // 判断是否超过24小时
    if (hoursDifference > 24) {
        return true; // 超过24小时
    } else {
        return false; // 未超过24小时
    }
    },

    toDetail(e) {
      console.log('e :>> ', e);
      const { item } = e.currentTarget.dataset;
      const { id, orderSelect, gotAt, createAt } = item;
      let orderSelect0;
      console.log('createAt :>> ', createAt);
      if (gotAt == null) {
        const isOrderTimeExceeds24Hours =
          this.isOrderTimeExceeds24Hours(createAt);
        console.log(
          'isOrderTimeExceeds24Hours :>> ',
          isOrderTimeExceeds24Hours
        );
        if (isOrderTimeExceeds24Hours) {
          orderSelect0 = 3;
        } else {
          orderSelect0 = 2;
        }
      } else {
        orderSelect0 = 6;
      }
      wx.navigateTo({
        url: `/station/pages/orders-detail/index?id=${id}&orderSelect=${orderSelect0}`,
      });
    },
    bindscrolltolower() {
      console.log('到底了1');
      this.loadMore();
    },
    loadMore() {
      console.log('loadMore----------');
      if (this.data.loading) {
        return;
      }

      const pageNum = this.data.params.pageNum;
      const totalPages = this.data.pages;
      console.log('pageNum + 1 :>> ', pageNum + 1);
      console.log('totalPages :>> ', totalPages);
      if (pageNum + 1 > totalPages) {
        return wx.showToast({
          icon: 'none',
          title: '到底了~',
        });
      }
      this.setData({
        loading: true,
      });
      const num = +this.data.params.pageNum + 1;
      this.setData({
        'params.pageNum': num,
      });
      this.getList();
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
