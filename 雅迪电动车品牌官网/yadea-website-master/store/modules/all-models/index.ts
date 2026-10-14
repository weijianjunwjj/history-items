/*
 * @Author: weijianjun
 * @Date: 2023-02-28 09:49:15
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-28 09:51:28
 * @FilePath: \yadea-website\store\modules\all-models\index.ts
 * @Description:
 *
 */

import { defineStore } from 'pinia'

export default defineStore('allModelsStore', {
  state: () => ({
    group1: ['btn1', 'btn2'],
    group2: ['btn3', 'btn4', 'btn5', 'btn6'],
    group3: ['btn7', 'btn8', 'btn9', 'btn10'],
    mapping: {
      btn1: '无需驾照',
      btn2: '需驾照',
      btn3: '40-60km',
      btn4: '60-80km',
      btn5: '80-120km',
      btn6: '120km',
      btn7: '0-25km/h',
      btn8: '30-50km/h',
      btn9: '50-70km/h',
      btn10: '70km/h'
    }
  }),

  getters: {},

  actions: {}
})
