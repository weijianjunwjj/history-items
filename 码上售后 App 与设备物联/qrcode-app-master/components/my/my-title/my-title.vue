<template>
  <view class="my-title" :class="className">
    <div class="ptb-3 txt-2 fs-16 bold" :class="color">{{ title }}</div>

    <div class="div-border" :class="border"></div>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    border: {
      type: String,
      default: '',
    },
    color:{
      type: String,
      default: '',
    },
	className:{
		type: String,
		default: '',
	}
  },
};
</script>

<style lang="scss" scoped>
.my-title {
}
</style>
