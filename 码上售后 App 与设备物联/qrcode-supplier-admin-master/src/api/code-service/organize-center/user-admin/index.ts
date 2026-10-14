import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

// 获取用户管理列表
export function getUserAdminList(params: any) {
  return defaultRequest.get({
    url: `system/user/list?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 新增用户
export function addUser(data: any) {
  return defaultRequest.post({
    url: 'system/user',
    data,
  })
}

// 删除用户
export function delUser(data: any) {
  return defaultRequest.delete({
    url: 'system/user',
    data: {
      params: {
        Ids: [...data],
      },
    },
  })
}

// 导出用户
export const exportUser = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'system/user/export', params, method: 'POST' },
    title
  )
}

// 用户状态修改
export function changeUserStatus(data: any) {
  return defaultRequest.put({
    url: 'system/user/changeStatus',
    data,
  })
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return defaultRequest.put({
    url: 'system/user',
    data,
  })
}

// 重置用户密码
export function resetUserPwd(data: any) {
  return defaultRequest.put({
    url: 'system/user/resetPwd',
    method: 'put',
    data,
  })
}

// 修改用户-角色关系
export function changeUserRole(data: any) {
  return defaultRequest.put({
    url: 'system/user/changeUserRole',
    data,
  })
}

// 查询用户详细
export function getUser(data: any) {
  return defaultRequest.get({
    url: `system/user/${data.id}`,
  })
}
