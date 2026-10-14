/*
 * @Author: weijianjun
 * @Date: 2022-12-23 14:32:37
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-28 09:54:33
 * @FilePath: \yadea-website\store\modules\home-page\index.ts
 * @Description: 首页动态数据存储
 *
 */

import { defineStore } from 'pinia'

const useHomePageStore = defineStore('homePageStore', {
  state: () => ({
    count: 0,
    data: [],
    isShowFooter: false
  }),

  getters: {},

  actions: {
    saveData(partial: any) {
      this.$patch(partial)
    },
    loadNextMod(count = 1) {
      this.count++
      const items = this.data.filter((item:{show:boolean}) => !item.show)
      if (items.length) {
        items.forEach((item:{show:boolean}, index) => {
          if (index < count) {
            item.show = true
          }
        })
      }
    }
  }
})

export default useHomePageStore
