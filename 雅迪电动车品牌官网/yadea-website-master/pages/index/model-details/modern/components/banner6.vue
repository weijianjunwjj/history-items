<template>
  <div ref="banner" class="page-model-details-modern-banner6 pos-rel">
    <div ref="banner6" class="banner6-content">
      <div class="txt1">舒适天地 随你定义</div>
      <div class="txt2">UX女王优享工艺</div>
      <div class="txt3">随心所欲的舒适骑行，源于细节的追求</div>
    </div>
    <img src="@/assets/images/model-details/modern/banner6.png" alt="" />
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner6 = ref()
useChangeOpacity(banner, [banner6], 'banner6-animation', false)
</script>

<style lang="less">
.page-model-details-modern-banner6 {
  height: 1417pxvw;
  background: #e0f9ea;
  padding-bottom: 187pxvw;

  .banner6-animation {
    animation: opacityBanner0 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0 {
    0% {
      opacity: 0;
      padding-top: 13.177083vw;
    }
    100% {
      opacity: 1;
      padding-top: 8.177083vw;
    }
  }

  .txt-c;
  .banner6-content {
    padding-top: 182pxvw;
    .txt1 {
      font-size: 55pxvw;
      color: #222222;
      // font-weight: bold;
    }
    .txt2 {
      font-size: 30pxvw;
      color: #333333;
      margin: 0.5vw 0 2.125vw;
    }
    .txt3 {
      font-size: 24pxvw;
      color: #333333;
      margin-bottom: 100pxvw;
    }
  }
  img {
    width: 1420pxvw;
    height: 751pxvw;
  }
}
</style>
