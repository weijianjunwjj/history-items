import { http } from '@/utils/http'

// 地区信息列表
export const getAddresslocation = () => {
    return http.get('/address/location')
}

// 地址列表
export const getAddressList = (params: any) => {
    return http.post('/address/index', params)
}

// 地址添加
export const addressAdd = (params: any) => {
    return http.post('/address/add', params)
}

// 地址编辑
export const addressEdit = (params: any) => {
    return http.post('/address/edit', params)
}

// 地址删除
export const addressDel = (params: any) => {
    return http.post('/address/del', params)
}

// 新增/编辑
export const configAddress = (params: any) => {
    return http.post(`/address/${params.id ? 'edit' : 'add'}`, params)
}
