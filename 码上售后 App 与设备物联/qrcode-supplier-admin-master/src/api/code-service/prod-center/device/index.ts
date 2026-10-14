import { defaultRequest } from '@hx/packages/service/request'

// 获取设备列表
export function getDeviceList(params: any) {
  return defaultRequest.get({
    url: 'qrcode/device/query',
    params,
  })
}

// 导出设备
export const exportDevice = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'qrcode/device/export', params, method: 'POST' },
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

// 新增设备
export function addDeviceList(data: any) {
  return defaultRequest.post({
    url: 'qrcode/device/add',
    data,
  })
}

// 获取设备信息
export function getDeviceInfo(params: any) {
  return defaultRequest.get({
    url: 'qrcode/device/get/',
    params,
  })
}

// 修改设备
export function updateDevice(data: any) {
  return defaultRequest.post({
    url: 'qrcode/device/update',
    data,
  })
}

// 派发设备
export function distributeDevice(data: any) {
  return defaultRequest.post({
    url: 'qrcode/device/distribute',
    data,
  })
}

// 解绑设备
export function unBind(data: any) {
  return defaultRequest.post({
    url: '/qrcode/device/unbind',
    data,
  })
}

// 绑定
export function bind(data: any) {
  return defaultRequest.post({
    url: '/qrcode/device/bind',
    data,
  })
}

// 删除
export function delDevice(data: any) {
  return defaultRequest.post({
    url: '/qrcode/device/delete',
    data,
  })
}
