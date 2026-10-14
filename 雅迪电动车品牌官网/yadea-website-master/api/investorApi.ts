/*
 * @Author: yqq
 * @Date: 2023-01-30 16:03:29
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-30 16:06:28
 * @FilePath: \yadea-website\api\investorApi.ts
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
    const query = qs.stringify({
      pagination: {
        page,
        pageSize
      },
      populate: ['pdfUrl']
    })
    return this.get(`/api/notice-and-pfficial-letters?${query}`)
  }
})()
