<template>
  <div class="workOrder-type">
    <MTable
      :loading="loading"
      :table-props="{
        columns,
        data: data,
        rowKey: 'id',
      }"
      :state="state"
      :on-refresh="query"
    >
      <template #buttons>
        <MButton v-bind="tableTLBtnConfig"></MButton>
      </template>

      <template #content="{ record }">
        <div class="rich-textbox" v-html="record.content"></div>
      </template>
      <template #createTime="{ record }">
        {{ $moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
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
      unmount-on-close
      width="580px"
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
      <a-alert type="info"
        >确定删除{{ state.selectedRowKeys.length }}条数据</a-alert
      >
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { useAsync } from '@/hooks'
  import {
    getList,
    delList,
    addList,
    updateList,
  } from '@/api/code-service/wordOrder-admin/workOrder-type'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { Modal } from '@arco-design/web-vue'

  const app = window.$app

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '工单类型',
      dataIndex: 'ticketType',
      key: 'ticketType',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      slotName: 'createTime',
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
    },
  ])

  // 初始化新增弹框表单
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'worktype',
        type: 'input',
        label: '工单类型',
        placeholder: '请输入工单类型',
        rules: [{ required: true, message: '请输入工单类型' }],
        trigger: ['change', 'input', 'blur'],
      },
    ],
    inputWidth: { span: 20 },
    labelWidth: { span: 4 },
    colLayout: { md: 24 },
  })

  const state = reactive({
    params: {},
    rowSelection: {
      type: 'checkbox',
      showCheckedAll: true,
    },
    selectedRowKeys: [],
  })

  const modal = reactive({
    worktype: '',
    type: 1,
    visible: false,
    editRow: {},
  })

  // 初始化新增表单数据
  const formModel = ref({
    worktype: '',
  })

  const formModelRefs = ref()

  function onEditChangeValue(value: any) {
    formModel.value = value
  }

  const {
    data,
    run: query,
    loading,
  } = useAsync(getList, {
    initialData: [],
    state,
  })

  function onEdit(record: any) {
    modal.editRow = record
    modal.title = '修改客户'
    modal.type = 2
    const { ticketType } = record
    formModel.value = {
      worktype: ticketType,
    }
    console.log('formModel', formModel)
    modal.visible = true
  }
  function onDelete(record: object) {
    console.log(record)
    console.log('onDelete')
    const params = [record.id]
    delList(params)
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
    delList(Ids)
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

  async function onModalOk(done: (closed: boolean) => void) {
    const value = await formModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      console.log(formModel.value)
      if (modal.type === 1) {
        addList({
          ticketType: formModel.value.worktype,
          createTime: new Date().getTime(),
        })
          .then((res) => {
            console.log('res', res)
            app.succ('新增成功！')
            query()
            done(true)
          })
          .catch((err) => {
            done(false)
            // app.fail('失败！')
            throw err
          })
      } else {
        const { id } = modal.editRow
        const params = {
          ticketType: formModel.value.worktype,
          id,
        }
        updateList(params)
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
    clearForm()
  }
  function clearForm() {
    Object.keys(formModel.value).forEach((key) => {
      formModel.value[key] = undefined
    })

    console.log('formModel.value', formModel.value)
  }
  function onAdd() {
    modal.title = '添加问题'
    modal.type = 1
    modal.visible = true
  }

  function onChange(page: number) {
    state.params.pageNum = page
    query()
  }

  function onPageSizeChange(size: number) {
    state.params.pageSize = size
    query()
  }
  function onSelectionChange(rowKeys: []) {
    state.selectedRowKeys = rowKeys
  }

  // 定义删除弹框的visible
  const deleteVisible = ref(false)

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
        clickFunc: async ($event, record) => {
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

<style lang="less">
  .workOrder-type {
    .rich-textbox {
      max-height: 22px;
      box-sizing: border-box;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 1; //行数
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
    p {
      margin: 0;
    }

    .arco-table-td {
      img {
        max-width: 30%;
      }
    }
  }
</style>
