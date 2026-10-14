<template>
  <div class="device-admin-box">
    <m-form
      v-bind="searchFormConfig"
      v-model="searchParams"
      @change-value="handleSearchChangeValue"
    >
      <template #right>
        <MButton v-bind="searchBtnConfig"></MButton>
      </template>
    </m-form>
    <div class="add-iot-device">
      <a-button type="primary" @click="handleAddIotDevice">
        <template #icon>
          <icon-plus />
        </template>
        <template #default>添加物联设备</template>
      </a-button>
    </div>
    <a-spin :loading="loading">
      <a-row class="device-box" :gutter="20">
        <template v-if="iotDeviceList.length">
          <a-col
            v-for="item in iotDeviceList"
            :key="item.id"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="8"
            :xxl="6"
          >
            <div class="device-item">
              <div class="device-top">
                <div class="left">
                  <div class="title">{{ item.productName || '' }}</div>
                  <div class="model">{{ item.sn }}</div>
                </div>
                <div class="right">
                  <a-image
                    width="60"
                    :src="item.deviceImage"
                    :preview="false"
                  />
                </div>
              </div>
              <div class="status">
                <div v-if="item.status === 0" class="left">
                  <!-- <icon-font
                    type="icon-moren"
                    :size="24"
                    :style="{
                      color: '#4b7902',
                    }"
                  /> -->
                  <!-- <icon-wifi :style="{ color: '#4b7902' }" :size="24" /> -->
                  <img width="15" src="~@/assets/iot-device/runnormal.png" />
                  <span class="normal">运行正常</span>
                </div>
                <div v-if="item.status === 1" class="left">
                  <!-- <icon-wifi :style="{ color: '#1890ff' }" :size="24" /> -->
                  <img width="15" src="~@/assets/iot-device/runonline.png" />
                  <span class="running">正在运行</span>
                </div>
                <div v-if="item.status === 2" class="left">
                  <!-- <icon-wifi :style="{ color: '#7f7f7f' }" :size="24" /> -->
                  <img width="15" src="~@/assets/iot-device/runoff.png" />
                  <span class="offline">设备离线</span>
                </div>
                <div class="right">
                  <a-tooltip
                    background-color="#fff"
                    :content-style="{
                      color: '#000',
                      boxShadow: '0px 0px 2px #ccc',
                    }"
                    position="bottom"
                  >
                    <span class="right-span">
                      <span class="fault">
                        故障 · {{ item.faultRecords.length }}
                      </span>
                      <span class="maintenance">
                        维保 · {{ item.maintenanceRecords.length }}
                      </span>
                    </span>
                    <template #content>
                      <div
                        v-if="
                          item.faultRecords.length ||
                          item.maintenanceRecords.length
                        "
                        class="fault-content"
                      >
                        <div
                          v-for="faultitem in item.faultRecords"
                          :key="faultitem.id"
                        >
                          <span class="warning"></span>
                          <span>{{ faultitem.faultMsg }}</span>
                        </div>
                        <div
                          v-for="weibaoitem in item.maintenanceRecords"
                          :key="weibaoitem.id"
                        >
                          <span class="weibao"></span>
                          <span>{{ weibaoitem.content }}</span>
                        </div>
                      </div>
                      <div v-else> 暂无信息 </div>
                    </template>
                  </a-tooltip>
                </div>
              </div>
              <div class="device-data">
                <div v-if="item.deviceData.running" class="device-data-item">
                  <img src="~@/assets/iot-device/running.png" width="15" />
                  <span v-if="item.deviceData.running === 0">设备正常</span>
                  <span v-if="item.deviceData.running === 1">设备运行</span>
                  <span v-if="item.deviceData.running === 2">设备离线</span>
                </div>
                <div v-if="item.deviceData.pressure" class="device-data-item">
                  <img src="~@/assets/iot-device/pressure.png" width="15" />
                  <span>{{ item.deviceData.pressure }}bar</span>
                </div>
                <div v-if="item.deviceData.flow" class="device-data-item">
                  <img src="~@/assets/iot-device/flow.png" width="15" />
                  <span>{{ item.deviceData.flow }}V</span>
                </div>
                <div
                  v-if="item.deviceData.innerTempreture"
                  class="device-data-item"
                >
                  <img
                    src="~@/assets/iot-device/innerTemperture.png"
                    width="15"
                  />
                  <span>{{ item.deviceData.innerTempreture }}℃</span>
                </div>
                <div
                  v-if="item.deviceData.motorTempreture"
                  class="device-data-item"
                >
                  <img
                    src="~@/assets/iot-device/motorTempreture.png"
                    width="15"
                  />
                  <span>{{ item.deviceData.motorTempreture }}℃</span>
                </div>
                <div
                  v-if="item.deviceData.outerTempreture"
                  class="device-data-item"
                >
                  <img
                    src="~@/assets/iot-device/outerTempreture.png"
                    width="15"
                  />
                  <span>{{ item.deviceData.outerTempreture }}℃</span>
                </div>
                <div
                  v-if="item.deviceData.heatingTemperature"
                  class="device-data-item"
                >
                  <img
                    src="~@/assets/iot-device/heartingTemperature.png"
                    width="15"
                  />
                  <span>{{ item.deviceData.heatingTemperature }}℃</span>
                </div>
                <div v-if="item.deviceData.voltage" class="device-data-item">
                  <img src="~@/assets/iot-device/voltage.png" width="15" />
                  <span>{{ item.deviceData.voltage }}V</span>
                </div>
                <div v-if="item.deviceData.current" class="device-data-item">
                  <img src="~@/assets/iot-device/current.png" width="15" />
                  <span>{{ item.deviceData.current }}A</span>
                </div>
                <div v-if="item.deviceData.workTime" class="device-data-item">
                  <img src="~@/assets/iot-device/runtime.png" width="15" />
                  <span>{{ item.deviceData.workTime }}H</span>
                </div>
                <div v-if="item.deviceData.totalTime" class="device-data-item">
                  <img src="~@/assets/iot-device/totalTime.png" width="15" />
                  <span>{{ item.deviceData.workTime }}H</span>
                </div>
              </div>
              <div class="device-address">
                <!-- <icon-font type="icon-moren" :size="24" /> -->
                <icon-location style="color: #909796" />
                <span>{{ item.address }}</span>
              </div>
              <div class="bottom">
                <div
                  class="bottom-item"
                  @click="
                    handleClickEditIot(
                      item.sn,
                      item.iotDeviceId,
                      item.imei,
                      item.phone,
                      item.id
                    )
                  "
                >
                  <icon-edit />
                  <span>编辑</span>
                </div>
                <div
                  class="bottom-item"
                  @click="handleRemoteConfig(item.iotDeviceId)"
                >
                  <icon-settings />
                  <span>远程配置</span>
                </div>
                <div
                  class="bottom-item"
                  @click="
                    router.push({
                      name: 'iotDevice_iotDeviceAdmin_runingLog',
                      query: {
                        id: item.id,
                        img: item.deviceImage,
                        productName: item.productName,
                        sn: item.sn,
                      },
                    })
                  "
                >
                  <icon-dashboard />
                  <span>运行数据</span>
                </div>
                <!-- <div class="bottom-item">
                  <a-tooltip content="编辑">
                    <icon-edit
                      @click="
                        router.push({
                          name: 'iotDevice_deviceAdmin_runingLog',
                        })
                      "
                    />
                  </a-tooltip>
                </div>
                <div class="bottom-item">
                  <a-tooltip content="远程配置">
                    <icon-edit />
                  </a-tooltip>
                </div>
                <div class="bottom-item">
                  <a-tooltip content="运行数据">
                    <icon-edit />
                  </a-tooltip>
                </div>
                <div class="bottom-item">
                  <a-tooltip content="设备报警记录">
                    <icon-edit />
                  </a-tooltip>
                </div>
                <div class="bottom-item">
                  <a-tooltip content="设备维保提醒">
                    <icon-edit />
                  </a-tooltip>
                </div> -->
              </div>
            </div>
          </a-col>
        </template>
        <a-empty v-else />
      </a-row>
    </a-spin>
    <a-pagination
      class="pagination"
      :total="total"
      :current="pageNum"
      :page-size="pageSize"
      show-total
      show-jumper
      show-page-size
      :page-size-options="[12, 24, 36, 48]"
      @change="handleChangePageNum"
      @page-size-change="handleChangePageSize"
    />
    <a-modal
      v-model:visible="addIotDeviceVisible"
      unmount-on-close
      :on-before-ok="handleAddIotDeviceOk"
      @before-close="handleAddIotDeviceCancel"
    >
      <template #title> 添加物联设备 </template>
      <m-form
        ref="addIotDeviceRefs"
        v-bind="addIotDeviceConfig"
        v-model="addIotDeviceValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="editIotDeviceVisible"
      unmount-on-close
      @cancel="handleEditIotDeviceCancel"
    >
      <template #title> 编辑物联设备 </template>
      <template #footer>
        <div class="edit-modal-footer">
          <a-popconfirm
            content="确定删除此设备?"
            position="bottom"
            @ok="handleDelIotDeviceOk"
          >
            <a-button type="outline" status="warning">删除设备</a-button>
          </a-popconfirm>
          <a-space>
            <a-button @click="handleEditIotDeviceCancel">取消</a-button>
            <a-button type="primary" @click="handleEditIotDeviceOk">
              确定
            </a-button>
          </a-space>
        </div>
      </template>
      <m-form
        ref="editIotDeviceRefs"
        v-bind="editIotDeviceConfig"
        v-model="editIotDeviceValue"
        @change-value="handleEditChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="remoteConfigVisible"
      unmount-on-close
      :on-before-ok="handleRemoteConfigOk"
      @before-close="handleRemoteConfigCancel"
    >
      <template #title> 设备远程配置 </template>
      <m-form
        ref="remoteConfigRefs"
        v-bind="remoteConfigConfig"
        v-model="remoteConfigValue"
        @change-value="handleRemoteConfigValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  import {
    getIotDeviceList,
    updateIotDevice,
    getRemoteConfig,
    addRemoteConfig,
    updateRemoteConfig,
    addDevice,
    unrelIotDevice,
    deleteIotDevice,
  } from '@/api/iot-device/index.ts'
  import _ from 'lodash'

  // 定义搜索表单数据
  const searchParams = ref({
    status: '',
    customerName: '',
    sn: '',
    productName: '',
  })

  const router = useRouter()
  const route = useRoute()

  const { keyWord } = route.query

  searchParams.value.productName = keyWord

  const loading = ref(true)

  // 定义分页数据
  const pageNum = ref(1)
  const pageSize = ref(12)
  const total = ref(0)

  // 定义设备列表
  const iotDeviceList = ref([])

  // 分页页码改变事件
  const handleChangePageNum = (current) => {
    pageNum.value = current
    resGetIotDeviceList()
  }

  // 分页条数改变事件
  const handleChangePageSize = (value) => {
    pageSize.value = value
    resGetIotDeviceList()
  }

  // 获取物联设备数据
  const resGetIotDeviceList = async () => {
    try {
      const { data } = await getIotDeviceList(
        _.pickBy({
          ...searchParams.value,
          pageNum: pageNum.value,
          pageSize: pageSize.value,
        })
      )
      iotDeviceList.value = [...data.items]
      total.value = data.total
    } catch (error) {
      console.log(error)
    }
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'status',
        type: 'select',
        label: '设备状态',
        placeholder: '请选择设备状态',
        options: [
          {
            value: '0',
            label: '设备正常',
          },
          {
            value: '1',
            label: '设备运行',
          },
          {
            value: '2',
            label: '设备离线',
          },
        ],
      },
      {
        field: 'customerName',
        type: 'input',
        label: '设备归属',
        placeholder: '请输入设备归属',
      },
      {
        field: 'sn',
        type: 'input',
        label: '设备序列号',
        placeholder: '请输入设备序列号',
      },
      {
        field: 'productName',
        type: 'input',
        label: '产品名称',
        placeholder: '请输入产品名称',
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
          resGetIotDeviceList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            status: '',
            customerName: '',
            sn: '',
            productName: '',
          }
        },
      },
    ],
  })

  // 定义添加物联设备弹框visible
  const addIotDeviceVisible = ref(false)

  // 添加物联设备按钮点击事件
  const handleAddIotDevice = () => {
    addIotDeviceVisible.value = true
  }

  const snList = ref([])

  // 获取物联设备sn号码
  const resUnrelIotDevice = async () => {
    try {
      const { data } = await unrelIotDevice()
      snList.value = data.items
    } catch (error) {
      console.log(error)
    }
  }

  // 定义添加物联设备弹框refs对象
  const addIotDeviceRefs = ref()

  // 定义添加物联设备弹框表单
  const addIotDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'deviceId',
        type: 'select',
        label: '设备序列号',
        placeholder: '请选择设备序列号',
        search: true,
        fieldNames: { value: 'id', label: 'sn' },
        options: snList,
        rules: [
          {
            required: true,
            message: '请选择设备序列号',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'imei',
        type: 'input',
        label: 'IMEI号码',
        placeholder: '请输入IMEI号码',
        rules: [
          {
            required: true,
            message: '请填写IMEI号码',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'phone',
        type: 'input',
        label: '管理人手机',
        placeholder: '请输入管理人手机',
        rules: [
          {
            required: true,
            message: '请填写管理人手机',
          },
          {
            match:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 新增/修改表单数据
  const addIotDeviceValue = ref({
    imei: '',
    phone: '',
    deviceId: '',
  })

  // 更新添加物联设备弹框表单数据
  const handleAddChangeValue = (value) => {
    addIotDeviceValue.value = value
  }

  // 添加物联设备弹框确定按钮点击事件
  const handleAddIotDeviceOk = async (done: (closed: boolean) => void) => {
    const value = await addIotDeviceRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        done(true)
        await addDevice({
          ...addIotDeviceValue.value,
        })
        handleAddIotDeviceCancel()
        pageInit()
        Message.success('添加成功')
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 添加物联设备弹框关闭事件
  const handleAddIotDeviceCancel = () => {
    addIotDeviceVisible.value = false
    addIotDeviceValue.value = {
      imei: '',
      phone: '',
      deviceId: '',
    }
  }

  // 定义修改物联设备弹框visible
  const editIotDeviceVisible = ref(false)

  // 编辑按钮点击事件
  const handleClickEditIot = (sn, id, imei, phone, deviceId) => {
    editIotDeviceValue.value.sn = sn
    editIotDeviceValue.value.id = id
    editIotDeviceValue.value.imei = imei
    editIotDeviceValue.value.phone = phone
    editIotDeviceValue.value.deviceId = deviceId
    editIotDeviceVisible.value = true
  }

  // 修改物联设备弹框确定按钮点击事件
  const handleEditIotDeviceOk = async () => {
    const value = await editIotDeviceRefs.value.formValidate()
    if (!value) {
      try {
        console.log(editIotDeviceValue.value)
        await updateIotDevice({
          ...editIotDeviceValue.value,
        })
        handleEditIotDeviceCancel()
        resGetIotDeviceList()
        Message.success('修改成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 修改物联设备弹框关闭事件
  const handleEditIotDeviceCancel = async () => {
    editIotDeviceVisible.value = false
    editIotDeviceValue.value = {
      id: '',
      sn: '',
      imei: '',
      phone: '',
      deviceId: '',
    }
  }

  // 定义修改物联设备弹框refs对象
  const editIotDeviceRefs = ref()

  // 定义修改物联设备弹框表单
  const editIotDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'sn',
        type: 'input',
        label: '设备序列号',
        disabled: true,
        placeholder: '请输入设备序列号',
        rules: [
          {
            required: true,
            message: '请填写设备序列号',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'imei',
        type: 'input',
        label: 'IMEI号码',
        placeholder: '请输入IMEI号码',
        rules: [
          {
            required: true,
            message: '请填写IMEI号码',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'phone',
        type: 'input',
        label: '管理人手机',
        placeholder: '请输入管理人手机',
        alert: {
          text: '更换后会与原手机号解绑',
        },
        rules: [
          {
            required: true,
            message: '请填写管理人手机',
          },
          {
            match:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请填写正确的手机号',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 新增/修改表单数据
  const editIotDeviceValue = ref({
    id: '',
    sn: '',
    imei: '',
    phone: '',
    deviceId: '',
  })

  // 更新添加物联设备弹框表单数据
  const handleEditChangeValue = (value) => {
    editIotDeviceValue.value = value
  }

  // 确认删除物联设备
  const handleDelIotDeviceOk = async () => {
    try {
      await deleteIotDevice({
        id: editIotDeviceValue.value.id,
      })
      Message.success('删除设备成功')
      handleEditIotDeviceCancel()
      resGetIotDeviceList()
    } catch (error) {
      console.log(error)
    }
  }

  // 定义设备远程配置弹框visible
  const remoteConfigVisible = ref(false)

  // 定义是否是第一次进行远程配置
  const remoteConfigFlag = ref(false)

  // 设备远程配置按钮点击事件
  const handleRemoteConfig = async (iotDeviceId) => {
    try {
      const { data } = await getRemoteConfig({
        iotDeviceId,
      })
      if (data) {
        remoteConfigFlag.value = true
        remoteConfigValue.value.id = data.id
        remoteConfigValue.value.collection = parseInt(data.dataCollectInterval)
        remoteConfigValue.value.upload = parseInt(data.dataUploadInterval)
        remoteConfigValue.value.lease = data.leaseExpireDate
      } else {
        remoteConfigFlag.value = false
      }
      remoteConfigValue.value.iotDeviceId = iotDeviceId
    } catch (error) {
      console.log(error)
    }
    remoteConfigVisible.value = true
  }

  // 定义添加物联设备弹框refs对象
  const remoteConfigRefs = ref()

  // 定义设备远程配置弹框表单
  const remoteConfigConfig: IForm = reactive({
    formItems: [
      {
        field: 'collection',
        type: 'number',
        label: '数据采集间隔',
        placeholder: '请输入数据采集间隔',
        append: '秒',
        rules: [
          {
            required: true,
            message: '请填写数据采集间隔',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'upload',
        type: 'number',
        label: '数据上传间隔',
        placeholder: '请输入数据上传间隔',
        append: '秒',
        rules: [
          {
            required: true,
            message: '请填写数据上传间隔',
          },
          {
            validator: (value, cb) => {
              return new Promise((resolve) => {
                window.setTimeout(() => {
                  if (value % remoteConfigValue.value.collection !== 0) {
                    cb('上传间隔应为采集间隔的整数倍')
                  }
                  resolve()
                }, 300)
              })
            },
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'lease',
        type: 'date',
        label: '租赁到期时间',
        placeholder: '请选择租赁到期时间',
        rules: [
          {
            required: true,
            message: '请选择租赁到期时间',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 设备远程配置数据
  const remoteConfigValue = ref({
    id: '',
    iotDeviceId: '',
    collection: '',
    upload: '',
    lease: '',
  })

  // 更新设备远程配置弹框表单数据
  const handleRemoteConfigValue = (value) => {
    remoteConfigValue.value = value
  }

  // 添加设备远程配置弹框确定按钮点击事件
  const handleRemoteConfigOk = async (done: (closed: boolean) => void) => {
    const value = await remoteConfigRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        try {
          if (!remoteConfigFlag.value) {
            await addRemoteConfig({
              iotDeviceId: remoteConfigValue.value.iotDeviceId,
              dataUploadInterval: remoteConfigValue.value.upload,
              dataCollectInterval: remoteConfigValue.value.collection,
              leaseExpireDate: remoteConfigValue.value.lease,
            })
            Message.success('添加成功')
          } else {
            await updateRemoteConfig({
              id: remoteConfigValue.value.id,
              iotDeviceId: remoteConfigValue.value.iotDeviceId,
              dataUploadInterval: remoteConfigValue.value.upload,
              dataCollectInterval: remoteConfigValue.value.collection,
              leaseExpireDate: remoteConfigValue.value.lease,
            })
            Message.success('修改成功')
          }
        } catch (error) {
          console.log(error)
        }
        done(true)
        handleRemoteConfigCancel()
        resGetIotDeviceList()
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 设备远程配置弹框关闭事件
  const handleRemoteConfigCancel = () => {
    remoteConfigVisible.value = false
    remoteConfigFlag.value = false
    remoteConfigValue.value = {
      id: '',
      iotDeviceId: '',
      collection: '',
      upload: '',
      lease: '',
    }
  }

  const pageInit = () => {
    Promise.all([resGetIotDeviceList(), resUnrelIotDevice()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageInit()
  })
</script>

<style lang="less" scoped>
  :deep(.work-order-search-box) {
    .arco-card-body {
      padding: 0;
    }
  }

  .device-admin-box {
    margin: 20px;
    min-height: calc(100vh - 102px);

    :deep(.arco-card-body) {
      padding: 20px !important;
    }

    .add-iot-device {
      margin-top: 20px;
    }

    .device-box {
      background: #f0f2f5;

      .device-item {
        margin-top: 20px;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
        box-sizing: border-box;

        .device-top {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          margin: 20px 20px 0;

          .left {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: flex-start;
            .title {
              margin-bottom: 10px;
              font-size: 16px;
              font-weight: 600;
            }

            .model {
              color: #646464;
            }
          }
        }

        .status {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          margin: 0 20px;

          .left {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .normal {
              color: #4b7902;
            }

            .offline {
              color: #7f7f7f;
            }

            .running {
              color: #1890ff;
            }

            span {
              margin-left: 5px;
            }
          }

          .right {
            .right-span {
              span {
                margin-left: 10px;
              }

              .fault {
                color: #e0001b;
              }

              .maintenance {
                color: #f59a23;
              }
            }
          }
        }

        .device-data {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          height: 50px;
          margin: 0 20px;

          .device-data-item {
            width: 20%;
            display: flex;
            align-items: center;

            span {
              margin-left: 5px;
              font-size: 12px;
              color: #333;
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .device-address {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 5px 20px 0;

          span {
            margin-left: 5px;
            color: #909796;
          }
        }

        .bottom {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 50px;
          border-top: 1px solid #eaeaea;
          align-items: center;
          margin-top: 15px;
          .bottom-item {
            text-align: center;
            width: 33%;
            border-right: 1px solid #e6e6e6;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #5a5a5a;
            cursor: pointer;

            span {
              margin-left: 5px;
            }

            &:nth-of-type(3) {
              border: none;
            }
          }

          // .bottom-item {
          //   text-align: center;
          //   width: 20%;
          //   border-right: 1px solid #e6e6e6;
          //   height: 30px;
          //   line-height: 30px;

          //   &:nth-of-type(5) {
          //     border: none;
          //   }
          // }
        }
      }
    }
  }

  .fault-content {
    .warning {
      width: 10px;
      height: 10px;
      background: #fe4d34;
      display: inline-block;
      margin-right: 10px;
    }

    .weibao {
      width: 10px;
      height: 10px;
      background: #f78f18;
      display: inline-block;
      margin-right: 10px;
    }
  }

  .edit-modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .pagination {
    background: #fff;
    width: 100%;
    text-align: right;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 5px;
  }

  .arco-empty {
    margin: 20px 10px 0;
    background-color: #fff;
  }

  .arco-spin {
    width: 100%;
  }
</style>
