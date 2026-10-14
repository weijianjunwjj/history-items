<template>
  <div class="banner-5-mob">
    <div class="title HYQiHei-bold">稳定输出<br />潜能超乎想象</div>
    <div class="subTitle HYQiHei">TTFAR智能温感充电器</div>
    <div class="border-container">
      <div class="border-bg">
        <div class="border-bg-border"></div>
      </div>

      <div class="describe HYQiHei">流畅而犀利的几何轮廓，搭配棱角分明的锐利前脸<br />雕塑车身独一无二的机能美感，每一面皆锋芒尽现</div>
    </div>
    <!-- 车辆颜色选择 -->
    <div class="car-container">
      <!-- 背景箭头图片 -->
      <div class="back-line">
        <img ref="leftArrowImgRef" class="back-img-side back-img-side-left" :src="replaceImgUrl(url0)" alt="" />
        <img class="back-img-center" :src="replaceImgUrl(url1)" alt="" />
        <img ref="rightArrowImgRef" class="back-img-side back-img-side-right" :src="replaceImgUrl(url2)" alt="" />
      </div>

      <!-- 车辆轮播图片 -->
      <swiper
        class="car-swiper"
        :modules="modules"
        :space-between="50"
        :loop="true"
        :speed="1000"
        @slide-change="onSwiperChange"
        @swiper="onSwiper"
      >
        <swiper-slide v-for="(item, index) in carImageUrlList" :key="index">
          <img class="car-img" :src="replaceImgUrl(item)" alt="" />
        </swiper-slide>
      </swiper>

      <!-- 颜色切换按钮 -->
      <div class="color-select-container">
        <div
          v-for="(item, index) in colorSelectList"
          :key="index"
          :class="[defaultClass, selectedClass(index)]"
          :style="{ background: item }"
          @click="colorSelectClick(index)"
        ></div>
        <div class="prompt">滑动查看颜色</div>
      </div>
    </div>

    <!--  -->
    <div class="swiper-box">
      <!-- <client-only> -->
      <swiper
        :modules="modules"
        :space-between="50"
        :loop="false"
        :navigation="false"
        @slide-change="onSwiperChangeOne"
        @swiper="onSwiperOne"
      >
        <swiper-slide v-for="item in paramsList" :key="item">
          <img :src="replaceImgUrl(item.carImg)" alt="" />
          <div class="slider-bottom-desc">
            <div class="desc-title">{{ item.title }}</div>
            <div class="desc-subTitle">{{ item.subTitle }}</div>
          </div>
        </swiper-slide>
      </swiper>
      <!-- </client-only> -->
      <div class="custom-pagination custom-pagination-margin-top-16">
        <template v-for="(item, index) in paramsList" :key="index">
          <div class="custom-pagination-span" :style="{ backgroundColor: swiperActiveIndex1 === index ? '#fff' : 'gray' }"></div>
        </template>
      </div>
    </div>
    <div class="swiper-box">
      <!-- <client-only> -->
      <swiper
        :modules="modules"
        :space-between="50"
        :loop="false"
        :navigation="false"
        @slide-change="onSwiperChangeTwo"
        @swiper="onSwiperTwo"
      >
        <swiper-slide v-for="item in param2List" :key="item">
          <img class="car-img-two" :src="replaceImgUrl(item.carImg)" alt="" />
          <p class="param-title">{{ item.title }}</p>
          <p class="param-subTitle">{{ item.subTitle }}</p>
        </swiper-slide>
      </swiper>
      <!-- </client-only> -->
      <div class="custom-pagination">
        <template v-for="(item, index) in param2List" :key="index">
          <div class="custom-pagination-span" :style="{ backgroundColor: swiperActiveIndex2 === index ? '#fff' : 'gray' }"></div>
        </template>
      </div>
    </div>

    <div class="bottom-slider-title">车型酷图</div>
    <div class="swiper-box swiper-box-padding-top0">
      <!-- <client-only> -->
      <swiper
        :modules="modules"
        :space-between="50"
        :loop="false"
        :navigation="false"
        @slide-change="onSwiperChangeThree"
        @swiper="onSwiperThree"
      >
        <swiper-slide v-for="item in param3List" :key="item">
          <img class="car-img-three" :src="replaceImgUrl(item.carImg)" alt="" />
          <p class="param-title">{{ item.title }}</p>
          <p class="param-subTitle">{{ item.subTitle }}</p>
        </swiper-slide>
      </swiper>
      <!-- </client-only> -->
      <div class="custom-pagination">
        <template v-for="(item, index) in param3List" :key="index">
          <div class="custom-pagination-span" :style="{ backgroundColor: swiperActiveIndex3 === index ? '#fff' : 'gray' }"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/less/navigation'
