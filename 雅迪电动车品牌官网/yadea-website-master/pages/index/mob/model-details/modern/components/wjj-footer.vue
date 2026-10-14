<template>
  <div class="chexinglink wap_bg">
    <div class="con">
      <!-- <a class="gocanshu" :href="p1">详细参数</a> -->
      <a id="phoneBuy" class="buy" style="margin: 0.5rem auto 0" :href="p"
        ><span class="buy-span"><i></i>在线购买</span></a
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  p: {
    type: String,
    default: '#'
  }
})

// ---data---

// ---function---
</script>

<style lang="less" scoped>
.chexinglink {
  width: 100%;
  height: auto;
  background-color: #2d2d2d;
  padding: 80px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chexinglink a.gocanshu {
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  text-align: center;
}
.chexinglink a {
  display: block;
  text-decoration: none !important;
}

.chexinglink a.buy {
  width: 180px;
  height: 48px;
  margin-top: 50px;
  border-radius: 32px;
  border: 2px solid #ec6305;
  font-size: 16px;
  line-height: 44px;
  color: #ec6305;
  text-align: center;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.2);
}
</style>
