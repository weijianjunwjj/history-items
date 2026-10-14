<template>
  <view :class="`my-card ${className}`" :style="style"><slot /></view>
</template>

<script setup>
// ---data---

defineProps({
  style: {
    type:Object,
    default:()=>{
      return {}
    }
  },
  className: String,
})

// ---function---
</script>

<style lang="scss">
.my-card {
  width: auto;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  min-height: 94rpx;
  padding: 30rpx;
  box-sizing: border-box;
}
</style>
