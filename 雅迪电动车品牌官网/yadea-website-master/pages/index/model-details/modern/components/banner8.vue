<template>
  <div class="page-model-details-modern-banner8 pos-rel">
    <div ref="banner" class="banner8-content">
      <div ref="banner81" class="banner8-mod2">
        <img ref="banner81img" src="@/assets/images/model-details/modern/banner8-mod2.png" alt="" />

        <div ref="banner81txt" class="title">
          <div class="txt1">雅迪国际领先TTFAR电机</div>
          <div class="txt2">轻享动力，舒适与动力兼得的全新驾驶体验。在不同圈子，同样成为万人迷</div>
        </div>
      </div>
      <div ref="banner82" class="banner8-mod3">
        <img ref="banner82img" src="@/assets/images/model-details/modern/banner8-mod3.png" alt="" />
        <div ref="banner82txt" class="title">
          <div class="txt1">女性专属雅迪TTFAR智驾电控核芯</div>
          <div class="txt2">优化调教油门曲线，动力充足又柔和平顺<br />满足各种心境下的骑行需求。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner81 = ref()
const banner82 = ref()
const banner81txt = ref()
const banner82txt = ref()
const banner81img = ref()
const banner82img = ref()

// useChangeOpacity(banner, [banner81, banner82], 'banner8-animation', false)
useChangeOpacity(banner81, [banner81txt, banner81img], 'banner8-animation-txt1', false)
useChangeOpacity(banner82, [banner82txt, banner82img], 'banner8-animation-txt2', false)
</script>

<style lang="less">
.page-model-details-modern-banner8 {
  height: 2884pxvw;
  background: url(https://osswebsite.yadea.com.cn/1_1_dc0435995f.png?updated_at=2023-03-29T06:38:11.843Z) no-repeat;
  background-size: contain;

  .banner8-animation {
    animation: opacityBanner0 2.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner0 {
    0% {
      opacity: 0;
      padding-top: 4vw;
    }
    100% {
      opacity: 1;
      padding-top: 0;
    }
  }

  .banner8-animation-txt1 {
    animation: opacityBannertxt1 1.5s ease-in-out 0s 1;
  }
  .banner8-animation-txt2 {
    animation: opacityBannertxt2 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBannertxt1 {
    0% {
      margin-top: 5vw;
      padding-top: 4vw;
    }
    100% {
      margin-top: 0vw;
      padding-top: 0;
    }
  }
  @keyframes opacityBannertxt2 {
    0% {
      opacity: 0;
      bottom: 60pxvw;
    }
    100% {
      opacity: 1;
      bottom: 69pxvw;
    }
  }

  .banner8-content {
    position: absolute;
    top: 818pxvw;
    padding: 0 250pxvw;
  }

  .banner8-mod2 {
    img {
      width: 1420pxvw;
      height: 799pxvw;
    }

    .title {
      position: absolute;
      top: 629pxvw;
      .pos-middle-h;
      text-align: center;
      .txt1 {
        font-size: 30pxvw;
        font-weight: bold;
        color: #ffffff;
      }
      .txt2 {
        font-size: 24pxvw;
        color: #ffffff;
        margin-top: 26pxvw;
      }
    }
  }
  .banner8-mod3 {
    margin-top: 129pxvw;
    img {
      width: 1420pxvw;
      height: 799pxvw;
    }
    .title {
      position: absolute;
      bottom: 69pxvw;
      text-align: center;
      .pos-middle-h;
      .txt-c;
      .txt1 {
        font-size: 30pxvw;
        font-weight: bold;
        color: #ffffff;
      }
      .txt2 {
        font-size: 24pxvw;
        color: #ffffff;
        margin-top: 35pxvw;
      }
    }
  }
}
</style>
