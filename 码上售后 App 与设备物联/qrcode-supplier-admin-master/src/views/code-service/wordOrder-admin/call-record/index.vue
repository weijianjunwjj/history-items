<template>
  <MTable
    :loading="loading"
    :table-props="{
      columns,
      data: callRecordList.items,
      rowKey: 'id',
    }"
    :state="state"
    :pagination="{
      total: callRecordList.total,
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
        v-bind="searchFormConfig"
        v-model="searchParams"
        @change-value="handleSearchChangeValue"
      >
        <template #right>
          <m-button v-bind="searchBtnConfig"></m-button>
        </template>
      </m-form>
    </template>
    <template #createTime="{ record }">
      <div class="flex-vc">
        <template v-if="record.state != -1">
          <span class="mb-1">
            {{ diffTime(record.createTime, record.finishTime) }}
          </span>
        </template>
        <template v-else>
          <a-tag v-if="record.state === -1">未接来电</a-tag>
        </template>
      </div>
    </template>
    <template #address="{ record }">
      {{ record.address }}
      <icon-font
        v-if="record.address"
        class="ml-1 point"
        type="icon-daohang"
        @click="toMap(record)"
      />
    </template>
    <template #link="{ record }">
      <div class="flex-vc">
        <icon-branch @click="handleShowLink(record)" />
      </div>
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
    <template #remark="{ record }">
      <!-- <a-button @click="onRemark(record)">查看备注</a-button> -->
      <!-- @click="onRemark(record)" -->

      <span
        class="dis-ib point omit"
        :title="record.remark"
        style="max-width: 100px"
      >
        {{ record.remark }}
      </span>
    </template>
  </MTable>
  <a-modal v-model:visible="linkVisible" :width="1200" :footer="false">
    <template #title>转接链路</template>
    <a-table :columns="linkColums" :data="linkList"></a-table>
  </a-modal>
</template>

