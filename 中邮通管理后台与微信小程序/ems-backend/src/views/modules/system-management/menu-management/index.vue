<template>
  <AppPage>
    <n-card rounded-4 class="header mb-def">
      <n-row>
        <n-space align="center">
          <!-- <span>角色名称</span>
            <n-input v-model:value="searchVal" placeholder="角色名称/备注" clearable />

            <n-button type="info" @click="query">查询</n-button> -->
          <n-button type="primary" @click="onAdd">新增</n-button>
        </n-space>
      </n-row>
    </n-card>
    <n-card flex-1 rounded-4 class="main">
      <n-data-table
        :columns="columns"
        :bordered="true"
        :single-line="false"
        :data="data"
        :row-key="(row) => row.index"
        :loading="loading"
      />

      <!-- <div class="flex justify-center">
        <n-pagination
          class="mt-20"
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :item-count="pagination.itemCount"
          show-size-picker
          :page-sizes="[10, 20, 30, 40]"
          :on-update:page="pagination.onChange"
          :on-update:page-size="pagination.onUpdatePageSize"
        />
      </div> -->
    </n-card>

    <CrudModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @onSave="onSave"
      :on-after-leave="onAfterLeave"
    >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="100"
        :model="modalForm"
      >
        <n-form-item
          label="名称"
          path="name"
          :rule="{
            required: true,
            message: '菜单名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="菜单URL"
          path="url"
          :rule="{
            required: true,
            message: '菜单URL',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.url" />
        </n-form-item>

        <n-form-item
          label="访问角色"
          path="role"
          :rule="{
            message: '访问角色',
            required: true,
            trigger: ['blur'],
            type: 'array',
          }"
        >
          <n-select v-model:value="modalForm.role" multiple filterable :options="options.roles" />
        </n-form-item>
        <n-form-item label="角色设置" v-if="modalForm.role && modalForm.role.length">
          <n-radio-group v-model:value="modalForm.roleType" name="radiogroup">
            <n-space>
              <n-radio value="yes" name="允许">允许</n-radio>
              <n-radio value="no" name="不允许">不允许</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item
          label="菜单类型"
          path="type"
          :rule="{
            required: true,
            message: '菜单URL',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select v-model:value="modalForm.type" :options="options.menuTypes" />
        </n-form-item>

        <!-- 2 -->

        <n-form-item
          label="排序"
          path="orderNum"
          :rule="{
            required: true,
            message: '排序',
            trigger: ['input', 'blur'],
            type: 'string',
          }"
        >
          <n-input v-model:value="modalForm.orderNum" />
        </n-form-item>

        <n-form-item
          label="父菜单"
          path="type"
          :rule="{
            required: true,
            message: '菜单URL',
            trigger: ['blur'],
          }"
        >
          <n-select v-model:value="modalForm.parentId" :options="options.parentMenus" />
        </n-form-item>
        <n-form-item
          label="访问权限"
          path="access"
          :rule="{
            required: true,
            message: '访问权限',
            trigger: ['blur'],
            type: 'string',
          }"
        >
          <n-select v-model:value="modalForm.access" :options="options.access" />
        </n-form-item>
      </n-form>
    </CrudModal>
  </AppPage>
</template>

<script setup>
import api from './api'
import { menuType } from '@/utils'
import { useLoading } from '@/hooks'
import { reactive } from 'vue'
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { formatDateTime, renderIcon, renderCustomIcon,isNullOrUndef } from '@/utils'
import { addDynamicRoutes } from '@/router'
import { usePermissionStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const permissionStore = usePermissionStore()
const { showSysDelBtn, showSysEditBtn } = storeToRefs(permissionStore)

console.log('permissionStore :>> ', permissionStore)

console.log('showSysEditBtn :>> ', showSysEditBtn)

const { loading, startLoading, endLoading } = useLoading(false)

const columns = ref([
  {
    title: '菜单编号',
    key: 'menuId',
    width: 100,
  },
  {
    title: '父菜单ID',
    key: 'parentId',
    width: 100,
  },
  {
    title: '菜单名称',
    key: 'name',
    width: 100,
  },
  {
    title: '菜单URL',
    key: 'url',
    width: 300,
  },
  // {
  //   title: '授权',
  //   key: 'perms',
  // },
  // {
  //   title: '访问角色列表',
  //   key: 'role',
  // },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render(row) {
      return menuType[row.type]
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        showSysEditBtn.value && h(
          NButton,
          {
            size: 'small',
            type: 'info',
            style: 'margin-left: 15px;',
            onClick: () => onEdit(row),
          },
          {
            default: () => '编辑',
            icon: renderCustomIcon('Edit', { size: 14 }),
          }
        ),
        showSysDelBtn.value && h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 15px;',
            onClick: () => {
              handleDelete(row)
            },
          },
          {
            default: () => '删除',
            icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
          }
        ),
      ]
    },
  },
])

