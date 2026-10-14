import { useChatStore } from '@/store'

const deviceInfo = computed(() => {
  return useChatStore().deviceInfo
})
const faceTimeInfoMap = computed(() => {
  return useChatStore().faceTimeInfoMap
})

export { deviceInfo, faceTimeInfoMap }
