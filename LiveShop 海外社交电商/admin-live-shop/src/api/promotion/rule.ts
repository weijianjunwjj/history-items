import { post } from '@/http/request'

// 获取规则列表
export const getSceneRuleList = (params: any) => post('SceneRule/index', params)

// 新增/编辑
export const configSceneRule = (params: any) => post(`SceneRule/${params.id ? 'edit' : 'add'}`, params)

// 删除
export const delSceneRule = (params: any) => post('SceneRule/del', params)
