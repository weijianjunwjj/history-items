/*
 * @Author: yqq
 * @Date: 2023-01-08 20:42:54
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-13 13:42:01
 * @FilePath: \yadea-website\store\modules\is-safari\index.ts
 * @Description:
 *
 */

import { defineStore } from 'pinia'

const useIsSafari = defineStore('isSafari', {
  state: () => ({
    isSafari: false,
    isMobile: false
  }),

  getters: {},

  actions: {
    saveData(partial: any) {
      this.$patch(partial)
    }
  }
})

export default useIsSafari
