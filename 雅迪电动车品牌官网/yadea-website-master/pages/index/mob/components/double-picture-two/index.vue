<!--
 * @Author: yqq
 * @Date: 2023-01-03 19:55:05
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 11:14:15
 * @FilePath: \website\pages\index\mob\components\double-picture-two\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- double-picture-two -->
  <div v-if="mod" class="banner3 mt-2-mvw">
    <div class="banner3-content mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data[0]?.bgImage) + ')' }">
      <div class="mobile-img"></div>
      <div class="my-animate double-picture-two0 txt-c" :class="isShow0 && 'my-animate-sildeUp'">
        <div class="fs-24-mvw fw-500 txt-c" :style="{ color: mod?.data[0]?.mobileDescColor }">{{ mod?.data[0].desc1 }}</div>
        <p class="fs-12-mvw txt-c" :style="{ color: mod?.data[0]?.mobileDescColor }">{{ mod?.data[0].desc2 }}</p>
        <NuxtLink :to="mod?.data[0]?.btnUrl" :style="{ color: mod?.data[0]?.mobileDescColor }" class="fs-12-mvw txt-white learn-more">
          {{ mod?.data[0]?.btn }}
          <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
        </NuxtLink>
        <!-- <a class="fs-12-mvw txt-white learn-more" :style="{ color: mod?.data[0]?.mobileDescColor }" :href="mod?.data[0]?.btnUrl">
          {{ mod?.data[0]?.btn }}
          <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
        </a> -->
      </div>
      <!-- <div class="banner3-content-mask my-bottom-animate" :class="isShow0 && 'my-animate-bottom-sildeUp'"> -->
      <!-- <div class="banner3-content-mask">
        <div class="mask-left">
          <img src="@/assets/images/home/code.png" alt="二维码图片" />
        </div>
        <div class="mask-right">
          <p class="txt-white fs-18-mvw ellipsis-1 fw-500">想Get新资讯?</p>
          <span class="txt-white fs-12-mvw ellipsis-1">即可下载雅迪智行动APP探索新世界</span>
        </div>
      </div> -->
    </div>
    <div class="banner3-content mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data[1]?.bgImage) + ')' }">
      <div class="mobile-img"></div>
      <div class="my-animate double-picture-two1 txt-c" :class="isShow1 && 'my-animate-sildeUp'">
        <div class="fs-24-mvw fw-500 txt-c" :style="{ color: mod?.data[1]?.mobileDescColor }">{{ mod?.data[1]?.desc1 }}</div>
        <p class="fs-12-mvw txt-c" :style="{ color: mod?.data[1]?.mobileDescColor }">{{ mod?.data[1]?.desc2 }}</p>
        <a class="fs-12-mvw txt-white learn-more" :style="{ color: mod?.data[1]?.mobileDescColor }" @click="show = true">
          {{ mod?.data[1]?.btn }}
          <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
        </a>
      </div>
      <a-modal v-model:visible="show" class="double-picture-two-modal" centered :width="320" :title="null" :footer="null" @ok="handleOk">
        <div class="content flex-col align-center pos-center">
          <img class="content-img" src="@/assets/images/app-code.png" alt="" />

          <div class="content-txt">APP下载</div>
          <div class="fs-12-mvw opt65 mt-2-mvw" @click="handleGoConceal">隐私条款</div>
        </div>
      </a-modal>
      <!-- <div class="banner3-content-mask my-bottom-animate" :class="isShow1 && 'my-animate-bottom-sildeUp'"> -->
      <!-- <div class="banner3-content-mask">
        <div class="mask-left">
          <img src="@/assets/images/home/code.png" alt="二维码图片" />
        </div>
        <div class="mask-right">
          <p class="txt-white fs-18-mvw ellipsis-1 fw-500">想Get新资讯?</p>
          <span class="txt-white fs-12-mvw ellipsis-1">即可下载雅迪智行动APP探索新世界</span>
        </div>
      </div> -->
    </div>
    <div class="banner3-content mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data[2]?.bgImage) + ')' }">
      <div class="mobile-img"></div>
      <div class="my-animate double-picture-two2 txt-c" :class="isShow2 && 'my-animate-sildeUp'">
        <div class="fs-24-mvw fw-500 txt-c" :style="{ color: mod?.data[2]?.mobileDescColor }">{{ mod?.data[2]?.desc1 }}</div>
        <p class="fs-12-mvw txt-c" :style="{ color: mod?.data[2]?.mobileDescColor }">{{ mod?.data[2]?.desc2 }}</p>
        <a class="fs-12-mvw txt-white learn-more" :style="{ color: mod?.data[2]?.mobileDescColor }" :href="mod?.data[2]?.btnUrl">
          {{ mod?.data[2]?.btn }}
          <SvgIcon name="arrow-right-white" :style="{ color: item?.mobileDescColor }"></SvgIcon>
        </a>
      </div>
      <!-- <div class="banner3-content-mask my-bottom-animate" :class="isShow1 && 'my-animate-bottom-sildeUp'"> -->
      <!-- <div class="banner3-content-mask">
        <div class="mask-left">
          <img src="@/assets/images/home/code.png" alt="二维码图片" />
        </div>
        <div class="mask-right">
          <p class="txt-white fs-18-mvw ellipsis-1 fw-500">微笑服务，从心开始</p>
          <span class="txt-white fs-12-mvw ellipsis-1">幸福骑行，一键就行</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useIsShow } from '@/composables/useIsShow'

defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: []
      }
    }
  }
})

const show = $ref(false)

const { isShow: isShow0 } = useIsShow('.double-picture-two0')
const { isShow: isShow1 } = useIsShow('.double-picture-two1')
const { isShow: isShow2 } = useIsShow('.double-picture-two2')

const handleGoConceal = () => {
  window.location.href = '/car-detail/conceal/index.html'
}

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less">
.double-picture-two-modal {
  .ant-modal-body {
    height: 360px;
  }

  .content {
    &-img {
      width: 180px;
      height: 180px;
    }

    &-txt {
      font-size: 16px;
      color: #888;
      text-align: center;
      line-height: normal;
      margin-top: 20px;
    }

    .conceal-txt {
      margin-top: 10pxvw;
      cursor: pointer;
    }
  }
}
</style>

<style lang="less" scoped>
.banner3-content {
  width: 100%;
  height: 445mpxvw;
  background-size: cover;
  background-position: center;
  padding-top: 40mpxvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:first-of-type {
    margin-top: 0;
  }

  p {
    margin: 0;
  }

  .learn-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12mpxvw;
    opacity: 0.65;

    svg {
      width: 12mpxvw;
      height: 12mpxvw;
    }
  }

  .banner3-content-mask {
    position: absolute;
    // bottom: -50mpxvw;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100mpxvw;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    backdrop-filter: blur(6px);
    background: rgba(0, 0, 0, 0.4);

    .mask-left {
      width: 40%;
      text-align: center;

      img {
        width: 72mpxvw;
        height: 72mpxvw;
      }
    }

    .mask-right {
      width: 60%;
      text-align: left;
      padding-right: 20px;

      p,
      span {
        width: 100%;
      }
    }
  }
}

.banner3-content1 {
  background-image: url('https://osswebsite.yadea.com.cn/bg1_35b6ad6b72.png?updated_at=2023-03-16T01:59:20.818Z');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  .mobile-img {
    width: 150mpxvw;
    height: 70%;
    background: url('https://osswebsite.yadea.com.cn/content1_1c70647ac4.png?updated_at=2023-03-16T02:00:13.347Z');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
  }
}

.banner3-content2 {
  background-image: url('https://osswebsite.yadea.com.cn/bg2_0879d3a6a3.png?updated_at=2023-03-16T02:03:13.835Z');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  .mobile-img {
    width: 150mpxvw;
    height: 70%;
    background: url('https://osswebsite.yadea.com.cn/content2_1a9b021823.png?updated_at=2023-03-16T02:03:49.979Z');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
  }
}

.my-animate-bottom-sildeUp {
  bottom: 0 !important;
  opacity: 1 !important;
  transition: all 1s cubic-bezier(0.4, 0, 0.3, 1) 0.1s;
}

.my-bottom-animate {
  bottom: -50mxpvw !important;
  position: relative;
  opacity: 0;
}
</style>
