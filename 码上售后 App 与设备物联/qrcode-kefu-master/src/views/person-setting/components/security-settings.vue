<template>
  <div>
    <a-list :bordered="false">
      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph> 登录密码 </a-typography-paragraph>
          </template>
          <template #description>
            <div class="content">
              <a-typography-paragraph>
                已设置。密码至少8位字符。
              </a-typography-paragraph>
            </div>
            <div class="operation">
              <a-link @click="resetPwdVisible = true"> 修改 </a-link>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph> 安全手机 </a-typography-paragraph>
          </template>
          <template #description>
            <div class="content">
              <a-typography-paragraph>
                <span v-if="phone">
                  已绑定:
                  {{
                    phone?.substr(0, 3) +
                    '******' +
                    phone?.substr(9, phone?.split('').length)
                  }}
                </span>
                <span v-else>暂未绑定</span>
              </a-typography-paragraph>
            </div>
            <div class="operation">
              <a-link @click="editPhoneVisible = true"> 修改 </a-link>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
      <a-list-item v-if="!bindWX">
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph> 微信绑码 </a-typography-paragraph>
          </template>
          <template #description>
            <div class="content">
              <a-typography-paragraph>
                <vue-qr :text="qrcode" :size="200"></vue-qr>
              </a-typography-paragraph>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item v-else>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph> 微信绑码 </a-typography-paragraph>
          </template>
          <template #description>
            <div class="content">
              <a-typography-paragraph>
                <span> 已绑定 </span>
              </a-typography-paragraph>
            </div>
            <div class="operation">
              <a-link @click="unBindWX"> 点击解绑 </a-link>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-modal
      v-model:visible="resetPwdVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleResetPwdModelOk"
      @before-close="handleResetPwdCancel"
    >
      <template #title>提示</template>
      <a-form ref="resetPwdRefs" :model="resetPwdModelValue">
        <a-form-item
          field="oldPassword"
          label="旧密码"
          :rules="[
            {
              required: true,
              message: '请填写旧密码',
            },
            {
              minLength: 8,
              maxLength: 20,
              message: '用户密码长度必须介于 8 和 20 之间',
            },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="resetPwdModelValue.oldPassword"
            placeholder="请输入旧密码"
          />
        </a-form-item>
        <a-form-item
          field="newPassword"
          label="新密码"
          :rules="[
            {
              required: true,
              message: '请填写新密码',
            },
            {
              minLength: 8,
              maxLength: 20,
              message: '用户密码长度必须介于 8 和 20 之间',
            },
            {
              match: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,})$/,
              message: '用户密码必须包含字母和数字',
            },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="resetPwdModelValue.newPassword"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item
          field="confirmPassword"
          label="新密码"
          :rules="rules"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="resetPwdModelValue.confirmPassword"
            placeholder="请输入确认密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="editPhoneVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleEditPhoneModelOk"
      @before-close="handleEditPhoneCancel"
    >
      <template #title>提示</template>
      <a-form ref="editPhoneRefs" :model="editPhoneModelValue">
        <a-form-item
          field="phone"
          label="手机号"
          :rules="[
            {
              required: true,
              message: '请填写手机号',
            },
            {
              match:
                /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
              message: '请填写正确的手机号',
            },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            v-model="editPhoneModelValue.phone"
            placeholder="请输入手机号"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  // import MForm, { IForm } from '@/components/m-form/index.vue'
  import { Message, Modal } from '@arco-design/web-vue'
  import { updateUserPwd, updateUserProfile } from '@/api/personSetting'
  import { useUserStore } from '@/store'
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  import qs from 'qs'
  import { appId } from '@/config'
  import { storeToRefs } from 'pinia'
  import { WXUnbindSys } from '@/api/wx'

  const qrcode = ref('')
  const userStore = useUserStore()
  const { user, bindWX } = storeToRefs(userStore)
  const app = window.$app
  // const { user } = userStore.$state

  const phone = computed(() => {
    return userStore.$state.user.phone
  })

  // 定义重置密码弹框visible
  const resetPwdVisible = ref(false)

  // 定义重置密码弹框refs对象
  const resetPwdRefs = ref()

  const rules = [
    {
      required: true,
      message: '请填写确认密码',
    },
    {
      minLength: 8,
      maxLength: 20,
      message: '用户密码长度必须介于 8 和 20 之间',
    },
    {
      match: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,})$/,
      message: '用户密码必须包含字母和数字',
    },
    {
      validator: (value, cb) => {
        return new Promise((resolve) => {
          window.setTimeout(() => {
            if (value !== resetPwdModelValue.value.newPassword) {
              cb('两次输入的密码不一致')
            }
            resolve()
          }, 300)
        })
      },
    },
  ]

  // 微信绑码
  const bindWXCode = () => {
    const redirect_uri = `${window.SITE_CONFIG.VITE_API_DOMAIN2}/wx-bind-code`
    console.log('redirect_uri', redirect_uri)
    console.log('userStore', userStore)
    const state = `${userStore.user.userId}_${userStore.enterpriseId}`
    const params1 = {
      appid: appId,
      redirect_uri,
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state,
    }
    console.log('params1', params1)
    const params = qs.stringify(params1)
    console.log('params', params)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?${params}#wechat_redirect`

    qrcode.value = url

    console.log('qrcode', qrcode.value)
    //
  }

  function unBindWX() {
    //  解绑成功后调用getinfo接口
    // eslint-disable-next-line prefer-const
    Modal.confirm({
      title: '确定要解绑微信?',
      content: '解绑后将无法使用该第三方帐号登录系统',
      onOk: async () => {
        await WXUnbindSys()
        await userStore.info()
        app.succ('解绑成功')
      },
    })
  }

  // 重置密码弹窗确定按钮点击事件
  const handleResetPwdModelOk = async (done: (closed: boolean) => void) => {
    const value = await resetPwdRefs.value.validate()
    if (value) {
      done(false)
    } else {
      try {
        const params = {
          oldPassword: resetPwdModelValue.value.oldPassword,
          newPassword: resetPwdModelValue.value.newPassword,
        }
        await updateUserPwd({ ...params })
        done(true)
        Message.success(`修改密码成功`)
        handleResetPwdCancel()
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 重置密码弹窗关闭事件
  const handleResetPwdCancel = () => {
    resetPwdVisible.value = false
  }

  // 重置密码表单数据
  const resetPwdModelValue = ref({
    oldPassword: '',
    newPassword: '',
  })

  // 定义修改手机弹框visible
  const editPhoneVisible = ref(false)

  // 定义修改手机弹框refs对象
  const editPhoneRefs = ref()

  // 修改手机弹窗确定按钮点击事件
  const handleEditPhoneModelOk = async (done: (closed: boolean) => void) => {
    const value = await editPhoneRefs.value.validate()
    if (value) {
      done(false)
    } else {
      try {
        await updateUserProfile({ ...editPhoneModelValue.value })
        userStore.info()
        done(true)
        Message.success(`修改手机号成功`)
        handleEditPhoneCancel()
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 修改手机弹窗关闭事件
  const handleEditPhoneCancel = () => {
    editPhoneVisible.value = false
  }

  // 修改手机表单数据
  const editPhoneModelValue = ref({
    userId: userStore.$state.user.userId,
    phone: '',
  })

  onMounted(() => {
    bindWXCode()
  })
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    border-bottom: none !important;
    .arco-typography {
      margin-bottom: 20px;
    }
    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }
    .arco-list-item-meta {
      padding: 0;
    }
  }
  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }
      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
