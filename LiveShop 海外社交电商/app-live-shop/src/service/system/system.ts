import { http } from '@/utils/http'

//系统公告
export const getNotifybulletin = (params: any) => {
  return http.post('/Notify/bulletin', params)
}

//系统消息通知列表
export const getNotifyIndex = (params: any) => {
  return http.post('/Notify/index', params)
}

//系统消息一键清除
export const clearNotifyNum = (params: any) => {
  return http.post('/Notify/isReadAll', params)
}