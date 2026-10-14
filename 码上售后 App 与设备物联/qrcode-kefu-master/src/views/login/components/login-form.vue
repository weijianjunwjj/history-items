<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">码上售后 - 客服系统</div>
    <div class="login-form-sub-title">基于一物一码的视频报修解决方案</div>
    <div class="login-form-error-msg"></div>
    <a-form
      ref="loginFormRef"
      :model="loginForm"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="enterpriseName"
        hide-label
        :rules="[{ required: true, message: '企业账号不能为空' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="loginForm.enterpriseName" placeholder="企业账号">
          <template #prefix>
            <icon-home />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="userName"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="loginForm.userName" placeholder="员工账号">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="loginForm.password"
          placeholder="密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="code"
        :rules="[{ required: true, message: '验证码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <div class="flex just-sb w100">
          <a-input
            v-model="loginForm.code"
            allow-clear
            placeholder="验证码"
            style="flex: 2"
          />
          <img
            :src="codeUrl"
            class="login-code-img ml-4 point"
            style="flex: 1"
            @click="getCode"
          />
        </div>
      </a-form-item>

      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>

        <div>
          <a-tooltip content="微信登录"
            ><img
              style="width: 30px"
              class="point"
              :src="wximg"
              @click="showWXModal"
          /></a-tooltip>

          <a-modal
            v-model:visible="showWx"
            width="300px"
            :footer="false"
            title="微信扫码登录"
            modal-animation-name="fade-modal"
            class="modal_wx"
            unmount-on-close
          >
            <div class="flex-hvc full">
              <vue-qr :text="wxLoginQRC" :size="200"></vue-qr>

              <div v-show="isInvalidQRC" class="qr-img" @click="updateQRC">
                <div class="void">
                  <img class="ico ico-refresh" :src="refresh" alt="" />
                  <p class="txt">二维码失效，点击刷新</p>
                </div>
                <div class="mask"></div>
              </div>
            </div>
          </a-modal>
        </div>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { loadScript } from '@/utils/utils'
  import { Message } from '@arco-design/web-vue'
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
  import { useStorage } from '@vueuse/core'
  import { useUserStore } from '@/store'
  import useLoading from '@/hooks/loading'
  import { LoginData, getUserInfo } from '@/api/user'
  import { getCodeImg } from '@/api/login'
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  import { getWxLoginToken } from '@/api/wx'
  import qs from 'qs'
  import { appId } from '@/config'
  import wximg from '../../../assets/images/wx.png'
  import refresh from '../../../assets/images/refresh.png'

  console.log('appId', appId)

  const router = useRouter()
  const { t } = useI18n()
  const errorMessage = ref('')
  const { loading, setLoading } = useLoading()
  const userStore = useUserStore()
  const codeUrl = ref('')
  // 验证码开关
  const captchaOnOff = ref(true)
  const loginFormRef = ref()
  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    enterpriseName: '',
    userName: '',
    password: '',
  })
  const loginForm = reactive({
    enterpriseName: loginConfig.value.enterpriseName,
    userName: loginConfig.value.userName,
    password: loginConfig.value.password,
    code: '',
    uuid: '',
  })
  const wxLoginQRC = ref('')
  const showWx = ref(false)
  const isInvalidQRC = ref(false)

  // ---function---
  const showWXModal = () => {
    showWx.value = true
    renderQRC()
    isInvalidQRC.value = false
    polling()
    console.log('wxLoginQRC.value', wxLoginQRC.value)
  }
  function generateKey(keyLength = 18) {
    let rlt = ''
    for (let i = 0; i < keyLength; i++) {
      if (Math.round(Math.random())) {
        rlt += Math.ceil(Math.random() * 9)
      } else {
        const ranNum = Math.ceil(Math.random() * 23)
        if (Math.round(Math.random())) {
          rlt += String.fromCharCode(65 + ranNum)
        } else {
          rlt += String.fromCharCode(97 + ranNum)
        }
      }
      // 加上-，不要的可以去掉
      if ((i + 1) % 6 === 0 && i > 2 && i < 17) {
        rlt += '-'
      }
    }
    return rlt
  }

  let timing = 0
  const randomKey = `login${generateKey(8)}`
  // 轮询
  const polling = () => {
    console.log('polling-timing', timing)
    timing = window.setInterval(() => {
      console.log('randomKey', randomKey)
      getWxLoginToken(randomKey)
        .then(async (res) => {
          const { data } = res
          if (data) {
            console.log('data', data)
            console.log('微信登录')
            window.clearInterval(timing)
            const token = res.data.access_token
            await userStore.wxLogin(token)
            await userStore.checkKFPermission()
            const { redirect, ...othersQuery } = router.currentRoute.value.query
            if (userStore.showKF) {
              router.push({
                name: 'videoCall',
                query: {
                  ...othersQuery,
                },
              })
            } else {
              router.push({
                name: 'workOrder',
                query: {
                  ...othersQuery,
                },
              })
            }
            Message.success(t('login.form.login.success'))
          }
          // console.log('getWxLoginToken-res', res)
        })
        .catch((err: any) => {
          console.error(err)
          window.clearInterval(timing)
        })
    }, 1500)

    setTimeout(() => {
      isInvalidQRC.value = true
      wxLoginQRC.value = ''
      console.log('timing', timing)
      window.clearInterval(timing)
    }, 1000 * 180)
  }

  const renderQRC = () => {
    const redirect_uri = `${window.SITE_CONFIG.VITE_API_DOMAIN2}/wx-login`
    console.log('redirect_uri', redirect_uri)
    // const state = `${userStore.user.userId}_${userStore.enterprise.enterpriseId}`

    const params1 = {
      appid: appId,
      redirect_uri,
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state: randomKey,
    }
    console.log('params1', params1)
    const params = qs.stringify(params1)
    console.log('params', params)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?${params}#wechat_redirect`

    wxLoginQRC.value = url
  }

  const updateQRC = () => {
    renderQRC()
    console.log('wxLoginQRC.value', wxLoginQRC.value)
    isInvalidQRC.value = false
    polling()
  }

  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value
  }
  const getCode = () => {
    getCodeImg()
      .then((res: any) => {
        const { data } = res
        captchaOnOff.value =
          data.captchaOnOff === undefined ? true : data.captchaOnOff
        if (captchaOnOff.value) {
          codeUrl.value = `data:image/gif;base64,${data.img}`
          loginForm.uuid = data.uuid
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined
    values: LoginData
  }) => {
    if (!errors) {
      setLoading(true)
      try {
        await userStore.login(values)
        const { redirect, ...othersQuery } = router.currentRoute.value.query

        // await loadScript('../../../../debug/lib-generate-test-usersig.min.js')
        // await loadScript('../../../../debug/GenerateTestUserSig.js')
        await userStore.checkKFPermission()
        if (userStore.showKF) {
          router.push({
            name: 'videoCall',
            query: {
              ...othersQuery,
            },
          })
        } else {
          router.push({
            name: 'workOrder',
            query: {
              ...othersQuery,
            },
          })
        }

        Message.success(t('login.form.login.success'))
        const { rememberPassword } = loginConfig.value
        const { enterpriseName, userName, password } = loginForm

        const isRemb = (item: string) => {
          return rememberPassword ? item : ''
        }

        loginConfig.value.enterpriseName = isRemb(enterpriseName)
        loginConfig.value.userName = isRemb(userName)
        loginConfig.value.password = isRemb(password)
        // 实际生产环境需要进行加密存储。
      } catch (err) {
        console.error(err)
        // if (err?.msg === '验证码错误') {
        getCode()
        // }
        errorMessage.value = (err as Error).message
      } finally {
        setLoading(false)
      }
    }
  }

  onMounted(() => {
    getCode()
    renderQRC()
  })
</script>

<style lang="less">
  .modal_wx {
    .qr-img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: #fff;
      cursor: pointer;
      width: 200px;
      height: 200px;
      margin: auto;
      text-align: center;

      .mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0.7;
        filter: alpha(opacity=70);
        -moz-opacity: 0.7;
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
  }
</style>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 22px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }

    .login-code {
      float: right;
      height: 38px;

      img {
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .login-code-img {
      height: 31px;
    }
  }
</style>
