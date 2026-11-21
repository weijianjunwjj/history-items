<template>
  <AppPage>
    <div class="order-management">
      <n-card flex-1 rounded-4 class="header mb-def">
        <n-row :gutter="[28, 18]">
          <n-col :span="5">
            <n-form-item label="地区名：">
              <n-select
                :disabled="disabledAreaName"
                v-model:value="searchForm.areaIds"
                :options="options.areaName"
                :placeholder="disabledAreaName ? '先选择服务商' : '请选择地区名'"
                class="full-w"
              />
            </n-form-item>
          </n-col>
          <n-col :span="5">
            <n-form-item label="运单号：">
              <n-input v-model:value="searchForm.waybillCode" placeholder="请输入" clearable />
            </n-form-item>
          </n-col>
          <n-col :span="5">
            <n-form-item label="订单号：">
              <n-input v-model:value="searchForm.orderId" placeholder="请输入" clearable />
            </n-form-item>
          </n-col>
          <n-col :span="9">
            <n-form-item label="日期选择：" path="inputValue">
              <n-date-picker
                v-model:value="searchForm.selectTime"
                type="daterange"
                clearable
                class="full-w"
                format="yyyy-MM-dd"
              />
            </n-form-item>
          </n-col>
          <!-- ------------------------------------- -->
          <template v-if="isAdmin">
            <n-col :span="5">
              <n-form-item label="服务商名：">
                <n-select
                  v-model:value="searchForm.serviceName"
                  :options="options.serviceName"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="出账状态：">
                <n-select
                  v-model:value="searchForm.billStatus"
                  :options="options.settleStatus"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="付款状态：">
                <n-select
                  v-model:value="searchForm.payStatus"
                  :options="options.payStatus"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="9">
              <div flex justify-between>
                <div class="w-half" style="width: 48%">
                  <n-form-item label="订单状态：" class="full-w">
                    <n-select
                      v-model:value="searchForm.orderStatus"
                      :options="options.orderStatus"
                      clearable
                    />
                  </n-form-item>
                </div>

                <div class="w-half" style="width: 48%">
                  <n-form-item label="物流状态：">
                    <n-select
                      v-model:value="searchForm.logisticsStatus"
                      :options="options.logisticsStatus"
                      clearable
                    />
                  </n-form-item>
                </div>
              </div>
            </n-col>
            <n-col :span="5">
              <n-form-item label="包裹状态：" class="full-w">
                <n-select
                  v-model:value="searchForm.packageStatus"
                  :options="options.packageStatusName"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="订单属性：">
                <n-select
                  v-model:value="searchForm.payType"
                  :options="options.payTypes"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="手机号：">
                <n-input v-model:value="searchForm.mobile" placeholder="注册手机号" clearable />
              </n-form-item>
            </n-col>
            <n-col :span="6">
              <n-form-item label="微信支付订单号："   class="label-7">
                <n-input v-model:value="searchForm.transactionId" placeholder="微信支付订单号" clearable />
              </n-form-item>
            </n-col>
            <n-col :span="3">
              <n-space justify="start">
                <n-button type="primary" @click="init">查询</n-button>
                <n-popconfirm @positive-click="exportTable">
                  <template #trigger>
                    <n-button :loading="downloadLoading">导出</n-button>
                  </template>
                  确定要导出？
                </n-popconfirm>
              </n-space>
            </n-col>
          </template>
          <!-- --------------------------------------------------------------- -->
          <template v-else>
            <n-col :span="5">
              <n-form-item label="出账状态：">
                <n-select
                  v-model:value="searchForm.billStatus"
                  :options="options.settleStatus"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="付款状态：">
                <n-select
                  v-model:value="searchForm.payStatus"
                  :options="options.payStatus"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="订单状态：">
                <n-select
                  v-model:value="searchForm.orderStatus"
                  :options="options.orderStatus"
                  clearable
                />
              </n-form-item>
            </n-col>
            <n-col :span="9">
              <div flex justify-between>
                <div style="width: 48%">
                  <n-form-item label="物流状态：">
                    <n-select
                      v-model:value="searchForm.logisticsStatus"
                      :options="options.logisticsStatus"
                      clearable
                    />
                  </n-form-item>
                </div>

                <div style="width: 48%">
                  <n-form-item label="包裹状态：" class="full-w">
                    <n-select
                      v-model:value="searchForm.packageStatus"
                      :options="options.packageStatusName"
                      clearable
                    />
                  </n-form-item>
                </div>
              </div>
            </n-col>

            <n-col :span="5">
              <n-form-item label="手机号：">
                <n-input v-model:value="searchForm.mobile" placeholder="注册手机号" clearable />
              </n-form-item>
            </n-col>
            <n-col :span="5">
              <n-form-item label="微信支付订单号："   class="label-7">
                <n-input v-model:value="searchForm.transactionId" placeholder="微信支付订单号" clearable />
              </n-form-item>
            </n-col>

            <n-col :span="5">
              <n-space>
                <n-button type="primary" @click="init">查询</n-button>
                <n-popconfirm @positive-click="exportTable">
                  <template #trigger>
                    <n-button>导出</n-button>
                  </template>
                  确定要导出？
                </n-popconfirm>
              </n-space>
            </n-col>
          </template>
        </n-row>
      </n-card>
      <n-card flex-1 rounded-4 class="main">
        <n-data-table
          :bordered="true"
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="false"
          :scroll-x="1800"
        />

        <c-page v-model="pagination" />
      </n-card>
    </div>
  </AppPage>
