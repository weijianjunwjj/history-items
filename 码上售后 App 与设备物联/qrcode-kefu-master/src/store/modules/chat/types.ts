export default interface ConversationState {
  currentChat?: any
  currentMessageList: any[]
  nextReqMessageID: string
  isCompleted: boolean
  chatList: any[]
  chatLoading: boolean
  callingInfo: any
  audioCall: boolean
  isShowConversationList: boolean
  selectedMessageList: any[]
  relayType: number // 1: 转发  2: 逐条转发 3: 合并转发
  mergerMessageList: any[]
  mergerMessage: object
  relayMessage: object
  selectMessage: false
  deviceInfo: any
  faceTimeInfoMap: { [key: string]: any }
  tableData: any[]
  tableLoading: boolean
  current: any
  intervalID: any
  statusMapper: object
  typeMapper: any[]
  callState: object
  callStateColor: object
  currentTableRadio: string
  isCalling: boolean
}
