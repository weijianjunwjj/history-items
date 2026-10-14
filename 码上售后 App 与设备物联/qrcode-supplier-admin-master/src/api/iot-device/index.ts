import { defaultRequest } from '@hx/packages/service/request'

// 获取租户列表
export function getTenantList(params: any) {
  return defaultRequest.get({
    url: 'tenant/tenant/list',
    params,
  })
}

// 获取物联设备列表
export function getIotDeviceList(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/list',
    data,
  })
}

// 修改物联设备列表
export function updateIotDevice(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/update',
    data,
  })
}

// 根据物联设备ID查询设备远程配置
export function getRemoteConfig(params: any) {
  return defaultRequest.get({
    url: `iot/iot/device/remoteConfig/${params.iotDeviceId}`,
  })
}

// 新增设备远程配置
export function addRemoteConfig(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/remoteConfig/add',
    data,
  })
}

// 修改设备远程配置
export function updateRemoteConfig(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/remoteConfig/update',
    data,
  })
}

// 新增物联设备
export function addDevice(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/add',
    data,
  })
}

// 查询已有的非物联网设备列表（分页）
export function unrelIotDevice(params: any) {
  return defaultRequest.get({
    url: 'qrcode/device/unrelIotDevice/query',
    params,
  })
}

// 删除物联设备
export function deleteIotDevice(data: any) {
  return defaultRequest.post({
    url: `iot/iot/device/delete/${data.id}`,
  })
}

// 设备运行日志列表
export function getRunLogList(params: any) {
  return defaultRequest.get({
    url: 'iot/iot/device/data-record/list',
    params,
  })
}

// 物联产品列表
export function getproductList(params: any) {
  return defaultRequest.get({
    url: 'iot/iot/product/list',
    params,
  })
}

// 查询已有的非物联网产品列表（分页）
export function unCreateIotList(params: any) {
  return defaultRequest.get({
    url: 'product/product/unCreate/iot/list',
    params,
  })
}

// 新增物联产品
export function addProduct(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/product/add',
    data,
  })
}

// 修改物联产品
export function updateProduct(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/product/update',
    data,
  })
}

// 查询物联产品
export function getProduct(params: any) {
  return defaultRequest.get({
    url: `iot/iot/product/get/${params.id}`,
  })
}

// 删除物联产品
export function deleteProduct(data: any) {
  return defaultRequest.post({
    url: `iot/iot/product/delete/${data.id}`,
  })
}

// 设备报警列表
export function faultRecordList(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/faultRecord/list',
    data,
  })
}

// 设备维保提醒列表
export function maintenanceList(data: any) {
  return defaultRequest.post({
    url: 'iot/iot/device/maintenance/list',
    data,
  })
}

// 查询指定设备的详情
export function getDevice(params: any) {
  return defaultRequest.get({
    url: `iot/iot/device/get/${params.deviceId}`,
  })
}
