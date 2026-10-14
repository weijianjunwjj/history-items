<template>
  <!-- 使用 vue-echarts 组件并绑定 option -->
  <v-chart class="chart" :option="option" />
  <!-- <button @click="updateChartData">更新数据</button> -->

</template>

<script setup>


const data=defineModel('data')


// 定义图表配置作为响应式数据
const option = ref({
  title: {
    text: '用户性别总数',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: data.incrMale, name: '男性' },
        { value: data.incrFemale, name: '女性' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

// 使用watch监听data的变化
watch(
  () => data.value,
  (newData) => {
    console.log('newData', newData)
    // 如果数据为0，则设置一个占位符
    const maleValue = newData.incrMale === 0 ? 0 : newData.incrMale; // 最小值占位
    const femaleValue = newData.incrFemale === 0 ? 0 : newData.incrFemale; // 最小值占位

    // 当父组件的data更新时，更新图表配置
    option.value.series[0].data = [
      { value: maleValue, name: '男性' },
      { value: femaleValue, name: '女性' },
    ];

  },
  { immediate: true,deep:true } // 立即执行一次，确保初始化时也能正确设置
);

</script>

<style scoped>
/* 定义图表的大小 */
.chart {
  width: 100%;
  height: 400px;
}
</style>

