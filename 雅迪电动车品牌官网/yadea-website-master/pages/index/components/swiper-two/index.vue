<!--
 * @Author: yqq
 * @Date: 2022-12-28 16:03:23
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 12:08:30
 * @FilePath: \yadea-website\pages\index\components\swiper-two\index.vue
 * @Description: 
 * 
-->

<template>
  <!-- swiper-two模块 -->
  <div v-if="mod?.data?.length" class="video-swiper ptb-2 plr-4">
    <client-only>
      <swiper
        class="pos-rel swiper-pagination-bot-60"
        :modules="modules"
        :pagination="{ clickable: true }"
        :centered-slides="true"
        :navigation="{ enabled: true, prevEl: '#bannerPcPrev', nextEl: '#bannerPcNext' }"
        :free-mode="true"
        :loop="true"
        @slide-change="onSwiperChange"
      >
        <template v-for="(item, index) in mod.data" :key="index">
          <swiper-slide>
            <div class="video-box">
              <MyDisplay :url="item?.bgImage" :is-play="index === activeIndex"></MyDisplay>
              <div class="video-text-box pos-center">
                <div class="video-introduce swiper-two-animate my-animate" :class="isShow && 'my-animate-sildeUp'">
                  <p class="fs-30-vw homepage-sub-title" style="font-weight: unset" :style="{ color: item?.descColor }">
                    {{ item?.swiperDesc1 }}
                  </p>
                  <p class="fs-60-vw homepage-title" :style="{ color: item?.descColor }">{{ item?.swiperDesc2 }}</p>
                  <a class="fs-16-vw" :href="item?.buttonUrl1" :style="{ color: item?.descColor }">
                    {{ item?.button1 }}
                    <SvgIcon name="arrow-right-white" :style="{ color: item?.descColor }"></SvgIcon>
                  </a>
                </div>
              </div>
            </div>
          </swiper-slide>
        </template>
        <div id="bannerPcPrev" class="common-swiper-btn prev">
          <div class="div-bgimg"></div>
        </div>
        <div id="bannerPcNext" class="common-swiper-btn next">
          <div class="div-bgimg"></div>
        </div>
      </swiper>
    </client-only>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { isInView } from '@/composables/common.ts'
import { delay } from '@/configs/data'
import _ from 'lodash'

const modules = [Navigation]

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

const onSwiperChange = _.debounce(function (el) {
  console.log('swiper-two-----el :>> ', el)
  const { realIndex } = el
  activeIndex.value = realIndex
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
  current.value = props.mod.data[realIndex]
}, 50)

function handleScroll() {
  const dom = document.querySelector('.swiper-two-animate')

  if (isInView(dom)) {
    isShow.value = true
  } else {
    isShow.value = false
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  current.value = props.mod.data[0]

  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
:deep(.banner-img) {
  width: 100%;
  height: 800pxvw;
  object-fit: cover;
}

:deep(.banner-video) {
  width: 100%;
  height: 800pxvw;
  object-fit: cover;
}
.video-swiper {
  .video-box {
    position: relative;
    overflow: hidden;

    .video-player {
      width: 100%;
      height: 100%;
    }

    .video-text-box {
      width: 100%;
      top: 50%;
      transform: translate(-50%, -54%);

      .video-introduce {
        display: flex;
        flex-direction: column;
        justify-content: center;

        p {
          color: #ffffff;
          line-height: 70pxvw;
          margin: 0 0 6pxvw;
          text-align: center;
        }

        a {
          text-decoration: none;
          margin-top: 24pxvw;
          color: #ffffff;
          text-align: center;

          svg {
            width: 18pxvw;
            height: 18pxvw;
            vertical-align: middle;
          }
        }
      }
    }
  }
}

.swiper-slide {
  width: 100%;
  height: 800pxvw;
}
</style>
