<!--
 * @Author: weijianjun
 * @Date: 2022-12-15 16:18:09
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 09:32:31
 * @FilePath: \website\components\my\header\index.vue
 * @Description: 全局顶部
 * 
-->

<template>
  <header class="page-header" :class="[(isShowWhiteHeader || isMove) && 'page-header-move', !isShowHeader && 'hide-header']">
    <div class="page-header-menu flex-vc-aside">
      <div class="flex-vc">
        <div class="logo header-logo">
          <NuxtLink to="/" class="flex-hvc">
            <img :src="replaceImgUrl(imgLogo)" class="full" alt="logo" />
          </NuxtLink>
        </div>
        <div class="menu flex fs-18-vw fs-max-16">
          <div
            v-for="(item, index) of menus"
            :key="index"
            class="menu-item fw-500 cur-point fade-in"
            :class="[activeIndex === index && 'menu-item-hover', `header-menu-item-${index}`]"
            @mouseenter="mouseOverMenu(item, index)"
            @mouseleave="mouseOutMenu(item, index)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="options flex-vc">
        <div class="oversea mr-8">
          <template v-if="!isShowWhiteHeader">
            <a v-show="isShowWhiteHeader || isMove" href="https://www.yadea.com" target="_blank" class="flex-hvc">
              <SvgIcon name="vector" class="svg-vector"></SvgIcon>
            </a>
            <a v-show="!(isShowWhiteHeader || isMove)" href="https://www.yadea.com" target="_blank" class="flex-hvc">
              <SvgIcon name="vector-white" class="svg-vector"></SvgIcon>
            </a>
          </template>
          <template v-else>
            <a href="https://www.yadea.com" target="_blank" class="flex-hvc">
              <SvgIcon name="vector" class="svg-vector"></SvgIcon>
            </a>
          </template>

          <!-- <a v-show="isMove" href="https://www.yadea.com" target="_blank" class="dis-ib">
                      <SvgIcon name="vector" class="svg-vector" ></SvgIcon>
                    </a>
                    <a v-show="!isMove" href="https://www.yadea.com" target="_blank" class="dis-ib">
                      <SvgIcon name="vector-white" class="svg-vector"></SvgIcon>
                    </a> -->
        </div>
        <div @mouseenter="handleEnterShopMall" @mouseleave="handleOutShopMall">
          <MyButton class-name="shop-mall fs-16 border-box" type="primary">
            <div class="flex-hvc">
              <SvgIcon name="shopmall" size="12" class="svg-shopmall"></SvgIcon>
              <span class="shop-mall-txt">商城</span>
            </div>
            <Transition>
              <div v-show="showMall" class="show-mall-box">
                <div class="mall-link fs-12-vw">
                  <a href="/car-detail/shop/index.html">官方商城</a>
                </div>
                <div class="mall-link fs-12-vw">
                  <a
                    href="https://mall.jd.com/index-1000160101.html?cu=true&utm_source=www.catv1.com&utm_medium=tuiguang&utm_campaign=t_84122001_&utm_term=67361533163240aaa105d6e24ce6de39"
                  >
                    京东
                  </a>
                </div>
                <div class="mall-link fs-12-vw">
                  <a
                    href="https://yadea.tmall.com/shop/view_shop.htm?user_number_id=2817130358&ali_trackid=2%3Amm_26534443_1954650123_110945750366%3A1678263078_018_567139338&union_lens=recoveryid%3A1678263078_018_567139338&bxsign=tbkNopySEA0Bm-GzQwyUK3vnl_o3y1lMpTxrJw9XAlTZGymXJdvXmoNnQyD-E8kNS1y_RTD_c1DM8bnwFIUMKzfIplOCistvAiebW-vPE0yDTNaJC5XSqmTojZrdivhVMct4_cSg9kctbKDTdoJJCy8Ow"
                  >
                    天猫
                  </a>
                </div>
              </div>
            </Transition>
          </MyButton>
        </div>
      </div>
    </div>
    <!-- 浮窗 -->
    <div class="page-header-mask" :class="isShowMask ? 'page-header-mask-active' : ''">
      <div
        class="page-header-mask-content"
        :class="isShowMask ? 'page-header-mask-content-active' : ''"
        @mouseenter="mouseOverMask"
        @mouseleave="mouseOutMask"
      >
        <div ref="maskRefs" class="pos-rel">
          <CyclingProducts v-show="activeIndex === 0" :index="0" :update-height="updateHeight" :hide-mask="hideMask" />
          <CyclingLife v-show="activeIndex === 1" :index="1" :update-height="updateHeight" :hide-mask="hideMask" />
          <CyclingTechnology v-show="activeIndex === 2" :index="2" :update-height="updateHeight" :hide-mask="hideMask" />
          <BuySupport v-show="activeIndex === 3" :index="3" :update-height="updateHeight" :hide-mask="hideMask" />
          <ServiceSupport v-show="activeIndex === 4" :index="4" :update-height="updateHeight" :hide-mask="hideMask" />
          <AboutYadea v-show="activeIndex === 5" :index="5" :update-height="updateHeight" :hide-mask="hideMask" />

          <span v-if="activeIndex === 0 || activeIndex === 1" class="icon-hide-mask cur-point" @click="hideMask">
            <SvgIcon name="cha" class="svg-cha" />
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import AboutYadea from './components/about-yadea.vue'
import ServiceSupport from './components/service-support.vue'
import CyclingProducts from './components/cycling-products.vue'
import BuySupport from './components/buy-support.vue'
import CyclingTechnology from './components/cycling-technology.vue'
import CyclingLife from './components/cycling-life.vue'
import _ from 'lodash'
import { getHeaderMenusFormat } from '@/utils'

