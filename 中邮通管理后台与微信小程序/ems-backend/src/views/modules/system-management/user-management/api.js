import { request } from '@/utils'

export default {
  getList: (data) => request.post('/user/getList', data),
  searchList: (data) => request.post('/user/getList/search/admin', data),
  addList: (data) => request.post('/user/insertUser', data),
  delList: (userId) => request.get('/user/delete', { params: { userId } }),
  changeStatus: (userId) =>
    request.get('/user/ChangeStatus', { params: { userId } }),
  updateUserInfo: (data) => request.post('/user/updateUserInfo', data),
}
