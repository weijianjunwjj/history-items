/*
 * @Author: yqq
 * @Date: 2023-02-07 15:39:01
 * @LastEditors: yqq
 * @LastEditTime: 2023-02-07 15:39:09
 * @FilePath: \yadea-website\api\aboutYadeaApi copy.ts
 * @Description:
 *
 */
import Http from '~~/composables/http'

export default new (class grey extends Http {
  /**
   * 获取服务城市
   */
  getServiceStations() {
    return this.get(`/api/service-stations`, { server: true })
  }
})()
