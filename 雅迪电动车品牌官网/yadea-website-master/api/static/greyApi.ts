/*
 * @Author: yqq
 * @Date: 2023-01-13 10:20:01
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-13 13:40:44
 * @FilePath: \yadea-website\api\greyApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'

export default new (class grey extends Http {
  /**
   * 获取网站是否置灰
   */
  getIsGrey() {
    return this.get(`/api/website-grayed`)
  }
})()
