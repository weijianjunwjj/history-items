<template>
  <AppPage>
    <div class="system-management_user-management">
      <n-card flex-1 rounded-4 class="header mb-def">
        <n-row>
          <n-space align="center">
            <span>角色名称</span>
            <n-input v-model:value="searchVal" @keydown.enter="query" placeholder="角色名称/备注" clearable />

            <n-button type="info" @click="query">查询</n-button>
            <n-button type="primary" @click="onAdd">新增</n-button>
          </n-space>
        </n-row>
      </n-card>
      <n-card flex-1 rounded-4 class="main">
        <n-data-table
          :row-key="(row) => row['roleId']"
          :paginate-single-page="false"
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
      v-model:visible="visible"
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
          path="roleName"
          :rule="{
            required: true,
            message: '请输入角色名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.roleName" />
        </n-form-item>
        <n-form-item
          label="角色级别"
          path="access"
          :rule="{
            required: true,
            message: '请输入角色级别',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.access" placeholder="1级最高" />
        </n-form-item>
        <n-form-item
          v-if="modalTitle !== '编辑用户'"
          label="角色活跃度"
          path="activation"
          :rule="{
            required: true,
            message: '请输入角色活跃度',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.activation" placeholder="角色紧急所需活跃度" />
        </n-form-item>
        <n-form-item label="描述信息">
          <n-input
            v-model:value="modalForm.remark"
            placeholder=""
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
        </n-form-item>
        <n-form-item label="地区" v-if="!modalForm.isAdmin">
          <n-select v-model:value="modalForm.areaIds" multiple :options="options.areas" />
        </n-form-item>
      </n-form>
    </CrudModal>

    <CrudModal
      v-model:visible="visibleMenu"
      title="编辑菜单"
      :loading="modalLoading"
      @onSave="onSaveMenu"
    >
      <n-tree
        block-line
        cascade
        checkable
        v-if="showTree"
        :selectable="false"
        :data="treeData"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        @update:checked-keys="updateCheckedKeys"
      />
    </CrudModal>
  </AppPage>
</template>

<script setup>
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { formatDateTime, renderIcon,renderCustomIcon, isNullOrUndef,commonPageSize } from '@/utils'
import { useLoading } from '@/hooks'
import { handleError, reactive, ref } from 'vue'
import api from './api'
import { request } from '@/utils'
import { useUserStore, usePermissionStore } from '~/src/store'
import { addDynamicRoutes } from '@/router'
import { storeToRefs } from 'pinia'


const permissionStore = usePermissionStore()
const { showSysDelBtn, showSysEditBtn } = storeToRefs(permissionStore)

const { loading, startLoading, endLoading } = useLoading(false)

const tableData = ref([])
const modalFormRef = ref()
const modalTitle = ref('新增角色')

const visible = ref(false)
const visibleMenu = ref(false)
const showTree = ref(true)
const modalLoading = ref(false)
const options = reactive({
  areas: [],
  availableAreas: [],
  allAreas: [],
})

const NowPower = ref()
const power = ref([])
const power1 = ref()

