<template>
  <PageLayout>
    <template #searchForm>
      <n-form
        style="margin-bottom: -24px"
        label-placement="left"
        label-align="right"
        ref="searchFormRef"
        inline
        :model="form"
      >
        <n-form-item label="活动名称">
          <n-input v-model:value="form.name" clearable placeholder="请输入活动名称" />
        </n-form-item>
        <n-form-item label="活动日期">
          <n-date-picker
            v-model:value="rangeTime"
            type="datetimerange"
            clearable
            separator="—"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button attr-type="button" type="primary" @click="handleSearchSubmit"
              >查询/刷新
            </n-button>

            <n-button attr-type="button" type="primary" @click="resetForm">重置 </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </template>
    <template #btnBar>
      <n-button type="primary" @click="visible.groupConfig = true">
        <template #icon>
          <n-icon>
            <component is="antd-PlusOutlined"></component>
          </n-icon>
        </template>
        新增
      </n-button>
    </template>
    <n-dialog-provider>
      <n-data-table
        :columns="columns"
        :data="listData"
        :single-line="false"
        :row-key="(row: any) => {return row.id}"
      />
    </n-dialog-provider>
    <Pagination
      v-model:total="paginationReactive.itemCount"
      v-model:page="paginationReactive.page"
      v-model:limit="paginationReactive.pageSize"
      @pagination="getListData"
    />
    <detailModal
      v-model:visible="visible.detailVisible"
      :current-row="currentRow"
      :typeFlag="2"
      @handle-cancel="onCancelDetailConfig"
    />
    <newEditForm
      :visible="visible.groupConfig"
      :current-row="currentRow"
      :typeFlag="2"
      @handle-cancel="onCancelGroupConfig"
      @confirm="configGroupSuccess"
    />
  </PageLayout>
</template>

<script lang="ts" setup>
import { createColumns, paginationReactive, visible } from './data';
import { onMounted, reactive, ref } from 'vue';
import detailModal from '../components/detail.vue';
import newEditForm from '../components/form.vue';
import { getActivityDelList, getActivityIndexList, getActivitySetSaleList } from '@/api/activity';
import { useDialog, useMessage } from 'naive-ui';
import dayjs from 'dayjs';

const message = useMessage();
const dialog = useDialog();
const currentRow = ref({});

const columns = createColumns({
  handleUnmount(row: any) {
    if (row.onSale == 2) {
      //去下架 时间规则
      getActivitySetSaleList({ id: row.id, onSale: 1 }).then(res => {
        message.success('活动下架成功');
        getListData();
      });
    } else {
      getActivitySetSaleList({ id: row.id, onSale: 2 }).then(res => {
        message.success('活动上架成功');
        getListData();
      });
    }
  },
  handleDefault(row: any) {
    currentRow.value = row;
    visible.detailVisible = true;
  },
  handleEdit(row: any) {
    currentRow.value = row;
    visible.groupConfig = true;
  },
  handleDel(row: any) {
    if (row.onSale == 2) {
      message.error('该活动正在预约中，不可删除！');
      return;
    }
    dialog.warning({
      title: '警告',
      content: `确定删除${row.name}活动吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await getActivityDelList({ id: row.id });
          getListData();
          message.success('删除成功');
        } catch (error) {}
      },
      onNegativeClick: () => {}
    });
  }
});

const defaultForm = {
  type: 2,
  name: ''
};
const rangeTime = ref(null);

const form = reactive({
  ...defaultForm
});

/* 取消新增编辑 */
function onCancelGroupConfig() {
  currentRow.value = {};
  visible.groupConfig = false;
}

function onCancelDetailConfig() {
  visible.detailVisible = false;
  currentRow.value = {};
}

/* 新增编辑成功 */
function configGroupSuccess() {
  getListData();
  currentRow.value = {};
  visible.groupConfig = false;
}

const getListData = () => {
  getActivityIndexList({
    ...form,
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    rangeTime: rangeTime.value
      ? [
          dayjs(rangeTime.value![0]).format('YYYY-MM-DD hh:mm:ss'),
          dayjs(rangeTime.value![1]).format('YYYY-MM-DD hh:mm:ss')
        ]
      : null
  }).then(result => {
    listData.value = result.data.list;
    paginationReactive.itemCount = result.data.count;
  });
};

function handleSearchSubmit() {
  paginationReactive.page = 1;
  getListData();
}

const resetForm = () => {
  Object.assign(form, defaultForm);
  rangeTime.value = null;
  paginationReactive.page = 1;
  getListData();
};

const listData = ref();

// 在组件挂载后执行的逻辑
onMounted(async () => {
  getListData();
});
</script>
