<template>
  <n-modal
    :show="visible"
    transform-origin="center"
    preset="dialog"
    title=""
    style="width: 900px"
    :show-icon="false"
    @close="handleCancel"
  >
    <div class="topicDetailModelHead flex">
      <span></span>
      话题详情
    </div>
    <n-row :gutter="16">
      <n-col span="12">
        <div class="flex">
          <p style="color: gray; margin-right: 10px">话题名称:</p>

          <n-ellipsis style="flex: 1">
            {{ currentRow?.name }}
          </n-ellipsis>
        </div></n-col
      >
      <n-col span="12">
        <div class="flex">
          <p style="color: gray; margin-right: 10px">话题热度:</p>
          <p>{{ renderHeatNumber(currentRow?.heat) }}</p>
        </div>
      </n-col>
    </n-row>
    <p style="margin: 10px 0">话题动态列表:</p>
    <n-data-table
      :columns="detailColumns"
      :data="tableRowsDynamicDate"
      :row-key="(row: any) => {return row.id}"
      :max-height="400"
      :single-line="false"
    />
    <Pagination
      v-model:total="paginationDetail.total"
      v-model:page="paginationDetail.page"
      v-model:limit="paginationDetail.size"
      @pagination="fetchDetailList"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { detailTopic } from '@/api/community/topic';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits();

watch(
  () => props.visible,
  n => {
    if (n) {
      fetchDetailList();
    }
  }
);

function handleCancel() {
  emit('update:visible', false);
  emit('cancel');
}
const tableRowsDynamicDate = ref([]);
const paginationDetail = reactive({
  page: 1,
  size: 10,
  total: 0,
  pageSizes: [10, 20, 30, 50, 100]
});
const detailColumns = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
    width: 80,
    render(_: Object, index: number) {
      let p = paginationDetail.page - 1;
      return index + 1 + p * paginationDetail.size;
    }
  },
  {
    title: '动态标题',
    key: 'title',
    align: 'center'
  },
  {
    title: '动态内容',
    key: 'content',
    align: 'center',
    width: 300,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '发布时间',
    key: 'createAt',
    align: 'center',
    width: 200
  },
  {
    title: '发布人',
    key: 'nickname',
    align: 'center'
  }
];

function renderHeatNumber(key: any) {
  if (!key) {
    return 0;
  }
  if (key < 1000) {
    return key;
  } else {
    return (key / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
}

function fetchDetailList() {
  detailTopic({
    id: props.currentRow.id,
    page: paginationDetail.page,
    pageSize: paginationDetail.size
  }).then((res: any) => {
    tableRowsDynamicDate.value = res?.data?.list?.dynamic || [];
    paginationDetail.total = res.data.count;
  });
}
</script>

<style lang="less" scoped>
.topicDetailModelHead {
  font-size: 16px;
  font-weight: 600;
  align-items: center;
  height: 30px;
  margin-bottom: 10px;
  span {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #105cfb;
    margin-right: 5px;
  }
}
</style>