const modalForm = ref({
  author: '魏建军',
  title: '标题',
  content: '内容',
  areaIds: [],
})
const pagination = reactive({
  page: 1,
  pageSize: commonPageSize,
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

function onAfterLeave() {
  console.log('onAfterLeave')
  modalForm.value = {}
}

const columns = ref([
  // {
  //   type: 'selection',
  //   align: 'center',
  // },
  {
    key: 'roleId',
    title: '编号',
    align: 'center',
    width: 80,
  },
  {
    key: 'roleName',
    title: '角色名称',
    align: 'center',
    width: 180,
  },
  {
    key: 'createUserId',
    title: '创建者ID',
    align: 'center',
  },
  {
    key: 'activation',
    title: '活跃度',
    align: 'center',
    width: 100,
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
  },
  {
    key: 'remark',
    title: '备注',
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
        showSysEditBtn.value &&
          h(
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
        showSysDelBtn.value &&
          h(
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
        h(
          NButton,
          {
            size: 'small',
            type: 'success',
            style: 'margin-left: 15px;',
            onClick: () => {
              handlePermission(row)
            },
          },
          {
            default: () => '权限',
            icon: renderIcon('material-symbols:folder-limited-outline', { size: 14 }),
          }
        ),
      ]
    },
  },
])

const searchVal = ref()

function onEdit(row) {
  console.log('row :>> ', row)
  const currentRole = row.access
  const myRole = useUserStore().userInfo.access
  if (myRole > currentRole) {
    return $message.warning('无法编辑高级别的角色')
  }
  modalForm.value = { ...row, isAdmin:row.roleId == 1 }
  modalForm.value.access = modalForm.value.access.toString()
  options.areas = options.allAreas


  console.log('options.allAreas :>> ', options.allAreas)
  console.log('modalForm.value?.areaIds :>> ', modalForm.value?.areaIds)

  // const area1 = options.availableAreas
  // const area2 = options.allAreas.filter((item) =>
  //   modalForm.value?.areaIds?.includes(item.value)
  // )

  // const mergeArea = [...area1, ...area2]
  // console.log('mergeArea :>> ', mergeArea)

  // // 去重
  // const uniqueArray = mergeArea.reduce((accumulator, current) => {
  //   // 如果在累加器中找不到当前对象的 id，则添加当前对象
  //   if (!accumulator.find((item) => item.value === current.value)) {
  //     accumulator.push(current)
  //   }
  //   return accumulator
  // }, [])

  // console.log('uniqueArray :>> ', uniqueArray)
  // options.areas = uniqueArray

  console.log(' options.areas :>> ', options.areas)
  console.log('modalForm.value :>> ', modalForm.value)
  modalForm.value.areaIds = modalForm.value.areaIds?.split(',')
  visible.value = true
  modalTitle.value = '编辑用户'
}

async function query() {
  if (!searchVal.value) {
    return init()
  }
  const data = {
    roleBo: { roleName: searchVal.value },
    pageBo: { pageSize: pagination.pageSize, pageNum: pagination.page },
  }

  const [err, res] = await $to(api.searchList(data))
  if (!err) {
    console.log('res :>> ', res)
    tableData.value = res.data.list
  }
}

function handleDelete(row) {
  $dialog.confirm({
    content: '确认删除？',
    async confirm() {
      console.log('row :>> ', row)
      const data = {
        roleBo: {
          ...row,
        },
        pageBo: { pageSize: pagination.pageSize, pageNum: pagination.page },
      }
      console.log('data :>> ', data)
      const [err, res] = await $to(api.delList(data))
      if (!err) {
        $message.success('删除成功！')
        init()
      }
    },
    cancel() {
      $message.warning('已取消')
    },
  })
}

async function handlePermission(row) {
  visibleMenu.value = true
  // 调用2个接口
  const [res1, res2] = await Promise.all([
    api.getListByRoleMenu(row.access),
    api.getListNoPageMenu(),
  ])
  const selMenuIds = res1.data
  const listRaw = res2.data

  console.log('selMenuIds :>> ', selMenuIds)
  console.log('listRaw :>> ', listRaw)

  NowPower.value = row.access
  power.value = selMenuIds
  power1.value = JSON.parse(JSON.stringify(selMenuIds))

  const defaultCheckedKeys2 = []
  console.log('listRaw :>> ', listRaw)
  listRaw.forEach((item, index, array) => {
    item.key = item.menuId.toString()
    item.label = item.name
    if (item.children == null && selMenuIds.filter((item) => item === item.menuId)) {
      defaultCheckedKeys2.push(item.menuId.toString())
    }
    item.children?.forEach((item2) => {
      item2.key = item2.parentId.toString() + item2.menuId.toString()
      item2.label = item2.name
      if (selMenuIds.some((item) => item === item2.menuId)) {
        defaultCheckedKeys2.push(item2.key)
      }
    })
  })
  defaultCheckedKeys.value = defaultCheckedKeys2
  treeData.value = listRaw

  console.log('defaultCheckedKeys2 :>> ', defaultCheckedKeys2)

  showTree.value = false
  await nextTick()
  showTree.value = true
}

async function onSaveMenu() {
  const data = {
    newPower: power.value,
    oldPower: power1.value,
    access: NowPower.value,
  }
  modalLoading.value = true
  const [err, res] = await $to(api.changeMenuAccessByRole(data))
  if (!err) {
    $message.success('修改成功！')
    console.log('res :>> ', res)
    addDynamicRoutes()
  }
  modalLoading.value = false
  visibleMenu.value = false
}

function closeModal() {
  visible.value = false
}
function openModal() {
  visible.value = true
}

function onAdd() {
  modalTitle.value = '新增角色'
  options.areas = options.allAreas
  // modalForm.value.isAdmin = useUserStore().isAdmin 
  openModal()
}

function onSave() {
  modalFormRef.value?.validate(async (errors) => {
    if (!errors) {
      if (modalTitle.value === '编辑用户') {
        const res = await api.updateList({
          roleBo: {
            ...modalForm.value,
            areaIds: modalForm.value.areaIds?.join(','),
          },
          pageBo: { pageSize: pagination.pageSize, pageNum: pagination.page },
        })
        console.log('res :>> ', res)
        closeModal()
        init()
        return
      }
      const res = await api.addList({
        ...modalForm.value,
        areaIds: modalForm.value.areaIds?.join(','),
        pageNum: pagination.page,
        pageSize: pagination.pageSize,
      })
      console.log('res :>> ', res)
      closeModal()
      init()
    } else {
      console.log(errors)
    }
  })
}

const treeData = ref([])
const defaultExpandedKeys = ref([])
const defaultCheckedKeys = ref([''])

const updateCheckedKeys = (keys, options, meta) => {
  const data = meta.node
  const id = data.menuId
  if (power.value.includes(id)) {
    console.log(1)
    if (data.children !== null) {
      data.children.forEach((child) => {
        power.value = power.value.filter((item) => {
          return item !== child.menuId
        })
      })
    }
    power.value = power.value.filter((item) => {
      return item !== id
    })
  } else {
    console.log(2)
    power.value.push(id)
    if (data.parentId !== 0) {
      power.value.push(data.parentId)
    }
    if (data.children !== null) {
      data.children.forEach((child) => {
        power.value.push(child.menuId)
      })
    }
  }
  //去重
  power.value = [...new Set(power.value)]

  console.log('power.value :>> ', power.value)
}



async function init() {
  startLoading()
  const [res, res2, res3] = await Promise.all([
    api.getList({
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }),
    api.getAvailableAreaList(),
    api.getAreaList(),
  ])
  tableData.value = res.data.list
  pagination.itemCount = res.data.total
  options.availableAreas = res2.data.map((item) => {
    return {
      label: item.name,
      value: item.id.toString(),
    }
  })
  options.allAreas = res3.data.map((item) => {
    return {
      label: item.name,
      value: item.id.toString(),
    }
  })

  console.log('res2 :>> ', res2)

  endLoading()
}

onMounted(() => {
  init()
})
</script>

<style lang="scss">
.system-management_user-management {
}
</style>
