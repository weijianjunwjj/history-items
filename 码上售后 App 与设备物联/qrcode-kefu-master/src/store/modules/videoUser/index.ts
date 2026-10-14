import tim from '@/plugins/tim'
import { defineStore } from 'pinia'
import useChatStore from '@/store/modules/chat'

const videoUser = defineStore('videoUser', {
  state: () => ({
    currentUserProfile: {},
    isLogin: false,
    isSDKReady: false, // TIM SDK 是否 ready
    userID: 0,
    userSig: '',
    sdkAppID: 0,
    videoRoom: 0,
    isBusy: false,
  }),
  actions: {
    GENERATE_VIDEO_ROOM(videoRoom: any) {
      if (videoRoom) {
        this.videoRoom = videoRoom
      } else {
        this.videoRoom = Math.ceil(Math.random() * (2 ** 32 - 1))
      }
    },
    UPDATE_ISBUSY(isBusy: any) {
      this.isBusy = isBusy
    },
    updateCurrentUserProfile(userProfile: object) {
      this.currentUserProfile = userProfile
    },
    toggleIsLogin(isLogin?: any) {
      this.isLogin = typeof isLogin === 'undefined' ? !this.isLogin : isLogin
    },
    toggleIsSDKReady(isSDKReady: any) {
      this.isSDKReady =
        typeof isSDKReady === 'undefined' ? !this.isSDKReady : isSDKReady
    },
    reset() {
      this.currentUserProfile = {}
      this.isLogin = false
      this.isSDKReady = false
      this.userID = 0
    },
    GET_USER_INFO(payload: {
      userID: number
      userSig: string
      sdkAppID: number
    }) {
      this.userID = payload.userID
      this.userSig = payload.userSig
      this.sdkAppID = payload.sdkAppID
    },
    logout() {
      const app = window.$app
      app.$bus.emit('remove-tim-eventListener')
      setTimeout(() => {
        tim
          .logout()
          .then((imResponse: { data: any }) => {
            const chatStore = useChatStore()
            this.toggleIsLogin()
            chatStore.stopComputeCurrent()
            this.reset()
            console.warn('tim-退出成功！')
          })
          .catch((err: any) => {
            console.error(`${err}tim-退出失败！`)
          })
      }, 500)
    },
  },
})

export default videoUser
