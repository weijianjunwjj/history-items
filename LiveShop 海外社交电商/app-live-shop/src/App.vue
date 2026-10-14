<script lang="ts" setup>
import {onError, onHide, onLaunch, onShow} from '@dcloudio/uni-app'
import {Locale, useToast} from 'wot-design-uni'
import {startLocationTracking, stopLocationTracking} from './utils/locationService'
import {isLogin, updateFileUrlPre} from './utils/utils'
import {getRecommendUser} from './service/index'
import enUS from 'wot-design-uni/locale/lang/en-US' // wot组件英文包
import {NimInstance} from '@/utils/nimInstance'
import {useNimStore} from '@/store'
import db from '@/utils/sqlite'

const VITE_NODE_ENV = import.meta.env.VITE_NODE_ENV
onMounted(() => {
  updateFileUrlPre()
  updateUserInfo()
})
// #ifdef APP-PLUS
const $nim = new NimInstance()
// #endif
onUnmounted(() => {
  // #ifdef APP-PLUS
  stopLocationTracking() // 应用卸载时停止定位
  // #endif
})

function updateUserInfo() {
  // 如果登录，获取个人信息
  if (isLogin()) {
    const {updateUserInfo} = useUserInfo()
    updateUserInfo()
  }
}

const toast = useToast()

const recommendPushInterval = ref()
onLaunch(async (ctx) => {
  console.log('App Launch------------------------------------')
  console.log('onLaunch-ctx', ctx)

  if (VITE_NODE_ENV !== 'production') {
    try {
      // 挂载APP启动日志提交
      uni.$dev.logReport('appOnLaunch>' + JSON.stringify(ctx))
    } catch (error) {
    }
  }
  Locale.use('en-US', enUS)
  await $nim.initListen(outputNIMInstance)
})

const queryRecommendUser = async () => {
  const {data}: { data: any } = await getRecommendUser()
  console.log('data', data)
  const noUser = data.accId == '' //没有推荐用户了
  if (!noUser) {
    uni.navigateTo({
      url: '/pages/ChatPushWindow/ChatPushWindow',
    })
  }
}
const outputNIMInstance = async (data) => {
  console.log('登录了')

  provide('$nim', data)
  useNimStore().setInstance(data)
  await $nim.checkLoginStatusFunc('Network error, please restart the app')
  db.getAllList(useNimStore().instance);
}
onShow(async (e) => {
  console.log('App Show------>', e)
  // #ifdef APP-PLUS
  startLocationTracking()

  // #endif
  // 切入前台重新计时
  recommendPushInterval.value = setInterval(
    () => {
      // 每隔30分钟推送一次，前提是已登录
      const token = uni.getStorageSync('token')
      token && queryRecommendUser()
    },
    1000 * 60 * 30, //30分钟
  )
})

onHide(() => {
  console.log('App Hide')
  // 退出后台清除定时
  clearInterval(recommendPushInterval.value)
  // $nim.NIMInstance.V2NIMMessageService.off('onReceiveMessages',()=>{})
  // db.closeDataBase()
})
onError((err) => {
  if (VITE_NODE_ENV !== 'production') {
    try {
      // 挂载devTools全局报错拦截
      uni.$dev.errorReport(err, 'at App.vue onError', 'oe')
    } catch (error) {
    }
  }
})
</script>

<style lang="scss">
uni-page-body,
page {
  height: 100%;
  background: #f6f6f6;
}

/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

:root {
  --wot-button-primary-bg-color: #000;
  --wot-button-primary-color: #fff;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
