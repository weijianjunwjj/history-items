import { request } from '@/utils'

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
}
export default {
  getList: (data) => request.post('/siteInfo/findListByParam', data),
  delSiteInfo: (data) =>
    request.post('/siteInfo/delSiteInfo', data, {
      headers,
    }),
  markStatus: (data) =>
    request.post('/siteInfo/markStatus', data, ),
  updateList: (data) =>
    request.post('/siteInfo/updateSiteInfo', data, ),
  exportListURL: '/siteInfo/exportListByParam',
}
