import { get, post } from '@/http/request'

// 获取列表
export const getRechargeList = (params: any) => get('Coin/index', params)

// 新增/编辑
export const configRecharge = (params: any) => post(`Coin/${params.id ? 'edit' : 'add'}`, params)

// 删除
export const delRecharge = (params: any) => get('Coin/del', params)
