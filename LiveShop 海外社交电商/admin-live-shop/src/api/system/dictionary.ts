import { get, post } from '@/http/request'

// 获取列表
export const getDictionaryList = (params: any) => post('Dictionary/index', params)

// 新增/编辑
export const configDictionary = (params: any) => post(`Dictionary/${params.id ? 'edit' : 'add'}`, params)

// 删除
export const delDictionary = (params: any) => get('Dictionary/del', params)

// 修改状态
export const changeDictionaryStatus = (params: any) => post('Dictionary/changeStatus', params)