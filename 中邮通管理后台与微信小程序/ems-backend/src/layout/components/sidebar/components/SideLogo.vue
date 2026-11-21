<template>
  <router-link h-60 f-c-c to="/">
    <img v-show="!appStore.collapsed" src="../../../../../public/logo.webp" height="42" style="padding: 5px;" />
    <img v-show="appStore.collapsed" src="../../../../../public/favicon.png" height="42" style="padding: 5px;" title="逍遥邮" />

  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

