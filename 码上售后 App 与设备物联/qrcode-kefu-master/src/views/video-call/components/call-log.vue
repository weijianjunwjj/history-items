<template>
  <a-card ref="callLogRefs" class="general-card" title="通话记录">
    <a-table
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :pagination="false"
      :loading="tableLoading"
      :scroll="{ y: height }"
      row-key="id"
      :row-selection="sel.rowSelection"
      @selection-change="onSelectionChange"
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
          @click="onRemark(record)"
        >
          {{ record.remark }}
        </span>
      </template>

      <template #actions="{ record, index }">
        <a-button
          v-if="!record.workTicketId"
          type="text"
          @click="addWOrder(record, index)"
          >添加工单</a-button
        >
        <a-button
          v-else
          type="text"
          style="color: #4e5969"
          @click="lookWOrder(record.workTicketId)"
          >查看工单</a-button
        >
      </template>
    </a-table>

    <a-modal v-model:visible="visible" simple @ok="onOK()">
      <template #title> 通话备注 </template>
      <a-textarea
        v-model="currentRemark"
        placeholder="请输入通话备注"
        :auto-size="{ minRows: 5, maxRows: 5 }"
        allow-clear
      />
    </a-modal>

    <a-modal
      :visible="visible2"
      width="600px"
      :ok-loading="okLoading"
      @ok="handleSubmitAddOrder"
      @cancel="onCancel"
    >
      <template #title> 新建工单 </template>

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
            placeholder="请填写设备序列号"
          >
          </a-input>
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
            :options="workOrderTypes"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          field="ticketContent"
          label="问题描述"
          :rules="[{ required: true, message: '问题描述' }]"
        >
          <a-textarea
            v-model="addOrderForm.ticketContent"
            allow-clear
            placeholder="请输入问题描述"
          />
        </a-form-item>

        <a-form-item
          field="engineerId"
          label="负责工程师"
          :validate-trigger="['change', 'input', 'blur']"
        >
          <a-select
            v-model="addOrderForm.engineerId"
            allow-clear
            placeholder="请选择工程师"
            :options="engineers"
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
  </a-card>
</template>

