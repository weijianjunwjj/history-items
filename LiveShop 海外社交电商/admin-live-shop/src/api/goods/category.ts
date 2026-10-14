import { post } from '@/http/request'

// 添加类录
export const addCategory = (params: any) => post('Category/add', params)
// 编辑类录
export const editCategory = (params: any) => post('Category/edit', params)
// 删除类录
export const delCategory = (params: any) => post('Category/del', params)
// 获取类录
export interface QueryParams {
  page?: number;
  limit?: number;
}
export const getCategory = (params: any) => post('Category/index',params)

