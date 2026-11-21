/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from './store/index.js'
import App from './App.vue'
import { setupNaiveDiscreteApi } from './utils'
import initMethod from './utils/method.js'

async function setupApp() {
  const app = createApp(App)

  setupStore(app)
  setupNaiveDiscreteApi()
  initMethod(app)

  await setupRouter(app)
  const VITE_BASE_API = import.meta.env.VITE_BASE_API
  console.log('VITE_BASE_API :>> ', VITE_BASE_API)
  window.$api_test = import.meta.env.VITE_BASE_API
  window.$api_test2 = import.meta.env.VITE_BASE_API2
  app.mount('#app')
}

setupApp()
