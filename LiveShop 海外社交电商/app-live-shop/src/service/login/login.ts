import { http } from '@/utils/http'

/** GET 请求 */
export const getLoginInfo = () => {
  return http.get('/Auth/config')
}

/** POST 请求 */
export const login = (params: any) => {
  return http.post('/Auth/login', params)
}

// 更新用户信息
export const userEdit = (params: any) => {
  return http.post('/User/edit', params)
}
// 别人用户信息
export const getUserInfo = (id: number) => {
  return http.get('/User/info', { id })
}
// 自己用户信息
export const getAuthUser = () => {
  return http.get('/AuthPrivate/user')
}


