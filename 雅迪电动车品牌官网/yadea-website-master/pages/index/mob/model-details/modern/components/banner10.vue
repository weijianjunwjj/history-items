<template>
  <div ref="banner" class="m-page-model-details-modern-banner10 pos-rel">
    <div ref="banner1" class="content pos-middle-h txt-c full-w">
      <div class="txt1 fw-bold">无需钥匙 一碰即走</div>
      <div class="txt2 fw-bold">YADEA OS智慧中枢</div>
      <div class="txt3">NFC刷卡解锁,轻轻一碰，即刻解锁</div>
    </div>
    <img
      ref="banner2"
      :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_ec152bd337.png?updated_at=2023-03-30T04:57:45.062Z')"
      alt=""
    />
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'

const banner = ref()
const banner1 = ref()
const banner2 = ref()

useChangeOpacity(banner, [banner1], 'banner10-animation', false)
useChangeOpacity(banner1, [banner2], 'banner10-animation2', false)
</script>

<style lang="less">
.m-page-model-details-modern-banner10 {
  height: 715mpxvw;

  .content {
    position: absolute;
    top: 89mpxvw;
    .txt1 {
      font-size: 24mpxvw;
      color: #222222;
      // font-weight: bold;
    }
    .txt2 {
      font-size: 21mpxvw;
      color: #333333;
      margin: 0.5vw 0 2.125vw;
      // font-weight: bold;
    }
    .txt3 {
      font-size: 14mpxvw;
      color: #333333;
    }
  }
  img {
    position: absolute;
    display: inline-block;
    top: 292mpxvw;
    width: 374mpxvw;
    height: 307mpxvw;
  }

  .banner10-animation {
    animation: opacityBanner0m 1.5s ease-in-out 0s 1;
  }

  .banner10-animation2 {
    animation: opacityBanner0m2 1.5s ease-in-out 0s 1;
  }

  // @keyframes opacityBanner0m {
  //   0% {
  //     opacity: 0;
  //     top: 27.533333vw;
  //   }
  //   100% {
  //     opacity: 1;
  //     top: 24.533333vw;
  //   }
  // }
  // @keyframes opacityBanner0m2 {
  //   0% {
  //     opacity: 0;
  //     top: 27.533333vw;
  //   }
  //   100% {
  //     opacity: 1;
  //     top: 24.533333vw;
  //   }
  // }
}
</style>
