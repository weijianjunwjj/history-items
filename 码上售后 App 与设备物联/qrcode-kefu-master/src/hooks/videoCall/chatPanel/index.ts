import { useChatStore } from '@/store'

const chatLoading = computed(() => {
  return useChatStore().chatLoading
})

const chatList = computed(() => {
  return useChatStore().chatList
})

const currentChat = computed(() => {
  return useChatStore().currentChat
})

export { chatLoading, chatList, currentChat }
