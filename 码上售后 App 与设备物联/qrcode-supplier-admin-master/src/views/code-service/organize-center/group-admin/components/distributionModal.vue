<template>
  <a-modal
    v-model:visible="props.visible"
    :width="700"
    unmount-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>{{ type === 'user' ? '添加用户' : '添加设备' }}</template>
    <div>
      <div class="search-box">
        <a-input-search
          v-model="unGroupSearch"
          placeholder="请输入"
          search-button
          @search="handleSearchUnGroup"
        />
        <a-input-search
          v-model="groupSearch"
          placeholder="请输入"
          search-button
          @search="handleSearchGroup"
        />
      </div>
      <div class="tranfer-box">
        <div class="tranfer-table-box">
          <a-table
            v-model:selectedKeys="unSelectedKeys"
            :row-key="unRowKey"
            :loading="loading"
            :columns="columns"
            :data="unGroupList"
            :row-selection="rowSelection"
          />
        </div>
        <div class="tranfer-arrow-box">
          <a-button shape="circle" @click="handleUnGrouptoGroup">
            <template #icon>
              <icon-double-right />
            </template>
          </a-button>
          <a-button shape="circle" @click="handleGrouptoUnGroup">
            <template #icon>
              <icon-double-left />
            </template>
          </a-button>
        </div>
        <div class="tranfer-table-box">
          <a-table
            v-model:selectedKeys="selectedKeys"
            :row-key="rowKey"
            :loading="loading"
            :columns="unColumns"
            :data="groupList"
            :row-selection="rowSelection"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import {
    getGroupUser,
    getGroupDevice,
    getUnGroupUser,
    getUnGroupDevice,
  } from '@/api/code-service/organize-center/group-admin/index'
  import _ from 'lodash'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    distributionId: {
      type: String,
      required: true,
    },
  })

  // 定义标题
  const title = ref([])

  // 定义已分组数组
  const groupList = ref([])

  // 定义未分组数组
  const unGroupList = ref([])

  // 定义分页
  // const groupPagination = ref({
  //   pageSize: 10,
  //   total: 0,
  //   current: 1,
  // })

  // const unGroupPagination = ref({
  //   pageSize: 10,
  //   total: 0,
  //   current: 1,
  // })

  // 定义未分组分页改变事件
  // const handleUnPageChange = (page) => {
  //   unGroupPagination.value.current = page
  //   resGetTransferData()
  // }

  // 定义已分组分页改变事件
  // const handlePageChange = (page) => {
  //   groupPagination.value.current = page
  //   resGetTransferData()
  // }

  // 定义loading
  const loading = ref(false)

  // 定义表格columns
  const columns = ref([])
  const unColumns = ref([])

  // 定义rowkey
  const rowKey = ref('')
  const unRowKey = ref('')

  // 定义selectedKeys
  const selectedKeys = ref([])
  const unSelectedKeys = ref([])

  // 定义rowSelection
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: true,
  })

  // 定义未分组搜索数据
  const groupSearch = ref('')

  // 定义已分组搜索数据
  const unGroupSearch = ref('')

  // 向已分组移动
  const handleUnGrouptoGroup = () => {
    unSelectedKeys.value.forEach((sItem) => {
      unGroupList.value.forEach((item) => {
        if (sItem === item[unRowKey.value]) {
          if (props.type === 'device') {
            item.deviceId = item.id
          }
          groupList.value.unshift(item)
        }
      })
      groupList.value.forEach((removeItem) => {
        unGroupList.value.forEach((removeUnItem, index) => {
          if (removeItem[rowKey.value] === removeUnItem[unRowKey.value]) {
            console.log(index)
            unGroupList.value.splice(index, 1)
          }
        })
      })
    })
    unSelectedKeys.value = []
  }

  // 向未分组移动
  const handleGrouptoUnGroup = () => {
    selectedKeys.value.forEach((sItem) => {
      groupList.value.forEach((item) => {
        if (sItem === item[rowKey.value]) {
          if (props.type === 'device') {
            item.id = item.deviceId
          }
          unGroupList.value.unshift(item)
        }
      })
      unGroupList.value.forEach((removeUnItem) => {
        groupList.value.forEach((removeItem, index) => {
          if (removeItem[rowKey.value] === removeUnItem[rowKey.value]) {
            groupList.value.splice(index, 1)
          }
        })
      })
    })
    selectedKeys.value = []
  }

  // 获取已分组用户
  const resGetGroupUser = async () => {
    try {
      const { data } = await getGroupUser(
        _.pickBy({
          groupId: props.distributionId,
          userName: groupSearch.value,
        })
      )
      if (data.items) groupList.value = [...data.items]
    } catch (error) {
      console.log(error)
    }
  }

  // 获取已分组设备
  const resGetGroupDevice = async () => {
    try {
      const { data } = await getGroupDevice(
        _.pickBy({
          groupId: props.distributionId,
          sn: groupSearch.value,
        })
      )
      if (data.items) groupList.value = [...data.items]
    } catch (error) {
      console.log(error)
    }
  }

  // 获取未分组用户
  const resGetUnGroupUser = async () => {
    try {
      const { data } = await getUnGroupUser(
        _.pickBy({
          userName: unGroupSearch.value,
          groupId: props.distributionId,
        })
      )
      if (data.items) unGroupList.value = [...data.items]
    } catch (error) {
      console.log(error)
    }
  }

  // 获取未分组设备
  const resGetUnGroupDevice = async () => {
    try {
      const { data } = await getUnGroupDevice(
        _.pickBy({
          sn: unGroupSearch.value,
        })
      )
      if (data.items) unGroupList.value = [...data.items]
    } catch (error) {
      console.log(error)
    }
  }

  // 获取穿梭框数据
  const resGetTransferData = () => {
    loading.value = true
    if (props.type === 'user') {
      title.value = ['选择添加的用户', '已选择']
      columns.value = [
        {
          title: '未分组用户',
          dataIndex: 'nickName',
          key: 'nickName',
        },
      ]
      unColumns.value = [
        {
          title: '当前分组内用户',
          dataIndex: 'nickName',
          key: 'nickName',
        },
      ]
      rowKey.value = 'userId'
      unRowKey.value = 'userId'
      Promise.all([resGetUnGroupUser(), resGetGroupUser()])
        .then(() => {
          loading.value = false
        })
        .catch((err) => {
          console.log(err)
        })
    } else if (props.type === 'device') {
      title.value = ['选择添加的设备', '已选择']
      columns.value = [
        {
          title: '未分组设备SN号',
          dataIndex: 'sn',
          key: 'sn',
        },
      ]
      unColumns.value = [
        {
          title: '当前分组内设备SN号',
          dataIndex: 'sn',
          key: 'sn',
        },
      ]
      rowKey.value = 'deviceId'
      unRowKey.value = 'id'
      Promise.all([resGetUnGroupDevice(), resGetGroupDevice()])
        .then(() => {
          loading.value = false
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  // 未分组搜索事件
  const handleSearchUnGroup = () => {
    if (props.type === 'user') {
      resGetUnGroupUser()
    } else if (props.type === 'device') {
      resGetUnGroupDevice()
    }
    // resGetTransferData()
  }

  // 已分组搜索事件
  const handleSearchGroup = () => {
    if (props.type === 'user') {
      resGetGroupUser()
    } else if (props.type === 'device') {
      resGetGroupDevice()
    }
    // resGetTransferData()
  }

  watch(
    () => props.type,
    async () => {
      resGetTransferData()
    },
    {
      deep: true,
    }
  )

  const emit = defineEmits(['handleOk', 'handleCancel'])

  // 确定事件
  const handleOk = () => {
    emit('handleOk', {
      groupId: props.distributionId,
      ids: groupList.value,
      type: props.type,
    })
    groupList.value = []
    unGroupList.value = []
    columns.value = []
    rowKey.value = ''
    unRowKey.value = ''
    selectedKeys.value = []
    unSelectedKeys.value = []
    groupSearch.value = ''
    unGroupSearch.value = ''
  }

  // 取消事件
  const handleCancel = () => {
    groupList.value = []
    unGroupList.value = []
    columns.value = []
    rowKey.value = ''
    unRowKey.value = ''
    selectedKeys.value = []
    unSelectedKeys.value = []
    groupSearch.value = ''
    unGroupSearch.value = ''
    emit('handleCancel')
  }
</script>

<style lang="less" scoped>
  .tranfer-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .tranfer-table-box {
      width: 290px;
      height: 500px;
    }

    .tranfer-arrow-box {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .search-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .arco-input-outer {
      width: 290px;
    }
  }
</style>
