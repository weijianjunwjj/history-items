import { http } from '@/utils/http'

// 兑换列表
export const getGroupOrderFinish = (params: any) => {
    return http.post('/groupOrder/finished', params)
}