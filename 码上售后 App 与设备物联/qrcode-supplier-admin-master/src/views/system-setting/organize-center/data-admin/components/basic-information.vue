<template>
  <m-form
    ref="enterpriseRef"
    v-bind="enterpriseFormConfig"
    v-model="enterpriseParams"
    @change-value="handleEnterpriseChangeValue"
  >
    <template #bottom>
      <a-button type="primary" @click="handleClickSubmit">确定修改</a-button>
    </template>
  </m-form>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import {
    updateEnterprise,
    changeEnterpriseName,
  } from '@/api/code-service/organize-center/data-admin/index.ts'
  import { Message } from '@arco-design/web-vue'

  const userStore = useUserStore()
  const { enterprise } = storeToRefs(userStore)

  // 定义企业账号修改flag
  const enterpriseNameFlag = ref(false)

  // 定义搜索表单refs
  const enterpriseRef = ref()

  // 定义搜索区域表单
  const enterpriseFormConfig: IForm = reactive({
    formItems: [
      // {
      //   field: 'enterpriseName',
      //   type: 'input',
      //   label: '企业账号',
      //   placeholder: '请输入企业账号',
      //   suffix: true,
      //   suffixClick: () => {
      //     enterpriseFormConfig.formItems[0].disabled =
      //       !enterpriseFormConfig.formItems[0].disabled
      //     enterpriseNameFlag.value = !enterpriseNameFlag.value
      //   },
      //   disabled: true,
      //   tipContent: `还有${enterprise.value.enterpriseNameFrequency}次修改次数`,
      //   rules: [
      //     {
      //       required: true,
      //       message: '请填写企业账号',
      //     },
      //   ],
      //   trigger: ['change', 'input'],
      // },
      {
        field: 'enterpriseNick',
        type: 'input',
        label: '企业名称',
        placeholder: '请输入企业名称',
        rules: [
          {
            required: true,
            message: '请填写企业名称',
          },
        ],
        trigger: ['change', 'input'],
      },
      // {
      //   field: 'enterpriseSystemName',
      //   type: 'input',
      //   label: '系统名称',
      //   placeholder: '请输入系统名称',
      //   rules: [
      //     {
      //       required: true,
      //       message: '请填写系统名称',
      //     },
      //   ],
      //   trigger: ['change', 'input'],
      // },
    ],
    labelAlign: 'left',
    inputWidth: { span: 19 },
    labelWidth: { span: 5 },
    colLayout: {
      type: Object,
      default: () => ({
        xl: 24, // >1920 4个
        lg: 24,
        md: 24,
        sm: 24,
        xs: 24,
      }),
    },
  })

  // 定义搜索表单数据
  const enterpriseParams = ref({
    // enterpriseName: enterprise.value.enterpriseName,
    enterpriseNick: enterprise.value.enterpriseNick,
    // enterpriseSystemName: enterprise.value.enterpriseSystemName,
  })

  // 更新搜索表单
  const handleEnterpriseChangeValue = (value) => {
    enterpriseParams.value = value
  }

  // 点击确认修改
  const handleClickSubmit = async () => {
    // console.log(enterpriseNameFlag.value)
    // if (
    //   enterpriseNameFlag.value &&
    //   enterpriseParams.value.enterpriseName !== enterprise.value.enterpriseName
    // ) {
    //   try {
    //     const { data } = await changeEnterpriseName({
    //       ...enterpriseParams.value,
    //     })
    //     console.log(data)
    //     Message.success('修改企业账号成功')
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    try {
      await updateEnterprise({ ...enterpriseParams.value })
      Message.success('修改企业信息成功')
      userStore.getEnterprise()
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }

  .center {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
