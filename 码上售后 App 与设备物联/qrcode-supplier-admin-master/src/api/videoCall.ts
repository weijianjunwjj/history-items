// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'

interface SubmitRepairData {
  id: string // 通话记录id
  remark: string
}

interface faceTimeInfoListItem {
  scene: string
  phone: string
}

export function getDeviceInfo(sn: any, phone: any) {
  return defaultRequest.get({
    url: `/qrcode/deviceFacetimeRecord/getFaceTimeInfo`,
    params: {
      scene: sn,
      phone,
    },
  })
}

// 提交保修单
export const SubmitRepair = (data: SubmitRepairData) => {
  const { id, remark } = data
  return defaultRequest.post({
    url: 'qrcode/deviceFacetimeRecord/updateRemark',
    params: { id, remark },
  })
}

// 定时任务更新客服状态
export const syncKfLogin = (userId?: string) =>
  defaultRequest.get({
    url: `/system/user/syncKfLogin/${userId}`,
  })

export const deviceFacetimeRecordList = () =>
  defaultRequest.get({
    url: '/qrcode/deviceFacetimeRecord/list',
  })
export const getListByDeviceId = (deviceId?: string) =>
  defaultRequest.get({
    url: `/qrcode/deviceFacetimeRecord/getListByDeviceId/${deviceId}`,
  })
// 获取通话记录
export const getListByUserId = (userId?: string) =>
  defaultRequest.get({
    url: `/qrcode/deviceFacetimeRecord/getListByUserId/${userId}`,
  })
export const getFaceTimeInfoList = (data: any) =>
  defaultRequest.post({
    url: `/deviceFacetimeRecord/getFaceTimeInfoList`,
    params: data,
    headers: {
      'Content-Type': 'application/json', // 如果写成contentType会报错
    },
  })
