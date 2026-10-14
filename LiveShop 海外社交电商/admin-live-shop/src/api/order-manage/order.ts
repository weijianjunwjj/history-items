import { post } from '@/http/request'

// 充值订单列表
export const getRechargeOrderList = (params: any) => post('/RechargeOrder/index', params)

/**
 * 众筹、拼团、商品订单列表
 * @returns
 */
export const getGroupOrderList = (params: any) => post('/GroupOrder/index', params)


//商品订单列表
export const getGroupOrderGoodsList = (params: any) => post('/GroupOrder/goods/index', params)


//众筹订单列表
export const getGroupOrderCrowdList = (params: any) => post('/GroupOrder/crowd/index', params)


//拼团订单列表
export const getGroupOrderGroupList = (params: any) => post('/GroupOrder/group/index', params)


//订单退款审核
export const onGroupOrderRefundAudit = (params: any) => post('/GroupOrder/refundAudit', params)

//设置物流状态
export const changeShippintStatus = (params: any) => post('/GroupOrder/changeShippingStatus', params)
