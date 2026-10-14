<template>
  <div class="global-setting-box">
    <a-card title="客服接听规则">
      <a-form :model="form" :style="{ width: '600px' }">
        <a-descriptions :column="1">
          <a-descriptions-item label="来电分配方式 :">
            <a-space size="large">
              <a-radio-group v-if="params[0]" v-model="params[0].configValue">
                <a-radio value="priority">按权重分配</a-radio>
                <a-radio value="average">平均分配</a-radio>
              </a-radio-group>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="优先接入规则 :">
            同一设备同一客户最近
            <a-input-number
              v-if="params[1]"
              :model-value="parseInt(params[1].configValue)"
              :style="{ width: '100px' }"
              class="input-demo"
              :min="1"
              :max="30"
              @change="handleChangeNumber"
            />
            天来电优先接入上次客服 :
            <a-switch
              v-if="params[2]"
              :model-value="params[2].configValue === 'enable' ? true : false"
              @change="handleChangeSwitch"
            />
          </a-descriptions-item>
          <a-descriptions-item label="">
            <a-alert>请填写1-30之内的数值</a-alert>
          </a-descriptions-item>

          <a-descriptions-item label="白名单：">
            <a-form-item
              field="whiteList"
              class="label0"
              :rules="rules"
              :validate-trigger="['change', 'input']"
            >
              <a-textarea
                v-model="form.whiteList"
                :style="{ width: '500px' }"
                placeholder="请输入白名单"
                :auto-size="{
                  minRows: 10,
                  maxRows: 10,
                }"
                @input="onInputWhiteList"
              ></a-textarea>
            </a-form-item>
          </a-descriptions-item>
          <a-descriptions-item label="">
            <a-alert
              >提示：一行输入一个号码，多个手机号请换行隔开。白名单账号的各项业务数据不会收录到数据统计中</a-alert
            >
          </a-descriptions-item>

          <a-descriptions-item label="来电数据统计">
            <a-radio-group v-if="params[4]" v-model="params[4].configValue">
              <a-radio value="all">全部</a-radio>
              <a-radio value="10">忽略10秒内通话</a-radio>
            </a-radio-group>
          </a-descriptions-item>
        </a-descriptions>
      </a-form>

      <a-button type="primary" @click="handleSubmit">确定修改</a-button>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    getTenantConfig,
    updateTenantConfig,
  } from '@/api/code-service/organize-center/global-setting/index'
  import { useUserStore } from '@/store'
  import { Message } from '@arco-design/web-vue'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import {
    getWhiteList,
    saveWhiteList,
    clearWhiteList,
  } from '../../../../api/code-service/organize-center'

  // const params = ref({
  //   IncomingCallMethod: 'priority',
  //   PriorityRules: 1,
  //   PriorityRulesEnable: true,
  // })
  const params = ref([])
  let isPass = true

  const form = reactive({
    whiteList: '',
  })

  const handleChangeNumber = (value) => {
    params.value[1].configValue = value
  }

  const handleChangeSwitch = (value) => {
    if (value) {
      params.value[2].configValue = 'enable'
    } else {
      params.value[2].configValue = 'disabled'
    }
  }

  const handleSubmit = async () => {
    try {
      if (!isPass) {
        return
      }
      // eslint-disable-next-line no-constant-condition
      if (form.whiteList) {
        updateTenantConfig(params.value)
        const phone = form.whiteList.split('\n').filter(Boolean)
        await saveWhiteList(phone)
        resGetTenantConfig()
        _getWhiteList()
        Message.success('修改成功')
      } else {
        updateTenantConfig(params.value)
        await clearWhiteList()
        resGetTenantConfig()
        _getWhiteList()
        Message.success('修改成功')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取全局配置
  const resGetTenantConfig = async () => {
    try {
      const { data } = await getTenantConfig()
      params.value = [...data]
    } catch (error) {
      console.log(error)
    }
  }

  const onInputWhiteList = (e) => {
    console.log('e', e)
  }

  const rules = [
    {
      validator: (value, cb) => {
        return new Promise((resolve) => {
          if (value) {
            const phone = value.split('\n')
            const regPhone =
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
            phone.forEach((item) => {
              if (item && !regPhone.test(item)) {
                cb('请输入正确的手机号')
                isPass = false
              } else {
                isPass = true
              }
            })
            resolve()
          }
        })
      },
    },
  ]

  // 定义新增弹框表单
  const questionConfig: IForm = reactive({
    formItems: [
      {
        field: 'phone',
        type: 'textarea',
        label: '接收号码',
        alert: {
          text: '提示：一行输入一个号码，多个手机号请换行隔开。',
        },
        rules: [
          {
            required: true,
            message: '请填写手机号',
          },
          {
            validator: (value, cb) => {
              return new Promise((resolve) => {
                window.setTimeout(() => {
                  const phone = value.split('\n')
                  const regPhone =
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
                  phone.forEach((item) => {
                    if (item && !regPhone.test(item)) {
                      cb('请输入正确的手机号')
                    }
                  })
                  resolve()
                }, 100)
              })
            },
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 8 },
    labelWidth: { span: 0 },
    colLayout: { md: 24 },
  })

  // 设定新增表单数据
  const questionValue = ref({
    phone: '',
  })

  // 更新新增表单数据
  const handleQuestionValue = (value) => {
    questionValue.value = value
  }

  async function _getWhiteList() {
    const { data } = await getWhiteList()
    let str = ''
    data.forEach((_: any, index: any) => {
      if (!index) {
        str = _
      } else {
        str = `${str}\n${_}`
      }
    })
    form.whiteList = str
  }

  onMounted(() => {
    resGetTenantConfig()
    _getWhiteList()
    // params.value.IncomingCallMethod = data
  })
</script>

<style lang="less" scoped>
  .global-setting-box {
    padding: 20px;
  }

  :deep(.arco-alert) {
    width: 500px;
  }

  .label0 {
    margin-bottom: 0;
  }

  :deep(.label0 .arco-form-item-label-col) {
    display: none;
  }
  :deep(.label0 .arco-form-item-wrapper-col) {
    width: 100%;
    flex: 0 0 100%;
  }
</style>
