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
      onChange,
      onPageSizeChange,
    }"
    :on-refresh="init"
  >
    <template #search>
      <a-row justify="start" class="mb-4">
        <a-col :flex="1">
          <a-row>
            <div class="mb-2 fs-5 header-left-top">
              已用配额：
              {{
                parseInt(counts.count0) +
                parseInt(counts.count1) +
                parseInt(counts.count3)
              }}
              / {{ totalCounts }}
            </div>
          </a-row>
          <a-row>
            <div class="mb-2 fs-5 header-left-top">
              已生成/已签发/已激活/已失效：
              {{ counts.count0 }} / {{ counts.count1 }} / {{ counts.count2 }} /
              {{ counts.count3 }}
            </div>
          </a-row>
        </a-col>
        <a-col flex="180px">
          <a-space :size="18">
            <a-button type="primary" @click="batchAdd">
              <template #icon>
                <icon-plus />
              </template>
              批量生成
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </template>

    <template #action="{ record }">
      <MButton
        class="btn-common"
        v-bind="buttonConfig"
        :click-params="{ add: record }"
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
        @change-value="formModel = $event"
      ></m-form>
    </main>
  </a-modal>
</template>

<script lang="ts" setup name="codeService_customerAdmin">
  import MTable from '@hx/packages/components/m-table'
  import { useAsync } from '@/hooks'
  import qrcodeApi, {
    getQrcodeQuota,
  } from '@/api/code-service/prod-center/qrcode'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { parseJwt, downloadByUrl } from '@hx/packages/utils'
  import { useUserStore } from '@/store'

  /* eslint-disable prefer-destructuring */

  const app = window.$app
  const totalCounts = ref(0)
  const buttonConfig: IButton = {
    buttonItems: [
      {
        name: 'detail',
        icon: true,
        type: 'text',
        clickFunc: async (e: any, record: any) => {
          app.$router.push({
            name: 'codeService_qrcodeAdmin_qrcodeDetail',
            query: { id: record.id },
          })
        },
        params: 'add',
      },
      {
        name: 'export',
        icon: true,
        type: 'text',
        params: 'add',
        clickFunc: async (e: any, record: any) => {
          const { id } = record
          const jwt = parseJwt()
          const tenantId = jwt.enterprise_id.toString()
          const url = `${window.SITE_CONFIG.VITE_QRCODE_DOWNLOAD_URL}/${tenantId}/qrcode/${id}/${id}.zip`
          downloadByUrl({ url, target: '_self', fileName: id })
        },
      },
    ],
  }

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '批次ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '生成数量',
      dataIndex: 'generateNumber',
      key: 'generateNumber',
      width: 100,
    },

    {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '已使用数量',
      dataIndex: 'bindNumber',
      key: 'bindNumber',
      width: 120,
    },
    {
      title: '模板',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      key: 'action',
      title: '操作',
      slotName: 'action',
    },
  ])

  const state = reactive({
    params: {
      orderByColumn: 'id',
      isAsc: 'desc',
      pageNum: 1,
      pageSize: 10,
    },
    rowSelection: {
      type: 'checkbox',
      showCheckedAll: true,
    },
    selectedRowKeys: [],
  })

  const counts = reactive({
    count0: 0,
    count1: 0,
    count2: 0,
    count3: 0,
  })

  const count4 = computed(() => {
    return Object.values(counts).reduce((acr, cur) => {
      return Number(acr) + Number(cur)
    })
  })

  const modal = reactive({
    title: '批量生成',
    visible: false,
  })

  // 初始化新增表单数据
  const formModel = ref({
    generateNumber: '',
    templateId: '',
  })
  const templates = ref([])

  // 初始化新增弹框表单
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'generateNumber',
        type: 'input',
        label: '生成数量',
        placeholder: '请输入生成数量',
        rules: [{ required: true, message: '请输入生成数量' }],
        trigger: ['change', 'input', 'blur'],
      },
      {
        field: 'templateId',
        type: 'select',
        label: '选择模板',
        placeholder: '请选择模板',
        rules: [{ required: true, message: '请选择模板' }],
        trigger: ['change', 'input', 'blur'],
        fieldNames: { value: 'id', label: 'name' },
        options: templates,
      },
      {
        field: 'remark',
        type: 'textarea',
        label: '备注',
        placeholder: '请输入二维码备注',
      },
    ],
    colLayout: {
      md: 24,
    },
  })

  const formModelRefs = ref()

  function clearForm() {
    Object.keys(formModel.value).forEach((key) => {
      formModel.value[key] = undefined
    })
  }

  function batchAdd() {
    modal.visible = true
  }

  async function onModalOk(done: (closed: boolean) => void) {
    const value = await formModelRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      const max = Number(totalCounts.value) - Number(count4.value)
      const input = parseInt(formModel.value.generateNumber)
      if (input > max) {
        done(false)
        return app.fail(`生成数量不能超出${max}`)
      }

      qrcodeApi
        .batchAdd(formModel.value)
        .then((res) => {
          console.log('res', res)
          app.succ('新增成功！')
          getListAndCount()
          done(true)
        })
        .catch((err) => {
          done(false)
          throw err
        })
    }
  }

  function getListAndCount() {
    query()
    countQrcode()
  }
  function onModalClose() {
    modal.visible = false
    clearForm()
  }

  const {
    data,
    run: query,
    loading,
  } = useAsync(qrcodeApi.batchList, {
    initialData: {
      items: [],
      total: 0,
    },
    state,
  })

  function countQrcode() {
    qrcodeApi.countQrcode().then((res) => {
      const { data: _data } = res
      counts.count0 = _data[0]
      counts.count1 = _data[1]
      counts.count2 = _data[2]
      counts.count3 = _data[3]
    })
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

  const init = () => {
    query()
    countQrcode()
    qrcodeApi.listTemplate().then((res) => {
      templates.value = res.data
    })
    const id = useUserStore().enterprise.enterpriseId
    getQrcodeQuota(id).then((res) => {
      console.log('res', res)
      const { configValue } = res.data
      totalCounts.value = configValue
    })
  }
  onMounted(() => {
    init()
  })
</script>

<style lang="less" scoped>
  .header-left-top {
    color: @color-def;
  }
</style>
