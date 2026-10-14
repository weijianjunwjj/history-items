<template>
  <div ref="banner1" class="banner-1">
    <video
      :src="
        replaceImgUrl(
          'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/0330_X7_v1_1920_1080_482f7dc9ae.mp4?updated_at=2023-03-30T04:07:09.590Z'
        )
      "
      muted
      autoplay
      loop
    ></video>
    <div ref="titleContainer" class="title-container">
      <div class="title HYQiHei-bold">性能狠角色 硬核出道</div>
      <div class="subTitle HYQiHei">X, 进化无止境<br />天生骄傲的澎湃动力<br />机能型格，呼啸而来</div>
    </div>

    <div class="view-video-button" @click="handleOpenVideoModal">
      <img class="play-icon" src="@/assets/images/model-details/x7/play-icon.png" alt="" />
      <span class="button-title HYQiHei">观看完整影片</span>
    </div>
    <a-modal v-model:visible="visible" class="q9-detail-modal" :footer="null" @cancel="handleCloseVideoModal">
      <video
        ref="modalVideo"
        :src="
          replaceImgUrl(
            'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/0330_X7_v1_1920_1080_482f7dc9ae.mp4?updated_at=2023-03-30T04:07:09.590Z'
          )
        "
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
const modalVideo = ref()
const visible = ref(false)

useChangeOpacity(banner1, [titleContainer], 'testClass', false)

// 打开视频弹框 播放视频
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
.banner-1 {
  position: relative;
  width: 100%;
  height: 955pxvw;
  text-align: center;

  video {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .title-container {
    position: absolute;
    top: 320pxvw;
    left: 0;
    right: 0;
    margin: 0 auto;

    .title {
      font-size: 55pxvw;
      color: #63b03b;
    }

    .subTitle {
      font-size: 30pxvw;
      color: #ffffff;
    }
  }

  .view-video-button {
    position: absolute;
    display: flex;
    bottom: 109pxvw;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 201pxvw;
    height: 45pxvw;
    border: 2px solid #63b03b;
    border-radius: 22pxvw;
    background-color: transparent;
    align-items: center;
    cursor: pointer;

    .play-icon {
      display: inline-block;
      width: 19pxvw;
      height: 19pxvw;
      margin-left: 29pxvw;
    }

    .button-title {
      font-size: 18pxvw;
      color: #63b03b;
      margin-left: 11pxvw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .testClass {
    animation: opacityBanner1 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner1 {
    0% {
      opacity: 0;
      top: 500px;
    }
    100% {
      opacity: 1;
      top: 320pxvw;
    }
  }
}

.q9-detail-modal {
  max-width: 100% !important;
  width: 100% !important;
  height: 100vh;
  top: 0;
  padding-bottom: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    background: #000;

    .ant-modal-body {
      width: 100%;
      height: 100%;

      video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
    }

    .ant-modal-close {
      background-color: #6b6b6b;
      border-radius: 100%;
      opacity: 0.5;
      width: 50pxvw;
      height: 50pxvw;
      top: 20pxvw;
      right: 20pxvw;

      .ant-modal-close-x {
        width: 50pxvw;
        height: 50pxvw;
        line-height: 50pxvw;

        svg {
          color: #fff;
        }
      }
    }
  }
}
</style>
