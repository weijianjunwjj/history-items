<template>
  <div class="work-order">
    <a-card hoverable class="work-order-search-box" :bordered="false">
      <search-box ref="searchBoxRefs" v-model="formModel" v-bind="modalConfig">
        <!-- <search-box model-value="formModel" v-bind="modalConfig"> -->
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
        <template #bottom>
          <a-divider style="margin-top: 0" />
          <a-row style="margin-bottom: 16px">
            <a-col :span="16">
              <a-space>
                <a-button type="primary" @click="visible = true">
                  <template #icon>
                    <icon-plus />
                  </template>
                  新增
                </a-button>
              </a-space>
            </a-col>
            <a-col :span="8" style="text-align: right">
              <a-button @click="handleExportData">
                <template #icon>
                  <icon-download />
                </template>
                导出数据
              </a-button>
            </a-col>
          </a-row>
        </template>
      </search-box>
    </a-card>
    <a-card hoverable class="work-order-table-box" :bordered="false">
      <a-table
        :columns="columns"
        :data="testdata"
        :loading="loading"
        :pagination="pagination"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
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
        <template #optional="{ record }">
          <a-button type="primary" @click="onClickWorkOrderDetail(record.id)">
            <template #icon>
              <icon-tool />
            </template>
          </a-button>
          &nbsp;
          <a-button type="primary" @click="handleDeleteOrder(record.id)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      class="addOrderForm-modal"
      title="新增工单"
      unmount-on-close
      :on-before-ok="handleSubmitAddOrder"
      @open="addOrderModalOpen"
      @close="closeAddOrderModal"
    >
      <a-form ref="addOrderFormRef" :model="addOrderForm">
        <a-form-item
          field="deviceSn"
          label="设备序列号"
          :rules="[{ required: true, message: '请填写设备序列号' }]"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-input
            v-model="addOrderForm.deviceSn"
            allow-clear
            placeholder="请输入设备序列号"
          />
        </a-form-item>
        <a-form-item
          field="ticketTypeId"
          label="工单类型"
          :rules="[{ required: true, message: '请选择工单类型' }]"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-select
            v-model="addOrderForm.ticketTypeId"
            allow-clear
            placeholder="请选择工单类型"
            :options="modalConfig.formItems[1].options"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          field="ticketMode"
          label="报修方式"
          :rules="[{ required: true, message: '请选择报修方式' }]"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-select
            v-model="addOrderForm.ticketMode"
            allow-clear
            placeholder="请选择报修方式"
            :options="[
              { label: '微信', value: 0 },
              { label: '电话', value: 1 },
              { label: '其他', value: 2 },
            ]"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          field="ticketContent"
          label="问题描述"
          :rules="[{ required: true, message: '请填写问题描述' }]"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-textarea
            v-model="addOrderForm.ticketContent"
            min
            allow-clear
            placeholder="请输入问题描述"
          />
        </a-form-item>
        <a-form-item
          field="reporterPhone"
          label="报修人电话"
          :rules="[
            {
              required: true,
              match:
                /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
              message: '请填写正确的手机号',
            },
          ]"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-input
            v-model="addOrderForm.reporterPhone"
            allow-clear
            placeholder="请输入报修人电话"
          />
        </a-form-item>

        <a-form-item field="reporterPhone" label="报修人姓名">
          <a-input
            v-model="addOrderForm.reporterName"
            allow-clear
            placeholder="请输入报修人姓名"
          />
        </a-form-item>

        <a-form-item field="engineerId" label="工程师">
          <a-select
            v-model="addOrderForm.engineerId"
            allow-clear
            placeholder="请选择工程师"
            :options="engineerList"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="ticketRecommend" label="建议处理方式">
          <a-textarea
            v-model="addOrderForm.ticketRecommend"
            allow-clear
            placeholder="请输入建议处理方式"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue'
  import {
    getWorkOrderList,
    getWorkOrdeTypes,
    getEngineerList,
    postOrder,
    postExport,
    deleteOrder,
    getcustomerList,
    getWorkTicketTypeList,
  } from '@/api/workorder'
  import SearchBox from '@/components/search-box/index.vue'
  import { IForm } from '@/components/search-box/types'
  import { cleanObject } from '@/utils/utils'
  import { useRouter } from 'vue-router'
  import download from '@/utils/downFiles'
  import { Message, Modal } from '@arco-design/web-vue'
  import _ from 'lodash'

  // 初始化router
  const router = useRouter()

  // 初始化搜索框内容
  const modalConfig: IForm = reactive({
    formItems: [
      {
        field: 'deviceSn',
        type: 'input',
        label: '设备序列号',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'ticketTypeId',
        type: 'select',
        label: '故障类型',
        placeholder: '请输入故障类型',
        options: [],
      },
      {
        field: 'createTime',
        type: 'datepicker',
        label: '报修时间',
        placeholder: '请选择报修时间',
      },
      {
        field: 'reporterPhone',
        type: 'input',
        label: '报修人电话',
        placeholder: '请输入报修人电话',
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
        field: 'reporterName',
        type: 'input',
        label: '报修人姓名',
        placeholder: '请输入报修人姓名',
      },
      {
        field: 'deviceCustomerName',
        type: 'select',
        label: '归属公司',
        placeholder: '请输入归属公司',
        options: [],
      },
      {
        field: 'ticketState',
        type: 'select',
        label: '处理状态',
        placeholder: '请选择处理状态',
        options: [
          {
            value: '1',
            label: '待处理',
          },
          {
            value: '2',
            label: '已派单',
            other: 'extra',
          },
          {
            value: '3',
            label: '已维修',
          },
        ],
      },
    ],
  })

  // 初始化表格列数据
  const columns = [
    {
      title: '#',
      slotName: 'index',
      width: '50',
    },
    {
      title: '设备',
      slotName: 'device',
    },
    {
      title: '报修信息',
      slotName: 'report',
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
    {
      title: '操作',
      slotName: 'optional',
    },
  ]

  // 定义表格加载状态
  const loading = ref(false)

  // 定义表格初始数据
  const testdata = ref([])

  const workTicketTypeList = ref()

  // 重置执行的方法
  const generateFormModel = () => {
    return {
      deviceSn: '',
      ticketTypeId: '',
      createTime: ['', ''],
      reporterPhone: '',
      deviceCustomerName: '',
      ticketState: '',
      pageNum: 1,
      pageSize: 10,
    }
  }

  // 表单数据
  const formModel = ref(generateFormModel())

  // 重置
  const onClickReset = () => {
    formModel.value = generateFormModel()
  }

  // 定义筛选查询ref对象
  const searchBoxRefs = ref()

  // 点击筛选查询表格数据
  const handleClickSearch = _.debounce(async () => {
    const value = await searchBoxRefs.value.formValidate()
    if (!value) {
      formModel.value.pageNum = 1
      onClickSearch()
    }
  }, 500)

  // 查询表格数据
  const onClickSearch = async () => {
    try {
      loading.value = true
      // qs.stringify(params)
      const { data } = await getWorkOrderList({
        ...cleanObject(formModel.value),
      })
      testdata.value = data.items
      pagination.total = data.total
      loading.value = false
    } catch (error) {
      console.log(error)
    }
  }

  // 获取故障类型
  const workOrdeTypes = async () => {
    const { data: data2 } = await getWorkTicketTypeList()
    console.log('data2', data2)
    Object.keys(data2).forEach((key) => {
      modalConfig.formItems[1].options.push({
        value: data2[key].id,
        label: data2[key].ticketType,
      })
    })
  }

  // 获取公司列表
  const customerList = async () => {
    const { data } = await getcustomerList()
    data.items.forEach((item) => {
      modalConfig.formItems[5].options.push({
        value: item.id,
        label: item.name,
      })
    })
  }

  // 点击进入工单详情
  const onClickWorkOrderDetail = (id: string) => {
    router.push({
      name: 'orderDetail',
      params: { id },
    })
  }

  // 定义新增弹框visible
  const visible = ref(false)

  // 定义新增弹框表单方法
  const generateAddOrderForm = () => {
    return {
      deviceSn: '',
      ticketType: 'DEVICE_FAULT',
      ticketTypeId: '',
      ticketMode: '',
      ticketContent: '',
      reporterPhone: '',
      engineerId: '',
      ticketRecommend: '',
    }
  }

  // 定义新增弹框表单
  const addOrderForm = ref(generateAddOrderForm())

  // 定义新增表单ref对象
  const addOrderFormRef = ref()

  // 确认提交新增表单
  const handleSubmitAddOrder = async (done: (closed: boolean) => void) => {
    const value = await addOrderFormRef.value.validate()
    if (value) {
      done(false)
    } else {
      console.log(addOrderForm.value)
      try {
        const res = await postOrder(addOrderForm.value)
        if (res.code === 200) {
          onClickSearch()
          done(true)
        } else {
          done(false)
          Message.error(res.msg)
        }
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 关闭新增表单弹框事件
  const closeAddOrderModal = () => {
    addOrderForm.value = generateAddOrderForm()
  }

  // 获取工程师列表
  const engineerList = ref([])
  const engineerLists = async () => {
    const { data } = await getEngineerList()
    const arr = []
    data.forEach((item) => {
      arr.push({
        ...item,
        label: item.nickName,
        value: item.userId,
      })
    })
    engineerList.value = arr
  }

  // 新增工单弹出框打开事件
  const addOrderModalOpen = () => {
    engineerLists()
  }

  // 导出数据
  const handleExportData = async () => {
    const res = await postExport()
    console.log(res)
    download(res, '工单数据.xlsx')
  }

  // 表格分页属性
  const pagination = reactive({
    showTotal: true,
    showPageSize: true,
    total: 0,
  })

  // 表格页码发生改变
  const pageChange = (pageNum: number) => {
    formModel.value.pageNum = pageNum
    onClickSearch()
  }

  // 表格每页数据数量发生改变
  const pageSizeChange = (pageSize: number) => {
    formModel.value.pageSize = pageSize
    onClickSearch()
  }

  // 删除工单
  const handleDeleteOrder = (id: number) => {
    Modal.confirm({
      title: '确认删除该工单？',
      content: `确认删除该工单？`,
      onOk: async () => {
        try {
          await deleteOrder({ id })
          Message.success('删除成功')
          onClickSearch()
        } catch (error) {
          console.log(error)
        }
      },
      onCancel: () => {
        console.log('否认删除')
      },
    })
  }

  // 页面加载完成时获取表格初始数据
  onMounted(() => {
    onClickSearch()
    workOrdeTypes()
    customerList()
  })
</script>

<style scoped lang="less">
  :deep(.arco-textarea) {
    height: 75px;
  }

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
      margin-top: 20px;

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

    :deep(.arco-table-th:first-of-type) {
      color: #3699ff;
    }
  }
</style>
