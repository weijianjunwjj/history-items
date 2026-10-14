<template>
  <div
    :class="[
      'chat-item',
      chat.conversationID === currentChat.conversationID
        ? 'chat-item-collected'
        : '',
      chat.conversationID === currentChat.conversationID &&
        chatStore.isCalling &&
        'conic',
    ]"
    @click="selectChat"
  >
    <div class="close-btn">
      <a-popconfirm
        content="确认要删除吗?删除后仅可在历史通话记录模块中查看"
        type="info"
        @ok="deleteConversation"
      >
        <span
          class="tim-icon-close"
          title="删除会话"
          @click="deleteConversationClick"
        ></span>
      </a-popconfirm>
    </div>
    <a-space :size="4" direction="vertical" fill>
      <a-typography-text type="warning" class="flex just-sb">
        <div>
          {{ phone }}
        </div>
        <div class="unread-count">
          <span v-if="showUnreadCount" class="badge">
            {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
          </span>
        </div>
      </a-typography-text>
      <a-typography-text>{{ chat.content }}</a-typography-text>
      <div class="chat-item-footer">
        <div class="chat-item-time flex">
          <a-typography-text
            type="secondary"
            class="dis-ib omit"
            style="width: 75px"
          >
            <span :title="chat.sn">
              {{ chat.sn }}
            </span>
          </a-typography-text>
        </div>
        <div class="chat-item-time">
          <a-typography-text type="secondary">
            {{ date }}
          </a-typography-text>
        </div>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { isToday, getDate, getTime } from '@/utils/date'
  import { currentChat } from '@/hooks/videoCall'
  import { chatList } from '@/hooks/videoCall/chatPanel'
  import { getListByUserId } from '@/api/videoCall'
  import { faceTimeInfoMap } from '@/hooks/videoCall/user'
  import $bus from '@/utils/$bus'
  import { useChatStore } from '@/store'

  const app = window.$app
  const chatStore = useChatStore()
  const props = defineProps({
    chat: {
      type: Object,
      default() {
        return {}
      },
    },
  })

  const popoverVisible = ref(false)

  const phone = computed(() => {
    return props.chat?.userProfile?.userID?.split('-')[0]
  })

  const date = computed(() => {
    if (!props.chat?.lastMessage?.lastTime) {
      return ''
    }
    const _date = new Date(props.chat.lastMessage.lastTime * 1000)
    if (isToday(_date)) {
      return getTime(_date)
    }
    return getDate(_date)
  })

  const showUnreadCount = computed(() => {
    // eslint-disable-next-line no-unreachable
    const { chat } = props
    if (app.chatStore.hidden) {
      return chat.unreadCount > 0
    }

    // 是否显示未读计数。当前会话和未读计数为0的会话，不显示。
    return (
      currentChat.value.conversationID !== chat.conversationID &&
      chat.unreadCount > 0
    )
  })

  const selectChat = async () => {
    const c = props.chat
    console.log('c', c)
    const userId = c.userProfile.userID
    const userIDArr = userId.split('-')
    const newUserId = `${userIDArr[1]}-${userIDArr[2]}-${userIDArr[0]}`

    const cid = c.conversationID
    console.log(
      'cid !== currentChat.value.conversationID',
      cid !== currentChat.value.conversationID
    )
    if (cid !== currentChat.value.conversationID) {
      app.chatStore.updateTableLoading(true)
      app.chatStore.checkoutChat(cid)
      const tableData = await getListByUserId(userId)
      const deviceInfo = faceTimeInfoMap.value[newUserId]
      app.chatStore.updateCallTableData(tableData.data.items)
      app.chatStore.updateDeviceInfo(deviceInfo)
      $bus.emit('chat-panel-change')
    }
  }

  const conversationName = () => {
    const { chat } = props
    const { TIM } = app
    if (chat.type === TIM.TYPES.CONV_C2C) {
      return chat.userProfile.nick || chat.userProfile.userID
    }
    if (chat.type === TIM.TYPES.CONV_GROUP) {
      return chat.groupProfile.name || chat.groupProfile.groupID
    }
    if (chat.type === TIM.TYPES.CONV_SYSTEM) {
      return '系统通知'
    }
    return ''
  }

  const deleteConversation = (event: any) => {
    // 停止冒泡，避免和点击会话的事件冲突
    const { chat } = props
    const { tim } = window
    tim
      .deleteConversation(chat.conversationID)
      .then(() => {
        app.appStore.mess({
          message: `会话【${conversationName}】删除成功!`,
          type: 'success',
        })
        popoverVisible.value = false
        app.chatStore.resetCurrentConversation()
      })
      .catch((error: any) => {
        app.appStore.mess({
          message: `会话【${conversationName}】删除失败!, error=${error.message}`,
          type: 'error',
        })
        popoverVisible.value = false
      })
  }

  const deleteConversationClick = (event: any) => {
    event.stopPropagation()
  }
</script>

<style scoped lang="less">
  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  .conic {
    position: relative;
    z-index: 0;
    width: 200px;
    height: 68px;
    border-radius: 10px;
    overflow: hidden;
    padding: 2rem;

    &::before {
      content: '';
      position: absolute;
      z-index: -2;
      left: -26px;
      top: -90px;
      width: 250px;
      height: 250px;
      background-color: #399953;
      background-repeat: no-repeat;
      background-size: 50% 50%, 50% 50%;
      background-position: 0 0, 100% 0, 100% 100%, 0 100%;
      background-image: linear-gradient(#399953, #399953),
        linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33),
        linear-gradient(#377af5, #377af5);
      animation: rotate-6dd849fc 3s linear infinite;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      left: 6px;
      top: 6px;
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      background: white;
      border-radius: 5px;
      animation: 3s infinite alternate;
    }
  }

  .chat-item {
    position: relative;
    padding: 11px 17px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 2px;
    overflow: hidden;

    &-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-actions {
      display: flex;
      opacity: 0;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-right: 4px;
        color: var(--color-text-3);
        font-size: 14px;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          background-color: rgb(var(--gray-3));
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &-collected {
      // background-color: rgb(var(--gray-2));
      border: 1px solid #165dff;

      .chat-item-actions-collect {
        color: rgb(var(--gold-6));
      }
    }

    &:hover {
      background-color: rgb(var(--gray-2));

      .close-btn {
        right: 1px;
      }

      .chat-item-actions {
        opacity: 1;
      }
    }
    .close-btn {
      position: absolute;
      right: -20px;
      top: 3px;
      transition: all 0.2s ease;
      font-size: 16px;

      &:hover {
        color: #165dff;
      }
    }
    .unread-count {
      padding-left: 10px;
      flex-shrink: 0;
      color: @font-dark;
      font-size: 12px;

      .badge {
        vertical-align: bottom;
        background-color: @danger;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        max-width: 40px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
</style>
