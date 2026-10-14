<template>
  <view class="container">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  onLoad(options) {
    // 获取传入的 URL 并解码
    this.url = decodeURIComponent(options.url)
    console.log(' this.url', this.url)
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
