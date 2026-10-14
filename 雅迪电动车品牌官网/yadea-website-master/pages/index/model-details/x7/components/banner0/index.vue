<template>
  <div ref="banner" class="banner-0">
    <div ref="banner0" class="describe">
      <div class="top">
        <div class="title-container">
          <div class="title HYQiHei-bold">雅迪冠能</div>
          <div class="subTitle HYQiHei">探索X7</div>
        </div>
        <div class="title-describe HYQiHei-bold">超长续航 超强动力</div>
        <div class="title-sub-describe HYQiHei-bold">国际领先TTFAR 5.0 GT增程系统 | 1200W TTFAR PRO电机 超强动力 | 105N.m扭矩轻松爬坡</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner0 = ref()
useChangeOpacity(banner, [banner0], 'banner0-animation', false)
</script>
<style lang="less">
.banner-0 {
  position: relative;
  width: 100%;
  height: 964pxvw;
  background: url('https://osswebsite.yadea.com.cn/banner_0_b44f793dcd.png?updated_at=2023-03-20T08:32:21.604Z') no-repeat;
  background-size: cover;
  background-position: center center;
  margin-top: @layout-header-height;

  .describe {
    display: inline-block;
    position: absolute;
    top: 104pxvw;
    left: 0;
    right: 0;
    margin: 0 auto;

    text-align: center;

    .top {
      text-align: center;
      .title-container {
        width: 498pxvw;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;

        .title {
          color: #ffffff;
          font-size: 65pxvw;
          line-height: 104pxvw;
        }

        .subTitle {
          color: #63b03b;
          font-size: 64pxvw;
          line-height: 104pxvw;
        }
      }

      .title-describe {
        color: #ffffff;
        font-size: 32pxvw;
      }

      .title-sub-describe {
        color: #ffffff;
        font-size: 24pxvw;
      }
    }
  }

  .banner0-animation {
    animation: opacityBanner0 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0 {
    0% {
      opacity: 0;
      top: 531px;
    }
    100% {
      opacity: 1;
      top: 311pxvw;
    }
  }
}
</style>
