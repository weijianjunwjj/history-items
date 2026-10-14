import { http } from '@/utils/http'

export const getGroupActivity = (params) => {
  return http.post('/activity/group',params)
}
export const getGroupActivityDetail = (params) => {
  return http.post('/activity/detail',params)
}
export const createOrderGroup = (params) => {
  return http.post('/order/group/create',params)
}
export const orderPay = (params) => {
  return http.post('/order/pay',params)
}

