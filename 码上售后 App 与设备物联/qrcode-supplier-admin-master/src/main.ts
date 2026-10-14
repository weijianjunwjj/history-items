import '@hx/packages/utils/customPrototype'
import { createApp } from 'vue'
import ArcoVue, { Icon } from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import globalComponents from '@/components'
import { getDict } from '@hx/packages/utils/src/dict'
import moment from 'moment'

// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'

// 字典标签组件
import DictTag from '@hx/packages/components/dict-tag/index.vue'
import elColorPicker from '@hx/packages/components/ColorPicker/index.vue'
import SvgIcon from '@hx/packages/components/SvgIcon/index.vue'
// import iconfontJS from '@/assets/iconfont/iconfont.js?url'
import i18n from './locales'

// import elColorPicker from 'el-color-picker'
import router from './router'
import store from './store'
import directive from './directive'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import '@hx/packages/assets/styles/atom.less'
import '@/assets/style/index.less'

const app = createApp(App)

// const IconFont = Icon.addFromIconFontCn({ src: iconfontJS })
const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/c/font_3505277_fv4284g1rpg.js',
})

app.config.globalProperties.$dict = getDict
app.config.globalProperties.$moment = moment

app.use(ArcoVue, {})
app.use(ArcoVueIcon)

app.use(store)
app.use(router)
app.use(i18n)
app.use(globalComponents)
app.use(directive)

app.component('ElColorPicker', elColorPicker)
app.component('SvgIcon', SvgIcon)
app.component('DictTag', DictTag)
app.component('IconFont', IconFont)

app.mount('#app')
