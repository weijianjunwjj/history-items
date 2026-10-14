<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: prodCateParentList,
        showSelect: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
        },
        // loadMore,
        onSelectionChange: handleSelectChange,
      }"
      :on-refresh="prodCateParent"
    >
      <template #buttons>
        <MButton v-bind="tableTLButtonConfig"></MButton>
        <!-- <a-button type="primary" @click="handleAddProdCate">
          <icon-plus /> 新增
        </a-button>
        <a-button type="primary" status="danger" @click="handleDeleteProdCates">
          <icon-delete />删除
        </a-button> -->
        <!-- <a-button type="primary" status="warning" @click="handleExport">
          <icon-export />导出
        </a-button> -->
      </template>
      <template #enabled="{ record }">
        <a-switch
          v-if="!record.unEditable"
          v-model="record.enabled"
          @change="handleChangeEnabled($event, record)"
        />
      </template>
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #action="{ record }">
        <a-space v-if="!record.unEditable" class="btn-common">
          <MButton
            v-bind="tableActionsButtonConfig"
            :click-params="{ edit: record, delete: record }"
          ></MButton>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addProdCateVisible"
      :on-before-ok="handleAddProdCateOk"
      @before-close="handleAddProdCateCancel"
    >
      <template #title> 新增产品类别 </template>
      <m-form
        ref="addProdCateformModelRefs"
        v-model="addProdCateformModel"
        v-bind="modalConfig"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="editProdCateVisible"
      :on-before-ok="handleEditProdCateOk"
      @before-close="handleEditProdCateCancel"
    >
      <template #title> 修改产品类别 </template>
      <m-form
        ref="editProdCateformModelRefs"
        v-model="editProdCateformModel"
        v-bind="modalConfig"
        @change-value="handleEditChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="deleteProdCateVisible"
      unmount-on-close
      @ok="handleDeleteProdCateOk"
      @before-close="handleDeleteProdCateCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectProdCateIds.length }}条数据</a-alert
      >
    </a-modal>
  </div>
</template>

