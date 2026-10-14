<!--
 * @Author: yqq
 * @Date: 2023-01-03 15:40:52
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-08 17:33:10
 * @FilePath: \yadea-website\pages\index\mob\components\swiper-three\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-three模块 -->
  <div id="swiper-three" class="banner2" :class="isShow && 'fade-in'">
    <div class="banner2-title flex-col just-sb align-center">
      <div class="banner2-title-text fs-24-mvw fw-500 ellipsis-1">雅迪冠能系列</div>
      <!-- <div class="banner2-title-menu fs-13-mvw">
        <template v-for="(item, index) in GNs" :key="index">
          <span class="banner2-title-menu-item" :class="index === clickIndex && 'txt-red'" @click="handleClickGN(index)">
            {{ item.name }}
          </span>
        </template>
      </div> -->
    </div>

    <swiper
      class="banner2-swiper pos-rel"
      :modules="modules"
      :centered-slides="true"
      :navigation="{
        enabled: true,
        prevEl: '#pc-GN-prev',
        nextEl: '#pc-GN-next'
      }"
      :loop="true"
      @slide-change="onSwiper2Change"
    >
      <swiper-slide v-for="(item, index) of swiperList" :key="index">
        <MobileDisplay :pic="item.bgImage"></MobileDisplay>
      </swiper-slide>

      <div id="pc-GN-prev" class="common-swiper-mbtn pc-GN-prev">
        <SvgIcon name="second-left-arrow"></SvgIcon>
      </div>
      <div id="pc-GN-next" class="common-swiper-mbtn pc-GN-next">
        <SvgIcon name="second-right-arrow"></SvgIcon>
      </div>
    </swiper>

    <div
      class="banner2-content flex-col just-sb align-center my-animate-top swiper-three-animate"
      :class="isShow && 'my-animate-sildeDown'"
    >
      <div class="txt-black fs-18-mvw my-animate-top" :class="isShow && 'my-animate-sildeDown-item-1'">
        <!-- 雅迪 {{ curProduct?.name }} -->
        {{ curProduct?.name }}
      </div>
      <div class="txt-black fs-13-mvw my-animate-top opacity-8" :class="isShow && 'my-animate-sildeDown-item-2'">
        {{ curProduct?.desc1 }}
      </div>
      <div class="banner2-content-btns my-animate-top" :class="isShow && 'my-animate-sildeDown-item-3'">
        <MobileButton class-name="test-drive fs-18-vw mr-2" :href="curProduct.model_static">{{ mod?.button1 }}</MobileButton>
        <MobileButton class-name="learn-more fs-18-vw txt-black" type="primary" :route="mod?.buttonUrl2">{{ mod?.button2 }}</MobileButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useIsShow } from '~~/composables/useIsShow'
import _ from 'lodash'

const modules = [Pagination, Navigation]

const props = defineProps({
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

const curProduct = ref({})

// onMounted(() => {
//   curProduct.value = props.mod.data[0]
// })

// 轮播滑动
const onSwiper2Change = _.debounce(function (el) {
  const { realIndex } = el
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
  // curProduct.value = props.mod.data[realIndex]
  curProduct.value = swiperList.value[realIndex]
}, 50)

const { isShow } = useIsShow('.swiper-three-animate')

// 定义系列模块
const GNs = ref([])
const swiperList = ref([])
const clickIndex = ref([])

// 定义点击系列事件
// const handleClickGN = index => {
//   swiperList.value = GNs.value[index].list
//   clickIndex.value = index
//   curProduct.value = swiperList?.value[0]
// }

function init() {
  // onst item1 = props.mod.data[4]
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
  // ]c
  GNs.value = props.mod.data
  swiperList.value = props.mod.data
  // clickIndex.value = 0
  curProduct.value = swiperList.value[0]
}
init()

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less" scoped>
.my-animate-sildeDown {
  transform: translateY(2pxvw) !important;
}

.banner-img {
  width: 100%;
  // height: 223mpxvw;
  object-fit: cover;
  object-position: center;
}

.banner2-content {
  &-btns {
    margin-top: 20mpxvw;
  }
}

.banner2 {
  background: url(@/assets/images/mobile/home/banner-bg.png) no-repeat;
  background-size: 100% 100%;
  height: 520mpxvw;
  padding-bottom: 44mpxvw;
  overflow: hidden;

  .yadi-mbtn-small {
    font-size: 12mpxvw;
    width: 88mpxvw !important;
    height: 29mpxvw !important;
  }

  &-title {
    min-width: 100%;
    margin-top: 50mpxvw;
    margin-bottom: 60mpxvw;
    &-text {
      width: 100%;
      padding: 0 20px;
      text-align: center;
    }
    &-menu {
      width: 100%;
      overflow: auto;
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      justify-content: center;
      position: relative;
      margin-top: 10mpxvw;
      &-item {
        font-weight: bold;
        width: 100mpxvw;
        padding: 0 22mpxvw;
        position: relative;
        cursor: pointer;
        font-weight: 400;
        opacity: 0.8;
        &:hover {
          color: @orange;
          font-weight: 500;
        }
        &::after {
          content: '';
          width: 1px;
          height: 10px;
          background-color: #000;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
        }

        &:last-of-type {
          &::after {
            display: none;
          }
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &-content {
    min-width: 100%;
    // min-height: 165pxvw;
    margin-top: 20mpxvw;

    .learn-more,
    .test-drive {
      border-radius: 28mpxvw;
      width: 100mpxvw;
    }
  }
}

.txt-red {
  color: #ff5f00;
}

.common-swiper-mbtn.pc-GN-prev {
  width: 30mpxvw;
  height: 30mpxvw;
  background-image: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 30mpxvw;
    height: 30mpxvw;
  }
}

.common-swiper-mbtn.pc-GN-next {
  width: 30mpxvw;
  height: 30mpxvw;
  background-image: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 30mpxvw;
    height: 30mpxvw;
  }
}
</style>
