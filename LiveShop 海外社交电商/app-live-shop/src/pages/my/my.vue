<route lang="json5">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '我的',
    'app-plus': {
      titleNView: false,
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <view class="page">
    <header class="flex-sb-c">
      <view class="flex">
        <view class="rel">
          <image :src="avatar" mode="aspectFill" class="circle" style="width: 139rpx; height: 139rpx" />
          <gender-icon :gender="userInfo.gender" />
        </view>
        <view class="ml-7">
          <view style="font-size: 16px; color: #404040; width: 400rpx" class="two-line-text label">
            {{ userInfo.nickname }}
          </view>
          <view style="font-size: 12px; color: #404040;font-weight: 400;margin-top: 2px;">ID:{{ userInfo.Id }}</view>
        </view>
      </view>

      <image src="../../static/images/my/right-arrow.png" style="width: 20rpx; height: 36rpx"
        @click="toPage('/pages/person-page/person-page?id=' + userInfo.Id)" />
    </header>

    <main class="plr-6">
      <!-- 我的事件和我的消息 -->
      <view class="flex-c">
        <Card class-name="flex-c flex-1" @click="toPage('/pages/my-events/my-events')">
          <image src="../../static/images/my/event.png" style="width: 42rpx; height: 42rpx;font-weight: 400;" />
          <text class="ml-4 label">My Events</text>
        </Card>
        <Card class-name="flex-c ml-3 flex-1" @click="toPage('/pages/my-messages/my-messages')">
          <image src="../../static/images/my/messages.png" style="width: 42rpx; height: 42rpx" />
          <text class="ml-4 label">My Messages</text>
        </Card>
      </view>

      <!-- 我的钱包 -->
      <Card class-name="mtb-3 flex-c" @click="toPage('/pages/my-wallet/my-wallet')">
        <image src="../../static/images/my/wallet.png" style="width: 48rpx; height: 48rpx" />
        <text class="ml-4 label">My Wallet</text>
      </Card>

      <!-- 列表 -->
      <Card class-name="mtb-3" style="padding-top: 0; padding-bottom: 0; height: 70vh; position: relative;">
        <view v-for="(item, index) in list" :key="index" @click="item.click" class="flex-sb-c ptb-8 list-item">
          <view class="flex-c">
            <image :src="item.icon" style="width: 48rpx; height: 48rpx" />
            <text class="ml-4 label">{{ item.name }}</text>
          </view>

          <image src="../../static/images/my/right-arrow.png" style="width: 20rpx; height: 36rpx" />
        </view>
        <!-- 退出 -->
        <wd-button class="mt-3 logout" @click="onLogout">Logout</wd-button>
      </Card>
    </main>

  </view>
</template>

<script lang="ts" setup>
import {useToast} from 'wot-design-uni'
import {clearAll, getAvatar, getUrl, toPage} from '@/utils/utils'

const { userInfo, updateUserInfo } = useUserInfo()

const avatar = computed(() => {
  return getUrl(getAvatar(userInfo.value))
})

console.log('avatar',avatar.value)

const toast = useToast()

const list = ref([
  {
    name: 'My Orders',
    icon: '../../static/images/my/orders.png',
    click() {
      uni.navigateTo({ url: '/pages/order/order' })
    },
  },
  {
    name: 'Contact List',
    icon: '../../static/images/my/contact-list.png',
    click() {
      uni.navigateTo({ url: '/pages/contact-list/contact-list' })
    },
  },
  {
    name: 'System Announcement',
    icon: '../../static/images/my/system-announcement.png',
    click() {
      uni.navigateTo({ url: '/pages/systemNotice/systemNotice' })
    },
  },
  {
    name: 'System Settings',
    icon: '../../static/images/my/setting.png',
    click() {
      uni.navigateTo({ url: '/pages/address/address' })
    },
  },
])


const onLogout = () => {
  clearAll()
  uni.redirectTo({url: '/pages/login/login'})
}

// onTabItemTap((e) => {
//   updateUserInfo()
// })
</script>

<style lang="scss" scoped>
.ml-7{
	margin-top: 18rpx;
}
.page {
  background: linear-gradient(180deg, rgba(0, 219, 161, 0.05) 0%, rgba(0, 219, 161, 0) 26%), #f6f6f6;
}

header {
  height: 244rpx;
  padding-top: 94rpx;
  padding-left: 50rpx;
  padding-right: 60rpx;
}

.list-item {
  border-bottom: 2rpx solid #efefef;
}

.label {
  font-weight: 800;
  font-size: 28rpx;
  color: #404040;
}
.logout {
  width: 626rpx;
  position: fixed;
  bottom: 24px;
}
</style>
