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
  <Title :text="title" :white="false" style="background-color: #fff"></Title>
  <view class="noticeDetailContainer">
    <cc-pullScroolView
      class="pullScrollView"
      ref="pullScroll"
      :pullDown="pullDown"
      upFinishText=""
      pullingText="Pull to refresh"
      loosingText="Release refresh"
      downLoadingText="refresh..."
      upLoadingText="loading..."
      downSuccessText="Refresh successfully"
      downErrorText="Refresh failure"
      upErrorText="If loading fails, click Reload"
    >
      <template v-if="currentNoticeType == 3">
        <!-- 动态通知 -->
        <view class="tabListCub flex-sb-c" style="justify-content: center">
          <view
            class="tabItem flex flex-vc"
            :class="{ activeTab: item.checked }"
            v-for="(item, index) in tabListDate"
            :key="index"
            @click="onTabCheckChange(item)"
          >
            <image class="tabIcon" :src="item.checkimg" v-if="item.checked" />
            <image class="tabIcon" :src="item.img" v-else />
            <p>{{ item.title }}</p>
          </view>
        </view>
        <!-- 动态通知列表-->
        <view class="flex dynamicItemInfo" v-for="(item, index) in messageList" :key="index">
          <view class="dynamicItemInfo_leftIcon flex-cc">
            <image
              class="contactsAdver"
              mode="aspectFill"
              :src="getAvatar({ avatar: item.senderAvatar, gender: item.gender })"
            />
            <image
              class="contactsSexIcon"
              src="/static/images/system/woman.png"
              v-if="item.gender == 2"
            />
            <image class="contactsSexIcon" src="/static/images/system/man.png" v-else />
          </view>
          <view class="dynamicItemInfo_main">
            <view class="dynamicMain_name flex-c ellipsis">
              <p class="ellipsis namep">{{ item.senderName }}</p>
              <span>{{ timeFormatting(item.notificationTime) }}</span>
            </view>
            <p class="dynamicMain_desc ellipsis">
              <!-- <span>@abfiuchn</span> -->
              {{ item.notificationType == 1 ? item.content : 'Liked Your Post' }}
            </p>
          </view>
          <view class="dynamicItemInfo_rightIcon ellipsis-3">
            <image class="contactsStatus" :src="getUrl(item.parentUrl)" v-if="item.type == 2" />
            <template v-if="item.type == 1">
              {{ item.parentContent }}
            </template>
          </view>
        </view>

      </template>

      <template v-if="currentNoticeType == 7">
        <!-- 关注通知 -->
        <view class="flex contactsItemInfo" v-for="(item, index) in messageList" :key="index">
          <view class="contactsItemInfo_leftIcon flex-cc">
            <image
              class="contactsAdver"
              mode="aspectFill"
              :src="getAvatar({ avatar: item.senderAvatar, gender: item.senderGender })"
            />
            <image
              class="contactsSexIcon"
              src="/static/images/system/woman.png"
              v-if="item.senderGender == 2"
            />
            <image class="contactsSexIcon" src="/static/images/system/man.png" v-else />
          </view>
          <view class="flex-1 contactsItemInfo_main">
            <p>{{ item.senderName }}</p>
            <p>ID:{{ item.senderId }}</p>
            <p>{{ item.attentionTime }}</p>
          </view>
          <view class="contactsItemInfo_rightIcon flex-cc">
            <!-- 未关注    @click="onFollow(item)" -->
            <image
              class="contactsStatus"
              src="/static/images/system/unfollowed.png"
              v-if="item.relation == 0"
            />
            <!-- 已关注   @click="onUnFollow(item)"-->
            <image
              class="contactsStatus"
              src="/static/images/system/followed.png"
              v-if="item.relation == 1"
            />
            <!-- 互相关注   @click="onUnFollow(item)"-->
            <image
              class="contactsStatus"
              src="/static/images/system/intercorrelation.png"
              v-if="item.relation == 3"
            />
          </view>
        </view>
      </template>

      <template v-if="currentNoticeType == 1 || currentNoticeType == 2 || currentNoticeType == 4">
        <!-- 物流通知 系统通知 服务通知 -->
        <view class="flex noticeItemInfo" v-for="(item, index) in messageList" :key="index">
          <view class="noticeItemInfo_leftIcon flex">
            <image class="lefNoticeIcon" src="/static/images/system/system.png" />
          </view>
          <view class="flex-1 noticeItemInfo_rigMessage">
            <view class="flex-sb-c">
              <p class="sysTitle">{{ notifyFormat[currentDetailType]?.title }}</p>
              <p class="sysTime">{{ timeFormatting(item.time || item.createdAt) }}</p>
            </view>
            <view class="messageContentMain">
              <!-- 系统通知广告图 目前后端无字段 -->
              <!-- <view class="messageAdv" v-if="currentNoticeType == 4">
                <image class="advImg" src="/static/images/login/loginbanner.png" />
              </view> -->

              <view class="messageContent">
                {{ item.content }}
              </view>
            </view>
          </view>
        </view>
      </template>

      <Empty v-if="!messageList.length" />
    </cc-pullScroolView>

  </view>
