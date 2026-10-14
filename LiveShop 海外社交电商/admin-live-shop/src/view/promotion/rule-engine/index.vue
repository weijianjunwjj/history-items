<template>
  <PageLayout>
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
    <GroupConfig
      v-model:visible="visible.groupConfig"
      :current-row="currentRow"
      @cancel="onCancelGroupConfig"
      @confirm="configGroupSuccess"
    />
    <detailModal
      v-model:visible="visible.detailVisible"
      :current-row="currentRow"
      @cancel="onCancelDetail"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { createColumns, visible } from './data';
import GroupConfig from './group-config.vue';
import detailModal from './detail.vue';
import { getSceneRuleList, delSceneRule } from '@/api/promotion/rule';
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
      content: `确定删除${row.name}的规则吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await delSceneRule({ id: row.id });
          fetchList();
          message.success('删除成功');
        } catch (error) {}
      },
      onNegativeClick: () => {}
    });
  }
});

function fetchList() {
  getSceneRuleList({
    page: 1,
    pageSize: 20
  }).then(res => {
    data.value = res?.data?.list || [];
  });
}

/* 取消组配置 */
function onCancelGroupConfig() {
  visible.groupConfig = false;
  currentRow.value = {};
}

function onCancelDetail() {
  visible.detailVisible = false;

  setTimeout(() => {
    currentRow.value = {};
  }, 200);
}

/* 配置组成功 */
function configGroupSuccess() {
  fetchList();
  currentRow.value = {};
  visible.groupConfig = false;
}

onMounted(() => {
  fetchList();
});
</script>
