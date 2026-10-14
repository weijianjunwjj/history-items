<!--
 * @Author: weijianjun
 * @Date: 2023-01-13 16:28:12
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-03 20:37:55
 * @FilePath: \yadea-website\pages\error\404.vue
 * @Description: 
 * 
-->

<template>
  <div class="app-error full-vh">
    <client-only>
      <a-result class="pos-center" status="404" title="404" sub-title="抱歉，您访问的页面不存在。">
        <template #extra>
          <nuxt-link :to="root">
            <a-button type="primary">回到首页</a-button>
          </nuxt-link>
        </template>
      </a-result>
    </client-only>
  </div>
</template>


<script setup>
const root = $ref('/')
onMounted(() => {
  const isMobile = store.useIsSafari().$state.isMobile
  if (isMobile) {
    root = '/mob'
  }
})
</script>

<style lang="less" scoped>
.app-error {
  // margin-top: @layout-header-height;
}
</style>
