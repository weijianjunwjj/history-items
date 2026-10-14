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
      <!-- ------------------------ -->
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
      <m-form
        ref="resetPwdRefs"
        v-bind="resetPwdConfig"
        v-model="resetPwdModelValue"
        @change-value="handleResetPwdChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="editPhoneVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleEditPhoneModelOk"
      @before-close="handleEditPhoneCancel"
    >
      <template #title>提示</template>
      <m-form
        ref="editPhoneRefs"
        v-bind="editPhoneConfig"
        v-model="editPhoneModelValue"
        @change-value="handleEditPhoneChangeValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { Message, Modal } from '@arco-design/web-vue'
  import {
    updateUserPwd,
    updateUserProfile,
  } from '@/api/code-service/user-admin/person-setting/index.ts'
  import { useUserStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import qs from 'qs'
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  import useCommonStore from '@hx/packages/store'
  import { WXUnbindSys } from '../../../../../api/user.ts'

  const app = window.$app
  const { appId } = useCommonStore()
  const userStore = useUserStore()
  const { user, bindWX } = storeToRefs(userStore)
  const qrcode = ref('')
  const phone = computed(() => {
    return userStore.user?.phone
  })

  // 定义重置密码弹框visible
  const resetPwdVisible = ref(false)

  // 定义重置密码弹框refs对象
  const resetPwdRefs = ref()

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
    const value = await resetPwdRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        const params = {
          oldPassword: resetPwdModelValue.value.oldPassword.trim(),
          newPassword: resetPwdModelValue.value.newPassword.trim(),
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
    resetPwdRefs.value.resetForm()
  }

  // 重置密码表单数据
  const resetPwdModelValue = ref({
    oldPassword: '',
    newPassword: '',
  })

  // 更新重置密码表单数据
  const handleResetPwdChangeValue = (value) => {
    resetPwdModelValue.value = value
  }

  // 先创建函数来封装这个方法
  function getRnadomFiveInt() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 0-9数字范围
    const temp_arr: any[] = []
    const return_arr = []
    const num = Math.floor(Math.random() * 5 + 1) // 随机生成0-5，以此确定生成数字的位数

    Object.keys(arr).forEach((key: any) => {
      temp_arr.push(arr[key])
    })

    for (let i = 0; i < num; i++) {
      const arrIndex = Math.floor(Math.random() * temp_arr.length) // 随机生成一个索引
      return_arr.push(temp_arr[arrIndex]) // 放入返回数组
    }

    // eslint-disable-next-line no-bitwise
    const res = ~~return_arr.toString().replace(/,/g, '')

    return res
  }

  // 定义重置密码弹框表单
  const resetPwdConfig: IForm = reactive({
    formItems: [
      {
        field: 'oldPassword',
        type: 'password',
        label: '旧密码',
        placeholder: '请输入旧密码',
        rules: [
          {
            required: true,
            message: '请填写旧密码',
          },
          {
            minLength: 8,
            maxLength: 20,
            message: '用户密码长度必须介于 8 和 20 之间',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'newPassword',
        type: 'password',
        label: '新密码',
        placeholder: '请输入新密码',
        rules: [
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
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'confirmPassword',
        type: 'password',
        label: '确认密码',
        placeholder: '请输入确认密码',
        rules: [
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
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 21 },
    labelWidth: { span: 3 },
    colLayout: { md: 24 },
  })

  // 定义修改手机弹框visible
  const editPhoneVisible = ref(false)

  // 定义修改手机弹框refs对象
  const editPhoneRefs = ref()

  // 修改手机弹窗确定按钮点击事件
  const handleEditPhoneModelOk = async (done: (closed: boolean) => void) => {
    const value = await editPhoneRefs.value.formValidate()
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
    editPhoneRefs.value.resetForm()
  }

  // 修改手机表单数据
  const editPhoneModelValue = ref({
    userId: user.value.userId,
    phone: '',
  })

  // 修改手机表单数据
  const handleEditPhoneChangeValue = (value) => {
    editPhoneModelValue.value = value
  }

  // 定义重置密码弹框表单
  const editPhoneConfig: IForm = reactive({
    formItems: [
      {
        field: 'phone',
        type: 'input',
        label: '手机号',
        placeholder: '请输入手机号',
        rules: [
          {
            required: true,
            message: '请填写手机号',
          },
          {
            match:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 21 },
    labelWidth: { span: 3 },
    colLayout: { md: 24 },
  })

  // 微信绑码
  const bindWXCode = () => {
    const redirect_uri = `${window.SITE_CONFIG.VITE_API_DOMAIN}/wx-bind-code`
    const state = `${userStore.user.userId}_${userStore.enterprise.enterpriseId}`
    const params1 = {
      appid: appId,
      redirect_uri,
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state,
    }
    const params = qs.stringify(params1)
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?${params}#wechat_redirect`
    // console.log('url', url)
    qrcode.value = url
  }

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
