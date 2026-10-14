<!--
 * @Author: yqq
 * @Date: 2023-01-03 13:37:50
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 10:41:26
 * @FilePath: \website\pages\index\mob\components\swiper-wrapper\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-wrapper模块 -->
  <div class="banner1">
    <swiper
      class="pos-rel swiper-pagination-bot-24"
      :modules="modules"
      :pagination="{ clickable: true }"
      :centered-slides="true"
      :navigation="{ enabled: true, prevEl: '#banner-pc-prev', nextEl: '#banner-pc-next' }"
      :free-mode="true"
      :loop="true"
      @slide-change="onSwiperChange"
    >
      <!--  @click="handleClickGoDetail(item)" -->
      <swiper-slide v-for="(item, index) of mod.data" :key="index">
        <MobileDisplay :url="item.bgMobileVideo" :pic="item.bgMobilePic" :href="item?.mediaUrl"></MobileDisplay>
        <div class="banner1-content pos-middle-h flex-col just-sb align-center">
          <div class="banner1-content-mod flex-col just-sb align-center my-animate" :class="isShow && 'my-animate-sildeUp'">
            <div class="txt-white fs-11-mvw ellipsis-1 opt85" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc2 }}</div>
            <div class="txt-white fs-24-mvw fw-500 ellipsis-1" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc1 }}</div>
            <div class="txt-white fs-12-mvw ellipsis-1" :style="{ color: item?.mobileDescColor }">{{ item.swiperDesc3 }}</div>
            <div class="banner1-content-btns mt-4 my-animate-btns" :class="isShow && 'my-animate-fadeIn'">
              <MobileButton class-name="test-drive fs-18-vw mr-2" type="ghost" :href="item?.buttonUrl1">
                {{ item.button1 }}
              </MobileButton>
              <MobileButton class-name="learn-more fs-18-vw txt-black" :route="item?.buttonUrl2">{{ item.button2 }} </MobileButton>
            </div>
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

    <div class="banner1-right-options flex-col">
      <div class="banner1-right-options-item banner1-right-options-bike mb-4 cur-point flex-hvc" @click="jumpTo('/booking-ride')">
        <span>预约<br />试驾</span>
      </div>
      <div class="online-kf-id banner1-right-options-item banner1-right-options-kefu mb-4 cur-point flex-hvc">
        <span>在线<br />客服</span>
      </div>
      <div class="banner1-right-options-item banner1-right-options-contrast cur-point flex-hvc" @click="jumpTo('/model-contrast')">
        <span>车型<br />对比</span>
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
  },
  mobDriveUrl: {
    type: String,
    default: ''
  }
})

const isShow = ref(false)

// 前往详情页
const handleClickGoDetail = item => {
  if (item.mediaUrl) window.location.href = item.mediaUrl
}

const onSwiperChange = _.debounce(function () {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 100)
}, 50)

function jumpTo(url) {
  if (url) {
    useRouter().push(url)
  }
}

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
  height: 700mpxvw !important;
  object-fit: cover;
  object-position: center center;
}

:deep(.banner-video) {
  width: 100%;
  height: 700mpxvw !important;
  object-fit: cover;
}

.banner1 {
  position: relative;
  height: 700mpxvw;
  // margin-top: @layout-header-height;

  .yadi-mbtn-small {
    font-size: 12mpxvw;
    width: 88mpxvw;
    height: 29mpxvw;
  }

  &-content {
    position: absolute;
    top: 140mpxvw;
    width: 100%;
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
    justify-content: center;
  }

  &-right-options {
    position: fixed;
    .m-w(40);
    right: 20mpxvw;
    bottom: 50.066667vw;
    z-index: 9;

    &-item {
      position: relative;
      .m-h(40);
      color: @orange;
      background-color: #fff;
      background-size: contain;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.09);
      border-radius: 50%;

      & > span {
        opacity: 0;
        font-size: 12px;
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
      background-image: url(@/assets/images/mobile/home/bike.png);
    }

    &-kefu {
      background-image: url(@/assets/images/mobile/home/message.png);
    }

    &-contrast {
      background-image: url(@/assets/images/mobile/home/contrast.png);
    }
  }
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
