import { useChatStore } from '@/store'

const deviceInfo = computed(() => {
  return useChatStore().deviceInfo
})
const deviceInfos = computed(() => {
  return useChatStore().deviceInfos
})

export { deviceInfo, deviceInfos }