</template>

<script lang="ts" setup>
import { getNotifyIndex, clearNotifyNum } from '@/service/system/system'
import { notifyFormat } from './data'
import { getUrl } from '@/utils/utils'
import { followUser, unFollowUser } from '@/service/search/search'
import { debounce } from 'lodash'
import { useToast } from 'wot-design-uni'
import { timeFormatting, getAvatar } from '@/utils/utils'
import Empty from '@/components/Empty/Empty.vue'

const toast = useToast()
const title = ref('System Notification')
const { userInfo }: { userInfo: any } = useUserInfo()
const messageList = ref([])
const pages = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})
const pullScroll = ref()
const tabListDate = reactive([
  // {
  //   img: '/static/images/system/eit.png',
  //   checkimg: '/static/images/system/checkeit.png',
  //   title: '@Me',
  //   checked: true,
  // },
  {
    img: '/static/images/system/critic.png',
    checkimg: '/static/images/system/checkcritic.png',
    title: 'Comment',
    checked: true,
    type: 5,
  },
  {
    img: '/static/images/system/like.png',
    checkimg: '/static/images/system/checklike.png',
    title: 'Like',
    checked: false,
    type: 6,
  },
])

const currentDetailType = ref(1)
const currentNoticeType = ref(1)

function onTabCheckChange(row: any) {
  tabListDate.map((r) => (r.checked = false))
  row.checked = true
  messageList.value = []
  currentDetailType.value = row.type
  pages.page = 1
  getSystemList()
  clearCurrentNotify()
}

// 下拉刷新
function pullDown() {
  messageList.value = []
  pages.page = 1
  getSystemList()
}

onReachBottom(() => {
  if (messageList.value.length >= pages.total) return
  pullScroll.value.showUpLoading()
  pages.page += 1
  getSystemList()
})

const getSystemList = () => {
  getNotifyIndex({
    accId: String(userInfo.value.imAccountId),
    // accId: '999999',
    type: Number(currentDetailType.value),
    page: pages.page,
    pageSize: pages.pageSize,
  }).then((res: any) => {
    if (res.code === 0) {
      messageList.value = [...messageList.value, ...(res.data.list || [])]
      pages.total = res.data.count
      setTimeout(() => {
        if (pages.page * pages.pageSize >= pages.total) {
          pullScroll.value.finish()
        } else {
          pullScroll.value.success()
        }
      }, 600)
    }
  })
}

const onUnFollow = debounce(async (item) => {
  const userId: number = item.senderId
  await unFollowUser(userId)
  toast.show('Unfollow success')
  messageList.value = []
  pages.page = 1
  getSystemList()
}, 200)

const onFollow = debounce(async (item) => {
  const userId: number = item.senderId
  await followUser(userId)
  toast.show('follow success')
  messageList.value = []
  pages.page = 1
  getSystemList()
}, 200)

function clearCurrentNotify() {
  clearNotifyNum({
    accId: String(userInfo.value.imAccountId),
    type: Number(currentNoticeType.value),
    isReadAll: false,
  })
}

onLoad((optios) => {
  const { noticeType } = optios
  currentNoticeType.value = noticeType
  console.log('noticeType', noticeType)
  if (noticeType == '3') {
    //3：动态通知 默认获取评论数据
    currentDetailType.value = 5
  } else {
    currentDetailType.value = noticeType
  }

  // uni.setNavigationBarTitle({
  //   title: notifyFormat[noticeType]?.title,
  // })
  const myTitle = notifyFormat[noticeType]?.title
  title.value = myTitle
  getSystemList()
  clearCurrentNotify()
})
</script>

