import { http } from '@/utils/http'

// 充值列表
export const getUserCoinIndex = (params: any) => {
  return http.post('/UserCoin/index', params)
}
