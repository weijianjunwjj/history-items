import { get, post } from '@/http/request'

// 添加类录
export const add = (params: any) => post('Spec/add', params)
// 编辑类录
export const edit = (params: any) => post('Spec/edit', params)
// 删除类录
export const del = (params: any) => post('Spec/del', params)

export const getSpecsNames = (dictSn: string) => get('/Dictionary/getDictSn', {dictSn})
export const getDetails = (id: number) => get('Spec/details', {id})
// 获取类录
export const fetchList = (id: any) => get('/Spec/getById',{id})

