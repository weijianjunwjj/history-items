import { request } from '@/utils'
const url = window.$api_test2 || ''
export default {
  //查询下单出账的今昨数据
  findBillManageDataByDay: (data) => request.post( url + '/billManage/findBillManageDataByDay', data),
  //查询下单/出账本/上月数据
  findBillManageDataByMonth: (data) => request.post(url + '/billManage/findBillManageDataByMonth', data),
  //查询下单/出账指定时间列表
  findBillManageDataList: (data) => request.post(url + '/billManage/findBillManageDataList', data),
}
