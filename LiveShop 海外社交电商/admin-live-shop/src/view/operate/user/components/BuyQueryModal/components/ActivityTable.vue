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
import { getGroupOrderList } from '@/api/order-manage/order';

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
    title: '参与日期',
    key: 'createdAt',
    align: 'center',
    width: 200,
  },
  {
    title: '活动名称',
    key: 'activityName',
    align: 'center',
    width: 160,
  },
  {
    title: '活动类型',
    key: 'activityStatus',
    align: 'center',
    width: 160,
    render({ type }) {
      const map={
        1:'众筹',
        2:'拼团',
      }
      return map[type];
    },
  },
  {
    title: '支付积分',
    key: 'paiedIntegral',
    align: 'center',
  },
  {
    title: '支付金币',
    key: 'paiedCoin',
    align: 'center',
  },
  {
    title: '是否中奖',
    key: 'name',
    align: 'center',
    width: 160,
    render({ rewardList }) {
      return rewardList?.[0]?.rewardStatus == 1 ? '已中' : '未中';
    },
  },
  {
    title: '兑奖编号',
    key: 'rewardList',
    align: 'center',
    width: 260,
    render({ rewardList }) {
      return rewardList?.[0]?.rewardSn;
    },
  },
];

const tableData: any = ref([]);
const currentRow: any = inject('currentRow');
async function query() {
  const { Id: userId } = currentRow.value;
  const params = {
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    userId,
    typeList: [1, 2],
  };
  const { data } = await getGroupOrderList(params);
  console.log('data', data);
  tableData.value = data.list;
  paginationReactive.total = data.count;
}
onMounted(() => {
  query();
});
</script>

<style lang="scss" scoped></style>
