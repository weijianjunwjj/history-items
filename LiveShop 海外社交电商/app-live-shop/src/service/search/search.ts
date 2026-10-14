import { http } from '@/utils/http'

// 搜索列表
export const getSearchIndex = (params: any) => {
  return http.post('/Search/user', params)
}
// 关注
export const followUser = (userId: number) => {
  return http.post('/UserRelation/follow', {userId})
}
// 取关
export const unFollowUser = (userId: number) => {
  return http.post('/UserRelation/unfollow', {userId})
}


