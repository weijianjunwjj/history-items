<template>
  <div class="pagination">
    <n-pagination
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      :display-order="['pages', 'size-picker', 'quick-jumper']"
      :item-count="total"
      :page-slot="pageSlot"
      :page-sizes="pageSizes"
      :show-quick-jumper="total>10"
      show-size-picker
      size="large"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {PaginationSizeOption} from "naive-ui"

const props = defineProps({
  // 总数
  total: {
    type: Number,
    default: 0
  },
  // 每页条数
  pageSizes: {
    type: Array as () => PaginationSizeOption[],
    default: () => [10, 20, 30, 50]
  },
  // 页码显示的个数
  pageSlot: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  // 当前页
  page: {
    type: Number,
    default: 1
  },

  limit: {
    type: Number,
    default: 20
  }
})
const emit = defineEmits()
// 当前页
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

// 当前分页大小改变
function handlePageSizeChange(val: any) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
}

// 当前页改变
function handlePageChange(val: any) {
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>

<style lang="less" scoped>
.pagination {
  padding: 15px;
  display: flex;
  justify-content: center;
}
</style>
