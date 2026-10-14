import { get, post } from '@/http/request'

// 获取列表
export const getGroupList = (params: any) => post('Auth/index', params)

// 新增/编辑组
export const configGroup = (params: any) => post(`Auth/${params.id ? 'edit' : 'add'}`, params)

// 删除分组
export const delGroup = (params: any) => post('Auth/del', params)

// 修改组状态
export const changeGroupStatus = (params: any) => post('Auth/changeStatus', params)

// 组成员列表
export const getGroupMemberList = (params: any) => post('Auth/groupUsers', params)

// 删除组成员
export const delMember = (params: any) => post('Auth/delMember', params)

// 获取权限规则
export const getRuleList = (params: any) => post('Auth/getRuleList', params)

// 配置权限
export const editRule = (params: any) => post('Auth/editRule', params)
// 根据角色拿到菜单
export const getMenu = () => post('Auth/authMenu')
