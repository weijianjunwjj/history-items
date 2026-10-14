import { App } from 'vue'
import permission from '@hx/packages/directive/permission'

export default {
  install(Vue: App) {
    Vue.directive('permission', permission)
  },
}