import _ from 'lodash'
let curSwiper = null

const modules = [FreeMode, Navigation]
let curSwiper1 = null
let curSwiper2 = null
let curSwiper3 = null
const swiperActiveIndex1 = $ref(0)
const swiperActiveIndex2 = $ref(0)
const swiperActiveIndex3 = $ref(0)

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el
  currentSelectedColorIndex.value = realIndex
}, 50)

const onSwiperChangeOne = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex1 = realIndex
}, 50)

const onSwiperChangeTwo = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex2 = realIndex
}, 50)

const onSwiperChangeThree = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex3 = realIndex
}, 50)

const onSwiperOne = swiper => {
  curSwiper1 = swiper
}
const onSwiperTwo = swiper => {
  curSwiper2 = swiper
}

const onSwiperThree = swiper => {
  curSwiper3 = swiper
}

const paramsList = [
  {
    bgColor: 'linear-gradient(rgba(152, 138, 149, 1),rgba(194, 171, 147, 1), rgba(189, 204, 190, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/263_33141b53b4.png?updated_at=2023-03-30T06:00:42.341Z',
    title: '刀锋头灯，搭配锋芒氛围灯',
    subTitle: '切割式设计，目光犀利。炫彩氛围，进射光芒',
    borderColor: 'rgba(194, 171, 147, 1)'
  },
  {
    bgColor: 'rgba(183, 0, 17, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_FN_60c9edf1ca.png?updated_at=2023-03-30T06:02:20.920Z',
    title: '8.2寸悬浮仪表',
    subTitle: '全局态势，尽收眼底',
    borderColor: 'rgba(183, 0, 17, 1)'
  },
  {
    bgColor: 'linear-gradient(rgba(186, 156, 222, 1),rgba(160, 173, 193, 1), rgba(130, 184, 189, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_02_FN_1_24a4daafcb.png?updated_at=2023-03-30T06:02:50.604Z',
    title: '利刃尾灯',
    subTitle: '个性灯语，锋芒难掩',
    borderColor: 'rgba(160, 173, 193, 1)'
  },
  {
    bgColor: 'rgba(0, 0, 0, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_FN_a8e0f81181.png?updated_at=2023-03-30T06:03:15.485Z',
    title: '碳纤维纹理材质',
    subTitle: '硬核质感，看得见',
    borderColor: '#aaa'
  }
]

const param2List = [
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/153_1_d9ae149343.png?updated_at=2023-03-30T09:23:58.472Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_4131e6c6d9.png?updated_at=2023-03-30T06:54:47.875Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_9a70733a8a.png?updated_at=2023-03-30T06:55:22.394Z'
  }
]

const param3List = [
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X711341_12d86dc1d9.png?updated_at=2023-03-30T07:01:04.161Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/DSC_7697_fa6ca05bc0.png?updated_at=2023-03-30T07:09:24.546Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X711206_47b5f757c5.png?updated_at=2023-03-30T07:10:05.276Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X711063_9636322c23.png?updated_at=2023-03-30T07:10:34.225Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710413_Pano_1_7ebc47397c.png?updated_at=2023-03-30T07:11:16.914Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710577_1_d9647c8a55.png?updated_at=2023-03-30T07:12:09.812Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710674_1_26251335a9.png?updated_at=2023-03-30T07:12:42.650Z'
  },
  {
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X711004_1_4f3fb03739.png?updated_at=2023-03-30T07:13:09.214Z'
  }
]
const colorSelectList = ref([
  'linear-gradient(rgba(152, 138, 149, 1),rgba(194, 171, 147, 1), rgba(189, 204, 190, 1))',
  'linear-gradient(rgba(186, 156, 222, 1),rgba(160, 173, 193, 1), rgba(130, 184, 189, 1))',
  'rgba(183, 0, 17, 1)',
  'rgba(0, 0, 0, 1)',
  'rgba(255, 255, 255, 1)',
  'rgba(170, 169, 163, 1)',
  'rgba(224, 224, 222, 1)'
])

