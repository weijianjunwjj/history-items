/*
 * @Author: miaoyuxuan
 * @Date: 2023-03-09 13:54:35
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-10 21:36:37
 * @FilePath: /yadea-website/api/bookingRideApi.ts
 * @Description:预约骑行api
 *
 */
import Http from '~~/composables/http'
import qs from 'qs'

export default new (class grey extends Http {
  /**
   * 预约骑行
   */
  preBook(body: any) {
    const base = String(useRuntimeConfig().public.HISTORY_LAB_API_URL || '').replace(/\/$/, '')
    return this.post(base ? base + '/api/preBook' : '/api/preBook', body)
  }

  /**
   * 骑行预约获取手机验证码
   */
  getAuthCode(params: any) {
    const base = String(useRuntimeConfig().public.HISTORY_LAB_API_URL || '').replace(/\/$/, '')
    return this.get((base ? base : '') + `/api/code?${qs.stringify(params)}`)
  }
})()
