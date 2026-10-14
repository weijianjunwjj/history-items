import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings.json'
import { Message } from '@arco-design/web-vue'
import { AppState } from './types'

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    ...defaultSettings,
    message: {},
    showMessage: false,
  }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state }
    },
    appDevice(state: AppState) {
      return state.device
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial)
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark'
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        this.theme = 'light'
        document.body.removeAttribute('arco-theme')
      }
    },
    toggleDevice(device: string) {
      this.device = device
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value
    },
    mess(ops: any) {
      const { type, duration } = ops
      let { message } = ops
      const t = type || 'info'
      if (typeof ops === 'string') {
        message = ops
      }
      if (this.showMessage) {
        this.message.close()
      }
      const config = {
        content: message,
        duration: duration || 2000,
        onClose: () => {
          // console.error('我结束了')
          this.showMessage = false
        },
      }
      this.message = Message[t](config)
      this.showMessage = true
    },
  },
})

export default useAppStore
