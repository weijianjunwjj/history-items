import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useUserStore from './modules/user'
import useTabBarStore from './modules/tab-bar'
import useChatStore from './modules/chat'
import useVideoUserStore from './modules/videoUser'
import useMessageStore from './modules/message'

const pinia = createPinia()

export {
  useAppStore,
  useUserStore,
  useTabBarStore,
  useChatStore,
  useVideoUserStore,
  useMessageStore,
}

export default pinia
