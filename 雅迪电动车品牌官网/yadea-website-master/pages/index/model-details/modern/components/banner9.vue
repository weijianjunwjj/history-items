<template>
  <div ref="banner" class="page-model-details-modern-banner9 pos-rel">
    <div ref="banner9" class="content pos-middle-v">智能读心 知你心意</div>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'

const banner = ref()
const banner9 = ref()

useChangeOpacity(banner, [banner9], 'banner9-animation', false)
</script>

<style lang="less">
.page-model-details-modern-banner9 {
  height: 1001pxvw;
  background: url(@/assets/images/model-details/modern/banner9.png) no-repeat;
  background-size: contain;
  margin-top: -1px;
  .banner9-animation {
    animation: opacityBanner0 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0 {
    0% {
      opacity: 0;
      top: 55%;
    }
    100% {
      opacity: 1;
      top: 50%;
    }
  }
  .content {
    position: absolute;
    right: 340pxvw;
    font-size: 55pxvw;
    color: #ffffff;
    font-weight: bold;
  }
}
</style>
