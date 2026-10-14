<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade">
        <a-carousel-item v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div>
            <img class="carousel-image" :src="item.image" />
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import bannerImage1 from '@/assets/images/login/banner1.png'
  import bannerImage2 from '@/assets/images/login/banner2.png'
  import bannerImage3 from '@/assets/images/login/banner3.png'

  const { t } = useI18n()
  const carouselItem = computed(() => [
    {
      slogan: '无需加微信好友，3秒钟一键视频报修',
      subSlogan: '基于一物一码平台，客服随时掌握报修设备信息及其维修记录',
      image: bannerImage1,
    },
    {
      slogan: '解决“报修人不是设备故障现场使用人”的困境',
      subSlogan: '客服与设备使用人直接对话，更快掌握设备故障原因',
      image: bannerImage2,
    },
    {
      slogan: '视频通话实时云端录制，可随时回看',
      subSlogan: '通话双方视频全量录制，避免遗忘沟通内容',
      image: bannerImage3,
    },
  ])
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: var(--color-fill-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      color: var(--color-text-3);
      font-size: 14px;
      line-height: 22px;
    }

    &-image {
      width: 320px;
      margin-top: 30px;
    }
  }
</style>
