import { http } from '@/utils/http'

// 众筹活动列表
export const getActivityCrowdList = (params: any) => {
    return http.post('/activity/crowd', params)
}

// 众筹活动详情
export const getCrowdActivityDetail = (params: any) => {
    return http.post('/activity/detail', params)
}

// 众筹下单
export const createOrderCrowd = (params: any) => {
    return http.post('/order/crowd/create', params)
}

// 活动预约
export const activityBook = (params: any) => {
    return http.post('/activity/book', params)
}

// 活动取消预约
export const activityCancelBook = (params: any) => {
    return http.post('/activity/cancelBook', params)
}

// 我的活动
export const getActivityMine = (params: any) => {
    return http.post('/activity/mine', params)
}


