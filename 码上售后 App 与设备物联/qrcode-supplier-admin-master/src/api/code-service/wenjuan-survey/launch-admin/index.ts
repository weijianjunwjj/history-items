import { defaultRequest } from '@hx/packages/service/request'

// 问卷列表
export function getQuestionList(params: any) {
  return defaultRequest.get({
    url: '/qrcode/satisfaction/list',
    params,
  })
}

// 导入excel形式发送满意度调查问卷
export function importSatisfaction(data: any, configs: any) {
  return defaultRequest.post({
    url: 'qrcode/satisfaction/import',
    params: data,
    ...configs,
  })
}

// 发送满意度调查问卷
export function sendSatisfaction(data: any) {
  return defaultRequest.post({
    url: 'qrcode/satisfaction/send',
    params: data.phone,
  })
}

// 满意度问卷列表
export function getExamList(params: any) {
  return defaultRequest.get({
    url: '/qrcode/satisfaction/exam/list',
    params,
  })
}

// 问卷统计报表
export function getReportList(params: any) {
  return defaultRequest.get({
    url: '/qrcode/satisfaction/report',
    params,
  })
}

// 问卷统计报表
export function getProposalList(params: any) {
  return defaultRequest.get({
    url: '/qrcode/satisfaction/suggesstion/list',
    params,
  })
}

// 导出数据
export const postExport = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'qrcode/satisfaction/export', params, method: 'GET' },
    title
  )
}

// 填写率统计
export function getFillingRate(params: any) {
  return defaultRequest.get({
    url: '/qrcode/satisfaction/suggesstion/count',
    params,
  })
}
