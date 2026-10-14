<!--
 * @Author: yqq
 * @Date: 2022-12-28 17:12:47
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-29 16:03:08
 * @FilePath: \yadea-website\pages\index\about-yadea\components\about-swiper-one.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-one模块 -->
  <div id="swiper-one" class="banner4">
    <swiper
      class="banner4-swiper pos-rel"
      :modules="modules"
      :centered-slides="true"
      :navigation="{ enabled: true, prevEl: '#pc-electric-prev', nextEl: '#pc-electric-next' }"
      slides-per-view="auto"
      :space-between="60"
      :loop="true"
      :autoplay="{
        delay,
        disableOnInteraction: false
      }"
      @slide-change="onSwiperChange"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(item, index) of mod.data" :key="index" @click="onSwiperClick(index)">
        <MyDisplay :url="item?.bgImage" :is-play="index === activeIndex"></MyDisplay>
      </swiper-slide>
      <div id="pc-electric-prev" class="common-swiper-btn electric-prev flex-hvc">
        <div class="div-bgimg"></div>
      </div>
      <div id="pc-electric-next" class="common-swiper-btn electric-next flex-hvc">
        <div class="div-bgimg"></div>
      </div>
    </swiper>

    <div class="banner4-content flex-col just-sb align-center pos-middle-h txt-white">
      <div :class="isShow && 'my-animate-sildeUp'" class="flex-col just-sb align-center swiper-one-animate my-animate">
        <div class="fs-16">{{ current.swiperDesc2 }}</div>
        <div class="fw-500 fs-60-vw">
          {{ current.swiperDesc1 }}
        </div>
        <div class="fs-30">{{ current.swiperDesc3 }}</div>

        <div class="mt-6">
          <MyButton v-if="current.button1" class-name="fs-18-vw mr-5" type="ghost" :href="current.buttonUrl1">{{
            current.button1
          }}</MyButton>
          <MyButton v-if="current.button2" class-name="fs-18-vw txt-white" :href="current.buttonUrl2">{{ current.button2 }}</MyButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { delay } from '@/configs/data'
import { isInView } from '@/composables/common.ts'
import _ from 'lodash'

const modules = [Pagination, Navigation]

const props = defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: []
      }
    }
  }
})

const isShow = ref(false)
const current = ref({})
const activeIndex = ref(0)
let curSwiper = null

const onSwiper = swiper => {
  curSwiper = swiper
}

const onSwiperClick = () => {
  curSwiper.slideToClickedSlide()
}

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el
  activeIndex.value = realIndex
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
  current.value = props.mod.data[realIndex]
}, 50)

function handleScroll() {
  if (process.client) {
    const dom = document.querySelector('.swiper-one-animate')

    if (isInView(dom)) {
      isShow.value = true
    } else {
      isShow.value = false
    }
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  current.value = props.mod.data[0]
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
:deep(.banner-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.banner-video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner4 {
  position: relative;
  &-content {
    // width: 100%;
    min-height: 240pxvw;
    top: 90pxvw;
    z-index: 1;
  }
}

:deep(.swiper-slide) {
  width: 1200px !important;
  height: 750px !important;
}
</style>
