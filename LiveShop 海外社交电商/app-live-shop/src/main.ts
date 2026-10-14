import {createSSRApp} from 'vue'
import App from './App.vue'
import store from './store'
import {prototypeInterceptor, requestInterceptor, routeInterceptor} from './interceptors'
import devTools from './devTools/index.js'
import devToolsConfig from './devTools/config.js'
import devToolsVueMixin from './devTools/core/proxy/vueMixin.js'
import {useToast} from 'wot-design-uni'
import 'virtual:uno.css'
import '@/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)

  // 全局挂载 $toast
  app.config.globalProperties.$toast = (message, type = 'show') => {
    const toast = useToast()
    toast[type](message)
  }
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)

  const {VITE_NODE_ENV,VITE_SERVER_BASEURL} = import.meta.env
  console.log('VITE_SERVER_BASEURL', VITE_SERVER_BASEURL)
  if (VITE_NODE_ENV !== 'production') {
    // 混入DevTools生命周期监听
    app.mixin(devToolsVueMixin)
    // 挂载Devtools
    app.use(devTools, devToolsConfig)
  }
  console.log('VITE_NODE_ENV', VITE_NODE_ENV)

  return {
    app,
  }
}
