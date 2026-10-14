<template>
  <div class="m-page-model-details-modern-banner5 pos-rel">
    <div class="title full-w">盲选都好看<br />气质妥妥拿捏</div>

    <div class="banner5-car pos-middle-h">
      <img ref="banner4RightTopImg" class="banner5-car1 full" :src="cars[0]" alt="" />
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
  return cars[active]
})

function onClick(index) {
  console.log('index :>> ', index)
  active = index
  const { animationFn } = useTransform(banner4RightTopImg, replaceImgUrl(carImg.value), 'translateX', 50, 10, 120, 200, 10, 15)
  animationFn()
}

const bgs = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/pswwcioap9y2eta4hborlyxifyi787de2kuf91087ef_bf54_44b6_a5f1_eae3eff4ce70_7fc91884af.png?updated_at=2023-03-30T01:57:31.616Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/VCG_211404398900_639c5f2385.png?updated_at=2023-03-30T01:47:46.019Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/VCG_211361715728_3908f621b7.png?updated_at=2023-03-30T01:47:45.401Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_2136286318.png?updated_at=2023-03-30T01:47:48.854Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_2742a55dae.png?updated_at=2023-03-30T01:47:47.348Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/VCG_211393811812_2_fac145b9a8.png?updated_at=2023-03-30T01:47:46.665Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/VCG_41_N1076027402_1cc0e4b851.png?updated_at=2023-03-30T01:47:46.062Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/VCG_41_N1268174190_7da5847617.png?updated_at=2023-03-30T01:47:46.577Z'
]

const cars = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/001_9bbe6ef9a7.png?updated_at=2023-03-30T08:33:51.546Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_c751258e94.png?updated_at=2023-03-30T01:47:46.863Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_c22aff979d.png?updated_at=2023-03-30T01:47:46.926Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_552be62c0c.png?updated_at=2023-03-30T01:47:47.964Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_d58e8e3e4b.png?updated_at=2023-03-30T01:47:47.388Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_96573e2ee7.png?updated_at=2023-03-30T01:47:47.292Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_5012225016.png?updated_at=2023-03-30T01:47:48.107Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_dea535c493.png?updated_at=2023-03-30T01:47:47.712Z'
]

const bg = computed(() => {
  return `url(${replaceImgUrl(bgs[active])})`
})
</script>

<style lang="less">
.m-page-model-details-modern-banner5 {
  height: 671mpxvw;
  background-image: v-bind(bg);
  background-repeat: no-repeat;
  background-size: 347mpxvw 429mpxvw;
  background-position: center 14mpxvw;
  overflow: hidden;
  .title {
    position: absolute;
    text-align: center;
    top: 81mpxvw;
    color: #fff;
    .m-fs(24);
    font-weight: bold;
    .pos-middle-h;
  }

  .banner5-car {
    position: absolute;
    width: 339mpxvw;
    height: 324mpxvw;
    top: 212mpxvw;
    overflow: hidden;
    box-sizing: content-box;
  }

  .banner5-car1 {
    display: inline-block;
  }

  .banner5-intro {
    position: absolute;
    left: 90mpxvw;
    bottom: 47mpxvw;
    &-txt {
      font-size: 17mpxvw;
      color: #444444;
    }

    &-colors {
      height: 21mpxvw;
      margin-top: 15mpxvw;
      .color-item {
        width: 17mpxvw;
        height: 17mpxvw;
        border-radius: 50%;
        margin-right: 5mpxvw;
        cursor: pointer;
        &-active {
          width: 21mpxvw;
          height: 21mpxvw;
        }
      }
    }
  }
}
</style>
