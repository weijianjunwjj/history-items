import { getToken } from '@/utils'
import { resolveResError } from './helpers'
import qs from 'qs'
import isPlainObject from 'lodash/isPlainObject'

export function reqResolve(config) {
  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config
  }


  console.log('config :>> ', config)
  /**
   * * 加上 token
   * ! 认证方案: JWT Bearer
   */
  const token = getToken()
  //  if (!token) {
  //    return Promise.reject({ code: 401, message: '登录已过期，请重新登录！' })
  //  }
  config.headers['saToken'] = token

  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{
        _t: new Date().getTime(),
      },
    }
  }

  if (isPlainObject(config.data)) {
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function resResolve(response) {
  // TODO: 处理不同的 response.headers
  // const cookie = response['Set-Cookie'];
  const { data, status, config, statusText } = response
  if (data?.code !== 0 && data?.code !== 200) {
    const code = data?.code ?? status

    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.message ?? statusText)

    /** 需要错误提醒 */
    !config.noNeedTip && window.$message?.error(message)
    return Promise.reject({ code, message, error: data || response })
  }
  return Promise.resolve(data)
}

export function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    window.$message?.error(message)
    return Promise.reject({ code, message, error })
  }
  const { data, status, config } = error.response
  const code = data?.code ?? status
  const message = resolveResError(code, data?.message ?? error.message)
  /** 需要错误提醒 */
  !config?.noNeedTip && window.$message?.error(message)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}
