<template>
  <div class="banner-5">
    <div class="title HYQiHei-bold">型动 更怦然心动</div>
    <div class="subTitle HYQiHei">先锋力量美学</div>
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
      <swiper class="car-swiper swiper-no-swiping" :modules="modules" :space-between="50" :loop="true" :speed="1000" @swiper="onSwiper">
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
        <div class="prompt">点击选择颜色</div>
      </div>

      <!-- 表格图片介绍 -->
      <div class="car-param-img-container">
        <!-- 左边图片 -->
        <div class="param-left-img-container" @mouseenter="mouseOverMenu(0)" @mouseleave="mouseOutMenu(0)">
          <img :src="replaceImgUrl(showCarImgList[0])" alt="" />
          <!-- 遮罩层 -->
          <div class="container-mask"></div>
          <div class="top-desc HYQiHei" :style="`display:${isShowLeftText ? 'inline-block' : 'none'}`">刀锋头灯<br />搭配锋芒氛围灯</div>
          <div class="bottom-desc HYQiHei" :style="`display:${isShowLeftText ? 'inline-block' : 'none'}`">
            切割式设计 目光犀利<br />炫彩氛围 迸射光芒
          </div>
        </div>

        <!-- 中间图片 -->
        <div class="param-center-container">
          <div class="param-center-img-container" @mouseenter="mouseOverMenu(1)" @mouseleave="mouseOutMenu(1)">
            <!-- 上边图片 -->
            <img :src="replaceImgUrl(showCarImgList[1])" alt="" />
            <!-- 遮罩层 -->
            <div class="container-mask"></div>
          </div>

          <div class="param-center-img-container" @mouseenter="mouseOverMenu(2)" @mouseleave="mouseOutMenu(2)">
            <!-- 下边图片 -->
            <img :src="replaceImgUrl(showCarImgList[2])" alt="" />
            <!-- 遮罩层 -->
            <div class="container-mask"></div>
          </div>

          <div class="title-position top-title HYQiHei" :style="`display:${isShowCenterTopText ? 'inline-block' : 'none'}`">
            8.2寸悬浮仪表
          </div>
          <div class="title-position top-subTitle HYQiHei" :style="`display:${isShowCenterTopText ? 'inline-block' : 'none'}`">
            全局态势，尽收眼底
          </div>

          <div class="title-position bottom-title HYQiHei" :style="`display:${isShowCenterBottomText ? 'inline-block' : 'none'}`">
            利刃尾灯
          </div>
          <div class="title-position bottom-subTitle HYQiHei" :style="`display:${isShowCenterBottomText ? 'inline-block' : 'none'}`">
            个性灯语 锋芒难掩
          </div>
        </div>

        <!-- 右边图片 -->
        <div class="param-right-img-container" @mouseenter="mouseOverMenu(3)" @mouseleave="mouseOutMenu(3)">
          <img :src="replaceImgUrl(showCarImgList[3])" alt="" />
          <!-- 遮罩层 -->
          <div class="container-mask"></div>
          <div class="title-position top-title HYQiHei" :style="`display:${isShowRightText ? 'inline-block' : 'none'}`">碳纤维纹理材质</div>
          <div class="title-position top-SubTitle HYQiHei" :style="`display:${isShowRightText ? 'inline-block' : 'none'}`">
            硬核质感，看得见
          </div>
        </div>
      </div>
    </div>
    <!-- 车辆参数/图片介绍 -->
    <div class="introduce-container">
      <!-- 第一个 -->
      <div ref="banner50" class="introduce-item">
        <img class="introduce-img" :src="replaceImgUrl(introduceList[0])" alt="" />
        <div ref="bannerFirst" class="introduce-desc">
          <div class="introduce-tite HYQiHei-bold">技能拉满 智胜全场</div>
          <div class="introduce-subTitle HYQiHei">告别钥匙，出手更利落</div>
          <div class="introduce-param">
            <img v-for="(url, index) in introduce1ParamList" :key="index" class="item-img" :src="replaceImgUrl(url)" alt="" />
          </div>
        </div>
      </div>
      <!-- 第二个 -->
      <div ref="banner51" class="introduce-item introduce-item-second-bg">
        <div ref="bannerSecond" class="introduce-desc introduce-desc-second">
          <div class="introduce-tite HYQiHei-bold">技能拉满 智胜全场</div>
          <div class="introduce-subTitle HYQiHei">安全绝活，一整套</div>
          <div class="introduce-param">
            <img
              v-for="(url, index) in introduce2ParamList"
              :key="index"
              class="item-img item-img-second"
              :src="replaceImgUrl(url)"
              alt=""
            />
          </div>
        </div>
      </div>
      <!-- 第三个 -->
      <div ref="banner52" class="introduce-item introduce-item-third">
        <img class="introduce-img introduce-img-third" :src="replaceImgUrl(introduceList[1])" alt="" />
        <div ref="bannerThird" class="introduce-desc introduce-desc-third">
          <div class="introduce-tite HYQiHei-bold">技能拉满 智胜全场</div>
          <div class="introduce-subTitle HYQiHei">电量血槽，一手掌握</div>
          <div class="gradient-segmentation"></div>
          <div class="segmentation-title HYQiHei">APP随时查看电池电量、预估里程、充电记录<br />电量血槽精准把控，告别半路没电停车尴尬</div>
        </div>
      </div>
    </div>

    <!-- 车型酷图 -->
    <div class="car-container smart-car-container">
      <span class="car-img-title HYQiHei-bold">车型酷图</span>

      <!-- 表格图片介绍 -->
      <div v-show="arrowFlag" class="car-param-img-container car-param-img-container-smart-car">
        <!-- 左边图片 -->
        <div class="param-left-img-container param-left-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList[0])" alt="" />
        </div>

        <!-- 中间图片 -->
        <div class="param-center-container param-center-container-smart-car">
          <!-- 上边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList[1])" alt="" />

          <!-- 下边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList[2])" alt="" />
        </div>

        <!-- 右边图片 -->
        <div class="param-right-img-container param-right-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList[3])" alt="" />
        </div>
      </div>

      <!-- 表格图片介绍 -->
      <div v-show="!arrowFlag" class="car-param-img-container car-param-img-container-smart-car">
        <!-- 左边图片 -->
        <div class="param-left-img-container param-left-img-container-smart-car">
          <img :src="replaceImgUrl(introduce4ParamList[0])" alt="" />
        </div>

        <!-- 中间图片 -->
        <div class="param-center-container param-center-container-smart-car">
          <!-- 上边图片 -->
          <img :src="replaceImgUrl(introduce4ParamList[1])" alt="" />

          <!-- 下边图片 -->
          <img :src="replaceImgUrl(introduce4ParamList[2])" alt="" />
        </div>

        <!-- 右边图片 -->
        <div class="param-right-img-container param-right-img-container-smart-car">
          <img :src="replaceImgUrl(introduce4ParamList[3])" alt="" />
        </div>
      </div>

      <!-- 左右箭头 -->
      <div class="arrow-img-container">
        <img :src="replaceImgUrl(arrowImgList[0])" class="arrow-img left-arrow" @click="arrowFlag = !arrowFlag" />
        <img :src="replaceImgUrl(arrowImgList[1])" class="arrow-img" @click="arrowFlag = !arrowFlag" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
