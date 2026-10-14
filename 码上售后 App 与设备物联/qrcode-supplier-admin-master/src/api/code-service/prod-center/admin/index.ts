import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

// 获取产品管理列表
export function getProductList(params: any) {
  return defaultRequest.get({
    url: `product/product/list?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 获取产品管理列表无分页
export function getProductSimpleList(params: any) {
  return defaultRequest.get({
    url: `product/product/simple-list?${qs.stringify(params, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 新增产品管理
export function addProductList(data: any) {
  return defaultRequest.post({
    url: 'product/product/add',
    data,
  })
}

// 删除产品管理
export function delProducts(data: any) {
  return defaultRequest.post({
    url: 'product/product/delete',
    data: [...data],
  })
}

// 获取产品详情
export function getProductInfo(params: any) {
  return defaultRequest.get({
    url: `product/product/byId`,
    params: {
      id: params,
    },
  })
}

// 修改产品管理
export function updateProducts(data: any) {
  return defaultRequest.post({
    url: 'product/product/update',
    data,
  })
}

// 导出产品管理
export const exportProdAdmin = async (params: any, title: string) => {
  defaultRequest.download<any>(
    { url: 'product/product/export', params, method: 'POST' },
    title
  )
}

// 获取常见问题
export function getFAQList(params: any) {
  return defaultRequest.get({
    url: `product/faq/list`,
    params: {
      id: params,
    },
  })
}
