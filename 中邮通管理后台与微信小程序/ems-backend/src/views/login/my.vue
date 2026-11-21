<template>
  <AppPage :show-footer="false" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div class="login-my my-card m-auto f-c-c rounded-10 bg-white p-15 card-shadow" dark:bg-dark>
      <n-spin :show="showLoading">
        <div
          class="full flex-hvc"
          id="login_container"
          v-show="active0 == 1"
          v-if="!hideLogin_container"
        ></div>

        <div v-show="isInvalidQRC" class="qr-img" @click="updateQRC">
          <div class="void">
            <img class="ico ico-refresh" :src="refresh" alt="" />
            <p class="txt">二维码失效，点击刷新</p>
            <n-button type="success" mt-15>刷新</n-button>
          </div>
          <div class="mask"></div>
        </div>
      </n-spin>

      <div flex-col class="full" v-show="active0 == 2">
        <div v-show="active == 1" class="title full-w f-c-c" mb-84 mt-57 font-size-16>
          <div class="active black font-size-16">微信扫码登录</div>
        </div>
        <div v-show="active == 2" class="full-w title txt-c" mb-36 mt-60 font-size-16>
          <div class="black font-size-18">绑定手机</div>
          <div class="black font-size-12" mt-6 style="color: rgba(0, 0, 1, 0.45)">
            绑定手机号后即可使用
          </div>
        </div>

        <div v-show="active == 1" class="qr-code flex justify-center text-center">
          <div h-200 w-200 style="border: 1px solid #cfd3db; border-radius: 1px"></div>
        </div>

        <div v-show="active == 2" class="form" ml-19 mr-19>
          <n-form ref="formRef" class="my-form" :model="formValue" :rules="rules">
            <n-form-item path="phone">
              <n-input v-model:value="formValue.phone" :maxlength="11" placeholder="请输入手机号">
                <template #prefix>
                  <img class="w-20" src="../../assets/images/login/user.png" alt="" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="vcode">
              <n-space class="full" justify="space-between">
                <n-input
                  v-model:value="formValue.vcode"
                  :maxlength="6"
                  placeholder="请输入手机验证码"
                >
                  <template #prefix>
                    <img class="w-20" src="../../assets/images/login/psw.png" alt="" />
                  </template>
                </n-input>

                <n-button v-if="countdown <= 0" type="primary" class="w-110" @click="sendMsg">
                  发送验证码
                </n-button>
                <n-button v-else strong secondary type="primary" class="w-110">
                  {{ countdown }}秒
                </n-button>
              </n-space>
            </n-form-item>
            <n-form-item>
              <n-button
                class="full-w"
                mt-70
                h-42
                :disabled="disabled"
                type="primary"
                :loading="btnLoading"
                @click="handleValidateClick"
              >
                确定
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>

      <Socket ref="WebSocketRef" :state="loginInfo.state" @websocketMessage="onWebsocketMessage" />
    </div>


    <div class="logo-mod flex-c">
      <img src="../../assets/images/logo.png" style="width: 51px;height: 51px;" alt="">

      <div class="ml-5">
        <div class="font-size-20 fw-600" style="color: rgba(8, 8, 8, 1);">逍遥邮服务商管理后台</div>
        <div class="font-size-12" style="color: #474747;">Service provider management background</div>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import bgImg from '@/assets/images/login/my/bg.png'
import refresh from '../../assets/images/login/refresh.png'
import { reactive, ref } from 'vue'
import { addDynamicRoutes } from '@/router'
import api from './api'
import qs from 'qs'
import Socket from '@/WebSocket/socket.vue'
import { lStorage } from '@/utils'
import { useUserStore, usePermissionStore } from '@/store'
import { useRouter } from 'vue-router'
import { removeToken, setToken, isEmpty } from '@/utils'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const $bus = instance?.appContext.config.globalProperties.$bus 



const userStore = useUserStore()
const permissionStore = usePermissionStore()

const formRef = ref(null)
const isSend = ref(false)
const active = ref(1)
const active0 = ref(1)
const message = $message
const isPhoneOK = ref(false)
const isVcodeOK = ref(false)
const hideLogin_container = ref(false)
const formValue = reactive({
  phone: '',
  vcode: '',
})

const router = useRouter()
const route = useRoute()

const showLoading = ref(true)
const countdown = ref(0)
const intervalId = ref(null)
const isInvalidQRC = ref(false)

const showPage = false

const btnLoading = ref(false)

window.wxunBindMobile = () => {
  console.log('userStore.userId :>> ', userStore.userId)
  if (userStore.userId) {
    api.wxunBindMobile({ userId: userStore.userId }).then((res) => {
      console.log('res :>> ', res)
    })
  }
}

// window.addEventListener('beforeunload', removeToken)

// onBeforeUnmount(() => {
//   window.removeEventListener('beforeunload', removeToken)
// })

