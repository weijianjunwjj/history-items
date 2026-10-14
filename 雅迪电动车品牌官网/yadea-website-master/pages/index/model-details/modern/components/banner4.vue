<template>
  <div class="page-model-details-modern-banner4 pos-rel">
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

        <div v-show="item.type === 1" class="modern-banner4-swiper-content pos-abs" :class="isShowAnimate1 && 'banner4-1-animation'">
          <div class="txt1">{{ item.txt1 }}</div>
          <div class="txt2">{{ item.txt2 }}</div>
        </div>
        <div
          v-show="item.type === 2"
          class="modern-banner4-swiper-content2 pos-abs pos-middle-h"
          :class="isShowAnimate2 && 'banner4-2-animation'"
        >
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
    img: img3,
    txt1: '高辨识度前脸',
    txt2: '将经典与现代完美演绎',
    type: 1
  },
  {
    img: img1,
    txt1: '复古圆润大灯',
    txt2: '灵感全开，过眼难忘',
    type: 2
  },
  {
    img: img2,
    txt1: '精巧液晶仪表',
    txt2: '感受极简舒适的新体验',
    type: 2
  },
  {
    img: img0,
    txt1: '镜面减震',
    txt2: '精致气质，若隐若现',
    type: 1
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
}, 10)

function handleScroll() {
  const dom = document.querySelector('.page-model-details-modern-banner4')

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
.page-model-details-modern-banner4 {
  .banner4-1-animation {
    animation: opacityBanner1 1.5s ease-in-out 0s 1;
  }
  .banner4-2-animation {
    animation: opacityBanner2 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner1 {
    0% {
      opacity: 0;
      top: 24.302083vw;
    }
    100% {
      opacity: 1;
      top: 21.302083vw;
    }
  }
  @keyframes opacityBanner2 {
    0% {
      opacity: 0;
      top: 8.208333vw;
    }
    100% {
      opacity: 1;
      top: 5.208333vw;
    }
  }
  .modern-banner4-swiper {
    &-img {
      width: 1919pxvw;
      height: 1080pxvw;
    }
    &-content {
      top: 409pxvw;
      left: 400pxvw;
      color: #ffffff;
      line-height: 1 !important;
      .txt1 {
        font-weight: bold;
        .fs(55);
      }
      .txt2 {
        .mt(35);
        .fs(30);
      }
    }

    &-content2 {
      top: 100pxvw;
      color: #ffffff;
      line-height: 1 !important;
      .txt-c;
      .txt1 {
        font-weight: bold;
        .fs(55);
      }
      .txt2 {
        .mt(35);
        .fs(30);
      }
    }

    .swiper-pagination-bullet {
      width: 100px;
      height: 4px;
      background: #ffffff;
      border-radius: 1px;
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
