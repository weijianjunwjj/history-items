<template>
  <div ref="banner" class="m-page-model-details-modern-banner6 pos-rel">
    <div ref="banner6" class="banner6-content">
      <div class="txt1">舒适天地 随你定义</div>
      <div class="txt2">UX女王优享工艺</div>
      <div class="txt3">随心所欲的舒适骑行，源于细节的追求</div>
    </div>
    <img
      :src="
        replaceImgUrl(
          'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/671678862732_pic_hd_1_c7061326cc.png?updated_at=2023-03-30T02:39:24.482Z'
        )
      "
      alt=""
    />
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner6 = ref()
useChangeOpacity(banner, [banner6], 'banner6-animation', false)
</script>

<style lang="less">
.m-page-model-details-modern-banner6 {
  height: 813mpxvw;
  background: #e0f9ea;
  padding-bottom: 17mpxvw;

  .banner6-animation {
    animation: opacityBanner0m 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0m {
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
    padding-top: 83mpxvw;
    .txt1 {
      font-size: 24mpxvw;
      color: #222222;
      line-height: 1;
      // font-weight: bold;
    }
    .txt2 {
      font-size: 21mpxvw;
      color: #333333;
      margin: 23mpxvw 0 44mpxvw;
    }
    .txt3 {
      font-size: 14mpxvw;
      color: #333333;
      margin-bottom: 56mpxvw;
    }
  }
  img {
    width: 347mpxvw;
    height: 521mpxvw;
  }
}
</style>
