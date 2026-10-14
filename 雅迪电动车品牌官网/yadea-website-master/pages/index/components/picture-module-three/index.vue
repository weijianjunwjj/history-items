<!--
 * @Author: yqq
 * @Date: 2023-03-06 17:14:29
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-08 17:22:52
 * @FilePath: \yadea-website\pages\index\components\picture-module-three\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="picture-module-three">
    <div class="title txt-c fs-40-vw">
      {{ mod.data.desc1 }}
    </div>
    <div class="desc txt-c fs-20-vw mt-3-vw">{{ mod.data.desc2 }}</div>
    <div class="txt-c">
      <!-- <img :src="replaceImgUrl(mod.data.bgImage)" alt="" @click="handleGoUrl(mod.data.picUrl)" /> -->
      <MyDisplay :url="replaceImgUrl(mod.data.bgImage)" :is-play="true" @click="handleGoUrl(mod.data.picUrl)"></MyDisplay>
    </div>
    <div class="module-three-items">
      <div class="module-three-item">
        <div class="item-title fs-32-vw fw-500">{{ mod.data.bottomDesc1 }}</div>
        <div class="item-desc fs-18-vw mt-2-vw">{{ mod.data.bottomDesc2 }}</div>
      </div>
      <div class="module-three-item">
        <div class="item-title fs-32-vw fw-500">{{ mod.data.bottomDesc3 }}</div>
        <div class="item-desc fs-18-vw mt-2-vw">{{ mod.data.bottomDesc4 }}</div>
      </div>
      <div class="module-three-item">
        <div class="item-title fs-32-vw fw-500">{{ mod.data.bottomDesc5 }}</div>
        <div class="item-desc fs-18-vw mt-2-vw">{{ mod.data.bottomDesc6 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: {}
      }
    }
  }
})

const handleGoUrl = url => {
  if (url) {
    const router = useRouter()
    router.push(url)
  }
}
</script>

<style lang="less">
.picture-module-three {
  .title {
    margin-top: 100pxvw;
  }

  img,
  video {
    width: 1400pxvw !important;
    height: 745pxvw !important;
    object-fit: cover;
    object-position: center;
    margin: 40pxvw auto 0;
  }

  .module-three-items {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 1400pxvw;
    margin: 0 auto 120pxvw;

    .module-three-item {
      width: 380pxvw;
      margin-top: 30pxvw;

      .item-title {
        .fs(22);
      }

      .item-desc {
        .fs(14);
        color: #212121;
      }
    }
  }
}
</style>
