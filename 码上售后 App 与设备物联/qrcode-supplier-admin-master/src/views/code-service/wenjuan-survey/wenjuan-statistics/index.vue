<template>
  <div class="statistics-box">
    <m-form
      v-bind="searchFormConfig"
      v-model="searchParams"
      @change-value="handleSearchChangeValue"
    >
      <template #right>
        <MButton v-bind="searchBtnConfig"></MButton>
      </template>
    </m-form>
    <a-divider />
    <div class="chart-box">
      <div class="chart-title">1. 总体来说, 您对我们的服务是否满意?</div>
      <div class="chart-tips"
        >填写率 {{ satisfactionTotal }} / 填写 {{ satisfactionCount }}</div
      >
      <div id="chart-bar" class="chart-bar"></div>
      <div class="chart-button">
        <a-radio-group v-model="chartType" type="button">
          <a-radio value="pie">饼图</a-radio>
          <!-- <a-radio value="bar">柱状图</a-radio>
          <a-radio value="line">折线图</a-radio> -->
        </a-radio-group>
      </div>
      <div v-if="chartType === 'pie'" id="chart-pie" class="chart-pie"></div>
      <div class="chart-title top30">2. 您有哪些意见和建议?</div>
      <div class="chart-tips"
        >填写率 {{ suggestionTotal }} / 填写 {{ suggestionCount }}</div
      >
      <m-table
        :loading="loading"
        :table-props="{
          columns,
          data: proposalList,
          rowKey: 'id',
        }"
        :state="state"
        :pagination="{
          total: state.params.total,
          hideOnSinglePage: false,
          current: state.params.pageNum,
          pageSize: state.params.pageSize,
          onChange,
          onPageSizeChange,
        }"
      >
      </m-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import MTable from '@hx/packages/components/m-table'
  import * as echarts from 'echarts'
  import _ from 'lodash'
  import {
    getReportList,
    getProposalList,
    getFillingRate,
  } from '@/api/code-service/wenjuan-survey/launch-admin/index'

  // 填写率
  const satisfactionTotal = ref(0)
  // 填写次数
  const satisfactionCount = ref(0)
  // 填写率
  const suggestionCount = ref(0)
  // 填写次数
  const suggestionTotal = ref(0)
  // 图表类型
  const chartType = ref('pie')

  // 定义搜索表单数据
  const searchParams = ref({
    creatTime: [],
  })

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'creatTime',
        type: 'datepicker',
        label: '提交时间',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value) => {
    searchParams.value = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          state.params.pageNum = 1
          resGetReportList()
          resGetProposalList()
          resGetFillingRate()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            creatTime: [],
          }
        },
      },
    ],
  })

  const rateArr = ref([0, 0, 0, 0, 0])
  const satisfaction = ref(['非常满意', '满意', '一般', '不满意', '非常不满意'])
  const rateNumArr = ref([0, 0, 0, 0, 0])
  const pieData = ref([
    { value: 0, name: '非常满意' },
    { value: 0, name: '满意' },
    { value: 0, name: '一般' },
    { value: 0, name: '不满意' },
    { value: 0, name: '非常不满意' },
  ])

  // 获取报表数据
  const resGetReportList = async () => {
    let params: any[] = []
    if (searchParams.value.creatTime) {
      params = searchParams.value.creatTime
    }
    const { data } = await getReportList(
      _.pickBy({
        startTime: params[0] || '',
        endTime: params[1] || '',
      })
    )
    const total = ref(0)
    if (data.length !== 0) {
      data.forEach((item: any) => {
        total.value += item.counts
      })
    } else {
      rateArr.value = [0, 0, 0, 0, 0]
      rateNumArr.value = [0, 0, 0, 0, 0]
      pieData.value = [
        { value: 0, name: '非常满意' },
        { value: 0, name: '满意' },
        { value: 0, name: '一般' },
        { value: 0, name: '不满意' },
        { value: 0, name: '非常不满意' },
      ]
    }

    data.forEach((item: any) => {
      switch (item.satisfaction) {
        case '非常满意':
          rateArr.value[0] = parseFloat(
            ((item.counts / total.value) * 100).toFixed(2)
          )
          rateNumArr.value[0] = item.counts
          pieData.value[0].value = item.counts
          break
        case '满意':
          rateArr.value[1] = parseFloat(
            ((item.counts / total.value) * 100).toFixed(2)
          )
          rateNumArr.value[1] = item.counts
          pieData.value[1].value = item.counts
          break
        case '一般':
          rateArr.value[2] = parseFloat(
            ((item.counts / total.value) * 100).toFixed(2)
          )
          rateNumArr.value[2] = item.counts
          pieData.value[2].value = item.counts
          break
        case '不满意':
          rateArr.value[3] = parseFloat(
            ((item.counts / total.value) * 100).toFixed(2)
          )
          rateNumArr.value[3] = item.counts
          pieData.value[3].value = item.counts
          break
        case '非常不满意':
          rateArr.value[4] = parseFloat(
            ((item.counts / total.value) * 100).toFixed(2)
          )
          rateNumArr.value[4] = item.counts
          pieData.value[4].value = item.counts
          break
        default:
          break
      }
    })
    await nextTick()
    chartLineInit()
    chartPieInit()
  }

  // 定义柱状图图表初始化
  const chartLineInit = () => {
    const myChart = echarts.init(document.getElementById('chart-bar'))

    // 绘制图表
    myChart.setOption({
      grid: {
        top: 0,
        left: 100,
        right: 100,
        bottom: 0,
      },
      toolbox: {
        show: true,
        top: 0,
        feature: {
          saveAsImage: {
            show: true,
            title: '保存为图片',
            name: '满意度图表',
          },
        },
      },
      xAxis: {
        show: false,
      },
      yAxis: [
        {
          show: true,
          data: satisfaction.value,
          inverse: true,
          offset: 20,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#000',
          },
        },
        {
          show: true,
          inverse: true,
          data: rateNumArr.value,
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#000',
            },
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '框',
          type: 'bar',
          yAxisIndex: 0,
          barGap: '-100%',
          data: [100, 100, 100, 100, 100],
          barWidth: 40,
          zlevel: 999,
          itemStyle: {
            normal: {
              color: '#FFF',
              borderColor: '#ccc',
              borderWidth: 1,
            },
          },
        },
        {
          name: '条',
          type: 'bar',
          yAxisIndex: 1,
          data: rateArr.value,
          barWidth: 40,
          zlevel: 9999,
          itemStyle: {
            normal: {
              color: '#008fff',
            },
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
            },
          },
        },
      ],
    })
  }

  // 定义饼图图表初始化
  const chartPieInit = () => {
    const myChart = echarts.init(document.getElementById('chart-pie'))

    // 绘制图表
    myChart.setOption({
      grid: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      },
      legend: {
        top: 'bottom',
      },
      toolbox: {
        show: true,
        top: 0,
        right: 0,
        feature: {
          saveAsImage: {
            show: true,
            title: '保存为图片',
            name: '满意度图表',
          },
        },
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [0, 100],
          center: ['50%', '50%'],
          color: ['#008fff', '#64d8ff', '#3bb357', '#32de8f', '#fa6dff'],
          data: pieData.value,
          label: {
            normal: {
              formatter: '{b}{d}%',
            },
          },
        },
      ],
    })
  }

  // 获取建议和意见列表
  const resGetProposalList = async () => {
    try {
      let params: any[] = []
      if (searchParams.value.creatTime) {
        params = searchParams.value.creatTime
      }
      const { data } = await getProposalList(
        _.pickBy({
          pageNum: state.params.pageNum,
          pageSize: state.params.pageSize,
          startTime: params[0] || '',
          endTime: params[1] || '',
        })
      )
      proposalList.value = data.items
      state.params.total = data.total
    } catch (error) {
      console.log(error)
    }
  }

  // 获取填写率
  const resGetFillingRate = async () => {
    try {
      let params: any[] = []
      if (searchParams.value.creatTime) {
        params = searchParams.value.creatTime
      }
      const { data } = await getFillingRate(
        _.pickBy({
          startTime: params[0] || '',
          endTime: params[1] || '',
        })
      )
      satisfactionCount.value = data.satisfactionCount
      satisfactionTotal.value = data.satisfactionTotal
      suggestionCount.value = data.satisfactionCount
      suggestionTotal.value = data.satisfactionTotal
    } catch (error) {
      console.log(error)
    }
  }

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义表格columns
  const columns = reactive([
    {
      title: '编号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
      width: 80,
    },
    {
      title: '建议或意见',
      key: 'suggestion',
      dataIndex: 'suggestion',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '提交时间',
      key: 'submitTime',
      dataIndex: 'submitTime',
    },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
    },
  ])

  // 定义调查表格数据
  const proposalList = ref([])

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: '',
    },
  })

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetProposalList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetProposalList()
  }

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetReportList(), resGetProposalList(), resGetFillingRate()])
      .then(async () => {
        await nextTick()
        loading.value = false
        // chartLineInit()
        // chartPieInit()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
  })
</script>

<style lang="less" scoped>
  .statistics-box {
    background: #fff;
    padding: 20px;
    margin: 20px;
    min-height: calc(100vh - 102px);

    .chart-box {
      width: 1000px;
      .chart-tips {
        font-size: 12px;
        color: #bbb;
        padding: 10px 0;
      }

      .chart-bar {
        width: 100%;
        height: 300px;
        margin-top: 20px;
      }

      .chart-pie {
        width: 100%;
        height: 300px;
        margin-top: 20px;
      }

      .chart-button {
        margin-top: 20px;
      }

      .top30 {
        margin-top: 30px;
      }
    }
  }

  :deep(.my-tabel-wrapper) {
    padding: 0;
  }
  :deep(.layout-table) {
    padding: 0;
  }
</style>