const rules = {
  phone: {
    required: true,
    trigger: 'input',
    type: 'number',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        console.log('value :>> ', value)
        if (isEmpty(value)) {
          reject('请输入手机号') // reject with error message
          isPhoneOK.value = false
        } else if (value.length !== 11) {
          reject('请输入11位手机号') // reject with error message
          isPhoneOK.value = false
        } else {
          resolve()
          isPhoneOK.value = true
        }
      })
    },
  },
  vcode: {
    required: true,
    trigger: 'input',
    type: 'number',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        console.log('value :>> ', value)
        if (!/^\d{6}$/.test(value)) {
          reject('请输入6位数字验证码') // reject with error message
          isVcodeOK.value = false
        } else {
          resolve()
          isVcodeOK.value = true
        }
      })
    },
  },
}
const handleValidateClick = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const wxInfo = userStore.userInfo
      console.log('wxInfo :>> ', wxInfo)
      const { unionId } = wxInfo
      const mobile = formValue.phone
      console.log('mobile :>> ', mobile)
      console.log('unionId :>> ', unionId)
      btnLoading.value = true
      const [err, res] = await $to(api.wxBindMobile({ mobile, unionId }))
      btnLoading.value = false
      if (!err) {
        userStore.loginSuccess({ route, router })
        closeWebsocket()
      }
    } else {
      console.log(errors)
    }
  })
}

async function sendMsg() {
  // 判断手机号和验证码是否填写合格
  if (isPhoneOK.value) {
    isSend.value = true

    const [err, res] = await $to(api.sendSMS({ phone: formValue.phone }))
    if (!err) {
      console.log('res :>> ', res)
      startCountdown()
    } else {
      console.error(err)
    }
  } else {
    message.warning('请按要求填写手机号和验证码')
  }
}

const disabled = computed(() => {
  return !(isPhoneOK.value && isVcodeOK.value && isSend.value)
})

function startCountdown() {
  countdown.value = 60
  intervalId.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(intervalId.value)
    }
  }, 1000)
}

function closeWebsocket() {
  WebSocketRef.value.isShow1 = false
  WebSocketRef.value.websocketClose()
  clearInterval(WebSocketRef.value.interval)
}

const loginInfo = reactive({
  state: null,
  QRCUrl: '',
})

const WebSocketRef = ref()

function updateQRC() {
  init()
}

window.isInvalidQRC = isInvalidQRC

async function init() {
  let { data } = await api.getQrCodeUrl()
  data = JSON.parse(data)
  const url = data.url.split('?')
  const url2 = qs.parse(url[1], { ignoreQueryPrefix: true })
  var obj = new WxLogin({
    self_redirect: true,
    id: 'login_container',
    appid: url2.appid,
    scope: url2.scope,
    redirect_uri: url2.redirect_uri,
    state: url2.state,
  })
  loginInfo.state = url2.state?.split('#')[0]
  isInvalidQRC.value = false
  setTimeout(() => {
    isInvalidQRC.value = true
  }, 1000 * 165)
  setTimeout(() => {
    showLoading.value = false
  }, 200)
  // 超时一分钟没有扫码，二维码置灰
  // setTimeout(() => {
  // }, 1000 * 60)

  // async function polling(){
  //   const [err,res] = await  $to(api.isWXAuth({state:loginInfo.state}))
  //   if(!err){
  //     console.log('res :>> ', res)
  //   }
  // }

  console.log('obj :>> ', obj)
}
init()

async function onWebsocketMessage(data) {
  console.log('data :>> ', data)
  hideLogin_container.value = true
  const { isBind, saToken } = data

  if (saToken) {
    setToken(saToken)
    const res = await api.findUserInfo()
    userStore.setUserInfo({ ...res.data })
    if (isBind) {
      active0.value = 2
      active.value = 2
      // 未绑定手机号
      $dialog.confirm({
        class: 'login-my-dialog-phone',
        title: '您未绑定手机号，请先绑定',
        content: '',
        positiveText: '去绑定',
        negativeText: '',
        closeOnEsc: false,
        maskClosable: false,
        closable: false,
        onPositiveClick: () => {},
        onNegativeClick: () => {
          // message.error('不确定')
        },
      })
    } else {
      // 走登录成功
      userStore.loginSuccess({ route, router })
      closeWebsocket()
      // }
    }
  }
}

onMounted(() => {
  console.log('$bus :>> ', $bus)
  $bus.on('refresh_qr_code',()=>{
    console.log('接受refresh_qr_code事件-刷新qrcode')
    init()
  })
})
onUnmounted(() => {
  $bus.off('refresh_qr_code')
})
</script>

<style lang="scss" scoped>

.logo-mod{
  position: absolute;
  top: 61px;
  left: 78px;
}
.qr-img {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  left: 0;
  color: #fff;
  cursor: pointer;
  width: 94%;
  height: 280px;
  text-align: center;
  margin: 0 auto;

  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.8;
    filter: alpha(opacity=80);
    -moz-opacity: 0.8;
    background: #000;
  }
  .txt {
  }
  .void {
    height: 52px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    z-index: 11;
    .ico-refresh {
      width: 30px;
      height: 30px;
      margin: 0 auto 10px;
      display: block;
      overflow: hidden;
      z-index: 11;
    }
  }
}
.line {
  width: 1px;
  height: 12px;
  background: #e5e5e5;
}
.title {
  color: #999999;
}

.my-card {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 400px;
  height: 524px;
  right: 9.58%;
}

:deep(.my-form) {
  .n-form-item.n-form-item--top-labelled {
    grid-template-rows: minmax(8px, auto) 1fr;
  }
}
</style>
<style lang="scss">
.login-my-dialog-phone {
  .n-dialog__close {
    display: none;
  }
  .n-dialog__title {
    justify-content: center;
    margin-top: 12px;
    margin-bottom: 42px;
  }
  .n-dialog__action {
    justify-content: center;
    button {
      width: 74px;
      height: 32px;
      border-radius: 3px;
    }
  }
}
</style>
