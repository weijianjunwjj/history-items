import { http } from '@/utils/http'

// 预约活动列表
export const getActivityBookingList = (params: any) => {
    return http.post('/activity/booking', params)
}

// 查询动态列表(看自己or看别人)
export const getPostIndexList = (params: any) => {
    return http.get('/Post/index', params)
}

//查询动态列表(社区版)
export const getPostCommunityList = (params: any) => {
    return http.get('/Post/community', params)
}

//查询动态详情
export const getPostDetail = (params: any) => {
    return http.get(`/Post/${params}`)
}

// 动态新增
export const onPostAdd = (params: any) => {
    return http.post('/Post/add', params)
}

// 动态编辑
export const onPostEdit = (params: any) => {
    return http.post('/Post/edit', params)
}

// 动态删除
export const onPostDel = (params: any) => {
    return http.post('/Post/del', params)
}

// 动态点赞
export const onPostLike = (params: any) => {
    return http.post('/Post/like', params)
}

// 发布---> 热门话题&&查询话题
export const getHotTopicList = (params: any) => {
    return http.get('/Topic/list', params)
}

// 字典查询
export const getDictSn = (params: any) => {
    return http.get('/Dictionary/getDictSn', params)
}



