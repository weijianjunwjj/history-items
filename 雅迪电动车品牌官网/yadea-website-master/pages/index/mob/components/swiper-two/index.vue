<!--
 * @Author: yqq
 * @Date: 2023-01-03 17:34:50
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 11:13:58
 * @FilePath: \website\pages\index\mob\components\swiper-two\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-two模块 -->
  <div class="banner1 mt-2-mvw">
    <swiper
      class="pos-rel swiper-pagination-bot-24"
      :modules="modules"
      :pagination="{ clickable: true }"
      :centered-slides="true"
      :navigation="{ enabled: true, prevEl: '#banner-pc-prev', nextEl: '#banner-pc-next' }"
      :free-mode="true"
      :loop="true"
      @slide-change="onSwiper2Change"
    >
      <swiper-slide v-for="(item, index) of mod.data" :key="index">
        <MobileDisplay :url="item.bgMobileVideo" :pic="item.bgMobilePic"></MobileDisplay>
        <div
          class="banner1-content pos-middle-h flex-col just-sb align-center swiper-two-animate my-animate"
          :class="isShow && 'my-animate-sildeUp'"
        >
          <div class="txt-white fs-12-mvw ellipsis-1" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc1 }}</div>
          <div class="txt-white fs-24-mvw fw-500 ellipsis-2" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc2 }}</div>
          <div class="banner1-content-btns mt-2">
            <a class="fs-11-mvw txt-white" :style="{ color: item?.mobileDescColor }" :href="item?.buttonUrl1">
              {{ item?.button1 }}
              <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
              <!-- <img src="@/assets/images/home/arrow-right.png" alt="箭头" /> -->
            </a>
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
import { delay } from '@/configs/data'
import { useIsShow } from '@/composables/useIsShow'
import _ from 'lodash'

const modules = [Pagination, Navigation]

defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: []
      }
    }
  }
})
const onSwiper2Change = _.debounce(function () {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
}, 50)

const { isShow } = useIsShow('.swiper-two-animate')

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less" scoped>
:deep(.banner-video) {
  width: 100%;
  height: 445mpxvw;
  object-fit: cover;
}

:deep(.banner-img) {
  width: 100%;
  height: 445mpxvw;
  object-fit: cover;
  margin-bottom: -5mpxvw;
}

.banner1 {
  position: relative;
  height: 445mpxvw;

  &-content {
    position: absolute;
    top: 100mpxvw;
    width: 100%;
    // padding: 0 20mpxvw;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .txt-white {
      width: 100%;
      text-align: center;
    }
  }

  .banner1-content-btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    svg {
      width: 13mpxvw;
      height: 13mpxvw;
      margin-top: -3mpxvw;
    }
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
