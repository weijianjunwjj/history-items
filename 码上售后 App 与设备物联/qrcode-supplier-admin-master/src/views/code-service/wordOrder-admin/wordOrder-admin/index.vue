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
      current: state.params.pageNum,
      pageSize: state.params.pageSize,
      onChange,
      onPageSizeChange,
    }"
    :on-refresh="query"
  >
    <template #search>
      <m-form
        ref="searchModelRef"
        v-model="state.params"
        v-bind="searchFormConfig"
        @change-value="handleSearchChangeValue"
      >
        <template #right>
          <MButton v-bind="searchBtnConfig"></MButton>
        </template>
      </m-form>
    </template>
    <template #device="{ record }">
      <div class="device-info-box">
        <div class="device-img">
          <a-image width="40" :src="record.deviceImage" />
        </div>
        <div class="device-info">
          <span class="device-name">{{ record.deviceName }}</span>
          <span class="device-sn">{{ record.deviceSn }}</span>
        </div>
      </div>
    </template>
    <template #time="{ record }">
      {{ record.createTime }}
    </template>
    <template #report="{ record }">
      <div class="report-info">
        <span class="report-type">{{ record.ticketTypeId }}</span>
        <span class="report-desc">
          <a-tooltip :content="record.ticketContent" position="tl">
            <span class="ellipsis">{{ record.ticketContent }}</span>
          </a-tooltip>
        </span>
      </div>
    </template>
    <template #report-per="{ record }">
      <div class="report-info">
        <span class="report-type">{{ record.reporterPhone }}</span>
      </div>
    </template>
    <template #ownership="{ record }">
      <div class="report-info">
        <span class="report-type">{{ record.deviceCustomer }}</span>
        <span class="report-desc">
          <a-tooltip :content="record.deviceAddress" position="tl">
            <span class="ellipsis">{{ record.deviceAddress }}</span>
          </a-tooltip>
        </span>
      </div>
    </template>
    <template #state="{ record }">
      <a-tag v-if="record.ticketState === 1" color="green"> 待处理 </a-tag>
      <a-tag v-if="record.ticketState === 2" color="blue"> 已派单 </a-tag>
      <a-tag v-if="record.ticketState === 3" color="gray"> 已维修 </a-tag>
    </template>
  </MTable>
</template>

<script lang="ts" setup name="codeService_userAdmin">
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { useAsync } from '@/hooks'
  import { getWorkOrderList } from '@/api/workorder.ts'

  const route = useRoute()
  // 设备
  // 报修信息
  // 报修时间
  // 报修人联系电话
  // 设备归属
  // 状态
  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '设备',
      slotName: 'device',
    },
    {
      title: '报修信息',
      slotName: 'report',
      width: 300,
    },
    {
      title: '报修时间',
      slotName: 'time',
    },
    {
      title: '报修人联系电话',
      slotName: 'report-per',
    },
    {
      title: '设备归属',
      slotName: 'ownership',
    },
    {
      title: '状态',
      slotName: 'state',
    },
  ])

  const state = reactive({
    params: {
      reporterPhone: route.query.userName,
      pageNum: 1,
      pageSize: 10,
    },
  })

  const {
    data,
    run: query,
    loading,
  } = useAsync(getWorkOrderList, {
    initialData: {
      items: [],
      total: 0,
    },
    state,
  })

  function onChange(page: number) {
    state.params.pageNum = page
    query()
  }

  function onPageSizeChange(size: number) {
    state.params.pageSize = size
    query()
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'reporterPhone',
        type: 'input',
        label: '手机号',
        placeholder: '请输入手机号',
        rules: [
          {
            match:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    state.params = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          query()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          state.params = {
            sn: '',
            reporterPhone: '',
            pageNum: 1,
            pageSize: 10,
          }
        },
      },
    ],
  })
</script>

<style lang="less" scoped>
  .device-info-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .device-img {
      // width: 40px;
      // height: 40px;
      // border-radius: 5px;
      // background: #eee5ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .device-info {
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-left: 10px;

      .device-sn {
        font-size: 12px;
        color: #9b9eb0;
      }
    }
  }

  .report-info {
    display: flex;
    flex-direction: column;
    text-align: left;

    .report-desc {
      font-size: 12px;
      color: #9b9eb0;

      .ellipsis {
        width: 150px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
