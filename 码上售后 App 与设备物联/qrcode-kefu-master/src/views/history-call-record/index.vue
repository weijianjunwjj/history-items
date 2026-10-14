<template>
  <div class="work-order">
    <a-card hoverable class="work-order-search-box" :bordered="false">
      <search-box ref="searchBoxRefs" v-model="formModel" v-bind="modalConfig">
        <template #right>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button type="primary" @click="handleClickSearch">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button @click="onClickReset">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </template>
      </search-box>
    </a-card>
    <a-card hoverable class="work-order-table-box mt-4" :bordered="false">
      <a-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
      >
        <template #createTime="{ record }">
          <div class="flex-vc">
            <template v-if="record.state != -1">
              <span class="mb-1">
                {{ diffTime(record.createTime, record.finishTime) }}
              </span>
            </template>

            <!-- <a-tag :color="callStateColor[record.state]">{{
            callState[record.state]
          }}</a-tag> -->
            <template v-else>
              <a-tag v-if="record.state === -1">未接来电</a-tag>
            </template>
          </div>
        </template>
        <template #address="{ record }">
          {{ record.address }}
          <icon-font
            class="ml-1 point"
            type="icon-daohang"
            @click="toMap(record)"
          />
        </template>

        <template #userVedioUrl="{ record }">
          <div class="flex-vc">
            <a
              v-if="record.userVideoUrl"
              :href="record.userVideoUrl"
              target="_blank"
              class="aa mb-1 dis-ib"
              >用户端视频</a
            >
            <a
              v-if="record.kfVideoUrl"
              :href="record.kfVideoUrl"
              target="_blank"
              class="aa"
              >客服端视频</a
            >
          </div>
        </template>

        <template #resolvedFlag="{ record }">
          {{ record.resolvedFlag ? '已解决' : '未解决' }}
        </template>
        <template #remark="{ record }">
          <!-- <a-button @click="onRemark(record)">查看备注</a-button> -->
          <!-- @click="onRemark(record)" -->

          <span
            class="dis-ib point omit"
            :title="record.remark"
            style="max-width: 100px"
            @click="onRemark(record)"
          >
            {{ record.remark }}
          </span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import _ from 'lodash'
  import { useAppStore, useChatStore } from '@/store'
  import { diffTime } from '@/utils/utils'
  import { storeToRefs } from 'pinia'
  import { deviceHistoryList } from '@/api/videoCall'
  import { IForm } from '@/components/search-box/types'
  import SearchBox from '@/components/search-box/index.vue'
  import { mapping } from '@/utils/data'
  // 初始化router
  const router = useRouter()
  const chatStore = useChatStore()
  const { callState, callStateColor } = storeToRefs(chatStore)
  const appStore = useAppStore()
  const app = window.$app
  const height = ref(200)
  const callLogRefs = ref()
  const sel = reactive({
    rowSelection: {
      type: 'radio',
    },
    selectedRowKeys: [],
  })

  const tableData = ref([])
  const loading = ref(false)
  const searchBoxRefs = ref()
  // 表格分页属性
  const pagination = reactive({
    showTotal: true,
    showPageSize: true,
    total: 0,
    current: 1,
    pageSize: 10,
    onPageSizeChange: (pageSize) => {
      pagination.current = 1
      pagination.pageSize = pageSize
      query()
    },
    onChange: (page) => {
      pagination.current = page
      query()
    },
  })

  // 重置执行的方法
  const generateFormModel = () => {
    return {
      userPhone: '',
      deviceSn: '',
      callTime: '',
    }
  }

  // 表单数据
  const formModel = ref(generateFormModel())

  // 重置
  const onClickReset = () => {
    formModel.value = generateFormModel()
    pagination.current = 1
    searchBoxRefs.value.reset()
    query()
  }
  const handleClickSearch = _.debounce(async () => {
    const value = await searchBoxRefs.value.formValidate()
    if (!value) {
      query()
    }
  }, 200)
  // 初始化搜索框内容
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'userPhone',
        type: 'input',
        label: '来电手机号',
        placeholder: '请输入来电手机号',
        rules: [
          {
            match:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
          },
        ],
        trigger: ['change'],
      },
      {
        field: 'deviceSn',
        type: 'input',
        label: '设备序列号',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'callTime',
        type: 'datepicker-showTime',
        label: '来电时间',
      },
    ],
  })
  const columns = reactive([
    {
      title: '序号',
      width: 70,
      render: (row: any) => row.rowIndex + 1,
      align: 'center',
    },
    {
      title: '通话时间',
      dataIndex: 'createTime',
      render: (row: any) => getCreateTime(row.record.createTime),
      align: 'center',
    },
    {
      title: '通话时长',
      dataIndex: 'createTime',
      align: 'center',
      slotName: 'createTime',
    },

    {
      title: '来电手机号',
      dataIndex: 'userPhone',
      align: 'center',
    },
    {
      title: '设备序列号',
      dataIndex: 'deviceSn',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: '是否远程解决',
      dataIndex: 'resolvedFlag',
      slotName: 'resolvedFlag',
      align: 'center',
    },
    {
      title: '来电地址',
      dataIndex: 'address',
      align: 'left',
      slotName: 'address',
    },

    {
      title: '视频回放',
      align: 'center',
      slotName: 'userVedioUrl',
    },
    {
      title: '通话备注',
      align: 'center',
      slotName: 'remark',
    },
  ])

  const visible = ref(false)
  const currentRemark = ref('')
  const currentRecord = ref()

  const getCreateTime = (time: any) => {
    const _time = time
    const arr = _time.split(' ')
    let arr_date = arr[0].split('-')
    let arr_time = arr[1].split(':')
    arr_date = `${arr_date[1]}-${arr_date[2]}`
    arr_time = `${arr_time[0]}:${arr_time[1]}`
    return `${arr_date} ${arr_time}`
  }

  function query() {
    const { current: pageNum, pageSize } = pagination
    const p = formModel.value
    if (Array.isArray(p.callTime)) {
      const [createTime, finishTime] = p.callTime
      p.createTime = createTime
      p.finishTime = finishTime
      delete p.callTime
    }
    deviceHistoryList({ pageNum, pageSize, ...p }).then((res) => {
      console.log('res', res)
      tableData.value = res.data.items
      pagination.total = res.data.total
    })
  }

  function toMap({ latitude, longitude, address }) {
    const newpage = router.resolve({
      name: 'map',
      query: {
        latitude,
        longitude,
        address,
      },
    })
    console.log('newpage', newpage)
    window.open(newpage.href, '_blank')
  }

  onMounted(() => {
    query()
  })
</script>

<style scoped lang="less">
  .work-order {
    padding: 20px;
    box-sizing: border-box;

    .work-order-search-box {
      border-radius: 10px;

      .search-left {
        display: flex;
        align-items: center;

        .serach-btn {
          margin-left: 20px;
        }
      }
    }

    .work-order-table-box {
      border-radius: 10px;
      width: 100%;
      height: calc(100vh - 275px);
      overflow: auto;

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
    }

    :deep(.arco-table-th) {
      color: #7e8299;
    }
  }
</style>
