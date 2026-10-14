<template>
  <div ref="banner" class="m-page-model-details-modern-banner2 pos-rel">
    <div ref="banner2" class="modern-banner2 pos-middle-h">
      <div class="banner2-txt1">复古摩登<br />超级好看</div>
      <div class="banner2-txt2">复古时髦精登场，任谁都无法视而不见</div>
      <div class="banner2-txt3 cur-point" @click="openModal">
        <img src="@/assets/images/mobile/model-details/modern/play.png" alt="" /> 观看影片
      </div>
    </div>
  </div>

  <client-only>
    <a-modal v-model:visible="visible" class="modern-detail-modal" :footer="false" @cancel="handleCloseVideoModal">
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
.m-page-model-details-modern-banner2 {
  width: 100%;
  height: 667mpxvw;
  background-image: url('@/assets/images/mobile/model-details/modern/banner2.png');
  background-repeat: no-repeat;
  background-size: contain;
  .txt-c;
  color: #fff;

  .modern-banner2 {
  }
  .banner2-txt1 {
    .m-fs(24);
    width: 63.333333vw;
    margin: auto;
  }
  .banner2-txt2 {
    width: 90vw;
    .m-fs(17);
    .m-mt(40);
    .m-mb(56);
  }
  .banner2-txt3 {
    .m-fs(17);
    img {
      display: inline-block;
      .m-w(24);
      .m-h(24);
    }
  }

  .modern-banner2 {
    top: 17.9688%;
  }

  .banner2-animation {
    animation: opacityBanner22m 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner22m {
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

.modern-detail-modal {
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
