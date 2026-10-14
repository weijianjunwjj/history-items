import { defineStore } from 'pinia'

const useMessageStore = defineStore('message', {
  state: () => ({
    400: '请求错误',
    401: '登录状态失效，请重新登录',
    403: '拒绝访问',
    404: '请求地址不存在',
    408: '请求超时',
    500: '服务器内部错误!',
    501: '服务未实现!',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
    505: 'HTTP版本不受支持',
  }),
})

export default useMessageStore
