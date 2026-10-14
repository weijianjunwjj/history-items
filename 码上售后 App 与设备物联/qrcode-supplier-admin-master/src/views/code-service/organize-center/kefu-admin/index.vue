<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: kfList,
        showSelect: true,
        rowKey: 'id',
      }"
      :on-refresh="pageDataInit"
    >
      <template #actions="{ record }">
        <a-space class="btn-common">
          <a-button type="text" @click="handlePriority(record)">
            <template #icon>
              <icon-font type="icon-user-weights" />
            </template>
            <template #default>设置权重</template>
          </a-button>
        </a-space>
      </template>
      <template #footer>
        <a-alert :show-icon="false" style="margin-top: 20px">
          <li>客服账号管理请在 （组织管理->账号管理） 中操作。</li>
          <li>本页面用于给客服分配权重。</li>
        </a-alert>
      </template>
    </m-table>
    <a-modal
      v-model:visible="priorityVisible"
      :on-before-ok="handlePriorityOk"
      @before-close="handlePriorityCancel"
    >
      <template #title>设定权重</template>
      <m-form
        ref="priorityRefs"
        v-bind="priorityConfig"
        v-model="priorityValue"
        @change-value="handlePriorityValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import {
    getKfList,
    updatePriority,
  } from '@/api/code-service/prod-center/customerService/index.ts'
  // import { Message } from '@arco-design/web-vue'

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
      width: 100,
    },
    {
      title: '账号',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '姓名',
      key: 'nickName',
      dataIndex: 'nickName',
    },
    {
      title: '权重',
      key: 'priority',
      dataIndex: 'priority',
    },
    {
      title: '组别',
      key: '',
      dataIndex: '',
      width: 200,
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义客服表格数据
  const kfList = ref([])

  // 获取客服列表
  const resGetKfList = async () => {
    // loading.value = true
    const { data } = await getKfList()
    kfList.value = data
  }

  // 权重按钮点击事件
  const handlePriority = (record) => {
    priorityValue.value = {
      userId: record.userId,
      nickName: record.nickName,
      priority: record.priority,
    }
    priorityVisible.value = true
  }

  // 定义设定权重弹框refs对象
  const priorityRefs = ref()

  // 定义设定权重弹框表单
  const priorityConfig: IForm = reactive({
    formItems: [
      {
        field: 'nickName',
        type: 'input',
        label: '客服姓名',
        readonly: true,
        disabled: true,
        clear: false,
      },
      {
        field: 'priority',
        type: 'number',
        label: '设置权重',
        mode: 'button',
        alert: {
          text: '权重越高，越优先接收通话',
        },
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 设定权重表单数据
  const priorityValue = ref({
    userId: '',
    nickName: '',
    priority: 0,
  })

  // 更新设定权重表单数据
  const handlePriorityValue = (value) => {
    priorityValue.value = value
  }

  // 定义设定权重弹框visible
  const priorityVisible = ref(false)

  // 设定权重表单确定事件
  const handlePriorityOk = async (done: (closed: boolean) => void) => {
    const value = await priorityRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await updatePriority({ ...priorityValue.value })
        handlePriorityCancel()
        pageDataInit()
        done(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 设定权重表单取消事件
  const handlePriorityCancel = () => {
    // priorityValue.value = {
    //   userId: '',
    //   nickName: '',
    //   priority: ,
    // }
    priorityRefs.value.resetForm()
    priorityVisible.value = false
  }

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetKfList()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
  })
</script>

<style lang="less" scoped>
  :deep(.work-order-search-box) {
    .arco-card-body {
      padding: 0;
    }
  }

  :deep(.arco-image-error) {
    background-color: transparent;
  }

  .wrapper-container {
    background: #fff;
    padding: 30px 30px 0;
    margin-bottom: 32px;
  }
</style>
