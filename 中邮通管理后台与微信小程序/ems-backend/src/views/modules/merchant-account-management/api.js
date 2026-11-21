import { request } from '@/utils'
export default {
  getList: (params) => request.get(window.$api_test2 || '' + '/serviceArea/findMerchantAccountList', { params }),
}
