<template>
  <div class="FilterPopup">
    <wd-popup
      v-model="show"
      position="bottom"
      custom-style="height: 986rpx;border-top-left-radius: 32rpx;border-top-right-radius: 32rpx;"
      closable
      @close="handleClose"
      :z-index=999
    >
      <header class="txt-c ptb-4 fs-32 c-31 fw-800 header-spacing">Filter Criteria</header>

      <main class="mt-8 plr-10">
        <view>
          <view class="title mt-8 mb-6">Gender</view>
          <view class="flex-sb">
            <wd-button
              :plain="curBtn != 1"
              :custom-class="`${curBtn == 1 && 'green-btn'} my-btn`"
              @click="curBtn = 1"
            >
              Men
            </wd-button>
            <wd-button
              :plain="curBtn != 2"
              :custom-class="`${curBtn == 2 && 'green-btn'} my-btn`"
              @click="curBtn = 2"
            >
              Women
            </wd-button>
            <wd-button
              :plain="curBtn != 0"
              :custom-class="`${curBtn == 0 && 'green-btn'} my-btn`"
              @click="curBtn = 0"
            >
              Unlimited
            </wd-button>
          </view>
        </view>
        <view>
          <view class="flex-sb-c mt-8 mb-4">
            <view class="title">Distance</view>
            <view class="value">{{ distance[0] }}km-{{ distance[1] }}km</view>
          </view>

          <wd-slider v-model="distance" :min="0" :max="15" :step="0.5" :activeColor="activeColor" />
        </view>
        <view>
          <view class="flex-sb-c mt-8 mb-4">
            <view class="title">Age</view>
            <view class="value">{{ rangeAge[0] }}-{{ rangeAge[1] }}</view>
          </view>
          <wd-slider v-model="rangeAge" :min="18" :max="55" :activeColor="activeColor" />
        </view>
      </main>

      <footer class="mt-20 mlr-6">
        <wd-button @click="onFilter" style="width: 100%; font-size: 36rpx; font-weight: 400">
          Confirm Selection
        </wd-button>
      </footer>
    </wd-popup>
  </div>
</template>

<script setup lang="ts">
const show = defineModel('show')
const emit = defineEmits()
const curBtn = ref(0)

const activeColor = '#00DBA1'

const distance = ref<number[]>([0, 10])
const rangeAge = ref<number[]>([20, 32])
function handleClose() {
  show.value = false
}

function onFilter() {
  const params = {
    gender: curBtn.value,
    rangeAge: rangeAge.value,
    distance: distance.value,
  }
  emit('filter',params)
}
// ---function---
</script>

<style lang="scss">
.FilterPopup {
  // .wd-button.is-medium{
  //   min-width: auto!important;
  // }

  // .wd-popup-select {
  //   border-top-left-radius: 32rpx !important;
  //   border-top-right-radius: 32rpx !important;
  //   overflow: hidden;
  // }
  .title {
    font-weight: 500;
    font-size: 32rpx;
    color: #313131;
    line-height: 38rpx;
  }
  .value {
    font-weight: 500;
    font-size: 24rpx;
    color: #00dba1;
  }

  // .wd-slider__bar {
  //   height: 16rpx;
  // }
  // .wd-slider__button {
  //   height: 36rpx;
  //   width: 36rpx;
  // }

  .my-btn {
    min-width: auto !important;
    padding-left: 50rpx !important;
    padding-right: 50rpx !important;
  }
  .header-spacing {
    font-weight: 600 !important;
    padding: 40rpx 0 !important;
  }
  :deep(.wd-popup__close) {
    top: 40rpx !important;
    right: 40rpx!important;
  }
  :deep(.wd-slider__label-min) {
    text-align: center !important;
    margin-right: 40rpx !important;
  }
  :deep(.wd-slider__label-max) {
    text-align: center !important;
    margin-left: 40rpx !important;
  }
}
</style>
