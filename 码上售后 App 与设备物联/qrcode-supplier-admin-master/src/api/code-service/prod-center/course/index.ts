import { defaultRequest } from '@hx/packages/service/request'

export function getGuideList(params: any) {
  return defaultRequest.get({
    url: 'product/guide/guide/list',
    params,
  })
}

// 新增教程
export function addGuideList(data: any) {
  return defaultRequest.post({
    url: 'product/guide/guide/add',
    data,
  })
}

// 获取教程详情
export function getGuideInfo(params: any) {
  return defaultRequest.get({
    url: `product/guide/guide/byId`,
    params: {
      id: params,
    },
  })
}

// 修改教程
export function updateGuide(data: any) {
  return defaultRequest.post({
    url: 'product/guide/guide/update',
    data,
  })
}

// 删除教程
export function delGuides(data: any) {
  return defaultRequest.post({
    url: 'product/guide/guide/delete',
    data: [...data],
  })
}

// 导出教程
export const exportGuide = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'product/guide/guide/export', params, method: 'POST' },
    title
  )
}
