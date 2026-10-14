<template>
  <div ref="banner" class="m-page-model-details-modern-banner9 pos-rel">
    <div ref="banner9" class="content pos-middle-h full-w txt-c">智能读心 知你心意</div>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'

const banner = ref()
const banner9 = ref()

useChangeOpacity(banner, [banner9], 'banner9-animation', false)
</script>

<style lang="less">
.m-page-model-details-modern-banner9 {
  height: 719mpxvw;
  background: url(https://osswebsite.yadea.com.cn/19_e36e500d57.png?updated_at=2023-03-30T04:57:45.724Z) no-repeat;
  background-size: contain;
  background-position: 100% 179mpxvw;
  margin-top: -1px;
  .banner9-animation {
    animation: opacityBanner0m 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0m {
    0% {
      opacity: 0;
      top: 27.533333vw;
    }
    100% {
      opacity: 1;
      top: 24.533333vw;
    }
  }
  .content {
    position: absolute;
    top: 92mpxvw;
    font-size: 24mpxvw;
    color: #333333;
    font-weight: bold;
    font-family: HYQiHei;
  }
}
</style>
