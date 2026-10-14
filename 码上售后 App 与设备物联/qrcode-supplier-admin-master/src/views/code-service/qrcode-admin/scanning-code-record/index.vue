<template>
  <MTable
    :loading="loading"
    :table-props="{
      columns,
      data: data.items,
      rowKey: 'id',
    }"
    :state="state"
    :pagination="{
      total: data.total,
      hideOnSinglePage: false,
      current: state.params.pageNum,
      pageSize: state.params.pageSize,
      onChange,
      onPageSizeChange,
    }"
    :on-refresh="query"
  >
    <template #search>
      <m-form
        ref="searchModelRef"
        v-model="state.params"
        v-bind="searchFormConfig"
        @change-value="handleSearchChangeValue"
      >
        <template #right>
          <MButton v-bind="searchBtnConfig"></MButton>
        </template>
      </m-form>
    </template>
    <template #deviceImage="{ record }">
      <a-image width="50" :src="record.deviceImage" />
    </template>
  </MTable>
</template>

<script lang="ts" setup name="codeService_userAdmin">
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { useAsync } from '@/hooks'
  import { scanRecordList } from '@/api/code-service/video-connection'

  const route = useRoute()

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '用户手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备图片',
      slotName: 'deviceImage',
      key: 'deviceImage',
    },
    {
      title: '设备SN',
      dataIndex: 'deviceSn',
      key: 'deviceSn',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ])

  const state = reactive({
    params: {
      sn: route.query.sn,
      phone: route.query.userName,
      pageNum: 1,
      pageSize: 10,
    },
  })

  const {
    data,
    run: query,
    loading,
  } = useAsync(scanRecordList, {
    initialData: {
      items: [],
      total: 0,
    },
    state,
  })

  function onChange(page: number) {
    state.params.pageNum = page
    query()
  }

  function onPageSizeChange(size: number) {
    state.params.pageSize = size
    query()
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备SN',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'phone',
        type: 'input',
        label: '手机号',
        placeholder: '请输入手机号',
        rules: [
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
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    state.params = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          query()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          state.params = {
            sn: '',
            phone: '',
            pageNum: 1,
            pageSize: 10,
          }
        },
      },
    ],
  })
</script>

<style lang="less" scoped>
  :deep(.arco-image-error) {
    display: inline-block !important;
  }
</style>
