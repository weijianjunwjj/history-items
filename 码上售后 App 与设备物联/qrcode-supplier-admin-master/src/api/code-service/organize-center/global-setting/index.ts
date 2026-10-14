import { defaultRequest } from '@hx/packages/service/request'

// 获取系统客服分组
export function getTenantConfig() {
  return defaultRequest.get({
    url: 'tenant/tenantConfig/list',
  })
}

// 新增系统分组
export function updateTenantConfig(data: any) {
  return defaultRequest.post({
    url: 'tenant/tenantConfig/update',
    data: [...data],
  })
}
