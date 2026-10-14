<template>
  <view class="container container-user-list">
    <scroll-view :scroll-x="true" class="scroll-view">
      <view v-for="(user, index) in avatarUserList" :key="index" class="user-item" @click="onClick(user)" >
        <view class="avatar-container">
          <view class="avatar-border" :style="user.avatar=='' && `padding:0`">
            <view class="avatar-box">
            <image
              :src="getAvatar(user)"
              class="avatar"
            />
            <view class="gender-icon" >
              <image
                v-if="user.gender==1"
                src="../../../static/images/index/man.png"
                style="width: 44rpx;height: 44rpx;"
              />
              <image
                v-else
                src="../../../static/images/index/woman.png"
                style="width: 44rpx;height: 44rpx;"
              />
            </view>
          </view>
          </view>
        </view>
        <view class="username-box">
          <text class="username" style="padding-top: 20rpx;">{{ user.nickname }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import {getAvatar} from '@/utils/utils'

const props = defineProps({
  avatarUserList: Array,
})


function onClick(item){
  console.log('item', item)
  uni.navigateTo({
    url: '/pages/person-page/person-page?id=' + item.userId,
  })
}


</script>

<style>
.container {
  padding: 10px;
  box-sizing: border-box;
}

.scroll-view {
  overflow-x: scroll; /* 仅允许水平滚动 */
  width: 100%; /* 设置宽度为页面宽度 */
  max-width: 100vw; /* 限制宽度 */
  /* max-width: calc(100vw - 20px); */
  box-sizing: border-box; /* 包含内边距在宽度内 */
  width: 100%;
  /* min-height: 174rpx; */
  /* overflow-x: hidden; */
}

.scroll-view {
  width: 100%;
  display: flex;
  white-space: nowrap;
  overflow-x: auto; /* 自动管理滚动 */
  -webkit-overflow-scrolling: touch; /* 支持更流畅的滚动 */
}

.user-item {
  display: inline-block;
  text-align: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 67px;
  height: 78px;
  box-sizing: border-box;
  margin-right: 20rpx;
}

.avatar-border {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid #00DBA1; /* 外边框颜色 */
  padding: 2px;
}
.avatar-box {
  width: 67px;
  height: 67px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar {
  width: 100%;
  height: 100%;
}

.gender-icon {
  position: absolute;
  bottom: 0px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
}

.username-box {
  padding-top: 8rpx;
}
.username {
  font-size: 14px;
  color: #333;
  margin-top: 20px;
}
</style>
<style lang="scss" scoped>
.container-user-list {
  // padding-top: 12px !important;
  padding-bottom: 2px !important;
}
</style>
