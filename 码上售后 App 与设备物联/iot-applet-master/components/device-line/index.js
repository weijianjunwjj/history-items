// components/device-line/index.js
import { debounce } from '../../utils/util'
import { state } from '../../utils/global'

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    item: {
      type: Object,
      value: {
        image: '',
        type: '',
      }
    },
    className: {
      type: String,
      value: ''
    },
    path: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    state
  },

  lifetimes: {
    attached() {
      console.log('this.data.item', this.data.item);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageLoad: debounce(function () {
      console.log('图片加载完成！');
      this.triggerEvent('loaded')
    }, 200),
    onTap() {
      wx.navigateTo({
        url: this.data.path + `?item=${JSON.stringify(this.data.item)}`,
      })
    }
  }
})
