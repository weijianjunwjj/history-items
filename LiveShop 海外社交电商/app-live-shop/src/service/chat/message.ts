import {http} from "@/utils/http";

export const getMessageList = async (nim, param?) => {
  let data: object;
  if (!param.anchorMessage) {
    data = {
      conversationId: param.conversationId,
      limit: 100,
      direction: 1
    }
  } else {
    data = {
      conversationId: param.conversationId,
      limit: 100,
      anchorMessage: param.anchorMessage,
      direction: 1
    }
  }
  try {
    // console.log('data', data)
    const message = await nim.V2NIMMessageService.getMessageList(data)
    // console.log('获取消息列表:::', message)
    message.forEach(item => {
      if (item.messageType === 2) {
        item.audioTime = item.attachment.duration
      }
    })
    return message.reverse()
  } catch (err) {
    console.error('errorMessage:', err)
  }
}
export const getGender = (id: string) => {
  return http.get(`/User/session/gender?session_id=${id}`)
}
export const getAvatarFromAccId = (list: any) => {
  return http.post('/User/avatar', {accId: list})
}
export const getUserIdFromAccId = (list: any) => {
  return http.post('/User/id', {accId: list})
}
// 获取会话分组
export const getMessageListAll = (accId)=>{
  return http.get(`/Im/session/group/All?accId=${accId}`)
}
//清除未读消息
export const unreadMessages = async (nim, conversationId) => {
  await nim.V2NIMConversationService.clearUnreadCountByIds([conversationId])
}
// 获取分组对应的未读数
export const getAllUnreadMessageCount = (arrays) => {
  let num = 0
  arrays.forEach(item => {
    num += item.unreadCount
  })
  return num
}
// 查询备注
export const getRemark = (id: number) => {
  return http.post('/UserRemark/query', {friendId: id})
}
// 查询备注
export const addRemark = (id: string | number, remark: string) => {
  return http.post('/UserRemark/add', {friendId: Number(id), remark: remark})
}
// 查询备注
export const updateRemark = (id: string | number, remark: string) => {
  return http.post('/UserRemark/edit', {friendId: Number(id), remark: remark})
}
// 查询当前用户可以发几条免费消息
export const freeMessageCount = (followId:  number) => {
  return http.post('/User/chat/free', {followId: followId})
}
