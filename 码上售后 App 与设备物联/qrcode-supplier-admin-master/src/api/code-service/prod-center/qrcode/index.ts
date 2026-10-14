import { defaultRequest } from '@hx/packages/service/request'

const req = defaultRequest

const get_url = (url: string) => `/qrcode${url}`

export default {
  batchList: (params: any) => req.get({ url: get_url('/batch/list'), params }),
  batchAdd: (data: any) =>
    req.post({ url: get_url('/batch/add'), data, timeout: 60000 }),
  countQrcode: () => req.get({ url: get_url('/qrcode/countQrcode') }),
  listTemplate: () => req.get({ url: get_url('/template/list') }), // 查询二维码批次列表
  // 二维码详情
  detailList: (params: any) =>
    req.get({ url: get_url('/qrcode/list'), params }),
  bindQrcode: (data: any) => req.post({ url: get_url('/qrcode/bind'), data }),
  unbindQrcode: (data: any) =>
    req.post({ url: get_url('/qrcode/unbind'), data }),
}

export function getQrcodeQuota(tenantId: any) {
  return defaultRequest.get({
    url: 'tenant/tenantConfig/getQrcodeQuotaByTenantId',
    params: { tenantId },
  })
}
