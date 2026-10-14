<template>
  <PageLayout>
    <template #searchForm>
      <n-form
        style="margin-bottom: -24px"
        label-placement="left"
        label-align="right"
        :show-label="false"
        ref="searchFormRef"
        inline
        :model="searchForm"
      >
        <n-form-item path="keywords">
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="请输入要搜索的话题名称"
            clearable
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button attr-type="button" type="primary" @click="handleQuery">查询/刷新</n-button>
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
      <n-data-table :single-line="false" :columns="columns" :data="data" />
    </n-dialog-provider>

    <Pagination
      v-model:total="paginationReactive.total"
      v-model:page="paginationReactive.page"
      v-model:limit="paginationReactive.size"
      @pagination="fetchList"
    />

    <GroupConfig
      :visible="visible.groupConfig"
      :current-row="currentRow"
      @cancel="onCancelGroupConfig"
      @confirm="configGroupSuccess"
    />
    <detailModal
      v-model:visible="visible.detailVisible"
      :current-row="currentRow"
      @cancel="onCancelGroupConfig"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { createColumns, paginationReactive, visible, searchForm } from './data';
import GroupConfig from './group-config.vue';
import detailModal from './detail.vue';
import { getTopicList, delTopic } from '@/api/community/topic';
import { useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const data = ref([]);
const currentRow = ref({});
const columns = createColumns({
  handleDetail(row: any) {
    currentRow.value = row;
    visible.detailVisible = true;
  },
  handleEdit(row: any) {
    currentRow.value = row;
    visible.groupConfig = true;
  },
  handleDel(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定删除${row.name}这个话题吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await delTopic({ ids: [row.id] });
          fetchList();
          message.success('删除成功');
        } catch (error) {}
      },
      onNegativeClick: () => {}
    });
  }
});

function fetchList() {
  getTopicList({
    ...searchForm,
    page: paginationReactive.page,
    pageSize: paginationReactive.size,
    type: searchForm.keyword ? 1 : null
  }).then(res => {
    data.value = res?.data?.list || [];
    paginationReactive.total = res.data.count;
  });
}

/* 取消组配置 */
function onCancelGroupConfig() {
  currentRow.value = {};
  visible.groupConfig = false;
}

/* 配置组成功 */
function configGroupSuccess() {
  fetchList();
  currentRow.value = {};
  visible.groupConfig = false;
}

/* 查询 */
function handleQuery() {
  paginationReactive.page = 1;
  fetchList();
}

onMounted(() => {
  fetchList();
});
</script>
