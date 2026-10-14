<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: productList,
        showSelect: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
        },
        onSelectionChange: handleSelectChange,
      }"
      :state="state"
      :pagination="{
        total: state.params.total,
        hideOnSinglePage: false,
        current: state.params.pageNum,
        pageSize: state.params.pageSize,
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="resGetProducList"
    >
      <template #search>
        <m-form
          v-bind="searchFormConfig"
          v-model="searchParams"
          @change-value="handleSearchChangeValue"
        >
          <template #right>
            <MButton v-bind="searchBtnConfig"></MButton>
          </template>
        </m-form>
      </template>
      <template #buttons>
        <MButton v-bind="tableTLBtnConfig"></MButton>
      </template>
      <template #actions="{ record }">
        <a-space class="btn-common">
          <a-button
            type="text"
            @click="
              router.push({
                name: 'codeService_deviceAdmin',
                query: { model: record.model },
              })
            "
          >
            <template #icon>
              <icon-font type="icon-associated-devices" />
            </template>
            <template #default>关联设备</template>
          </a-button>
          <MButton
            class="btn-common"
            v-bind="tableActionsBtnConfig"
            :click-params="{
              edit: record,
              delete: record,
            }"
          ></MButton>
        </a-space>
      </template>
      <template #description="{ record }">
        <!-- {{ record.description }} -->
        <div v-html="record.description"></div>
      </template>
      <template #imagePath="{ record }">
        <!-- {{ record.description }} -->
        <a-image width="50" :src="record.imagePath" />
      </template>
    </m-table>
    <a-modal
      v-model:visible="addProdModelVisible"
      width="780px"
      unmount-on-close
      :on-before-ok="handleProdModelOk"
      @before-close="handleProdModelCancel"
    >
      <template #title>{{ addProdModelTitle }}</template>
      <m-form
        ref="addProdModelRefs"
        v-bind="addProdModelConfig"
        v-model="addProdModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="deleteProductVisible"
      @ok="handleDeleteProductOk"
      @before-close="handleDeleteProductCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectProductIds.length }}条数据</a-alert
      >
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import _ from 'lodash'
  import {
    getProductList,
    addProductList,
    delProducts,
    getProductInfo,
    updateProducts,
    exportProdAdmin,
    getFAQList,
  } from '@/api/code-service/prod-center/admin/index.ts'
  import {
    getProdCateParent,
    getProdCateChild,
    postParentIds,
  } from '@/api/code-service/prod-center/category/index.ts'
  import { getGuideList } from '@/api/code-service/prod-center/course/index.ts'
  import { Message, Modal } from '@arco-design/web-vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // 定义表格加载中loading
  const loading = ref(false)

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
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品型号',
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: '产品类别',
      key: 'category',
      dataIndex: 'category',
      width: 300,
      ellipsis: true,
      tooltip: true,
    },
    // {
    //   title: '产品价格',
    //   key: 'price',
    //   dataIndex: 'price',
    // },
    // {
    //   title: '产品描述',
    //   key: 'description',
    //   // dataIndex: 'description',
    //   slotName: 'description',
    // },
    {
      title: '产品图片',
      key: 'imagePath',
      // dataIndex: 'imagePath',
      slotName: 'imagePath',
    },
    // {
    //   title: '产品图纸',
    //   key: 'blueprintPath',
    //   slotName: 'blueprintPath',
    // },
    // {
    //   title: '创建时间',
    //   key: 'createTime',
    //   slotName: 'createTime',
    // },
    // {
    //   title: '更新时间',
    //   key: 'createTime',
    //   slotName: 'createTime',
    // },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义产品表格数据
  const productList = ref([])

  // 定义搜索表单数据
  const searchParams = ref({
    name: '',
    model: '',
    categoryId: '',
  })

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  })

  // 获取表格数据
  const resGetProducList = async () => {
    loading.value = true
    const categoryId = []
    if (searchParams.value.categoryId.length) {
      searchParams.value.categoryId.forEach((item) => {
        categoryId.push(item[item.length - 1])
      })
    }
    const { data } = await getProductList(
      _.pickBy({
        ...searchParams.value,
        categoryId,
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    productList.value = data?.list
    state.params.total = data?.total
    loading.value = false
  }

  // 定义教程数据
  const guideList = ref()

  // 获取教程数据
  const resGetGuideList = async () => {
    try {
      const { data } = await getGuideList()
      guideList.value = data.items
    } catch (error) {
      console.log(error)
    }
  }

  // 新增/修改表单数据
  const addProdModelValue = ref({
    name: '',
    model: '',
    categoryIds: [],
    imagePath: '',
    description: '',
    parameter: '',
    guides: [],
    blueprintPath: '',
    faqIds: [],
    instructionDesc: '',
    instruction: [],
    instructionName: '',
  })

  // 定义产品类别选择框数据
  const scascaderList = ref()

  // 获取产品类别选择框数据
  const getScascaderList = async () => {
    try {
      const { data } = await getProdCateParent()
      data.content.forEach(async (item) => {
        item.children = ref()
        const childData = await getProdCateChild({ id: item.id })
        if (childData?.data?.content) {
          item.children.value = childData.data.content
        } else {
          item.disabled = true
        }
      })
      scascaderList.value = data.content
    } catch (error) {
      console.log(error)
    }
  }

  // 定义常见问题选择框数据
  const faqList = ref([])
  // 获取常见问题选择框数据
  const resGetFAQList = async () => {
    const { data } = await getFAQList()
    faqList.value = data.items
  }

  // 定义新增/修改弹框表单
  const addProdModelConfig: IForm = reactive({
    formItems: [
      {
        field: 'name',
        type: 'input',
        label: '产品名称',
        placeholder: '请输入产品名称',
        rules: [
          {
            required: true,
            message: '请填写产品名称',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'model',
        type: 'input',
        label: '产品型号',
        placeholder: '请输入产品型号',
        rules: [
          {
            required: true,
            message: '请填写产品名称',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'categoryIds',
        type: 'scascader',
        label: '产品类别',
        placeholder: '请选择产品类别',
        fieldNames: { value: 'id', label: 'name' },
        options: scascaderList,
        multiple: true,
        rules: [
          {
            required: true,
            message: '请选择产品类别',
          },
        ],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'imagePath',
        type: 'upload',
        label: '产品图片',
        limit: 1,
      },
      {
        field: 'description',
        type: 'quillText',
        label: '产品描述',
        placeholder: '请输入产品描述',
        id: 'description',
      },
      {
        field: 'parameter',
        type: 'quillText',
        label: '技术参数',
        placeholder: '请输入技术参数',
        id: 'parameter',
      },
      {
        field: 'guides',
        type: 'select',
        label: '用户教程',
        fieldNames: { value: 'id', label: 'title' },
        placeholder: '请选择教程',
        multiple: true,
        options: guideList,
      },
      {
        field: 'faqIds',
        type: 'select',
        label: '常见问题',
        fieldNames: { value: 'id', label: 'title' },
        placeholder: '请选择常见问题',
        multiple: true,
        options: faqList,
      },
      {
        field: 'blueprintPath',
        type: 'upload',
        label: '产品图纸',
        limit: 20,
      },
      {
        field: 'instruction',
        type: 'uploadPdf',
        label: '说明书',
        limit: 1,
        alert: {
          text: '优先展示PDF',
        },
      },
      {
        field: 'instructionDesc',
        type: 'quillText',
        label: '说明书',
        placeholder: '请输入说明书',
        id: 'instructionDesc',
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 21 },
    labelWidth: { span: 3 },
    colLayout: { md: 24 },
  })

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'name',
        type: 'input',
        label: '产品名称',
        placeholder: '请输入产品名称',
      },
      {
        field: 'model',
        type: 'input',
        label: '产品型号',
        placeholder: '请输入产品型号',
      },
      {
        field: 'categoryId',
        type: 'scascader',
        label: '产品类别',
        placeholder: '请选择产品类别',
        fieldNames: { value: 'id', label: 'name' },
        options: scascaderList,
        multiple: true,
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          resGetProducList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            name: '',
            model: '',
            categoryId: '',
          }
        },
      },
    ],
  })

  // 定义新增/修改弹框visible
  const addProdModelVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addProdModelRefs = ref()

  // 新增/修改弹窗确定按钮点击事件
  const handleProdModelOk = async (done: (closed: boolean) => void) => {
    const value = await addProdModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      const categoryIds = []
      let blueprintPath = ''
      let blueprintName = ''
      addProdModelValue.value.categoryIds.forEach((item) => {
        categoryIds.push(item[item.length - 1])
      })
      let blueprintPathArr = []
      if (addProdModelValue.value.blueprintPath) {
        blueprintPathArr = JSON.parse(addProdModelValue.value.blueprintPath)
      }
      blueprintPathArr.forEach((item: any) => {
        blueprintPath += `${item.url},`
        blueprintName += `${item.name},`
      })
      let imagePath = ''
      if (addProdModelValue.value.imagePath) {
        imagePath = JSON.parse(addProdModelValue.value.imagePath).url
      }
      let instruction = ''
      let instructionName = ''
      if (addProdModelValue.value.instruction.length !== 0) {
        instruction = addProdModelValue.value.instruction[0].url
        instructionName = addProdModelValue.value.instruction[0].name
      }
      const params = {
        id: addProdModelValue.value.id || '',
        name: addProdModelValue.value.name,
        model: addProdModelValue.value.model,
        categoryIds,
        imagePath: imagePath || '',
        description: addProdModelValue.value.description,
        parameter: addProdModelValue.value.parameter,
        guides: addProdModelValue.value.guides,
        blueprintPath: blueprintPath.substr(0, blueprintPath.length - 1),
        blueprintName: blueprintName.substr(0, blueprintName.length - 1),
        faqIds: addProdModelValue.value.faqIds,
        instructionDesc: addProdModelValue.value.instructionDesc,
        instruction,
        instructionName,
      }
      try {
        if (editProdModel.value) {
          await updateProducts({ ...params })
          done(true)
          handleProdModelCancel()
          resGetProducList()
          Message.success('修改成功')
        } else {
          await addProductList(_.pickBy({ ...params }))
          done(true)
          handleProdModelCancel()
          resGetProducList()
          Message.success('新增成功')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 新增/修改弹窗关闭事件
  const handleProdModelCancel = () => {
    addProdModelVisible.value = false
    addProdModelValue.value = {
      name: '',
      model: '',
      categoryIds: [],
      imagePath: '',
      description: '',
      parameter: '',
      guides: [],
      blueprintPath: '',
      faqIds: [],
      instructionDesc: '',
      instruction: [],
    }
    addProdModelTitle.value = '添加产品'
    editProdModel.value = false
  }

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetProducList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetProducList()
  }

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addProdModelValue.value = value
  }

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 表格选中值
  const selectProductIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectProductIds.value = rowKeys
  }

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => selectProductIds,
    (newValue) => {
      if (newValue.value.length !== 0) {
        tableTLBtnConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLBtnConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 定义删除提示框的visible
  const deleteProductVisible = ref(false)

  // 删除提示框确定事件
  const handleDeleteProductOk = async () => {
    try {
      await delProducts(selectProductIds.value)
      resGetProducList()
      handleDeleteProductCancel()
      tableTLBtnConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteProductCancel = () => {
    deleteProductVisible.value = false
  }

  onMounted(() => {
    resGetProducList()
    getScascaderList()
    resGetGuideList()
    resGetFAQList()
  })

  // 导出事件
  const handleExport = async () => {
    await exportProdAdmin(
      { id: '1515238913246416898' },
      `产品管理_${new Date().getTime()}数据.xlsx`
    )
  }
  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          addProdModelVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        permission: ['product:remove'],
        options: {
          disabled: true,
        },
        clickFunc: () => {
          deleteProductVisible.value = true
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
      },
    ],
  })

  const addProdModelTitle = ref('添加产品')
  const editProdModel = ref(false)

  // 定义表格操作栏按钮
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        params: 'edit',
        clickFunc: async ($event, record) => {
          const { data } = await getProductInfo(record.id)
          const categoryIdsArr = ref([])
          const blueprintPath = []
          if (data.categoryIds) {
            data.categoryIds.forEach(async (item) => {
              const res = await postParentIds({ id: item })
              categoryIdsArr.value.push(res.data)
            })
          }
          if (data.blueprintPath) {
            data.blueprintPath.split(',').forEach((item) => {
              blueprintPath.push({
                url: item,
              })
            })
          }
          if (data.blueprintName) {
            data.blueprintName.split(',').forEach((item, index) => {
              blueprintPath[index].name = item
            })
          }
          let imagePath = ''
          if (data.imagePath) {
            imagePath = JSON.stringify({
              url: data.imagePath.replace('"', '').replace('"', ''),
            })
          }
          let instruction = []
          if (data.instruction) {
            const instructionArr = data.instruction.split('/')
            instruction = [
              {
                url: data.instruction,
                name:
                  data.instructionName ||
                  instructionArr[instructionArr.length - 1],
              },
            ]
          }
          addProdModelValue.value = {
            id: data.id,
            name: data.name || '',
            model: data.model || '',
            categoryIds: categoryIdsArr.value || [],
            imagePath: imagePath || '',
            description: data.description || '',
            parameter: data.parameter || '',
            guides: data.guides || [],
            blueprintPath: JSON.stringify(blueprintPath) || '',
            faqIds: data.faqIds || [],
            instructionDesc: data.instructionDesc || '',
            instruction: instruction || [],
          }
          addProdModelTitle.value = '修改产品'
          editProdModel.value = true
          addProdModelVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        permission: ['product:remove'],
        clickFunc: ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: async () => {
              try {
                await delProducts([record.id])
                resGetProducList()
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

  :deep(.arco-table-container .arco-image-overlay) {
    top: 30% !important;
  }
</style>
