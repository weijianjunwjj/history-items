<template>
  <AppPage>
    <div class="site-manage-apply-list">
      <n-card flex-1 rounded-4 class="header mb-def">
        <n-row :gutter="[28, 18]">
          <n-col :span="14">
            <n-form-item label="日期选择：" path="inputValue">
              <n-date-picker
                v-model:value="searchForm.selectTime"
                type="daterange"
                clearable
                class="full-w"
                format="yyyy-MM-dd"
              />
            </n-form-item>
          </n-col>
          <n-col :span="10">
            <n-form-item label="">
              <n-input
                v-model:value="searchForm.nameOrMobile"
                placeholder="输入搜索姓名/手机号/站点名称"
                clearable
              >
               
              </n-input>
            </n-form-item>
          </n-col>
        </n-row>
        <div class="mt-20"></div>
        <n-row :gutter="[28, 18]">
          <n-col :span="6">
            <n-form-item label="打印机编号:">
              <n-input
                v-model:value="searchForm.printerId"
                placeholder="输入打印机编号"
                clearable
              ></n-input>
            </n-form-item>
          </n-col>
          <n-col :span="6">
            <n-form-item label="激活状态:">
              <n-select
                v-model:value="searchForm.status"
                :options="options.status"
                @update:value="handleUpdateDate2"
              />
            </n-form-item>
          </n-col>
          <n-col :span="6" v-if="isAdmin">
            <n-form-item label="服务商:">
              <n-select
                v-model:value="searchForm.serviceName"
                :options="options.serviceName"
                @update:value="handleUpdateDate2"
              />
            </n-form-item>
          </n-col>
          <n-col :span="6">
            <n-form-item label="站点省份:">
              <n-select
                :disabled="disabledAreaName"
                v-model:value="searchForm.areaNames"
                :options="options.areaNames"
                :placeholder="disabledAreaName ? '先选择服务商' : '请选择地区名'"
                @update:value="handleUpdateDate2"
              />
            </n-form-item>
          </n-col>
          <n-col :span="6">
            <div>
              <n-space>
                <n-button type="primary" @click="init">查询</n-button>
                <n-popconfirm @positive-click="exportTable">
                  <template #trigger>
                    <n-button :loading="downloadLoading">导出</n-button>
                  </template>
                  确定要导出？
                </n-popconfirm>
              </n-space>
            </div>
          </n-col>
        </n-row>
      </n-card>
      <n-card flex-1 rounded-4 class="main">
        <n-data-table
          :bordered="true"
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="false"
          :scroll-x="1800"
          :row-class-name="getRowClassName"
          :row-key="rowKey"
          @update:checked-row-keys="handleCheck"
        />

        <c-page v-model="pagination" />
      </n-card>
    </div>

    <CrudModal
      v-model:visible="modalVisible"
      title="编辑"
      @onSave="onSave"
      :on-after-leave="onAfterLeave"
    >
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="120"
        :model="modalForm"
        :rules="rules"
      >
        <n-form-item
          label="站点名称"
          path="siteName"
          :rule="{
            required: true,
            message: '站点名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.siteName" />
        </n-form-item>
        <n-form-item
          label="站点姓名"
          path="siteUserName"
          :rule="{
            required: true,
            message: '站点姓名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.siteUserName" />
        </n-form-item>

        <n-form-item label="站主手机号" path="siteUserMobile">
          <n-input v-model:value="modalForm.siteUserMobile" />
        </n-form-item>

        <n-form-item
          label="省市区"
          path="positionInfo"
          :rule="{
            required: true,
            message: '省市区',
            trigger: ['blur'],
            type: 'string',
          }"
        >
          <n-cascader
            v-model:value="modalForm.positionInfo"
            :options="formattedAreaList"
            @update:value="handleValueChange"
          />
        </n-form-item>

        <n-form-item
          label="站点详情地址"
          path="positionDetail"
          :rule="{
            required: true,
            message: '站点详情地址',
            trigger: ['input', 'blur'],
            type: 'string',
          }"
        >
          <n-input v-model:value="modalForm.positionDetail" />
        </n-form-item>

        <n-form-item label="机构号" path="postalNumber">
          <n-input v-model:value="modalForm.postalNumber" />
        </n-form-item>

        <n-form-item label="小件员手机号" path="deliveryMobile">
          <n-input v-model:value="modalForm.deliveryMobile" />
        </n-form-item>

        <n-form-item label="打印机编号" path="printerId">
          <n-input v-model:value="modalForm.printerId" />
        </n-form-item>

        <n-form-item
          label="报价方案编码"
          path="productType"
          :rule="{
            required: true,
            message: '报价方案编码',
            trigger: ['input', 'blur'],
            type: 'string',
          }"
        >
          <n-input v-model:value="modalForm.productType" />
        </n-form-item>
      </n-form>
    </CrudModal>
  </AppPage>
