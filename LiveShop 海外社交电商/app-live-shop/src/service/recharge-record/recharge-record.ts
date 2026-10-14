import { http } from '@/utils/http'

// 充值列表
export const getRechargeOrderIndex = (params: any) => {
  return http.post('/RechargeOrder/index', params)
}
// 充值列表
export const addCoin = (params: any) => {
  return http.post('/order/recharge/create', params)
}
// 充值详情
export const rechargeOrderDetail = (orderSn: string) => {
  return http.post('/RechargeOrder/detail', {orderSn})
}
