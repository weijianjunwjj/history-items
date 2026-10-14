<template>
  <div ref="banner" class="page-model-details-modern-banner10 pos-rel">
    <img
      ref="banner1"
      :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/19_0e02178bf5.png?updated_at=2023-03-29T06:48:18.319Z')"
      class="pos-middle-v"
      alt=""
    />
    <div ref="banner2" class="content pos-middle-v">
      <div class="txt1">无需钥匙 一碰即走</div>
      <div class="txt2">YADEA OS智慧中枢</div>
      <div class="txt3">NFC刷卡解锁,轻轻一碰，即刻解锁</div>
    </div>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'

const banner = ref()
const banner1 = ref()
const banner2 = ref()

useChangeOpacity(banner, [banner1, banner2], 'banner10-animation', false)
</script>

<style lang="less">
.page-model-details-modern-banner10 {
  height: 937pxvw;
  img {
    right: 152pxvw;
    width: 972pxvw;
    height: 675pxvw;
  }

  .banner10-animation {
    animation: opacityBanner0 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0 {
    0% {
      opacity: 0;
      top: 60%;
    }
    100% {
      opacity: 1;
      top: 50%;
    }
  }
  .content {
    left: 399pxvw;
    .txt1 {
      font-size: 55pxvw;
      color: #222222;
      // font-weight: bold;
    }
    .txt2 {
      font-size: 30pxvw;
      color: #333333;
      margin: 0.5vw 0 2.125vw;
      // font-weight: bold;
    }
    .txt3 {
      font-size: 24pxvw;
      color: #333333;
    }
  }
}
</style>
