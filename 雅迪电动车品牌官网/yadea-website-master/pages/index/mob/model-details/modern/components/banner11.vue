<template>
  <div class="m-page-model-details-modern-banner11">
    <div class="top txt-c">
      <img src="https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_4_1b81d807cf.png?updated_at=2023-03-30T05:24:14.835Z" alt="" />
    </div>
    <div class="swiper-box txt-c">
      <client-only>
        <swiper :modules="modules" :space-between="50" :loop="false" :navigation="false" @slide-change="onSwiperChange" @swiper="onSwiper">
          <swiper-slide v-for="item in paramsList" :key="item">
            <img :src="replaceImgUrl(item.carImg)" alt="" />
            <div class="car-name">{{ item.name }}</div>
          </swiper-slide>
        </swiper>
      </client-only>
      <div class="custom-pagination">
        <template v-for="(item, index) in paramsList" :key="item.id">
          <div
            class="custom-pagination-div fs-13-mvw"
            :style="{ borderColor: swiperActiveIndex === index ? item.bgColor : '' }"
            @click="handleClickIndex(index)"
          >
            <div class="custom-pagination-span" :style="{ background: item.bgColor }"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="bottom txt-c">
      <img src="https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_5_fccc2c137a.png?updated_at=2023-03-30T05:24:15.622Z" alt="" />
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation } from 'swiper'
import _ from 'lodash'
// Import Swiper styles
import 'swiper/css'
import 'swiper/less/navigation'

const modules = [FreeMode, Navigation]

const paramsList = [
  {
    bgColor: '#E0E2D7',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/01_6556da31ec.png?updated_at=2023-03-29T13:11:19.726Z',
    name: '豆蔻绿'
  },
  {
    bgColor: '#B8CBDA',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/02_fc2c9803f8.png?updated_at=2023-03-29T13:11:19.676Z',
    name: '静谧蓝'
  },
  {
    bgColor: '#D7C7C8',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/03_46038b3c4f.png?updated_at=2023-03-29T13:11:19.705Z',
    name: '可可粉'
  },
  {
    bgColor: '#9F968D',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/04_9bdcc05272.png?updated_at=2023-03-29T13:11:20.057Z',
    name: '奶油棕'
  },
  {
    bgColor: '#F1F1E9',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/05_a724dd15a7.png?updated_at=2023-03-29T13:11:19.697Z',
    name: '奶油白'
  },
  {
    bgColor: '#58697D',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/06_5e47cd3807.png?updated_at=2023-03-29T13:11:20.014Z',
    name: '莫黛蓝'
  },
  {
    bgColor: '#CED0CD',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/07_515ed4efb8.png?updated_at=2023-03-29T13:11:20.283Z',
    name: '水泥灰'
  },
  {
    bgColor: '#87B29E',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/08_9a38ae367f.png?updated_at=2023-03-29T13:11:20.333Z',
    name: '青色绿'
  }
]
let curSwiper = null
const swiperActiveIndex = $ref(0)
const onSwiper = swiper => {
  curSwiper = swiper
}

const handleClickIndex = index => {
  curSwiper.slideTo(index)
  swiperActiveIndex = index
}
</script>

<style lang="less">
.m-page-model-details-modern-banner11 {
  .bottom {
    .mb(303);
  }
  .car-name {
    font-size: 10mpxvw;
    font-family: HYQiHei;
    color: #333333;
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
        width: 258mpxvw;
        height: 161mpxvw;
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
        width: 21mpxvw;
        height: 21mpxvw;
        margin: 0 5pxvw;
        border: 3px solid transparent;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-pagination-span {
        width: 17mpxvw;
        height: 17mpxvw;
        display: inline-block;
        border-radius: 100%;
        overflow: hidden;
        background: #000;
      }
    }
  }
}
</style>
