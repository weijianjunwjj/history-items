<template>
  <a-card
    class="general-card"
    :class="fullScreen && 'full-screen'"
    :title="!fullScreen ? '通话界面' : ''"
  >
    <div class="call-container">
      <audio ref="ringing" class="ringing" loop :src="myRinging"></audio>
      <div v-show="mydata.isDialled" class="choose">
        <div class="title" style="font-size: 32px"
          >{{ mydata.phone }} 来电话啦</div
        >
        <div class="buttons">
          <div
            class="accept"
            @click="methods.handleDebounce(methods.accept, 500)"
          ></div>
          <div
            id="my-refuse"
            class="refuse"
            @click="methods.handleDebounce(methods.refuse, 500)"
          ></div>
        </div>
      </div>
      <div v-show="mydata.dialling || mydata.calling" class="call">
        <div
          v-if="mydata.dialling && currentChatType.value === 'C2C'"
          class="title"
        >
          正在呼叫{{ toAccount }}...
        </div>
        <div
          v-if="mydata.dialling && currentChatType.value === 'GROUP'"
          class="title"
        >
          正在呼叫...
        </div>
        <div
          v-show="
            mydata.callType === TRTCCalling.CALL_TYPE.VIDEO_CALL &&
            mydata.calling
          "
          style="position: absolute; display: flex; width: 100%; height: 100%"
        >
          <div id="small-group" class="small-group">
            <div id="local" class="video-box"></div>
            <div
              v-for="userId of mydata.callingUserList"
              :id="`video-${userId}`"
              :key="`video-${userId}`"
              class="video-box"
            >
            </div>

            <div
              v-if="mydata.callType === TRTCCalling.CALL_TYPE.VIDEO_CALL"
              class="buttons"
            >
              <div
                :class="mydata.isCamOn ? 'videoOn' : 'videoOff'"
                @click="methods.videoHandler"
              ></div>
              <div
                class="refuse"
                @click="methods.handleDebounce(methods.leave, 500)"
              ></div>
              <div
                :class="mydata.isMicOn ? 'micOn' : 'micOff'"
                @click="methods.micHandler"
              ></div>
            </div>
            <div v-else class="buttons">
              <!--                <div :class="isCamOn ? 'videoOn' : 'videoOff'" @click="videoHandler"></div>-->
              <div
                class="refuse"
                @click="methods.handleDebounce(methods.leave, 500)"
              ></div>
              <div
                :class="mydata.isMicOn ? 'micOn' : 'micOff'"
                @click="methods.micHandler"
              ></div>
            </div>
          </div>
        </div>
        <div
          v-show="
            mydata.callType === TRTCCalling.CALL_TYPE.AUDIO_CALL &&
            mydata.calling
          "
          class="audio-box"
        >
          <div v-show="mydata.calling" class="aduio-call">
            <img :src="myAvatar" class="audio-img" />
            <p style="text-align: center">
              <span class="nick-text">{{ myNick }}</span>
              <i
                v-if="mydata.isMicOn"
                class="el-icon-microphone micr-icon"
                style="color: #006fff"
              ></i>
              <i v-else class="el-icon-turn-off-microphone micr-icon"></i>
            </p>
          </div>
          <div
            v-for="item in mydata.invitedUserInfo"
            :key="`video-${item.userID}`"
            class="aduio-call"
          >
            <img :src="item.avatar || mydata.defaultAvatar" class="audio-img" />
            <p style="text-align: center">
              <span class="nick-text">{{ item.nick || item.userID }}</span>
              <i
                v-if="
                  item.isInvitedMicOn === true ||
                  item.isInvitedMicOn == undefined
                "
                class="el-icon-microphone micr-icon"
                style="color: #006fff"
              ></i>
              <i v-else class="el-icon-turn-off-microphone micr-icon"></i>
            </p>
          </div>
        </div>
        <div v-show="mydata.calling" class="duration">
          {{ formatDurationStr }}
        </div>

        <!--            <div class="mask" v-show="maskShow" :class="isLocalMain ? 'small' : 'big'" @click="changeMainVideo">-->
        <!--                <div>-->
        <!--                    <img class="image" src="../../../assets/image/camera-max.png"/>-->
        <!--                    <p class="notice">摄像头未打开</p>-->
        <!--                </div>-->
        <!--            </div>-->
      </div>

      <template v-if="!(mydata.calling || mydata.dialling || mydata.isDialled)">
        <div class="empty-mod flex-hvc">
          <a-empty class="a-empty" description="暂无通话"></a-empty>
        </div>
      </template>
      <template v-else>
        <div class="full-btns">
          <a-button v-if="!fullScreen" @click="fullScreen = true"
            >全屏</a-button
          >
          <a-button v-else @click="fullScreen = false">退出全屏</a-button>
        </div>
      </template>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { getDeviceInfo, SubmitRepair } from '@/api/videoCall'
  import { formatDuration } from '@/utils/utils'
  import { userID, userSig, sdkAppID } from '@/hooks/videoCall'
  import {
    mydata,
    toAccount,
    currentChatType,
    currentChat,
    callingInfo,
    currentUserProfile,
    formatDurationStr,
    myAvatar,
    myNick,
  } from '@/hooks/videoCall/calling'
  import { useChatStore, useVideoUserStore } from '@/store'
  import { cloneDeep } from 'lodash'
  import myNotification from '../myNotification.tsx'

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  import myRinging from '../../../assets/VvgcKAJS.mp3'

  // eslint-disable-next-line no-debugger

  const app = window.$app
  const chatStore = useChatStore()
  const { trtcCalling, TRTCCalling, tim, TIM } = window
  const videoUserStore = useVideoUserStore()
  const ringing = ref()
  const fullScreen = ref(false)
  const route = useRoute()

  const mydata0 = cloneDeep(mydata)
  const cloneBackup = () => cloneDeep(mydata0)

  watch(
    () => mydata.callingUserList,
    async (newValue) => {
      if (newValue.length < 2 && mydata.calling) {
        // 单人通话
        await nextTick()
        const elementId = `video-${newValue[0]}`
        const element = window.document.getElementById(elementId)
        console.log('element', element)
        const local = window.document.getElementById('local')
        console.log('local', local)
        // eslint-disable-next-line camelcase
        const group_element = window.document.getElementById('small-group')
        // element.addEventListener('click', methods.changeMainVideo)
        // local.addEventListener('click', methods.changeMainVideo)
        if (!element || !element.classList) {
          return
        }
        if (!local || !local.classList) {
          return
        }
        element && element.classList.remove('video-box')
        local && local.classList.remove('video-box')
        group_element && group_element.classList.add('small-group_box')
        mydata.isLocalMain
          ? element.classList.add('big')
          : element.classList.add('small')
        mydata.isLocalMain
          ? local.classList.add('small')
          : element.classList.add('big')
        return
      }
      if (newValue.length >= 2 && mydata.calling) {
        const group_element = window.document.getElementById('small-group')
        group_element && group_element.classList.remove('small-group_box')
        const elements =
          window.document.getElementById('small-group')?.childNodes
        elements?.forEach((item: any, index) => {
          if (index === 0) {
            item.classList.remove('small')
          }
          item.classList.remove('big')
          item.classList.add('video-box')
        })
      }
    },
    { deep: true, immediate: true }
  )
  // const profile = '720p'
  onMounted(() => {
    // trtcCalling.setVideoQuality(profile) // 设置视频质量为720p
    methods.initListener()
    app.$bus.on('video-call', methods.videoCalling) // 发起通话
    app.$bus.on('audio-call', methods.audioCalling) // 发起通话
    app.$bus.on('video-accept', () => {
      methods.handleDebounce(methods.accept, 500)
    }) // 发起通话
    app.$bus.on('video-reject', () => {
      methods.handleDebounce(methods.refuse, 500)
    }) // 发起通话
    app.$bus.on('open&closeRinging', () => {
      setTimeout(() => {
        methods.openRinging()
        methods.closeRinging()
      }, 500)
    })
  })
  onUnmounted(() => {
    app.$bus.off('video-call', methods.videoCalling)
    app.$bus.off('audio-call', methods.audioCalling) // 发起通话
    app.$bus.off('video-accept') // 发起通话
    app.$bus.off('video-reject')
    app.$bus.off('open&closeRinging')
    methods.removeListener()
    window.addEventListener('beforeunload', () => {
      methods.videoCallLogOut()
    })
    window.addEventListener('leave', () => {
      methods.videoCallLogOut()
    })
  })

  const methods = {
    saveForm() {
      if (mydata.params.type || mydata.params.desc) {
        SubmitRepair({ ...mydata.params, sn: mydata.sn }).then(() => {
          app.succ()
        })
      }
    },

    videoCallLogOut() {
      // 针对，刷新页面，关闭Tab，登出情况下，通话断开的逻辑
      if (mydata.dialling || mydata.calling) {
        methods.leave()
      }
      if (mydata.isDialled) {
        methods.refuse()
      }
    },
    initListener() {
      // sdk内部发生了错误
      trtcCalling.on(TRTCCalling.EVENT.ERROR, methods.handleError)
      // 被邀请进行通话
      trtcCalling.on(
        TRTCCalling.EVENT.INVITED,
        methods.handleNewInvitationReceived
      )
      // 有用户同意进入通话，那么会收到此回调
      trtcCalling.on(TRTCCalling.EVENT.USER_ENTER, methods.handleUserEnter)
      // 如果有用户同意离开通话，那么会收到此回调
      trtcCalling.on(TRTCCalling.EVENT.USER_LEAVE, methods.handleUserLeave)
      // 用户拒绝通话
      trtcCalling.on(TRTCCalling.EVENT.REJECT, methods.handleInviteeReject)
      // 邀请方忙线
      trtcCalling.on(TRTCCalling.EVENT.LINE_BUSY, methods.handleInviteeLineBusy)
      // 作为被邀请方会收到，收到该回调说明本次通话被取消了
      trtcCalling.on(
        TRTCCalling.EVENT.CALLING_CANCEL,
        methods.handleInviterCancel
      )
      // 重复登陆，收到该回调说明被踢出房间
      trtcCalling.on(TRTCCalling.EVENT.KICKED_OUT, methods.handleKickedOut)
      // 作为邀请方会收到，收到该回调说明本次通话超时未应答
      trtcCalling.on(
        TRTCCalling.EVENT.CALLING_TIMEOUT,
        methods.handleCallTimeout
      )
      // 邀请用户无应答
      trtcCalling.on(TRTCCalling.EVENT.NO_RESP, methods.handleNoResponse)
      // 收到该回调说明本次通话结束了
      trtcCalling.on(TRTCCalling.EVENT.CALLING_END, methods.handleCallEnd)
      // 远端用户开启/关闭了摄像头, 会收到该回调
      trtcCalling.on(
        TRTCCalling.EVENT.USER_VIDEO_AVAILABLE,
        methods.handleUserVideoChange
      )
      // 远端用户开启/关闭了麦克风, 会收到该回调
      trtcCalling.on(
        TRTCCalling.EVENT.USER_AUDIO_AVAILABLE,
        methods.handleUserAudioChange
      )
    },
    removeListener() {
      trtcCalling.off(TRTCCalling.EVENT.ERROR, methods.handleError)
      trtcCalling.off(
        TRTCCalling.EVENT.INVITED,
        methods.handleNewInvitationReceived
      )
      trtcCalling.off(TRTCCalling.EVENT.USER_ENTER, methods.handleUserEnter)
      trtcCalling.off(TRTCCalling.EVENT.USER_LEAVE, methods.handleUserLeave)
      trtcCalling.off(TRTCCalling.EVENT.REJECT, methods.handleInviteeReject)
      trtcCalling.off(
        TRTCCalling.EVENT.LINE_BUSY,
        methods.handleInviteeLineBusy
      )
      trtcCalling.off(
        TRTCCalling.EVENT.CALLING_CANCEL,
        methods.handleInviterCancel
      )
      trtcCalling.off(TRTCCalling.EVENT.KICKED_OUT, methods.handleKickedOut)
      trtcCalling.off(
        TRTCCalling.EVENT.CALLING_TIMEOUT,
        methods.handleCallTimeout
      )
      trtcCalling.off(TRTCCalling.EVENT.NO_RESP, methods.handleNoResponse)
      trtcCalling.off(TRTCCalling.EVENT.CALLING_END, methods.handleCallEnd)
      trtcCalling.off(
        TRTCCalling.EVENT.USER_VIDEO_AVAILABLE,
        methods.handleUserVideoChange
      )
      trtcCalling.off(
        TRTCCalling.EVENT.USER_AUDIO_AVAILABLE,
        methods.handleUserAudioChange
      )
    },

    handleError(err: any) {
      console.error(err)
      const codes = {
        60003: '权限获取失败 没有可用的麦克⻛设备',
        60004: '权限获取失败 没有可用的摄像头设备',
        60005: '权限获取失败 用户禁止使用设备',
      }

      console.error(codes[err.code])
    },

    callGlobalNotifcion() {
      myNotification(mydata.phone)
    },

    openRinging() {
      ringing.value.currentTime = 0
      ringing.value.play()
      const title = '您有新的视频通话请求~'
      let n = -1

      function titleRun() {
        n++
        if (n > title.length - 1) n = 0
        document.title = title.slice(n)
      }

      mydata.timer = setInterval(titleRun, 100)
    },

    closeRinging() {
      if (mydata.timer) {
        clearInterval(mydata.timer)
        mydata.timer = null
        document.title = window.SITE_CONFIG.title
      }
      ringing.value.pause()
      app.$bus.emit('my-notification-close')
    },

    // 被呼叫  接听方
    async handleNewInvitationReceived(payload: any) {
      console.log('route.name', route.name)
      console.log('payload', payload)
      route.name !== 'videoCall' && methods.callGlobalNotifcion()
      methods.openRinging()
      chatStore.update('isCalling', true)
      const { inviteID, sponsor, inviteData, userIDList, isGroupCall } = payload
      mydata.inviteID = inviteID
      mydata.inviteData = inviteData
      mydata.callType = inviteData.callType
      const index = sponsor.indexOf('-')
      mydata.phone = sponsor.substr(0, index)
      mydata.sn = sponsor.substr(index + 1)
      const calledChatItem = chatStore.chatList.find(
        (item) => item.userProfile.userID === sponsor
      )
      console.error('calledChatItem', calledChatItem)
      chatStore.updateCurrentChat(calledChatItem)
      mydata.invitedUserID = JSON.parse(JSON.stringify(userIDList)) // 被邀请者
      callingInfo.value.type = isGroupCall
        ? TIM.TYPES.CONV_GROUP
        : TIM.TYPES.CONV_C2C
      methods.changeState('isDialled', true)
      // if (mydata.sn && mydata.phone) {
      //   getDeviceInfo(mydata.sn, mydata.phone).then((res: any) => {
      //     const {
      //       deviceVO = {},
      //       repairRecordDtos = [],
      //       repairUserDto = {},
      //     } = res
      //     mydata.deviceVO = deviceVO
      //     mydata.repairRecordDtos = repairRecordDtos
      //     mydata.repairUserDto = repairUserDto
      //   })
      // }
    },

    accept() {
      console.log('accept------------------')
      const ops = {
        inviteID: mydata.inviteID,
        roomID: mydata.inviteData.roomID,
        callType: mydata.inviteData.callType,
      }
      console.log('ops', ops)
      trtcCalling
        .accept(ops)
        .then((res: any) => {
          methods.changeState('calling', true)
          console.log('res', res)
          res.data.message.nick = currentUserProfile.value.nick
          chatStore.pushCurrentMessageList(res.data.message)
        })
        .catch((err: any) => {
          console.error(err)
        })
    },
    reject() {
      console.log('reject------------------')
      chatStore.update('isCalling', false)
      const { callType } = mydata.inviteData
      const ops = {
        inviteID: mydata.inviteID,
        isBusy: false,
        callType,
      }
      trtcCalling
        .reject(ops)
        .then((res: any) => {
          res.data.message.nick = currentUserProfile.value.nick
          chatStore.pushCurrentMessageList(res.data.message)
        })
        .catch((err: any) => {
          console.error(err)
        })
    },
    handleDebounce(func: () => void, wait: number) {
      console.log('handleDebounce------------------')

      methods.closeRinging()
      if (mydata.timeout) clearTimeout(mydata.timeout)
      mydata.timeout = setTimeout(() => {
        func()
      }, wait)
    },
    // 双方建立连接
    async handleUserEnter(p: any) {
      const { userID: _userID } = p
      methods.changeState('dialling', true)
      methods.isAccept()
      // 判断是否为多人通话
      if (mydata.callingUserList.length >= 2) {
        mydata.callingType = TIM.TYPES.CONV_GROUP
      }
      console.error('_userID', _userID)

      if (mydata.callingUserList.indexOf(_userID) === -1) {
        if (mydata.callType === TRTCCalling.CALL_TYPE.AUDIO_CALL) {
          methods.getUserAvatar(_userID)
        } else {
          mydata.callingUserList.push(_userID)
        }
      }
      if (mydata.callType === TRTCCalling.CALL_TYPE.VIDEO_CALL) {
        await nextTick()
        console.error('nextTick')
        if (!mydata.isStartLocalView) {
          methods.startLocalView() // 本地只开启一次
        }
        methods.startRemoteView(_userID) // 远端多次拉流
      }
    },
    // 通话已建立
    handleUserLeave(p: any) {
      console.log('handleUserLeave------------------')
      const { userID: _userID } = p
      if (mydata.callType === TRTCCalling.CALL_TYPE.AUDIO_CALL) {
        // 语音通话
        const _index = mydata.invitedUserInfo.findIndex(
          (item: any) => item.userID === userID
        )
        if (_index >= 0) {
          mydata.invitedUserInfo.splice(_index, 1)
        }
        return
      }
      const index = mydata.callingUserList.findIndex(
        (item: any) => item === _userID
      )
      if (index >= 0) {
        mydata.callingUserList.splice(index, 1)
      }
    },
    // 通知呼叫方，未接通
    // userID:invitee(被邀请者）
    handleInviteeReject(p: any) {
      const { userID: _userID } = p
      console.log('handleInviteeReject------------------')
      if (userID.value === mydata.sponsor) {
        // 发起者
        methods.setCallingstatus(_userID)
        app.appStore.mess(`${_userID}拒绝通话`)
      }
    },
    setCallingstatus(_userID: any) {
      console.log('setCallingstatus------------------')

      const _index = mydata.invitedUserID.indexOf(_userID)
      if (_index >= 0) {
        mydata.invitedUserID.splice(_index, 1)
      }
      if (mydata.invitedUserID.length === 0) {
        methods.changeState('isDialled', false)
        methods.changeState('dialling', false)
      }
    },
    // 通知呼叫方，对方在忙碌，未接通
    handleInviteeLineBusy(p: any) {
      console.log('handleInviteeLineBusy------------------')
      const { sponsor, userID: _userID } = p
      // window.location.reload()
      // A call B,C call A, A在忙线， 拒绝通话，对于呼叫者C收到通知，XXX在忙线
      if (sponsor === userID.value) {
        methods.setCallingstatus(_userID)
        app.appStore.mess(`${userID}忙线`)
      }
    },
    // 通知被呼叫方，邀请被取消，未接通
    handleInviterCancel() {
      console.log('handleInviterCancel------------------')

      methods.closeRinging()
      // 邀请被取消
      methods.changeState('isDialled', false)
      app.appStore.mess(`通话已取消`)
      chatStore.update('isCalling', false)
    },

    handleKickedOut() {
      console.log('handleKickedOut------------------')
      // //重复登陆，被踢出房间
      // trtcCalling.logout();
      // methods.$store.commit("userLogoutSuccess");
    },
    // 当自己收到对端超时的信令时，或者当我是被邀请者但自己超时了，通知上层通话超时
    // case: A呼叫B，B在线，B超时未响应，B会触发该事件，A也会触发该事件
    handleCallTimeout(p: any) {
      chatStore.update('isCalling', false)
      console.log('handleCallTimeout------------------')
      const { userIDList } = p
      if (mydata.calling) {
        return
      }
      if (userID.value === mydata.sponsor) {
        // 该用户是邀请者
        userIDList.forEach((_userID: any) => {
          methods.setCallingstatus(_userID) // 超时未接听
        })
        return
      }
      // 用户是被邀请者
      if (userIDList.indexOf(userID.value) > -1) {
        // 当超时者是自己时，添加消息
        // 会话列表切换后发消息
        mydata.toAccount &&
          methods.sendMessage(userID.value, '', mydata.callingTips.callTimeout)
      }
      methods.changeState('isDialled', false)
    },
    // 双方，通话已建立, 通话结束
    handleCallEnd(p: any) {
      console.error('handleCallEnd------------------')
      chatStore.update('isCalling', false)
      const { userID: _userID, callEnd } = p
      methods.closeRinging()
      // 自己挂断的要补充消息  被邀请者都无应答时结束
      // 历史消息中没有通话结束
      const { invitedUserID, callingUserList, callingTips } = mydata
      console.log('p', p)
      console.log({
        _userID,
        userID: userID.value,
        invitedUserID,
        callingUserList,
        callingTips,
      })
      // eslint-disable-next-line no-debugger

      if (
        (_userID === userID.value && mydata.invitedUserID.length === 0) ||
        mydata.callingUserList.length === 0
      ) {
        methods.sendMessage(_userID, callEnd, mydata.callingTips.callEnd)
      }
      //   methods.changeState('isDialled', false)
      //   methods.changeState('calling', false)
      methods.changeState('dialling', false)
      mydata.isMicOn = true
      mydata.isCamOn = true
      mydata.maskShow = false
      mydata.isStartLocalView = false
      // methods.$store.commit('showMessage', {
      //   message: '通话已结束'
      // })
      app.appStore.mess('已挂断')
      methods.saveForm()
      fullScreen.value = false
    },
    // 自己超时且是邀请发起者，需主动挂断，并通知上层对端无应答
    handleNoResponse(p: any) {
      // 邀请者
      const { sponsor, userIDList } = p
      console.log('handleNoResponse------------------')

      if (sponsor === userID.value) {
        userIDList.forEach((_userID: any) => {
          methods.setCallingstatus(_userID)
        })
        if (userIDList.indexOf(userID.value) === -1) {
          // 当超时者是自己时，添加消息
          methods.sendMessage(userIDList, '', mydata.callingTips.callTimeout)
        }
      }
    },
    handleUserVideoChange() {
      console.log('handleUserVideoChange------------------')
    },

    handleUserAudioChange(payload: { userID: any; isAudioAvailable: any }) {
      console.log('handleUserAudioChange------------------')
      const _index = mydata.invitedUserInfo.findIndex(
        (item: { userID: any }) => item.userID === payload.userID
      )
      if (_index >= 0) {
        mydata.invitedUserInfo[_index].isInvitedMicOn = payload.isAudioAvailable
      }
      // methods.isInvitedMicOn = payload.isAudioAvailable
    },

    // 播放本地流
    startLocalView() {
      trtcCalling
        .startLocalView({
          userID: userID.value,
          videoViewDomID: 'local',
        })
        .then(() => {
          mydata.isStartLocalView = true
        })
    },

    // 没有用到
    stopLocalView() {
      trtcCalling.stopLocalView({
        userID: userID.value,
        videoViewDomID: mydata.viewLocalDomID,
      })
    },
    // 播放远端流
    startRemoteView(_userID: any) {
      console.log('userID', userID.value)
      console.log('_userID', _userID)
      trtcCalling
        .startRemoteView({
          userID: _userID,
          videoViewDomID: `video-${_userID}`,
        })
        .then(() => {})
        .catch((err: any) => {
          console.error(err)
          console.error('播放远程流错误')
        })
    },
    // 没有用到
    stopRemoteView(_userID: { value: any }) {
      trtcCalling.stopRemoteView({
        userID: userID.value,
        videoViewDomID: `video-${_userID}`,
      })
    },
    // 获取被呼叫者信息
    getUserAvatar(_userID: any) {
      const _index = mydata.invitedUserInfo.findIndex(
        (item: { userID: any }) => item.userID === _userID
      )
      if (_index >= 0) {
        return
      }
      const _userIDList = [_userID]
      const promise = tim.getUserProfile({
        userIDList: _userIDList, // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      })
      promise
        .then((imResponse: { data: any[] }) => {
          if (imResponse.data[0]) {
            mydata.invitedUserInfo.push(imResponse.data[0])
          }
        })
        .catch(() => {})
    },
    changeState(state: string, boolean: boolean) {
      const stateList = ['dialling', 'isDialled', 'calling']
      stateList.forEach((item) => {
        mydata[item] = item === state ? boolean : false
      })
      videoUserStore.UPDATE_ISBUSY(stateList.some((item) => mydata[item]))
      // 若stateList 中存在 true , isBusy 为 true
    },
    videoCalling() {
      // 发起通话
      // 初始化被邀请者
      console.log('mydata', mydata)
      console.log('callingInfo', callingInfo)
      mydata.invitedUserID = JSON.parse(
        JSON.stringify(callingInfo.value.memberList)
      )
      mydata.sponsor = userID.value
      if (mydata.calling) {
        // 避免通话按钮多次快速的点击
        return
      }
      mydata.callType = TRTCCalling.CALL_TYPE.VIDEO_CALL
      mydata.isLocalMain = true
      // 可设置超时
      if (callingInfo.value.type === TIM.TYPES.CONV_C2C) {
        trtcCalling
          .call({
            userID: callingInfo.value.memberList[0],
            type: mydata.callType,
            timeout: 30,
          })
          .then((res: { data: { message: { nick: any } } }) => {
            res.data.message.nick = currentUserProfile.value.nick
            chatStore.pushCurrentMessageList(res.data.message)
            methods.changeState('dialling', true)
          })
      } else {
        trtcCalling
          .groupCall({
            userIDList: callingInfo.value.memberList,
            type: mydata.callType,
            groupID: currentChat.value.groupProfile.groupID,
            timeout: 30,
          })
          .then((res: { data: { message: { nick: any } } }) => {
            res.data.message.nick = currentUserProfile.value.nick
            chatStore.pushCurrentMessageList(res.data.message)
            methods.changeState('dialling', true)
          })
      }
    },
    audioCalling() {
      // 发起通话

      console.log('audioCalling------------------')

      // 初始化被邀请者
      mydata.invitedUserID = callingInfo.value.memberList
      mydata.sponsor = userID.value
      if (mydata.calling) {
        // 避免通话按钮多次快速的点击
        return
      }
      // // 发起者获取被邀约人信息
      // methods.getUserAvatar()
      // 可设置超时
      mydata.callType = TRTCCalling.CALL_TYPE.AUDIO_CALL
      if (callingInfo.value.type === 'C2C') {
        trtcCalling
          .call({
            userID: callingInfo.value.memberList[0],
            type: mydata.callType,
            timeout: 30,
          })
          .then((res: { data: { message: { nick: any } } }) => {
            methods.changeState('dialling', true)
            res.data.message.nick = currentUserProfile.value.nick
            chatStore.pushCurrentMessageList(res.data.message)
          })
      } else {
        trtcCalling
          .groupCall({
            userIDList: callingInfo.value.memberList,
            type: mydata.callType,
            groupID: currentChat.value.groupProfile.groupID,
            timeout: 30,
          })
          .then((res: { data: { message: { nick: any } } }) => {
            methods.changeState('dialling', true)
            res.data.message.nick = currentUserProfile.value.nick
            chatStore.pushCurrentMessageList(res.data.message)
          })
      }
    },
    leave() {
      // 离开房间，发起方挂断
      mydata.isMicOn = true
      mydata.isCamOn = true
      mydata.maskShow = false
      mydata.isStartLocalView = false
      if (!mydata.calling) {
        // 还没有通话，单方面挂断
        trtcCalling
          .hangup()
          .then((res: { data: { message: { nick: any } } }) => {
            console.log('res', res)
            res.data.message.nick = currentUserProfile.value.nick
            chatStore.pushCurrentMessageList(res.data.message)
            methods.changeState('dialling', false)
            clearTimeout(mydata.timer)
          })
        return
      }
      methods.hangUp() // 通话一段时间之后，某一方面结束通话
      fullScreen.value = false
    },

    refuse() {
      // 拒绝电话
      // document.title = window.SITE_CONFIG.title
      methods.changeState('isDialled', false)
      methods.reject()
    },
    resetDuration(duration: any) {
      mydata.duration = duration
      mydata.hangUpTimer = setTimeout(() => {
        const now = new Date()
        methods.resetDuration(Math.ceil((now - mydata.start) / 1000))
      }, 1000)
    },

    isAccept() {
      // 对方接听自己发起的电话
      clearTimeout(mydata.timer)
      methods.changeState('calling', true)
      clearTimeout(mydata.hangUpTimer)
      methods.resetDuration(0)
      mydata.start = new Date()
    },

    hangUp() {
      // 通话一段时间之后，某一方挂断电话

      console.error('hangUp------------------')

      methods.changeState('calling', false)
      trtcCalling
        .hangup()
        .then((res: any) => {
          console.log('res', res)
        })
        .catch((err: any) => {
          console.error(err)
        })
      app.appStore.mess('已挂断')
      fullScreen.value = false
      chatStore.update('isCalling', false)
    },
    videoHandler() {
      // 是否打开摄像头
      if (mydata.isCamOn) {
        mydata.isCamOn = false
        mydata.maskShow = true
        trtcCalling.closeCamera()
      } else {
        mydata.isCamOn = true
        mydata.maskShow = false
        trtcCalling.openCamera()
      }
    },
    micHandler() {
      // 是否打开麦克风
      if (mydata.isMicOn) {
        trtcCalling.setMicMute(true)
        mydata.isMicOn = false
      } else {
        trtcCalling.setMicMute(false)
        mydata.isMicOn = true
      }
    },
    changeMainVideo() {
      if (!mydata.calling) {
        return
      }
      mydata.isLocalMain = !mydata.isLocalMain
    },
    async sendMessage(_userId: any, callEnd: string | number, callText: any) {
      console.warn('sendMessage---')
      console.log({ _userId, callEnd, callText })
      let call_text = ''
      _userId = Array.isArray(_userId) ? _userId.join(',') : _userId
      const messageData = {
        to: toAccount.value,
        from: _userId,
        conversationType: currentChatType.value,
        payload: {
          data: '',
          description: '',
          extension: '',
        },
      }

      console.log('messageData', messageData)
      // eslint-disable-next-line no-debugger
      const message = await tim.createCustomMessage(messageData)
      console.log('message', message)
      // eslint-disable-next-line no-debugger
      switch (callText) {
        case mydata.callingTips.callEnd:
          if (currentChatType.value === TIM.TYPES.CONV_GROUP) {
            call_text = '结束群聊'
            break
          } else {
            call_text =
              callEnd === 0
                ? '取消通话'
                : `结束通话，通话时长：${formatDuration(
                    callEnd || mydata.duration
                  )}`
            break
          }
        case mydata.callingTips.callTimeout:
          call_text = '无应答'
          break
        default:
          call_text = ''
          break
      }
      if (currentChatType.value === TIM.TYPES.CONV_GROUP) {
        message.groupID = mydata.toAccount
        const customData = {
          operationType: 256,
          text: call_text,
          userIDList: [],
        }
        message.payload = customData
      }
      if (currentChatType.value === TIM.TYPES.CONV_C2C) {
        const customData = {
          text: call_text,
        }
        message.payload = customData
      }
      if (currentChatType.value === TIM.TYPES.CONV_GROUP) {
        message.type = TIM.TYPES.MSG_GRP_TIP
      }
      message.callType = 'callingTips'
      chatStore.pushCurrentMessageList(message)
    },
  }

  // const reset = () => {
  //   // ringing.value = null
  //   fullScreen.value = false
  //   // mydata.closeRinging()
  //   // setTimeout(() => {
  //   //   Object.assign(mydata, cloneBackup())
  //   // }, 0)
  //   methods.closeRinging()
  // }

  // defineExpose({ reset })
</script>

<style lang="less">
  .call-container {
    video {
      object-fit: scale-down !important;
    }
  }
</style>

<style lang="less" scoped>
  .general-card {
    height: calc(calc(100vh - 85px) * 0.6);
    overflow: hidden;
    :deep(.arco-card-body) {
      padding: 0;
    }
  }
  .full-btns {
    position: absolute;
    right: 35px;
    bottom: 35px;
    z-index: 999;
  }

  .full-screen {
    position: absolute;
    width: 100%;
    height: 100% !important;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .field-box {
    display: flex;
    margin-bottom: 15px;
    padding: 0 15px;
    color: #333;
  }

  .field-name {
    width: 100px;
    color: #646c9a;
  }

  .device-title {
    margin-bottom: 15px;
    padding-left: 15px;
    color: #333;
    font-size: 18px;
  }

  .info-box {
    width: 50%;
    height: 100%;
    overflow: auto;
    background: #fff;
  }

  .empty-mod {
    position: relative;
    height: 100%;

    .a-empty {
      position: relative;
      top: -15px;
    }
  }

  :deep(.arco-card-body) {
    height: calc(100% - 55px);
  }

  .call-container {
    // background center url("data:image/png;base64,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")
    // background-size 100% 100%
    // position: absolute z-index 999;
    height: 100%;
  }

  .accept,
  .refuse,
  .videoOn,
  .videoOff,
  .micOn,
  .micOff {
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  .accept {
    background: center no-repeat url('../../../assets/images/call-mod/call.png');
    background-size: 60%;
    background-color: @success;
  }

  .refuse {
    background: center no-repeat
      url('../../../assets/images/call-mod/hangup.png');
    background-size: 70%;
    background-color: @danger;
  }

  .videoOn {
    background: center no-repeat
      url('../../../assets/images/call-mod/big-camera-on.png');
  }

  .videoOff {
    background: center no-repeat
      url('../../../assets/images/call-mod/big-camera-off.png');
  }

  .micOn {
    background: center no-repeat
      url('../../../assets/images/call-mod/big-mic-on.png');
  }

  .micOff {
    background: center no-repeat
      url('../../../assets/images/call-mod/big-mic-off.png');
  }

  .buttons {
    position: absolute;
    top: 66%;
    z-index: 20;
    display: flex;
    justify-content: space-around;
    width: 70%;
    margin: 0 15% 0 15%;
  }

  .audio-box {
    position: absolute;
    top: 200px;
    z-index: 20;
    display: flex;
    justify-content: center;
    width: 70%;
    margin: 0 15% 0 15%;
  }

  .aduio-call {
    box-sizing: border-box;
    width: 140px;
    height: 100px;
  }

  .audio-img {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto 13px;
    border-radius: 50%;
  }

  .micr-icon {
    font-size: 28px;
    cursor: pointer;
  }

  /* display block */

  /* text-align center */
  .nick-text {
    margin-right: 5px;
    color: #ddd;
    font-size: 12px;
    vertical-align: super;
  }

  .duration {
    position: absolute;
    top: 57%;
    z-index: 20;
    display: flex;
    justify-content: center;
    width: 100%;
    color: #fff;
  }

  .mask {
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #d8d8d8;

    .image {
      margin-left: 15%;
    }

    .notice {
      color: #888;
    }
  }

  .choose,
  .call {
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .title {
    position: absolute;
    z-index: 10;
    width: 100%;
    margin: 18% 0 0 0;
    color: #fff;
    font-weight: 700;
    font-size: 40px;
    text-align: center;
  }

  .big {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .small {
    position: absolute;
    z-index: 999;
    width: 25.2%;
    height: 44.8%;
    margin-left: 74.8%;
    border-color: #808080;
    border-style: solid;
    border-width: 1px;
  }

  .big-group {
    width: 100%;
    height: 60vh;
  }

  .small-group {
    /* height 100% */
    position: relative;
    display: flex;
    flex: 1;
    flex-wrap: wrap; //position absolute

    /* z-index 999 */

    /* border-style solid */

    /* border-width 1px */

    /* border-color #808080 */

    /* height 30% */
    width: 100%;
  }

  .small-group_box {
    height: 100%;
  }

  .video-box {
    width: 33.3%;
    height: 25vh;
  }
</style>
