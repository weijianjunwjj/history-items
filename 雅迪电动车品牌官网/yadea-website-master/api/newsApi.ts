/*
 * @Author: yqq
 * @Date: 2023-01-29 14:40:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 20:03:32
 * @FilePath: \website\api\newsApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'
import qs from 'qs'

export default new (class grey extends Http {
  /**
   * 获取新闻动态
   */
  getNews(page: string, pageSize: string) {
    const query = qs.stringify({
      pagination: {
        page,
        pageSize
      },
      populate: ['newPic']
    })
    return this.get(`/api/news?${query}`)
  }

  // 获取新闻详情
  getNew(id: number) {
    return this.get(`/api/news/${id}`)
  }
})()
