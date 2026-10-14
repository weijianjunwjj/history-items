<template>
  <div class="m-page-model-details-modern-banner1 pos-rel txt-c">
    <div class="content pos-middle-h txt-c full-w" :class="show && 'banner1-animation'">
      <div class="txt1"><span>雅迪冠能</span> 摩登</div>
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
.m-page-model-details-modern-banner1 {
  height: 667mpxvw;
  background-image: url('@/assets/images/mobile/model-details/modern/banner1.png');
  background-size: contain;
  .banner1-animation {
    animation: opacityBanner12m 1s ease-in-out 0s 1;
  }

  .content {
    top: 35.2vw;
  }

  @keyframes opacityBanner12m {
    0% {
      opacity: 0;
      top: 38.2vw;
    }
    100% {
      opacity: 1;
      top: 35.2vw;
    }
  }
  img {
    width: 274mpxvw;
    height: 85mpxvw;
  }

  .txt1 {
    font-size: 24mpxvw;
    & > span {
      font-weight: bold;
    }
    line-height: 1;
  }
  .txt2 {
    font-size: 16mpxvw;
    .m-mtb(14);
    font-weight: bold;
  }
  .txt3 {
    font-size: 8mpxvw;
  }
}
</style>