<script lang="ts" setup name="codeService_userAdmin">
  import MTable from '@hx/packages/components/m-table'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { getList2 } from '@/api/code-service/wordOrder-admin/workOrder-type'
  import { getKfList } from '@/api/code-service/prod-center/customerService/index.ts'
  import { diffTime } from '@/utils/utils'
  import _ from 'lodash'
  import { Message } from '@arco-design/web-vue'
  import dayjs from 'dayjs'

  const route = useRoute()
  const router = useRouter()

  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '来电时间',
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
      title: '等待时长(秒)',
      dataIndex: 'createTime',
      render: (row: any) => getAnswerTime(row.record),
      align: 'center',
    },
    {
      title: '转接链路',
      dataIndex: 'firstFaceTimeRecordId',
      align: 'center',
      slotName: 'link',
    },
    {
      title: '来电手机号',
      dataIndex: 'userPhone',
      align: 'center',
    },
    {
      title: '客服账号',
      dataIndex: 'kfUserId',
      render: (row: any) => getKfUser(row.record),
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

  const getCreateTime = (time: any) => {
    const _time = time
    const arr = _time.split(' ')
    let arr_date = arr[0].split('-')
    let arr_time = arr[1].split(':')
    arr_date = `${arr_date[0]}-${arr_date[1]}-${arr_date[2]}`
    arr_time = `${arr_time[0]}:${arr_time[1]}`
    return `${arr_date} ${arr_time}`
  }

  const state = reactive({
    params: {
      // userId: route.query.userName,
      pageNum: 1,
      pageSize: 10,
    },
  })

  const loading = ref(false)

  function onChange(page: number) {
    state.params.pageNum = page
    searchGetCallRecord()
  }

  function onPageSizeChange(size: number) {
    state.params.pageSize = size
    searchGetCallRecord()
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
    window.open(newpage.href, '_blank')
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'createTime',
        type: 'datepicker',
        label: '时间段',
        placeholder: '请选择通话时间段',
      },
      {
        field: 'userPhone',
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
      {
        field: 'deviceSn',
        type: 'input',
        label: '设备序列号',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'selfIdentity',
        type: 'input',
        label: '设备自编码',
        placeholder: '请输入设备自编码',
      },
      {
        field: 'state',
        type: 'select',
        label: '接听状态',
        placeholder: '请选择接听状态',
        options: [
          { value: '1', label: '已接通' },
          { value: '-1', label: '未接通' },
        ],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索表单数据
  const searchParams = ref({
    createTime: [],
    userPhone: route.query.userName,
    selfIdentity: '',
    state: '',
    deviceSn: '',
  })
  const callRecordList = ref([])

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 点击搜索获取表格数据
  const searchGetCallRecord = async () => {
    loading.value = true
    const params = {
      userId: state.params.userId,
      createTime:
        searchParams.value.createTime && searchParams.value.createTime[0],
      updateTime:
        searchParams.value.createTime && searchParams.value.createTime[1],
      userPhone: searchParams.value.userPhone,
      deviceSn: searchParams.value.deviceSn,
      selfIdentity: searchParams.value.selfIdentity,
      state: searchParams.value.state,
    }
    try {
      const { data } = await getList2(
        _.pickBy({
          ...params,
          pageNum: state.params.pageNum,
          pageSize: state.params.pageSize,
        })
      )
      callRecordList.value = data
      loading.value = false
    } catch (error) {
      console.log(error)
      Message.error('网络错误, 请稍后重试')
    }
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          searchGetCallRecord()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            createTime: '',
            userPhone: '',
            deviceSn: '',
            selfIdentity: '',
            state: '',
          }
        },
      },
    ],
  })

  // 获取等待时长
  const getAnswerTime = (record) => {
    if (record.state !== -1 && record.answerTime) {
      return `${
        dayjs(record.answerTime).unix() - dayjs(record.createTime).unix()
      }`
    }
    if (record.state === -1) {
      return `${
        dayjs(record.updateTime).unix() - dayjs(record.createTime).unix()
      }`
    }
  }

  // 客服列表map
  const keFuListMap = ref({})

  // 获取客服
  const getKfUser = (record) => {
    return keFuListMap.value[record.kfUserId]
  }

  // 获取客服列表
  const resGetKeFuList = async () => {
    const { data } = await getKfList()
    data.forEach((item) => {
      keFuListMap.value[item.userId] = item.nickName
    })
  }

  // 转接链路数据
  const linkList = ref([])
  // 转接链路弹框是否显示
  const linkVisible = ref(false)
  const linkColums = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '来电时间',
      dataIndex: 'createTime',
      render: (row: any) => getCreateTime(row.record.createTime),
      align: 'center',
    },
    // {
    //   title: '通话时长',
    //   dataIndex: 'createTime',
    //   align: 'center',
    //   slotName: 'createTime',
    // },
    {
      title: '等待时长(秒)',
      dataIndex: 'createTime',
      render: (row: any) => getAnswerTime(row.record),
      align: 'center',
    },
    // {
    //   title: '来电手机号',
    //   dataIndex: 'userPhone',
    //   align: 'center',
    // },
    {
      title: '客服账号',
      dataIndex: 'kfUserId',
      render: (row: any) => getKfUser(row.record),
      align: 'center',
    },
  ])

  // 显示转接链路
  const handleShowLink = async (record: any) => {
    console.log(record)
    try {
      if (!record.firstFaceTimeRecordId) {
        const { data } = await getList2(
          _.pickBy({
            firstFaceTimeRecordId: record.id,
          })
        )
        linkList.value = data.items
      } else {
        console.log(record.firstFaceTimeRecordId)
        const res = await getList2(
          _.pickBy({
            firstFaceTimeRecordId: record.firstFaceTimeRecordId,
          })
        )
        const res1 = await getList2(
          _.pickBy({
            id: record.firstFaceTimeRecordId,
          })
        )
        const arr = [...res1.data.items, ...res.data.items]
        linkList.value = arr
      }
      linkVisible.value = true
    } catch (error) {
      Message.error('网络错误,请稍后重试')
    }
  }

  onMounted(() => {
    searchGetCallRecord()
    resGetKeFuList()
  })
</script>
