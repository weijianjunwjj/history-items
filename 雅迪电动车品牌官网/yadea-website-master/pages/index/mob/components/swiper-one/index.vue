<!--
 * @Author: yqq
 * @Date: 2023-01-03 15:11:21
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-08 16:28:23
 * @FilePath: \website\pages\index\mob\components\swiper-one\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-one模块 -->
  <div class="banner1 swiper-one-mobile">
    <swiper
      class="pos-rel swiper-pagination-bot-24 mt-2"
      :modules="modules"
      :pagination="{ clickable: true }"
      :centered-slides="true"
      :navigation="{ enabled: true, prevEl: '#banner-pc-prev', nextEl: '#banner-pc-next' }"
      :free-mode="true"
      :loop="true"
      @slide-change="onSwiper2Change"
    >
      <swiper-slide v-for="item of mod.data" :key="item.id">
        <MobileDisplay :url="item.bgMobileVideo" :pic="item.bgMobilePic"></MobileDisplay>
        <div
          class="banner1-content pos-middle-h flex-col just-sb align-center swiper-one-animate my-animate"
          :class="isShow && 'my-animate-sildeUp'"
        >
          <div class="txt-white fs-11-mvw ellipsis-1 opt85" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc2 }}</div>
          <div class="txt-white fs-24-mvw fw-500 ellipsis-1" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc1 }}</div>
          <div class="txt-white fs-14-mvw ellipsis-1" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc3 }}</div>
          <div class="banner1-content-btns mt-5">
            <MobileButton
              v-if="item.button1"
              :style="`border: 1px solid ${item?.mobileDescColor}; color: ${item?.mobileDescColor}`"
              class-name="test-drive fs-18-vw mr-2"
              type="ghost"
              :href="item?.buttonUrl1"
            >
              {{ item.button1 }}
            </MobileButton>
            <MobileButton
              v-if="item.button2"
              :style="`border: 1px solid ${item?.mobileDescColor}; color: ${item?.mobileDescColor}`"
              class-name="learn-more fs-18-vw txt-black"
              :route="item?.buttonUrl2"
              >{{ item.button2 }}</MobileButton
            >
          </div>
        </div>
      </swiper-slide>

      <!-- <div id="banner-pc-prev" class="common-swiper-mbtn prev">
        <SvgIcon name="arrow-left"></SvgIcon>
      </div>
      <div id="banner-pc-next" class="common-swiper-mbtn next">
        <SvgIcon name="arrow-right"></SvgIcon>
      </div> -->
    </swiper>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useIsShow } from '@/composables/useIsShow'
import _ from 'lodash'

const modules = ref([Pagination, Navigation])

const { isShow } = useIsShow('.swiper-one-animate')

defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: []
      }
    }
  },
  mobDriveUrl: {
    type: String,
    default: ''
  }
})

const onSwiper2Change = _.debounce(function () {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
}, 50)

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less" scoped>
:deep(.banner-img) {
  width: 100%;
  height: 445mpxvw;
  object-fit: cover;
  object-position: center center;
}

:deep(.banner-video) {
  width: 100%;
  height: 445mpxvw;
}

.banner1 {
  position: relative;
  height: 445mpxvw;

  .yadi-mbtn-small {
    font-size: 12mpxvw;
    width: 88mpxvw;
    height: 29mpxvw;
  }

  &-content {
    position: absolute;
    top: 100mpxvw !important;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .txt-white {
      width: 100%;
      text-align: center;
      padding: 0 20px;
    }
  }

  .banner1-content-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

.my-animate-sildeUp {
  top: 50mpxvw !important;
}

.common-swiper-mbtn.prev {
  background-image: none;
  padding: 20mpxvw;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16mpxvw;
    height: 16mpxvw;
  }
}

.common-swiper-mbtn.next {
  background-image: none;
  padding: 20mpxvw;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16mpxvw;
    height: 16mpxvw;
  }
}
</style>
