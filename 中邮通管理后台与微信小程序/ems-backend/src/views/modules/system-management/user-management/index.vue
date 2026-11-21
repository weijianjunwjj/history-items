<template>
  <AppPage>
    <div class="system-management_user-management">
      <n-card flex-1 rounded-4 class="header mb-def">
        <n-row>
          <n-space align="center">
            <span>搜索</span>
            <n-input v-model:value="searchText" @keydown.enter="handleQuery" clearable placeholder="用户名/用户姓名" />

            <n-button type="info" @click="handleQuery">查询</n-button>
            <n-button type="primary" @click="handleAdd">新增</n-button>
          </n-space>
        </n-row>
      </n-card>
      <n-card flex-1 rounded-4 class="main">
        <n-data-table
          :row-key="(row) => row['account']"
          :bordered="true"
          :single-line="false"
          :columns="columns"
          :loading="loading"
          :data="tableData"
          :pagination="pagination"
        />

        <c-page v-model="pagination" />
      </n-card>
    </div>

    <CrudModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @onSave="handleSave0"
      :loading="modalLoading"
    >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="账号"
          path="account"
          :rule="{
            required: true,
            message: '请输入账号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.account" :disabled="modalAction == 'edit'" />
        </n-form-item>
        <n-form-item
          label="姓名"
          path="username"
          :rule="{
            required: true,
            message: '请输入姓名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.username" :disabled="modalAction == 'edit'" />
        </n-form-item>
        <n-form-item
          label="邮箱"
          path="email"
          :rule="{
            required: true,
            message: '请输入邮箱',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.email" />
        </n-form-item>
        <n-form-item
          label="手机号码"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入手机号码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile" :disabled="modalAction == 'edit'" />
        </n-form-item>
        <n-form-item label="角色">
          <n-select v-model:value="modalForm.roleId" :options="roleList" />
        </n-form-item>
        <n-form-item label="关联微信">
          <n-input :value="modalForm.unionId ? '关联' : '未关联'" disabled />
        </n-form-item>
        <n-form-item label="描述信息">
          <n-input
            v-model:value="modalForm.content"
            placeholder="请输入文章内容"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
        </n-form-item>
      </n-form>
    </CrudModal>
  </AppPage>
</template>

<script setup>
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { formatDateTime, renderIcon,renderCustomIcon, isNullOrUndef, isNullOrWhitespace,commonPageSize } from '@/utils'
import { useLoading } from '@/hooks'
import api from './api'
import { useCRUD } from '@/composables'
import { ref } from 'vue'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissionStore } from '~/src/store'
import roleApi from '../role-management/api.js'

const permissionStore = usePermissionStore()
const { showSysDelBtn } = storeToRefs(permissionStore)

const { loading, startLoading, endLoading } = useLoading(false)

const tableData = ref([])

const searchText = ref()

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '',
  initForm: { author: '' },
  doCreate: api.addList,
  doDelete: api.delList,
  doUpdate: api.updateUserInfo,
  refresh,
})

window.modalAction = modalAction


function handleEnterKey(e){
  console.log('e :>> ', e)

}

function handleSave0() {
  if (modalAction.value === 'add') {
    handleSave()
  } else {
    const { account, email, mobile, username, roleId, userId } = modalForm.value
    modalForm.value = { account, email, mobile, username, roleId, userId }
    handleSave()
  }
}

const visible = ref(false)

const columns = ref([
  // {
  //   type: 'selection',
  //   align: 'center',
  // },
  {
    key: 'userId',
    title: '编号',
    align: 'center',
    width: 80,
  },
  {
    key: 'username',
    title: '用户名',
    align: 'center',
    width: 80,
  },
  {
    key: 'name',
    title: '用户姓名',
    align: 'center',
  },
  {
    key: 'status',
    title: '账号状态',
    align: 'center',
    width: 100,
    render(row) {
      return row.status == 0 ? '禁用' : '正常'
    },
  },
  {
    key: 'roleName',
    title: '账号权限',
    align: 'center',
    width: 100,
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
  },
  {
    key: 'email',
    title: '邮箱',
    align: 'center',
  },
  {
    key: 'mobile',
    title: '手机号码',
    align: 'center',
  },
  {
    title: '操作',
    key: 'actions',
    width: 340,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            style: 'margin-left: 15px;',
            onClick: () => {
              console.log('row :>> ', row)
              handleEdit(row)
            },
          },
          {
            default: () => '编辑',
            icon: renderCustomIcon('Edit', { size: 14 }),
          }
        ),
        showSysDelBtn.value &&
          h(
            NButton,
            {
              size: 'small',
              type: 'warning',
              style: 'margin-left: 15px;',
              onClick: () => {
                handleDelete(row.userId)
              },
            },
            {
              default: () => '删除',
              icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
            }
          ),
        row.status == 1
          ? h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: 'margin-left: 15px;',
              onClick: () => handleDisabled(row),
            },
            {
              default: () => '禁用',
              icon: renderCustomIcon('DesktopAccessDisabledSharp', { size: 14 }),
            }
          )
          : h(
            NButton,
            {
              size: 'small',
              type: 'success',
              style: 'margin-left: 15px;',
              onClick: (row) => {
                console.log('row :>> ', row)
                handleDisabled(row)
              },
            },
            {
              default: () => '激活',
              icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
            }
          ),
      ]
    },
  },
])

const pagination = reactive({
  page: 1,
  pageSize: commonPageSize,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  itemCount: 0,
  onChange: (page) => {
    console.log('page :>> ', page)
    pagination.page = page
    init()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    init()
  },
})

function handleDisabled({ status, userId }) {
  if (isNullOrWhitespace(userId)) return

  const text = status == 1 ? '禁用' : '激活'
  $dialog.confirm({
    content: `确定${text}？`,
    async confirm() {
      try {
        const [err, res] = await $to(api.changeStatus(userId))
        console.log('res :>> ', res)
        console.log('err :>> ', err)
        if (!err) {
          refresh()
        } else {
          console.error(err)
        }
      } catch (error) {
        modalLoading.value = false
      }
    },
  })
}

async function handleQuery() {
  refresh(searchText.value)
}

function refresh(searchText) {
  pagination.page = 1
  init(searchText)
}
function onEdit(row) {
  api.updateUserInfo({}).then((res) => {
    console.log('res :>> ', res)
  })
}

const roleList = ref([])

async function init(username) {
  startLoading()

  const [err, [res, res2]] = await $to(
    Promise.all([
      api.getList({
        pageNum: pagination.page,
        pageSize: pagination.pageSize,
        username,
      }),
      roleApi.getAllList(),
    ])
  )
  console.log('res :>> ', res)
  console.log('err :>> ', err)
  console.log('res2 :>> ', res2)
  if (!err) {
    tableData.value = res.data.list
    pagination.itemCount = res.data.total
    roleList.value = res2.data.map((item) => {
      return {
        ...item,
        label: item.roleName,
        value: item.roleId,
      }
    })
  } else {
    console.error(err)
  }
  endLoading()
}

onMounted(async () => {
  init()
})
</script>

<style lang="scss">
.system-management_user-management {
}
</style>