const imgLogo = ref('')
const maskHeight = ref('')
const maskRefs = ref(null)
const activeIndex = ref(0)
const isMove = ref(false)
const isShowMask = ref(false)
const isHomePage = ref(true)

const showMall = $ref(false)

const handleEnterShopMall = () => {
  showMall = true
}

const handleOutShopMall = () => {
  showMall = false
}

const { useAppStore } = store
const appStore = useAppStore()
const isShowHeader = computed(() => {
  return appStore.isShowHeader
})
const isShowWhiteHeader = computed(() => {
  return appStore.isShowWhiteHeader
})
const transparentHeaderRoutes = computed(() => {
  return appStore.transparentHeaderRoutes
})

const router = useRouter()

onMounted(() => {
  watch(
    () => router.currentRoute.value.path,

    newPath => {
      if (transparentHeaderRoutes.value.includes(newPath)) {
        appStore.saveData({ isShowWhiteHeader: false })
      } else {
        appStore.saveData({ isShowWhiteHeader: true })
      }
    },

    { immediate: true, deep: true }
  )
})

const { menuApi, headerApi } = useApi()

const menus = ref([])

try {
  let { data: sourceMenus } = await menuApi.getHeaderMenus()
  sourceMenus = getHeaderMenusFormat(sourceMenus.value)
  menus.value = sourceMenus
  store.useAppStore().saveData({ sourceMenus, menus: sourceMenus })
} catch (error) {
  onErr()
  console.error(error)
}

const updateHeight = async () => {
  await nextTick()
  if (maskRefs.value) {
    const plus = activeIndex.value > 1 ? 0 : getVW(66)
    maskHeight.value = maskRefs.value.clientHeight + plus + 'px'
  }
}
const clearHeight = () => {
  maskHeight.value = '0px'
}
const hideMask = async function () {
  isShowMask.value = false
  isMove.value = scrollTo.value !== 0
  clearHeight()
  setBodyOverflow('overlay')
}
const mouseOverMenu = function (item, index) {
  isShowMask.value = true
  activeIndex.value = index
  isMove.value = true
  updateHeight()
  setBodyOverflow('hidden')
}
const mouseOutMenu = function (item, index) {
  hideMask()
}

const mouseOverMask = function () {
  isShowMask.value = true
  isMove.value = true
  updateHeight()
  setBodyOverflow('hidden')
}

