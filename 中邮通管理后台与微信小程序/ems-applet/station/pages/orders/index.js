import { Express0 } from '../../../utils/map.js';
import { throttle, unique_obj_arr2, debounce } from '../../../utils/util.js';

// 辅助函数：获取年份数据
function getYears() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 2; // 从当前时间往前推2年
  const years = [];
  for (let i = startYear; i <= currentYear; i++) {
    years.push(i.toString());
  }
  return years;
}

// 辅助函数：获取月份数据
function getMonths() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 月份从0开始，需要加1
  const months = [];
  const currentYearIndex = getYears().indexOf(currentYear.toString());

  if (currentYearIndex === 0) {
    // 如果是当前年份的前半部分，月份范围包括当前月份之前的月份
    for (let i = 1; i <= 12; i++) {
      if (i <= currentMonth) {
        months.push(i.toString().padStart(2, '0'));
      }
    }
  } else {
    // 如果是当前年份的后半部分，月份范围包括所有月份
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString().padStart(2, '0'));
    }
  }

  return months;
}

function getCurYM() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1

  return `${year}-${month}`;
}
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
    scrollTop: 0,
    scrollTop2: 0,
    isFirstOnShow: true, // 是否为首次执行onShow
    btnActive: 0,
    year_month: getCurYM(),
    show1: false,
    columns: [
      {
        values: getYears(), // 从你的数据源中获取年份数据
      },
      {
        values: getMonths(), // 从你的数据源中获取月份数据
      },
    ],
    tab1List: [],
    tab2List: [],
    tab1: {
      all: 0,
      today: 0,
      timeout: 0,
    },
    tab2: {
      all: 0,
      received: 0,
      cancel: 0,
    },
    tab2: {},
    pageNum: 1,
    pageSize: 20,
    idOrNameOrMobile: '',
    orderSelect: 1,
    loading: false,
    loading2: false,
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    params2: {
      pageNum: 1,
      pageSize: 10,
    },
    pages: 0,
    pages2: 0,
    total: 0,
    total2: 0,
    dateAt: null,
    type2: [4, 5, 6],
    unGotTotalCount: 0,
    unGotTodayCount: 0,
    unGotOverTimeCount: 0,
    completedTotalCount: 0,
    completedCancelCount: 0,
    completedGotCount: 0,
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    // 页面初始化
    init: debounce(function (noPage = false, params = {}) {
      const userAccount = wx.getStorageSync('phoneCode');
      const { idOrNameOrMobile, orderSelect, dateAt } = this.data;
      const { pageNum, pageSize } = this.data.params;

      console.log('pageNum :>> ', pageNum);
      wx.showLoading({
        title: '加载中...',
      });
      wx.api.station
        .findOrderList({
          orderSelect,
          idOrNameOrMobile,
          userAccount,
          pageNum,
          pageSize,
          ...params,
        })
        .then(res => {
          console.log('res :>> ', res);

          let { data: data0 } = res;
          const type1 = [1, 2, 3];
          const type2 = [4, 5, 6];
          const orderSelect0 = this.data.orderSelect;
          const isType1 = type1.includes(this.data.orderSelect);
          const isType2 = type2.includes(this.data.orderSelect);
          const data = data0.list.map(item => {
            const showStatus = [5, 6, 7, 8].includes(this.data.orderSelect);
            return {
              ...item,
              showStatus,
              name: Express0[item.cpCode].name || item.cpCode,
              img: Express0[item.cpCode].img || Express0['POST'].img,
            };
          });
          const {
            unGotTotalCount,
            unGotTodayCount,
            unGotOverTimeCount,
            completedTotalCount,
            completedCancelCount,
            completedGotCount,
          } = data0;
          let list;
          console.log('noPage :>> ', noPage);
          if (!noPage) {
            const arr1 = [...this.data.tab1List];
            const arr2 = [...data];
            console.log('arr1 :>> ', arr1);
            console.log('arr2 :>> ', arr2);
            if (arr1.length) {
              list = unique_obj_arr2(arr1, arr2, 'id');
            } else {
              list = data;
            }
            console.log('data :>> ', data);
          } else {
            list = data;
          }
          console.log('list :>> ', list);
          const total = data0?.total || 0;
          function formatValue(value) {
            if (value > 9999) {
              return '9999+';
            } else {
              return value.toString();
            }
          }
          this.setData({
            tab1List: list,
            total,
            loading: false,
            pages: data0.pages,
            unGotTotalCount:formatValue(unGotTotalCount),
            unGotTodayCount:formatValue(unGotTodayCount),
            unGotOverTimeCount:formatValue(unGotOverTimeCount),
            completedTotalCount:formatValue(completedTotalCount),
            completedCancelCount:formatValue(completedCancelCount),
            completedGotCount:formatValue(completedGotCount),
          });

          wx.hideLoading();
        });
    }, 200),
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
      const active = this.data.active;
      console.log('active :>> ', active);
      if (active == 1) {
        this.init(true, { dateAt: this.data.dateAt });
      } else {
        this.init();
      }
    },
    bindscrolltolower2() {
      console.log('到底了2');
      this.loadMore2();
    },
    loadMore2() {
      console.log('loadMore----------');
      if (this.data.loading2) {
        return;
      }

      const pageNum = this.data.params2.pageNum;
      const totalPages = Math.ceil(
        this.data.total2 / this.data.params2.pageSize
      );
      console.log('pageNum :>> ', pageNum);
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
      const num = +this.data.params2.pageNum + 1;
      this.setData({
        'params2.pageNum': num,
      });
      this.init2();
    },
    onSearch: throttle(function (e) {
      const idOrNameOrMobile = e.detail;
      console.log('idOrNameOrMobile :>> ', idOrNameOrMobile);
      this.setData({
        idOrNameOrMobile,
      });
      this.init(true);
    }, 100),
    onTabChange(e) {
      console.log('e :>> ', e);
      const { index } = e.detail;
      this.setData({
        active: index,
      });
      const map = {
        0: 1,
        1: 4,
      };
      const orderSelect = map[index];
      const dateAt = getCurYM();
      this.setData({
        'params.pageNum': 1,
        orderSelect,
        btnActive: 0,
        scrollTop: 0,
        scrollTop2: 0,
        dateAt,
      });
      if (index == 1) {
        this.init(true, { dateAt });
      } else {
        this.init(true);
      }
    },
    toDetail(e) {
      console.log('e :>> ', e);
      const {
        id,
        item: { orderSelect },
      } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/station/pages/orders-detail/index?id=${id}&orderSelect=${orderSelect}`,
      });
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
    onYearChange(event) {
      console.log('event :>> ', event);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // 月份从0开始，需要加1

      const year = event.detail.value[0];
      console.log({ year, currentYear });

      if (parseInt(year) === currentYear) {
        // 如果是当前年份，更新月份范围为当前月份之前的月份
        console.log('当前年份');
        this.setData({
          'columns[1].values': getMonths().filter(
            m => parseInt(m) <= currentMonth
          ),
        });
      } else {
        // 如果是其他年份，更新月份范围为所有月份
        this.setData({
          'columns[1].values': getMonths(),
        });
      }
    },
    onConfirm(event) {
      const [year, month] = event.detail.value;
      console.log(`选择的年份：${year}，月份：${month}`);
      const dateAt = `${year}-${month}`;
      this.setData({
        dateAt,
      });
      // 在这里处理选择后的逻辑
      this.onClose1();
      this.init(true, { dateAt });
    },

    onCancel() {
      console.log('取消选择');
      this.onClose1();
    },
    // 页面准备好时
    onBtnActive(e) {
      console.log('e :>> ', e);
      const { active, orderSelect } = e.currentTarget.dataset;
      this.setData({
        btnActive: active,
        orderSelect: +orderSelect,
        'params.pageNum': 1,
        scrollTop: 0,
        scrollTop2: 0,
      });

      if (this.data.type2.includes(+orderSelect)) {
        this.init(true, { dateAt: this.data.dateAt });
      } else {
        this.init(true);
      }
    },
  },
  // 组件生命周期
  lifetimes: {
    created(e) {
      this.init();
      getApp().$bus.on('orderSelect', orderSelect => {
        console.log('orderSelect :>> ', orderSelect);
        const map = {
          1: 0,
          2: 1,
          3: 2,
          4: 0,
          5: 1,
          6: 2,
        };
        const btnActive = map[orderSelect];
        console.log('btnActive :>> ', btnActive);
        if (+orderSelect > 3) {
          this.setData({ active: 1 });
        }
        setTimeout(() => {
          this.setData({
            orderSelect,
            btnActive,
            'params.pageNum': 1,
          });
          this.init();
        }, 0);
      });
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
