import { createPinia } from 'pinia'
import useCommonStore from '@hx/packages/store/index'
import useAppStore from './modules/app'
import useUserStore from './modules/user'
import useTabBarStore from './modules/tab-bar'
import useMessageStore from './modules/message'

const pinia = createPinia()

export {
  useAppStore,
  useUserStore,
  useTabBarStore,
  useMessageStore,
  useCommonStore,
}

export default pinia
