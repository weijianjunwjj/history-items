<template>
  <!-- 使用 vue-echarts 组件并绑定 option -->
  <v-chart class="chart" :option="option" />
  <!-- <button @click="updateChartData">更新数据</button> -->
</template>

<script setup>
const data = defineModel('data');

const now = new Date();
now.setDate(now.getDate() - 1); // 将当前日期减去一天

// 定义图表配置作为响应式数据
const option = ref({
  title: {
    text: '用户年龄分布',
    left: 'left'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: 'category',
    data: ['18-28', '29-38', '39-49', '50及以上'],
  },
  series: [
    {
      name: "总人数",
      type: 'bar',
      data: data.value,
    },
  ],
});

// 使用watch监听data的变化
watch(
  () => data.value,
  newData => {
    option.value.series[0].data = newData;
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
