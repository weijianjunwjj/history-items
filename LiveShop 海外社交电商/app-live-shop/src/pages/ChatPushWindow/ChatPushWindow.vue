<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    backgroundColor: 'transparent',
    'app-plus': {
      animationType: 'fade-in',
      background: 'transparent',
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <view class="page">
    <view class="content flex-vc just-sb">
      <view class="avatar-container flex-cc">
        <image class="avatar" :src="getAvatar(data)" />
        <gender-icon />
      </view>

      <view class="fs-28 mtb-4">{{ data.nickname }}</view>
      <view class="fs-28 mb-4">{{ data.dist }} kilometers away</view>
      <wd-button custom-class="chatBtn" @click="onBack">Chat Now</wd-button>
    </view>

    <image class="cha" src="../../static/images/common/cha.png" @click="onBack" style="width: 24rpx; height: 24rpx" />

  </view>
</template>

<script setup lang="ts">
import { getRecommendUser } from '@/service/index';
import {getAvatar} from '@/utils/utils'

function onBack() {
  uni.navigateBack({
    delta: 1,
  })
}

const data:any=ref({})

onShow(async ()=>{
  const res=await getRecommendUser()
  data.value=res.data
  console.log('res', res)
  setTimeout(() => {
    onBack()
  }, 6000);
})
</script>

<style lang="scss">
.page {
  position: fixed;
  top: calc(92rpx + var(--status-bar-height));
  left: 0;
  right: 0;
  margin: auto;
  width: 662rpx;
  box-shadow: 8rpx 8rpx 41rpx 8rpx rgba(0, 0, 0, 0.55);
  border-radius: 16rpx;
  background: url(../../static/images/common/bg.jpg) no-repeat;
  background-size: 100% 100%;
}
.content {
  height: 100%;
  color: #fff;
  padding-top: 60rpx;
  padding-bottom: 36rpx;
}
page {
  background: transparent;
}

.chatBtn {
  width: 470rpx !important;
  height: 76rpx !important;
  background: #ffffff !important;
  border-radius: 76rpx !important;
  font-weight: 800 !important;
  font-size: 32rpx !important;
  color: #00dba1 !important;
}

.avatar-container {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  box-sizing: border-box;
  border: 6rpx solid #fff;
  border-radius: 50%;
  background-color: #fff;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover; /* 确保图片保持比例填满容器 */
}
.cha{
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  z-index: 1;
}

.bgimg2{
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

</style>
