<!--
 * @Author: yqq
 * @Date: 2023-01-04 14:21:56
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-23 13:56:23
 * @FilePath: \yadea-website\layouts\mobile.vue
 * @Description: 
 * 
-->
<template>
  <div class="m-layout">
    <MobileHeader />
    <slot />
    <LazyMobileFooter v-if="isShowFooter" />
  </div>
</template>

<script setup>
const { useHomePageStore } = store

const homePageStore = useHomePageStore()

const isShowFooter = computed(() => {
  return homePageStore.isShowFooter
})

const router = useRouter()

onBeforeMount(async () => {
  await nextTick()
  // isShowHeader = true
})

// 监听骑行注册路由
// router.beforeEach((to, from, next) => {
//   console.log('to :>> ', to)
//   if (to.path === '/mob/booking-ride') {
//     window.location.href = 'https://m.op.yadea.com.cn/s/HfCVa5vKv'
//   } else {
//     next()
//   }
// })
// watch(
//   () => router.currentRoute.value.path,

//   newPath => {
//     if (newPath === '/mob/booking-ride') {
//       window.location.href = 'https://m.op.yadea.com.cn/s/HfCVa5vKv'
//     }
//   },

//   { immediate: true, deep: true }
// )

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    store.useHomePageStore().saveData({ isShowFooter: true })
  }, 200)
})
</script>

<style>
.m-layout {
  width: 100%;
}
</style>
