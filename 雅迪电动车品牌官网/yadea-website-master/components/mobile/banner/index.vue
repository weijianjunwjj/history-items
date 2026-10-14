<!--
 * @Author: weijianjun
 * @Date: 2023-02-21 10:40:42
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 13:35:38
 * @FilePath: \website\components\mobile\banner\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="mobile-banner pos-rel" :style="`background-image:url(${img})`">
    <div class="txt-c text pos-middle-v fw-500 ml-4-mvw">{{ title }}</div>
  </div>
</template>

<script setup>
// ---data---

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  }
})

const img = computed(() => {
  return props.img
})

// ---function---
</script>

<style lang="less">
.mobile-banner {
  height: 220mpxvw;
  background-repeat: no-repeat;
  background-size: contain;
  .text {
    .m-fs(24);
    // font-family: Source Han Sans SC-Bold, Source Han Sans SC;
    color: #ffffff;
  }
}
</style>
