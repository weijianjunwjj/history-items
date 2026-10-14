<template>
  <view class="my-title flex-sb-c plr-6" :style="style">
    <view class="w-l txt-l">
      <image :src="img" style="width: 20rpx; height: 36rpx" @click="onBack" />
    </view>
    <view class="w-c txt-c">
      <view :style="`color:${!white && '#000'}`" class="flex-1 txt-c ellipsis">
        {{ text }}
      </view>
    </view>
    <view class="w-r txt-r">
      <slot ></slot>
      <!-- <slot name="suffix" v-if="hasSuffix"></slot>
      <view class="hide" v-else>占位</view> -->
    </view>
  </view>
</template>

<script setup>
import whiteArrow from '../../static/images/components/left-arrow-white.png'
import blackArrow from '../../static/images/components/left-arrow-black.png'

const props = defineProps({
  text: {
    type: String,
    default: '标题',
  },
  white: {
    type: Boolean,
    default: true,
  },
  style: String,
})

const img = computed(() => {
  return props.white ? whiteArrow : blackArrow
})

// 获取当前组件的插槽对象
const slots = useSlots()

// 判断是否传入了具名插槽
const hasSuffix = !!slots.suffix

function onBack() {
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<style lang="scss">
.my-title {
  position: sticky;
  top: 0;
  z-index: 1998;
  height: 44px;
  padding-top: var(--status-bar-height);
  text-align: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  .w33{
    width: 33.3333333%;
  }
  .w-l{
    width: 20%;
  }
  .w-c{
    width: 60%;
  }
  .w-r{
    width: 20%;
  }
  .txt-c {
    font-weight: 500;
  }
}
</style>
