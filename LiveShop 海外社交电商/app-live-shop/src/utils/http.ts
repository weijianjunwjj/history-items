import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store'
import { clearAll, isLoginPage } from './utils'

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res:any) {
        const duration=2000
        const header=res.header
        const newToken = header?.['new-token'];
        if (newToken) {
          // 更新本地存储的 token
          uni.setStorageSync('token',newToken)
        }
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data.code!=7) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as IResData<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // 停止定位
          clearAll()
          if(!isLoginPage()){
            uni.reLaunch({ url: '/pages/login/login' })
          }
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title:  res.data.msg || res.data.message || 'request error',
              duration,
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        console.error(err)
        uni.showToast({
          icon: 'none',
          title: 'Network error, try another network',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
  return http<T>({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
  })
}

http.get = httpGet
http.post = httpPost
