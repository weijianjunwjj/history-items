import { get, post } from '@/http/request'

// 添加类录
export const add = (params: any) => post('Product/add', params)

export const changeStatus = (params: any) => post('Product/changeStatus', params)
// 编辑类录
export const edit = (params: any) => post('Product/edit', params)
// 删除类录
export const del = (params: any) => get('Product/del', params)
// 详细类录
export const getDetails = (params: any) => get('Product/details', params)
// export const getSpecDetails = (params: any) => get('Spec/getById', params)
export const getSpecDetails = (params: any) => get('Spec/index/details', params)
// 获取类录
export interface QueryParams {
  page?: number;
  pageSize?: number;
}
export const fetchList = (params: QueryParams) => post('Product/center/index',params)

