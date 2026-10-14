import {defineStore} from 'pinia'
import {V2NIMConversationResult} from "nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK/V2NIMConversationService";

export const useNimStore = defineStore(
  'nimStore',
  () => {
    const dmUnread = ref<number>(0)
    const mfUnread = ref<number>(0)
    const dmId = ref<string>("")
    const mfId = ref<string>("")
    const dmList = ref<V2NIMConversationResult>(null)
    const mfList = ref<V2NIMConversationResult>(null)
    const instance = ref()
    const setDmUnread = (val: number) => {
      dmUnread.value = val
    }

    const setMfUnread = (val: number) => {
      mfUnread.value = val
    }
    const watchDmList = (callback: (newListData: V2NIMConversationResult) => void) => {
      watch(() => dmList.value, (newList) => {
        console.log("asdasdasdasd", newList, dmList.value)
        callback(newList)
      })

    }
    const watchMFList = (callback: (newListData: V2NIMConversationResult) => void) => {
      watch(() => mfList.value, (newList) => {
        console.log("dsadsadsa", newList, dmList.value)
        callback(newList)
      })
    }
    const setDmList = (val: V2NIMConversationResult) => {
      console.log('触发了setDMList', val)
      dmList.value = val

    }

    const setMfList = (val: V2NIMConversationResult) => {
      console.log('触发了setMFList')
      mfList.value = val
    }

    const setMfId = (val: string) => {
      mfId.value = val
    }

    const setDmId = (val: string) => {
      dmId.value = val
    }
    const setInstance = (val) => {
      instance.value = val
      console.log('设置了instance', instance.value)
    }
    return {
      instance,
      dmUnread,
      mfUnread,
      dmId,
      mfId,
      dmList,
      mfList,
      setMfId,
      setDmId,
      setDmUnread,
      setMfUnread,
      setDmList,
      setMfList,
      setInstance,
      watchDmList,
      watchMFList
    }
  },
  {
    persist: true,
  },
)
