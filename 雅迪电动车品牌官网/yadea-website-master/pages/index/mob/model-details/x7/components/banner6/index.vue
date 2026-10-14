<template>
  <div class="banner12">
    <img class="param-img-first" :src="replaceImgUrl(paramImgList[0])" alt="" />
    <div class="swiper-box">
      <client-only>
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
            <div class="car-title">{{ item.carColorDesc }}</div>
          </swiper-slide>
        </swiper>
      </client-only>
      <div class="custom-pagination">
        <template v-for="(item, index) in paramsList" :key="item.id">
          <div
            class="custom-pagination-div"
            :style="{ borderColor: swiperActiveIndex1 === index ? item.borderColor : '' }"
            @click="handleClickIndexOne(index)"
          >
            <div class="custom-pagination-span" :style="{ background: item.bgColor }"></div>
          </div>
        </template>
      </div>
    </div>
    <img class="param-img-second" :src="replaceImgUrl(paramImgList[1])" alt="" />
    <img class="param-img-third" :src="replaceImgUrl(paramImgList[2])" alt="" />
    <div class="swiper-box">
      <client-only>
        <swiper
          :modules="modules"
          :space-between="50"
          :loop="false"
          :navigation="false"
          @slide-change="onSwiperChangeTwo"
          @swiper="onSwiperTwo"
        >
          <swiper-slide v-for="item in paramsList" :key="item">
            <img :src="replaceImgUrl(item.carImg)" alt="" />
            <div class="car-title">{{ item.carColorDesc }}</div>
          </swiper-slide>
        </swiper>
      </client-only>
      <div class="custom-pagination">
        <template v-for="(item, index) in paramsList" :key="item.id">
          <div
            class="custom-pagination-div"
            :style="{ borderColor: swiperActiveIndex2 === index ? item.bgColor : '' }"
            @click="handleClickIndexTwo(index)"
          >
            <div class="custom-pagination-span" :style="{ background: item.bgColor }"></div>
          </div>
        </template>
      </div>
    </div>
    <img class="param-img-fourth" :src="replaceImgUrl(paramImgList[3])" alt="" />
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/less/navigation'
import _ from 'lodash'

const paramImgList = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_3_b1bdf5b21b.png?updated_at=2023-03-30T07:26:43.039Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_4_e9a9648e98.png?updated_at=2023-03-30T07:28:06.292Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_5_290624430c.png?updated_at=2023-03-30T07:30:16.456Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_6_4cb29d96f8.png?updated_at=2023-03-30T07:30:53.275Z'
]

const paramsList = [
  {
    bgColor: 'linear-gradient(rgba(152, 138, 149, 1),rgba(194, 171, 147, 1), rgba(189, 204, 190, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_4012dfdc5e.png?updated_at=2023-03-27T09:15:33.304Z',
    carColorDesc: '虹彩陨铁灰配矿石深灰',
    borderColor: 'rgba(194, 171, 147, 1)'
  },
  {
    bgColor: 'rgba(183, 0, 17, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_c9a4b34b77.png?updated_at=2023-03-27T09:18:10.194Z',
    carColorDesc: '靓丽珠红配新塔夫绸白配新油光黑',
    borderColor: 'rgba(183, 0, 17, 1)'
  },
  {
    bgColor: 'linear-gradient(rgba(186, 156, 222, 1),rgba(160, 173, 193, 1), rgba(130, 184, 189, 1))',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_15015e6d75.png?updated_at=2023-03-27T09:17:30.351Z',
    carColorDesc: '未来银配矿石深灰',
    borderColor: 'rgba(160, 173, 193, 1)'
  },
  {
    bgColor: 'rgba(0, 0, 0, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_b544ba9f82.png?updated_at=2023-03-27T09:18:51.210Z',
    carColorDesc: '消光黑配月光金',
    borderColor: '#aaa'
  },
  {
    bgColor: 'rgba(255, 255, 255, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_eb4d8472ce.png?updated_at=2023-03-27T09:19:33.226Z',
    carColorDesc: '新塔夫绸白配月光金',
    borderColor: 'rgba(255, 255, 255, 1)'
  },
  {
    bgColor: 'rgba(170, 169, 163, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_cf17cc0d49.png?updated_at=2023-03-27T09:20:07.111Z',
    carColorDesc: '曜石灰配矿石深灰',
    borderColor: 'rgba(170, 169, 163, 1)'
  },
  {
    bgColor: 'rgba(224, 224, 222, 1)',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_19d71ac569.png?updated_at=2023-03-27T09:20:54.568Z',
    carColorDesc: '油光数码银配矿石深灰',
    borderColor: 'rgba(224, 224, 222, 1)'
  }
]

let curSwiper1 = null
let curSwiper2 = null

const modules = [FreeMode, Navigation]
const swiperActiveIndex1 = $ref(0)
const onSwiperChangeOne = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex1 = realIndex
}, 50)
const onSwiperOne = swiper => {
  curSwiper1 = swiper
}

const swiperActiveIndex2 = $ref(0)
const onSwiperChangeTwo = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex2 = realIndex
}, 50)
const onSwiperTwo = swiper => {
  curSwiper2 = swiper
}

const handleClickIndexOne = index => {
  curSwiper1.slideTo(index)
  swiperActiveIndex1 = index
}

const handleClickIndexTwo = index => {
  curSwiper2.slideTo(index)
  swiperActiveIndex2 = index
}
</script>
<style lang="less">
.banner12 {
  background-color: #000;
  text-align: center;
  padding-bottom: 184pxvw;

  .param-img-first {
    margin-top: 67mpxvw;
  }

  .param-img-third {
    margin-top: 50mpxvw;
  }
  img {
    width: 327mpxvw;
    height: auto;
    object-fit: cover;
    object-position: center;
  }

  .swiper-box {
    padding: 30pxvw 0;
    .swiper {
      img {
        margin-top: 32mpxvw;
        width: 276mpxvw;
        height: 158mpxvw;
      }

      .car-title {
        font-size: 10mpxvw;
        color: #669f1e;
      }
    }

    .custom-pagination {
      width: 100%;
      height: 50mpxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .custom-pagination-div {
        width: 20mpxvw;
        height: 20mpxvw;
        margin: 0 5mpxvw;
        border: 3px solid #333;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-pagination-span {
        width: 12mpxvw;
        height: 12mpxvw;
        display: inline-block;
        border-radius: 100%;
        overflow: hidden;
        background: #000;
      }
    }
  }
}
</style>
