import { request } from '@/utils'
export default {
  getList: (data) => request.post('/role/getList', data),
  getAllList: (data) => request.post('/role/getRoleKindList', data),
  getAvailableAreaList: () => request.get('/serviceArea/getAvailableAreaList'),
  getAreaList: () => request.get('/serviceArea/getAreaList'),
  searchList: (data) => request.post('/role/getList/search', data),
  addList: (data) => request.post('/role/insert', data),
  updateList: (data) => request.post('/role/update', data),
  delList: (data) => request.post('/role/delete', data),
  getListByRoleMenu: (RoleId) => request.post(`/menu/getList/ByRole/${RoleId}`),
  getListNoPageMenu: () => request.post('/menu/getList/noPage', { pageSize: 1, pageNum: 10 }),
  changeMenuAccessByRole: (data) => request.post('/menu/changeMenuAccessByRole', data),
}
