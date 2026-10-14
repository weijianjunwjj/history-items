<template>
  <div ref="banner2" class="banner-2-mob">
    <div ref="titleContainer" class="title-container-mob">
      <div ref="title" class="title HYQiHei-bold">全面进化 天生强悍</div>
      <div ref="subTitle" class="subTitle HYQiHei">雅迪国际领先TTFAR 5.0 GT增程系统</div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner2 = ref()
const titleContainer = ref()

useChangeOpacity(banner2, [titleContainer], 'testClass', false)
</script>
<style lang="less">
.banner-2-mob {
  width: 100%;
  height: 595mpxvw;
  background: url('https://osswebsite.yadea.com.cn/8_88ad9c9984.png?updated_at=2023-03-28T08:53:16.279Z') no-repeat;
  background-size: 100%;
  text-align: center;

  .title-container-mob {
    overflow: hidden;
    .title {
      font-size: 24mpxvw;
      color: #6abb3f;
      line-height: 24mpxvw;
      margin: 51mpxvw 0 0;
    }

    .subTitle {
      font-size: 14mpxvw;
      color: #ffffff;
      line-height: 14mpxvw;
      margin: 13mpxvw 0 0;
    }
  }

  .testClass {
    animation: opacityBanner2 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner2 {
    0% {
      opacity: 0;
      position: relative;
      top: 100mpxvw;
    }
    100% {
      opacity: 1;
      position: relative;
      top: 0;
    }
  }
}
</style>
