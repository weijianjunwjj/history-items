/*
 * @Author: weijianjun
 * @Date: 2023-03-06 14:09:08
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 15:02:04
 * @FilePath: \yadea-website\api\static\homePageApi.ts
 * @Description:
 *
 */

import Http from '~~/composables/http'

export default new (class homePage extends Http {
  /**
   * 获取年份事件列表
   */
  getList() {
    return this.get(`/json/homepage-model.json`)
  }
  getMobList() {
    return this.get(`/json/homepage-model.json`)
  }
})()