</template>

<script setup>
import {
  formatDate,
  states,
  downloadUrl,
  downloadCSV,
  settlementStatus,
  paymentStatus,
  orderStatus,
  colors,
  getUnpayColor,
  getToken,
  payTypes,
  isEmpty,
  commonPageSize,
  unique_obj_arr
} from '@/utils'
import api from './api'
import { useLoading } from '@/hooks'
import { useUserStore } from '~/src/store'
import { values } from 'lodash-es'
import { NBadge, NButton, NSwitch } from 'naive-ui'
import qs from 'qs'
import { SearchSharp } from '@vicons/ionicons5'
import iconEdit from '../../../../assets/svg/Edit.svg'
import { renderIcon, renderCustomIcon } from '@/utils'
import { areaList } from '@vant/area-data'
import api2 from '../../order-management/list/api.js'
import uncompleted from '../../../../assets/images/station/uncompleted2.png'
import completed from '../../../../assets/images/station/completed.png'

console.log('completed :>> ', completed)

const { loading, startLoading, endLoading } = useLoading(false)

const userStore = useUserStore()
const disabledAreaName = ref(true)

const now = new Date()
now.setDate(1) // 设置为本月第一天
now.setHours(0, 0, 0, 0) // 将时间设置为午夜
let firstDay = now.getTime() // 获取时间戳


const searchForm = reactive({
  selectTime: [firstDay, Date.now()],
  status: '',
})

const modalFormRef = ref()
const modalForm = ref({})

const modalVisible = ref(false)

const rules = {
  siteUserMobile: {
    required: true,
    trigger: 'input',
    type: 'string',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        console.log('value :>> ', value)
        if (isEmpty(value)) {
          reject('请输入站主手机号') // reject with error message
          isPhoneOK.value = false
        } else if (value.length !== 11) {
          reject('请输入11位站主手机号') // reject with error message
          isPhoneOK.value = false
        } else {
          resolve()
          isPhoneOK.value = true
        }
      })
    },
  },
  deliveryMobile: {
    required: true,
    trigger: 'input',
    type: 'string',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        console.log('value :>> ', value)
        if (isEmpty(value)) {
          reject('请输入小件员手机号') // reject with error message
        } else if (value.length !== 11) {
          reject('请输入11位小件员手机号') // reject with error message
        } else {
          resolve()
        }
      })
    },
  },
  postalNumber: {
    required: true,
    trigger: 'input',
    type: 'string',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        console.log('value :>> ', value)
        if (isEmpty(value)) {
          reject('邮政编号') // reject with error message
        } else if (!/^\d+$/.test(value)) {
          reject('请输入纯数字') // reject with error message
        } else {
          resolve()
        }
      })
    },
  },
  printerId: {
    required: true,
    trigger: 'input',
    type: 'string',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        function isValidNumber(str) {
          const pattern = /^86\d{13}$/
          return pattern.test(str)
        }
        console.log('value :>> ', value)
        if (isEmpty(value)) {
          reject('邮政编号') // reject with error message
        } else if (!isValidNumber(value)) {
          reject('请输入86开头的15位数字') // reject with error message
        } else {
          resolve()
        }
      })
    },
  },
}

const Status = {
  0: '待激活',
  1: '已激活',
}

