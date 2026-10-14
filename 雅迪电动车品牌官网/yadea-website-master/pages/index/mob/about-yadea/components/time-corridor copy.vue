<!--
 * @Author: yqq
 * @Date: 2023-01-28 14:19:16
 * @LastEditors: yqq
 * @LastEditTime: 2023-02-02 16:15:12
 * @FilePath: \yadea-website\pages\index\about-yadea\components\time-corridor.vue
 * @Description: 
 * 
-->
<template>
  <!-- swiper-one模块 -->
  <div id="swiper-one" class="banner4">
    <!-- <swiper class="banner4-swiper pos-rel" :modules="modules" :pagination="{ clickable: true }" :free-mode="true">
      <swiper-slide class="swiper-slide1">
        <div class="div1"></div>
        <div class="div1"></div>
        <div class="div1"></div>
        <div class="div1"></div>
        <div class="div1"></div>
        <div class="div1"></div>
        <div class="div1"></div>
      </swiper-slide>
      <swiper-slide class="swiper-slide2">
        <span class="div2"></span>
        <span class="div2"></span>
      </swiper-slide>
      <swiper-slide class="swiper-slide3">
        <div class="div3"></div>
        <div class="div3"></div>
        <div class="div3"></div>
        <div class="div3"></div>
      </swiper-slide>
      <swiper-slide class="swiper-slide4">
        <div class="div4"></div>
        <div class="div4"></div>
        <div class="div4"></div>
        <div class="div4"></div>
      </swiper-slide>
    </swiper> -->
  </div>
</template>

<script setup>
// import 'swiper/css'
// import 'swiper/css/pagination'
// import { Pagination, FreeMode } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/vue'

// const modules = [Pagination, FreeMode]

defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: []
      }
    }
  }
})
</script>

<style lang="less" scoped>
:deep(.swiper-slide) {
  height: 350pxvw !important;
  overflow: visible;
}

.swiper-slide1 {
  width: 1320pxvw !important;
}

.swiper-slide2 {
  width: 1320pxvw !important;
}

.swiper-slide3 {
  width: 1320pxvw !important;
}
.swiper-slide4 {
  width: 1320pxvw !important;
}

.div1 {
  background: #fff;
  width: 330pxvw;
  height: 185pxvw;
  float: left;
  // margin: 0 20px;
}

.div2 {
  display: inline-block;
  background: red;
  float: left;
  width: 330pxvw;
  height: 185pxvw;
  // margin: 0 20px;
}

.div3 {
  background: blue;
  width: 330pxvw;
  height: 185pxvw;
  float: left;
  // margin: 0 20px;
}
.div4 {
  background: green;
  width: 330pxvw;
  height: 185pxvw;
  float: left;
  // margin: 0 20px;
}
</style>
