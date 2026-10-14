import { defaultRequest } from '@hx/packages/service/request'

// 查询二维码批次列表
export function listTemplate() {
  return defaultRequest.get({
    url: '/qrcode/template/list',
  })
}

// 查询二维码批次详细
export function getTemplate(id: string) {
  return defaultRequest.get({
    url: `/qrcode/template/get/${id}`,
  })
}

// 新增二维码批次
export function addTemplate(data: object) {
  return defaultRequest.post({
    url: '/qrcode/template/add',
    data,
  })
}

// 修改二维码批次
export function updateTemplate(data: object) {
  return defaultRequest.post({
    url: '/qrcode/template/update',
    data,
  })
}

// 删除二维码批次
export function delTemplate(id: string) {
  return defaultRequest.post({
    url: `/qrcode/template/delete/${id}`,
  })
}

export default {
  listTemplate,
  getTemplate,
  addTemplate,
  updateTemplate,
  delTemplate,
}
