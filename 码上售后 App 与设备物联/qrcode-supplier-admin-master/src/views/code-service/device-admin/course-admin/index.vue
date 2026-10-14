<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: guideList,
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
      :on-refresh="resGetGuideList"
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
        <MButton
          class="btn-common"
          v-bind="tableActionsBtnConfig"
          :click-params="{ edit: record, delete: record }"
        ></MButton>
      </template>
      <template #guidePicUrl="{ record }">
        <a-image width="50" :src="record.guidePicUrl" />
      </template>
      <template #type="{ record }">
        <span v-if="record.type == 1">使用教程</span>
        <span v-if="record.type == 2">维修保养</span>
        <span v-if="record.type == 3">其他</span>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addGuideVisible"
      width="780px"
      unmount-on-close
      :on-before-ok="handleGuideModelOk"
      @before-close="handleGuideCancel"
    >
      <template #title>{{ addGuideTitle }}</template>
      <m-form
        ref="addGuideRefs"
        v-bind="addGuideConfig"
        v-model="addGuideModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="deleteGuideVisible"
      @ok="handleDeleteGuideOk"
      @before-close="handleDeleteGuideCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectGuideIds.length }}条数据</a-alert
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
    getGuideList,
    addGuideList,
    delGuides,
    getGuideInfo,
    exportGuide,
    updateGuide,
  } from '@/api/code-service/prod-center/course/index.ts'
  import { Message, Modal } from '@arco-design/web-vue'

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
      title: '教程标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '教程类型',
      key: 'type',
      slotName: 'type',
    },
    {
      title: '简介',
      key: 'guideDesc',
      dataIndex: 'guideDesc',
      width: 300,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '封面图',
      key: 'guidePicUrl',
      slotName: 'guidePicUrl',
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义产品表格数据
  const guideList = ref([])

  // 定义搜索表单数据
  const searchParams = ref({
    title: '',
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
  const resGetGuideList = async () => {
    loading.value = true
    const { data } = await getGuideList(
      _.pickBy({
        ...searchParams.value,
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    guideList.value = data.items
    state.params.total = data.total
    loading.value = false
  }

  // 新增/修改表单数据
  const addGuideModelValue = ref({
    title: '',
    type: '',
    guideDesc: '',
    guideContent: '',
    guidePicUrl: '',
    sort: 0,
    guideVideoUrl: [],
  })

  // 定义新增/修改弹框表单
  const addGuideConfig: IForm = reactive({
    formItems: [
      {
        field: 'title',
        type: 'input',
        label: '教程标题',
        placeholder: '请输入教程标题',
        rules: [
          {
            required: true,
            message: '请填写教程标题',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'type',
        type: 'select',
        label: '教程类型',
        placeholder: '请选择教程类型',
        options: [
          { value: '1', label: '使用教程' },
          { value: '2', label: '维修保养' },
          { value: '3', label: '其他' },
        ],
        rules: [
          {
            required: true,
            message: '请填写产品名称',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'guideDesc',
        type: 'input',
        label: '简介',
        placeholder: '请输入产品简介',
      },
      {
        field: 'sort',
        type: 'number',
        label: '排序',
        placeholder: '请输入产品排序',
      },
      {
        field: 'guideContent',
        type: 'quillText',
        label: '详情',
        placeholder: '请输入教程详情',
        id: 'guideContent',
      },
      {
        field: 'guidePicUrl',
        type: 'upload',
        label: '封面图',
        limit: 1,
        rules: [
          {
            required: true,
            message: '请添加图片',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'guideVideoUrl',
        type: 'uploadVideo',
        label: '教程视频',
        limit: 1,
        rules: [
          {
            required: true,
            message: '请添加教程视频',
          },
        ],
        trigger: ['change', 'input'],
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
        field: 'title',
        type: 'input',
        label: '教程标题',
        placeholder: '请输入教程标题',
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
          resGetGuideList()
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
  const addGuideVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addGuideRefs = ref()

  // 新增/修改弹窗确定按钮点击事件
  const handleGuideModelOk = async (done: (closed: boolean) => void) => {
    const value = await addGuideRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      let guidePicUrl = ''
      if (addGuideModelValue.value.guidePicUrl) {
        guidePicUrl = JSON.parse(addGuideModelValue.value.guidePicUrl).url
      }
      let guideVideoUrl = ''
      const guideVideoUrlArr = addGuideModelValue.value.guideVideoUrl
      guideVideoUrlArr.forEach((item) => {
        guideVideoUrl += `${item.url},`
      })
      const params = {
        id: addGuideModelValue.value.id,
        guidePicUrl,
        guideVideoUrl: guideVideoUrl.substr(0, guideVideoUrl.length - 1),
        title: addGuideModelValue.value.title,
        guideDesc: addGuideModelValue.value.guideDesc,
        type: addGuideModelValue.value.type,
        guideContent: addGuideModelValue.value.guideContent,
        sort: addGuideModelValue.value.sort,
      }
      try {
        if (editGuideModel.value) {
          await updateGuide({ ...params })
          done(true)
          handleGuideCancel()
          resGetGuideList()
          Message.success('修改成功')
        } else {
          await addGuideList(_.pickBy({ ...params }))
          done(true)
          handleGuideCancel()
          resGetGuideList()
          Message.success('新增成功')
        }
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 新增/修改弹窗关闭事件
  const handleGuideCancel = () => {
    addGuideVisible.value = false
    addGuideModelValue.value = {
      title: '',
      type: '',
      guideDesc: '',
      guideContent: '',
      guidePicUrl: '',
      sort: 0,
      guideVideoUrl: [],
    }
    addGuideTitle.value = '添加教程'
    editGuideModel.value = false
  }

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetGuideList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetGuideList()
  }

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addGuideModelValue.value = value
  }

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 表格选中值
  const selectGuideIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectGuideIds.value = rowKeys
  }

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => selectGuideIds,
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
  const deleteGuideVisible = ref(false)

  // 删除提示框确定事件
  const handleDeleteGuideOk = async () => {
    try {
      await delGuides(selectGuideIds.value)
      resGetGuideList()
      handleDeleteGuideCancel()
      tableTLBtnConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteGuideCancel = () => {
    deleteGuideVisible.value = false
  }

  onMounted(() => {
    resGetGuideList()
  })

  // 导出事件
  const handleExport = async () => {
    await exportGuide({}, `教程_${new Date().getTime()}数据.xlsx`)
  }

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          addGuideVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        options: {
          disabled: true,
        },
        clickFunc: () => {
          deleteGuideVisible.value = true
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
      },
    ],
  })

  // 定义弹框标题和弹框模式
  const addGuideTitle = ref('添加教程')
  const editGuideModel = ref(false)

  // 定义表格操作栏按钮
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        params: 'edit',
        clickFunc: async ($event, record) => {
          const { data } = await getGuideInfo(record.id)
          let guidePicUrl = ''
          const guideVideoUrl = []
          if (data.guidePicUrl) {
            guidePicUrl = JSON.stringify({
              url: data.guidePicUrl.replace('"', '').replace('"', ''),
            })
          }
          if (data.guideVideoUrl) {
            data.guideVideoUrl.split(',').forEach((item) => {
              guideVideoUrl.push({
                url: item,
                name: item.substring(item.lastIndexOf('/') + 1),
              })
            })
          }
          addGuideModelValue.value = {
            id: data.id,
            title: data.title,
            type: data.type,
            sort: data.sort,
            guideDesc: data.guideDesc || '',
            guideContent: data.guideContent || '',
            guidePicUrl: guidePicUrl || '',
            guideVideoUrl: guideVideoUrl || '',
          }
          addGuideTitle.value = '修改教程'
          editGuideModel.value = true
          addGuideVisible.value = true
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
            onOk: async () => {
              try {
                await delGuides([record.id])
                resGetGuideList()
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
</style>
