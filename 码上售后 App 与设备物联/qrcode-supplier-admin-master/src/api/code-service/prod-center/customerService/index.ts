import { defaultRequest } from '@hx/packages/service/request'

// 获取客服列表
export function getKfList(params: any) {
  return defaultRequest.post({
    url: 'system/kf/list',
    params,
  })
}

export function updatePriority(params: any) {
  return defaultRequest.post({
    url: 'system/kf/priority/update',
    params,
  })
}
