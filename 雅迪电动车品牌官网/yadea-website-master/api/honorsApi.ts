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
import qs from 'qs'
import { c } from '~~/node-jiti/chunks-dep-5e7f419b.js.9ccbdf3a'

export default new (class honors extends Http {
  /**
   * 获取年份事件列表
   */
  getList() {
    const query = qs.stringify({
      pagination: {
        page: 1,
        pageSize: 200
      }
    })
    return this.get(`/api/honors?${query}`, { server: true })
  }
})()
