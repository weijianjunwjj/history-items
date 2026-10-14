import axios from 'axios'

interface SubmitRepairData {
  id: string // 通话记录id
  remark: string
}

interface faceTimeInfoListItem {
  scene: string
  phone: string
}

export function getDeviceInfo(sn: any, phone: any) {
  return axios({
    url: `/qrcode/deviceFacetimeRecord/getFaceTimeInfo`,
    method: 'get',
    params: {
      scene: sn,
      phone,
    },
  })
}

// 提交保修单
export const SubmitRepair = (data: SubmitRepairData) => {
  const { id, remark } = data
  return axios({
    url: 'qrcode/deviceFacetimeRecord/updateRemark',
    method: 'post',
    data: { id, remark },
  })
}

// 定时任务更新客服状态
export const syncKfLogin = (userId?: string) =>
  axios({
    url: `/system/user/syncKfLogin/${userId}`,
    method: 'get',
  })

export const deviceFacetimeRecordList = () =>
  axios({
    url: '/qrcode/deviceFacetimeRecord/list',
    method: 'get',
  })
export const getListByDeviceId = (deviceId?: string) =>
  axios({
    url: `/qrcode/deviceFacetimeRecord/getListByDeviceId/${deviceId}`,
    method: 'get',
  })
// 获取通话记录
export const getListByUserId = (userId?: string) =>
  axios({
    url: `/qrcode/deviceFacetimeRecord/getListByUserId/${userId}`,
    method: 'get',
  })
export const getFaceTimeInfoList = (data: any) =>
  axios({
    url: `/qrcode/deviceFacetimeRecord/getFaceTimeInfoList`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json', // 如果写成contentType会报错
    },
  })

export const deviceFacetimeRecordById = (id?: string) =>
  axios({
    url: `/qrcode/deviceFacetimeRecord/byId?id=${id}`,
    method: 'get',
  })

export const deviceHistoryList = (params) =>
  axios({
    url: `/qrcode/deviceFacetimeRecord/list`,
    method: 'get',
    params,
  })
