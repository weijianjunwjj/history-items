import { useChatStore, useVideoUserStore } from '@/store'

const audioCall = computed(() => {
  return useChatStore().audioCall
})
const currentChat = computed(() => {
  return useChatStore().currentChat
})
const isBusy = computed(() => {
  return useVideoUserStore().isBusy
})

const currentUserProfile = computed(() => {
  return useVideoUserStore().currentUserProfile
})
const isLogin = computed(() => {
  return useVideoUserStore().isLogin
})
const isSDKReady = computed(() => {
  return useVideoUserStore().isSDKReady
})
const userID = computed(() => {
  return useVideoUserStore().userID
})
const userSig = computed(() => {
  return useVideoUserStore().userSig
})
const sdkAppID = computed(() => {
  return useVideoUserStore().sdkAppID
})
const showLoading = computed(() => {
  return !isSDKReady
})

export {
  audioCall,
  currentChat,
  isBusy,
  currentUserProfile,
  isLogin,
  isSDKReady,
  userID,
  userSig,
  sdkAppID,
  showLoading,
}
