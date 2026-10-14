import { defineStore } from 'pinia'
import TIM from 'tim-js-sdk/tim-js-friendship'
import { filterCallingMessage, titleNotify } from '@/utils/utils'
import tim from '@/plugins/tim'
import chatState from './types'

const useChatStore = defineStore('chat', {
  state: (): chatState => ({
    currentChat: {},
    currentMessageList: [],
    nextReqMessageID: '',
    isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
    chatList: [],
    chatLoading: true,
    callingInfo: {
      memberList: [],
      type: 'C2C', // C2C，GROUP
    },
    audioCall: false,
    isShowConversationList: false,
    selectedMessageList: [],
    relayType: 1, // 1: 转发  2: 逐条转发 3: 合并转发
    mergerMessageList: [],
    mergerMessage: {},
    relayMessage: {},
    selectMessage: false,
    deviceInfo: {},
    faceTimeInfoMap: {},
    tableData: [],
    tableLoading: false,
    current: Date.now(), // 当前时间
    intervalID: 0,
    statusMapper: {
      1: '已报修',
      2: '处理中',
      3: '已完成',
    },
    typeMapper: [{ label: '无法开机' }, { label: '异响' }, { label: '其他' }],
    callState: { '-1': '未接通', '0': '待接通', '1': '已接通' },
    callStateColor: { '-1': 'red', '0': 'gold', '1': 'green' },
    currentTableRadio: '',
    isCalling: false,
  }),
  getters: {
    hidden() {
      if (typeof document.hasFocus !== 'function') {
        return document.hidden
      }
      return !document.hasFocus()
    },
    toAccount: (state) => {
      if (!state.currentChat || !state.currentChat.conversationID) {
        return ''
      }
      switch (state.currentChat.type) {
        case 'C2C':
          return state.currentChat.conversationID.replace('C2C', '')
        case 'GROUP':
          return state.currentChat.conversationID.replace('GROUP', '')
        default:
          return state.currentChat.conversationID
      }
    },
    currentChatType: (state) => {
      if (!state.currentChat || !state.currentChat.type) {
        return ''
      }
      return state.currentChat.type
    },
    totalUnreadCount: (state) => {
      const result = state.chatList.reduce((count, conversation) => {
        // 当前会话不计算总未读
        if (
          !useChatStore().hidden &&
          state.currentChat.conversationID === conversation.conversationID
        ) {
          return count
        }
        return count + conversation.unreadCount
      }, 0)
      titleNotify(result)
      return result
    },
    // 用于当前会话的图片预览
    imgUrlList: (state) => {
      return state.currentMessageList
        .filter(
          (message) =>
            message.type === TIM.TYPES.MSG_IMAGE && !message.isRevoked
        ) // 筛选出没有撤回并且类型是图片类型的消息
        .map((message) => message.payload.imageInfoArray[0].url)
    },
  },
  actions: {
    update(key, value) {
      this[key] = value
    },
    updateCurrentTableRadio(id: string) {
      this.currentTableRadio = id
    },
    updateFaceTimeInfoMap(deviceInfoMap: { [key: string]: any }) {
      this.faceTimeInfoMap = deviceInfoMap
    },
    updateDeviceInfo(deviceInfo: object) {
      this.deviceInfo = deviceInfo
    },
    updateCallTableData(tableData: object[]) {
      this.tableData = tableData
      this.updateTableLoading(false)
    },
    /**
     * 显示trtcCalling 群通话成员列表
     * @param {Conversation} setCallingList
     */
    setCallingList(value: any) {
      this.callingInfo.memberList = value.memberList
      this.callingInfo.type = value.type
    },
    updateTableLoading(loading: boolean) {
      this.tableLoading = loading
      setTimeout(() => {
        this.tableLoading = false
      }, 3 * 1000)
    },
    startComputeCurrent() {
      this.intervalID = setInterval(() => {
        this.current = Date.now()
      }, 500)
    },
    stopComputeCurrent() {
      clearInterval(this.intervalID)
      this.intervalID = 0
    },
    resetSelectedMessage(value: any) {
      this.selectMessage = value
      this.selectedMessageList = []
    },
    /**
     * 重置当前会话
     * 调用时机：需要重置当前会话时，例如：当前会话是一个群组，正好被踢出群时（被踢群事件触发），重置当前会话
     * @param {Object} state
     */
    resetCurrentChat() {
      this.currentChat = {}
    },
    /**
     * 更新会话列表
     * 调用时机：触发会话列表更新事件时。CONVERSATION_LIST_UPDATED
     * @param {Object} state
     * @param {Conversation[]} chatList
     */
    updateChatList(chatList: object[]) {
      this.chatList = chatList
      this.updateChatLoading(false)
    },
    updateChatLoading(loading: boolean) {
      this.chatLoading = loading
    },
    /**
     * 将消息插入当前会话列表
     * 调用时机：收/发消息事件触发时
     * @param {Object} state
     * @param {Message[]|Message} data
     * @returns
     */
    pushCurrentMessageList(data: any) {
      // 还没当前会话，则跳过
      if (!this.currentChat.conversationID) {
        return
      }
      if (Array.isArray(data)) {
        // 筛选出当前会话的消息
        const result = data.filter(
          (item) => item.conversationID === this.currentChat.conversationID
        )
        this.currentMessageList = [...this.currentMessageList, ...result]
        filterCallingMessage(this.currentMessageList)
      } else if (data.conversationID === this.currentChat.conversationID) {
        this.currentMessageList = [...this.currentMessageList, data]
        filterCallingMessage(this.currentMessageList)
      }
    },
    /**
     * 获取消息列表
     * 调用时机：打开某一会话时或下拉获取历史消息时
     * @param {String} conversationID
     */
    getMessageList(conversationID: string) {
      const app = (window as any).$app
      if (this.isCompleted) {
        app.$message({
          message: '已经没有更多的历史消息了哦',
          type: 'info',
        })
        return
      }
      const { nextReqMessageID, currentMessageList } = this
      tim.getMessageList({ conversationID, nextReqMessageID, count: 15 }).then(
        (imReponse: {
          data: {
            nextReqMessageID: string
            isCompleted: boolean
            messageList: any
          }
        }) => {
          // 更新messageID，续拉时要用到
          this.nextReqMessageID = imReponse.data.nextReqMessageID
          this.isCompleted = imReponse.data.isCompleted
          // 更新当前消息列表，从头部插入
          this.currentMessageList = [
            ...imReponse.data.messageList,
            ...currentMessageList,
          ]
          filterCallingMessage(this.currentMessageList)
        }
      )
    },
    /**
     * 更新当前会话
     * 调用时机: 切换会话时
     * @param {chat} conversation
     */
    updateCurrentChat(chat: any) {
      this.currentChat = chat
      this.currentMessageList = []
      this.nextReqMessageID = ''
      this.isCompleted = false
    },
    /**
     * 切换会话
     * 调用时机：切换会话时
     * @param {Object} context
     * @param {String} conversationID
     */
    checkoutChat(conversationID: string) {
      this.resetSelectedMessage(false)
      // 1.切换会话前，将切换前的会话进行已读上报
      if (this.currentChat.conversationID) {
        const prevConversationID = this.currentChat.conversationID
        tim.setMessageRead({ conversationID: prevConversationID })
      }
      // 2.待切换的会话也进行已读上报
      tim.setMessageRead({ conversationID })
      // 3. 获取会话信息
      return tim.getConversationProfile(conversationID).then((p: any) => {
        const { data } = p
        // 3.1 更新当前会话
        this.updateCurrentChat(data.conversation)
        // 3.2 获取消息列表
        this.getMessageList(conversationID)
        // 3.3 拉取第一页群成员列表
        if (data.conversation.type === TIM.TYPES.CONV_GROUP) {
          return false
          // this.getGroupMemberList(data.conversation.groupProfile.groupID)
        }
        return Promise.resolve()
      })
    },
  },
})

export default useChatStore
