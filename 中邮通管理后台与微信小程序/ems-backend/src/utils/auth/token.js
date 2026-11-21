import { lStorage } from '@/utils'
import api from '@/api'
import Cookie from 'js-cookie'

const TOKEN_CODE = 'access_token'
const DURATION = 6 * 60 * 60

export function getToken() {
  return Cookie.get('saToken')
}

export function setToken(token) {
  Cookie.set('saToken', token)
}

export function removeToken() {
  Cookie.remove('saToken')
}

// export async function refreshAccessToken() {
//   const tokenItem = lStorage.getItem(TOKEN_CODE)
//   if (!tokenItem) {
//     return
//   }
//   const { time } = tokenItem
//   // token生成或者刷新后30分钟内不执行刷新
//   if (Date.now() - time <= 1000 * 60 * 30) return
//   try {
//     const res = await api.refreshToken()
//     setToken(res.data.token)
//   } catch (error) {
//     console.error(error)
//   }
// }
