<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <n-notification-provider>
      <NotificationApi/>
      <n-message-provider>
        <MessageApi/>
        <n-dialog-provider>
          <router-view></router-view>
        </n-dialog-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>
<script lang="ts">
import type {App} from "vue"
import {computed, defineComponent, reactive, readonly} from "vue"
import {darkTheme, dateZhCN, GlobalThemeOverrides, zhCN} from "naive-ui"
import appStore from "@/pinia/app.ts"
import mitt, {Emitter} from "mitt"
import mergeWith from "lodash/mergeWith.js"
import cloneDeep from "lodash/mergeWith.js"
import isArray from "lodash/isArray.js"
import "@/style/style.less"
import setupGlobal from "@/global"
import setupPinia from "@/pinia"
import config from "@/config"
import setupIcons from "@/config/icon.ts"
import {axios} from "@/http/request.ts"
import router from "@/router"
import Message from "@/layout/components/Message.vue"
import Notification from "@/layout/components/Notification.vue"

const emitter: Emitter<any> = mitt()

function customizer(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

const init = (app: App, options?: any) => {
  const configOptions = mergeWith(cloneDeep(config), cloneDeep(options), customizer) // 合并值
  app.config.globalProperties["configOptions"] = configOptions
  app.provide("configOptions", readonly(configOptions))
  app.provide("$mitt", emitter)
  axios.$configOptions = configOptions
  axios.$router = router
  setupPinia(app)
  setupIcons(app)
  setupGlobal()
}

export {
  init,
  axios,
  router,
}

export default defineComponent({
  components: {
    MessageApi: Message,
    NotificationApi: Notification
  },
  setup() {
    const app = appStore()
    const themeOverrides: GlobalThemeOverrides = reactive({
      common: {
        primaryColor: computed(() => app.userSetting.themeColor),
        primaryColorHover: computed(() => app.userSetting.themeColor),
        progressRailColor: computed(() => app.userSetting.themeColor),
        errorColor: computed(() => app.userSetting.themeErrorColor),
        successColor: computed(() => app.userSetting.themeSuccessColor),
        warningColor: computed(() => app.userSetting.themeWarningColor),
      },
    })

    return {
      darkTheme: computed(() => app.userSetting.themeName ? darkTheme : null),
      themeOverrides,
      locale: computed(() => app.userSetting.language ? zhCN : null),
      dateLocale: computed(() => app.userSetting.language ? dateZhCN : null),
    }
  }
})
</script>
