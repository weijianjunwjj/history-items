import { defaultRequest } from '@hx/packages/service/request'

// 获取设备列表
export function getOtherDeviceList(params: any) {
  return defaultRequest.get({
    url: 'qrcode/deviceDistribute/list',
    params,
  })
}

// 导出设备
export const exportOtherDevice = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'qrcode/deviceDistribute/export', params, method: 'POST' },
    title
  )
}

// 获取子租户列表
export function getAgentChildren() {
  return defaultRequest.get({
    url: `qrcode/agent/children`,
  })
}

// 获取租户列表
export function getCustomerList() {
  return defaultRequest.get({
    url: `qrcode/customer/list`,
  })
}

// 获取设备信息
export function getOtherDeviceInfo(params: any) {
  return defaultRequest.get({
    url: 'qrcode/deviceDistribute/byId',
    params,
  })
}

// 修改设备
export function updateOtherDevice(data: any) {
  return defaultRequest.post({
    url: 'qrcode/deviceDistribute/update',
    data,
  })
}

// 获取设备来源
export function getParents() {
  return defaultRequest.get({
    url: '/qrcode/agent/parents',
  })
}
