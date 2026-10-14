<template>
  <div class="page-model-details-modern-banner7 pos-rel">
    <div class="banner7-content">
      <div class="banner7-content-row1">
        <div class="img img1"><img class="full" src="@/assets/images/model-details/modern/banner7-1.png" alt="" /></div>
        <div class="img img2"><img class="full" src="@/assets/images/model-details/modern/banner7-2.png" alt="" /></div>
      </div>
      <div class="banner7-content-row2">
        <div class="img img3"><img class="full" src="@/assets/images/model-details/modern/banner7-3.png" alt="" /></div>
        <div class="img img4"><img class="full" src="@/assets/images/model-details/modern/banner7-4.png" alt="" /></div>
        <div class="img img5"><img class="full" src="@/assets/images/model-details/modern/banner7-5.png" alt="" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ---data---

// ---function---
</script>

<style lang="less">
.page-model-details-modern-banner7 {
  padding-top: 137pxvw;
  padding-bottom: 121pxvw;
  .txt-c;
  .banner7-content {
    &-row1,
    &-row2 {
      display: flex;
      justify-content: center;
    }

    .img {
      overflow: hidden;
      position: relative;
      border-radius: 27px;
    }
    img:hover {
      transition: 1000ms;
      transform: scale(1.2);
    }
    .img1 {
      width: 825pxvw;
      height: 401pxvw;
      margin-right: 20pxvw;
      margin-bottom: 19pxvw;
    }
    .img2 {
      width: 575pxvw;
      height: 401pxvw;
      margin-bottom: 19pxvw;
    }
    .img3,
    .img4 {
      margin-right: 20pxvw;
    }
    .img3,
    .img4,
    .img5 {
      width: 460pxvw;
      height: 401pxvw;
    }
  }
}
</style>
