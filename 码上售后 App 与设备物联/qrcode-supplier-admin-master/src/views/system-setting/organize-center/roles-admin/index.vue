<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: rolesList,
        showSelect: true,
        rowKey: 'roleId',
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
        <a-space class="btn-common">
          <a-button type="text" @click="handleMenuConfig(record)">
            <template #icon>
              <icon-menu />
            </template>
            <template #default>菜单配置</template>
          </a-button>
          <MButton
            v-if="
              record.roleKey !== 'engineer' &&
              record.roleKey !== 'customer_service'
            "
            v-bind="tableActionsBtnConfig"
            :click-params="{ edit: record, delete: record }"
          ></MButton>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="addRolesVisible"
      unmount-on-close
      width="780px"
      :on-before-ok="handleRolesModelOk"
      @before-close="handleRolesCancel"
    >
      <template #title>{{ addRolesTitle }}</template>
      <m-form
        ref="addRolesRefs"
        v-bind="addRolesConfig"
        v-model="addRolesModelValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
    <a-modal
      v-model:visible="deleteRolesVisible"
      @ok="handleDeleteRolesOk"
      @before-close="handleDeleteRolesCancel"
    >
      <template #title> 提示 </template>
      <a-alert type="warning"
        >确定删除{{ selectRolesIds.length }}条数据</a-alert
      >
    </a-modal>
    <a-modal
      v-model:visible="menuConfigVisible"
      unmount-on-close
      :on-before-ok="handleMenuConfigOk"
      @before-close="handleMenuConfigCancel"
    >
      <template #title> 菜单配置 </template>
      <div class="menu-config-box">
        <a-form :model="menuForm" @submit="handleSubmit">
          <a-form-item field="name" label="角色名称" disabled>
            <a-input v-model="menuForm.name" />
          </a-form-item>
        </a-form>
        <a-space size="medium">
          <a-checkbox v-model="menuExpand" @change="handleMenuExpand">
            展开/折叠
          </a-checkbox>
          <a-checkbox v-model="menuNodeAll" @change="handleMenuNodeAll">
            全选/全不选
          </a-checkbox>
        </a-space>
        <a-card>
          <a-spin :loading="treeLoading">
            <a-tree
              v-if="!treeLoading"
              ref="menuTreeRef"
              v-model:checked-keys="checkedKeys"
              :checkable="true"
              :data="treeData"
              :default-expand-all="false"
              :field-names="{
                key: 'id',
                title: 'title',
                icon: 'customIcon',
              }"
            />
          </a-spin>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import _ from 'lodash'
  import {
    listRole,
    exportRoles,
    addRole,
    delRoles,
    changeRoleStatus,
    updateRole,
    getMenuList,
    getSelectMenuList,
    tenantScopeSet,
  } from '@/api/code-service/organize-center/roles-admin/index.ts'
  import { Message, Modal } from '@arco-design/web-vue'
  import { CONSTANTS } from '@hx/packages/constant/constants'
  import { AUTHCONSTANTS } from '@hx/packages/constant/authorityContants'
  import { addDateRange } from '@hx/packages/utils/src/xueyi'
  import { useUserStore } from '@/store'
  import { storeToRefs } from 'pinia'

  const userStore = useUserStore()
  const { enterprise } = storeToRefs(userStore)

  const { proxy } = getCurrentInstance()

  const { sys_normal_disable } = proxy.$dict('sys_normal_disable')

  // 定义表格columns
  const columns = reactive([
    // {
    //   title: '角色编码',
    //   dataIndex: 'roleCode',
    //   key: 'roleCode',
    // },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: '权限字符',
    //   key: 'roleKey',
    //   dataIndex: 'roleKey',
    // },
    {
      title: '状态',
      key: 'status',
      slotName: 'status',
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

  // 定义角色表格数据
  const rolesList = ref([])

  // 获取角色列表
  const resGetRolesList = async () => {
    const params = addDateRange(
      searchParams.value,
      searchParams.value.createTime
    )
    const { data } = await listRole(
      _.pickBy({
        ...params,
        pageNum: state.params.pageNum,
        pageSize: state.params.pageSize,
      })
    )
    rolesList.value = data.items
    state.params.total = data.total
  }

  // 表格选中值
  const selectRolesIds = ref([])

  // 表格选中事件
  const handleSelectChange = (rowKeys) => {
    selectRolesIds.value = rowKeys
  }

  // 侦听表格是否选中 修改删除按钮状态
  watch(
    () => selectRolesIds,
    (newValue) => {
      if (newValue.value.length !== 0) {
        tableTLBtnConfig.buttonItems[1].options.disabled = false
      } else {
        tableTLBtnConfig.buttonItems[1].options.disabled = true
      }
    },
    { deep: true }
  )

  // 表格状态切换事件
  const handleChangeStatus = (value, record) => {
    const text = record.status === CONSTANTS.STATUS.NORMAL ? '停用' : '启用'
    Modal.confirm({
      title: '系统提示',
      content: `确认要${text}${record.name}角色吗?`,
      onOk: async () => {
        try {
          await changeRoleStatus({
            roleId: record.roleId,
            status: value ? 0 : 1,
          })
          resGetRolesList()
          Message.success('修改成功')
        } catch (error) {
          console.log(error)
        }
      },
    })
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
    resGetRolesList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetRolesList()
  }

  // 定义搜索表单refs
  const searchRefs = ref()

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      // {
      //   field: 'roleCode',
      //   type: 'input',
      //   label: '角色编码',
      //   placeholder: '请输入角色编码',
      // },
      {
        field: 'name',
        type: 'input',
        label: '角色名称',
        placeholder: '请输入角色名称',
      },
      // {
      //   field: 'roleKey',
      //   type: 'input',
      //   label: '权限字符',
      //   placeholder: '请输入权限字符',
      // },
      {
        field: 'status',
        type: 'select',
        label: '状态',
        placeholder: '请选择角色状态',
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
    // roleCode: '',
    name: '',
    // roleKey: '',
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
          resGetRolesList()
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

  // 导出事件
  const handleExport = async () => {
    await exportRoles({}, `角色_${new Date().getTime()}数据.xlsx`)
  }

  // 定义新增/修改弹框visible
  const addRolesVisible = ref(false)

  // 定义新增/修改弹框refs对象
  const addRolesRefs = ref()

  // 定义新增/修改弹框标题和弹框模式
  const addRolesTitle = ref('添加角色')
  const editRolesModel = ref(false)

  // 新增/修改弹窗确定按钮点击事件
  const handleRolesModelOk = async (done: (closed: boolean) => void) => {
    const value = await addRolesRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        if (editRolesModel.value) {
          await updateRole({ ...addRolesModelValue.value })
          done(true)
          handleRolesCancel()
          resGetRolesList()
          Message.success('修改成功')
        } else {
          addRolesModelValue.value.roleCode = addRolesModelValue.value.name
          addRolesModelValue.value.roleKey = addRolesModelValue.value.name
          await addRole({ ...addRolesModelValue.value })
          done(true)
          handleRolesCancel()
          resGetRolesList()
          Message.success('新增成功')
        }
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 新增/修改弹窗关闭事件
  const handleRolesCancel = () => {
    addRolesVisible.value = false
    addRolesModelValue.value = {
      roleCode: '',
      name: '',
      roleKey: '',
      sort: 0,
      status: '0',
      remark: '',
      dataScope: AUTHCONSTANTS.DATA_SCOPE.ALL,
    }
    addRolesTitle.value = '添加角色'
    editRolesModel.value = false
  }

  // 新增/修改表单数据
  const addRolesModelValue = ref({
    roleCode: '',
    name: '',
    roleKey: '',
    sort: 0,
    status: '0',
    remark: '',
    dataScope: AUTHCONSTANTS.DATA_SCOPE.ALL,
  })

  // 更新新增/修改表单数据
  const handleAddChangeValue = (value) => {
    addRolesModelValue.value = value
  }

  // 定义新增/修改弹框表单
  const addRolesConfig: IForm = reactive({
    formItems: [
      // {
      //   field: 'roleCode',
      //   type: 'input',
      //   label: '角色编码',
      //   placeholder: '请输入角色编码',
      //   rules: [
      //     {
      //       required: true,
      //       message: '请填写角色编码',
      //     },
      //   ],
      //   trigger: ['change', 'input'],
      // },
      {
        field: 'name',
        type: 'input',
        label: '角色名称',
        placeholder: '请输入角色名称',
        rules: [
          {
            required: true,
            message: '请填写角色名称',
          },
        ],
        trigger: ['change', 'input'],
      },
      // {
      //   field: 'roleKey',
      //   type: 'input',
      //   label: '权限字符',
      //   labelTipContent:
      //     '控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole("admin")`)',
      //   labelSlot: true,
      //   placeholder: '请输入权限字符',
      //   rules: [
      //     {
      //       required: true,
      //       message: '请填写权限字符',
      //     },
      //   ],
      //   trigger: ['change', 'input'],
      // },
      {
        field: 'sort',
        type: 'number',
        label: '显示顺序',
      },
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
    inputWidth: { span: 19 },
    labelWidth: { span: 5 },
    colLayout: { md: 24 },
  })

  // 定义删除弹框visible
  const deleteRolesVisible = ref(false)

  // 删除提示框确定事件
  const handleDeleteRolesOk = async () => {
    try {
      await delRoles(selectRolesIds.value)
      resGetRolesList()
      handleDeleteRolesCancel()
      tableTLBtnConfig.buttonItems[1].options.disabled = true
      Message.success('删除成功')
    } catch (error) {
      console.log(error)
    }
  }

  // 删除提示框关闭事件
  const handleDeleteRolesCancel = () => {
    deleteRolesVisible.value = false
  }

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          addRolesVisible.value = true
        },
      },
      {
        name: 'delete',
        icon: true,
        options: {
          disabled: true,
        },
        clickFunc: () => {
          deleteRolesVisible.value = true
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
          addRolesModelValue.value = {
            ...record,
          }
          addRolesConfig.formItems[2].readonly = true
          addRolesConfig.formItems[2].clear = false
          addRolesTitle.value = '修改角色'
          editRolesModel.value = true
          addRolesVisible.value = true
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
                await delRoles([record.roleId])
                resGetRolesList()
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

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetRolesList()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 定义角色名称form
  const menuForm = ref({
    name: '',
    roleId: '',
  })

  // 树形组件的值
  const treeData = ref([])

  // 获取根节点所有id 来判断是否全选
  const menuParentIds = ref([])

  // 定义树组件加载中状态
  const treeLoading = ref(true)

  // 获取完整菜单
  const resGetMenuList = async () => {
    const { data } = await getMenuList({
      platFormFlag: true,
    })
    treeData.value = data
    // console.log(treeData.value.flat(Infinity))
    treeData.value.forEach((item) => {
      menuParentIds.value.push(item.id)
    })
    resGetSelectMenuList()
  }

  // 获取选中的菜单
  const resGetSelectMenuList = async () => {
    checkedKeys.value = []
    const { data } = await getSelectMenuList({
      enterpriseId: enterprise.value.enterpriseId,
      roleId: menuForm.value.roleId,
    })
    data.wholeIds.forEach((item) => {
      checkedKeys.value.push(item.uid)
    })
    treeLoading.value = false
  }

  // 定义树ref
  const menuTreeRef = ref()

  // 定义展开状态
  const menuExpand = ref(false)
  // 定义全选状态
  const menuNodeAll = ref(false)

  // 展开复选框事件
  const handleMenuExpand = (value) => {
    menuTreeRef.value && menuTreeRef.value.expandAll(value)
  }

  // 全选复选框事件
  const handleMenuNodeAll = (value) => {
    menuTreeRef.value && menuTreeRef.value.checkAll(value)
  }

  // 定义树形组件的选中值
  const checkedKeys = ref([])

  watch(
    () => checkedKeys,
    (newValue) => {
      const arr = menuParentIds.value.filter((val) => {
        return newValue.value.indexOf(val) > -1
      })
      menuNodeAll.value = arr.length === menuParentIds.value.length
    },
    { deep: true }
  )

  // 定义菜单配置visible
  const menuConfigVisible = ref(false)

  // 定义菜单配置按钮点击事件
  const handleMenuConfig = (record) => {
    menuForm.value.name = record.name
    menuForm.value.roleId = record.roleId
    resGetMenuList()
    menuConfigVisible.value = true
  }

  // 定义菜单配置弹框确定事件
  const handleMenuConfigOk = async (done: (closed: boolean) => void) => {
    const halfIds = []
    const wholeIds = []
    menuTreeRef.value &&
      menuTreeRef.value.getHalfCheckedNodes().forEach((item) => {
        if (halfIds.indexOf(item.id) === -1) {
          halfIds.push(item.id)
        }
      })
    menuTreeRef.value &&
      menuTreeRef.value.getCheckedNodes().forEach((item) => {
        if (wholeIds.indexOf(item.id) === -1) {
          wholeIds.push(item.id)
        }
      })
    const params = {}
    if (halfIds.length > 0) {
      params.halfIds = halfIds
    }
    if (wholeIds.length > 0) {
      params.wholeIds = wholeIds
    }
    try {
      await tenantScopeSet({
        roleId: menuForm.value.roleId,
        enterpriseId: enterprise.value.enterpriseId,
        params,
      })
      Message.success('配置菜单成功')
      handleMenuConfigCancel()
    } catch (error) {
      console.log(error)
    }
    // console.log('确定')
    done(false)
  }

  // 定义菜单配置弹框取消事件
  const handleMenuConfigCancel = () => {
    menuForm.value = {
      name: '',
      roleId: '',
    }
    checkedKeys.value = []
    treeLoading.value = true
    menuExpand.value = false
    menuNodeAll.value = false
    menuConfigVisible.value = false
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
