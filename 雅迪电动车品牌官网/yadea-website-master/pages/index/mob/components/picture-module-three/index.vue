<!--
 * @Author: yqq
 * @Date: 2023-03-07 16:12:56
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-08 17:39:41
 * @FilePath: \yadea-website\pages\index\mob\components\picture-module-three\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="beautiful-travel-box">
    <div class="title fs-18-mvw fw-500 txt-c">{{ mod.data.desc1 }}</div>
    <div class="title fs-12-mvw mt-1-mvw txt-c">{{ mod.data.desc2 }}</div>
    <div class="txt-c mt-4-mvw">
      <!-- <img :src="replaceImgUrl(mod.data.bgImage)" alt="" @click="handleGoUrl(mod.data.picUrl)" /> -->
      <MobileDisplay
        :url="replaceImgUrl(mod.data.bgImage)"
        :pic="replaceImgUrl(mod.data.mobileMidPic.data[0].attributes.url)"
        @click="handleGoUrl(mod.data.picUrl)"
      ></MobileDisplay>
    </div>
    <div class="module-three-items">
      <div class="module-three-item mt-4-mvw">
        <div class="item-title txt-c fs-12-mvw fw-500">{{ mod.data.bottomDesc1 }}</div>
        <div class="item-desc txt-c fs-12-mvw mt-1-vw">{{ mod.data.bottomDesc2 }}</div>
      </div>
      <div class="module-three-item mt-4-mvw">
        <div class="item-title txt-c fs-12-mvw fw-500">{{ mod.data.bottomDesc3 }}</div>
        <div class="item-desc txt-c fs-12-mvw mt-1-vw">{{ mod.data.bottomDesc4 }}</div>
      </div>
      <div class="module-three-item mt-4-mvw">
        <div class="item-title txt-c fs-12-mvw fw-500">{{ mod.data.bottomDesc5 }}</div>
        <div class="item-desc txt-c fs-12-mvw mt-1-vw">{{ mod.data.bottomDesc6 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: []
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
.beautiful-travel-box {
  padding: 40mpxvw 22mpxvw 60mpxvw;

  .title {
    color: #212121;
  }

  img {
    width: 320mpxvw;
    height: 200mpxvw;
    object-fit: cover;
    object-position: center;
  }

  .item-title {
    color: #212121;
  }

  .item-desc {
    color: #666;
    width: 252mpxvw;
    margin: 0 auto;
  }
}
</style>
