<!--
 * @Author: weijianjun
 * @Date: 2023-01-05 10:17:52
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-07 10:49:21
 * @FilePath: \yadea-website\pages\error\index.vue
 * @Description: 
 * 
-->

<template>
  <clientOnly>
    <div class="app-error">
      <p>{{ error.message }}</p>
      <a @click="handleError">返回首页</a>
    </div>
  </clientOnly>
</template>
<script lang="ts" setup>
/*
 * 接收错误信息
 */
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})
/*
 * 清除错误信息并返回首页
 */
const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
