import { defaultRequest } from '@hx/packages/service/request'

// dashboard全量数据
export function getTotalData() {
  return defaultRequest.get({
    url: 'qrcode/dashboard/totalData',
  })
}

// dashboard动态数据
export function getDynamicData(params: any) {
  return defaultRequest.get({
    url: 'qrcode/dashboard/dynamicData',
    params,
  })
}

// dashboard报修分析
export function getRepairReportData() {
  return defaultRequest.get({
    url: 'qrcode/dashboard/repairReportData',
  })
}

// dashboard报修分析
export function getUserReportData() {
  return defaultRequest.get({
    url: 'qrcode/dashboard/userReportData',
  })
}
