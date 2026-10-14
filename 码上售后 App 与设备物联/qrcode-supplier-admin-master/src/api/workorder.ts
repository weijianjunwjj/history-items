// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

export interface OrderListData {
  deviceId?: number
  deviceSn?: string
  deviceCustomerId?: number
  ticketType?: string
  ticketState?: 1 | 2 | 3
  ticketResultState?: 0 | 1
  ticketAttitudeState?: number
  ticketAttitudeTime?: string
  reporterId?: number
  reporterPhone?: string
  engineerId?: number
  source?: number
  createBy?: number
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  orderBy?: string
}

export interface OrderListRes {
  items: {
    createTime: string
    deviceCustomer: string
    deviceCustomerId: number | string
    deviceId: number | string
    deviceImage: string
    deviceName: string
    deviceSn: string
    engineerId: number | string
    engineerName?: string
    engineerPhone?: number
    id: number | string
    reporterId: number | string
    reporterPhone: number | string
    source: number | string
    ticketContent: string
    ticketRecommend: string
    ticketResultContent: string
    ticketResultState: number
    ticketState: number
    ticketType: string
  }
  total: number
}

// 获取工单列表
export function getWorkOrderList(params: OrderListData) {
  return defaultRequest.get<OrderListRes>({
    url: `/qrcode/work-ticket/list?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
  })
}

export interface OrderTypesRes {
  data: {
    DEVICE_DOUBT: string
    DEVICE_FAULT: string
  }
}

// 查询工单类型列表
export function getWorkOrdeTypes() {
  return defaultRequest.get<OrderTypesRes>({ url: '/qrcode/work-ticket/types' })
}

// 查询工程师列表
export function getEngineerList() {
  return defaultRequest.get({
    url: '/system/user/listByRoleCode?roleCode=engineer',
  })
}

export interface OrderDetailData {
  id: string
}

// 查询工单详情
export function getOrderDetail(params: OrderDetailData) {
  return defaultRequest.get({ url: `/qrcode/work-ticket/get/${params.id}` })
}

export interface OrderData {
  deviceId: number | string
  ticketType: string
  ticketMode: number
  ticketContent: string
  engineerId: number | string
  ticketRecommend: string
}
// 新增工单
export function postOrder(data: OrderData) {
  return defaultRequest.post({ url: '/qrcode/work-ticket/add', params: data })
}

// 导出数据
export function postExport(data: any) {
  // return axios.post('/qrcode/work-ticket/export', responseType: 'blob',)
  return defaultRequest.post({
    url: '/qrcode/work-ticket/export',
    params: data,
    // 这里设置请求返回数据为blob
    responseType: 'blob',
  })
}

export interface UploadData {
  file: any
  folder?: string
  retainName?: string
}

// 上传图片
export function postUpload(data: UploadData, configs: object) {
  return defaultRequest.post(
    {
      url: '/file/upload',
      params: data,
    },
    { ...configs }
  )
}

export interface CloseOrderData {
  id: string | number
  ticketResultState: 0 | 1
  ticketResultContent?: ''
  ticketResultImages?: ''
  ticketResultVideo?: ''
}

// 关闭工单
export function postCloseOrder(data: CloseOrderData) {
  return defaultRequest.post({ url: '/qrcode/work-ticket/close', params: data })
}

export interface DispatchOrderData {
  id: number
  engineerId: number
  ticketRecommend: string
}

// 派发工单
export function postDispatchOrder(data: DispatchOrderData) {
  return defaultRequest.post({
    url: '/qrcode/work-ticket/dispatch',
    params: data,
  })
}

export interface DeleteOrderData {
  id: number
}

// 删除工单
export function deleteOrder(params: DeleteOrderData) {
  return defaultRequest.get({ url: `/qrcode/work-ticket/delete/${params.id}` })
}

// 查询公司列表
export function getcustomerList() {
  return defaultRequest.get({ url: '/qrcode/customer/list' })
}
