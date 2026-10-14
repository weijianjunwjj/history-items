/*
 * @Author: weijianjun
 * @Date: 2023-01-28 16:03:56
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-01-28 16:06:40
 * @FilePath: \yadea-website\api\honorsApi.ts
 * @Description:
 *
 */

import Http from '~~/composables/http'

export default new (class honors extends Http {
  /**
   * 获取年份事件列表
   */
  getList() {
    return this.get(`/api/honors`, { server: true })
  }
})()