const banner50 = ref()
const banner51 = ref()
const banner52 = ref()
const bannerFirst = ref()
const bannerSecond = ref()
const bannerThird = ref()
// useChangeOpacity(banner50, [bannerFirst], 'banner5-1-animation', false)
// useChangeOpacity(banner51, [bannerSecond], 'banner5-1-animation', false)
// useChangeOpacity(banner52, [bannerThird], 'banner5-1-animation', false)
const url0 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_back_0_745b10f8de.png?updated_at=2023-03-22T12:45:32.172Z')
const url1 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_back_1_9ed13b35f2.png?updated_at=2023-03-22T12:37:15.659Z')
const url2 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_back_2_00787c401e.png?updated_at=2023-03-22T12:52:04.843Z')
const carImageUrlList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_4012dfdc5e.png?updated_at=2023-03-27T09:15:33.304Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_15015e6d75.png?updated_at=2023-03-27T09:17:30.351Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_c9a4b34b77.png?updated_at=2023-03-27T09:18:10.194Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_b544ba9f82.png?updated_at=2023-03-27T09:18:51.210Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_eb4d8472ce.png?updated_at=2023-03-27T09:19:33.226Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_cf17cc0d49.png?updated_at=2023-03-27T09:20:07.111Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_19d71ac569.png?updated_at=2023-03-27T09:20:54.568Z'
])

const currentSelectedColorIndex = ref(0)
const isShowLeftText = ref(true)
const isShowCenterTopText = ref(true)
const isShowCenterBottomText = ref(true)
const isShowRightText = ref(true)
const defaultClass = computed(() => {
  return 'color-item-button'
})

const selectedClass = index => {
  return currentSelectedColorIndex.value === index ? 'color-item-button-select' : ''
}

const leftArrowImgRef = ref()
const rightArrowImgRef = ref()

const colorSelectClick = index => {
  // debugger
  // 索引未改变不再重复执行逻辑
  if (currentSelectedColorIndex.value === index) return
  leftArrowImgRef.value.style.animation = 'opacityBanner5-1-left-arrow 1s ease-in-out 0s 1'
  rightArrowImgRef.value.style.animation = 'opacityBanner5-1-right-arrow 1s ease-in-out 0s 1'
  currentSelectedColorIndex.value = index
  curSwiper.slideTo(index + 1)
  setTimeout(() => {
    leftArrowImgRef.value.style.animation = ''
    rightArrowImgRef.value.style.animation = ''
  }, 1000)
}

const mouseOverMenu = function (index) {
  switch (index) {
    case 0:
      isShowLeftText.value = false
      break
    case 1:
      isShowCenterTopText.value = false
      break
    case 2:
      isShowCenterBottomText.value = false
      break
    case 3:
      isShowRightText.value = false
      break

    default:
      break
  }
}

const mouseOutMenu = function (index) {
  switch (index) {
    case 0:
      isShowLeftText.value = true
      break
    case 1:
      isShowCenterTopText.value = true
      break
    case 2:
      isShowCenterBottomText.value = true
      break
    case 3:
      isShowRightText.value = true
      break

    default:
      break
  }
}

