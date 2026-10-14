<template>
  <a-card
    class="general-card chat-panel"
    title="列表"
    :bordered="false"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{
      height: '100%',
      paddingTop: '16px',
      display: 'flex',
      flexFlow: 'column',
    }"
  >
    <div class="chat-panel-content">
      <a-spin :loading="chatLoading" style="width: 100%">
        <ChatList :render-list="chatList" />
      </a-spin>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import _ from 'lodash'
  import {
    chatLoading,
    chatList,
    currentChat,
  } from '@/hooks/videoCall/chatPanel'
  import { getFaceTimeInfoList, getListByUserId } from '@/api/videoCall'
  import { useChatStore } from '@/store'
  import ChatList from './chat-list.vue'

  interface FaceTimeInfo {
    deviceVO: any
    repairRecordDtos: any
    repairUserDto: any
    faceRepairNums: any
    recentFaceTimeReCord: any
  }

  const app = window.$app
  const chatStore = useChatStore()
  const isCheckouting = ref(false)
  let num = 0
  const getSn = () => {
    num++
    // console.error('num------------', num)
    const _chatList = chatList.value
    const sns = _chatList.map((item: any) => {
      // console.log('item', item)
      const { userID } = item.userProfile
      const phone = userID.split('-')[0]
      const scene = `${userID.split('-')[1]}-${userID.split('-')[2]}`
      return {
        scene,
        phone,
      }
    })

    getFaceTimeInfoList(JSON.stringify(sns))
      .then((obj0: any) => {
        console.log('obj0', obj0)
        const faceTimeInfoMap = obj0 as { [key: string]: FaceTimeInfo }

        // eslint-disable-next-line no-debugger
        const __chatList: any = _.cloneDeep(chatList.value)
        console.log('__chatList', __chatList)

        const arr = Object.entries(obj0)

        console.log('arr', arr)

        let deviceInfo1

        __chatList.forEach((__chat, _index) => {
          const { userID } = __chat.userProfile
          const userIDArr = userID.split('-')
          const newUserId = `${userIDArr[1]}-${userIDArr[2]}-${userIDArr[0]}`
          __chatList[_index].sn = faceTimeInfoMap[newUserId]?.deviceVO.sn || ''
          if (_index === 0) {
            deviceInfo1 = faceTimeInfoMap[newUserId]
          }
        })

        const lackSn = __chatList?.some((item: any) => item.sn === undefined)
        if (lackSn) {
          chatStore.updateChatLoading(false)
          return
        }
        chatStore.updateChatList(__chatList)
        chatStore.updateChatLoading(false)
        chatStore.updateFaceTimeInfoMap(faceTimeInfoMap)
        chatStore.updateDeviceInfo(deviceInfo1)
      })
      .catch((e: any) => {
        console.error(e)
        chatStore.updateChatLoading(false)
      })

    chatStore.updateChatLoading(true)
    console.log('_chatList', _chatList)
    if (!_chatList[0].userProfile.userID) {
      return
    }
    getListByUserId(_chatList[0].userProfile.userID).then((value: any) => {
      // console.log('value', value)
      const tableData = value.data.items
      chatStore.updateCallTableData(tableData)
    })
  }

  const handleKeydown = (event: any) => {
    if ((event.keyCode !== 38 && event.keyCode !== 40) || isCheckouting.value) {
      return
    }
    const currentIndex = chatList.value.findIndex(
      (item: any) => item.conversationID === currentChat.value.conversationID
    )
    if (event.keyCode === 38 && currentIndex - 1 >= 0) {
      checkoutPrev(currentIndex)
    }
    if (event.keyCode === 40 && currentIndex + 1 < chatList.value.length) {
      checkoutNext(currentIndex)
    }
  }
  const checkoutPrev = (currentIndex: any) => {
    isCheckouting.value = true
    chatStore
      .checkoutChat(chatList.value[currentIndex - 1].conversationID)
      .then(() => {
        isCheckouting.value = false
      })
      .catch(() => {
        isCheckouting.value = false
      })
  }
  const checkoutNext = (currentIndex: any) => {
    isCheckouting.value = true
    chatStore
      .checkoutChat(chatList.value[currentIndex + 1].conversationID)
      .then(() => {
        isCheckouting.value = false
      })
      .catch(() => {
        isCheckouting.value = false
      })
  }

  let firstRender = true

  watch(
    () => chatList.value,
    (newChatList) => {
      console.log('newChatList', newChatList)
      if (newChatList.length) {
        const lackSn = newChatList?.some((item: any) => item.sn === undefined)
        console.log('lackSn', lackSn)
        if (lackSn) {
          getSn()
        }

        if (firstRender && newChatList.length) {
          chatStore.updateCurrentChat(chatList.value[0])
          firstRender = false
        }
      }
    }
  )

  onMounted(() => {
    // window.addEventListener('keydown', handleKeydown)
    chatStore.updateTableLoading(true)
  })
  onActivated(() => {
    console.log('onActivated')
  })

  onUnmounted(() => {
    // window.removeEventListener('keydown', handleKeydown)
  })
</script>

<style scoped lang="less">
  @import '@/assets/style/mixins.less';
  .chat-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-bg-2);

    &-content {
      flex: 1;
      overflow: auto;
      height: 100%;
      .custom-scrollbar;
    }
  }
  @plr: 7px;
  :deep(.arco-card-body) {
    padding-left: @plr;
    padding-right: @plr;
    overflow: hidden;
  }
  :deep(.chat-item) {
    cursor: pointer;
  }
</style>
