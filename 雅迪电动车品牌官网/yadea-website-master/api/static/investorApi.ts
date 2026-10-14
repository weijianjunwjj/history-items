/*
 * @Author: yqq
 * @Date: 2023-01-30 16:03:29
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 19:47:01
 * @FilePath: \yadea-website\api\static\investorApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'
import qs from 'qs'

export default new (class grey extends Http {
  /**
   * 获取新闻动态
   */
  getInvestorRelations(page: string, pageSize: string) {
    return this.get(`/json/notice-and-pfficial-letter.json`)
  }
})()
