<template>
  <AppPage>
    <div class="order-management">
      <n-card flex-1 rounded-4 class="header mb-def">
        <n-row :gutter="[28, 18]">
            <n-col :span="8">

            </n-col>
          <n-col :span="8">
            <div class="full-w flex">
              <n-input class="flex-1" v-model:value="phoneOrName" clearable placeholder="请输入手机号/服务商名" style="flex:1" />
              <n-button type="primary" class="w-60 ml-5" @click="query">查询</n-button>
            </div>
          </n-col>
        </n-row>
      </n-card>
      <n-card flex-1 rounded-4 class="main">
        <n-data-table
          :bordered="true"
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="false"
        />

       <c-page v-model="pagination" />
      </n-card>
    </div>
  </AppPage>
</template>

<script setup>
import { reactive } from 'vue'
import { states, downloadUrl, settlementStatus, paymentStatus, orderStatus,mchType,commonPageSize } from '@/utils'
import api from './api'
import { useLoading } from '@/hooks'
const { loading, startLoading, endLoading } = useLoading(false)


const options = reactive({
  regionNames: [],
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
})


const phoneOrName = ref()

const tableData = ref([])
const columns = ref([
  {
    title: '序号',
    key: 'id',
    align: 'center',
    fixed: 'left',
  },
  {
    title: '服务商名',
    key: 'name',
    align: 'center',
    fixed: 'left',
  },
  {
    title: '手机号',
    key: 'mobile',
    align: 'center',
    fixed: 'left',
  },
  {
    title: '类型',
    key: 'type',
    align: 'center',
    render:(row)=>{
      return mchType[row.type]
    }
  },
  {
    title: 'appid',
    key: 'appId',
    align: 'center',
  },
  {
    title: '商户号',
    key: 'mchId',
    align: 'center',
  },
  {
    title: '子商户号',
    key: 'subMchId',
    align: 'center',
  },
  {
    title: '子商户号appid',
    key: 'subAppId',
    align: 'center',
  },
  {
    title: '归属地区',
    key: 'name',
    align: 'center',
  },
  {
    title: '分账配置',
    key: 'recipients',
    align: 'center',
    render:(row)=>{
      let recipients = null
      try {
        const obj = JSON.parse(row.recipients)
        if(obj){
          recipients = obj[0]?.name
        }
      } catch (error) {
        console.error(error)
      }
      return recipients
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
  },
])

const pagination = reactive({
  page: 1,
  pageSize: commonPageSize,
  showSizePicker: true,
  onChange: (page) => {
    console.log('page :>> ', page)
    pagination.page = page
    query()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    query()
  },
})

async function exportTable() {
  console.log('api.exportListURL :>> ', api.exportListURL)
  downloadUrl(api.exportListURL)
  // const [err, res] = await $to(api.exportList({}))
  // if (!err) {
  //   console.log('res :>> ', res)
  // }
}

async function exportToCSV() {
  // 将数据转换为CSV格式
  const csv = Papa.unparse(tableData.value)

  console.log(csv)

  // 创建一个Blob对象
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

  console.log(blob)

  // 创建一个下载链接
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

async function query() {
  startLoading()
  const [err, res] = await $to(
    api.getList({ pageNum: pagination.page, pageSize: pagination.pageSize ,phoneOrName:phoneOrName.value })
  )
  console.log('res :>> ', res)
  const { data } = res
  if (!err) {
    pagination.itemCount = data.total
    tableData.value = data.list
  }
  endLoading()
}

onMounted(() => {
  query()
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
}
</style>
