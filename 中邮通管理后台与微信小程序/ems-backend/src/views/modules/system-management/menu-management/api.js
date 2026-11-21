import { request } from '@/utils'
export default {
  getList: (data) => request.post('/menu/getList/noPage', data),
  // getList: (data) => request.post('/menu/asideMenus', data),
  delList: (data) => request.post('/menu/delete', data),
  addMenu: (data) => request.post('/menu/insert', data),
  updateMenu: (data) => request.post('/menu/update', data),
  listParent: () => request.post('/menu/listParent', ),
  getRoleKindList: () => request.post('/role/getRoleKindList', ),
  getListPerm: () => request.post('/perm/getList', ),
}
