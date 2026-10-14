<template>
  <div
    :style="{ height: safeAreaInsets?.top + 'px', background: isScroll ? '#00dba1' : '' }"
    class="headerbar"
  >
  <div style="opacity: 0;">
    1
  </div>
  </div>
  <div class="SearchBar flex-sb-c pr-6" :class="isScroll && 'scrolled'">
    <view style="width: 100%" class="rel">
      <wd-search
        v-model="value"
        @focus="focus"
        @blur="blur"
        @search="onSearch"
        @change="change"
        :disabled="true"
        custom-class="my-search"
        placeholder="Search for what you want"
        placeholder-left
        light
        hide-cancel
        :style="`
          width: calc(100% - 52rpx);
          height: 60rpx;
          padding-right: 32rpx;
          background-color: #fff;
          `"
      ></wd-search>
      <view
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
        @click="onClick"
      ></view>
    </view>

    <image
      v-show="!isScroll"
      src="../../../static/images/index/outline.png"
      style="width: 52rpx; height: 52rpx"
      @click.stop="showFilterPopup"
    />
    <image
      v-show="isScroll"
      src="../../../static/images/index/outline2.png"
      style="width: 52rpx; height: 52rpx"
      @click.stop="showFilterPopup"
    />
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash'

const value = ref<string>('')
const { safeAreaInsets } = uni.getSystemInfoSync()
const isScroll = ref(false)
defineProps({
  search: {
    type: Object,
    default: () => {
      return {
        noSearch: true,
        awaitSearch: false,
        searched: false,
      }
    },
  },
})

const emit = defineEmits(['click','showFilterPopup','focus','blur','search','change'])

onPageScroll(
  throttle((opt): any => {
    if (opt.scrollTop > 0) {
      isScroll.value = true
    } else {
      isScroll.value = false
    }
  }, 500),
)

function showFilterPopup(e) {
  emit('showFilterPopup')
}

function focus() {
  console.log('聚焦')
  emit('focus')
}
function blur() {
  console.log('失焦')
  emit('blur')
}
function onSearch() {
  console.log('搜索')
  emit('search')
}
function change({ value }) {
  console.log('输入', value)
  emit('change', value)
}
function onClick() {
  console.log('{ onClick }')
  emit('click')
}
</script>

<style lang="scss">
.scrolled {
  background: #00dba1;
}
.headerbar{
  position: sticky;
  top: 0;
  z-index: 1998;
}
.SearchBar {
  position: sticky;
  top: var(--status-bar-height);
  z-index: 999;
  .wd-search {
    background: none !important;
    .wd-search__input {
      border-radius: 32rpx 32rpx 32rpx 32rpx !important;
      border: 2rpx solid #959595 !important;
    }
  }
}
</style>
