<template>
  <div class="mini-app-bar">
    <slot name="title">
      <span :style="{ color: color, fontSize: size }">{{ title }}</span>
    </slot>
    <div class="mpBar"></div>
  </div>
</template>

<script>
  export default {
    name: 'MiniApp',
    props: ['title', 'color', 'size'],
  }
</script>

<style scoped>
  .mini-app-bar {
    padding: 0 20px;
    height: 32px;
    line-height: 32px;

    display: flex;
    justify-content: space-between;

    color: #fff;
    font-size: 20px;
  }

  .mpBar {
    width: 87px;
    height: 32px;
    background: url(../assets/mpBar.png) 100% no-repeat;
  }
</style>
