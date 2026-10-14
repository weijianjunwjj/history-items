<template>
  <div>
    <n-data-table :single-line="false" :columns="columns" :data="tableData" />
    <Pagination
      v-model:total="paginationReactive.total"
      v-model:page="paginationReactive.page"
      v-model:limit="paginationReactive.pageSize"
      @pagination="query"
    />
  </div>
</template>

<script setup lang="ts">
import { getIntegralRecordIndex } from '@/api/operate/user';

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const isQuery = defineModel('isQuery');
watch(
  () => isQuery.value,
  v => {
    v && query();
  }
);
const columns: any = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
    width: 80,
    render(_, index) {
      let p = paginationReactive.page - 1
      return (index + 1) + (p * paginationReactive.pageSize)
    },
  },
  {
    title: '日期',
    key: 'createdAt',
    align: 'center',
    width: 160,
  },
  {
    title: '积分总额',
    key: 'total',
    align: 'center',
    width: 160,
  },
  {
    title: '变动积分',
    key: 'quantity',
    align: 'center',
    width: 160,
    render:({quantity,type})=>(type == 2 ? '-'+quantity : '+'+quantity)
  },
  {
    title: '变动原因',
    key: 'name',
    align: 'center',
    width: 160,
    render:({type})=>(map[type])
  }
];

const map = {
  1: '每日签到',
  2: '打招呼',
  3: '点赞',
  4: '评论',
  5: '商品兑换',
  6: '退回',
  7: '参与活动',
  8: '被评论',
  9: '被点赞',
  10: '发布动态',
};

const tableData: any = ref([]);
const currentRow: any = inject('currentRow');
async function query() {
  const { Id: userId } = currentRow.value;
  const params = {
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    userId,
  };
  const { data } = await getIntegralRecordIndex(params);
  console.log('data', data);
  tableData.value = data.list || [];
  paginationReactive.total = data.count;
}
onMounted(() => {
  query();
});
</script>

<style lang="scss" scoped></style>
