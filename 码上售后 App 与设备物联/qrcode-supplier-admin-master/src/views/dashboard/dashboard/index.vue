<template>
  <div class="dashboard-box">
    <a-card class="card-box">
      <template #title>
        <span class="title-box">全量数据</span>
      </template>
      <template #extra>
        <span class="time">
          更新时间: {{ dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <div class="full-data-box">
        <div class="full-data-item">
          <div class="title">二维码签发总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.qrcodeGenerateTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">二维码激活总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.qrcodeActivationTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">产品总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.productTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">设备总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.deviceTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">物联设备总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.iotDeviceTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">用户总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.totalUsers) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">本月访问用户数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.currentMonthUsers) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">视频连线总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.facetimeTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">工单总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.workTicketTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
        <div class="full-data-item">
          <div class="title">教程总数</div>
          <div class="value">
            <div class="left">
              <icon-bytedance-color style="font-size: 30px" />
            </div>
            <div class="right">
              <a-statistic
                :value="parseInt(totalData.useGuideTotal) || 0"
                :value-from="0"
                :start="true"
                animation
              >
              </a-statistic>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card class="card-box">
      <template #title>
        <span class="title-box">动态数据</span>
      </template>
      <template #extra>
        <span class="time">
          更新时间: {{ dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <a-row class="dynamic-data-box" :gutter="50">
        <a-col v-if="false" :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="today-online-device">
            <div>
              <div class="title">今日在线物联设备</div>
              <div class="num-box">
                <span class="num">{{ onlineTimes.slice(-1)[0] }}</span>
                <span class="yesterday">
                  较昨日<span>
                    {{ onlineTimes.slice(-1)[0] - onlineTimes.slice(-2)[0] }}
                    <icon-arrow-rise
                      v-if="
                        onlineTimes.slice(-1)[0] - onlineTimes.slice(-2)[0] >= 0
                      "
                    />
                    <icon-arrow-fall v-else />
                  </span>
                </span>
              </div>
            </div>
            <line-chart
              :id="'online-chart'"
              class="online-chart"
              :style="{ width: '100%', height: '100%' }"
              :x-data="scanDate"
              :line-data="onlineTimes"
              :line-name="'连线次数'"
              :init="onlineChartInitFlag"
            >
            </line-chart>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="today-scan-code">
            <div>
              <div class="title">今日扫码次数</div>
              <div class="num-box">
                <span class="num">{{ scanTimes.slice(-1)[0] }}</span>
                <span class="yesterday">
                  较昨日<span>
                    {{ scanTimes.slice(-1)[0] - scanTimes.slice(-2)[0] }}
                    <icon-arrow-rise
                      v-if="
                        scanTimes.slice(-1)[0] - scanTimes.slice(-2)[0] >= 0
                      "
                    />
                    <icon-arrow-fall v-else />
                  </span>
                </span>
              </div>
            </div>
            <div class="scan-chart">
              <line-bar
                :id="'scan-chart'"
                :style="{ width: '100%', height: '100%' }"
                :x-data="scanDate"
                :line-data="scanUsers"
                :bar-data="scanTimes"
                :bar-name="'扫码次数'"
                :line-name="'扫码用户数'"
                :init="scanChartInitFlag"
              ></line-bar>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="today-video-connection">
            <div>
              <div class="title">今日视频连线</div>
              <div class="num-box">
                <span class="num">{{ videoTimes.slice(-1)[0] }}</span>
                <span class="yesterday">
                  较昨日<span>
                    {{ videoTimes.slice(-1)[0] - videoTimes.slice(-2)[0] }}
                    <icon-arrow-rise
                      v-if="
                        videoTimes.slice(-1)[0] - videoTimes.slice(-2)[0] >= 0
                      "
                    />
                    <icon-arrow-fall v-else />
                  </span>
                </span>
              </div>
            </div>
            <line-bar
              :id="'video-chart'"
              :style="{ width: '100%', height: '100%' }"
              :x-data="scanDate"
              :line-data="videoTimes"
              :line-name="'已接通'"
              :bar-data="missVideoTimes"
              :bar-name="'未接通'"
              :init="videoChartInitFlag"
            ></line-bar>
            <!-- <line-chart
              :id="'video-chart'"
              class="video-chart"
              :style="{ width: '100%', height: '100%' }"
              :x-data="scanDate"
              :line-data="videotimes"
              :line-name="'连线次数'"
              :init="videoChartInitFlag"
            >
            </line-chart> -->
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
          <div class="today-video-connection">
            <div>
              <div class="title">每日设备绑码数量</div>
              <div class="num-box">
                <span class="num">{{ tenDayTimes.slice(-1)[0] }}</span>
                <span class="yesterday">
                  较昨日<span>
                    {{ tenDayTimes.slice(-1)[0] - tenDayTimes.slice(-2)[0] }}
                    <icon-arrow-rise
                      v-if="
                        tenDayTimes.slice(-1)[0] - tenDayTimes.slice(-2)[0] >= 0
                      "
                    />
                    <icon-arrow-fall v-else />
                  </span>
                </span>
              </div>
            </div>
            <line-chart
              :id="'ten-day-chart'"
              class="video-chart"
              :style="{ width: '100%', height: '100%' }"
              :x-data="scanDate"
              :line-data="tenDayTimes"
              :line-name="'绑码设备数'"
              :init="videoChartInitFlag"
            >
            </line-chart>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="card-box">
      <a-tabs default-active-key="1" @change="handleChangeTab">
        <template #extra>
          <span class="time">
            更新时间: {{ dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
        <a-tab-pane key="1" title="用户分析">
          <a-row class="user-report-box" :gutter="100">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
              <div class="month-user-chart">
                <line-bar
                  :id="'month-user-chart'"
                  :style="{ width: '100%', height: '100%' }"
                  :title="{
                    text: '月度访问量分析',
                    textStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    left: '2%',
                  }"
                  :x-show="true"
                  :line-show="true"
                  :bar-show="true"
                  :x-data="EMonths"
                  :bar-data="thisYearMonthUserReportData"
                  :line-data="lastYearMonthUserReportData"
                  :init="monthUserChartInitFlag"
                  :grid="{
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '20%',
                  }"
                  :bar-name="this_year"
                  :line-name="last_year"
                  :legend="{
                    type: 'scroll',
                    bottom: '2%',
                    left: 'center',
                    align: 'left',
                    textStyle: {
                      color: '#8C8C8C',
                    },
                    height: 250,
                  }"
                ></line-bar>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" title="报修分析">
          <a-row class="repair-report-box" :gutter="100">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <pie-chart
                :id="'report-type-chart'"
                class="report-type-chart"
                :title="[
                  {
                    text: '报修类型分析',
                    textStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    left: '2%',
                  },
                  {
                    text: '总',
                    subtext: `${reportData.repairTotal}个`,
                    textStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    subtextStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    textAlign: 'center',
                    x: '49%',
                    y: '44%',
                  },
                ]"
                :legend="{
                  type: 'scroll',
                  bottom: '2%',
                  left: 'center',
                  align: 'left',
                  textStyle: {
                    color: '#8C8C8C',
                  },
                  height: 250,
                }"
                :data="[
                  {
                    value: reportData.workTicketTotal,
                    name: '工单报修',
                    itemStyle: { color: '#62daab' },
                  },
                  {
                    value: reportData.facetimeTotal,
                    name: '视频报修',
                    itemStyle: { color: '#6395f9' },
                  },
                ]"
                :init="reportTypeInitFlag"
              >
              </pie-chart>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
              <div class="report-video-chart">
                <line-bar
                  :id="'report-video-chart'"
                  :style="{ width: '100%', height: '100%' }"
                  :title="{
                    text: '月度视频报修分析',
                    textStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    left: '2%',
                  }"
                  :x-show="true"
                  :line-show="true"
                  :bar-show="true"
                  :x-data="EMonths"
                  :bar-data="thisYearFacetimeData"
                  :line-data="lastYearFacetimeData"
                  :init="reportChartInitFlag"
                  :grid="{
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '20%',
                  }"
                  :bar-name="this_year"
                  :line-name="last_year"
                  :legend="{
                    type: 'scroll',
                    bottom: '2%',
                    left: 'center',
                    align: 'left',
                    textStyle: {
                      color: '#8C8C8C',
                    },
                    height: 250,
                  }"
                ></line-bar>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
              <div class="report-order-chart">
                <line-bar
                  :id="'report-order-chart'"
                  :style="{ width: '100%', height: '100%' }"
                  :title="{
                    text: '月度工单报修分析',
                    textStyle: {
                      fontSize: 16,
                      color: 'black',
                    },
                    left: '2%',
                  }"
                  :x-show="true"
                  :line-show="true"
                  :bar-show="true"
                  :x-data="EMonths"
                  :bar-data="thisYearWorkTicketData"
                  :line-data="lastYearWorkTicketData"
                  :init="reportChartInitFlag"
                  :grid="{
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '20%',
                  }"
                  :bar-name="this_year"
                  :line-name="last_year"
                  :legend="{
                    type: 'scroll',
                    bottom: '2%',
                    left: 'center',
                    align: 'left',
                    textStyle: {
                      color: '#8C8C8C',
                    },
                    height: 250,
                  }"
                ></line-bar>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    getTotalData,
    getDynamicData,
    getRepairReportData,
    getUserReportData,
  } from '@/api/dashboard/index'
  import dayjs from 'dayjs'
  // import moment from 'moment'
  import lineBar from '@hx/packages/components/echarts/line-bar.vue'
  import lineChart from '@hx/packages/components/echarts/line-chart.vue'
  import pieChart from '@hx/packages/components/echarts/pie-chart.vue'

  // 获取当前时间戳
  const timestamp = Date.parse(new Date())

  const this_year = dayjs().year()
  const last_year = dayjs().add(-1, 'y').format('YYYY')

  // 定义全量数据
  const totalData = ref({})

  // 获取全量数据
  const resGetTotalData = async () => {
    try {
      const { data } = await getTotalData()
      totalData.value = data
    } catch (error) {
      console.log(error)
    }
  }

  // 初始化图表数据方法
  const dataInit = (arr1, arr2, arr3, str) => {
    arr1.forEach((aItem) => {
      arr2.forEach((bItem, index) => {
        if (aItem.currentDay === bItem) {
          arr3[index] = aItem[str]
        }
      })
    })
  }

  // 获取动态数据
  const resGetDynamicData = async () => {
    Array(10)
      .fill(undefined)
      .forEach((item, index) => {
        scanDate.value.unshift(
          dayjs(timestamp - 1000 * 60 * 60 * 24 * index).format('YYYY-MM-DD')
        )
        scanTimes.value.unshift(0)
        scanUsers.value.unshift(0)
        videoTimes.value.unshift(0)
        missVideoTimes.value.unshift(0)
        onlineTimes.value.unshift(0)
        tenDayTimes.value.unshift(0)
      })
    try {
      const { data } = await getDynamicData({
        day: 10,
      })
      dataInit(data.scanRecordReport, scanDate.value, scanTimes.value, 'counts')
      dataInit(
        data.scanRecordReport,
        scanDate.value,
        scanUsers.value,
        'counts1'
      )
      dataInit(
        data.facetimeRecordReport,
        scanDate.value,
        videoTimes.value,
        'counts'
      )
      dataInit(
        data.facetimeRecordReport,
        scanDate.value,
        missVideoTimes.value,
        'counts'
      )
      dataInit(
        data.tenDayQrcodeBindReport,
        scanDate.value,
        tenDayTimes.value,
        'counts'
      )
    } catch (error) {
      console.log(error)
    }
  }

  // 获取报修分析
  const resGetRepairReportData = async () => {
    try {
      const { data } = await getRepairReportData()
      reportData.value = {
        facetimeTotal: data.facetimeTotal,
        repairTotal: data.repairTotal,
        workTicketTotal: data.workTicketTotal,
      }
      dataInit(
        data.thisYearFacetimeData,
        months.value,
        thisYearFacetimeData.value,
        'counts'
      )
      dataInit(
        data.lastYearFacetimeData,
        months.value,
        lastYearFacetimeData.value,
        'counts'
      )
      dataInit(
        data.thisYearWorkTicketData,
        months.value,
        thisYearWorkTicketData.value,
        'counts'
      )
      dataInit(
        data.lastYearWorkTicketData,
        months.value,
        lastYearWorkTicketData.value,
        'counts'
      )
    } catch (error) {
      console.log(error)
    }
  }

  // 获取用户分析
  const resGetUserReportData = async () => {
    try {
      const { data } = await getUserReportData()
      dataInit(
        data.thisYearMonthUserReportData,
        months.value,
        thisYearMonthUserReportData.value,
        'counts'
      )
      dataInit(
        data.lastYearMonthUserReportData,
        months.value,
        lastYearMonthUserReportData.value,
        'counts'
      )
    } catch (error) {
      console.log(error)
    }
  }

  const scanDate = ref([])
  const scanTimes = ref([])
  const scanUsers = ref([])
  const videoTimes = ref([])
  const missVideoTimes = ref([])
  const tenDayTimes = ref([])
  const onlineTimes = ref([])

  const reportData = ref({})

  // 定义月份数组
  const months = ref([])
  const EMonths = ref([
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ])

  // 定义视频报修今年数据
  const thisYearFacetimeData = ref([])
  // 定义视频报修去年数据
  const lastYearFacetimeData = ref([])
  // 定义工单报修今年数据
  const thisYearWorkTicketData = ref([])
  // 定义工单报修去年数据
  const lastYearWorkTicketData = ref([])

  // 定义月度访问量分析今年数据
  const thisYearMonthUserReportData = ref([])
  // 定义月度访问量分析去年数据
  const lastYearMonthUserReportData = ref([])

  // 定义获取某一年所有月份
  const getMonth = () => {
    const year = new Date().getFullYear()
    Array(12)
      .fill(undefined)
      .forEach((item, index) => {
        if (index < 10) {
          months.value.push(`${year}-0${index + 1}`)
        } else {
          months.value.push(`${year}-${index + 1}`)
        }
        thisYearFacetimeData.value.unshift(0)
        lastYearFacetimeData.value.unshift(0)
        thisYearWorkTicketData.value.unshift(0)
        lastYearWorkTicketData.value.unshift(0)
        thisYearMonthUserReportData.value.unshift(0)
        lastYearMonthUserReportData.value.unshift(0)
      })
  }

  // 定义今日在线物联图表是否初始化
  const onlineChartInitFlag = ref(false)
  // 定义今日扫码次数图表是否初始化
  const scanChartInitFlag = ref(false)
  // 定义今日视频连线图表是否初始化
  const videoChartInitFlag = ref(false)
  // 定义报修类型分析图表是否初始化
  const reportTypeInitFlag = ref(false)
  // 定义月度视频报修图表是否初始化
  const reportChartInitFlag = ref(false)
  // 定义月度工单报修图表是否初始化
  const reportOrderChartInitFlag = ref(false)
  // 定义月度访问量分析
  const monthUserChartInitFlag = ref(false)

  // 定义tab栏切换事件
  const handleChangeTab = (key) => {
    switch (key) {
      case '1':
        Promise.all([resGetUserReportData(), getMonth()])
          .then(async () => {
            await nextTick()
            monthUserChartInitFlag.value = true
          })
          .catch((err) => {
            console.log(err)
          })
        break
      case '2':
        Promise.all([resGetRepairReportData(), getMonth()])
          .then(async () => {
            await nextTick()
            reportTypeInitFlag.value = true
            reportChartInitFlag.value = true
            reportOrderChartInitFlag.value = true
          })
          .catch((err) => {
            console.log(err)
          })
        break
      default:
        break
    }
  }

  onMounted(() => {
    Promise.all([
      resGetTotalData(),
      resGetDynamicData(),
      resGetUserReportData(),
      getMonth(),
    ])
      .then(async () => {
        await nextTick()
        onlineChartInitFlag.value = true
        scanChartInitFlag.value = true
        videoChartInitFlag.value = true
        monthUserChartInitFlag.value = true
      })
      .catch((err) => {
        console.log(err)
      })
  })
