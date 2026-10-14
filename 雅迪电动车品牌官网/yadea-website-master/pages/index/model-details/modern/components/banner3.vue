<template>
  <div ref="banner" class="page-model-details-modern-banner3 pos-rel flex-hvc">
    <div ref="banner3" class="content txt-c modern-banner3">
      <div class="content-txt1">天生瞩目 迷倒一票</div>
      <div class="content-txt2">女王复古美学</div>
      <div class="content-txt3">
        雅迪以“她”为灵感缪斯，打造专属复古吸睛车色，迷人弧度<br />
        从头到脚都是亮眼的新设计，让每个心动都冒起“火花”
      </div>
      <img src="@/assets/images/model-details/modern/banner3.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner3 = ref()
useChangeOpacity(banner, [banner3], 'banner3-animation', false)
</script>

<style lang="less">
.page-model-details-modern-banner3 {
  height: 1421pxvw;
  .modern-banner3 {
    position: absolute;
    padding-top: 8.177083vw;
  }
  .banner3-animation {
    animation: opacityBanner33 1.5s ease-in-out 0s 1;
  }
  @keyframes opacityBanner33 {
    0% {
      opacity: 0;
      padding-top: 13.177083vw;
    }
    100% {
      opacity: 1;
      padding-top: 8.177083vw;
    }
  }
  .content {
    padding-bottom: 193pxvw;

    &-txt1 {
      .fs(55);
      color: #222;
      font-weight: bold;
    }
    &-txt2 {
      .fs(30);
      margin: 0.5vw 0 2.125vw;
      color: #333;
      font-weight: bold;
    }
    &-txt3 {
      .fs(24);
      color: #333;
      .mb(89);
    }
    img {
      display: inline-block;
      .w(1420);
      .h(751);
      margin: auto;
    }
  }
}
</style>
