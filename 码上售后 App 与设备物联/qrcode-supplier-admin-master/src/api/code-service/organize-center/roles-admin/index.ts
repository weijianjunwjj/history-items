import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

// 角色下拉选择列表
export function optionSelect() {
  return defaultRequest.get({
    url: 'system/role/optionSelect',
  })
}

// 查询角色列表
export function listRole(params: any) {
  return defaultRequest.get({
    url: `system/role/list?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 导出角色列表
export const exportRoles = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'system/role/export', params, method: 'POST' },
    title
  )
}

// 新增角色
export function addRole(data: any) {
  return defaultRequest.post({
    url: 'system/role',
    data,
  })
}

// 删除角色
export function delRoles(data: any) {
  return defaultRequest.delete({
    url: 'system/role',
    data: {
      params: {
        Ids: [...data],
      },
    },
  })
}

// 角色状态修改
export function changeRoleStatus(data: any) {
  return defaultRequest.put({
    url: 'system/role/changeStatus',
    data,
  })
}

// 修改角色
export function updateRole(data: any) {
  return defaultRequest.put({
    url: 'system/role',
    data,
  })
}

// 获取完整菜单列表
export function getMenuList(params: any) {
  return defaultRequest.get({
    url: 'system/menu/list',
    params,
  })
}

// 获取选中的菜单列表
export function getSelectMenuList(params: any) {
  return defaultRequest.get({
    url: `system/authority/lessorRange/${params.enterpriseId}`,
    params: {
      roleId: params.roleId,
    },
  })
}

// 更新菜单
export function tenantScopeSet(data: any) {
  return defaultRequest.put({
    url: 'system/authority/tenantScopeSet',
    data,
  })
}
