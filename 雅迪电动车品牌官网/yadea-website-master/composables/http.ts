/*
 * @Author: weijianjun
 * @Date: 2023-01-05 10:13:05
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-07 14:22:15
 * @FilePath: \website\composables\http.ts
 * @Description:
 *
 */

import { hash } from 'ohash'

export const myfetch = (url: string, options?: any): Promise<any> => {
  // const { $config } = useNuxtApp()
  // const { VITE_API_HOST } = $config.public
  let baseURL = ''
  const {
    public: { VITE_API_URL: baseURL0, VITE_API_URL_JSON: baseURLJSON }
  } = useRuntimeConfig()
  const reqUrl = url.startsWith('http') ? url : baseURL + url // 你的接口地址
  // console.log('reqUrl :>> ', reqUrl)
  const server = options?.params?.server || true
  // console.log('server :>> ', server)
  // 不设置key，始终拿到的都是第一个请求的值，参数一样则不会进行第二次请求
  // const key = hash(JSON.stringify(options) + url) key

  const fetchOptions = { ...options, server }

  if (url.startsWith('/json')) {
    baseURL = baseURLJSON
  } else {
    baseURL = baseURL0
  }
  // return new Promise((resolve, reject) => {
  return useFetch(reqUrl, {
    ...fetchOptions,
    baseURL,
    async onResponse({ request, response, options }) {
      // console.log('[fetch response]')
      // console.log(response)
    },
    async onResponseError({ request, response, options }) {
      console.log('ResponseError :>> ', response)
      if (response.status == 401) {
        // const showLogin = useShowLogin()
        // showLogin.value = true
      }
      // console.error('[fetch response error]')
    },

    async onRequest({ request, options }) {
      // console.log('[fetch request]')
    },
    async onRequestError({ request, options, error }) {
      console.error('[fetch request error]', error)
    }
  })
}

export default class Http {
  get = (url: string, params?: any) => {
    return myfetch(url, { method: 'get', params })
  }

  post = (url: string, body?: any) => {
    return myfetch(url, { method: 'post', body })
  }

  put = (url: string, body?: any) => {
    return myfetch(url, { method: 'put', body })
  }

  delete = (url: string, body?: any) => {
    return myfetch(url, { method: 'delete', body })
  }
}
