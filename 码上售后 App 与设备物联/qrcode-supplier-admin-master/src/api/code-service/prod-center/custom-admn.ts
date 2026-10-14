import { defaultRequest } from '@hx/packages/service/request'

export function getCustomerList(params: any) {
  return defaultRequest.get({
    url: `/qrcode/customer/list`,
    params,
  })
}

// 新增客户
export function addCustomer(data: any) {
  return defaultRequest.post({
    url: '/qrcode/customer/add',
    data,
  })
}

// 修改客户
export function updateCustomer(data: any) {
  return defaultRequest.post({
    url: '/qrcode/customer/update',
    data,
  })
}

// 删除客户
export function delCustomer(data: any) {
  return defaultRequest.post({
    url: '/qrcode/customer/delete',
    data,
  })
}

// // 导出数据
// export function exportCustomer(data: any, title: string) {
//   // return axios.post('/qrcode/work-ticket/export', responseType: 'blob',)
//   return defaultRequest.post({
//     url: '/qrcode/customer/export',
//     params: data,
//     // 这里设置请求返回数据为blob
//     responseType: 'blob',
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//     },
//   })
// }

// download请求
export const exportCustomer = (params: any, title: string) =>
  defaultRequest.download<any>(
    {
      url: '/qrcode/customer/export',
      params,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'responseType': 'blob',
      },
    },
    title
  )
