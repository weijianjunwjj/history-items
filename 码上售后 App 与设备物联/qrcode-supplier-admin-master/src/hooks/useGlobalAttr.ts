import store, { useAppStore, useUserStore } from '@/store'
import { Notification, Message } from '@arco-design/web-vue'
import { $bus } from '@hx/packages/utils'
import _ from 'lodash'
import $g from '@/utils/global'

export default () => {
  const global = getCurrentInstance()?.appContext.config.globalProperties
  const appStore = useAppStore()
  const userStore = useUserStore()
  const { t } = useI18n()
  const succ = (mess: any) => {
    Message.success(mess || '保存成功')
  }
  const fail = (mess: any) => {
    Message.error(mess || '保存失败')
  }
  const info = (mess: any) => {
    Message.info(mess)
  }
  const useGlobalAttr = {
    ...global,
    store,
    appStore,
    userStore,
    t,
    currentInstance: getCurrentInstance(),
    Notification,
    $bus,
    _,
    $g,
    succ,
    fail,
  }

  return useGlobalAttr
}
