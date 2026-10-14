import {state} from '../../utils/index.js';

const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    orderSelect: Number,
  },
  // 组件数据
  data: {
    isPageHidden: false, // 页面是否处于隐藏状态
    item: {},
    show:false
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    init() {
      // 映射文字、icon、颜色和背景颜色
      // if (!this.data.orderSelect || [5,6,7,8].excludes(this.data.orderSelect)) return;
      console.log('this.data.orderSelect :>> ', this.data.orderSelect);
      const obj = state[this.data.orderSelect];
      const { text, color, bgc, icon } = obj;
      const item = {
        text,
        color,
        bgc,
        icon,
      };

      this.setData({ item });
    },
  },
  // 组件生命周期
  lifetimes: {
    created() {},
    attached() {
      this.init();
    },
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
