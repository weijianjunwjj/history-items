<template>
  <div class="flex justify-center mt-20">
    <!-- <div class="flex-c mr-20">总数：{{ pagination0.itemCount }}</div> -->
    <n-pagination
      v-model:page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :item-count="pagination.itemCount"
      show-size-picker
      :page-sizes="[10, 20, 30, 40, 100]"
      :on-update:page="pagination.onChange"
      :on-update:page-size="pagination.onUpdatePageSize"
    >
    <template #prefix>
      总数：{{ pagination.itemCount || 0 }} 条
    </template>
    </n-pagination>
  </div>
</template>

<script setup>
// ---data---

const props = defineProps({
  modelValue: {},
})

const emit = defineEmits(['update:modelValue'])
const pagination = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  }
})

// ---function---
</script>

<style lang="less"></style>
