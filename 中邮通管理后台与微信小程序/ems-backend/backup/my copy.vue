<template>
  <AppPage :show-footer="false" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div class="my-card m-auto f-c-c rounded-10 bg-white p-15 card-shadow" dark:bg-dark>
      <div flex-col class="full">
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
          <div h-200 w-200 p-12 style="border: 1px solid #cfd3db; border-radius: 1px">
            <img class="full" src="../../assets/images/login/qrcode.png" alt="" />
          </div>
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

                <n-button v-if="!isSend" type="primary" class="w-110" @click="sendMsg">
                  发送验证码
                </n-button>
                <n-button v-else strong secondary type="primary" class="w-110">已发送</n-button>
              </n-space>
            </n-form-item>
            <n-form-item>
              <n-button
                class="full-w"
                mt-70
                h-42
                :disabled="disabled"
                type="primary"
                @click="handleValidateClick"
              >
                确定
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script>
import bgImg from '@/assets/images/login/my/bg.png'
import { defineComponent, ref, useRouter, useRoute } from 'vue'
import { FlashOutline } from '@vicons/ionicons5'
import { setToken, isEmpty } from '@/utils'
import { addDynamicRoutes } from '@/router'

export default defineComponent({
  setup() {
    const formRef = ref(null)
    const isSend = ref(false)
    const active = ref(1)
    const message = $message
    const isPhoneOK = ref(false)
    const isVcodeOK = ref(false)
    const formValue = ref({
      phone: '',
      vcode: '',
    })

    function onClickTab(id) {
      active.value = id
    }
    function sendMsg() {
      // 判断手机号和验证码是否填写合格
      if (isPhoneOK.value) {
        isSend.value = true
      } else {
        message.warning('请按要求填写手机号和验证码')
      }
    }

    const disabled = computed(() => {
      return !(isPhoneOK.value && isVcodeOK.value)
    })

    setTimeout(() => {
      $dialog.confirm({
        class: 'login-my-dialog-phone',
        title: '您未绑定手机号，请先绑定',
        content: '',
        positiveText: '去绑定',
        negativeText: '',
        onPositiveClick: () => {
          // message.success('确定')
          active.value = 2
        },
        onNegativeClick: () => {
          // message.error('不确定')
        },
      })
    }, 500)

    return {
      sendMsg,
      isSend,
      onClickTab,
      active,
      disabled,
      FlashOutline,
      bgImg,
      formRef,
      formValue,
      messages: {
        required: '请输入 %s',
      },
      rules: {
        phone: {
          required: true,
          trigger: 'blur',
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
          trigger: 'blur',
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
      },
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate(async (errors) => {
          if (!errors) {
            message.success('好')
            setToken('admin')
            const router = useRouter()
            const { query } = useRoute()
            await addDynamicRoutes()
            if (query.redirect) {
              const path = query.redirect
              Reflect.deleteProperty(query, 'redirect')
              router.push({ path, query })
            } else {
              router.push('/')
            }
          } else {
            console.log(errors)
            message.error('不好')
          }
        })
      },
    }
  },
})
</script>

<style lang="scss" scoped>
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
