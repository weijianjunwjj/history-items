import { http } from '@/utils/http'

// 查询广告位的广告
export const getAdvertisementLocation = (params: any) => {
    return http.get('/Advertisement/location', params)
}