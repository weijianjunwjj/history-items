<!--
 * @Author: yqq
 * @Date: 2022-12-28 16:40:34
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 10:26:01
 * @FilePath: \website\pages\index\components\swiper-wrapper\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-wrapper模块 -->
  <div class="banner1">
    <swiper
      class="pos-rel swiper-pagination-bot-60"
      :modules="modules"
      :pagination="{ clickable: true }"
      :centered-slides="true"
      :navigation="{ enabled: true, prevEl: '#banner-pc-prev', nextEl: '#banner-pc-next' }"
      :free-mode="true"
      :loop="true"
      :autoplay="{
        delay,
        disableOnInteraction: false
      }"
      @slide-change="onSwiperChange"
    >
      <!--  @click="handleClickGoDetail(item)" -->
      <swiper-slide v-for="(item, index) of mod.data" :key="index">
        <MyDisplay :url="item?.bgImage" :href="item?.mediaUrl" :is-play="index === activeIndex"></MyDisplay>
        <div class="banner1-content pos-middle-h flex-col just-sb align-center">
          <div class="banner1-content-mod flex-col just-sb align-center my-animate" :class="isShowAnimate && 'my-animate-sildeUp'">
            <div class="txt-white fs-14-vw opt65" :style="{ color: item?.descColor }">{{ item.swiperDesc2 }}</div>
            <div class="txt-white homepage-title" :style="{ color: item?.descColor }">{{ item.swiperDesc1 }}</div>
            <div class="txt-white homepage-sub-title" :style="{ color: item?.descColor }">{{ item.swiperDesc3 }}</div>

            <div class="banner1-content-btns my-animate-btns" :class="isShowAnimate && 'my-animate-fadeIn'">
              <MyButton class-name="test-drive fs-18-vw mr-5" size="big" type="ghost" :href="item?.buttonUrl1">{{ item.button1 }}</MyButton>
              <MyButton class-name="learn-more fs-18-vw txt-black" size="big" :href="item?.buttonUrl2">{{ item.button2 }}</MyButton>
            </div>
          </div>
        </div>
      </swiper-slide>

      <div id="banner-pc-prev" class="common-swiper-btn prev">
        <div class="div-bgimg"></div>
      </div>
      <div id="banner-pc-next" class="common-swiper-btn next">
        <div class="div-bgimg"></div>
      </div>
    </swiper>

    <div class="banner1-right-options flex-col">
      <div class="banner1-right-options-item banner1-right-options-bike mb-4 cur-point flex-hvc" @click="toBookingRide(curBanner.bgImage)">
        <span>预约试驾</span>
      </div>
      <div class="online-kf-id banner1-right-options-item banner1-right-options-kefu mb-4 cur-point flex-hvc">
        <span>在线客服</span>
      </div>
      <div class="banner1-right-options-item banner1-right-options-contrast cur-point flex-hvc" @click="jumpTo('/model-contrast')">
        <span>车型对比</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { delay } from '@/configs/data'
import _ from 'lodash'

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

const modules = [Navigation]
const activeIndex = ref(0)
const curBanner = $ref()

const isShowAnimate = ref(false)

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el

  curBanner = props.mod.data[realIndex]
  activeIndex.value = realIndex
  isShowAnimate.value = false
  setTimeout(() => {
    isShowAnimate.value = true
  }, 100)
}, 50)

// 前往详情页
// const handleClickGoDetail = item => {
//   if (item.mediaUrl) window.location.href = item.mediaUrl
// }

// 前往在线客服
const goOnlineService = () => {
  window.location.href = 'https://yadea.udesk.cn/im_client/?web_plugin_id=94631'
}

onMounted(async () => {
  isShowAnimate.value = true
})
</script>

<style lang="less" scoped>
.banner1 {
  position: relative;
  // margin-top: @layout-header-height;

  &-content {
    position: absolute;
    top: 9.083333vw;
    width: 100%;
    min-height: 256pxvw;
    z-index: 1;
    .homepage-sub-title {
      font-weight: 400;
    }
    &-btns {
      margin-top: 42pxvw;
    }
  }
  .learn-more,
  .test-drive {
    border-radius: 28pxvw;
  }
  &-right-options {
    position: fixed;
    width: 72pxvw;
    right: 56pxvw;
    bottom: 56pxvw;
    z-index: 9;

    &-item {
      position: relative;
      height: 72pxvw;
      color: @orange;
      background-color: #fff;
      background-size: contain;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.09);
      border-radius: 50%;
      & > span {
        opacity: 0;
        font-size: 16pxvw;
      }

      &:hover {
        background-image: url('');
        span {
          transition: all 0.8s;
          opacity: 1;
        }
      }
    }

    &-bike {
      background-image: url(@/assets/svg/bike.svg);
    }
    &-kefu {
      background-image: url(@/assets/svg/message.svg);
    }
    &-contrast {
      background-image: url(@/assets/svg/contrast.svg);
    }
  }
}

:deep(.banner-video) {
  height: 100vh !important;
}
:deep(.banner-img) {
  height: 100vh !important;
}
</style>
