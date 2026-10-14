/*
 * @Author: weijianjun
 * @Date: 2023-01-06 17:15:24
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 13:49:37
 * @FilePath: \website\store\modules\app\index.ts
 * @Description:
 *
 */
import { defineStore } from 'pinia'
import { getHeaderMenusFormat } from '@/utils'

const useAppStore = defineStore('appStore', {
  state: () => ({
    data: {},
    menus: [],
    sourceMenus: [],
    mobileHeaderMenus: [],
    carProCategories: [],
    cyclingLifeSeries: [],
    transparentHeaderRoutes: ['/', '/mob', '/mob/', '/booking-ride'],
    isShowHeader: true,
    isShowWhiteHeader: true
  }),

  getters: {},

  actions: {
    saveData(partial: any) {
      this.$patch(partial)
    },
    async getHeaderMenus() {
      const { menuApi, headerApi } = useApi()
      try {
        const { data: _sourceMenus } = await menuApi.getHeaderMenus()
        watch(
          () => _sourceMenus,
          sourceMenus => {
            sourceMenus = getHeaderMenusFormat(sourceMenus.value)
            console.log('sourceMenus :>> ', sourceMenus)
            this.menus = sourceMenus
          }
        )
      } catch (error) {
        onErr(error)
        console.error(error)
      }
    }
  }
})

export default useAppStore
