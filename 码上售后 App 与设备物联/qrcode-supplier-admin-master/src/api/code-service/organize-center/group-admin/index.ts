import { defaultRequest } from '@hx/packages/service/request'

// 获取分组列表
export function getGroupList(params: any) {
  return defaultRequest.get({
    url: 'system/group/list',
    params,
  })
}

// 新增系统分组
export function addGroup(data: any) {
  return defaultRequest.post({
    url: 'system/group/add',
    data,
  })
}

// 修改系统分组
export function updateGroup(data: any) {
  return defaultRequest.post({
    url: 'system/group/update',
    data,
  })
}

// 删除分组
export function deleteGroup(data: any) {
  return defaultRequest.post({
    url: 'system/group/delete',
    data,
  })
}

// 获取已添加到分组的用户
export function getGroupUser(params: any) {
  return defaultRequest.get({
    url: 'system/groupUser/list',
    params,
  })
}

// 获取已添加到分组的设备
export function getGroupDevice(params: any) {
  return defaultRequest.get({
    url: 'qrcode/groupDevice/list',
    params,
  })
}

// 获取未添加到分组的用户
export function getUnGroupUser(params: any) {
  return defaultRequest.get({
    url: 'system/kf/ungroup/list',
    params,
  })
}

// 获取未添加到分组的设备
export function getUnGroupDevice(params: any) {
  return defaultRequest.get({
    url: 'qrcode/device/ungroup/list',
    params,
  })
}

// 向分组中添加用户
export function addUserToGroup(data: any) {
  return defaultRequest.post({
    url: 'system/groupUser/add',
    data,
  })
}

// 向分组中添加设备
export function addDeviceToGroup(data: any) {
  return defaultRequest.post({
    url: 'qrcode/groupDevice/add',
    data,
  })
}

// 获取分组详情
export function geGroupDetail(params: any) {
  return defaultRequest.get({
    url: `system/group/get/${params.id}`,
  })
}

// 删除系统设备分组
export function deleteDevice(data: any) {
  return defaultRequest.post({
    url: 'qrcode/groupDevice/delete',
    data: [...data],
  })
}

// 删除系统设备分组
export function deleteUser(data: any) {
  return defaultRequest.post({
    url: 'system/groupUser/delete',
    data: [...data],
  })
}
