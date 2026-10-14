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
    :on-refresh="query"
  >
    <!-- <template #search>
      <a-row justify="start">
        <a-col :flex="1">
          <a-form
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="用户账号">
                  <a-input
                    v-model="state.params.userName"
                    placeholder="请输入用户账号"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col flex="180px">
          <a-space :size="18">
            <a-button type="primary" @click="search">
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
    </template> -->
    <template #buttons>
      <!-- <a-button
        type="primary"
        status="warning"
        :loading="exportLoading"
        @click="onExport"
      >
        <icon-export />导出
      </a-button> -->
      <MButton v-bind="tableTLBtnConfig"></MButton>
    </template>
    <template #scanNumber="{ record }">
      <a
        v-if="record.scanNumber > 0"
        class="point"
        style="color: #165dff; text-decoration: underline"
        href="javascript:void(0)"
        @click="toScanPage(record)"
      >
        {{ record.scanNumber }}
      </a>
      <span v-else>{{ record.scanNumber }}</span>
    </template>
    <template #videoNumber="{ record }">
      <a
        v-if="record.videoNumber > 0"
        href="javascript:void(0)"
        style="color: #165dff; text-decoration: underline"
        @click="toPage2(record)"
      >
        {{ record.videoNumber }}
      </a>
      <span v-else>{{ record.videoNumber }}</span>
    </template>
    <template #reportNumber="{ record }">
      <a
        v-if="record.reportNumber > 0"
        href="javascript:void(0)"
        style="color: #165dff; text-decoration: underline"
        @click="toPage3(record)"
      >
        {{ record.reportNumber }}
      </a>
      <span v-else>{{ record.reportNumber }}</span>
    </template>

    <!-- <template #action="{ record }">
      <a-space>
        <span v-if="false"> {{ record }}</span>
        <m-button
          v-bind="buttonConfig"
          :click-params="{ add: record }"
        ></m-button>
      </a-space>
    </template> -->
  </MTable>
</template>

<script lang="ts" setup name="codeService_userAdmin">
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { useAsync } from '@/hooks'
  import {
    getUserList,
    exportUserList,
  } from '@/api/code-service/prod-center/user-admin'

  const router = useRouter()
  // const buttonConfig: IButton = {
  //   buttonItems: [
  //     {
  //       name: 'detail',
  //       icon: true,
  //       onlyIcon: true,
  //       clickFunc: async (e: any, record: any) => {
  //         console.log('跳转详情')
  //         const { id } = record
  //         console.log('record', record)
  //         const data = await getUserDetail(id)
  //         console.log('data', data)
  //       },
  //       params: 'add',
  //     },
  //   ],
  // }

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '用户账号',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '扫码次数',
      slotName: 'scanNumber',
      key: 'scanNumber',
    },
    {
      title: '最近扫码时间',
      dataIndex: 'lastScanTime',
      key: 'lastScanTime',
    },
    {
      title: '视频连线次数',
      slotName: 'videoNumber',
      key: 'videoNumber',
    },
    {
      title: '最近视频连线时间',
      dataIndex: 'lastVideoTime',
      key: 'lastVideoTime',
    },
    {
      title: '提交报修单数',
      slotName: 'reportNumber',
      key: 'reportNumber',
    },
    // {
    //   key: 'action',
    //   align: 'center',
    //   title: '操作',
    //   slotName: 'action',
    // },
  ])

  const state = reactive({
    params: {
      userName: '',
      pageNum: 1,
      pageSize: 10,
    },
  })

  const exportLoading = ref(false)

  function toScanPage(item: any) {
    router.push({
      name: 'codeService_qrcodeAdmin_scanningCodeTimes',
      query: {
        userName: item.userName,
      },
    })
  }
  function toPage2(item: any) {
    router.push({
      name: 'codeService_workOrderAdmin_videoConnection',
      query: {
        userName: item.userName,
      },
    })
  }
  function toPage3(item: any) {
    router.push({
      name: 'codeService_workOrderAdmin_repairOrder',
      query: {
        userName: item.userName,
      },
    })
  }

  async function onExport() {
    const { pageNum, pageSize } = state.params
    exportLoading.value = true
    await exportUserList({ pageNum, pageSize }, `扫码用户列表.xlsx`)
    exportLoading.value = false
  }

  const {
    data,
    run: query,
    loading,
  } = useAsync(getUserList, {
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

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'export',
        icon: true,
        clickFunc: onExport,
      },
    ],
  })
</script>
