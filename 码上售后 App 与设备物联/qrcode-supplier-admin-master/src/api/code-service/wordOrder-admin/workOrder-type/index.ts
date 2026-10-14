import { defaultRequest } from '@hx/packages/service/request'

const get = (url: string) => {
  return `qrcode${url}`
}

export function getList(params: any) {
  return defaultRequest.post({
    url: get('/workTicketType/list'),
  })
}
export function delList(id: any) {
  return defaultRequest.post({
    url: get(`/workTicketType/delete/${id}`),
  })
}
export function addList(data: any) {
  return defaultRequest.post({
    url: get(`/workTicketType/add`),
    data,
  })
}
export function updateList(data: any) {
  return defaultRequest.post({
    url: get(`/workTicketType/update`),
    data,
  })
}

export function getList2(params: any) {
  return defaultRequest.get({
    url: get(`/deviceFacetimeRecord/getTenantList`),
    params,
  })
}
