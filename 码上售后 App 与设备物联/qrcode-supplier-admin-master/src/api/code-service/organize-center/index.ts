import { defaultRequest } from '@hx/packages/service/request'

export function getWhiteList() {
  return defaultRequest.get({
    url: 'tenant/tenantConfig/whiteList',
  })
}
export function saveWhiteList(data: any) {
  return defaultRequest.post({
    url: 'tenant/tenantConfig/whiteList/save',
    data: [...data],
  })
}

// 清空白名单
export function clearWhiteList() {
  return defaultRequest.post({
    url: 'tenant/tenantConfig/whiteList/clear',
  })
}
