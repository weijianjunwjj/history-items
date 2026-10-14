<template>
  <MTable
    :loading="loading"
    :table-props="{
      columns,
      data: data.items,
      rowKey: 'id',
      showSelect: true,
      rowSelection: state.rowSelection,
      onSelectionChange,
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
      <!-- <a-row justify="start">
        <a-col :flex="1">
          <a-form
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="客户名称">
                  <a-input
                    v-model="state.params.name"
                    placeholder="请输入客户名称"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col flex="180px">
          <a-space :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row> -->
      <m-form
        v-bind="searchFormConfig"
        v-model="state.params"
        @change-value="handleSearchChangeValue"
      >
        <template #right>
          <MButton v-bind="searchBtnConfig"></MButton>
        </template>
      </m-form>
    </template>
    <template #buttons>
      <MButton v-bind="tableTLBtnConfig"></MButton>
      <!-- <a-button type="primary" @click="onAdd"> <icon-plus /> 新增 </a-button>

      <a-popconfirm content="确定删除勾选的数据吗?" @ok="onDeletes">
        <a-button
          type="primary"
          status="danger"
          :disabled="!state.selectedRowKeys.length"
        >
          <icon-delete />删除
        </a-button>
      </a-popconfirm>

      <a-button
        type="primary"
        status="warning"
        :loading="exportLoading"
        @click="onExport"
      >
        <icon-export />导出
      </a-button> -->
    </template>
    <template #deviceNumber="{ record }">
      <a
        class="deviceNumber"
        @click="
          router.push({
            name: 'codeService_deviceAdmin_deviceAdmin',
            query: {
              customerId: record.id,
            },
          })
        "
      >
        {{ record.deviceNumber }}
      </a>
    </template>
    <template #action="{ record }">
      <MButton
        class="btn-common"
        v-bind="tableActionsBtnConfig"
        :click-params="{ edit: record, delete: record }"
      ></MButton>
    </template>
  </MTable>

  <a-modal
    v-model:visible="modal.visible"
    :on-before-ok="onModalOk"
    @before-close="onModalClose"
  >
    <template #title> {{ modal.title }} </template>
    <main>
      <m-form
        ref="formModelRefs"
        v-model="formModel"
        v-bind="modalConfig"
        @change-value="onEditChangeValue"
      ></m-form>
    </main>
  </a-modal>
  <a-modal v-model:visible="deleteVisible" @ok="onDeletes">
    <template #title> 提示 </template>
    <a-alert type="warning"
      >确定删除{{ state.selectedRowKeys.length }}条数据</a-alert
    >
  </a-modal>
</template>

