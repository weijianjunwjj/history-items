import {http} from '@/utils/http'

// 我的关注
export const getUserIndex = (params: { page?: number; pageSize?: number; userId: number }) => {
  return http.post('/User/following', params)
}
// 我的粉丝
export const getUserFans = (params: { page?: number; pageSize?: number; userId: number }) => {
  return http.post('/User/fans', params)
}
// 我的好友
export const getUserFriend = (params: { page: number; pageSize: number }) => {
  return http.post('/User/friend', params)
}
export const getFollowFans = (userId:number) => {
  return http.post('/User/followFans', {userId})
}

export const getUserPhotos = (params: { userId: number; page: number; pageSize: number }) => {
  return http.get('/Photo/index', params)
}
export const addUserPhotos = (imgUrl:string) => {
  return http.post('/Photo/add', {imgUrl: imgUrl})
}

export const delUserPhotos = (id:number) => {
  return http.post('/Photo/del', {id: id})
}

export const getPostIndex = (visitedId: number) => {
  return http.get('/Post/index', { visitedId })
}

