<template>
  <n-page-header subtitle="批量激活记录" @back="handleBack">
    <div class="BatchActiveHistory">
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
  </n-page-header>
</template>

<script setup>
import api from '../api.js'
import { commonPageSize, getToken, downloadUrl } from '@/utils'
import { useLoading } from '@/hooks'
import { NButton } from 'naive-ui'
import qs from 'qs'
// ---data---
const { loading, startLoading, endLoading } = useLoading(false)

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

const tableData = ref([])

const columns = ref([
  {
    title: '序号',
    align: 'center',
    fixed: 'left',
    render(row, index) {
      return index + 1
    },
    width: 70,
  },
  {
    title: '文件名',
    key: 'fileName',
    align: 'center',
  },
  {
    title: '记录日期',
    key: 'createAt',
    align: 'center',
  },
  {
    title: '激活结果',
    key: 'siteUserName',
    align: 'center',
    render(row) {
      const {totalCount,invalidCount,failedCount,okCount} = row.result

      return  h('div', [
        '共上传',
        totalCount,
        '条数据，',
        okCount,
        '个设备激活成功。',
        failedCount,
        '个设备激活失败，',
        invalidCount,
        '个数据校验失败。详细信息请下载表格查看'
      ])
      // const total = uploadData.size
      // const errors = records
      //   .filter((item) => item.status == 2)
      //   .map((item) => {
      //     return {
      //       ...item,
      //       errorMsg: item.remark ? JSON.parse(item.remark)?.errorMsg : errorMsg,
      //     }
      //   })
      // const successes = records.filter((item) => item.status == 1)?.length
      // return h('div', [
      //   h('div', `${successes}个设备激活成功。${errors.length}个设备激活失败，具体如下`),
      //   ...errors.map((item) =>
      //     h('div', { style: 'margin-top: 30px;' }, [
      //       `打印机编码${item.printerId}。激活失败错误信息：${item.errorMsg}`,
      //     ])
      //   ),
      // ])
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left:15px',
            onClick: () => exportTable(row),
          },
          {
            default: () => '下载',
          }
        ),
      ]
    },
  },
])

const emit = defineEmits(['back'])

async function exportTable(row) {
  const md5 = row.md5
  const p = {
    md5,
  }
  if (!md5) {
    return $message.error('md5为空,请重试!')
  }
  const params = qs.stringify(p)
  let $api_test = window.$api_test
  if (params) {
    downloadUrl($api_test + api.exportListURL + `?${params}&saToken=${getToken()}`)
  } else {
    downloadUrl($api_test + api.exportListURL + `?saToken=${getToken()}`)
  }
}

// ---function---
function handleBack() {
  emit('back')
}

async function init() {
  startLoading()

  const [err, res] = await $to(
    api.getList({ pageNum: pagination.page, pageSize: pagination.pageSize })
  )
  if (!err) {
    const data = res.data
    console.log('data :>> ', data)
    pagination.itemCount = data.total
    tableData.value = data.records
  } else {
    console.error('err :>> ', err)
  }
  endLoading()
}

init()
</script>

<style lang="less" scoped></style>
