<template>
  <!-- 二级路由 -->
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <suspense>
        <template #default>
          <!-- 不要缓存 -->
          <component
            :is="Component"
            v-if="route.meta.ignoreCache"
            :key="route.fullPath"
          />
          <!-- 要缓存 -->
          <keep-alive v-else :include="cacheList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </template>
        <template #fallback> <div> Loading... </div> </template>
      </suspense>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useTabBarStore } from '@/store'

  const tabBarStore = useTabBarStore()

  const cacheList = computed(() => tabBarStore.getCacheList)
</script>

<style scoped lang="less"></style>
