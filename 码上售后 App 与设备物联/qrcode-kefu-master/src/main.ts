import { createApp } from 'vue'
import ArcoVue, { Icon } from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import globalComponents from '@/components'
import router from './router'
import store from './store'
import i18n from './locale'
import directive from './directive'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import '@/assets/icon/tim.css'
import '@/assets/style/index.less'
import '@/api/interceptor'

const app = createApp(App)

const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/c/font_3505277_fv4284g1rpg.js',
})

app.use(ArcoVue, {})
app.use(ArcoVueIcon)

app.use(router)
app.use(store)
app.use(i18n)
app.use(globalComponents)
app.use(directive)
app.component('IconFont', IconFont)

app.mount('#app')
