<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: deviceList,
        showSelect: true,
        rowKey: 'id',
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
      :on-refresh="pageDataInit"
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
      <template #deviceImage="{ record }">
        <a-image width="50" :src="record.deviceImage" />
      </template>
      <template #deviceTenantId="{ record }">
        {{ parentMap[record.deviceTenantId] }}
      </template>
      <template #qrcodeUrl="{ record }">
        <a-button
          v-if="record.qrcodeUrl"
          type="text"
          @click="handlePreview(record)"
          >点击查看</a-button
        >
      </template>
      <template #customerId="{ record }">
        {{ customerMap[record.customerId] }}
      </template>
      <template #actions="{ record }">
        <MButton
          class="btn-common"
          v-bind="tableActionsBtnConfig"
          :click-params="{ edit: record, delete: record }"
        ></MButton>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addDeviceVisible"
      unmount-on-close
      :on-before-ok="handleDeviceModelOk"
      @before-close="handleDeviceCancel"
    >
      <template #title>修改设备</template>
      <m-form
        ref="addDeviceRefs"
        v-bind="addDeviceConfig"
        v-model="addDeviceModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <!-- <a-modal v-model:visible="qrcodePathVisible" :width="1200" :footer="false">
      <template #title> 查看二维码 </template>
      <div style="text-align: center">
        <img :src="qrcodePath" style="width: 800px" />
      </div>
    </a-modal> -->

    <a-modal v-model:visible="qrcodePathVisible" simple :footer="false">
      <div>
        <img class="full-w" :src="qrcodePath" alt="" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import _ from 'lodash'
  import {
    exportOtherDevice,
    getOtherDeviceList,
    getCustomerList,
    getOtherDeviceInfo,
    updateOtherDevice,
    getParents,
  } from '@/api/code-service/prod-center/otherDevice/index.ts'
  import { Message } from '@arco-design/web-vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store'

  const userStore = useUserStore()
  const { agentParents } = storeToRefs(userStore)

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
      title: '设备SN',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '产品',
      key: 'deviceName',
      dataIndex: 'deviceName',
      width: 150,
    },
    {
      title: '产品类别',
      key: 'categoryName',
      dataIndex: 'categoryName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '收货地址',
      key: 'deliveryAddress',
      dataIndex: 'deliveryAddress',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '设备图片',
      key: 'deviceImage',
      slotName: 'deviceImage',
    },
    {
      title: '二维码',
      key: 'qrcodeUrl',
      slotName: 'qrcodeUrl',
    },
    {
      title: '设备来源',
      key: 'deviceTenantId',
      slotName: 'deviceTenantId',
    },
    {
      title: '客户',
      key: 'customerId',
      slotName: 'customerId',
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义设备表格数据
  const deviceList = ref([])

  // 获取设备列表
  const resGetOtherDeviceList = async () => {
    // loading.value = true
    const { data } = await getOtherDeviceList(
      _.pickBy({
        ...searchParams.value,
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    data.items.forEach((item) => {
      if (item.qrcodeId) {
        item.lockFlag = true
      } else {
        item.lockFlag = false
      }
    })
    deviceList.value = data.items
    state.params.total = data.total
  }

  // 定义父租户列表
  const parents = ref([])
  // 定义父租户列表map
  const parentMap = ref({})

  const resGetParents = async () => {
    const { data } = await getParents()
    parents.value = data
    parents.value.forEach((item) => {
      parentMap.value[item.tenantId] = item.tenantNick
    })
  }
  // // 定义经销商列表
  // const agentList = ref([])
  // // 定义经销商列表map
  // const agentMap = ref({})
  // // 获取经销商列表
  // const resGetAgentChildren = async () => {
  //   const { data } = await getAgentChildren()
  //   agentList.value = data
  //   data.forEach((item) => {
  //     agentMap.value[item.tenantId] = item.tenantNick
  //   })
  // }

  // 定义客户列表
  const customerList = ref([])
  // 定义客户列表map
  const customerMap = ref({})
  // 获取客户列表
  const resGetCustomerList = async () => {
    const { data } = await getCustomerList()
    customerList.value = data.items
    data.items.forEach((item) => {
      customerMap.value[item.id] = item.name
    })
  }

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  })

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetOtherDeviceList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetOtherDeviceList()
  }

  // 定义qrcodePathVisible
  const qrcodePathVisible = ref(false)

  // 定义qrcodePath
  const qrcodePath = ref(false)

  // 点击预览
  const handlePreview = (record) => {
    qrcodePathVisible.value = true
    qrcodePath.value = record.qrcodeUrl
  }

  // 定义新增/修改弹框visible
  const addDeviceVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addDeviceRefs = ref()

  // 新增/修改表单数据
  const addDeviceModelValue = ref({
    id: '',
    sn: '',
    productId: '',
    customerId: '',
    deliveryAddress: '',
  })

  // 定义新增/修改弹框表单
  const addDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备SN',
        disabled: true,
        placeholder: '请输入设备序列号',
        rules: [
          {
            required: true,
            message: '请填写设备序列号',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'customerId',
        type: 'select',
        label: '所属客户',
        placeholder: '请选择所属客户',
        options: customerList,
        fieldNames: { value: 'id', label: 'name' },
      },
      {
        field: 'deliveryAddress',
        type: 'autoComplete',
        label: '收货地址',
        placeholder: '请输入收货地址',
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 新增/修改弹窗确定按钮点击事件
  const handleDeviceModelOk = async (done: (closed: boolean) => void) => {
    const value = await addDeviceRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await updateOtherDevice({ ...addDeviceModelValue.value })
        done(true)
        handleDeviceCancel()
        pageDataInit()
        Message.success('修改成功')
        done(true)
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 新增/修改弹窗关闭事件
  const handleDeviceCancel = () => {
    addDeviceVisible.value = false
    addDeviceModelValue.value = {
      sn: '',
      productId: '',
      customerId: '',
      deliveryAddress: '',
    }
  }

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addDeviceModelValue.value = value
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
        field: 'deviceTenantId',
        type: 'select',
        label: '设备厂家',
        options: agentParents,
        fieldNames: { value: 'tenantId', label: 'tenantNick' },
        placeholder: '请选择设备厂家',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索表单数据
  const searchParams = ref({
    sn: '',
    deviceTenantId: '',
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          resGetOtherDeviceList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            sn: '',
            deviceTenantId: '',
          }
        },
      },
    ],
  })

  // 导出事件
  const handleExport = async () => {
    await exportOtherDevice({}, `其他设备_${new Date().getTime()}数据.xlsx`)
  }

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      // {
      //   name: 'newAdd',
      //   icon: true,
      //   clickFunc: () => {
      //     addDeviceVisible.value = true
      //   },
      // },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
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
        content: '修改',
        params: 'edit',
        clickFunc: async ($event, record) => {
          const { data } = await getOtherDeviceInfo({ id: record.id })
          addDeviceModelValue.value = {
            id: data.id,
            sn: data.sn,
            productId: data.productId,
            customerId: data.customerId,
            deliveryAddress: data.deliveryAddress,
          }
          addDeviceVisible.value = true
        },
      },
    ],
  })

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([
      resGetOtherDeviceList(),
      resGetParents(),
      // resGetAgentChildren(),
      // resGetProductList(),
    ])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
    resGetCustomerList()
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