<script lang="ts" setup name="codeService_prodCenter_prodCate">
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  // import { useAsync } from '@/hooks'
  import {
    getProdCateParent,
    getProdCateChild,
    postAddProdCate,
    deleteAddProdCate,
    postParentIds,
    putPrdoCate,
    downloadReq,
  } from '@/api/code-service/prod-center/category/index.ts'
  import dayjs from 'dayjs'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { Message, Modal } from '@arco-design/web-vue'

  // 定义表格columns
  const columns = reactive([
    {
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '状态',
      key: 'enabled',
      slotName: 'enabled',
    },
    {
      title: '创建时间',
      // dataIndex: 'createTime',
      key: 'createTime',
      slotName: 'createTime',
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
    },
  ])

  // 加载子树
  // const loadMore = async (record, done) => {
  //   try {
  //     const { data } = await getProdCateChild({ id: record.id })
  //     if (data) {
  //       done(data.content)
  //     } else {
  //       done()
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // 定义表格加载状态
  const loading = ref(false)

  // 获取数据 渲染表格
  const prodCateParentList = ref()
  const scascaderList = ref()
  const prodCateParent = async () => {
    // loading.value = true
    // const { data } = await getProdCateParent()
    // prodCateParentList.value = data.content
    // loading.value = false
    try {
      const { data } = await getProdCateParent()
      data.content.forEach(async (item) => {
        item.disabled = true
        item.children = ref()
        const childData = await getProdCateChild({ id: item.id })
        if (childData?.data?.content) {
          item.children.value = childData.data.content
        }
      })
      prodCateParentList.value = data.content
    } catch (error) {
      console.log(error)
    }
    // scascaderList.value = data.content
    // loading.value = false
  }

  const getScascaderList = async () => {
    try {
      const { data } = await getProdCateParent()
      data.content.forEach(async (item) => {
        item.children = ref()
        const childData = await getProdCateChild({ id: item.id })
        if (childData?.data?.content) {
          item.children.value = childData.data.content
        }
      })
      scascaderList.value = data.content
    } catch (error) {
      console.log(error)
    }
  }

  // 定义新增弹框visible
  const addProdCateVisible = ref(false)

  // 新增按钮点击事件
  const handleAddProdCate = () => {
    addProdCateVisible.value = true
  }

  // 初始化新增弹框表单
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'name',
        type: 'input',
        label: '类目名称',
        placeholder: '请输入类目名称',
        rules: [{ required: true, message: '请输入类目名称' }],
        trigger: ['change', 'input'],
      },
      {
        field: 'sort',
        type: 'number',
        label: '排序',
        placeholder: '请输入排序',
      },
      {
        field: 'enabled',
        type: 'radio',
        label: '类目状态',
        options: [
          {
            value: true,
            label: '启用',
          },
          {
            value: false,
            label: '未启用',
          },
        ],
      },
      {
        field: 'parentIndustryId',
        type: 'scascader',
        label: '上级类目',
        placeholder: '请选择上级类目',
        fieldNames: { value: 'id', label: 'name' },
        options: scascaderList,
        strictly: true,
        rules: [{ required: true, message: '请选择类目名称' }],
        trigger: ['change', 'input', 'blur'],
      },
    ],
    colLayout: {
      md: 24,
    },
  })

  // 初始化新增表单数据
  const addProdCateformModel = ref({
    name: '',
    sort: 0,
    enabled: true,
    parentIndustryId: '',
  })

  // 定义新增产品类别ref对象
  const addProdCateformModelRefs = ref()

  // 新增产品类别确定按钮
  const handleAddProdCateOk = async (done: (closed: boolean) => void) => {
    const value = await addProdCateformModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      const params = { ...addProdCateformModel.value }
      if (addProdCateformModel.value.parentIndustryId.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        params.parentIndustryId = addProdCateformModel.value.parentIndustryId[0]
      } else {
        // eslint-disable-next-line prefer-destructuring
        params.parentIndustryId = addProdCateformModel.value.parentIndustryId[0]
        params.pid =
          addProdCateformModel.value.parentIndustryId[
            addProdCateformModel.value.parentIndustryId.length - 1
          ]
      }
      try {
        await postAddProdCate(params)
        done(true)
        prodCateParent()
        getScascaderList()
        handleAddProdCateCancel()
        Message.success('添加成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 新增类别弹框关闭事件
  const handleAddProdCateCancel = () => {
    addProdCateVisible.value = false
    addProdCateformModel.value = {
      name: '',
      sort: 0,
      enabled: true,
      parentIndustryId: '',
    }
  }

  // 删除产品类别
  // const handleDeleteProdCate = async (record) => {
  //   console.log(record)
  //   try {
  //     await deleteAddProdCate([record.id])
  //     prodCateParent()
  //     getScascaderList()
  //     Message.success('删除成功')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // 定义修改弹出框visible
  const editProdCateVisible = ref(false)

  // 初始化修改弹框表单数据
  const editProdCateformModel = ref({
    id: '',
    name: '',
    sort: 0,
    enabled: true,
    parentIndustryId: '',
  })

  // 修改产品类别按钮点击事件
  // const handleEditProdCate = async (record) => {
  //   const { data } = await postParentIds({ id: record.id })
  //   data.splice(data.length - 1)
  //   editProdCateformModel.value = {
  //     id: record.id,
  //     name: record.name,
  //     sort: record.sort,
  //     enabled: record.enabled,
  //     parentIndustryId: data,
  //   }
  //   editProdCateVisible.value = true
  // }

  // 定义修改产品类别ref对象
  const editProdCateformModelRefs = ref()

  // 修改产品类别确定事件
  const handleEditProdCateOk = async (done: (closed: boolean) => void) => {
    const value = await editProdCateformModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      const params = { ...editProdCateformModel.value }
      if (editProdCateformModel.value.parentIndustryId.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        params.parentIndustryId =
          editProdCateformModel.value.parentIndustryId[0]
      } else {
        // eslint-disable-next-line prefer-destructuring
        params.parentIndustryId =
          editProdCateformModel.value.parentIndustryId[0]
        params.pid =
          editProdCateformModel.value.parentIndustryId[
            editProdCateformModel.value.parentIndustryId.length - 1
          ]
      }
      try {
        await putPrdoCate(params)
        done(true)
        prodCateParent()
        getScascaderList()
        handleAddProdCateCancel()
        Message.success('修改成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 修改产品类别弹窗关闭事件
  const handleEditProdCateCancel = () => {
    editProdCateVisible.value = false
    editProdCateformModel.value = {
      id: '',
      name: '',
      sort: 0,
      enabled: true,
      parentIndustryId: '',
    }
  }

  const selectProdCateIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectProdCateIds.value = rowKeys
  }

  // 定义删除提示框的visible
  const deleteProdCateVisible = ref(false)

  // 批量删除产品类别
  const handleDeleteProdCates = () => {
    deleteProdCateVisible.value = true
  }

  // 删除提示框确定事件
  const handleDeleteProdCateOk = async () => {
    try {
      await deleteAddProdCate(selectProdCateIds.value)
      prodCateParent()
      getScascaderList()
      handleDeleteProdCateCancel()
      tableTLButtonConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteProdCateCancel = () => {
    deleteProdCateVisible.value = false
  }

  // 点击switch按钮切换状态
  const handleChangeEnabled = async (value, record) => {
    const { data } = await postParentIds({ id: record.id })
    data.splice(data.length - 1)
    const params = {
      id: record.id,
      name: record.name,
      sort: record.sort,
      enabled: record.enabled,
      parentIndustryId: data,
    }

    if (params.parentIndustryId.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      params.parentIndustryId = params.parentIndustryId[0]
    } else {
      // eslint-disable-next-line prefer-destructuring
      params.parentIndustryId = params.parentIndustryId[0]
      params.pid = record.pid
    }
    try {
      await putPrdoCate(params)
      prodCateParent()
      getScascaderList()
      handleAddProdCateCancel()
      Message.success('修改成功')
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddChangeValue = (value) => {
    addProdCateformModel.value = value
  }

  const handleEditChangeValue = (value) => {
    editProdCateformModel.value = value
  }

  // 导出
  const handleExport = async () => {
    await downloadReq({}, `产品分类_${new Date().getTime()}数据.xlsx`)
  }

  watch(
    () => selectProdCateIds,
    (newValue) => {
      if (newValue.value.length !== 0) {
        tableTLButtonConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLButtonConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 定义表格左上部分按钮
  const tableTLButtonConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: handleAddProdCate,
      },
      {
        name: 'delete',
        icon: true,
        permission: ['productCategory:remove'],
        clickFunc: handleDeleteProdCates,
        options: {
          disabled: true,
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
      },
    ],
  })

  // 定义表格操作栏按钮
  const tableActionsButtonConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        clickFunc: async ($event, record) => {
          const { data } = await postParentIds({ id: record.id })
          data.splice(data.length - 1)
          editProdCateformModel.value = {
            id: record.id,
            name: record.name,
            sort: record.sort,
            enabled: record.enabled,
            parentIndustryId: data,
          }
          editProdCateVisible.value = true
        },
        params: 'edit',
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        permission: ['productCategory:remove'],
        clickFunc: ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: async () => {
              try {
                await deleteAddProdCate([record.id])
                prodCateParent()
                getScascaderList()
                Message.success('删除成功')
              } catch (error) {
                console.log(error)
              }
            },
          })
        },
        params: 'delete',
      },
    ],
  })

  onMounted(() => {
    loading.value = true
    Promise.all([prodCateParent(), getScascaderList()]).then(() => {
      loading.value = false
    })
  })
</script>
