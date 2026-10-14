import { http } from '@/utils/http'


//查询动态的评论
export const getCommentPostComment = (params: any) => {
    return http.get('/Comment/postComment', params)
}

//查询评论的子评论
export const getCommentCommentComment = (params: any) => {
    return http.get('/Comment/commentComment', params)
}

//删除评论
export const CommentDel = (params: any) => {
    return http.post('/Comment/del', params)
}

//点赞评论
export const CommentLike = (params: any) => {
    return http.post('/Comment/like', params)
}

//新增评论
export const CommentAddPostComment = (params: any) => {
    return http.post('/Comment/addPostComment', params)
}