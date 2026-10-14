<template>
  <div class="page-model-details-modern-banner5 pos-rel">
    <div class="title">盲选都好看<br />气质妥妥拿捏</div>

    <div class="banner5-car">
      <img ref="banner4RightTopImg" class="banner5-car1 full" src="/images/modern/banner5-car1.png" alt="" />
    </div>

    <div class="banner5-intro">
      <div class="banner5-intro-txt">
        全新复古配色 ｜ <span class="fw-bold">{{ txts[active] }}</span>
      </div>
      <div class="banner5-intro-colors flex-c">
        <div
          v-for="(item, index) of colors"
          :key="index"
          class="color-item"
          :class="index === active && 'color-item-active'"
          :style="`background:${item}`"
          @click="onClick(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransform } from '@/composables/animation-hooks/useTransform'
// ---data---
const colors = ['#87B29E', '#B7CBDA', '#D6C7C7', '#9F978D', '#F1F0E9', '#58687C', '#CED0CD', '#DFE2D6']

const txts = ['雨后薄荷', '碧水蓝天', '繁樱大道', '暮色棕林', '茉莉花园', '古韵黛蓝', '云上雅灰', '夏夜森林']

const active = $ref(0)

// ---function---
const banner4RightTopImg = ref()

const carImg = computed(() => {
  return `/images/modern/banner5-car${active + 1}.png`
})

function onClick(index) {
  console.log('index :>> ', index)
  active = index
  const { animationFn } = useTransform(banner4RightTopImg, carImg.value, 'translateX', 50, 10, 120, 200, 10, 15)
  animationFn()
}

const bg = computed(() => {
  return `url(/images/modern/banner5-bg${active + 1}.png)`
})
</script>

<style lang="less">
.page-model-details-modern-banner5 {
  height: 1000pxvw;
  background-image: v-bind(bg);
  background-repeat: no-repeat;
  background-size: 1420pxvw 651pxvw;
  background-position: center 3.885417vw;
  overflow: hidden;
  // transition: 500ms;
  .title {
    position: absolute;
    top: 246pxvw;
    left: 400pxvw;
    color: #fff;
    .fs(55);
    // font-weight: bold;
  }

  .banner5-car {
    position: absolute;
    width: 741pxvw;
    height: 709pxvw;
    top: 147pxvw;
    right: 13vw;
    overflow: hidden;
    padding-right: 1.270833vw;
    box-sizing: content-box;
  }

  .banner5-car1 {
    display: inline-block;
  }

  .banner5-intro {
    position: absolute;
    left: 399pxvw;
    bottom: 145pxvw;
    &-txt {
      font-size: 24pxvw;
      color: #444444;
    }

    &-colors {
      height: 30pxvw;
      margin-top: 31pxvw;
      .color-item {
        width: 25pxvw;
        height: 25pxvw;
        border-radius: 50%;
        margin-right: 12pxvw;
        cursor: pointer;
        &-active {
          width: 30pxvw;
          height: 30pxvw;
        }
      }
    }
  }
}
</style>
