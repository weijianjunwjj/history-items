import axios from 'axios'
import { UserState } from '@/store/modules/user/types'

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
  return axios.post<LoginRes>('/auth/login', data)
}

// 退出方法
export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'delete',
  })
}
export function getUserInfo() {
  return axios.get<UserState>('/system/user/getInfo')
}

// 获取验证码
export function getCodeImg() {
  return axios({
    method: 'get',
    url: '/code',
    timeout: 20000,
  })
}
