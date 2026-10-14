<route lang="json5">
  {
    layout: 'default',
    style: {
      'app-plus': {
        titleNView: false,
        popGesture: 'none',
      },
    },
  }
  </route>

<template>
  <Title text="System Announcement" :white="false" style="background-color: #fff">
      <text
        class="title-text"
        style="color: #00dba1; float: right; font-size: 16px; width: auto; font-weight: 600"
        @click="onNavigationBarButton"
      >
        All Read
      </text>
  </Title>
  <view class="systenNoticeContainer">
    <view
      class="flex-c noticeItemInfo"
      v-for="(item, index) in systemNotifyList"
      :key="index"
      @click="onClickToDetail(item)"
    >
      <view class="noticeItemInfo_leftIcon">
        <image class="lefNoticeIcon" :src="notifyFormat[item.type]?.icon" />
      </view>
      <view class="flex-1 noticeItemInfo_rigMessage">
        <view class="flex-sb-c">
          <p class="sysTitle">{{ notifyFormat[item.type]?.title }}</p>
          <p class="sysTime">{{ timeFormatting(item.createdAt) }}</p>
        </view>
        <view class="flex-c" v-if="item.content">
          <view class="flex-1 ellipsis-2 messageContent">
            {{ item.content }}
          </view>
          <view class="messageNum flex-cc">
            <wd-badge :modelValue="item.unreadNum" :max="99" type="success"></wd-badge>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getNotifybulletin, clearNotifyNum } from '@/service/system/system'
import { getDictSn } from '@/service/community/community'
import { useMessage, useToast } from 'wot-design-uni'
import { notifyFormat } from '@/pages/noticeDetail/data'
import { timeFormatting } from '@/utils/utils'

const message = useMessage()
const toast = useToast()
const { userInfo }: { userInfo: any } = useUserInfo()
const systemType = ref([])
const systemNotifyList = ref([])

function onClickToDetail(row: any) {
  uni.navigateTo({
    url: `/pages/noticeDetail/noticeDetail?noticeType=${row.type}`,
  })
}

const getSystemList = () => {
  getNotifybulletin({
    accId: String(userInfo.value.imAccountId),
    type: 99,
    page: 1,
    pageSize: 10,
  }).then((res: any) => {
    if (res.code === 0) {
      systemNotifyList.value = res.data.list || []
    }
  })
}

onShow(async () => {
  // 通知字典
  // const resDic: any = await getDictSn({ dictSn: 'MESSAGE_TYPE' })
  // systemType.value = resDic.data?.list
  getSystemList()
})

function onNavigationBarButton() {
  // 一键清除接口后端未提供 接口暂时模拟
  const isClear = systemNotifyList.value.some((e) => e.unreadNum >= 1)
  if (!isClear) {
    toast.show({
      msg: 'No Unread Messages',
    })
    return
  }
  message
    .confirm({
      msg: 'Are you sure to clear all unread messages?',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      closeOnClickModal: false,
    })
    .then(() => {
      clearNotifyNum({ accId: String(userInfo.value.imAccountId), type: 99, isReadAll: true }).then(
        (res) => {
          if (res.code === 0) {
            toast.success('All Messages Cleared!')
            getSystemList()
          }
        },
      )
    })
    .catch(() => {
      //
    })
}

onNavigationBarButtonTap((e: any) => {})
</script>

<style lang="scss" scoped>
.systenNoticeContainer {
  width: 100%;
  height: 100%;
  padding: 36rpx 28rpx 0 46rpx;
  box-sizing: border-box;
  background: #f6f6f6;
  .noticeItemInfo {
    margin-bottom: 20rpx;
    .noticeItemInfo_leftIcon {
      padding-right: 32rpx;
      padding-bottom: 18rpx;
      box-sizing: border-box;
      .lefNoticeIcon {
        width: 103rpx;
        height: 102rpx;
      }
    }
    .noticeItemInfo_rigMessage {
      border-bottom: 2rpx solid #efefef;
      padding-bottom: 18rpx;
      box-sizing: border-box;
      .sysTitle {
        font-weight: 600;
        font-size: 32rpx;
        color: #404040;
      }
      .sysTime {
        width: 150rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #404040;
        text-align: right;
      }
      .messageContent {
        font-weight: 400;
        font-size: 24rpx;
        color: #404040;
        margin-top: 10rpx;
        max-height: 68rpx;
      }
      .messageNum {
        width: 78rpx;
        :deep(.wd-badge__content) {
          border: none;
        }
      }
    }
  }
}

.title-text {
}
</style>
