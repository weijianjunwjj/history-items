<template>
  <AppPage :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div
      style="transform: translateY(25px)"
      class="m-auto max-w-700 min-w-345 f-c-c rounded-10 bg-white bg-opacity-60 p-15 card-shadow"
      dark:bg-dark
    >
      <div v-show="isBindWX" h-405 w-369 flex-col px-20 py-35>
        <div class="title flex-c" font-size-16>
          <div :class="active == 1 ? 'active' : 'cursor-pointer'" @click="onClickTab(1)">
            手机号登录
          </div>
          <div ml-20 mr-20 class="line"></div>
          <div :class="active == 2 ? 'active' : 'cursor-pointer'" @click="onClickTab(2)">
            微信扫码登录
          </div>
        </div>

        <div v-show="active == 1" class="form">
          <n-form ref="formRef" :model="formValue" :rules="rules" :validate-messages="messages">
            <n-form-item path="user.phone">
              <n-input v-model:value="formValue.user.phone" placeholder="请输入手机号">
                <template #prefix>
                  <img class="w-20" src="../../assets/images/login/user.png" alt="" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="user.vcode">
              <n-space class="full" justify="space-between">
                <n-input v-model:value="formValue.user.vcode" placeholder="请输入短信验证码">
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
                class="full"
                :disabled="disabled"
                type="primary"
                @click="handleValidateClick"
              >
                登录
              </n-button>
            </n-form-item>
          </n-form>
        </div>

        <div v-show="active == 2" class="qr-code text-center" pt-24>
          <img src="../../assets/images/login/qrcode.png" alt="" />
        </div>
      </div>

      <div v-show="!isBindWX" h-405 w-369 flex-col px-20 py-35 text-center>
        <div font-size-18 class="mb-6">绑定微信</div>
        <div font-size-12 class="mb-45" style="color: rgba(0, 0, 0, 0.45)">
          请使用微信移动端扫描二维码
        </div>

        <div class="qr-code text-center" pt-24>
          <img
            style="width: 200px; height: 200px"
            src="../../assets/images/login/qrcode.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script>
import bgImg from '@/assets/images/login_bg.webp'
import { defineComponent, ref } from 'vue'
import { FlashOutline } from '@vicons/ionicons5'

export default defineComponent({
  setup() {
    const formRef = ref(null)
    const disabled = ref(true)
    const isSend = ref(false)
    const active = ref(1)
    const message = $message
    const isBindWX = ref(true)

    setTimeout(() => {
      // isBindWX.value = false
    }, 2000)

    function onClickTab(id) {
      active.value = id
    }
    function sendMsg() {
      isSend.value = true
    }
    return {
      isBindWX,
      sendMsg,
      isSend,
      onClickTab,
      active,
      disabled,
      FlashOutline,
      bgImg,
      formRef,
      formValue: ref({
        user: {
          phone: '',
          vcode: '',
        },
      }),
      messages: {
        required: '我们非常需要 %s',
      },
      rules: {
        user: {
          phone: {
            required: true,
            trigger: 'blur',
          },
          vcode: {
            required: true,
            trigger: 'blur',
          },
        },
      },
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success('好')
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
.active {
  color: #333330;
}
</style>