</template>

<script setup>
import {
  formatDate,
  states,
  downloadUrl,
  downloadCSV,
  settlementStatus,
  paymentStatus,
  orderStatus,
  colors,
  getUnpayColor,
  getToken,
  payTypes,
  logisticsStatus,
  firstDayTimestamp,
  commonPageSize,
} from '@/utils'
import api from './api'
import { useLoading } from '@/hooks'
import { useUserStore } from '~/src/store'
import { values } from 'lodash-es'
import { NBadge, NButton } from 'naive-ui'
import qs from 'qs'

const { loading, startLoading, endLoading } = useLoading(false)

const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.isAdmin
})

const options = reactive({
  settleStatus: Object.entries(settlementStatus).map((item) => {
    const [value, label] = item
    return {
      label,
      value,
    }
  }),
  payStatus: Object.entries(paymentStatus).map(([value, label]) => {
    return {
      label,
      value,
    }
  }),
  orderStatus: Object.entries(orderStatus).map(([value, label]) => {
    return {
      label,
      value,
    }
  }),
  logisticsStatus: Object.entries(logisticsStatus).map(([value, label]) => {
    return {
      label,
      value,
    }
  }),
  packageStatusName: [
    {
      label: '正常',
      value: '0',
    },
    {
      label: '异常',
      value: '1',
    },
  ],
  payTypes: [
    {
      label: '全部',
      value: '全部',
    },
    {
      label: '微信支付',
      value: 0,
    },
    {
      label: '微信支付分',
      value: 1,
    },
  ],
})

const disabledAreaName = ref(true)

const searchForm = reactive({
  selectTime: [firstDayTimestamp, Date.now()],
})

const checkIsAdmin = () => {
  if (!isAdmin.value) {
    // 自动选上地区
    disabledAreaName.value = false
    if (options.serviceName0) {
      const areaVos = options.serviceName0[0]?.areaVos
      options.areaName = areaVos?.map((item) => ({
        label: item.areaName,
        value: item.areaId,
      }))

      const allIds = areaVos?.map((_) => _.areaId)?.join(',')
      options.areaName.unshift({
        label: '全部',
        value: allIds,
      })
      searchForm.areaIds = allIds

      init()
    }
  }
}
watch(
  () => isAdmin.value,
  () => {
    checkIsAdmin()
  }
)
checkIsAdmin()

