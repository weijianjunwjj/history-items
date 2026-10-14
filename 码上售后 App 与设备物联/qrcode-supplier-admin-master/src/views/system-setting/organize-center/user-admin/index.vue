<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: userAdminList,
        showSelect: true,
        rowKey: 'userId',
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
        current: state.params.pageNum,
        pageSize: state.params.pageSize,
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="pageDataInit"
    >
      <template #search>
        <m-form
          ref="searchRefs"
          v-bind="searchFormConfig"
          v-model="searchParams"
          @change-value="handleSearchChangeValue"
        >
          <template #right>
            <MButton v-bind="searchBtnConfig"></MButton>
          </template>
        </m-form>
      </template>
      <template #buttons>
        <MButton v-bind="tableTLBtnConfig"></MButton>
      </template>
      <template #status="{ record }">
        <a-switch
          :model-value="record.status == 0"
          @change="handleChangeStatus($event, record)"
        />
      </template>
      <template #actions="{ record }">
        <a-space size="medium" class="btn-common">
          <a-button type="text" @click="handleUserRole(record)">
            <template #icon>
              <icon-font type="icon-roles" />
            </template>
            <template #default>分配角色</template>
          </a-button>
          <a-button type="text" @click="handleResetPwd(record)">
            <template #icon>
              <icon-font type="icon-reset-password" />
            </template>
            <template #default>重置密码</template>
          </a-button>
          <a-button
            v-if="record.userId === user.userId"
            type="text"
            @click="handleEditAccount(record)"
          >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>修改</template>
          </a-button>
          <MButton
            v-else
            v-bind="tableActionsBtnConfig"
            :click-params="{ edit: record, delete: record }"
          ></MButton>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addUserAdminVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleUserModelOk"
      @before-close="handleUserCancel"
    >
      <template #title>{{ addUserTitle }}</template>
      <m-form
        ref="addUserRefs"
        v-bind="addUserConfig"
        v-model="addUserModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="deleteUserVisible"
      @ok="handleDeleteUserOk"
      @before-close="handleDeleteUserCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectUserAdminIds.length }}条数据</a-alert
      >
    </a-modal>
    <a-modal
      v-model:visible="resetPwdVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleResetPwdModelOk"
      @before-close="handleResetPwdCancel"
    >
      <template #title>提示</template>
      <m-form
        ref="resetPwdRefs"
        v-bind="resetPwdConfig"
        v-model="resetPwdModelValue"
        @change-value="handleResetPwdChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="userRoleVisible"
      unmount-on-close
      :on-before-ok="handleUserRoleModelOk"
      @before-close="handleUserRoleCancel"
    >
      <template #title>设置用户权限</template>
      <m-form
        ref="userRoleRefs"
        v-bind="userRoleConfig"
        v-model="userRoleModelValue"
        @change-value="handleUserRoleChangeValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { addDateRange } from '@hx/packages/utils/src/xueyi'
  import _ from 'lodash'
  import {
    getUserAdminList,
    addUser,
    delUser,
    exportUser,
    changeUserStatus,
    updateUserProfile,
    resetUserPwd,
    changeUserRole,
    getUser,
  } from '@/api/code-service/organize-center/user-admin/index.ts'
  import { optionSelect } from '@/api/code-service/organize-center/roles-admin/index.ts'
  import { Message, Modal } from '@arco-design/web-vue'
  import { CONSTANTS } from '@hx/packages/constant/constants'
  import { useUserStore } from '@/store'
  import { storeToRefs } from 'pinia'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const { proxy } = getCurrentInstance()

  const { sys_normal_disable } = proxy.$dict('sys_normal_disable')

  // 定义表格columns
  const columns = reactive([
    {
      title: '工号',
      dataIndex: 'userCode',
      key: 'userCode',
    },
    {
      title: '用户账号',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '用户姓名',
      key: 'nickName',
      dataIndex: 'nickName',
      width: 150,
    },
    {
      title: '手机号码',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      key: 'status',
      slotName: 'status',
      width: 100,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      key: 'actions',
      title: '操作',
      slotName: 'actions',
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义用户表格数据
  const userAdminList = ref([])

  // 获取用户列表
  const resGetUserAdminList = async () => {
    const params = addDateRange(
      searchParams.value,
      searchParams.value.createTime
    )
    const { data } = await getUserAdminList(
      _.pickBy({
        ...params,
        ignorUserIds: [user.value.userId],
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    userAdminList.value = data.items
    state.params.total = data.total
  }

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  })

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetUserAdminList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetUserAdminList()
  }

  // 表格状态切换事件
  const handleChangeStatus = (value, record) => {
    const text = record.status === CONSTANTS.STATUS.NORMAL ? '停用' : '启用'
    Modal.confirm({
      title: '系统提示',
      content: `确认要${text}${record.userName}用户吗?`,
      onOk: async () => {
        try {
          await changeUserStatus({
            userId: record.userId,
            status: value ? 0 : 1,
          })
          resGetUserAdminList()
          Message.success('修改成功')
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  // 定义搜索表单refs
  const searchRefs = ref()

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'userCode',
        type: 'input',
        label: '工号',
        placeholder: '请输入工号',
      },
      {
        field: 'userName',
        type: 'input',
        label: '用户账号',
        placeholder: '请输入用户账号',
      },
      {
        field: 'nickName',
        type: 'input',
        label: '用户姓名',
        placeholder: '请输入用户姓名',
      },
      {
        field: 'phone',
        type: 'input',
        label: '手机号码',
        placeholder: '请输入手机号码',
      },
      {
        field: 'status',
        type: 'select',
        label: '状态',
        placeholder: '请选择用户状态',
        options: sys_normal_disable,
      },
      {
        field: 'createTime',
        type: 'datepicker',
        label: '创建时间',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索表单数据
  const searchParams = ref({
    userCode: '',
    userName: '',
    nickName: '',
    phone: '',
    status: '',
    createTime: [],
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          resGetUserAdminList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchRefs.value.resetForm()
        },
      },
    ],
  })

  // 表格选中值
  const selectUserAdminIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectUserAdminIds.value = rowKeys
  }

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => selectUserAdminIds,
    (newValue) => {
      if (newValue.value.length !== 0) {
        tableTLBtnConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLBtnConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 定义删除弹框visible
  const deleteUserVisible = ref(false)

  // 删除提示框确定事件
  const handleDeleteUserOk = async () => {
    try {
      await delUser(selectUserAdminIds.value)
      resGetUserAdminList()
      handleDeleteUserCancel()
      tableTLBtnConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteUserCancel = () => {
    deleteUserVisible.value = false
  }

  // 定义新增/修改弹框visible
  const addUserAdminVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addUserRefs = ref()

  // 定义新增/修改弹框标题和弹框模式
  const addUserTitle = ref('添加用户')
  const editUserModel = ref(false)

  // 新增/修改弹窗确定按钮点击事件
  const handleUserModelOk = async (done: (closed: boolean) => void) => {
    const value = await addUserRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        if (editUserModel.value) {
          await updateUserProfile({ ...addUserModelValue.value })
          done(true)
          handleUserCancel()
          resGetUserAdminList()
          Message.success('修改成功')
        } else {
          if (!addUserModelValue.value.userCode) {
            addUserModelValue.value.userCode = addUserModelValue.value.userName
          }
          await addUser({ ...addUserModelValue.value })
          done(true)
          handleUserCancel()
          resGetUserAdminList()
          Message.success('新增成功')
        }
      } catch (error) {
        done(false)
        console.log(error)
        if (error.data.code === 500) {
          if (
            addUserModelValue.value.userCode ===
            addUserModelValue.value.userName
          ) {
            addUserModelValue.value.userCode = ''
          }
        }
      }
    }
  }

  // 新增/修改弹窗关闭事件
  const handleUserCancel = () => {
    addUserAdminVisible.value = false
    addUserModelValue.value = {
      userCode: '',
      nickName: '',
      userName: '',
      phone: '',
      email: '',
      password: '',
      sex: '',
      status: '0',
      remark: '',
      roleIds: [],
    }
    addUserConfig.formItems[2].readonly = false
    addUserConfig.formItems[2].clear = true
    addUserConfig.formItems[5].isHidden = false
    addUserTitle.value = '添加用户'
    editUserModel.value = false
  }

  // 新增/修改表单数据
  const addUserModelValue = ref({
    userCode: '',
    nickName: '',
    userName: '',
    phone: '',
    email: '',
    password: '',
    sex: '',
    status: '0',
    remark: '',
    roleIds: [],
  })

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addUserModelValue.value = value
  }

  // 定义新增/修改弹框表单
  const addUserConfig: IForm = reactive({
    formItems: [
      {
        field: 'userCode',
        type: 'input',
        label: '工号',
        placeholder: '请输入工号',
      },
      {
        field: 'nickName',
        type: 'input',
        label: '用户姓名',
        placeholder: '请输入用户姓名',
        rules: [
          {
            required: true,
            message: '请填写用户姓名',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'userName',
        type: 'input',
        label: '用户账号',
        placeholder: '请输入用户账号',
        rules: [
          {
            required: true,
            message: '请填写用户账号',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'phone',
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
        field: 'email',
        type: 'input',
        label: '邮箱',
        placeholder: '请输入邮箱',
        rules: [
          {
            match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请填写正确的邮箱',
          },
        ],
        trigger: ['change', 'input'],
      },
      {
        field: 'password',
        type: 'password',
        label: '密码',
        placeholder: '请输入密码',
        rules: [
          {
            required: true,
            message: '请填写密码',
          },
          {
            minLength: 8,
            message: '用户密码长度必须大于8',
          },
          {
            match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: '密码需包含字母和数字且不小于8位',
          },
        ],
        trigger: ['change', 'input'],
      },
      // {
      //   field: 'sex',
      //   type: 'select',
      //   label: '用户性别',
      //   placeholder: '请选择用户性别',
      //   options: sys_user_sex,
      // },
      {
        field: 'status',
        type: 'radio',
        label: '状态',
        options: sys_normal_disable,
      },
      {
        field: 'remark',
        type: 'textarea',
        label: '备注',
        placeholder: '请输入内容',
        id: 'remark',
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 21 },
    labelWidth: { span: 3 },
    colLayout: { md: 24 },
  })

  // 导出事件
  const handleExport = async () => {
    await exportUser({}, `用户_${new Date().getTime()}数据.xlsx`)
  }

  // 重置密码按钮点击事件
  const handleResetPwd = (record) => {
    resetPwdConfig.formItems[0].label = `请输入${record.userName}的新密码`
    resetPwdModelValue.value.userId = record.userId
    resetPwdVisible.value = true
  }

  // 定义重置密码弹框visible
  const resetPwdVisible = ref(false)

  // 定义重置密码弹框refs对象
  const resetPwdRefs = ref()

  // 重置密码弹窗确定按钮点击事件
  const handleResetPwdModelOk = async (done: (closed: boolean) => void) => {
    const value = await resetPwdRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await resetUserPwd({ ...resetPwdModelValue.value })
        done(true)
        Message.success(
          `重置密码成功, 新密码是${resetPwdModelValue.value.password}`
        )
        handleResetPwdCancel()
        resGetUserAdminList()
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 重置密码弹窗关闭事件
  const handleResetPwdCancel = () => {
    resetPwdVisible.value = false
    resetPwdRefs.value.resetForm()
  }

  // 重置密码表单数据
  const resetPwdModelValue = ref({
    password: '',
    userId: '',
  })

  // 更新重置密码表单数据
  const handleResetPwdChangeValue = (value) => {
    resetPwdModelValue.value = value
  }

  // 定义重置密码弹框表单
  const resetPwdConfig: IForm = reactive({
    formItems: [
      {
        field: 'password',
        type: 'password',
        label: '请输入新密码',
        placeholder: '请输入密码',
        rules: [
          {
            required: true,
            message: '请填写密码',
          },
          {
            minLength: 8,
            maxLength: 20,
            message: '用户密码长度必须大于8',
          },
          {
            match: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: '密码需包含字母和数字且不小于8位',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 24 },
    labelWidth: { span: 24 },
    colLayout: { md: 24 },
  })

  // 用户权限按钮点击事件
  const handleUserRole = async (record) => {
    userRoleModelValue.value = {
      ...record,
    }
    const { data } = await optionSelect()
    userRolesList.value = data
    const res = await getUser({ id: record.userId })
    userRoleModelValue.value.roleIds = Array.from(
      res.data.roles,
      (x) => x.roleId
    )
    userRoleVisible.value = true
  }

  // 定义用户权限弹框visible
  const userRoleVisible = ref(false)

  // 定义用户权限弹框refs对象
  const userRoleRefs = ref()

  // 用户权限弹窗确定按钮点击事件
  const handleUserRoleModelOk = async (done: (closed: boolean) => void) => {
    const value = await userRoleRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        await changeUserRole({ ...userRoleModelValue.value })
        done(true)
        handleUserRoleCancel()
        resGetUserAdminList()
        Message.success(`分配角色成功`)
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 用户权限弹窗关闭事件
  const handleUserRoleCancel = () => {
    userRoleVisible.value = false
    userRoleRefs.value.resetForm()
  }

  // 用户权限表单数据
  const userRoleModelValue = ref({})

  // 更新用户权限表单数据
  const handleUserRoleChangeValue = (value) => {
    userRoleModelValue.value = value
  }

  // 定义权限列表
  const userRolesList = ref([])

  // 定义用户权限弹框表单
  const userRoleConfig: IForm = reactive({
    formItems: [
      {
        field: 'userCode',
        type: 'input',
        readonly: true,
        clear: false,
        label: '用户编码',
      },
      {
        field: 'nickName',
        type: 'input',
        readonly: true,
        clear: false,
        label: '用户名称',
      },
      {
        field: 'roleIds',
        type: 'select',
        label: '用户角色',
        fieldNames: { value: 'roleId', label: 'name' },
        multiple: true,
        options: userRolesList,
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          addUserAdminVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        options: {
          disabled: true,
        },
        clickFunc: () => {
          deleteUserVisible.value = true
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
      },
    ],
  })

  // 定义表格操作栏按钮
  const tableActionsBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'edit',
        icon: true,
        type: 'text',
        params: 'edit',
        clickFunc: ($event, record) => {
          handleEditAccount(record)
          // addUserModelValue.value = {
          //   ...record,
          //   userId: record.userId,
          //   userCode: record.userCode,
          //   nickName: record.nickName,
          //   userName: record.userName,
          //   phone: record.phone,
          //   email: record.email,
          //   password: '',
          //   sex: record.sex,
          //   status: record.status,
          //   remark: record.remark,
          // }
          // addUserConfig.formItems[2].readonly = true
          // addUserConfig.formItems[2].clear = false
          // addUserConfig.formItems[5].isHidden = true
          // addUserTitle.value = '修改用户'
          // editUserModel.value = true
          // addUserAdminVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        type: 'text',
        clickFunc: ($event, record) => {
          Modal.confirm({
            title: '系统提示',
            content: `确认删除该条数据?`,
            onOk: async () => {
              try {
                await delUser([record.userId])
                resGetUserAdminList()
                Message.success('删除成功')
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

  // 删除账号
  const handleEditAccount = async (record) => {
    addUserModelValue.value = {
      ...record,
      userId: record.userId,
      userCode: record.userCode,
      nickName: record.nickName,
      userName: record.userName,
      phone: record.phone,
      email: record.email,
      password: '',
      sex: record.sex,
      status: record.status,
      remark: record.remark,
    }
    addUserConfig.formItems[2].readonly = true
    addUserConfig.formItems[2].clear = false
    addUserConfig.formItems[5].isHidden = true
    addUserTitle.value = '修改用户'
    editUserModel.value = true
    addUserAdminVisible.value = true
  }

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetUserAdminList()])
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
  :deep(.work-order-search-box) {
    .arco-card-body {
      padding: 0;
    }
  }

  :deep(.arco-image-error) {
    background-color: transparent;
  }
</style>
