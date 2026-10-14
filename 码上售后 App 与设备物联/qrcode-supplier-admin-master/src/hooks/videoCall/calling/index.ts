import { formatDuration } from '@/utils/utils'
import { userID } from '@/hooks/videoCall'
import { useChatStore, useVideoUserStore } from '@/store'

const mydata: any = reactive({
  // typeMapper,
  params: {
    type: '',
    desc: '',
  },
  // statusMapper,
  timer: null,
  timeout: null,
  callType: 1, // 1:audio，2:video
  // Trtc: undefined,
  isCamOn: true,
  isMicOn: true,
  isInvitedMicOn: true,
  maskShow: false,
  isLocalMain: true, // 本地视频是否是主屏幕显示
  start: 0,
  // end: 0,
  duration: 0,
  hangUpTimer: 0, // 通话计时id
  // ready: false,
  dialling: false, // 是否拨打电话中
  calling: false, // 是否通话中
  isDialled: false, // 是否被呼叫
  inviteID: '',
  inviteData: {},
  sponsor: '', // 发起者
  sn: '',
  invitedUserID: [], // 被邀请者
  // invitedNick: '',
  invitedUserInfo: [],
  defaultAvatar:
    'https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-3.png',
  viewLocalDomID: '',
  callingUserList: [], // 参加通话的人 ,不包括自己
  callingType: 'C2C', // 区分多人和C2C通话的UI样式
  isStartLocalView: false, // 本地是否开启
  callingTips: {
    callEnd: 1, // 通话结束
    callTimeout: 5,
  },
  deviceVO: {},
  repairRecordDtos: [],
  repairUserDto: {},
  fullBtn: false,
})

const toAccount = computed(() => {
  return useChatStore().toAccount
})
const currentChatType = computed(() => {
  return useChatStore().currentChatType
})
const currentChat = computed(() => {
  return useChatStore().currentChat
})
const callingInfo = computed(() => {
  return useChatStore().callingInfo
})

const currentUserProfile = computed(() => {
  return useVideoUserStore().currentUserProfile
})

const formatDurationStr = computed(() => {
  return formatDuration(mydata.duration)
})

const myAvatar = computed(() => {
  return currentUserProfile.value.avatar || mydata.defaultAvatar
})

const myNick = computed(() => {
  return currentUserProfile.value.nick || userID.value
})

export {
  mydata,
  toAccount,
  currentChatType,
  currentChat,
  callingInfo,
  currentUserProfile,
  formatDurationStr,
  myAvatar,
  myNick,
}
