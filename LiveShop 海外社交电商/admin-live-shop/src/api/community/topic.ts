import { get, post } from '@/http/request'

// 话题列表
export const getTopicList = (params: any) => post('Topic/index', params)

// 话题新增/编辑
export const configTopic = (params: any) => post(`Topic/${params.id ? 'edit' : 'add'}`, params)

// 话题删除
export const delTopic = (params: any) => post('Topic/del', params)

// 话题详情
export const detailTopic = (params: any) => post('Topic/details', params)
