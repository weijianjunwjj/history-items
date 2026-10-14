import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

export function scanRecordList(params: any) {
  return defaultRequest.get({
    url: `qrcode/scanRecord/list`,
    params,
  })
}
export function getDeviceFacetimeRecordList(params: any) {
  return defaultRequest.get({
    url: `qrcode/deviceFacetimeRecord/list`,
    params,
  })
}

export function getDeviceFacetimeRecordListByUid(uid: any, params: any) {
  return defaultRequest.get({
    url: `qrcode/deviceFacetimeRecord/getListByUid/${uid}`,
    params,
  })
}