watch(
  () => searchForm.serviceName,
  (v) => {
    searchForm.areaIds = null

    if (!$is0(v)) {
      disabledAreaName.value = false
      const areaVos = options.serviceName0.find(
        (item) => item.roleId == searchForm.serviceName
      )?.areaVos
      console.log('areaVos :>> ', areaVos)
      options.areaName = areaVos?.map((item) => ({ label: item.areaName, value: item.areaId }))
      const allIds = areaVos?.map((_) => _.areaId)?.join(',')
      options.areaName.unshift({
        label: '全部',
        value: allIds,
      })
      searchForm.areaIds = allIds
    }
  }
)

const tableData = ref([])
const columns = ref([
  {
    title: '序号',
    align: 'center',
    fixed: 'left',
    render(row, index) {
      return index + 1
    },
    width: 50,
  },
  {
    title: '地区名',
    key: 'areaName',
    align: 'center',
    fixed: 'left',
    width: 150,
  },
  {
    title: '运单号',
    key: 'waybillCode',
    align: 'center',
    fixed: 'left',
    width: 150,
  },
  {
    title: '订单号',
    key: 'orderId',
    align: 'center',
    width: 70,
    ellipsis: {
      tooltip: true,
    },
    className: 'rtl',
  },
  {
    title: '微信支付订单号',
    key: 'transactionId',
    align: 'center',
    width: 140,
    render: ({ transactionId }) => {
      return h('span', {
        title:transactionId,
        style:'text-overflow: ellipsis;'
      },transactionId)
      // },transactionId ? `...${transactionId.slice(-4)}` : transactionId)
    }
  },
  {
    title: '订单属性',
    key: 'payType',
    align: 'center',
    width: 80,
    render: ({ payType }) => {
      return h('img', {
        src: payTypes[payType],
        style: 'width:20px;height:20px',
      })
    },
  },
  {
    title: '寄件城市',
    key: 'sendCity',
    align: 'center',
  },
  {
    title: '收件城市',
    key: 'recipientCity',
    align: 'center',
  },
  {
    title: '订单金额',
    key: 'orderFee',
    align: 'center',
    render: ({ orderFee }) => {
      if (orderFee != null) {
        return orderFee + '元'
      }
    },
  },
  {
    title: '收款金额',
    key: 'collectionFee',
    align: 'center',
    render: ({ collectionFee }) => {
      if (collectionFee != null) {
        return collectionFee + '元'
      }
    },
  },
  {
    title: '注册手机号',
    key: 'mobile',
    align: 'center',
    width: 120,
  },
  {
    title: '下单时间',
    key: 'createAt',
    align: 'center',
  },
  {
    title: '出账时间',
    key: 'billAt',
    align: 'center',
  },
  {
    title: '未付款天数',
    key: 'unpaidDays',
    align: 'center',
    // render: ({ unpaidDays }) => unpaidDays && unpaidDays + '天',
    render: ({ unpaidDays }) => {
      if (unpaidDays) {
        return h(
          NButton,
          {
            strong: true,
            secondary: true,
            type: getUnpayColor(unpaidDays).type,
            color: getUnpayColor(unpaidDays).bgc,
            textColor: getUnpayColor(unpaidDays).color,
          },
          unpaidDays + '天'
        )
      } else {
      }
    },
  },
  {
    title: '出账状态',
    key: 'billStatusName',
    align: 'center',
    render: ({ billStatusName }) => {
      return h('div', {}, [
        h(NBadge, {
          dot: true,
          class: 'mr-5',
          color: billStatusName === '未出账' ? colors.unresolvedRed : colors.resolvedGreen,
        }),
        h('span', {}, billStatusName),
      ])
    },
  },
  {
    title: '包裹状态',
    key: 'packageStatusName',
    align: 'center',
  },
  {
    title: '付款状态',
    key: 'payStatusName',
    align: 'center',
    fixed: 'right',
    width: 80,
    render: ({ payStatusName }) => {
      return h('div', {}, [
        h(NBadge, {
          dot: true,
          class: 'mr-5',
          color: payStatusName === '未付款' ? colors.unresolvedRed : colors.resolvedGreen,
        }),
        h('span', {}, payStatusName),
      ])
    },
  },
  {
    title: '订单状态',
    key: 'orderStatusName',
    align: 'center',
    fixed: 'right',
    width: 80,
    render: ({ orderStatusName }) => {
      return h('div', {}, [
        h(NBadge, { dot: true, class: 'mr-5', color: colors[orderStatusName] }),
        h('span', {}, orderStatusName),
      ])
    },
  },
  {
    title: '物流状态',
    key: 'logisticsStatusName',
    align: 'center',
    fixed: 'right',
    width: 80,
    render: ({ logisticsStatusName }) => {
      return h('span', {}, logisticsStatusName)
    },
  },
])

