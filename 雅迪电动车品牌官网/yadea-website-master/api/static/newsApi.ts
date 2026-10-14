/*
 * @Author: yqq
 * @Date: 2023-01-29 14:40:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-11 11:01:17
 * @FilePath: \website\api\static\newsApi.ts
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
    return this.get(`/json/new.json`)
  }
  // 获取新闻详情
  getNew(id: number) {
    return this.get(`/api/news-${id}`)
  }
})()
