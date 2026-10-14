<!--
 * @Author: yqq
 * @Date: 2022-12-28 16:50:19
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 12:52:24
 * @FilePath: \yadea-website\pages\index\components\swiper-three\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-three模块 -->
  <div id="swiper-three" class="banner2 mb-2 my-banner2">
    <div class="banner2-title flex-col just-sb align-center">
      <div class="banner2-title-text fs-42-vw homepage-title">雅迪冠能系列</div>
      <!-- <div class="banner2-title-menu fs-20-vw fs-max-20">
        <template v-for="(item, index) of GNs" :key="index">
          <div
            class="banner2-title-menu-item"
            :class="activeIndex === index && 'banner2-title-menu-item-hover'"
            @mouseenter="onMouseEnterMenu(item, index)"
          >
            {{ item.name }}
          </div>
          <template v-if="index !== GNs.length - 1"> |</template>
        </template>
      </div> -->
    </div>

    <client-only>
      <swiper
        v-if="isShowSwiper"
        class="banner2-swiper pos-rel"
        :modules="modules"
        :centered-slides="true"
        :navigation="{
          enabled: true,
          prevEl: '#pc-GN-prev',
          nextEl: '#pc-GN-next'
        }"
        slides-per-view="auto"
        :space-between="20"
        :loop="true"
        :speed="900"
        @slide-change="onSwiperChange"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="(item, index) of GNs" :key="index" :data-index="index" @click="onSwiperClick(index)">
          <MyDisplay :url="item?.bgImage"></MyDisplay>
        </swiper-slide>
      </swiper>
    </client-only>
    <div class="banner2-content flex-col just-sb align-center">
      <section class="banner2-content-mod my-animate-top swiper-three-animate" :class="isShowAnimate && 'my-animate-sildeDown'">
        <div class="txt-black fs-26-vw my-animate-top" :class="isShowAnimate && 'my-animate-sildeDown-item-1'">
          {{ curProduct?.name }}
        </div>
        <div class="txt-black fs-20-vw my-animate-top mt-2-vw" :class="isShowAnimate && 'my-animate-sildeDown-item-2'">
          {{ curProduct?.desc1 }}
        </div>
        <div class="banner2-content-btns my-animate-top" :class="isShowAnimate && 'my-animate-sildeDown-item-3'">
          <MyButton class-name="test-drive fs-18-vw mr-5" :href="curProduct.model_static">{{ mod?.button1 }}</MyButton>
          <MyButton class-name="learn-more fs-18-vw txt-black" type="primary" :href="mod?.buttonUrl2">{{ mod?.button2 }}</MyButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
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

const curProduct = ref({})
const isShowAnimate = ref(false)
const isShowSwiper = ref(true)
const GNs = ref([
  {
    list: []
  }
])
// const activeIndex = ref(0)
const myRealIndex = ref(0)

let curSwiper = null
//初始化会传实例swiper，存起来，用这个实例修改swiper-slide

//curSwiper.slidePrev();  //上一张
//curSwiper.slideNext();  //下一张

// const onMouseEnterMenu = function (item, index) {
//   activeIndex.value = index
//   curProduct.value = GNs.value[index].list[myRealIndex.value]
// }

// 修正Swiper位置
function refreshSwiper() {
  isShowSwiper.value = false
  nextTick(() => {
    isShowSwiper.value = true
  })
}

const onSwiper = swiper => {
  curSwiper = swiper
}

const onSwiperClick = e => {
  curSwiper.slideToClickedSlide()
}

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el
  myRealIndex.value = realIndex
  isShowAnimate.value = false
  setTimeout(() => {
    isShowAnimate.value = true
  }, 100)
  curProduct.value = GNs.value[myRealIndex.value]
}, 50)

function handleScroll() {
  const dom = document.querySelector('.swiper-three-animate')

  if (isInView(dom)) {
    isShowAnimate.value = true
  } else {
    isShowAnimate.value = false
  }
}

function init() {
  // const item1 = props.mod.data[4]
  // const item2 = props.mod.data[3]
  // const item3 = props.mod.data[2]
  // const item4 = props.mod.data[1]
  // const item5 = props.mod.data[0]

  // const data = [
  //   {
  //     name: '极致系列',
  //     list: [item1, item2, item5]
  //   },
  //   {
  //     name: '创享系列',
  //     list: [item3, item4, item1]
  //   },
  //   {
  //     name: '畅享系列',
  //     list: [item5, item2, item3]
  //   }
  // ]
  GNs.value = props.mod.data
}
init()

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', refreshSwiper)
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
  setTimeout(() => {
    refreshSwiper()
  }, 200)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', refreshSwiper)
})
</script>

<style lang="less" scoped>
.banner-img {
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.banner2 {
  position: relative;
  height: 840pxvw;
  background-color: #fff;
  &-title {
    min-width: 663pxvw;
    margin-top: 80pxvw;
    &-text {
      // margin-bottom: 24pxvw;
    }
    &-menu {
      display: flex;
      &-item {
        opacity: 0.8;
        margin: 0 39pxvw;
        cursor: pointer;
        &-hover {
          font-weight: 500;
          color: @orange;
        }
      }
    }
  }

  &-content {
    position: absolute;
    background: url(@/assets/images/home/banner2-bg2.png) no-repeat;
    height: 20.552083vw;
    min-width: 326pxvw;
    background-size: 100% 151%;
    background-position-y: -29px;
    bottom: 0;
    width: 100%;

    &-btns {
      margin-top: 30pxvw;
    }

    &-mod {
      position: absolute;
      top: 230pxvw;
      text-align: center;
    }

    .learn-more,
    .test-drive {
      border-radius: 28pxvw;
    }

    .test-drive {
      border: 1px solid #000 !important;
      background: transparent !important;
    }
  }
}

.banner2-swiper {
  margin-bottom: -6.7522vw;
  padding-top: 80pxvw;
}

:deep(.swiper-slide) {
  width: 670pxvw;
  height: 420pxvw;
  // transition: 300ms;
  transform: scale(0.716);
  margin-top: -20pxvw;
  transform-origin: center bottom;
  // margin-top: 10.385417vw !important;
}

:deep(.swiper-slide-active, .swiper-slide-duplicate-active) {
  transform: scale(1);
  margin-top: 0;
}
</style>