<style lang="scss" scoped>
page {
  background: #f6f6f6;
}
:deep(uni-page-body) {
  height: 100%;
  background: #f6f6f6;
}
:deep(.wot-theme-light) {
  height: 100%;
}
.noticeDetailContainer {
  width: 100%;
  padding: 36rpx 58rpx 0 28rpx;
  box-sizing: border-box;
  background: #f6f6f6;
  .noticeItemInfo {
    margin-bottom: 36rpx;
    .noticeItemInfo_leftIcon {
      padding-right: 32rpx;
      box-sizing: border-box;
      .lefNoticeIcon {
        width: 103rpx;
        height: 102rpx;
      }
    }
    .noticeItemInfo_rigMessage {
      .sysTitle {
        font-weight: 800;
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
      .messageContentMain {
        margin-top: 20rpx;
        background: #ffffff;
        border-radius: 12rpx;
        padding: 16rpx 20rpx;
        box-sizing: border-box;
        .messageAdv {
          width: 100%;
          height: 230rpx;
          overflow: hidden;
          margin-bottom: 20rpx;
          .advImg {
            width: 100%;
            height: 100%;
          }
        }
        .messageContent {
          font-weight: 500;
          font-size: 26rpx;
          color: #959595;
          line-height: 30rpx;
        }
      }
    }
  }
  .contactsItemInfo {
    margin-bottom: 44rpx;
    .contactsItemInfo_leftIcon {
      position: relative;
      .contactsAdver {
        width: 102rpx;
        height: 102rpx;
        border-radius: 50%;
      }
      .contactsSexIcon {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        right: 0;
        bottom: 0;
      }
    }
    .contactsItemInfo_main {
      margin: 0 32rpx;
      p {
        font-weight: 400;
        font-size: 12px;
        color: #404040;
        margin-top: 5rpx;
        &:first-child {
          font-weight: 600;
          font-size: 16px;
          color: #404040;
          margin-top: 0;
        }
      }
    }
    .contactsItemInfo_rightIcon {
      .contactsStatus {
        width: 60rpx;
        height: 61rpx;
      }
    }
  }
  .tabListCub {
    width: 100%;
    padding: 0 40rpx 28rpx 40rpx;
    box-sizing: border-box;
    border-bottom: 2rpx solid #efefef;
    .tabItem {
      margin-right: 146rpx;
      &:last-child {
        margin-right: 0;
      }
      .tabIcon {
        width: 81rpx;
        height: 80rpx;
      }
      p {
        font-weight: 500;
        font-size: 26rpx;
        color: #404040;
      }
    }
    .activeTab {
      p {
        font-weight: 500;
        font-size: 26rpx;
        color: #00dba1;
      }
    }
  }
  .dynamicItemInfo {
    margin-top: 40rpx;
    .dynamicItemInfo_leftIcon {
      position: relative;
      width: 102rpx;
      height: 102rpx;
      .contactsAdver {
        width: 102rpx;
        height: 102rpx;
        border-radius: 50%;
      }
      .contactsSexIcon {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        right: 0;
        bottom: 0;
      }
    }
    .dynamicItemInfo_main {
      margin: 0 32rpx;
      width: calc(100% - 102rpx - 104rpx - 32rpx);
      .dynamicMain_name {
        width: 100%;
        font-weight: 600;
        font-size: 16px;
        color: #404040;
        margin-bottom: 5rpx;
        .namep {
          text-align: left;
          // flex: 1;
        }
        span {
          font-weight: 400;
          font-size: 10px;
          color: #404040;
          margin-left: 12rpx;
        }
      }
      .dynamicMain_desc {
        width: 100%;
        font-weight: 500;
        font-size: 12px;
        color: #404040;
        span {
          color: #00dba1;
        }
      }
    }
    .dynamicItemInfo_rightIcon {
      width: 104rpx;
      height: 104rpx;
      font-weight: 400;
      font-size: 10px;
      color: #404040;
      .contactsStatus {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