const status = Object.entries(Status).map((item) => {
  const [value, label] = item
  return {
    label,
    value,
  }
})

status.unshift({
  label: '全部',
  value: '',
})

const options = reactive({
  marks: [
    {
      label: '未标记',
      value: 0,
    },
    {
      label: '已标记',
      value: 1,
    },
  ],
  status,
})

const checkedRowKeysRef = ref([])
const rowKey = (row) => row.id
const handleCheck = (rowKeys) => {
  console.log('rowKeys :>> ', rowKeys)
  checkedRowKeysRef.value = rowKeys
  console.log('checkedRowKeysRef.value :>> ', checkedRowKeysRef.value)
}

const isAdmin = computed(() => {
  return userStore.isAdmin
})

const tableData = ref([])
const columns = ref([
  {
    type: 'selection',
  },
  {
    title: '序号',
    align: 'center',
    fixed: 'left',
    render(row, index) {
      return index + 1
    },
    width: 70,
  },
  {
    title: '站点名称',
    key: 'siteName',
    align: 'center',
  },
  {
    title: '站主姓名',
    key: 'siteUserName',
    align: 'center',
    width: 80,
  },
  {
    title: '站主手机号',
    key: 'siteUserMobile',
    align: 'center',
    width: 120,
  },
  {
    title: '省市区',
    key: 'positionInfo',
    align: 'center',
  },
  {
    title: '站点详情地址',
    key: 'positionDetail',
    align: 'center',
  },
  {
    title: '机构号',
    key: 'postalNumber',
    align: 'center',
    width: 90,
  },
  {
    title: '小件员手机号',
    key: 'deliveryMobile',
    align: 'center',
    width: 120,
  },
  {
    title: '打印机编号',
    key: 'printerId',
    align: 'center',
  },
  {
    title: '报价方案编码',
    key: 'productType',
    align: 'center',
  },
  {
    title: '填写时间',
    key: 'createAt',
    align: 'center',
    width: 120,
  },
  {
    title: '激活状态',
    key: 'status',
    align: 'center',
    width: 120,
    fixed: 'right',
    render: ({ status }) => {
      if (status === 1) {
        return h(
          'div',
          {
            style: 'color: #21B928;display:flex;align-items:center',
          },
          [
            h('img', {
              src: completed,
              style: 'width:20px;height:20px;margin-right:5px',
            }),
            Status[status],
          ]
        )
      } else {
        return h(
          'div',
          {
            style: 'color: #707070;display:flex;align-items:center',
          },
          [
            h('img', {
              src: uncompleted,
              style: 'width:20px;height:20px;margin-right:5px',
            }),
            Status[status],
          ]
        )
      }
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
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
            style: 'margin-bottom: 10px;',
            onClick: () => onEdit(row),
          },
          {
            default: () => '编辑',
            icon: renderCustomIcon('Edit', { size: 14 }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
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

const formattedAreaList = ref([])

const checkIsAdmin = () => {
  if (!isAdmin.value) {
    // 自动选上地区
    disabledAreaName.value = false
    if (options.serviceName0) {
      const areaVos = options.serviceName0[0]?.areaVos
      options.areaName = areaVos?.map((item) => ({
        label: item.areaName,
        value: item.areaId,
      }))

      const allIds = areaVos?.map((_) => _.areaId)?.join(',')
      options.areaName.unshift({
        label: '全部',
        value: allIds,
      })
      searchForm.areaIds = allIds

      init()
    }
  }
}
watch(
  () => isAdmin.value,
  () => {
    checkIsAdmin()
  }
)
checkIsAdmin()

watch(
  () => searchForm.serviceName,
  (v) => {
    searchForm.areaNames = '全部'
    console.error('p1-watch')
    console.log('v :>> ', v)
    if (!$is0(v)) {
      disabledAreaName.value = false
      options.areaNames =
        options.serviceName0
          ?.find((item) => item.roleId == searchForm.serviceName)
          ?.areaVos?.map((item) => ({ label: item.areaName, value: item.areaName })) || []

      options.areaNames =  unique_obj_arr(options.areaNames,'label')
    }
    if (v === '全部') {
      const obj1 = options.serviceName0?.map((item) => item.areaVos).flat()
      const obj2 = obj1?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
      options.areaNames =  unique_obj_arr(obj2,'label') 
    }

    options.areaNames.unshift({
      label: '全部',
      value: '全部',
    })
  }
)

const p0 = computed(() => {
  let areaNames = searchForm.areaNames ? [searchForm.areaNames] : null
  let p = {
    areaNames,
  }
  if (searchForm.serviceName !== '全部' && searchForm.areaNames == '全部') {
    const index = options?.serviceName0?.findIndex((item) => item.roleId == searchForm.serviceName)
    areaNames = options?.serviceName0[index]?.areaVos?.map((item) => item.areaName)
    p.areaNames = areaNames
  }

  if (searchForm.serviceName === '全部' && searchForm.areaNames === '全部') {
    p.areaNames = []
    p.isAllAreasSelect = 1
  }

  console.log('p :>> ', p)

  return p
})

// watch(
//   () => searchForm.serviceName,
//   (v) => {
//     searchForm.areaNames = '全部'
//     console.log('v :>> ', v)
//     if (!$is0(v)) {
//       options.areaNames =
//         options.serviceName0
//           ?.find((item) => item.roleId == searchForm.serviceName1)
//           ?.areaVos?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
//     }
//     if (v === '全部') {
//       const obj1 = options.serviceName0?.map((item) => item.areaVos).flat()
//       const obj2 = obj1?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
//       options.areaNames = obj2
//     }

//     options.areaNames.unshift({
//       label: '全部',
//       value: '全部',
//     })
//   }
// )

const formatAreaList = ({ province_list, city_list, county_list }) => {
  const provinces = Object.entries(province_list).map(([value, label]) => ({ label, value }))
  const cities = Object.entries(city_list).map(([value, label]) => ({ label, value }))
  const counties = Object.entries(county_list).map(([value, label]) => ({ label, value }))

  const cityMap = cities.reduce((acc, city) => {
    const provinceCode = city.value.substring(0, 2) + '0000'
    if (!acc[provinceCode]) {
      acc[provinceCode] = []
    }
    acc[provinceCode].push(city)
    return acc
  }, {})

  const countyMap = counties.reduce((acc, county) => {
    const cityCode = county.value.substring(0, 4) + '00'
    if (!acc[cityCode]) {
      acc[cityCode] = []
    }
    acc[cityCode].push(county)
    return acc
  }, {})

  return provinces.map((province) => ({
    ...province,
    children: cityMap[province.value]?.map((city) => ({
      ...city,
      children: countyMap[city.value],
    })),
  }))
}

function onSave() {
  modalFormRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await api.updateList({
        ...modalForm.value,
        positionInfo: positionInfo.value,
      })
      $message.success('更新成功')
      console.log('res :>> ', res)
      modalVisible.value = false
      init()
      return
    } else {
      console.log(errors)
    }
  })
}

function onAfterLeave() {
  console.log('onAfterLeave')
  modalForm.value = {}
}

function onEdit(row) {
  modalForm.value = { ...row }
  modalVisible.value = true
}

onMounted(() => {
  formattedAreaList.value = formatAreaList(areaList)
})

const positionInfo = ref()

const handleValueChange = (value, option, pathValues) => {
  console.log(value)
  console.log('option :>> ', option)
  console.log('pathValues :>> ', pathValues)
  let pcr
  if (pathValues.length == 1) {
    pcr = pathValues[0].label
  }
  if (pathValues.length == 2) {
    pcr = pathValues[0].label + pathValues[1].label
  }
  if (pathValues.length == 3) {
    pcr = pathValues[0].label + pathValues[1].label + pathValues[2].label
  }
  positionInfo.value = pcr
}

function getRowClassName(row) {
  return row.markStatus === 1 ? 'row-marked' : ''
}

function handleSwitchChange(row) {
  const { markStatus, id } = row

  const map = {
    true: 1,
    false: 0,
  }

  api
    .markStatus({
      id,
      markStatus: map[markStatus],
    })
    .then((res) => {
      console.log('res :>> ', res)
      if (res.code == 200) {
        const text = markStatus ? '标记成功' : '取消标记成功'
        $message.success(text)
      } else {
        $message.error('标记失败')
      }
    })
}

const pagination = reactive({
  page: 1,
  pageSize: commonPageSize,
  pageCount: 32,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
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

function handleDelete(row) {
  $dialog.confirm({
    content: `确认删除【${row.siteName}】？`,
    async confirm() {
      console.log('row :>> ', row)
      const data = {
        id: row.id,
      }
      console.log('data :>> ', data)
      const [err, res] = await $to(api.delSiteInfo(data))
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

async function init() {
  startLoading()
  const form = JSON.parse(JSON.stringify(searchForm))
  if (form?.selectTime?.length) {
    form.startDate = formatDate(form.selectTime[0])
    form.endDate = formatDate(form.selectTime[1])
  } else {
    form.startDate = null
    form.endDate = null
  }
  console.log('p0.value :>> ', p0.value)
  const pp = { ...p0.value }
  if (pp.serviceName == '全部') {
    pp.serviceName = null
  }
  if (pp.areaNames == '全部') {
    pp.areaNames = null
  }
  if (form.serviceName == '全部') {
    form.serviceName = null
  }
  if (form.areaNames == '全部') {
    form.areaNames = null
  }

  const [err, res] = await $to(
    api.getList({ pageNum: pagination.page, pageSize: pagination.pageSize, ...form, ...pp })
  )
  if (!err) {
    console.log('res :>> ', res)
    const data = res.data
    pagination.itemCount = data.total
    tableData.value = data.list
  } else {
    console.error('err :>> ', err)
  }
  endLoading()
}

const downloadLoading = ref(false)

async function exportTable() {
  downloadLoading.value = true
  const form = JSON.parse(JSON.stringify(searchForm))
  if (form?.selectTime?.length) {
    form.startDate = formatDate(form.selectTime[0])
    form.endDate = formatDate(form.selectTime[1])
  } else {
    form.startDate = null
    form.endDate = null
  }
  delete form.selectTime
  if (form.serviceName == '全部') {
    form.serviceName = null
  }
  if (form.areaNames == '全部') {
    form.areaNames = null
  }
  form.dataIds = checkedRowKeysRef.value?.join(',')
  const params = qs.stringify(form)
  downloadLoading.value = true
  let url
  if (params) {
    url = window.$api_test + api.exportListURL + `?${params}&saToken=${getToken()}`
  } else {
    url = window.$api_test + api.exportListURL + `?saToken=${getToken()}`
  }
  console.log('url----------- :>> ', url)
  downloadUrl(url)

  setTimeout(() => {
    downloadLoading.value = false
  }, 1000)
}

onMounted(async () => {
  init()
  const { data } = await api2.getServiceArea({
    rId: !userStore.isAdmin ? userStore.userInfo.roleId : null,
  })
  console.log('data :>> ', data)
  options.serviceName0 = data
  options.serviceName = data.map((item) => {
    return {
      label: item.roleName,
      value: item.roleId,
    }
  })
  options.serviceName.unshift({
    label: '全部',
    value: '全部',
  })
  searchForm.serviceName = '全部'
  searchForm.areaNames = '全部'
  console.log('options.serviceName0 :>> ', options.serviceName0)

  checkIsAdmin()
})
</script>

<style lang="scss">
.site-manage-apply-list {
  .header {
    .n-form-item-label {
      width: 77px;
    }
  }
  .status-indicator.active {
    color: green;
  }

  .status-indicator.inactive {
    color: red;
  }
  .row-marked {
    background-color: #f0f0f0; // 灰色背景
  }
  .n-form-item {
    display: flex;
    align-items: center;
    label {
      margin-right: 10px;
      line-height: 34px;
    }
    .n-form-item-blank {
      flex: 1;
    }
  }
  .rtl {
    direction: rtl;
  }
}
</style>
