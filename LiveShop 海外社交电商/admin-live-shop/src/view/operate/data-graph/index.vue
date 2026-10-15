<template>
  <div class="data-graph">
    <div>
      <n-grid x-gap="1" :cols="4">
        <n-gi class="p-2">
          <Panel :title="'昨日新增用户'" :panel-data="{now: newUsers}" :suffix="'人'" icon-str="antd-UserAddOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'昨日活跃用户'" :panel-data="{now: detail.activeUser}" :suffix="'人'" icon-str="antd-UserSwitchOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'累计用户总量'" :panel-data="{now: totalUser}" :suffix="'人'" icon-str="antd-IdcardOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'众筹订单数量'" :panel-data="{now: detail.crowdTotal}" :suffix="'单'" icon-str="antd-ShoppingCartOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'拼团订单数量'" :panel-data="{now: detail.groupTotal}" :suffix="'单'" icon-str="antd-ShoppingOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'充值订单数量'" :panel-data="{now: detail.rechargeTotal}" :suffix="'单'" icon-str="antd-SketchOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'昨日充值金额'" :panel-data="{now: detail.rechargeAmount}" :suffix="'美元'" icon-str="antd-AccountBookOutlined" />
        </n-gi>
        <n-gi class="p-2">
          <Panel :title="'活动参与总人次'" :panel-data="{now: activitys}" :suffix="'人'" icon-str="antd-TeamOutlined" />
        </n-gi>
      </n-grid>
    </div>
    <div class="p-2 flex">
      <n-card style="width: 30%;">
        <Pie :data="pieData" />
      </n-card>
      <n-card style="width: 70%" class="ml-4">
        <Bar :data="barData" />
      </n-card>
    </div>

    <div class="p-2 flex">
      <n-card style="width: 100%">
        <Line :data="lineData" />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDetail } from '@/api/operate/graph';
import { getYesterdayDate } from '@/utils/utils';
import Pie from './components/pie.vue';
import Bar from './components/bar.vue';
import Line from './components/line.vue';
import Panel from './components/panel.vue';

const ymd = getYesterdayDate();
const detail: any = ref({});
const pieData: any = ref({ incrMale: 0, incrFemale: 0 });
const barData:any=ref([])
const lineData:any=ref([])

const activitys = computed(() => {
  return detail.value.activity?.reduce((sum, item) => sum + item.participant, 0);
})
const totalUser = computed(() => {
  return detail.value.age?.reduce((sum1, item) => sum1 + item.total, 0);
})

async function query() {
  const res = await getDetail(ymd);
  detail.value = res.data;
  const { incrMale, incrFemale,age,recharge7d  } = detail.value;
  pieData.value.incrMale = incrMale;
  pieData.value.incrFemale = incrFemale;
  barData.value=age?.map(item=>item.total)
  lineData.value=recharge7d?.map(item=>item.value)
}

const newUsers = computed(() => {
  return detail.value.incrFemale + detail.value.incrMale;
});

query();
</script>

<style scoped lang="less">
.bg-white {
  background-color: #fff;
}
</style>
