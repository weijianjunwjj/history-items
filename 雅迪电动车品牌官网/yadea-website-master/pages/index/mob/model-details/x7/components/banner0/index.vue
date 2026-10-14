<template>
  <div ref="banner" class="banner-0-mob">
    <div ref="banner0" class="describe">
      <div class="top">
        <div class="title-container">
          <div class="title HYQiHei-bold">雅迪冠能</div>
          <div class="subTitle HYQiHei">探索X7</div>
        </div>
        <div class="title-describe HYQiHei-bold">超长续航 超强动力</div>
        <div class="title-suBdescribe HYQiHei-bold">
          国际领先TTFAR 5.0 GT增程系统 | 1200W TTFAR PRO电机 超强动力<br />105N.m扭矩轻松爬坡
        </div>
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
.banner-0-mob {
  position: relative;
  width: 100%;
  height: 545mpxvw;
  // background-color: #000;
  background-image: url('https://osswebsite.yadea.com.cn/122_72ec73339a.png?updated_at=2023-03-28T03:01:43.976Z');
  background-size: 100%;
  // background-position: 0 60mpxvw;

  .describe {
    display: inline-block;
    position: absolute;
    top: 68mpxvw;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;

    .top {
      text-align: center;
      .title-container {
        padding: 0 57mpxvw;
        display: flex;
        justify-content: center;
        .title {
          color: #ffffff;
          font-size: 24mpxvw;
          margin-right: 5mpxvw;
        }

        .subTitle {
          color: #63b03b;
          font-size: 24mpxvw;
        }
      }

      .title-describe {
        color: #ffffff;
        font-size: 17mpxvw;
      }

      .title-suBdescribe {
        color: #ffffff;
        font-size: 10mpxvw;
        margin: 10mpxvw 0 0;
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
