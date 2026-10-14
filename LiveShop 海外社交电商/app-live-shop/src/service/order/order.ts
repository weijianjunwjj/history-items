import { http } from '@/utils/http'

// 积分明细列表
export const getIntegralIndex = (params: any) => {
  return http.post('/integral/index', params)
}
// 订单详情
export const getOrderDetail = (params: any) => {
  return http.post('/order/detail', params)
}
export const getGroupOrder = (params: any) => {
  return http.post('/groupOrder/index', params)
}
export const cancelOrder = (orderSn) => {
  return http.post('/order/cancel', {orderSn})
}
export const changeOrderAddr = (params) => {
  return http.post('/order/changeAddr', params)
}
export const refundApply = (params) => {
  return http.post('/groupOrder/refundApply', params)
}

export const paypalCreate = (params) => {
  return http.post('/RechargeOrder/paypal/create', params)
}
export const paypalCapture = (params) => {
  return http.post('/RechargeOrder/paypal/capture', params)
}


export const confirmGooglePay = (params) => {
  return http.post('/RechargeOrder/googlepay/confirm', params)
}







