import { get, post } from '@/http/request'

// 动态列表
export const getUpdatesList = (params: any) => get('Post/index', params)

// 动态新增/编辑
export const configUpdates = (params: any) => post(`Post/${params.id ? 'edit' : 'add'}`, params)

// 动态删除
export const delUpdates = (params: any) => post('Post/del', params)

// 动态详情
export const detailUpdates = (params: any) => post('Post/details', params)


// Post/index