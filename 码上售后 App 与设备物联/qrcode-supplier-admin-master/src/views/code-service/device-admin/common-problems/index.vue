<template>
  <div class="common-problems">
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
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="query"
    >
      <template #buttons>
        <MButton v-bind="tableTLBtnConfig"></MButton>
      </template>

      <template #content="{ record }">
        <div class="rich-textbox" v-html="record.content"></div>
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
      width="780px"
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
    addList,
    getList,
    updateList,
    delList,
  } from '@/api/code-service/prod-center/commons-problems'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { Modal } from '@arco-design/web-vue'

  const app = window.$app

  // content: "发为福建欧韦杰夫为囧放假哦为福建哦为福建我无法就欸哦分"
  // createTime: "2022-06-22 14:38:55"
  // id: "1"
  // sort: 0
  // tenantId: "1498497126920065024"
  // title: "测试"

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      slotName: 'content',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
      width: 200,
    },
  ])

  // 初始化新增弹框表单
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'title',
        id: 'title',
        type: 'input',
        label: '标题',
        placeholder: '请输入标题',
        rules: [{ required: true, message: '请输入标题' }],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'sort',
        type: 'number',
        label: '排序',
        placeholder: '请输入排序',
      },
      {
        field: 'content',
        id: 'content',
        type: 'quillText',
        label: '内容',
        placeholder: '请输入内容',
        rules: [{ required: true, message: '请输入内容' }],
        trigger: ['change', 'input', 'blur'],
      },
    ],
    inputWidth: { span: 21 },
    labelWidth: { span: 3 },
    colLayout: { md: 24 },
  })

  const state = reactive({
    params: {
      deviceId: '',
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
    title: '',
    sort: 0,
    content: '',
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
    initialData: {
      items: [],
      total: 0,
    },
    state,
  })

  function onEdit(record: any) {
    console.log('record', record)
    console.log('onEdit')
    modal.editRow = record
    modal.title = '修改客户'
    modal.type = 2
    const { title, content, sort } = record
    formModel.value = {
      title,
      content,
      sort,
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
        addList(formModel.value)
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
          ...formModel.value,
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
  .common-problems {
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
