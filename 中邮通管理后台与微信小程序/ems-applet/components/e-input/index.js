const componentOptions = {
  // 组件选项
  options: {
    multipleSlots: true,
  },
  behaviors: [],
  properties: {
    placeholder: String,
    value: String,
    background: String,
    max: Number,
    rightIcon:String,
    type: {
      type:String,
      value:''
    }
  },
  // 组件数据
  data: {
    isPageHidden: false, // 页面是否处于隐藏状态
    childValue: null,
  },
  // 数据监听器
  observers: {},
  // 组件方法
  methods: {
    init () {
      const value = this.data.value
      this.setData({
        childValue: value
      })
    },
    onTapIcon(){
      this.triggerEvent('click-icon');
    },
    updateChildValue (event) {
      let value = event.detail.value
      if (this.data.type === 'number') {
        value = value.replace(/[^\d.%]/g, '').replace(/^[0]+/,'')
        // 数字类型输入框
        if (value <= this.data.max) {
          this.setData({
            childValue: value === '' ? 0 : value,
          });
        } else {
          this.setData({
            childValue: this.data.max,
          });
          wx.showToast({
            title: `最多输入${this.data.max}, 请重新输入`,
            icon: 'none',
          })
        }
      } else {
        // 普通输入框
        this.setData({
          childValue: value,
        });
      }


      this.triggerEvent('updateValue', this.data.childValue);
    },
  },
  // 组件生命周期
  lifetimes: {
    created () { },
    attached () {
      this.init()
    },
    ready () { },
    moved () { },
    detached () { },
  },
  definitionFilter () { },
  // 页面生命周期
  pageLifetimes: {
    // 页面被展示
    show () {
      const { isPageHidden } = this.data

      // show事件发生前，页面不是处于隐藏状态时
      if (!isPageHidden) {
        return
      }

      // 重新执行定时器等操作
    },
    // 页面被隐藏
    hide () {
      this.setData({
        isPageHidden: true,
      })

      // 清除定时器等操作
    },
    // 页面尺寸变化时
    resize () { },
  },
}

Component(componentOptions)
