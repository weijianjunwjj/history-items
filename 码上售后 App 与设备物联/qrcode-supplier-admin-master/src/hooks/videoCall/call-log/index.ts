import { useChatStore } from '@/store'

const tableData = computed(() => {
  return useChatStore().tableData
})
const tableLoading = computed(() => {
  return useChatStore().tableLoading
})

export { tableData, tableLoading }
