<template>
  <div ref="banner" class="page-model-details-modern-banner2 pos-rel">
    <video
      class="v1 full-w"
      :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/16_9_1_e44968eaa7.mp4?updated_at=2023-03-29T14:18:22.774Z')"
      muted
      autoplay
      loop
    ></video>

    <div ref="banner2" class="modern-banner2 pos-middle-h">
      <div class="banner2-txt1">复古摩登 超级好看</div>
      <div class="banner2-txt2">复古时髦精登场，任谁都无法视而不见</div>
      <div class="banner2-txt3 cur-point" @click="openModal">
        <img src="@/assets/images/model-details/modern/play.png" alt="" /> 观看影片
      </div>
    </div>
  </div>

  <client-only>
    <a-modal v-model:visible="visible" class="modal-play-box" :footer="false" @cancel="handleCloseVideoModal">
      <video
        ref="modalVideo"
        class="video"
        controls
        autoplay
        :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/16_9_1_e44968eaa7.mp4?updated_at=2023-03-29T14:18:22.774Z')"
      ></video>
    </a-modal>
  </client-only>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner = ref()
const banner2 = ref()
useChangeOpacity(banner, [banner2], 'banner2-animation', false)

const visible = $ref(false)
const modalVideo = $ref()

async function openModal() {
  visible = true
  await nextTick()
  modalVideo.play()
}

// 关闭视频弹框 暂停视频
const handleCloseVideoModal = () => {
  modalVideo.pause()
}
</script>

<style lang="less">
.page-model-details-modern-banner2 {
  height: 1001pxvw;
  margin: -3px 0;
  overflow: hidden;
  .txt-c;
  color: #fff;

  .v1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
  }

  .banner2-txt1 {
    .fs(80);
  }
  .banner2-txt2 {
    .fs(30);
    .mt(36);
    .mb(74);
  }
  .banner2-txt3 {
    .fs(25);
    img {
      .w(34);
      .h(35);
    }
  }

  .modern-banner2 {
    top: 17.9688%;
  }

  .banner2-animation {
    animation: opacityBanner22 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner22 {
    0% {
      opacity: 0;
      top: 23%;
    }
    100% {
      opacity: 1;
      top: 17.9688%;
    }
  }
}

.modal-play-box {
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
