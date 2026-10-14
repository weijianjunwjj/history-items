<template>
  <a-card title="设备信息" class="general-card" :bordered="false">
    <a-tabs default-active-tab="1">
      <a-tab-pane key="1" title="设备信息">
        <div class="field-box">
          <div class="field-name">设备图片：</div>
          <img
            style="width: 80px; height: 80px"
            :src="deviceInfo.deviceVO.deviceImage"
            alt=""
          />
        </div>
        <div class="field-box">
          <div class="field-name">设备名称：</div>
          {{ deviceInfo.deviceVO.name }}
        </div>
        <div class="field-box">
          <div class="field-name">设备序列号：</div>
          {{ deviceInfo.deviceVO.sn }}
        </div>
        <div class="field-box">
          <div class="field-name">设备归属：</div>
          {{ deviceInfo.deviceVO.customerName }}
        </div>
        <div class="field-box">
          <div class="field-name">设备位置：</div>
          {{ deviceInfo.deviceVO.address }}
        </div>
        <div class="field-box">
          <div class="field-name">收货地址：</div>
          {{ deviceInfo.deviceVO.deliveryAddress }}
        </div>
        <div class="field-box">
          <div class="field-name">视频报修次数：</div>
          {{ deviceInfo.faceRepairNums ?? 0 }}次（设备报修总次数）
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" title="设备报修记录">
        <!-- <div class="device-title">本设备报修记录</div> -->
        <a-table :columns="columns" :data="deviceInfo.repairRecordDtos" />
      </a-tab-pane>
      <a-tab-pane key="3" title="报修人信息">
        <!-- <div class="device-title">报修人信息</div> -->
        <div class="field-box">
          <div class="field-name">报修人账号：</div>
          {{ deviceInfo.repairUserDto.phone }}
        </div>
        <!-- <div class="field-box">
          <div class="field-name">扫码次数：</div>
          {{ deviceInfo.repairUserDto.scanNumber ?? 0 }}次
        </div>
        <div class="field-box">
          <div class="field-name">扫码设备：</div>
          {{ deviceInfo.repairUserDto.scanDeviceNums ?? 0 }}台
        </div> -->
        <div class="field-box">
          <div class="field-name">视频连线次数：</div>
          {{ deviceInfo.repairUserDto.faceTimeNums ?? 0 }}次（当前设备）
        </div>
        <div class="field-box">
          <div class="field-name">上次视频连线：</div>
          {{ deviceInfo.repairUserDto.latestFaceTime ?? 0 }}
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
  import { useChatStore } from '@/store'
  import { parseTime } from '@/utils/utils'
  import { storeToRefs } from 'pinia'

  const app = window.$app
  const chatStore = useChatStore()
  const deviceInfo0 = ref({
    deviceVO: {},
    repairRecordDtos: [],
    repairUserDto: {},
  })
  const deviceInfo = ref({
    deviceVO: {},
    repairRecordDtos: [],
    repairUserDto: {},
  })
  const { deviceInfo: _deviceInfo } = storeToRefs(chatStore)
  const { statusMapper } = app.chatStore

  watch(
    () => _deviceInfo,
    (__deviceInfo) => {
      const newObj = { ...deviceInfo0.value, ...__deviceInfo.value }
      deviceInfo.value = newObj
    },
    {
      deep: true,
    }
  )

  const ticketState = ['', '用户报修', '安排工程师', '完成维修']

  const columns = reactive([
    {
      title: '报修时间',
      dataIndex: 'createTime',
      render: (row: any) => parseTime(row.record.createTime, undefined),
    },
    {
      title: '故障描述',
      dataIndex: 'ticketContent',
    },
    {
      title: '报修人',
      dataIndex: 'reporterPhone',
    },
    {
      title: '状态',
      dataIndex: 'ticketState',
      render: (row: any) => ticketState[row.record.ticketState],
      width: 120,
    },
  ])
</script>

<style scoped lang="less">
  .general-card {
    height: calc(calc(calc(100vh - 85px) * 0.5) - 32px) !important;
    overflow: auto;
  }
  .field-box {
    display: flex;
    margin-bottom: 15px;
    padding: 0 15px;
    color: #333333;
  }

  .field-name {
    color: #646c9a;
    width: 100px;
  }

  .device-title {
    font-size: 18px;
    padding-left: 15px;
    color: #333;
    margin-bottom: 15px;
  }
</style>
