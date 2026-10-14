<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: deviceList,
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
      <template #qrcodePath="{ record }">
        <a-button
          v-if="record.qrcodePath"
          type="text"
          @click="handlePreview(record)"
          >点击查看</a-button
        >
      </template>
      <template #agentTenantId="{ record }">
        {{ agentMap[record.agentTenantId] }}
      </template>
      <template #customerId="{ record }">
        {{ customerMap[record.customerId] }}
      </template>
      <template #productId="{ record }">
        {{
          productMap[record.productId] ? productMap[record.productId].name : ''
        }}
      </template>
      <template #actions="{ record }">
        <a-space size="medium" class="btn-common">
          <MButton
            v-bind="tableActionsBtnConfig"
            :click-params="{ edit: record, delete: record }"
          ></MButton>
          <a-button
            v-if="!record.qrcodeId"
            v-permission="['qrcode:device:bind']"
            type="text"
            @click="handleBindDevice(record)"
          >
            <template #icon>
              <icon-font type="icon-binding" />
            </template>
            <template #default>绑码</template>
          </a-button>
          <a-button
            v-if="record.qrcodeId"
            v-permission="['qrcode:device:unbind']"
            type="text"
            @click="handleUnBindDevice(record)"
          >
            <template #icon>
              <icon-font type="icon-unbinding" />
            </template>
            <template #default>解绑</template>
          </a-button>
          <a-button type="text" @click="handleAssignDevice(record)">
            <template #icon>
              <icon-font type="icon-dealer" />
            </template>
            <template #default>分配</template>
          </a-button>
          <a-button type="text" @click="handleSeeDevice(record)">
            <template #icon>
              <icon-eye />
            </template>
            <template #default>查看</template>
          </a-button>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addDeviceVisible"
      unmount-on-close
      :on-before-ok="handleDeviceModelOk"
      @before-close="handleDeviceCancel"
    >
      <template #title>{{ addDeviceTitle }}</template>
      <m-form
        ref="addDeviceRefs"
        v-bind="addDeviceConfig"
        v-model="addDeviceModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="seeDeviceVisible"
      unmount-on-close
      ok-text="关闭"
      hide-cancel
    >
      <template #title>查看</template>
      <m-form
        ref="seeDeviceRefs"
        v-bind="seeDeviceConfig"
        v-model="seeDeviceModelValue"
        @change-value="handleSeeChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="assignmentVisible"
      unmount-on-close
      :on-before-ok="handleAssignmentModelOk"
      @before-close="handleAssignmentCancel"
    >
      <template #title>分配</template>
      <m-form
        ref="assignmentRefs"
        v-bind="assignmentConfig"
        v-model="assignmentValue"
        @change-value="handleAssignChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="bindQrcodeVisible"
      unmount-on-close
      :on-before-ok="handleBindQrcodeOk"
      @before-close="handleBindQrcodeCancel"
    >
      <template #title>绑定二维码</template>
      <a-form ref="bindDviceRefs" :model="qrcodeModalData">
        <a-form-item field="sn" label="设备SN">
          <a-input v-model="qrcodeModalData.sn" readonly />
        </a-form-item>
        <a-form-item
          field="qrcodeUrl"
          label="二维码"
          hide-asterisk
          :rules="[{ required: true, message: '请扫码' }]"
        >
          <a-input
            ref="scanRefs"
            v-model="qrcodeModalData.qrcodeUrl"
            placeholder="请扫码"
            @change="handleBindQrcodeChange"
          />
          <template #extra>
            <a-alert>请使用扫码枪,切勿手动输入</a-alert>
          </template>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="qrcodePathVisible"
      class="modal-preview-QRC"
      simple
      :footer="false"
    >
      <div>
        <img class="full-w" :src="qrcodePath" alt="" />
      </div>
    </a-modal>
    <a-modal
      v-model:visible="deleteDeviceVisible"
      @ok="handleDeleteDeviceOk"
      @before-close="handleDeleteDeviceCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectDeviceIds.length }}条数据</a-alert
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
    exportDevice,
    getDeviceList,
    getAgentChildren,
    getCustomerList,
    addDeviceList,
    getDeviceInfo,
    updateDevice,
    distributeDevice,
    unBind,
    bind,
    delDevice,
  } from '@/api/code-service/prod-center/device'
  import { getProductSimpleList } from '@/api/code-service/prod-center/admin'
  import { Message, Modal } from '@arco-design/web-vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
      width: 70,
    },
    {
      title: '设备SN',
      dataIndex: 'sn',
      key: 'sn',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '产品',
      key: 'productId',
      slotName: 'productId',
      ellipsis: true,
      tooltip: true,
      width: 120,
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
      title: '设备自编码',
      key: 'selfIdentity',
      dataIndex: 'selfIdentity',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '收货地址',
      key: 'deliveryAddress',
      dataIndex: 'deliveryAddress',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '设备图片',
      key: 'deviceImage',
      slotName: 'deviceImage',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '二维码',
      key: 'qrcodePath',
      slotName: 'qrcodePath',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '经销商',
      key: 'agentTenantId',
      slotName: 'agentTenantId',
      ellipsis: true,
      tooltip: true,
      width: 130,
    },
    {
      title: '客户',
      key: 'customerId',
      slotName: 'customerId',
      ellipsis: true,
      tooltip: true,
      width: 130,
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
      width: 300,
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义设备表格数据
  const deviceList = ref([])

  // 获取设备列表
  const resGetDeviceList = async () => {
    // loading.value = true
    const { data } = await getDeviceList(
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

  // 定义产品列表
  const productList = ref()
  // 定义产品列表map
  const productMap = ref({})
  // 获取产品列表
  const resGetProductList = async () => {
    const { data } = await getProductSimpleList()
    if (data) {
      data.forEach((item) => {
        productMap.value[item.id] = {
          name: item.name,
          categoryId: item.categoryId,
        }
      })
    }
    // productList.value = data?.list
  }

  // 获取产品类别下拉框数据
  const resGetProducSimpletList = async () => {
    const { data } = await getProductSimpleList()
    productList.value = data
  }

  // 定义经销商列表
  const agentList = ref([])
  // 定义经销商列表map
  const agentMap = ref({})
  // 获取经销商列表
  const resGetAgentChildren = async () => {
    const { data } = await getAgentChildren()
    agentList.value = data
    data.forEach((item) => {
      agentMap.value[item.tenantId] = item.tenantNick
    })
  }

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
    resGetDeviceList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetDeviceList()
  }

  // 定义qrcodePathVisible
  const qrcodePathVisible = ref(false)

  // 定义qrcodePath
  const qrcodePath = ref('')

  // 点击预览
  const handlePreview = (record) => {
    qrcodePathVisible.value = true
    qrcodePath.value = record.qrcodePath
  }

  // 定义新增/修改弹框visible
  const addDeviceVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addDeviceRefs = ref()

  // 定义弹框标题和弹框模式
  const addDeviceTitle = ref('添加设备')
  const editDeviceModel = ref(false)

  // 新增/修改表单数据
  const addDeviceModelValue = ref({
    id: '',
    sn: '',
    productId: '',
    customerId: '',
    deliveryAddress: '',
    selfIdentity: '',
  })

  // 定义新增/修改弹框表单
  const addDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备SN',
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
        field: 'productId',
        type: 'select',
        label: '产品',
        placeholder: '请选择产品',
        search: true,
        options: productList,
        fieldNames: { value: 'id', label: 'name' },
        rules: [
          {
            required: true,
            message: '请选择产品',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'customerId',
        type: 'select',
        label: '所属客户',
        placeholder: '请选择所属客户',
        search: true,
        options: customerList,
        fieldNames: { value: 'id', label: 'name' },
      },
      {
        field: 'deliveryAddress',
        type: 'autoComplete',
        label: '收货地址',
        placeholder: '请输入收货地址',
      },
      {
        field: 'selfIdentity',
        type: 'input',
        label: '设备自编码',
        placeholder: '请输入设备自编码',
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
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
        if (editDeviceModel.value) {
          await updateDevice({ ...addDeviceModelValue.value })
          done(true)
          handleDeviceCancel()
          pageDataInit()
          Message.success('修改成功')
        } else {
          await addDeviceList(_.pickBy({ ...addDeviceModelValue.value }))
          done(true)
          handleDeviceCancel()
          pageDataInit()
          Message.success('新增成功')
        }
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
      selfIdentity: '',
    }
    addDeviceTitle.value = '添加设备'
    addDeviceConfig.formItems.forEach((item) => {
      item.disabled = false
      item.readonly = false
      item.clear = true
    })
    editDeviceModel.value = false
  }

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addDeviceModelValue.value = value
  }

  // 定义分配表单refs
  const assignmentRefs = ref()

  // 定义分配表单配置
  const assignmentConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备SN',
        readonly: true,
        placeholder: '请输入设备序列号',
      },
      {
        field: 'agentTenantId',
        type: 'select',
        label: '经销商',
        placeholder: '请选择经销商',
        fieldNames: { value: 'tenantId', label: 'tenantNick' },
        options: agentList,
        otherOptions: {
          hideAsterisk: true,
        },
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 18 },
    labelWidth: { span: 4 },
    colLayout: { md: 24 },
  })

  // 定义分配弹框表单数据
  const assignmentValue = ref({
    id: '',
    sn: '',
    agentTenantId: '',
  })

  // 定义分配弹窗Visible
  const assignmentVisible = ref(false)

  // 定义分配弹框确定按钮点击事件
  const handleAssignmentModelOk = async (done: (closed: boolean) => void) => {
    const value = await assignmentRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await distributeDevice({ ...assignmentValue.value })
        handleAssignmentCancel()
        Message.success('配置成功')
        pageDataInit()
        done(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 定义分配弹框关闭事件
  const handleAssignmentCancel = () => {
    assignmentValue.value = {
      id: '',
      sn: '',
      agentTenantId: '',
    }
    assignmentVisible.value = false
  }

  // 分配按钮点击事件
  const handleAssignDevice = (record) => {
    assignmentValue.value = {
      id: record.id,
      sn: record.sn,
      agentTenantId: record.agentTenantId,
    }
    assignmentVisible.value = true
  }

  // 更新分配表单
  const handleAssignChangeValue = (value) => {
    assignmentValue.value = value
  }

  // 解绑
  const handleUnBindDevice = (record) => {
    Modal.confirm({
      title: '确认解绑',
      content: `是否解绑${record.sn}的二维码? `,
      onOk: async () => {
        try {
          await unBind({ id: record.id })
          pageDataInit()
          Message.success('解绑成功')
        } catch (error) {
          console.log(error)
        }
      },
      onCancel: () => {
        console.log('否认删除')
      },
    })
  }

  // 定义绑定二维码visible
  const bindQrcodeVisible = ref(false)

  // 绑定二维码弹框确定按钮
  const handleBindQrcodeOk = async (done: (closed: boolean) => void) => {
    const value = await bindDviceRefs.value.validate()
    if (value) {
      done(false)
      scanRefs.value.focus()
    } else {
      try {
        await bind({ ...qrcodeModalData.value })
        done(true)
        handleBindQrcodeCancel()
        Message.success('绑定成功')
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 输入框变化自动提交
  const handleBindQrcodeChange = async () => {
    try {
      if (qrcodeModalData.value.qrcodeUrl) {
        await bind({ ...qrcodeModalData.value })
        handleBindQrcodeCancel()
        Message.success('绑定成功')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 绑定二维码弹框取消按钮
  const handleBindQrcodeCancel = () => {
    bindDviceRefs.value.resetFields()
    bindDviceRefs.value.clearValidate()
    bindQrcodeVisible.value = false
    pageDataInit()
  }

  // 定义扫码输入框refs
  const scanRefs = ref()

  // 定义绑定弹框refs
  const bindDviceRefs = ref()

  // 绑定二维码按钮点击事件
  const handleBindDevice = async (record) => {
    bindQrcodeVisible.value = true
    qrcodeModalData.value.sn = record.sn
    qrcodeModalData.value.id = record.id
    await nextTick()
    scanRefs.value.focus()
  }

  // 定义绑定二维码表单数据
  const qrcodeModalData = ref({
    id: '',
    sn: '',
    qrcodeUrl: '',
  })

  // 定义查看弹出框visible
  const seeDeviceVisible = ref(false)

  // 定义查看弹出框数据
  const seeDeviceModelValue = ref({
    id: '',
    sn: '',
    productId: '',
    customerId: '',
    deliveryAddress: '',
    selfIdentity: '',
  })

  // 更新分配表单
  const handleSeeChangeValue = (value) => {
    seeDeviceModelValue.value = value
  }

  // 定义查看弹框表单
  const seeDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备SN',
        placeholder: '请输入设备序列号',
        disabled: true,
      },
      {
        field: 'productId',
        type: 'select',
        label: '产品',
        placeholder: '请选择产品',
        disabled: true,
      },
      {
        field: 'customerId',
        type: 'select',
        label: '所属客户',
        placeholder: '请选择所属客户',
        disabled: true,
      },
      {
        field: 'deliveryAddress',
        type: 'autoComplete',
        label: '收货地址',
        placeholder: '请输入收货地址',
        disabled: true,
      },
      {
        field: 'selfIdentity',
        type: 'input',
        label: '设备自编码',
        placeholder: '请输入设备自编码',
        disabled: true,
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 点击查看事件
  const handleSeeDevice = (record) => {
    seeDeviceModelValue.value = {
      id: record.id,
      sn: record.sn,
      productId: record.productId,
      customerId: record.customerId,
      deliveryAddress: record.deliveryAddress,
      selfIdentity: record.selfIdentity,
    }
    seeDeviceVisible.value = true
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
        field: 'productId',
        type: 'select',
        label: '产品',
        placeholder: '请选择产品',
        search: true,
        fieldNames: { value: 'id', label: 'name' },
        options: productList,
      },
      {
        field: 'model',
        type: 'input',
        label: '产品型号',
        placeholder: '请输入产品型号',
      },
      {
        field: 'agentId',
        type: 'select',
        label: '经销商',
        placeholder: '请选择经销商',
        fieldNames: { value: 'tenantId', label: 'tenantNick' },
        options: agentList,
        search: true,
      },
      {
        field: 'bindState',
        type: 'select',
        label: '二维码绑定',
        placeholder: '请选择二维码绑定',
        options: [
          {
            value: 1,
            label: '已绑定',
          },
          {
            value: 2,
            label: '未绑定',
          },
        ],
        search: true,
      },
      {
        field: 'customerId',
        type: 'select',
        label: '客户',
        placeholder: '请选择客户',
        search: true,
        options: customerList,
        fieldNames: { value: 'id', label: 'name' },
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索表单数据
  const searchParams = ref({
    sn: '',
    productId: '',
    model: '',
    agentId: '',
    bindState: '',
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
          resGetDeviceList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            sn: '',
            productId: '',
            model: '',
            agentId: '',
            bindState: '',
          }
        },
      },
    ],
  })

  // 导出事件
  const handleExport = async () => {
    await exportDevice({}, `设备管理_${new Date().getTime()}数据.xlsx`)
  }

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          addDeviceVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        options: {
          disabled: true,
        },
        permission: ['qrcode:device:remove'],
        clickFunc: () => {
          deleteDeviceVisible.value = true
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
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        content: '修改',
        params: 'edit',
        clickFunc: async ($event, record) => {
          const { data } = await getDeviceInfo(record.id)
          addDeviceModelValue.value = {
            id: data.id,
            sn: data.sn,
            productId: data.productId,
            customerId: data.customerId,
            deliveryAddress: data.deliveryAddress,
            selfIdentity: data.selfIdentity,
          }
          addDeviceTitle.value = '修改设备'
          editDeviceModel.value = true
          addDeviceVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        content: '删除',
        params: 'edit',
        permission: ['qrcode:device:remove'],
        clickFunc: async ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: async () => {
              try {
                await delDevice([record.id])
                pageDataInit()
                Message.success('删除成功')
              } catch (error) {
                console.log(error)
              }
            },
          })
        },
      },
    ],
  })

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([
      resGetDeviceList(),
      resGetAgentChildren(),
      resGetProductList(),
      resGetProducSimpletList(),
    ])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 定义删除弹窗visible
  const deleteDeviceVisible = ref(false)

  // 表格选中值
  const selectDeviceIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectDeviceIds.value = rowKeys
  }

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => selectDeviceIds,
    (newValue) => {
      if (newValue.value.length !== 0) {
        tableTLBtnConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLBtnConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 删除提示框确定事件
  const handleDeleteDeviceOk = async () => {
    try {
      await delDevice(selectDeviceIds.value)
      pageDataInit()
      handleDeleteDeviceCancel()
      tableTLBtnConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteDeviceCancel = () => {
    deleteDeviceVisible.value = false
  }

  onMounted(() => {
    if (route.query.model) searchParams.value.model = route.query.model
    if (route.query.customerId) {
      searchParams.value.customerId = route.query.customerId
    }
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

  :deep(.arco-form-item-extra) {
    width: 100%;
  }

  :deep(.arco-table-container .arco-image-overlay) {
    top: 30% !important;
  }
</style>
