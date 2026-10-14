<template>
  <!-- 当数据为空时 -->
  <view class="empty-component" v-if="show">
    <image class="empty-image" src="../../static/images/common/empty.png" mode="widthFix" />
    <view class="empty-text">{{ text || defaultText }}</view>
  </view>
</template>

<script setup>
const show = ref(false)

// 延迟加载空组件，是为了优化页面闪烁问题(一开始没数据展示空组件，在1秒内拿到数据，又展示列表，从而导致的闪烁问题)
setTimeout(() => {
  show.value = true
}, 500)

const defaultText = 'No data available at the moment'

defineProps({
  text: {
    type: String,
    default: defaultText,
  },
})
</script>

<style lang="scss">
.empty-component {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .empty-image {
    width: 418rpx;
    margin-top: 100rpx;
  }
  .empty-text {
    width: 100%;
    text-align: center;
    font-size: 26rpx;
    color: #404040;
    margin-top: 40rpx;
    margin-bottom: 120rpx;
  }
}
</style>
