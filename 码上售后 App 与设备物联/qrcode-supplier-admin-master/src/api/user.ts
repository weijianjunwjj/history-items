// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'
import { UserState } from '@/store/modules/user/types'
import qs from 'qs'

export interface LoginData {
  enterpriseName: string
  userName: string
  password: string
  code: string
  uuid: string
}

export interface LoginRes {
  access_token: string
  token: string
}
export function login(data: LoginData) {
  return defaultRequest.post({ url: '/auth/login', params: data })
}

// 退出方法
export function logout() {
  return defaultRequest.delete({
    url: '/auth/logout',
  })
}
export function getUserInfo() {
  return defaultRequest.get({ url: '/system/user/getInfo' })
}

export function getUserInfoByWX(params: any) {
  return defaultRequest.get({
    url: '/maapi/wechat/mp/userInfo',
    params,
  })
}
export function WXBindSys(params: any) {
  return defaultRequest.get(
    {
      url: '/maapi/wechat/mp/bind',
      params,
      headers: {
        enterpriseId: params.enterpriseId,
      },
    },
    { errorMessageMode: 'none' }
  )
}
export function WXUnbindSys() {
  return defaultRequest.get({
    url: 'system/user/unbind/mp',
  })
}

// 获取验证码
export function getCodeImg() {
  return defaultRequest.get({
    url: '/code',
    timeout: 20000,
  })
}

// 获取路由
export function getRouter(params: any) {
  return defaultRequest.get({
    url: `/system/authority/menu/${params.enterpriseId}?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
    timeout: 20000,
  })
}
