/*
 * @Author: weijianjun
 * @Date: 2023-01-06 14:45:03
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-01-06 14:45:42
 * @FilePath: \yadea-website\plugins\CountTo.client.ts
 * @Description:
 *
 */

import { CountTo } from 'vue3-count-to'
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('count-to', CountTo)
})
