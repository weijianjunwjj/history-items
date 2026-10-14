// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'

export interface MessageRecord {
  id: number
  type: string
  title: string
  subTitle: string
  avatar?: string
  content: string
  time: string
  status: 0 | 1
  messageType?: number
}
export type MessageListType = MessageRecord[]

export function queryMessageList() {
  return defaultRequest.post<MessageListType>({ url: '/api/message/list' })
}

interface MessageStatus {
  ids: number[]
}

export function setMessageStatus(data: MessageStatus) {
  return defaultRequest.post<MessageListType>({
    url: '/api/message/read',
    params: data,
  })
}

export interface ChatRecord {
  id: number
  username: string
  content: string
  time: string
  isCollect: boolean
}

export function queryChatList() {
  return defaultRequest.post<ChatRecord[]>({ url: '/api/chat/list' })
}
