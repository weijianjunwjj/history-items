<template>
  <div class="m-page-model-details-modern-banner8 pos-rel">
    <div ref="banner" class="banner8-content">
      <div ref="banner81" class="banner8-mod2">
        <img
          ref="banner81img"
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DJ_2671e5f94c.png?updated_at=2023-03-30T04:17:38.600Z')"
          alt=""
        />

        <div ref="banner81txt" class="title">
          <div class="txt1">雅迪国际领先TTFAR电机</div>
          <div class="txt2">轻享动力，舒适与动力兼得的全新驾驶体验。<br />在不同圈子，同样成为万人迷</div>
        </div>
      </div>
      <div ref="banner82" class="banner8-mod3">
        <img
          ref="banner82img"
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/24_84a2ad1c43.png?updated_at=2023-03-30T04:17:38.720Z')"
          alt=""
        />
        <div ref="banner82txt" class="title full-w">
          <div class="txt1">女性专属雅迪TTFAR<br />智驾电控核芯</div>
          <div class="txt2">优化调教油门曲线<br />动力充足又柔和平顺<br />满足各种心境下的骑行需求</div>
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
.m-page-model-details-modern-banner8 {
  height: 1631mpxvw;
  background: url(https://osswebsite.yadea.com.cn/1_1_cb01676760.png?updated_at=2023-03-30T04:11:23.481Z) no-repeat;
  background-size: contain;

  .txt1 {
    width: 100%;
    text-align: center;
    line-height: 1.2;
  }
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
    top: 556mpxvw;
    padding: 0 14mpxvw;
  }

  .banner8-mod2 {
    img {
      width: 347mpxvw;
      height: 521mpxvw;
    }

    .title {
      width: 100%;
      position: absolute;
      top: 389mpxvw;
      .pos-middle-h;
      text-align: center;
      .txt1 {
        font-size: 21mpxvw;
        font-weight: bold;
        color: #ffffff;
      }
      .txt2 {
        font-size: 14mpxvw;
        color: #ffffff;
        margin-top: 20mpxvw;
      }
    }
  }
  .banner8-mod3 {
    margin-top: 14mpxvw;
    img {
      width: 347mpxvw;
      height: 521mpxvw;
    }
    .title {
      position: absolute;
      bottom: 11.052083vw;
      text-align: center;
      .pos-middle-h;
      .txt-c;
      .txt1 {
        font-size: 21mpxvw;
        font-weight: bold;
        color: #ffffff;
      }
      .txt2 {
        font-size: 14mpxvw;
        color: #ffffff;
        margin-top: 20mpxvw;
      }
    }
  }
}
</style>
