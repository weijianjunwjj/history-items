import { request } from '@/utils'
export default {
  getList: (data) => request.post('/order/manage/findOrdersByParam', data),
  getServiceArea: (params) => request.get('/serviceArea/findRoleAreaByUid', {params}),
  exportList: (params) => request.get('/order/manage/exportOrdersByParam', {params}),
  exportListURL: '/order/manage/exportOrdersByParam',
  compare:  (data) => request.post('/tools/file/compare', data,{
    headers:{
      'Accept': '*/*',
      // 'content-type':'application/x-www-form-urlencoded'
    }
  }),
}