<script setup lang="ts">
  // tableData,
  import { tableData, tableLoading } from '@/hooks/videoCall/call-log'
  import { useAppStore, useChatStore } from '@/store'
  import { diffTime } from '@/utils/utils'
  import { storeToRefs } from 'pinia'
  import { Modal } from '@arco-design/web-vue'
  import { getListByUserId, SubmitRepair } from '@/api/videoCall'
  import {
    getEngineerList,
    getWorkTicketTypeList,
    postOrder,
  } from '@/api/workorder'

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
  watch(
    () => tableData,
    () => {
      const dom = document.querySelector('.arco-table-body')
      if (dom) {
        dom.scrollTop = 0
      }
    },
    {
      deep: true,
    }
  )
  const tableRef = ref()
  // postOrder
  // 定义新增弹框表单方法
  const generateAddOrderForm = () => {
    return {
      ticketTypeId: '',
      ticketContent: '',
      engineerId: '',
      ticketRecommend: '',
      ticketType: 'DEVICE_FAULT',
      deviceSn: '',
      faceTimeRecordId: '',
    }
  }

  const workOrderTypes = ref([])
  const engineers = ref([])

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
      title: '视频回放',
      align: 'center',
      slotName: 'userVedioUrl',
    },
    {
      title: '通话备注',
      align: 'center',
      slotName: 'remark',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'actions',
    },
  ])

  const visible = ref(false)
  const visible2 = ref(false)
  const currentRemark = ref('')
  const currentRecord = ref()
  const okLoading = ref(false)
  // 定义新增弹框表单
  const addOrderForm = ref(generateAddOrderForm())
  const currentRecord2 = ref()
  const currentRecord2Index = ref()
  // 定义新增表单ref对象
  const addOrderFormRef = ref()

  const onCancel = () => {
    visible2.value = false
    addOrderFormRef.value.resetFields()
  }

  async function query() {
    const id = app.chatStore.currentChat.userProfile.userID
    console.log('id', id)
    const _tableData = await getListByUserId(id)
    console.log('_tableData', _tableData)
    app.chatStore.updateCallTableData(_tableData.data.items)
  }

  // 确认提交新增表单
  const handleSubmitAddOrder = async () => {
    const value = await addOrderFormRef.value.validate()
    const done = (bool) => {
      visible2.value = bool
    }
    if (!value) {
      console.log(addOrderForm.value)
      addOrderForm.value.faceTimeRecordId = currentRecord2.value.id
      try {
        okLoading.value = true
        const res = await postOrder(addOrderForm.value)
        console.log('res', res)
        if (res.code === 200) {
          done(false)
          query()

          app.succ('添加成功')
          okLoading.value = false
        } else {
          app.$message.error(res.msg)
        }
      } catch (error) {
        done(false)
        okLoading.value = false
        console.log(error)
      }
    }
  }

  // 关闭新增表单弹框事件
  const closeAddOrderModal = () => {
    addOrderForm.value = generateAddOrderForm()
  }

  function addWOrder(item: any, index: number) {
    console.log('item', item)
    currentRecord2.value = item
    currentRecord2Index.value = index
    visible2.value = true
  }
  function lookWOrder(workTicketId: any) {
    app.$router.push({ path: `/workOrder/orderDetail/${workTicketId}` })
  }

  function onSelectionChange(rowKeys: []) {
    console.log('rowKeys', rowKeys)
    sel.selectedRowKeys = rowKeys
    const id = rowKeys[0]
    const { remark } = tableData.value.find((item) => item.id === id)
    app.$bus.emit('call-log-selected', remark)
    chatStore.updateCurrentTableRadio(id || '')
  }

  const getCreateTime = (time: any) => {
    const _time = time
    const arr = _time.split(' ')
    let arr_date = arr[0].split('-')
    let arr_time = arr[1].split(':')
    arr_date = `${arr_date[1]}-${arr_date[2]}`
    arr_time = `${arr_time[0]}:${arr_time[1]}`
    return `${arr_date} ${arr_time}`
  }

  async function onRemark(record) {
    console.log('打开备注')

    const { id } = record
    console.log(record)
    currentRecord.value = record
    currentRemark.value = record.remark
    visible.value = true

    // eslint-disable-next-line no-unreachable
    // const remark = ''

    // const res = await getListByUserId(id)
    // console.log('res', res)
    // app.succ('修改成功')
    // console.log('res', res)
  }

  async function onOK() {
    currentRecord.value.remark = currentRemark.value
    const params = { remark: currentRemark.value, id: currentRecord.value.id }
    console.log('params', params)
    try {
      await SubmitRepair(params)
      appStore.mess({
        message: '保存成功',
        type: 'success',
      })
      app.$bus.emit('call-log-selected', params.remark)
    } catch (error) {
      appStore.mess({
        message: '保存失败',
        type: 'error',
      })
    }
  }
  async function getWorkOrderTypes() {
    const { data } = await getWorkTicketTypeList()
    console.log('data', data)
    workOrderTypes.value = []
    Object.keys(data).forEach((key) => {
      workOrderTypes.value.push({
        value: data[key].id,
        label: data[key].ticketType,
      })
    })
  }
  const getEngineers = async () => {
    const { data } = await getEngineerList()
    const arr = []
    data.forEach((item) => {
      arr.push({
        ...item,
        label: item.nickName,
        value: item.userId,
      })
    })
    engineers.value = arr
  }

  onMounted(() => {
    getEngineers()
    getWorkOrderTypes()
    // sel.selectedRowKeys = [tableData.value[0].id]
    console.log('callLogRefs.value', callLogRefs.value)

    const go = () => {
      const myHeight = callLogRefs.value.$el.offsetHeight
      const tableH = myHeight - 120
      height.value = tableH
      console.log('myHeight', myHeight)
    }

    go()

    window.onresize = () => {
      go()
    }
  })
</script>

<style scoped lang="less">
  .general-card {
    height: calc(calc(100vh - 85px) * 0.5) !important;
    overflow: hidden;
  }
  :deep(.arco-textarea) {
    height: 75px;
  }
</style>