const onSwiper = swiper => {
  curSwiper = swiper
}
</script>
<style lang="less">
.banner-5-mob {
  background-color: #000;
  text-align: center;
  .title {
    padding: 43mpxvw 0 0;
    font-size: 24mpxvw;
    color: #6abb3f;
    line-height: 28mpxvw;
  }

  .subTitle {
    margin: 12mpxvw 0 0;
    font-size: 14mpxvw;
    color: #c9caca;
  }

  .border-container {
    position: relative;

    .border-bg {
      margin: 26mpxvw 0 0;
      display: inline-block;
      box-sizing: border-box;
      width: 323mpxvw;
      height: 83mpxvw;
      border: 10pxvw solid;
      border-radius: 10px;
      background: linear-gradient(to bottom, #6abb3f -100%, #000 80%);
      border-image: linear-gradient(#6abb3f 30%, #000 70%) 1;
      opacity: 0.23;
      clip-path: inset(0 round 13px);

      .border-bg-border {
        position: relative;
        display: inline-block;
        left: -7pxvw;
        top: -7pxvw;
        width: 322mpxvw;
        height: 83mpxvw;
        border: 0px solid;
        border-radius: 10px;
        background: linear-gradient(to bottom, #6abb3f -100%, #000 80%);
      }
    }

    .describe {
      position: absolute;
      width: 293mpxvw;
      top: 0;
      left: 0;
      right: 0;
      margin: 37mpxvw auto;
      color: #fff;
      // font-size: 24pxvw;
      font-size: 12mpxvw;
    }
  }

  .car-container {
    position: relative;
    // overflow-x: hidden;
    .back-line {
      display: flex;
      position: relative;
      top: 27mpxvw;
      width: 100%;
      height: 37mpxvw;

      .back-img-center {
        width: 100%;
      }

      .back-img-side {
        position: absolute;
        display: inline-block;
        width: 66mpxvw;
        height: 47mpxvw;
      }

      .back-img-side-left {
        left: 9mpxvw;
        top: -5mpxvw;
      }

      .back-img-side-right {
        right: 9mpxvw;
        top: -5mpxvw;
      }
    }

    .car-swiper {
      position: absolute;
      top: -20mpxvw;
      width: 100%;
      height: 165mpxvw;
      text-align: center;
      z-index: 80;
      overflow-x: hidden;
    }

    .car-img {
      width: 276mpxvw;
      height: 165mpxvw;
    }

    .color-select-container {
      margin: 534pxvw 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .color-item-button {
        display: inline-block;
        width: 31.8pxvw;
        height: 47.2pxvw;
        margin: 0 34pxvw 0 0;
        border: 1px solid #65a825;
        border-radius: 967pxvw;
        color: #fff;
        cursor: pointer;
        z-index: 81;
      }

      .color-item-button-select {
        width: 40.8pxvw;
        height: 60.5pxvw;
      }
      .prompt {
        // background-image: linear-gradient(to right, #6abb3f 40%, transparent);
        // -webkit-background-clip: text;
        color: #6abb3f;
        font-size: 21pxvw;
      }
    }

    .car-param-img-container {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 187pxvw 0 0;
      height: 672pxvw;

      .param-left-img-container {
        display: inline-block;
        position: relative;
        text-align: right;
        & > img {
          width: 423pxvw;
          height: 672pxvw;
        }

        .top-desc {
          position: absolute;
          right: 28pxvw;
          bottom: 145pxvw;
          color: #fff;
          font-size: 30pxvw;
          z-index: 3;
        }

        .bottom-desc {
          position: absolute;
          right: 32pxvw;
          bottom: 47pxvw;
          color: #fff;
          font-size: 24pxvw;
          z-index: 3;
        }
      }

      .param-left-img-container-smart-car {
        & > img {
          width: 607pxvw;
        }
      }

      .param-center-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 869pxvw;
        height: 100%;
        margin: 0 10pxvw 0 10pxvw;
        overflow: hidden;

        .param-center-img-container {
          position: relative;
          & > img {
            width: 869pxvw;
            height: 330pxvw;
          }
        }

        .title-position {
          position: absolute;
          color: #fff;

          z-index: 3;
        }

        .top-title {
          top: 231pxvw;
          left: 53pxvw;
          font-size: 30pxvw;
        }
        .top-subTitle {
          top: 288pxvw;
          left: 52pxvw;
          font-size: 24pxvw;
        }
        .bottom-title {
          right: 126pxvw;
          bottom: 99pxvw;
          font-size: 30pxvw;
        }
        .bottom-subTitle {
          right: 27pxvw;
          bottom: 47pxvw;
          font-size: 24pxvw;
        }
      }

      .param-center-container-smart-car {
        width: 683pxvw;
      }

      .param-right-img-container {
        position: relative;
        display: inline-block;
        & > img {
          width: 423pxvw;
          height: 672pxvw;
        }

        .title-position {
          position: absolute;
        }

        .top-title {
          top: 73pxvw;
          left: 31pxvw;
          color: #fff;
          font-size: 30pxvw;
          z-index: 3;
        }

        .top-SubTitle {
          top: 130pxvw;
          left: 30pxvw;
          color: #fff;
          font-size: 27pxvw;
          z-index: 3;
        }
      }

      .param-right-img-container-smart-car {
        & > img {
          width: 423pxvw;
        }
      }

      .container-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #000;
        opacity: 0.58;
        z-index: 2;
      }

      .container-mask:hover {
        opacity: 0;
        transition: all 0.5s;
      }
    }

    .car-param-img-container-smart-car {
      margin: 123pxvw 0 0;
    }

    .car-img-title {
      display: inline-block;
      font-size: 55pxvw;
      color: #6abb3f;
      text-align: center;
      margin: 113pxvw 0 0;
    }

    .arrow-img-container {
      display: flex;
      justify-content: center;
      .arrow-img {
        display: inline-block;
        width: 79pxvw;
        height: 79pxvw;
        margin: 49pxvw 0 49pxvw;
        cursor: pointer;
      }

      .left-arrow {
        margin-right: 11pxvw;
      }
    }
  }

  .smart-car-container {
    margin: 0;
  }

  .introduce-container {
    .introduce-item {
      display: flex;
      padding: 185pxvw 0 0 221pxvw;
      .introduce-img {
        width: 483pxvw;
        height: 875pxvw;
      }

      .introduce-img-third {
        width: 916pxvw;
        height: 718pxvw;
      }

      .introduce-desc {
        text-align: left;
        padding: 244pxvw 0 0 99pxvw;
        .introduce-tite {
          color: #6abb3f;
          font-size: 55pxvw;
        }

        .introduce-subTitle {
          color: #c9caca;
          font-size: 30pxvw;
        }

        .introduce-param {
          display: flex;
          margin: 69pxvw 0 0;

          .item-img {
            height: 151pxvw;
            padding: 0 20pxvw;
          }

          .item-img-second {
            height: 177pxvw;
          }
        }

        .gradient-segmentation {
          display: inline-block;
          width: 362pxvw;
          height: 14pxvw;
          background: linear-gradient(to right, #6abb3f -40%, transparent 70%);
          border-radius: 5pxvw;
          margin-top: 67pxvw;
        }

        .segmentation-title {
          display: block;
          color: #c9caca;
          font-size: 24pxvw;
        }
      }

      .introduce-desc-second {
        padding: 0;
      }

      .introduce-desc-third {
        padding: 108pxvw 0 0 21pxvw;
      }
    }

    .introduce-item-second-bg {
      width: 100%;
      height: 1755pxvw;
      padding: 600pxvw 0 0 394pxvw;
      margin: -260pxvw 0;
      background: url('https://osswebsite.yadea.com.cn/banner5_introduce2_b41dd7c3aa.png?updated_at=2023-03-23T06:37:49.556Z') no-repeat;
      background-size: 100%;
      background-position: center center;
    }

    .introduce-item-third {
      padding: 0 0 0 155pxvw;
    }
  }

  .bottom-param-table-img {
    width: 1714pxvw;
    height: 1574pxvw;
    text-align: center;
    margin: 217pxvw 100pxvw;
  }

  .banner5-1-animation {
    animation: opacityBanner5-1 1.5s ease-in-out 0s 1;
  }

  .bottom-slider-title {
    text-align: center;
    color: #70b929;
    font-size: 14mpxvw;
    margin: 65mpxvw 0 15mpxvw;
  }
  .swiper-box {
    width: 100%;
    padding: 60mpxvw 0 0;
    .swiper {
      text-align: center;
      img {
        width: 323mpxvw;
        height: 158mpxvw;
      }

      .car-img-two {
        width: 100%;
        height: 523mpxvw;
      }

      .car-img-three {
        width: 321mpxvw;
        height: 255mpxvw;
      }

      .param-title {
        margin: 15mpxvw 0 0;
        padding: 0;
        color: #669f1e;
        font-size: 12mpxvw;
      }

      .param-subTitle {
        margin: 0;
        padding: 0;
        color: #ffffff;
        font-size: 12mpxvw;
      }

      .slider-bottom-desc {
        position: relative;
        width: 323mpxvw;
        height: 40mpxvw;
        background-color: #565656;
        margin: 0 auto;
        border-bottom-left-radius: 7mpxvw;
        border-bottom-right-radius: 7mpxvw;

        .desc-title {
          position: absolute;
          top: 2mpxvw;
          left: 8mpxvw;
          font-size: 12mpxvw;
          color: #599e34;
        }

        .desc-subTitle {
          position: absolute;
          top: 17mpxvw;
          left: 8mpxvw;
          font-size: 12mpxvw;
          color: #fff;
        }
      }
    }

    .custom-pagination {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .custom-pagination-div {
        width: 28mpxvw;
        height: 28mpxvw;
        margin: 0 5mpxvw;
        border: 3px solid #333;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-pagination-span {
        width: 5mpxvw;
        height: 5mpxvw;
        display: inline-block;
        background-color: gray;
        border-radius: 100%;
        overflow: hidden;
        margin: 0 18mpxvw 0 0;
        &:last-of-type {
          margin: 0;
        }
      }
    }

    .custom-pagination-margin-top-16 {
      margin-top: 16mpxvw;
    }
  }

  .swiper-box-padding-top0 {
    padding-top: 0;
  }

  @keyframes opacityBanner5-1 {
    0% {
      opacity: 0;
      position: relative;
      top: 100px;
    }
    100% {
      opacity: 1;
      position: relative;
      top: 0;
    }
  }

  .banner5-1-left-arrow-animation {
    animation: opacityBanner5-1-left-arrow 1s ease-in-out 0s 1;
  }

  @keyframes opacityBanner5-1-left-arrow {
    0% {
      opacity: 1;
      left: 53px;
    }
    100% {
      opacity: 0;
      left: -500px;
    }
  }

  .banner5-1-right-arrow-animation {
    animation: opacityBanner5-1-right-arrow 1s ease-in-out 0s 1;
  }

  @keyframes opacityBanner5-1-right-arrow {
    0% {
      opacity: 1;
      right: 53px;
    }
    100% {
      opacity: 0;
      right: -500px;
    }
  }
}
</style>
