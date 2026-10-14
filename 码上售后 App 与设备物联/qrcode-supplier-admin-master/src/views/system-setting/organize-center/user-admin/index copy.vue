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
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="pageDataInit"
    >
      <template #actions="{ record }">
        {{ record }}
      </template>
    </m-table>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  // import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import _ from 'lodash'
  import { getOtherDeviceList } from '@/api/code-service/prod-center/otherDevice/index.ts'
  // import { Message } from '@arco-design/web-vue'

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
    },
    {
      title: '账号',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '姓名',
      key: 'deviceName',
      dataIndex: 'deviceName',
      width: 150,
    },
    {
      title: '权重',
      key: 'categoryName',
      dataIndex: 'categoryName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '组别',
      key: 'deliveryAddress',
      dataIndex: 'deliveryAddress',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      key: 'actions',
      align: 'center',
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

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetOtherDeviceList()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
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
