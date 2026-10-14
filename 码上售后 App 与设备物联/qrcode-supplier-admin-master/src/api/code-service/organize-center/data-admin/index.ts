import { defaultRequest } from '@hx/packages/service/request'

// 获取企业信息
export function getEnterpriseProfile() {
  return defaultRequest.get({
    url: 'system/enterprise/profile',
  })
}

// 企业logo上传
export function uploadLogo(data: any, configs: any) {
  return defaultRequest.post({
    url: 'system/enterprise/changeLogo',
    params: data,
    ...configs,
  })
}

// 企业信息更新
export function updateEnterprise(data: any) {
  return defaultRequest.put({
    url: 'system/enterprise/updateEnterprise',
    params: data,
  })
}

// 企业账号修改
export function changeEnterpriseName(data: any) {
  return defaultRequest.put({
    url: '/system/enterprise/changeEnterpriseName',
    data,
  })
}
