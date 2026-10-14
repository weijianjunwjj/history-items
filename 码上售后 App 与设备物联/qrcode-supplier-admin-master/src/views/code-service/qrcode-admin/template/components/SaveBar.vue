<template>
  <div v-if="changed" class="foot-bar">
    <a-button
      type="primary"
      class="a-button a-button--primary"
      @click="$emit('save')"
    >
      <span>保存编辑</span>
    </a-button>
    <a-button
      type="secondary"
      class="a-button a-button--info ml-2"
      @click="$emit('reset')"
    >
      <span>还原编辑</span>
    </a-button>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SaveBar',
    props: ['changed'],
  }
</script>

<style scoped>
  .foot-bar {
    position: fixed;
    z-index: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 14px 270px 14px 290px;
    text-align: center;
    background: #fff;
    -webkit-box-shadow: 0 -5px 10px hsl(0deg 0% 61% / 10%);
    box-shadow: 0 -5px 10px hsl(0deg 0% 61% / 10%);
    height: 60px;
  }
</style>
