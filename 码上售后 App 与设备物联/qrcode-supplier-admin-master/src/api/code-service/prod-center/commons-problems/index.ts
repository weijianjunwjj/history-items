import { defaultRequest } from '@hx/packages/service/request'

const get = (url: string) => {
  return `/product/faq/${url}`
}

export function getList(params: any) {
  return defaultRequest.get({
    url: get('list'),
    params,
  })
}

// 新增客户
export function addList(data: any) {
  return defaultRequest.post({
    url: get('add'),
    data,
  })
}

// 修改客户
export function updateList(data: any) {
  return defaultRequest.post({
    url: get('update'),
    data,
  })
}

// 删除客户
export function delList(data: any) {
  return defaultRequest.post({
    url: get('delete'),
    data,
  })
}
