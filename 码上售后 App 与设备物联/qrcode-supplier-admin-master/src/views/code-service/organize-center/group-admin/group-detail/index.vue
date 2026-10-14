<template>
  <div class="group-detail-box">
    <a-card>
      <template #title>
        <div class="card-title">
          <span>组信息</span>
          <span class="close-btn" @click="handleGoList">
            <icon-close />返回
          </span>
        </div>
      </template>
      <a-descriptions :data="groupData" size="medium" :column="1">
        <template #value="{ value, index }">
          <div v-if="editIndex !== index">
            <span class="value-box">
              {{ value || '-' }}
            </span>
            <icon-edit
              v-if="index === 0 || index === 2"
              @click="handleEdit(index)"
            />
          </div>
          <div v-if="(index === 0 || index === 2) && editIndex === index">
            <a-form ref="formRef" :model="form" class="form">
              <a-form-item
                field="groupValue"
                hide-label
                :style="{
                  width: '320px',
                  marginRight: '10px',
                  marginBottom: '0',
                }"
                :rules="rules"
                :validate-trigger="['change', 'input']"
              >
                <a-input
                  v-model="form.groupValue"
                  :style="{ width: '320px', marginRight: '10px' }"
                  :placeholder="placeholder"
                  allow-clear
                />
              </a-form-item>
              <icon-save @click="handleSaveGroup(index)" />
            </a-form>
          </div>
        </template>
      </a-descriptions>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-tabs v-model="tabIndex" @change="handleChangeTab">
        <a-tab-pane key="1" title="用户">
          <a-space style="margin-bottom: 20px">
            <a-button type="primary" @click="handleClickAddUser">
              添加用户
            </a-button>
            <a-button
              :disabled="userSelectedKeys.length === 0"
              type="primary"
              @click="handleClickDelUser"
            >
              移出用户
            </a-button>
          </a-space>
          <a-table
            v-model:selectedKeys="userSelectedKeys"
            :columns="userColumns"
            :data="userList"
            row-key="id"
            :row-selection="{
              type: 'checkbox',
              showCheckedAll: true,
            }"
            :loading="loading"
            :pagination="userState.params"
            @page-change="onUserChange"
            @page-size-change="onUserPageSizeChange"
          >
            <template #createTime="{ record }">
              {{ dayjs(record.createTime).format('YYYY-MM-DD ') }}
            </template>
            <template #actions="{ record }">
              <a-button type="text" @click="handleDelUser(record)">
                移出该组
              </a-button>

              <a-button type="text" @click="onUpdatePriority(record)">
                修改权重
              </a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" title="设备">
          <a-space style="margin-bottom: 20px">
            <a-button type="primary" @click="handleClickAddDevice">
              添加设备
            </a-button>
            <a-button
              :disabled="deviceSelectedKeys.length === 0"
              type="primary"
              @click="handleClickDelDevice"
            >
              移出设备
            </a-button>
          </a-space>
          <a-table
            v-model:selectedKeys="deviceSelectedKeys"
            :columns="deviceColumns"
            :data="deviceList"
            row-key="id"
            :row-selection="{
              type: 'checkbox',
              showCheckedAll: true,
            }"
            :pagination="deviceState.params"
            :loading="loading"
            @page-change="onDeviceChange"
            @page-size-change="onDevicePageSizeChange"
          >
            <template #createTime="{ record }">
              {{ dayjs(record.createTime).format('YYYY-MM-DD ') }}
            </template>
            <template #actions="{ record }">
              <a-button type="text" @click="handleDelDevice(record)">
                移出该组
              </a-button>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
      <template #title>确定从此分组中移出该项?</template>
      <div
        >确定从此分组中移出
        <span style="color: #165dff">
          {{ tabIndex === '1' ? delInfo?.nickName : delInfo?.sn }}
        </span>
        ?
      </div>
    </a-modal>
    <a-modal
      v-model:visible="delVisible"
      @ok="handleDelOk"
      @cancel="handleDelCancel"
    >
      <template #title>确定从此分组中移出?</template>
      <div
        >确定从此分组中移出
        <span style="color: #165dff">
          {{
            tabIndex === '1'
              ? userSelectedKeys.length
              : deviceSelectedKeys.length
          }}
        </span>
        项?
      </div>
    </a-modal>
    <a-modal
      v-model:visible="weightModal.visible"
      simple
      title="修改权重"
      :on-before-ok="handleDelOk2"
    >
      <template #title>设定权重</template>
      <m-form
        ref="priorityRefs"
        v-bind="priorityConfig"
        v-model="priorityValue"
        @change-value="handlePriorityValue"
      ></m-form>
      <!-- <a-input v-model="weightModal.weight"></a-input> -->
    </a-modal>
    <distribution-modal
      :visible="distributionVisible"
      :type="distributionType"
      :distribution-id="distributionId"
      @handle-ok="handleModalOk"
      @handle-cancel="handleModalCancel"
    ></distribution-modal>
  </div>
