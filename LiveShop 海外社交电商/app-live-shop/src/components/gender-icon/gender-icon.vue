<template>
  <view class="gender-icon">
    <image
      v-if="gender == 1"
      src="../../static/images/index/man.png"
      style="width: 44rpx; height: 44rpx"
    />
    <image v-else src="../../static/images/index/woman.png" style="width: 44rpx; height: 44rpx" />
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const props = defineProps({
  gender: Number,
})

const userStore = useUserStore()
const gender = ref(props.gender ?? userStore.userInfo.gender) // 初始化 gender

// 监听 props.gender 的变化
watch(
  () => props.gender,
  (newVal) => {
    console.log('props.gender--------------', newVal)
    gender.value = newVal ?? userStore.userInfo.gender
  },
)
</script>

<style lang="scss" scoped>
.gender-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 43rpx;
  height: 43rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
}
</style>
