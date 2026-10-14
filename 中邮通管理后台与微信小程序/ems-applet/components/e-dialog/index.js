const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    // 这里定义传入组件的属性
    title: {
      type: String,
      value: '标题'
    },
    useTitleSlot: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  // 组件数据
  data: {
    isPageHidden: false, // 页面是否处于隐藏状态
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    onClose() {
      // 触发事件，通知父组件关闭
      this.triggerEvent('close');
    }
  },
  // 组件生命周期
  lifetimes: {
    created() {},
    attached() {
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
      const { isPageHidden } = this.data

      // show事件发生前，页面不是处于隐藏状态时
      if (!isPageHidden) {
        return
      }

      // 重新执行定时器等操作
    },
    // 页面被隐藏
    hide() {
      this.setData({
        isPageHidden: true,
      })

      // 清除定时器等操作
    },
    // 页面尺寸变化时
    resize() {},
  },
}

Component(componentOptions)
