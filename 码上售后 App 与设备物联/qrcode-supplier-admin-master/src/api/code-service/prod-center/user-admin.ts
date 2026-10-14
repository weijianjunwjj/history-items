/* 用户管理模块路由 */
import { defaultRequest } from '@hx/packages/service/request'

export function getUserList(params: any) {
  return defaultRequest.get({
    url: `qrcode/qrocdeUser/list`,
    params,
  })
}
export function exportUserList(data: any, title: string) {
  return defaultRequest.download<any>(
    {
      url: 'qrcode/qrocdeUser/export',
      data,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'responseType': 'blob',
      },
    },
    title
  )
}
export function getUserDetail(id: any) {
  return defaultRequest.get({
    url: `qrcode/qrocdeUser/get/${id}`,
  })
}
