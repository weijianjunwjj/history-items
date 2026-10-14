<template>
  <div ref="banner2" class="banner-2">
    <div ref="titleContainer" class="title-container">
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
.banner-2 {
  position: relative;
  width: 100%;
  height: 957pxvw;
  background: url('https://osswebsite.yadea.com.cn/banner_2_c3c9eae219.png?updated_at=2023-03-20T10:50:40.168Z') no-repeat;
  background-size: cover;
  background-position: center center;

  .title-container {
    position: absolute;
    left: 342pxvw;
    top: 418pxvw;

    .title {
      font-size: 55pxvw;
      color: #6abb3f;
    }

    .subTitle {
      font-size: 30pxvw;
      color: #ffffff;
    }
  }

  .testClass {
    animation: opacityBanner2 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner2 {
    0% {
      opacity: 0;
      top: 500px;
    }
    100% {
      opacity: 1;
      top: 418pxvw;
    }
  }
}
</style>