const mouseOutMask = function () {
  // console.log('4-OutMask')
  hideMask()
}

// activeIndex.value = null

async function init() {
  const { data: headersData } = await headerApi.getHeader()
  const _headersData = headersData.value
  if (_headersData) {
    const img = getVal(_headersData, 'logo', 'url')
    imgLogo.value = img
  }
}

function getVal(data, mod, key) {
  return data.data[0].attributes[mod].data[0].attributes[key]
}

// js获取滚动条距离浏览器顶部,底部的高度,兼容ie和firefox
function getScrollTop() {
  var scrollTop = 0
  if (process.client) {
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
  }

  return scrollTop
}
var scrollTo = ref(0)
const handleScroll = _.throttle(() => {
  const top = getScrollTop()
  scrollTo.value = top
  if (top === 0) {
    isMove.value = false
  } else {
    isMove.value = true
  }
}, 10)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

init()
</script>

<style lang="less">
.page-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: @layout-header-height;
  margin: 0 auto;
  background-color: transparent;
  color: @white;
  z-index: 999;
  border-radius: 0px;
  box-sizing: border-box;
  z-index: 99;
  transition: all 0.5s;

  .shop-mall {
    width: 100pxvw !important;
    height: 40pxvw !important;
    .flex-hvc {
      height: 100%;
    }

    &-txt {
      margin-left: 10pxvw;
    }

    .show-mall-box {
      margin-top: 10pxvw;
      width: 100pxvw;
      height: 113pxvw;
      background: #fff;
      border-radius: 6pxvw 6pxvw 6pxvw 6pxvw;
      padding: 0 6pxvw;
      box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.14);
      .mall-link {
        height: 33%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e9e9e9;
        color: #000;
        a {
          text-decoration: none;
        }
      }
    }
  }

  &-move {
    background-color: @white !important;
    color: @black !important;
  }

  &-menu {
    position: relative;
    width: @layout-header-width;
    height: @layout-header-height;
    margin: 0 auto;

    .logo {
      margin-right: 90pxvw;
      width: 30.725823pxvw;
      height: 29.27pxvw;
    }

    .menu {
      &-item {
        padding: 20pxvw 30pxvw;
        position: relative;
        &:hover {
          span {
            position: relative;
            &::before {
              content: '';
              width: 100%;
              height: 2px;
              background: @orange;
              position: absolute;
              bottom: -20pxvw;
              z-index: 999;
            }
          }
        }
      }
    }

    .oversea {
      width: 24pxvw;
      height: 24pxvw;
    }
  }

  &-mask {
    position: relative;
    top: -3px;
    z-index: 100;
    transition: all 0.3s ease;
    pointer-events: none;
    width: 100%;
    height: 100vh;
    color: black;
    opacity: 0;
    overflow: overlay;

    &-active {
      opacity: 1;
      pointer-events: auto;
    }

    &-content {
      width: 100%;
      height: 0px;
      background-color: #fff;
      // padding: 0 calc((100% - 1434pxvw) / 2);
      margin: auto;
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      opacity: 1;
      overflow: hidden;
      transition: all 0.4s ease !important;
      scrollbar-width: none;
      box-shadow: 0 16px 16px rgb(0 0 0 / 10%);

      &-active {
        height: v-bind(maskHeight);
        opacity: 1;
      }

      .icon-hide-mask {
        position: absolute;
        width: 32pxvw;
        top: 20px;
        right: 240pxvw;
      }
    }
  }

  .hide-header {
    top: -@layout-header-height;
    transition: all 0.5s;
  }

  .svg-shopmall {
    width: 14pxvw;
    height: 14pxvw;
  }

  .svg-vector {
    width: 24pxvw;
    height: 24pxvw;
  }

  .svg-cha {
    width: 22pxvw;
    height: 22pxvw;
  }

  .swiper-pagination-horizontal {
    bottom: 30px !important;
  }

  .yadi-btn {
    font-size: 16pxvw;
    letter-spacing: 2px !important;

    &:hover {
      background: #ff7e29;
      color: #fff !important;
    }
  }
}
</style>
