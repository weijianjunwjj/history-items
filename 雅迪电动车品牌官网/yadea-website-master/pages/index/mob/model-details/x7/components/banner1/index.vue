<template>
  <div ref="banner1" class="banner-1-mob">
    <div ref="titleContainer" class="title-container">
      <div class="title HYQiHei-bold">性能狠角色 硬核出道</div>
      <div class="subTitle HYQiHei">X, 进化无止境<br />天生骄傲的澎湃动力<br />机能型格，呼啸而来</div>
    </div>
    <div class="video-bg" @click="handleOpenVideoModal">
      <img class="bg-img" :src="replaceImgUrl(videoImg)" alt="" />
      <img class="play-img" :src="replaceImgUrl(playImg)" alt="" />
    </div>
    <a-modal v-model:visible="visible" class="q9-detail-modal" :footer="null" @cancel="handleCloseVideoModal">
      <video
        ref="modalVideo"
        src="https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/0330_X7_v1_1920_1080_482f7dc9ae.mp4?updated_at=2023-03-30T04:07:09.590Z"
        muted
        loop
        controls
      ></video>
    </a-modal>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner1 = ref()
const titleContainer = ref()
const videoImg = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/101_7b2fb2bcde.png?updated_at=2023-03-28T05:20:11.089Z')
const playImg = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_f522109bad.png?updated_at=2023-03-28T08:47:23.571Z')
const visible = ref(false)
const modalVideo = ref()
useChangeOpacity(banner1, [titleContainer], 'banner1-animation', false)

const handleOpenVideoModal = async () => {
  visible.value = true
  await nextTick()
  modalVideo.value.play()
}

// 关闭视频弹框 暂停视频
const handleCloseVideoModal = () => {
  modalVideo.value.pause()
}
</script>
<style lang="less">
.banner-1-mob {
  width: 100%;
  height: 342mpxvw;
  background-color: #000;
  text-align: center;

  .title-container {
    .title {
      font-size: 24mpxvw;
      color: #63b03b;
      line-height: 24mpxvw;
      padding: 25mpxvw 0 0;
    }

    .subTitle {
      font-size: 14mpxvw;
      color: #ffffff;
      line-height: 18mpxvw;
      margin-top: 11mpxvw;
    }
  }

  .video-bg {
    position: relative;
    width: 100%;
    margin: 19mpxvw 0 0;

    .bg-img {
      width: 100%;
    }

    .play-img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 42mpxvw;
      height: 42mpxvw;
    }
  }

  .banner1-animation {
    animation: opacityBanner1 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner1 {
    0% {
      opacity: 0;
      position: relative;
      top: 50mpxvw;
    }
    100% {
      opacity: 1;
      position: relative;
      top: 0;
    }
  }
}

.q9-detail-modal {
  max-width: 100% !important;
  width: 100% !important;
  height: 100vh;
  padding-bottom: 0;
  top: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    background: #000;

    .ant-modal-body {
      width: 100%;
      height: 100%;

      video {
        position: absolute;
        top: 30%;
        left: 0;
        width: 100vw;
        height: 56.25vw;
      }
    }

    .ant-modal-close {
      background-color: #6b6b6b;
      border-radius: 100%;
      opacity: 0.5;
      width: 32mpxvw;
      height: 32mpxvw;
      top: 20mpxvw;
      right: 20mpxvw;

      .ant-modal-close-x {
        line-height: 32mpxvw;
        width: 32mpxvw;
        height: 32mpxvw;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 16mpxvw;
          height: 16mpxvw;
          color: #fff;
        }
      }
    }
  }
}
</style>
