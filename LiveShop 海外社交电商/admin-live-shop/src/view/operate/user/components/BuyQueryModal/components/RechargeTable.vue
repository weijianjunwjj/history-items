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
import { getRechargeOrderList } from '@/api/order-manage/order';

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
const isQuery=defineModel('isQuery')
watch(() => isQuery.value, (v) => {
  v && query()
})


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
    title: '充值日期和时间',
    key: 'payTime',
    align: 'center',
    width: 160,
  },
  {
    title: '充值金额',
    key: 'rechargeAmount',
    align: 'center',
    width: 160,
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
    paymentStatus: 2,
  };
  const { data } = await getRechargeOrderList(params);
  console.log('data', data);
  tableData.value=data.list
  paginationReactive.total=data.count
}
onMounted(() => {
  query();
});
</script>

<style lang="scss" scoped></style>
