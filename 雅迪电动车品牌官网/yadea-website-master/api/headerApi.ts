/*
 * @Author: weijianjun
 * @Date: 2023-03-06 14:31:59
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 14:32:28
 * @FilePath: \yadea-website\api\HeaderApi.ts
 * @Description:
 *
 */

import Http from '~~/composables/http'

export default new (class headerApi extends Http {
  getHeader() {
    return this.get(`/api/homepage-headers?populate=*`)
  }
})()