const pagination = reactive({
  page: 1,
  pageSize: commonPageSize,
  pageCount: 32,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page) => {
    console.log('page :>> ', page)
    pagination.page = page
    init()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    init()
  },
})

const downloadLoading = ref(false)

async function exportTable() {
  console.log('api.exportListURL :>> ', api.exportListURL)
  downloadLoading.value = true
  // downloadCSV(window.$api_test  + api.exportListURL).then((res) => {
  //   console.log(res)
  //   console.log('下载完成')
  //   downloadLoading.value = false
  // }).catch(() => {
  //   downloadLoading.value = false
  //   $message.error('导出超时，请重试！')
  // })
  const form = JSON.parse(JSON.stringify(searchForm))
  delete form.selectTime
  console.log('form :>> ', form)
  const params = qs.stringify(form)
  console.log('params :>> ', params)
  downloadLoading.value = true
  let $api_test = window.$api_test
  // if (import.meta.env.MODE === 'development') {
  //   $api_test = ''
  // }
  if (params) {
    downloadUrl($api_test + api.exportListURL + `?${params}&saToken=${getToken()}`)
  } else {
    downloadUrl($api_test + api.exportListURL + `?saToken=${getToken()}`)
  }
  setTimeout(() => {
    downloadLoading.value = false
  }, 1000)
}

async function init() {
  startLoading()
  const form = JSON.parse(JSON.stringify(searchForm))
  console.log('form?.selectTime?.length :>> ', form?.selectTime?.length)
  if (form?.selectTime?.length) {
    form.startDate = formatDate(form.selectTime[0])
    form.endDate = formatDate(form.selectTime[1])
  } else {
    form.startDate = null
    form.endDate = null
  }

  if (form.payType == '全部') {
    form.payType = null
  }

  const [err, res] = await $to(
    api.getList({ pageNum: pagination.page, pageSize: pagination.pageSize, ...form })
  )
  if (!err) {
    console.log('res :>> ', res)
    const data = res.data
    pagination.itemCount = data.total
    tableData.value = data.list
  } else {
    console.error('err :>> ', err)
  }
  endLoading()
}

function onQuery() {}

onMounted(async () => {
  init()
  const userStore = useUserStore()
  const { data } = await api.getServiceArea({
    rId: !userStore.isAdmin ? userStore.userInfo.roleId : null,
  })
  console.log('data :>> ', data)
  options.serviceName0 = data
  options.serviceName = data.map((item) => {
    return {
      label: item.roleName,
      value: item.roleId,
    }
  })


  checkIsAdmin()

  console.log('options.serviceName :>> ', options.serviceName)
})
</script>

<style lang="scss">
.order-management {
  .header {
    .n-form-item-label {
      width: 72px;
    }
  }
  .n-form-item {
    display: flex;
    align-items: center;
    label {
      margin-right: 10px;
      line-height: 34px;
    }
    .n-form-item-blank {
      flex: 1;
    }
  }
  .rtl {
    direction: rtl;
  }

  .label-7{
    .n-form-item-label{
      width: 115px;
    }
  }
}
</style>