<script lang="ts" setup name="codeService_customerAdmin">
  import MTable from '@hx/packages/components/m-table'
  import { useAsync } from '@/hooks'
  import {
    getCustomerList,
    addCustomer,
    delCustomer,
    updateCustomer,
    exportCustomer,
  } from '@/api/code-service/prod-center/custom-admn'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { Modal } from '@arco-design/web-vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const app = window.$app

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客户地址',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '设备数量',
      slotName: 'deviceNumber',
      key: 'deviceNumber',
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
    },
  ])

  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
    },
    rowSelection: {
      type: 'checkbox',
      showCheckedAll: true,
    },
    selectedRowKeys: [],
  })

  const modal = reactive({
    title: '',
    type: 1,
    visible: false,
    editRow: {},
  })

  // 初始化新增表单数据
  const formModel = ref({
    name: '',
    address: '',
    contact: '',
    contactPhone: '',
  })

  const exportLoading = ref(false)
  const formModelRefs = ref()

  async function onExport() {
    const { pageNum, pageSize } = state.params
    exportLoading.value = true
    await exportCustomer(
      { pageNum, pageSize },
      `客户_${new Date().getTime()}数据.xlsx`
    )
    exportLoading.value = false
  }

  function clearForm() {
    Object.keys(formModel.value).forEach((key) => {
      formModel.value[key] = undefined
    })

    console.log('formModel.value', formModel.value)
  }

  async function onModalOk(done: (closed: boolean) => void) {
    const value = await formModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      console.log(formModel.value)
      if (modal.type === 1) {
        addCustomer(formModel.value)
          .then((res) => {
            console.log('res', res)
            app.succ('新增成功！')
            query()
            done(true)
          })
          .catch((err) => {
            done(false)
            throw err
          })
      } else {
        const { id } = modal.editRow
        const params = {
          ...formModel.value,
          id,
        }
        updateCustomer(params)
          .then((res) => {
            console.log('res', res)
            app.succ('修改成功！')
            query()
            done(true)
          })
          .catch((err) => {
            done(false)
            throw err
          })
      }
    }
  }
  function onModalClose() {
    modal.visible = false
    formModelRefs.value.resetForm()
  }

  function onEditChangeValue(value: any) {
    formModel.value = value
  }
  // 初始化新增弹框表单
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'name',
        type: 'input',
        label: '客户名称',
        placeholder: '请输入客户名称',
        rules: [{ required: true, message: '请输入客户名称' }],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'address',
        type: 'input',
        label: '客户地址',
        placeholder: '请输入客户地址',
        rules: [{ required: true, message: '请输入客户地址' }],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'contact',
        type: 'input',
        label: '联系人',
        placeholder: '请输入联系人',
        // rules: [{ required: true, message: '请输入联系人' }],
        // trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'contactPhone',
        type: 'input',
        label: '联系人电话',
        placeholder: '请输入联系人电话',
        // rules: [{ required: true, message: '请输入联系人电话' }],
        // trigger: ['change', 'input', 'blur'],
      },
    ],
    colLayout: {
      md: 24,
    },
  })

  const {
    data,
    run: query,
    loading,
  } = useAsync(getCustomerList, {
    initialData: {
      items: [],
      total: 0,
    },
    state,
  })

  function search() {
    console.log('search')
    console.log('state', state)
    query()
  }
  // function reset() {
  //   // console.log('reset')
  //   const excludesArr = ['pageSize', 'pageNum']
  //   Object.keys(state.params).forEach((key) => {
  //     if (!excludesArr.includes(key)) {
  //       state.params[key] = undefined
  //     }
  //   })
  //   query()
  // }
  function onEdit(record: any) {
    console.log('record', record)
    console.log('onEdit')
    modal.editRow = record
    modal.title = '修改客户'
    modal.type = 2
    const { name, address, contact, contactPhone } = record
    formModel.value = {
      name,
      address,
      contact,
      contactPhone,
    }
    console.log('formModel', formModel)
    modal.visible = true
  }
  function onDelete(record: object) {
    console.log(record)
    console.log('onDelete')
    delCustomer([record.id])
      .then((res) => {
        app.succ('删除成功')
        query()
      })
      .catch((err) => {
        app.fail('删除失败')
        throw err
      })
  }

  function onDeletes() {
    const Ids = state.selectedRowKeys
    delCustomer(Ids)
      .then((res) => {
        app.succ('删除成功')
        query()
        state.selectedRowKeys = []
      })
      .catch((err) => {
        app.fail('删除失败')
        throw err
      })
  }

  function onAdd() {
    console.log('onDelete')
    modal.title = '添加客户'
    modal.type = 1
    modal.visible = true
  }

  function onChange(page: number) {
    state.params.pageNum = page
    state.selectedRowKeys = []
    query()
  }

  function onPageSizeChange(size: number) {
    state.params.pageSize = size
    state.selectedRowKeys = []
    query()
  }

  function onSelectionChange(rowKeys: []) {
    state.selectedRowKeys = rowKeys
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'name',
        type: 'input',
        label: '客户名称',
        placeholder: '请输入客户名称',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    state.params.name = value.name
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          search()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          state.params.name = undefined
          query()
        },
      },
    ],
  })

  // 定义删除弹框visible
  const deleteVisible = ref(false)

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => state.selectedRowKeys,
    (newValue) => {
      if (newValue.length !== 0) {
        tableTLBtnConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLBtnConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: onAdd,
      },
      {
        name: 'delete',
        icon: true,
        options: {
          disabled: true,
        },
        clickFunc: () => {
          deleteVisible.value = true
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: onExport,
      },
    ],
  })

  // 定义表格操作栏按钮
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        params: 'edit',
        clickFunc: async ($event, record) => {
          onEdit(record)
        },
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        clickFunc: ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: () => {
              onDelete(record)
            },
          })
        },
        params: 'delete',
      },
    ],
  })

  onMounted(() => {
    console.log('我是demo里的onMounted')
  })
</script>

<style lang="less" scoped>
  .deviceNumber {
    color: #165dff;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
