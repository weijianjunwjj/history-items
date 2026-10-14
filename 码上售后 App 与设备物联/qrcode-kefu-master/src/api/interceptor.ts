import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Modal, Notification } from '@arco-design/web-vue'
import { useUserStore, useMessageStore } from '@/store'
import { getToken } from '@/utils/auth'
import isPlainObject from 'lodash/isPlainObject'
import qs from 'qs'
import { clearLoginInfo } from '@/utils/utils'

export interface HttpResponse<T = unknown> {
  status: number
  msg: string
  code: number
  data: T
}
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}
axios.defaults.timeout = 60 * 1000
axios.defaults.withCredentials = false

/**
 * 请求拦截
 */
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation

    const token = getToken()
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    // 默认参数
    const defaults = {}
    // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...{
          _t: new Date().getTime(),
        },
      }
    }
    if (isPlainObject(config.params)) {
      config.params = {
        ...defaults,
        ...config.params,
      }
    }
    if (isPlainObject(config.data)) {
      config.data = {
        ...defaults,
        ...config.data,
      }
      if (
        /^application\/x-www-form-urlencoded/.test(
          (config as any).headers['content-type']
        )
      ) {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  (error) => {
    // do something
    return Promise.reject(error)
  }
)
// add response interceptors
axios.interceptors.response.use(
  (res: AxiosResponse<HttpResponse>) => {
    const { status, config } = res
    const { data } = res
    // if (status === 200 && config.responseType === 'blob') {
    //   // 下载文件流
    //   return Promise.resolve(data)
    // }
    if (status === 200) {
      // 正常的文本数据返回
      switch (data.code) {
        case 401:
          // token 失效
          clearLoginInfo()
          return Promise.reject(false)
        case 500:
          // token 失效
          Notification.info({
            content: data.msg || '请求失败',
          })
          return Promise.reject(data)
        default:
          break
      }
      return Promise.resolve(data)
    }

    return Promise.reject({
      details: (data as any).details,
      msg: '出错了！',
    })
  },
  (error) => {
    const messageStore = useMessageStore()

    const err = JSON.parse(JSON.stringify(error))
    const { status, message } = err
    const mess = messageStore[status]
    Message.error({
      content: mess || message || 'Request Error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)
