// components/device-card/index.js
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
    state
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      wx.navigateTo({
        url: this.data.path + `?item=${JSON.stringify(this.data.item)}`,
      })
    }
  }
})
