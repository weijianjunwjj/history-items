import { request } from '@/utils'

export default {
  getList: (data) => request.post('/tools/stationActive/findActiveList', data),
  active: (data) => request.post('/tools/stationActive/batchActive', data),
  findByMd5: (data) => request.post('/tools/stationActive/findByMd5', data),
  exportListURL:'/tools/stationActive/exportActive'
}
