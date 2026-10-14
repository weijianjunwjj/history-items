import { defaultRequest } from '@hx/packages/service/request'

// 获取父级产品分类
export function getProdCateParent() {
  return defaultRequest.get({
    url: 'product/industry/list',
  })
}

// 获取子级产品分类
export function getProdCateChild(params: { id: string }) {
  return defaultRequest.get({
    url: 'product/productCategory/list',
    params: {
      parentIndustryId: params.id,
    },
  })
}

// 新增产品分类
export function postAddProdCate(data: object) {
  return defaultRequest.post({
    url: 'product/productCategory/add',
    data,
  })
}

// 查询父级id
export function postParentIds(data: { id: string }) {
  return defaultRequest.post({
    url: `product/productCategory/getParentIds/${data.id}`,
  })
}

// 删除产品分类
export function deleteAddProdCate(data: any) {
  return defaultRequest.post({
    url: 'product/productCategory/deleteByIds',
    data: [...data],
  })
}

// 修改产品类别
export function putPrdoCate(data: object) {
  return defaultRequest.put({
    url: 'product/productCategory/update',
    data,
  })
}

// 导出产品类别
export const downloadReq = async (params: any, title: string) =>
  defaultRequest.download<any>(
    { url: 'product/productCategory/download', params, method: 'GET' },
    title
  )