</template>

<script lang="ts" setup>
  import {
    updateGroup,
    getGroupUser,
    getGroupDevice,
    geGroupDetail,
    deleteDevice,
    deleteUser,
    addUserToGroup,
    addDeviceToGroup,
  } from '@/api/code-service/organize-center/group-admin/index'
  import { Message } from '@arco-design/web-vue'
  import dayjs from 'dayjs'
  import _ from 'lodash'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import { updatePriority } from '@/api/code-service/prod-center/customerService/index.ts'
  import distributionModal from '../components/distributionModal.vue'

  const props = defineProps({
    groupInfo: {
      type: String,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
  })

  const weightModal = reactive({
    visible: false,
    weight: '',
  })

  // 定义设定权重弹框refs对象
  const priorityRefs = ref()

  // 定义设定权重弹框表单
  const priorityConfig: IForm = reactive({
    formItems: [
      {
        field: 'priority',
        type: 'number',
        label: '设置权重',
        mode: 'button',
        alert: {
          text: '权重越高，越优先接收通话',
        },
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 设定权重表单数据
  const priorityValue = ref({
    userId: '',
    nickName: '',
    priority: 0,
  })

  // 更新设定权重表单数据
  const handlePriorityValue = (value) => {
    priorityValue.value = value
  }

  // 定义标签选中值
  const tabIndex = ref('1')

  // 定义分组详情
  const groupData = ref([])

  // 定义修改index
  const editIndex = ref('-1')

  // 定义输入框placeholder
  const placeholder = ref('')

  // 定义输入框的值
  const form = ref({
    groupValue: '',
  })

  // 定义输入框验证规则
  const rules = ref([])

  // 定义表单ref
  const formRef = ref()

  // 定义selectedKeys
  const userSelectedKeys = ref([])
  const deviceSelectedKeys = ref([])

  // 获取分组详情
  const resGetGroupDetail = async () => {
    const { data } = await geGroupDetail({
      id: props.groupInfo.id,
    })
    // 组合分组详情
    groupData.value = [
      {
        label: '组名',
        value: data.groupName,
      },
      {
        label: '组别ID',
        value: data.id,
      },
      {
        label: '备注',
        value: data.remark,
      },
      {
        label: '创建时间',
        value: data.createTime,
      },
    ]
  }

  // 设定权重表单确定事件
  const handleDelOk2 = async (done: (closed: boolean) => void) => {
    const value = await priorityRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await updatePriority({ ...priorityValue.value })
        resGetGroupUser()
        done(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  function onUpdatePriority(record: any) {
    console.log('record', record)
    weightModal.visible = true
    const { priority, userId, nickName } = record
    priorityValue.value = {
      priority,
      userId,
      nickName,
    }
  }

  // 侦听是否有分组详情传递
  watch(
    () => props.pageType,
    async (newVal) => {
      if (newVal === 'detail' && props.groupInfo) {
        resGetGroupDetail()
      }
    },
    {
      deep: true,
      immediate: true,
    }
  )

  watch(
    () => editIndex.value,
    (newVal) => {
      switch (newVal) {
        case 0:
          placeholder.value = '请输入组名'
          form.value.groupValue = groupData.value[0].value || ''
          rules.value = [{ required: true, message: '请填写组名' }]
          break
        case 2:
          placeholder.value = '请输入备注'
          form.value.groupValue = groupData.value[2].value || ''
          break
        default:
          placeholder.value = '请输入组名'
          break
      }
    },
    {
      deep: true,
    }
  )

  // 修改图标点击事件
  const handleEdit = (index) => {
    editIndex.value = index
  }

  // 点击保存图标事件
  const handleSaveGroup = async (index) => {
    if (index === 0) {
      const value = await formRef.value.validate()
      if (!value) {
        try {
          await updateGroup({
            groupName: form.value.groupValue,
            id: props.groupInfo.id,
          })
          resGetGroupDetail()
          editIndex.value = -1
          Message.success('修改成功')
        } catch (error) {
          console.log(error)
        }
      }
    } else if (index === 2) {
      try {
        await updateGroup({
          remark: form.value.groupValue,
          id: props.groupInfo.id,
        })
        resGetGroupDetail()
        editIndex.value = -1
        Message.success('修改成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 定义表格loading
  const loading = ref(false)
  // 定义用户表格userColumns
  const userColumns = reactive([
    {
      title: '用户名称',
      key: 'nickName',
      dataIndex: 'nickName',
    },
    {
      title: '角色',
      key: 'remark',
      render: () => '客服',
    },
    {
      title: '权重',
      key: 'priority',
      dataIndex: 'priority',
    },
    {
      title: '创建时间',
      key: 'createTime',
      slotName: 'createTime',
    },
    {
      title: '操作',
      key: 'actions',
      slotName: 'actions',
      width: 150,
    },
  ])

  // 定义设备表格userColumns
  const deviceColumns = reactive([
    {
      title: '设备SN号',
      key: 'sn',
      dataIndex: 'sn',
    },
    {
      title: '创建时间',
      key: 'createTime',
      slotName: 'createTime',
    },
    {
      title: '操作',
      key: 'actions',
      slotName: 'actions',
      width: 150,
    },
  ])

  // 定义用户list
  const userList = ref([])
  // 定义设备list
  const deviceList = ref([])

  // 获取组内用户数据
  const resGetGroupUser = async () => {
    loading.value = true
    const { data } = await getGroupUser(
      _.pickBy({
        groupId: props.groupInfo.id,
        pageNum: userState.params.pageNum,
        pageSize: userState.params.pageSize,
      })
    )
    userList.value = data.items
    userState.params.total = data.total
    loading.value = false
  }

  // 获取组内设备数据
  const resGetGroupDevice = async () => {
    loading.value = true
    const { data } = await getGroupDevice(
      _.pickBy({
        groupId: props.groupInfo.id,
        pageNum: deviceState.params.pageNum,
        pageSize: deviceState.params.pageSize,
      })
    )
    deviceList.value = data.items
    deviceState.params.total = data.total
    loading.value = false
  }

  // 定义分页信息
  const userState = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: '',
    },
  })

  const deviceState = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: '',
    },
  })

  // 分页事件
  const onUserChange = (page: number) => {
    userState.params.pageNum = page
    resGetGroupUser()
  }

  const onUserPageSizeChange = (size: number) => {
    userState.params.pageSize = size
    resGetGroupUser()
  }

  // 分页事件
  const onDeviceChange = (page: number) => {
    deviceState.params.pageNum = page
    resGetGroupDevice()
  }

  const onDevicePageSizeChange = (size: number) => {
    deviceState.params.pageSize = size
    resGetGroupDevice()
  }

  // tab栏切换事件
  const handleChangeTab = (key) => {
    tabIndex.value = key
    // if (key === '1') {
    //   resGetGroupUser()
    // } else if (key === '2') {
    //   resGetGroupDevice()
    // }
  }

  // 定义visible
  const visible = ref(false)
  // 定义删除信息
  const delInfo = ref({})

  // 移出用户事件
  const handleDelUser = (record) => {
    delInfo.value = record
    visible.value = true
  }

  // 移出事件
  const handleDelDevice = (record) => {
    delInfo.value = record
    visible.value = true
  }

  // 移出确定事件
  const handleOk = async () => {
    if (tabIndex.value === '1') {
      try {
        await deleteUser([delInfo.value.id])
        resGetGroupUser()
        Message.success('移出成功')
      } catch (error) {
        console.log(error)
      }
    } else if (tabIndex.value === '2') {
      try {
        await deleteDevice([delInfo.value.id])
        resGetGroupDevice()
        Message.success('移出成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 侦听tab栏选中
  watch(
    () => tabIndex.value,
    (newVal) => {
      console.log(newVal)
      if (newVal === '1') {
        resGetGroupUser()
      } else if (newVal === '2') {
        resGetGroupDevice()
      }
    },
    {
      deep: true,
      immediate: true,
    }
  )

  const emit = defineEmits(['goList'])
  // 前往分组列表页面
  const handleGoList = () => {
    emit('goList')
  }

  // 定义分配弹框distributionVisible
  const distributionVisible = ref(false)

  // 定义分配弹框类型
  const distributionType = ref('')

  // 定义分配弹框id
  const distributionId = ref('')

  // 添加用户事件
  const handleClickAddUser = () => {
    distributionVisible.value = true
    distributionType.value = 'user'
    distributionId.value = props.groupInfo.id
  }

  // 添加设备事件
  const handleClickAddDevice = () => {
    distributionVisible.value = true
    distributionType.value = 'device'
    distributionId.value = props.groupInfo.id
  }

  // 添加用户弹窗确定事件
  const handleModalOk = async (val) => {
    try {
      const userIds = []
      val.ids.forEach((item) => {
        userIds.push(item.userId)
      })
      if (val.type === 'user') {
        await addUserToGroup({
          groupId: val.groupId,
          userIds,
        })
        Message.success('修改成功')
        resGetGroupUser()
      } else if (val.type === 'device') {
        const deviceIds = []
        val.ids.forEach((item) => {
          deviceIds.push(item.deviceId)
        })
        await addDeviceToGroup({
          groupId: val.groupId,
          deviceIds,
        })
        Message.success('修改成功')
        resGetGroupDevice()
      }
    } catch (error) {
      console.log(error)
    }
    distributionVisible.value = false
    distributionType.value = ''
    distributionId.value = ''
  }

  // 添加用户弹窗取消事件
  const handleModalCancel = () => {
    distributionVisible.value = false
    distributionType.value = ''
    distributionId.value = ''
  }

  // 定义移出visible
  const delVisible = ref(false)

  // 移出用户
  const handleClickDelUser = () => {
    delVisible.value = true
  }

  // 移出设备
  const handleClickDelDevice = () => {
    delVisible.value = true
  }

  // 移出确定事件
  const handleDelOk = async () => {
    if (tabIndex.value === '1') {
      try {
        await deleteUser([...userSelectedKeys.value])
        userSelectedKeys.value = []
        resGetGroupUser()
        Message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    } else if (tabIndex.value === '2') {
      try {
        await deleteDevice([...deviceSelectedKeys.value])
        deviceSelectedKeys.value = []
        resGetGroupDevice()
        Message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 移出取消事件
  const handleDelCancel = () => {
    delVisible.value = false
  }
</script>

<style lang="less" scoped>
  .group-detail-box {
    padding: 20px;
  }

  .value-box {
    display: inline-block;
    margin-right: 10px;
  }

  .form {
    flex-direction: row;
    align-items: center;
  }

  .card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;

    .close-btn {
      cursor: pointer;
      color: #d22e00;
    }
  }
</style>