</script>

<style lang="less" scoped>
  .dashboard-box {
    padding: 20px;

    .time {
      font-size: 12px;
      color: #7f7f7f;
    }

    .title-box {
      font-weight: bold;
    }
  }

  .full-data-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;

    .full-data-item {
      width: 20%;
      margin: 10px 0;

      .value {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .left {
          margin-right: 5px;
          display: none;
        }
      }
    }
  }

  .dynamic-data-box {
    .today-scan-code,
    .today-video-connection,
    .today-online-device {
      height: 200px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ddeeff;
      border-radius: 10px;

      .num-box {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .num {
          font-size: 24px;
          font-weight: bold;
        }

        .yesterday {
          margin-left: 10px;

          span {
            color: #5d8822;
            margin-left: 5px;
          }
        }
      }

      .online-chart {
        width: 100%;
        height: 120px;
      }

      .scan-chart {
        width: 100%;
        height: 120px;
      }

      .video-chart {
        width: 100%;
        height: 120px;
      }
    }
  }

  .repair-report-box {
    .report-type-chart,
    .report-video-chart,
    .report-order-chart,
    .report-time-chart,
    .report-prescription-chart {
      width: 100%;
      height: 300px;
    }
  }

  .user-report-box {
    .month-user-chart {
      width: 100%;
      height: 300px;
    }
  }

  .card-box {
    margin-bottom: 20px;
  }

  .top20 {
    margin-top: 20px;
  }
</style>
