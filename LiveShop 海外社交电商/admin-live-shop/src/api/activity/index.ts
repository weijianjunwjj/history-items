import { get, post } from '@/http/request'

// 预约管理列表
export const getActivityBookingIndexList = (params: any) => post('/Activity/booking/index', params)
// 预约管理添加、编辑
export const getActivityBookingConfigList = (params: any) => post(`/Activity/booking/${params.id ? 'edit' : 'add'}`, params)
// 预约管理删除
export const getActivityBookingDelList = (params: any) => post('/Activity/booking/del', params)
// 预约管理上下架
export const getActivityBookingSetOnSaleList = (params: any) => post('/Activity/booking/setOnSale', params)



// 众筹 拼团管理列表
export const getActivityIndexList = (params: any) => post('/Activity/index', params)
// 众筹 拼团添加、编辑
export const getActivityConfigList = (params: any) => post(`/Activity/${params.id ? 'edit' : 'add'}`, params)
// 众筹 拼团删除
export const getActivityDelList = (params: any) => post('/Activity/del', params)
// 众筹 拼团上下架
export const getActivitySetSaleList = (params: any) => post('/Activity/setOnSale', params)