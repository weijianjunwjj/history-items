<template>
  <div class="m-page-model-details-modern-banner7 pos-rel">
    <div class="banner7-content">
      <div class="row1">
        <img
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/12_641ff7cb98.png?updated_at=2023-03-30T03:15:38.283Z')"
          alt=""
        />
      </div>
      <div class="row2 flex-c-sb">
        <img
          :src="
            replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/R11_zuoyi_50c1787959.png?updated_at=2023-03-30T03:15:38.115Z')
          "
          alt=""
        />
        <img
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/10_a539f9e5f5.png?updated_at=2023-03-30T03:15:38.148Z')"
          alt=""
        />
      </div>
      <div class="row3 flex-c-sb">
        <img
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/_4b9c289c2f.png?updated_at=2023-03-30T03:15:38.164Z')"
          alt=""
        />
        <img
          :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/11_4139a5955c.png?updated_at=2023-03-30T03:15:38.088Z')"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// ---data---

// ---function---
</script>

<style lang="less">
.m-page-model-details-modern-banner7 {
  padding-top: 137pxvw;
  padding-bottom: 121pxvw;
  .txt-c;

  .row1 {
    img {
      display: inline-block;
      width: 347mpxvw;
      height: 208mpxvw;
    }
  }

  .row2,
  .row3 {
    margin-top: 14mpxvw;
    img {
      display: inline-block;
      width: 167mpxvw;
      height: 208mpxvw;
    }
  }

  .banner7-content {
    padding: 0 14mpxvw;
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
    // img:hover {
    //   transition: 1000ms;
    //   transform: scale(1.2);
    // }
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