import { Swiper, SwiperSlide } from 'swiper/vue'
let curSwiper = null
const banner50 = ref()
const banner51 = ref()
const banner52 = ref()
const bannerFirst = ref()
const bannerSecond = ref()
const bannerThird = ref()
useChangeOpacity(banner50, [bannerFirst], 'banner5-1-animation', false)
useChangeOpacity(banner51, [bannerSecond], 'banner5-1-animation', false)
useChangeOpacity(banner52, [bannerThird], 'banner5-1-animation', false)
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
const colorSelectList = ref([
  'linear-gradient(rgba(152, 138, 149, 1),rgba(194, 171, 147, 1), rgba(189, 204, 190, 1))',
  'linear-gradient(rgba(186, 156, 222, 1),rgba(160, 173, 193, 1), rgba(130, 184, 189, 1))',
  'rgba(183, 0, 17, 1)',
  'rgba(0, 0, 0, 1)',
  'rgba(255, 255, 255, 1)',
  'rgba(170, 169, 163, 1)',
  'rgba(224, 224, 222, 1)'
])
const showCarImgList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_car_param1_054387dd78.png?updated_at=2023-03-23T02:46:58.715Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_car_param2_1_03507128ef.png?updated_at=2023-03-23T02:48:36.311Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_car_param2_2_997cd6b2a4.png?updated_at=2023-03-23T02:50:43.611Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_car_param3_9bc364bd8f.png?updated_at=2023-03-23T02:56:43.196Z'
])
const introduceList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_intoduce1_1c4c9e3a73.png?updated_at=2023-03-23T05:59:07.190Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_introduce3_d56c2616f1.png?updated_at=2023-03-23T07:46:04.687Z'
])
const introduce1ParamList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_introduce1_param1_8cfd615373.png?updated_at=2023-03-23T06:14:08.964Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/97_7_d546a578e6.png?updated_at=2023-03-30T09:09:05.524Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/97_8_4236504515.png?updated_at=2023-03-30T09:11:24.058Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_introduce1_param4_d5cd69a98b.png?updated_at=2023-03-23T06:15:20.027Z'
])
const introduce2ParamList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_introduce2_param1_384cd5d41f.png?updated_at=2023-03-23T07:28:51.947Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_introduce2_param2_36dbca691a.png?updated_at=2023-03-23T07:29:28.862Z'
])
const introduce3ParamList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_smart_car_1_ebb1f45f1b.png?updated_at=2023-03-24T08:15:09.235Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_smart_car_2_e3eec5b39f.png?updated_at=2023-03-24T08:15:55.753Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_smart_car_3_13e9594d3b.png?updated_at=2023-03-24T08:16:30.822Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_smart_car_4_13ef95cc02.png?updated_at=2023-03-24T08:17:05.365Z'
])

