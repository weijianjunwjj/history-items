<template>
  <MTable
    :loading="loading"
    :table-props="{
      columns,
      data: data.items,
      rowKey: 'id',
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
      <a-row justify="start" class="mb-4">
        <a-col :flex="1">
          <m-form
            ref="searchModelRef"
            v-model="state.params"
            v-bind="searchConfig"
            @change-value="handleSearchChangeValue"
          >
            <!-- <template #right>
              <MButton v-bind="searchBtnConfig"></MButton>
            </template> -->
          </m-form>
        </a-col>
        <a-col flex="140px" class="align-r">
          <a-space :size="18">
            <a-button type="primary" @click="handlequery">
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
      </a-row>
    </template>

    <template #filePath="{ record }">
      <a-button v-if="record.filePath" type="text" @click="scanQR(record)"
        >点击查看</a-button
      >
      <!-- <a-button @click="scanQR(record)">点击查看</a-button> -->
    </template>

    <template #action="{ record }">
      <a-popconfirm
        v-if="record.deviceId"
        :content="`是否确认解绑二维码编号为&quot;${record.batchId}&quot;的设备?`"
        position="left"
        @ok="unbindDevice(record)"
      >
        <!-- <a-button type="text" status="danger">
          <icon-delete /> 解绑设备</a-button
        > -->
        <a-space class="btn-common">
          <a-button type="text">
            <template #icon>
              <icon-font type="icon-unbinding" />
            </template>
            <template #default>解绑设备</template>
          </a-button>
        </a-space>
      </a-popconfirm>

      <a-space v-else class="btn-common">
        <a-button type="text" @click="bindDevice(record)">
          <template #icon>
            <icon-font type="icon-associated-devices" />
          </template>
          <template #default>关联设备</template>
        </a-button>
      </a-space>
      <!-- <a-button v-else type="text" @click="bindDevice(record)">
        <icon-plus /> 关联设备</a-button
      > -->
    </template>
  </MTable>

  <a-modal
    v-model:visible="QRImage.visible"
    class="modal-preview-QRC"
    simple
    :footer="false"
  >
    <div>
      <img class="full-w" :src="QRImage.filePath" alt="" />
    </div>
  </a-modal>
</template>

<script lang="tsx" setup name="codeService_customerAdmin">
  import MTable from '@hx/packages/components/m-table'
  import { useAsync } from '@/hooks'
  import qrcodeApi from '@/api/code-service/prod-center/qrcode'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { parseJwt, downloadByUrl } from '@hx/packages/utils'
  import { Input, Modal, Form, FormItem } from '@arco-design/web-vue'
  /* eslint-disable prefer-destructuring */

  const app = window.$app

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '批次',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: '二维码编号',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: '二维码',
      dataIndex: 'filePath',
      key: 'filePath',
      slotName: 'filePath',
    },
    {
      title: '状态',
      dataIndex: 'stateName',
      key: 'stateName',
    },
    {
      title: '扫码次数',
      dataIndex: 'scanNumber',
      key: 'scanNumber',
    },
    {
      title: '扫码人数',
      dataIndex: 'userNumber',
      key: 'userNumber',
    },
    {
      title: '设备SN',
      dataIndex: 'deviceSn',
      key: 'deviceSn',
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
    },
  ])
  const states = ref([
    {
      label: '已生成',
      value: 0,
    },
    {
      label: '已签发',
      value: 1,
    },
    {
      label: '已激活',
      value: 2,
    },
    {
      label: '已失效',
      value: 3,
    },
  ])
  const state = reactive({
    params: {
      pageNum: 1,
      pageSize: 10,
      batchId: null,
      id: null,
      state: null,
      deviceSn: null,
    },
    rowSelection: {
      type: 'checkbox',
      showCheckedAll: true,
    },
    selectedRowKeys: [],
  })

  const QRImage = reactive({
    filePath: '',
    visible: false,
  })

  const modal = reactive({
    title: '批量生成',
    visible: false,
  })

  // 初始化新增弹框表单
  const searchConfig: IForm = reactive({
    formItems: [
      {
        field: 'batchId',
        type: 'input',
        label: '批次id',
        placeholder: '请输入批次id',
        rules: [
          {
            match: /^\+?[1-9][0-9]*$/,
            message: '请填写数字',
          },
        ],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'id',
        type: 'input',
        label: '二维码编号',
        rules: [
          {
            match: /^\+?[1-9][0-9]*$/,
            message: '请填写数字',
          },
        ],
        placeholder: '请输入完整二维码编号',
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'state',
        type: 'select',
        label: '状态',
        placeholder: '请选择状态',
        trigger: ['change', 'input', 'blur'],
        options: states,
      },
      {
        field: 'deviceSn',
        type: 'input',
        label: '设备SN',
        placeholder: '请输入设备SN',
        trigger: ['change', 'input', 'blur'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  const formModelRefs = ref()

  function scanQR({ filePath }: { filePath: string }) {
    QRImage.visible = true
    QRImage.filePath = filePath
  }

  const {
    data,
    run: query,
    loading,
  } = useAsync(qrcodeApi.detailList, {
    initialData: {
      items: [],
      total: 0,
    },
    manual: true,
    state,
  })

  function bindDevice(record: any) {
    const { id } = record
    console.log('record', record)
    let deviceSn: any = null

    const _onChange = (e) => {
      console.log(e)
      deviceSn = e
    }

    Modal.info({
      title: '绑定设备',
      content: () => (
        <div class="content">
          <FormItem label="设备编号:">
            <Input
              modelValue={deviceSn}
              onChange={_onChange}
              placeholder="请输入设备SN码"
            />
          </FormItem>
        </div>
      ),
      onBeforeOk: (done) => {
        console.log('deviceSn', deviceSn)
        if (deviceSn) {
          done(true)
        } else {
          app.fail('请输入设备SN码')
          done(false)
        }
      },
      onOk: () => {
        qrcodeApi.bindQrcode({ qrcodeId: id, deviceSn }).then(() => {
          query()
          app.succ('绑定成功')
          deviceSn = null
        })
      },
    })
  }
  function unbindDevice({ id }: any) {
    qrcodeApi.unbindQrcode({ qrcodeId: id }).then(() => {
      query()
      app.succ('解绑成功')
    })
  }

  function reset() {
    console.log('reset')
    const excludesArr = ['pageSize', 'pageNum']
    Object.keys(state.params).forEach((key) => {
      if (excludesArr.excludes(key)) {
        state.params[key] = undefined
      }
    })
    // query()
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

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: query,
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: reset,
      },
    ],
  })

  const handlequery = () => {
    state.params.pageNum = 1
    query()
  }

  onMounted(() => {
    console.log('我是demo里的onMounted')
    const route = useRoute()
    state.params.batchId = route.query.id
    query()
  })
</script>

<style lang="less"></style>

<style lang="less" scoped>
  .header-left-top {
    color: @color-def;
  }

  :deep(.arco-card-size-medium .arco-card-body) {
    padding: 0;
  }
</style>
