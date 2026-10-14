<template>
  <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
    <n-grid-item span="24 m:24 l:24">
      <n-space :wrap-item="false">
        <n-card v-if="slots.searchForm" content-style="padding: 15px;">
          <slot name="searchForm" />
        </n-card>
        <n-card content-style="padding: 15px;">
          <div v-if="slots.btnBar" class="btn-bar">
            <slot name="btnBar" />
          </div>
          <slot />
        </n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style lang="less" scoped>
.btn-bar {
  margin-bottom: 12px;
}
</style>