const data = ref([])

const modalVisible = ref(false)
const modalTitle = ref('新增菜单')
const modalForm = ref({
  role: [],
  roleType: 'yes',
  access: undefined,
})
const modalFormRef = ref()
const options = reactive({
  roles: [],
  menuTypes: Object.entries(menuType).map((item) => {
    const [value, label] = item
    return {
      label,
      value,
    }
  }),
  parentMenus: [],
  access: [],
})

function refresh() {
  addDynamicRoutes()
}

function handleDelete(row) {
  $dialog.confirm({
    content: '确认删除？',
    async confirm() {
      console.log('row :>> ', row)
      const data = {
        menuBo: {
          ...row,
        },
        pageBo: { pageSize: pagination.pageSize, pageNum: pagination.page },
      }
      console.log('data :>> ', data)
      const [err, res] = await $to(api.delList(data))
      if (!err) {
        $message.success('删除成功！')
        init()
        refresh()
      }
    },
    cancel() {
      $message.warning('已取消')
    },
  })
}

function onAfterLeave() {
  modalForm.value = {}
}

function onEdit(row) {
  // const currentRole = row.access
  // const myRole = useUserStore().userInfo.access
  // if (myRole > currentRole) {
  //   return $message.warning('无法编辑高级别的角色')
  // }
  modalForm.value = { ...row }
  modalForm.value
  modalForm.value.type = modalForm.value.type.toString()
  modalForm.value.orderNum = modalForm.value.orderNum.toString()
  modalForm.value.access = modalForm.value.access.toString()
  console.log(' modalForm.value :>> ', modalForm.value)
  modalVisible.value = true
  modalTitle.value = '编辑菜单'
}

function onSave() {
  modalFormRef.value?.validate(async (errors) => {
    if (!errors) {
      if (modalTitle.value === '编辑菜单') {
        const res = await api.updateMenu({
          menu: {
            ...modalForm.value,
          },
          pageBo: { pageSize: pagination.pageSize, pageNum: pagination.page },
        })
        console.log('res :>> ', res)
        closeModal()
        init()
        refresh()
        $message.success('修改成功')
        return
      }

      const params = {
        menuBo: {
          ...modalForm.value,
          access: 1,
        },
        pageBo: {
          pageNum: pagination.page,
          pageSize: pagination.pageSize,
        },
      }
      const res = await api.addMenu(params)
      console.log('res :>> ', res)
      closeModal()
      init()
      refresh()
      $message.success('添加成功')
    } else {
      console.log(errors)
    }
  })
}

function closeModal() {
  modalVisible.value = false
}
function openModal() {
  modalVisible.value = true
}

function onAdd() {
  modalTitle.value = '新增菜单'
  openModal()
}

async function init() {
  startLoading()
  const [err, res] = await $to(api.getList())
  if (!err) {
    console.log('res :>> ', res)
    const list = res.data
    list.forEach((item) => {
      item.index = item.menuId
    })
    data.value = list
  }
  endLoading()
}

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page) => {
    pagination.page = page
    init()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    init()
  },
})

onMounted(async () => {
  init()

  const [{ data: listParent }, { data: roleKindList }] = await Promise.all([
    api.listParent(),
    api.getRoleKindList(),
  ])

  console.error('listParent :>> ', listParent)
  console.error('roleKindList :>> ', roleKindList)

  options.parentMenus = listParent.map((item) => {
    return {
      ...item,
      label: item.name,
      value: item.menuId,
    }
  })
  options.parentMenus.unshift({
    label: '无',
    value: 0,
  })
  options.roles = roleKindList.map((item) => {
    return {
      ...item,
      label: item.roleName,
      value: item.roleId.toString(),
    }
  })
  options.access = roleKindList.map((item) => {
    return {
      ...item,
      label: item.roleName,
      value: item.roleId.toString(),
    }
  })

  console.log('options :>> ', options)
})
</script>
