<template>
  <div class="video-call">
    <a-spin :loading="showLoading" class="w100" tip="loading...">
      <div class="container">
        <div class="layout">
          <div class="layout-left-side">
            <ChatPanel />
          </div>
          <div class="layout-content">
            <a-space :size="16" direction="vertical" fill>
              <CallLog />
              <DeviceInfo />
            </a-space>
          </div>
          <div class="layout-right-side">
            <a-space :size="16" direction="vertical" fill>
              <Calling ref="CallingRefs" />
              <RepairRrequestRrecord />
            </a-space>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { getAudioVideo, translateGroupSystemNotice } from '@/utils/utils'
  import TIM from 'tim-js-sdk/tim-js-friendship'
  import TRTCCalling from 'trtc-calling-js'
  import tim from '@/plugins/tim'
  import trtcCalling from '@/plugins/trtc-calling'

  import {
    currentChat,
    isBusy,
    isSDKReady,
    userID,
    userSig,
    sdkAppID,
    showLoading,
  } from '@/hooks/videoCall'
  import { syncKfLogin } from '@/api/videoCall'
  import { ACTION } from '@/utils/trtcCustomMessageMap'

  import { getToken, isLogin } from '@/utils/auth'
  import { useAppStore, useChatStore, useVideoUserStore } from '@/store'
  import ChatPanel from './components/chat-panel/index.vue'
  import CallLog from './components/call-log.vue'
  import DeviceInfo from './components/device-info.vue'
  import Calling from './components/calling.vue'
  import RepairRrequestRrecord from './components/repair-request-record.vue'

  window.tim = tim
  window.TIM = TIM
  window.trtcCalling = trtcCalling
  window.TRTCCalling = TRTCCalling

  const app = window.$app
  const videoUserStore = useVideoUserStore()
  const appStore = useAppStore()
  const chatStore = useChatStore()
  const timer = ref()
  const CallingRefs = ref()
  const that = {
    syncKfLogin(_userID: any) {
      syncKfLogin(_userID)
    },
    parseJwt(token: string) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      return JSON.parse(window.atob(base64))
    },

    onReceiveMessage(params: any) {
      const { data: messageList } = params
      // console.log(
      //   `onReceiveMessage-------------------${JSON.stringify(messageList)}`
      // )
      that.handleVideoMessage(messageList)
      that.handleQuitGroupTip(messageList)
      that.handleCloseGroupLive(messageList)
      messageList.forEach((message: { flow: string }) => {
        console.log(`-------------------${message.flow}`)
        if (message.flow === 'out') {
          window.location.reload()
          console.log('刷新中。。。')
          // 改成局部刷新
          // refreshSelf()
          // 挂断
        }
      })
      chatStore.pushCurrentMessageList(messageList)
    },

    onError(p: any) {
      // const { data } = p
      // console.error(data)
      // if (data.message !== 'Network Error') {
      //   appStore.mess({
      //     type: 'error',
      //     message: data.message,
      //   })
      // }
    },
    onReadyStateUpdate(p: any) {
      const { name } = p
      const _isSDKReady = name === TIM.EVENT.SDK_READY
      videoUserStore.toggleIsSDKReady(_isSDKReady)
      if (isSDKReady) {
        tim
          .getMyProfile()
          .then((p2: any) => {
            const { data } = p2
            console.log('p2', p2)
            videoUserStore.updateCurrentUserProfile(data)
          })
          .catch((error: { message: any }) => {
            appStore.mess({
              type: 'error',
              message: error.message,
            })
          })
        // 登录trtc calling
        trtcCalling.login({
          sdkAppID: sdkAppID.value,
          userID: userID.value,
          userSig: userSig.value,
        })
      }
    },
    kickedOutReason(type: any) {
      switch (type) {
        case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return '由于多实例登录'
        case TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return '由于多设备登录'
        case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return '由于 userSig 过期'
        default:
          return ''
      }
    },
    checkoutNetState(state: any) {
      switch (state) {
        case TIM.TYPES.NET_STATE_CONNECTED:
          return { message: '已接入网络', type: 'success' }
        case TIM.TYPES.NET_STATE_CONNECTING:
          return { message: '当前网络不稳定', type: 'warning' }
        case TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: '当前网络不可用', type: 'error' }
        default:
          return ''
      }
    },
    onNetStateChange(event: { data: { state: any } }) {
      appStore.mess(that.checkoutNetState(event.data.state))
    },

    onKickOut(event: { data: { type: any } }) {
      appStore.mess({
        message: `${that.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: 'error',
      })
      videoUserStore.toggleIsLogin(false)
      videoUserStore.reset()
    },
    onUpdateConversationList(e: any) {
      chatStore.updateChatList(e.data)
    },

    onReceiveGroupSystemNotice(event: {
      data: {
        type: number
        message: { payload: { groupProfile: { groupID: any } } }
      }
    }) {
      const isKickedout = event.data.type === 4
      const isCurrentConversation =
        `GROUP${event.data.message.payload.groupProfile.groupID}` ===
        currentChat.value.conversationID
      // 在当前会话被踢，需reset当前会话
      if (isKickedout && isCurrentConversation) {
        chatStore.resetCurrentChat()
      }
      app.Notification({
        title: '新系统通知',
        content: translateGroupSystemNotice(event.data.message),
        duration: 3000,
        // onClick: () => {
        //   const SystemConversationID = '@TIM#SYSTEM'
        //   this.$store.dispatch('checkoutChat', SystemConversationID)
        // },
      })
    },

    selectConversation(conversationID: any) {
      if (conversationID !== currentChat.value.conversationID) {
        chatStore.checkoutChat(conversationID)
      }
    },
    isJsonStr(str: string) {
      try {
        JSON.parse(str)
        return true
      } catch {
        return false
      }
    },
    handleVideoMessage(messageList: any[]) {
      const videoMessageList = messageList.filter(
        (message: { type: any; payload: { data: any } }) =>
          message.type === TIM.TYPES.MSG_CUSTOM &&
          that.isJsonStr(message.payload.data)
      )
      if (videoMessageList.length === 0) return
      const videoPayload = JSON.parse(videoMessageList[0].payload.data)
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
        if (isBusy.value) {
          app.$bus.emit('busy', videoPayload, videoMessageList[0])
          return
        }
        videoUserStore.GENERATE_VIDEO_ROOM(videoPayload.room_id)
        that.selectConversation(videoMessageList[0].conversationID) // 切换当前会话页
        if (videoMessageList[0].from !== userID.value) {
          app.$bus.emit('isCalled')
        }
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
        app.$bus.emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
        app.$bus.emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
        app.$bus.emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
        app.$bus.emit('isAccept')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
        app.$bus.emit('isHungUp')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
        app.$bus.emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
        app.$bus.emit('isRefused')
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe(message: any) {
      // 需检测浏览器支持和用户授权
      if (!('Notification' in window)) {
        console.log('hhh')
      } else if (window.Notification.permission === 'granted') {
        that.handleNotify(message)
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission().then((permission) => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            that.handleNotify(message)
          }
        })
      }
    },
    handleNotify(message: { payload: { text: any }; conversationID: any }) {
      app.Notification('有人提到了你', {
        icon: 'https://web.sdk.qcloud.com/im/assets/images/logo.png',
        body: message.payload.text,
      })
      // notification.onclick = () => {
      //   window.focus()
      //   chatStore.checkoutChat(message.conversationID)
      //   notification.close()
      // }
    },
    /**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
    handleQuitGroupTip(messageList: any[]) {
      // 筛选出当前会话的退群/被踢群的 groupTip
      const groupTips = messageList.filter(
        (message: {
          conversationID: any
          type: any
          payload: { operationType: any }
        }) => {
          return (
            currentChat.value.conversationID === message.conversationID &&
            message.type === TIM.TYPES.MSG_GRP_TIP &&
            (message.payload.operationType === TIM.TYPES.GRP_TIP_MBR_QUIT ||
              message.payload.operationType ===
                TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
          )
        }
      )
      // 清理当前会话的群成员列表
      // if (groupTips.length > 0) {
      //   groupTips.forEach(
      //     (groupTip: { payload: { userIDList: string | any[] } }) => {
      //       if (
      //         Array.isArray(groupTip.payload.userIDList) ||
      //         groupTip.payload.userIDList.length > 0
      //       ) {
      //         this.$store.commit(
      //           'deleteGroupMemberList',
      //           groupTip.payload.userIDList
      //         )
      //       }
      //     }
      //   )
      // }
    },
    /**
     * 收到结束直播自定义消息，派发事件关闭组件
     * @param {Message[]} messageList
     */
    handleCloseGroupLive(messageList: any[]) {
      messageList.forEach(
        (message: {
          conversationID: any
          type: any
          payload: { data: string }
        }) => {
          if (
            currentChat.value.conversationID === message.conversationID &&
            message.type === TIM.TYPES.MSG_CUSTOM
          ) {
            let data = {} as any
            try {
              data = JSON.parse(message.payload.data)
            } catch (e) {
              data = {}
            }
            if (data.roomId && Number(data.roomStatus) === 0) {
              app.$bus.emit('close-group-live')
            }
          }
        }
      )
    },
  }
  const initListener = () => {
    console.error('tim', tim)
    // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
    tim.on(TIM.EVENT.SDK_READY, that.onReadyStateUpdate)
    // SDK NOT READT
    tim.on(TIM.EVENT.SDK_NOT_READY, that.onReadyStateUpdate)
    // 被踢出
    tim.on(TIM.EVENT.KICKED_OUT, that.onKickOut)
    // SDK内部出错
    tim.on(TIM.EVENT.ERROR, that.onError)
    // 收到新消息
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, that.onReceiveMessage)
    // 会话列表更新
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, that.onUpdateConversationList)
    // 网络监测
    tim.on(TIM.EVENT.NET_STATE_CHANGE, that.onNetStateChange)
    // 已读回执
    // tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, that.onMessageReadByPeer)
    // 黑名单更新
    // tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, that.onFriendListUpdated)

    // tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, that.onFriendApplicationListUpdated)

    // tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, that.onFriendGroupListUpdated)
  }

  const removeEventListener = () => {
    tim.off(TIM.EVENT.SDK_READY, that.onReadyStateUpdate)
    tim.off(TIM.EVENT.SDK_NOT_READY, that.onReadyStateUpdate)
    tim.off(TIM.EVENT.KICKED_OUT, that.onKickOut)
    tim.off(TIM.EVENT.ERROR, that.onError)
    tim.off(TIM.EVENT.MESSAGE_RECEIVED, that.onReceiveMessage)
    tim.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, that.onUpdateConversationList)
    tim.off(TIM.EVENT.NET_STATE_CHANGE, that.onNetStateChange)
  }

  onMounted(() => {
    // 初始化监听器
    initListener()

    const token = getToken() as any
    const jwt = that.parseJwt(token)
    const userId = jwt.user_id.toString()
    console.log('userId', userId)

    const genTestUserSig = (window as any).genTestUserSig(userId)
    console.log('genTestUserSig', genTestUserSig)
    // setLoading(true)
    tim
      .login({
        userID: userId,
        userSig: genTestUserSig.userSig,
      })
      .then(() => {
        // setLoading(false)
        videoUserStore.toggleIsLogin(true)
        chatStore.startComputeCurrent()
        videoUserStore.GET_USER_INFO({
          userID: userId,
          userSig: genTestUserSig.userSig,
          sdkAppID: genTestUserSig.SDKAppID,
        })
        // appStore.mess({
        //   type: 'success',
        //   message: '登录成功',
        // })
      })
      .catch((error: { message: any }) => {
        // loading.value = false
        appStore.mess({
          message: `登录失败：${error.message}`,
          type: 'error',
        })
      })

    app.$bus.on('remove-tim-eventListener', () => {
      removeEventListener()
    })

    if (localStorage.getItem('is-confirm-media') === '0') {
      // eslint-disable-next-line no-debugger
      getAudioVideo({ audio: true, video: true })
        .then((res) => {
          console.log('已点击允许,开启成功')
        })
        .catch((err) => {
          const is404 = err?.code === 404
          const err1 = '您的浏览器不支持音视频通话，请更换浏览器'
          const err2 = '请检查是否开启了摄像头和麦克风'
          const title = '消息'
          app.$modal.info({
            title,
            content: is404 ? err1 : err2,
            maskClosable: false,
            escToClose: false,
            onOk: () => {},
          })
        })
        .finally(() => {
          localStorage.setItem('is-confirm-media', '1')
        })
    }
    setTimeout(() => {
      // app.$bus.emit('open&closeRinging')
      app.$modal.info({
        title: '开启铃声',
        maskClosable: false,
        escToClose: false,
        onOk: () => {
          app.$bus.emit('open&closeRinging')
        },
      })
    }, 1500)
  })

  watch(
    () => userID.value,
    (_userID) => {
      console.error('_userID', _userID)
      if (_userID) {
        that.syncKfLogin(_userID)
        timer.value = window.setInterval(() => {
          that.syncKfLogin(_userID)
        }, 1000 * 60)
      }
    },
    {
      immediate: true,
    }
  )

  onBeforeUnmount(() => {
    window.clearInterval(timer.value)
  })
</script>

<style scoped lang="less">
  .container {
    position: relative;
    padding: 20px;
  }

  .layout {
    display: flex;

    &-left-side {
      flex-basis: 240px;
      height: calc(100vh - 100px);
    }

    &-content {
      flex: 1;
      padding: 0 16px;
    }

    &-right-side {
      flex: 1;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .layout {
      flex-wrap: wrap;

      &-left-side {
        flex: 1;
        flex-basis: 100%;
        margin-bottom: 16px;
      }

      &-content {
        flex: none;
        flex-basis: 100%;
        order: -1;
        margin-bottom: 16px;
        padding: 0;
      }

      &-right-side {
        flex-basis: 100%;
      }
    }
  }
</style>
