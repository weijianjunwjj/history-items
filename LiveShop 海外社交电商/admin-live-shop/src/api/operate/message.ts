import { post } from '@/http/request'

// 获取消息模板列表
export const getMessageTemplateList = (params: any) => post('Msg/index', params)

// 消息模板新增/编辑
export const configMessageTemplate = (params: any) => post(`Msg/${params.id ? 'edit' : 'add'}`, params)

// 消息模板删除
export const delMessageTemplate = (params: any) => post('Msg/del', params)

// 消息模板上下架
export const OnSaleMessageTemplate = (params: any) => post('Msg/changeStatus', params)



// 获取消息通知列表
export const getNotificationList = (params: any) => post('Notification/index', params)

// 消息通知新增
export const configNotificatione = (params: any) => post(`Notification/add}`, params)

// 消息通知删除
export const delNotification = (params: any) => post('Notification/del', params)

// 消息通知开启关闭
export const OnChangeNotification = (params: any) => post('Notification/changeStatus', params)