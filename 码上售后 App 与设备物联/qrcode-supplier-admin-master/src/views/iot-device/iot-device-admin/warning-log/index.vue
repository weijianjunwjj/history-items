<template>
  <div class="warning-box">
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: warningLogList,
        rowKey: 'id',
      }"
      :state="state"
      :pagination="{
        total: state.params.total,
        current: state.params.pageNum,
        pageSize: state.params.pageSize,
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="resGetWarningLogList"
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
      <template #warningTime="{ record }">
        {{ dayjs(record.warningTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </m-table>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { faultRecordList } from '@/api/iot-device/index.ts'
  import dayjs from 'dayjs'
  import _ from 'lodash'

  // 定义搜索表单数据
  const searchParams = ref({
    time: '',
    sn: '',
    keyWord: '',
  })

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'time',
        type: 'datepicker',
        label: '时间范围',
      },
      {
        field: 'sn',
        type: 'input',
        label: '设备序列号',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'keyWord',
        type: 'input',
        label: '故障关键词',
        placeholder: '请输入故障关键词',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value: any) => {
    searchParams.value = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          resGetWarningLogList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            time: '',
            sn: '',
            keyWord: '',
          }
        },
      },
    ],
  })

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
    },
    {
      title: '报警时间',
      slotName: 'warningTime',
      key: 'warningTime',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备序列号',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '设备归属',
      dataIndex: 'owner',
      key: 'owner',
      width: 200,
      llipsis: true,
      tooltip: true,
    },
    {
      title: '报警内容',
      dataIndex: 'faultMsg',
      key: 'faultMsg',
      width: 300,
      llipsis: true,
      tooltip: true,
    },
  ])

  // 定义报警记录表格数据
  const warningLogList = ref([])

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
    resGetWarningLogList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetWarningLogList()
  }

  // 获取表格数据
  const resGetWarningLogList = async () => {
    loading.value = true
    const { data } = await faultRecordList(
      _.pickBy({
        sn: searchParams.value.sn,
        keyword: searchParams.value.keyWord,
        startTime: searchParams.value.time && searchParams.value.time[0],
        endTime: searchParams.value.time && searchParams.value.time[1],
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    warningLogList.value = data.items
    state.params.total = data.total
    loading.value = false
  }

  onMounted(() => {
    resGetWarningLogList()
  })
</script>

<style lang="less" scoped>
  .warning-box {
    padding: 20px;
  }
</style>
