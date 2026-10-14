import { get, post } from '@/http/request'


export const getDetails = (params: any) => get('Product/details', params)
// 获取类录
export const fetchList = (params: any) => post('Product/index',params)

