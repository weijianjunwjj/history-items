<!--
 * @Author: weijianjun
 * @Date: 2023-02-13 14:52:47
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 13:55:52
 * @FilePath: \website\pages\index\mob\add-us\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="m-page-add-us-box m-page-pt">
    <div class="add-us-banner1">
      <!-- <video
        src="https://osswebsite.yadea.com.cn/homevideo_c45e60e2a9_f572bd81fe.mp4?updated_at=2023-03-16T03:14:19.821Z"
        autoplay="autoplay"
        muted
        preload
        loop
      ></video> -->
      <img src="https://osswebsite.yadea.com.cn/WX_20230328_193256_2x_c1e5b237da.png?updated_at=2023-03-28T11:35:25.483Z" alt="" />
      <div class="title fs-56-vw txt-white txt-c">望远镜最远看到137亿光年<br />而你的潜力，测算不完，心里有光，就努力发光</div>
      <div class="btn-box">
        <MobileButton class-name="fs-18-vw mr-5" type="ghost" href="https://app.mokahr.com/apply/yadea/26984#/" :open-window="true">
          社会招聘
        </MobileButton>
        <MobileButton class-name="fs-18-vw" type="ghost" href="https://app.mokahr.com/campus_apply/yadea/26985#/" :open-window="true">
          校园招聘
        </MobileButton>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '加入雅迪,雅迪招聘' },
    {
      name: 'description',
      content: '我们愿与这世界上独一无二的你,一起创造无限可能,本页面提供雅迪招聘等信息,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less" scoped>
.m-page-add-us-box {
  @h: 580mpxvw;
  .add-us-banner1 {
    width: 100%;
    height: @h;
    padding-top: 300pxvw;
    text-align: center;
    position: relative;

    .title {
      font-size: 24mpxvw;
      // font-family: Source Han Sans SC-Bold, Source Han Sans SC;
      font-weight: bold;
      color: #ffffff;
      padding-top: 176mpxvw;
    }

    video,
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: @h;
      object-fit: cover;
      object-position: center center;
      z-index: -1;
    }

    .btn-box {
      margin-top: 34mpxvw;
      :deep(button) {
        width: 152mpxvw !important;
        height: 46mpxvw !important;
        border-radius: 4px;
      }
    }

    .link {
      &:hover {
        color: #fff;
      }

      svg {
        width: 15pxvw;
        height: 15pxvw;
      }
    }
  }
}
</style>