const introduce4ParamList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710577_713ed6a27f.png?updated_at=2023-03-29T13:36:28.110Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710413_Pano_f267a987fb.png?updated_at=2023-03-29T13:40:35.586Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X710674_860a392d52.png?updated_at=2023-03-29T13:41:23.423Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230305_X711004_dc7d241949.png?updated_at=2023-03-29T13:41:55.648Z'
])
const arrowImgList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_left_arrow_2460ed2b5c.png?updated_at=2023-03-24T08:25:31.644Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner5_right_arrow_987f30f5be.png?updated_at=2023-03-24T08:26:04.209Z'
])
const currentSelectedColorIndex = ref(0)
const isShowLeftText = ref(true)
const isShowCenterTopText = ref(true)
const isShowCenterBottomText = ref(true)
const isShowRightText = ref(true)
const arrowFlag = ref(true)
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
.banner-5 {
  background-color: #000;
  text-align: center;
  .title {
    padding: 113pxvw 0 0;
    font-size: 55pxvw;
    color: #6abb3f;
  }

  .subTitle {
    margin: 20pxvw 0 0;
    font-size: 30pxvw;
    color: #c9caca;
  }

  .border-container {
    position: relative;

    .border-bg {
      margin: 32pxvw 0 0;
      display: inline-block;
      box-sizing: border-box;
      width: 1085pxvw;
      height: 280pxvw;
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
        width: 1080pxvw;
        height: 280pxvw;
        border: 0px solid;
        border-radius: 10px;
        background: linear-gradient(to bottom, #6abb3f -100%, #000 80%);
      }
    }

    .describe {
      position: absolute;
      width: 620pxvw;
      top: 0;
      left: 0;
      right: 0;
      margin: 71pxvw auto;
      color: #fff;
      font-size: 24pxvw;
    }
  }

  .car-container {
    margin: -350pxvw 0 0;
    overflow-x: hidden;
    .back-line {
      display: flex;
      position: relative;
      top: 350pxvw;
      width: 100%;
      height: 235pxvw;

      .back-img-center {
        width: 100%;
      }

      .back-img-side {
        position: absolute;
        display: inline-block;
        width: 333pxvw;
        height: 235pxvw;
      }

      .back-img-side-left {
        left: 55pxvw;
        top: 0;
        bottom: 0;
      }

      .back-img-side-right {
        right: 55pxvw;
        top: 0;
        bottom: 0;
      }
    }

    .car-swiper {
      position: absolute;
      width: 100%;
      height: 700pxvw;
      text-align: center;
      z-index: 80;
      overflow-x: hidden;
      // background-color: red;
    }

    .car-param-contrast {
      width: 50%;
    }

    .car-img {
      // position: relative;
      // top: -50pxvw;
      width: 874pxvw;
      height: 524pxvw;
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
        border: 1px solid #c8c8c8;
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
        color: #6abb3f;
        font-size: 21pxvw;
      }
    }

    .color-select-container-car-contrast {
      width: 50%;
    }

    .car-param-img-container {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 187pxvw 0 0;
      height: 672pxvw;
      animation: onlyOpcity 1s ease-in-out 0s 1;

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
          right: 105pxvw;
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

  .car-container-bg-black {
    display: inline-block;
    background: #000;
    margin: 0;
    // width: 300pxvw;
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

  .banner12 {
    text-align: center;
    padding-bottom: 184pxvw;
    img {
      width: 1734pxvw;
      height: auto;
      object-fit: cover;
      object-position: center;
    }

    .swiper-box-flex {
      display: flex;
      justify-content: center;
      margin: 0 0 0 600pxvw;
      .swiper-box {
        width: 500pxvw;
        padding: 30pxvw 0;
        .swiper {
          img {
            width: 474pxvw;
            height: 316pxvw;
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
            width: 28pxvw;
            height: 28pxvw;
            margin: 0 5pxvw;
            border: 3px solid transparent;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-pagination-span {
            width: 20pxvw;
            height: 20pxvw;
            display: inline-block;
            border-radius: 100%;
            overflow: hidden;
            background: #000;
          }
        }
      }
    }
  }

  .banner5-1-animation {
    animation: opacityBanner5-1 1.5s ease-in-out 0s 1;
  }

  @keyframes onlyOpcity {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
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

  .car-param-detail-contrast {
    // display: flex;
    // justify-content: center;
  }
}
</style>
