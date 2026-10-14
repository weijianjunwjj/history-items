<template>
  <div class="m-page-model-details-modern-banner4 pos-rel">
    <swiper
      class="modern-banner4-swiper pos-rel"
      :modules="modules"
      :pagination="{ clickable: true }"
      :centered-slides="true"
      slides-per-view="auto"
      :loop="true"
      :autoplay="{
        delay,
        disableOnInteraction: false
      }"
      @slide-change="onSwiperChange"
    >
      <swiper-slide v-for="(item, index) of swiper1" :key="index" class="pos-rel">
        <img class="modern-banner4-swiper-img" :src="item.img" alt="" />

        <div class="modern-banner4-swiper-content pos-middle-h txt-c full-w" :class="isShowAnimate1 && 'banner4-1-animation'">
          <div class="txt1">{{ item.txt1 }}</div>
          <div class="txt2">{{ item.txt2 }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { delay } from '@/configs/data'
import _ from 'lodash'
import img0 from '@/assets/images/model-details/modern/banner4-swiper0.png'
import img1 from '@/assets/images/model-details/modern/banner4-swiper1.png'
import img2 from '@/assets/images/model-details/modern/banner4-swiper2.png'
import img3 from '@/assets/images/model-details/modern/banner4-swiper3.png'
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'

const modules = [Pagination]

const banner = ref()
const isShowAnimate1 = $ref(false)
const isShowAnimate2 = $ref(false)

const swiper1 = $ref([
  {
    img: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/psdf4ogicxnq9qxplaehnivov2m347hr2ie1f32029_6ae5_4c3e_8268_e417a875a9c3_f89d9cc580.png?updated_at=2023-03-30T01:51:38.371Z',
    txt1: '高辨识度前脸',
    txt2: '将经典与现代完美演绎'
  },
  {
    img: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/R11_dadeng_1ef97eabe0.png?updated_at=2023-03-30T01:47:45.937Z',
    txt1: '复古圆润大灯',
    txt2: '灵感全开，过眼难忘'
  },
  {
    img: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_e66863b297.png?updated_at=2023-03-30T01:47:48.618Z',
    txt1: '精巧液晶仪表',
    txt2: '感受极简舒适的新体验'
  },
  {
    img: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_c68c640eff.png?updated_at=2023-03-30T01:47:47.691Z',
    txt1: '镜面减震',
    txt2: '精致气质，若隐若现'
  }
])
// ---data---

// ---function---
const onSwiperChange = _.debounce(function (el) {
  isShowAnimate1 = false
  isShowAnimate2 = false

  setTimeout(() => {
    isShowAnimate1 = true
    isShowAnimate2 = true
  }, 100)
}, 5)

function handleScroll() {
  const dom = document.querySelector('.m-page-model-details-modern-banner4')

  if (isInView(dom)) {
    isShowAnimate1 = true
    isShowAnimate2 = true
  } else {
    isShowAnimate1 = false
    isShowAnimate2 = false
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less">
.m-page-model-details-modern-banner4 {
  .banner4-1-animation {
    animation: opacityBanner2m 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner2m {
    0% {
      opacity: 0;
      top: 91mpxvw;
    }
    100% {
      opacity: 1;
      top: 81mpxvw;
    }
  }
  .modern-banner4-swiper {
    &-img {
      .m-w(375);
      .m-h(667);
    }
    &-content {
      top: 81mpxvw;
      color: #ffffff;
      line-height: 1 !important;
      .txt-c;
      .txt1 {
        font-weight: bold;
        .m-fs(24);
      }
      .txt2 {
        .m-mt(25);
        .m-fs(14);
      }
    }

    .swiper-pagination-bullet {
      width: 42px;
      height: 2px;
      background: #ffffff;
      border-radius: 0 !important;
    }

    .swiper-horizontal > .swiper-pagination-bullets,
    .swiper-pagination-bullets.swiper-pagination-horizontal,
    .swiper-pagination-custom,
    .swiper-pagination-fraction {
      bottom: 157pxvw;
    }
  }
}
</style>
