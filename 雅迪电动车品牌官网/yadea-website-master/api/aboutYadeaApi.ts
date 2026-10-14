/*
 * @Author: yqq
 * @Date: 2023-02-07 14:01:36
 * @LastEditors: yqq
 * @LastEditTime: 2023-02-07 14:13:22
 * @FilePath: \yadea-website\api\aboutYadeaApi.ts
 * @Description:
 *
 */
/*
 * @Author: yqq
 * @Date: 2023-01-29 14:40:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-29 15:20:22
 * @FilePath: \yadea-website\api\newsApi.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'
import qs from 'qs'

export default new (class grey extends Http {
  /**
   * 获取发展历程
   */
  getDevelopHistories() {
    const query = qs.stringify(
      {
        populate: ['pic']
      },
      {
        encodeValuesOnly: true // prettify URL
      }
    )
    return this.get(`/api/develop-histories?${query}`, { server: true })
  }
})()
