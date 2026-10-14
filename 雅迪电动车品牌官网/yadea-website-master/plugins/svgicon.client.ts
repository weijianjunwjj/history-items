/*
 * @Author: weijianjun
 * @Date: 2023-01-03 21:31:07
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-01-04 09:51:11
 * @FilePath: \yadea-website\plugins\svgicon.client.ts
 * @Description:
 *
 */
import 'virtual:svg-icons-register'

import svgIcon from '@/components/svg-icon/index.vue'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('svg-icon', svgIcon)
})
