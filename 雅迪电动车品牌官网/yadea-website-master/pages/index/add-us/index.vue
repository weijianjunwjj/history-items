<!--
 * @Author: yqq
 * @Date: 2023-01-29 16:09:03
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-02 19:39:42
 * @FilePath: \yadea-website\pages\index\add-us\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="add-us-box">
    <div class="add-us-banner1">
      <video
        src="https://osswebsite.yadea.com.cn/homevideo_c45e60e2a9_7581371221.mp4?updated_at=2023-03-16T03:11:34.178Z"
        autoplay="autoplay"
        muted
        preload
        loop
      ></video>
      <div class="title fs-56-vw fw-600 txt-white txt-c">望远镜最远看到137亿光年<br />而你的潜力，测算不完，心里有光，就努力发光</div>
      <div class="btn-box">
        <MyButton class-name="fs-18-vw mr-5" type="ghost2" href="https://app.mokahr.com/apply/yadea/26984#/" :open-window="true">
          社会招聘
        </MyButton>
        <MyButton class-name="fs-18-vw" type="ghost2" href="https://app.mokahr.com/campus_apply/yadea/26985#/" :open-window="true">
          校园招聘
        </MyButton>
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
</script>

<style lang="less" scoped>
.add-us-box {
  padding-top: @layout-header-height;

  .add-us-banner1 {
    width: 100%;
    height: 1000pxvw;
    padding-top: 300pxvw;
    text-align: center;
    position: relative;
    margin-bottom: -1px;
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      z-index: -1;
    }

    .btn-box {
      margin-top: 64pxvw;
      :deep(button) {
        width: 216pxvw !important;
        height: 62pxvw !important;
        max-width: 216pxvw !important;
        max-height: 62pxvw !important;
        border-radius: 4pxvw;
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
