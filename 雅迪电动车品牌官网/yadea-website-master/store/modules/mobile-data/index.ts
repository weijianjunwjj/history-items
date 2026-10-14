/*
 * @Author: yqq
 * @Date: 2023-01-10 11:32:53
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-13 13:42:04
 * @FilePath: \yadea-website\store\modules\mobile-data\index.ts
 * @Description:
 *
 */

import { defineStore } from 'pinia'

const useMobileData = defineStore('mobileData', {
  state: () => ({
    mobileHeaderMenus: {}
  }),

  getters: {},

  actions: {
    saveData(partial: any) {
      this.$patch(partial)
    }
  }
})

export default useMobileData
