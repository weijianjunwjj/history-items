<template>
  <div ref="banner4" class="banner-4-mob">
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
          <p class="param-title">{{ item.title }}</p>
          <p class="param-subTitle">{{ item.subTitle }}</p>
        </swiper-slide>
      </swiper>
      <!-- </client-only> -->
      <div class="custom-pagination">
        <template v-for="(item, index) in paramsList" :key="item">
          <div class="custom-pagination-span" :style="{ backgroundColor: swiperActiveIndex1 === index ? '#fff' : 'gray' }"></div>
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
const banner4 = ref()
const bannerFirst = ref()
// useChangeOpacity(banner4, [bannerFirst], 'banner4-animation', false)
const photoParamList = ref([
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param1_98a18d62d6.png?updated_at=2023-03-22T06:36:00.430Z',
    title: '人机三角调教',
    subTitle: '直线不偏移，过弯更灵活'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param2_7c2ba9a865.png?updated_at=2023-03-22T06:50:08.515Z',
    title: '气囊减震',
    subTitle: '战斗与舒适并存'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param3_06b173222b.png?updated_at=2023-03-22T06:51:20.208Z',
    title: '大盘碟刹',
    subTitle: '最高速降仅1.9秒，强大信心保障'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param4_bbb3300643.png?updated_at=2023-03-22T06:52:34.823Z',
    title: '高性能TTFAR轮胎',
    subTitle: '全天候稳定输出'
  }
])

const modules = [FreeMode, Navigation]
let curSwiper1 = null
let curSwiper2 = null
const swiperActiveIndex1 = $ref(0)

const onSwiperChangeOne = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex1 = realIndex
  console.log('swiperActiveIndex1:', swiperActiveIndex1)
}, 50)

const onSwiperOne = swiper => {
  curSwiper1 = swiper
}

const handleClickIndexOne = index => {
  curSwiper1.slideTo(index)
  swiperActiveIndex1 = index
}

const handleClickIndexTwo = index => {
  curSwiper2.slideTo(index)
  swiperActiveIndex2 = index
}

const paramsList = [
  {
    bgColor: 'linear-gradient(rgba(152, 138, 149, 1),rgba(194, 171, 147, 1), rgba(189, 204, 190, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_08df0c99e2.png?updated_at=2023-03-30T04:48:42.010Z',
    title: '人机三角调教',
    subTitle: '直线不偏移，过弯更灵活',
    borderColor: 'rgba(194, 171, 147, 1)'
  },
  {
    bgColor: 'rgba(183, 0, 17, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_180_FN_379507f6ff.png?updated_at=2023-03-30T04:49:40.101Z',
    title: '气囊减震',
    subTitle: '战斗与舒适并存',
    borderColor: 'rgba(183, 0, 17, 1)'
  },
  {
    bgColor: 'linear-gradient(rgba(186, 156, 222, 1),rgba(160, 173, 193, 1), rgba(130, 184, 189, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_FN_3caa0da2bf.png?updated_at=2023-03-30T04:50:14.519Z',
    title: '大盘碟刹',
    subTitle: '最高速降仅1.9秒，强大信心保障',
    borderColor: 'rgba(160, 173, 193, 1)'
  },
  {
    bgColor: 'rgba(0, 0, 0, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Yadea_X7_02_FN_8254ea7684.png?updated_at=2023-03-30T04:50:48.029Z',
    title: '碳纤维纹理材质',
    subTitle: '硬核质感，看得见',
    borderColor: '#aaa'
  }
]
</script>
<style lang="less">
.banner-4-mob {
  position: relative;
  width: 100%;
  background: url('http://osswebsite.yadea.com.cn/145_ea9b2e3048.png?updated_at=2023-03-30T04:37:57.451Z') no-repeat;
  background-size: 110%;
  background-color: #141414;
  background-position: 70% 0;

  .describe-container {
    padding: 405mpxvw 0 0 1090mpxvw;
    .title {
      font-size: 55mpxvw;
      color: #6abb3f;
    }
    .gradient-segmentation {
      display: inline-block;
      width: 362mpxvw;
      height: 14mpxvw;
      background: linear-gradient(to right, #6abb3f -40%, transparent 70%);
      border-radius: 5mpxvw;
      margin: 65mpxvw 0 0;
    }
    .subTitle {
      font-size: 24mpxvw;
      color: #ffffff;
      line-height: 31mpxvw;
      margin: -2mpxvw 0 0;
    }
  }

  .photo-param-container {
    margin: 497mpxvw 0 0;
    padding: 0 150mpxvw;
    display: flex;
    justify-content: space-between;
    .param-item {
      text-align: center;
      .top-img {
        width: 376mpxvw;
        height: 429mpxvw;
      }

      .title {
        margin: 43mpxvw 0 0;
        color: #6abb3f;
      }

      .subTitle {
        margin: 0 0 145mpxvw;
        color: #ffffff;
      }
    }
  }

  .banner4-animation {
    animation: opacityBanner4 1.5s ease-in-out 0s 1;
  }

  .swiper-box {
    width: 100%;
    padding: 300mpxvw 0 0;
    .swiper {
      text-align: center;
      img {
        width: 323mpxvw;
        height: 179mpxvw;
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
  }

  @keyframes opacityBanner4 {
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
}
</style>
