import { http } from '@/utils/http'

// 充值列表
export const getCoinIndex = (params: any) => {
  return http.get('/Coin/index', params)
}
