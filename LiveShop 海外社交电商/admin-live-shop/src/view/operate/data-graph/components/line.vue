<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup lang="ts">
import { getLast7DaysInReverse } from '@/utils/utils';

const data = defineModel('data');

const xdata = getLast7DaysInReverse();

// 定义图表配置作为响应式数据
const option = ref({
  title: {
    text: '充值金额趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    type: 'category',
    data: xdata,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: data.value,
      type: 'line',
      smooth: true,
    },
  ],
});

// 使用watch监听data的变化
watch(
  () => data.value,
  newData => {
    if (newData.length) {
      option.value.series[0].data = newData;
    }
  },
  { immediate: true, deep: true } // 立即执行一次，确保初始化时也能正确设置
);
</script>

<style scoped>
/* 定义图表的大小 */
.chart {
  width: 100%;
  height: 400px;
}
</style>
