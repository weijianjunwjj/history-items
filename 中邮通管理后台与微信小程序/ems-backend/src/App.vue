<template>
  <AppProvider :theme-overrides="themeOverrides">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/common/AppProvider.vue'

/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const primaryColor = '#1FA88C'
const themeOverrides = {
  common: {
    primaryColor,
    primaryColorHover: primaryColor,
    primaryColorPressed: primaryColor,
    primaryColorSuppl: primaryColor,
    nColor: primaryColor,
  },
  button: {
    nColor: primaryColor,
  },
  // Select: {
  //   peers: {
  //     InternalSelection: {
  //       textColor: '#FF0000',
  //     },
  //   },
  // },
  // ...
}
</script>
