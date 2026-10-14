<template>
  <div class="page-model-details-modern-banner1 pos-rel">
    <div class="content pos-middle-h txt-c" :class="show && 'banner1-animation'">
      <div class="txt1"><span class="fw-600">雅迪冠能</span> 摩登</div>
      <div class="txt2">超长续航 超级好看</div>
      <div class="txt3">女王复古美学｜UX女王优享工艺｜国际领先TTFAR电机</div>
    </div>
  </div>
</template>

<script setup>
const show = $ref(false)

onBeforeMount(() => {
  show = true
})
</script>

<style lang="less">
.page-model-details-modern-banner1 {
  height: 1080pxvw;
  background-image: url('@/assets/images/model-details/modern/banner1.png');
  background-size: contain;
  .banner1-animation {
    animation: opacityBanner12 1s ease-in-out 0s 1;
  }

  @keyframes opacityBanner12 {
    0% {
      opacity: 0;
      top: 11.84375vw;
    }
    100% {
      opacity: 1;
      top: 9.84375vw;
    }
  }
  .content {
    top: 9.84375vw;
    color: #202a25;
    .txt1 {
      font-size: 66pxvw;
    }
    .txt2 {
      font-size: 32pxvw;
      .mt(1);
      .mb(24);
    }
    .txt3 {
      font-size: 18pxvw;
    }
  }
}
</style>
