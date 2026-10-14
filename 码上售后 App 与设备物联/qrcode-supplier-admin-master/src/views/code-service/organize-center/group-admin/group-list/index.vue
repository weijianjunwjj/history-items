<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: groupList,
        showSelect: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
        },
        onSelectionChange: handleSelectChange,
      }"
      :state="state"
      :pagination="{
        total: state.params.total,
        hideOnSinglePage: false,
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="pageDataInit"
    >
      <template #buttons>
        <a-button type="primary" @click="addGroupvisible = true">
          新增分组
        </a-button>
      </template>
      <template #name="{ record }">
        <span class="groupName" @click="handleGoGroupDetail(record)">
          {{ record.name }}
        </span>
      </template>
      <template #remark="{ record }">{{ record.remark || '-' }}</template>
      <template #actions="{ record }">
        <a-space class="btn-common">
          <MButton
            v-bind="tableActionsBtnConfig"
            :click-params="{ add: record, device: record, delete: record }"
          ></MButton>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addGroupvisible"
      :on-before-ok="handleAddGroupOk"
      @before-close="handleAddGroupCancel"
    >
      <template #title> 新增分组 </template>
      <m-form
        ref="addGroupRefs"
        v-bind="addGroupConfig"
        v-model="addGroupValue"
        @change-value="handleAddGroupValue"
      ></m-form>
    </a-modal>
    <distribution-modal
      :visible="distributionVisible"
      :type="distributionType"
      :distribution-id="distributionId"
      :distribution-pid="distributionPid"
      @handle-ok="handleOk"
      @handle-cancel="handleCancel"
    ></distribution-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { Message, Modal } from '@arco-design/web-vue'
  import {
    getGroupList,
    addGroup,
    deleteGroup,
    addUserToGroup,
    addDeviceToGroup,
  } from '@/api/code-service/organize-center/group-admin/index'
  import distributionModal from '../components/distributionModal.vue'

  const emit = defineEmits(['goDetail'])

  // 定义表格columns
  const columns = reactive([
    {
      title: '用户组名称',
      slotName: 'name',
      key: 'name',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '备注',
      slotName: 'remark',
      key: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 600,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义分组表格数据
  const groupList = ref([])

  // 获取表格数据
  const resGetGroupList = async () => {
    try {
      const { data } = await getGroupList({})
      groupList.value = data
    } catch (error) {
      console.log(error)
    }
  }

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: '',
    },
  })

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetGroupList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetGroupList()
  }

  // 定义弹窗visible
  const addGroupvisible = ref(false)

  // 弹窗确定事件
  const handleAddGroupOk = async (done: (closed: boolean) => void) => {
    const value = await addGroupRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await addGroup({ ...addGroupValue.value })
        handleAddGroupCancel()
        pageDataInit()
        done(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 弹窗取消事件
  const handleAddGroupCancel = () => {
    addGroupRefs.value.resetForm()
    addGroupvisible.value = false
  }

  // 定义自定义分组弹框refs对象
  const addGroupRefs = ref()
  const scascaderList = ref()

  // 定义自定义分组弹框表单
  const addGroupConfig: IForm = reactive({
    formItems: [
      {
        field: 'groupName',
        type: 'input',
        label: '分组名称',
        rules: [{ required: true, message: '请输入类目名称' }],
        trigger: ['change', 'input'],
      },
      {
        field: 'remark',
        type: 'input',
        label: '备注',
      },
      {
        field: 'parentId',
        type: 'select',
        label: '上级分组',
        placeholder: '请选择上级分组',
        fieldNames: { value: 'id', label: 'name' },
        options: scascaderList,
        strictly: true,
        trigger: ['change', 'input', 'blur'],
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 自定义分组表单数据
  const addGroupValue = ref({
    userId: '',
    nickName: '',
    priority: 0,
  })

  // 更新设定权重表单数据
  const handleAddGroupValue = (value) => {
    addGroupValue.value = value
  }

  // 定义分配弹框distributionVisible
  const distributionVisible = ref(false)

  // 定义分配弹框类型
  const distributionType = ref('')

  // 定义分配弹框id
  const distributionId = ref('')

  // 定义表格操作栏按钮
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'addUser',
        icon: true,
        type: 'text',
        params: 'add',
        clickFunc: ($event, record) => {
          console.log('record', record)
          distributionVisible.value = true
          distributionType.value = 'user'
          distributionId.value = record.id
        },
      },
      {
        name: 'addDevice',
        icon: true,
        type: 'text',
        params: 'add',
        clickFunc: ($event, record) => {
          distributionVisible.value = true
          distributionType.value = 'device'
          distributionId.value = record.id
        },
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        clickFunc: async ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: async () => {
              try {
                await deleteGroup({
                  id: record.id,
                })
                Message.success('删除成功')
                pageDataInit()
              } catch (error) {
                console.log(error)
              }
            },
          })
        },
        params: 'delete',
      },
    ],
  })

  // 添加用户弹窗确定事件
  const handleOk = async (val) => {
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
      }
    } catch (error) {
      console.log(error)
    }
    distributionVisible.value = false
    distributionType.value = ''
    distributionId.value = ''
  }

  // 添加用户弹窗取消事件
  const handleCancel = () => {
    distributionVisible.value = false
    distributionType.value = ''
    distributionId.value = ''
  }

  // 前往分组详情页面
  const handleGoGroupDetail = (record) => {
    emit('goDetail', {
      groupInfo: record,
    })
  }

  const getParents = async () => {
    try {
      const { data } = await getGroupList({
        parentId: 0,
      })
      scascaderList.value = data
    } catch (error) {
      console.log(error)
    }
    // scascaderList
  }

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetGroupList(), getParents()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
  })
</script>

<style lang="less" scoped>
  .groupName {
    color: rgb(var(--primary-6));
    cursor: pointer;
  }
</style>
