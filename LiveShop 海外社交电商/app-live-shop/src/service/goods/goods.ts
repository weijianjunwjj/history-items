import { http } from '@/utils/http'

// 商品类目
export const getCategoryIndex = (params: any) => {
    return http.post('/Category/index', params)
}

// 商品列表
export const getProductIndex = (params: any) => {
    return http.post('/Product/index', params)
}

// 商品详情
export const getProductDetails = (params: any) => {
    return http.get('/Product/details', params)
}

// 商品详情弹框
export const getProductDetailsPopup = (params: any) => {
    return http.post('/Product/details/popup', params)
}

// 商品规格信息
export const getProductDetailsSpec = (params: any) => {
    return http.post('/Product/details/spec', params)
}

// 商品下单
export const createProductOrder = (params: any) => {
    return http.post('/order/product/create', params)
}

