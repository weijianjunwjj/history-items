<!--
 * @Author: yqq
 * @Date: 2022-12-16 14:50:18
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-07 21:14:52
 * @FilePath: \yadea-website\layouts\default.vue
 * @Description: 
 * 
-->
<template>
  <div class="layout">
    <MyHeader />
    <slot />
    <MyFooter v-if="isShowFooter" />
  </div>
</template>

<script setup>
const { useHomePageStore } = store

const homePageStore = useHomePageStore()

const isShowFooter = computed(() => {
  return homePageStore.isShowFooter
})

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    store.useHomePageStore().saveData({ isShowFooter: true })
  }, 200)
})
</script>

<style lang="less">
.layout {
  width: 100%;
}
</style>
