<template>
  <div class="runing-log-box">
    <a-tabs @change="handleChangeTab">
      <template #extra>
        <div class="extra-box">
          <div class="left">
            <a-image width="40" :src="img" :preview="false" />
          </div>
          <div class="right">
            <div class="title">{{ productName }}</div>
            <div class="model">{{ sn }}</div>
          </div>
        </div>
      </template>
      <a-tab-pane key="1" title="运行日志">
        <m-table
          :loading="loading"
          :table-props="{
            columns,
            data: runingLogList,
            showSelect: true,
            rowKey: 'id',
            expandable: expandable,
            expandedKeys,
            onExpand: expand,
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
          :on-refresh="pageDataInit"
        >
          <template #search>
            <m-form
              v-bind="searchFormConfig"
              v-model="searchParams"
              @change-value="handleSearchChangeValue"
            >
              <template #right>
                <MButton v-bind="searchBtnConfig"></MButton>
              </template>
            </m-form>
          </template>
          <template #runTime="{ record }">
            {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }} ~
            {{ dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template #totalTime="{ record }">
            {{ record.totalTime }} 秒
          </template>
        </m-table>
      </a-tab-pane>
      <a-tab-pane key="2" title="物联数据">
        <m-table
          :loading="iotDataLoading"
          :table-props="{
            columns: iotDatacolumns,
            data: iotDataList,
            showSelect: true,
            rowKey: 'tenantId',
          }"
          :state="iotDataState"
          :pagination="{
            total: iotDataState.params.total,
            hideOnSinglePage: false,
            current: iotDataState.params.pageNum,
            pageSize: iotDataState.params.pageSize,
            onIotDataChange,
            onIotDataPageSizeChange,
          }"
          :on-refresh="pageIotDataInit"
        >
          <template #search>
            <m-form
              v-bind="searchFormConfig"
              v-model="searchParams"
              @change-value="handleSearchChangeValue"
            >
              <template #right>
                <MButton v-bind="searchBtnConfig"></MButton>
              </template>
            </m-form>
          </template>
          <template #actions>
            <a-tooltip
              background-color="#fff"
              :content-style="{
                color: '#000',
              }"
              position="bottom"
            >
              <span style="color: #ff4e35">2条</span>
              <template #content>
                <div class="fault-content">
                  <span class="warning"></span>
                  <span>电机高温: 电机温度过高, 当前温度98.5℃</span>
                </div>
              </template>
            </a-tooltip>
          </template>
        </m-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="tsx" setup>
  import MTable from '@hx/packages/components/m-table'
  import _ from 'lodash'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { getRunLogList } from '@/api/iot-device/index'
  import * as echarts from 'echarts'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import { runDataMap } from '@/utils/iot-device.ts'

  const route = useRoute()

  // const deviceId = route.query.id
  const { id, img, productName, sn } = route.query

  // 定义运行趋势选中值
  const runingTrend = ref('area')

  // 定义展开行
  const expandedKeys = ref([])
  // 定义展开行数据
  const expandRecord = ref({})

  // 表格展开事件
  const expand = async (rowKey, record) => {
    if (expandedKeys.value[0] === rowKey) {
      expandedKeys.value = []
      runingTrend.value = ''
      expandRecord.value = {}
    } else {
      runingTrend.value = ''
      runingTrend.value = 'area'
      expandedKeys.value = [rowKey]
      expandRecord.value = record
      await nextTick()
      initMap()
    }
  }

  // 运动趋势选中值变化事件
  const handleChange = (value) => {
    runingTrend.value = value
  }

  // 侦听运动趋势选中值变化 渲染echarts
  watch(
    () => runingTrend.value,
    async (newValue) => {
      await nextTick()
      switch (newValue) {
        case 'area':
          areaChartInit()
          break
        case 'power':
          powerChartInit()
          break
        case 'water':
          waterChartInit()
          break
        default:
          break
      }
    },
    {
      deep: true,
    }
  )

  // 面积图表初始化
  const areaChartInit = () => {
    const myChart = echarts.init(document.getElementById('area'))
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: [220, 100, 50, 280, 170, 130, 80],
          type: 'bar',
          barWidth: 15,
        },
      ],
    })
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  }

  // 耗电图表初始化
  const powerChartInit = () => {
    const myChart = echarts.init(document.getElementById('power'))
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 15,
        },
      ],
    })
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  }

  // 用水图表初始化
  const waterChartInit = () => {
    const myChart = echarts.init(document.getElementById('water'))
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'line', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: [200, 100, 50, 180, 170, 10, 130],
          type: 'bar',
          barWidth: 15,
        },
      ],
    })
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  }

  // 获取地址
  const address = ref('')

  // 地图初始化
  const initMap = () => {
    // 定义地图中心点坐标
    const center = new window.TMap.LatLng(
      expandRecord.value.latitude || 31.497578,
      expandRecord.value.longitude || 120.31851
    )
    // 定义map变量，调用 TMap.Map() 构造函数创建地图
    const map = new window.TMap.Map(document.getElementById('tx_map_d'), {
      center, // 设置地图中心点坐标
      zoom: 13, // 设置地图缩放级别
      // pitch: 43.5, // 设置俯仰角
      rotation: 45, // 设置地图旋转角度
    })
    map.setViewMode('2D')
    const geocoder = new window.TMap.service.Geocoder()
    // 初始化marker
    if (expandRecord.value.latitude && expandRecord.value.longitude) {
      // eslint-disable-next-line no-new
      new window.TMap.MultiMarker({
        id: 'marker-layer',
        map,
        styles: {
          marker: new window.TMap.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 16, y: 32 },
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
          }),
        },
        geometries: [
          {
            id: 'demo',
            styleId: 'marker',
            position: new window.TMap.LatLng(
              expandRecord.value.latitude,
              expandRecord.value.longitude
            ),
            properties: {
              title: 'marker',
            },
          },
        ],
      })
      geocoder
        .getAddress({
          location: new window.TMap.LatLng(
            expandRecord.value.latitude,
            expandRecord.value.longitude
          ),
        }) // 将给定的坐标位置转换为地址
        .then((result) => {
          address.value = result.result.address
        })
    }
  }

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '运行时间',
      slotName: 'runTime',
      key: 'startTime',
    },
    {
      title: '运行时长',
      key: 'totalTime',
      slotName: 'totalTime',
      ellipsis: true,
      tooltip: true,
    },
  ])

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
    resGetRuningLog()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetRuningLog()
  }

  // 定义运行日志列表
  const runingLogList = ref([])

  // 获取运行日志列表
  const resGetRuningLog = async () => {
    try {
      const { data } = await getRunLogList(
        _.pickBy({
          startTime:
            (searchParams.value.time && searchParams.value.time[0]) || '',
          endTime:
            (searchParams.value.time && searchParams.value.time[1]) || '',
          pageNum: state.params.pageNum,
          pageSize: state.params.pageSize,
          deviceId: id,
        })
      )
      runingLogList.value = data.items
      state.params.total = data.total
    } catch (error) {
      console.log(error)
    }
  }

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetRuningLog()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'time',
        type: 'datepicker',
        label: '时间范围',
        placeholder: '请选择时间范围',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 定义搜索表单数据
  const searchParams = ref({
    time: '',
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
          iotDataState.params.pageNum = 1
          resGetRuningLog()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            time: '',
          }
        },
      },
    ],
  })

  const expandable = reactive({
    title: '详情',
    width: 80,
    expandedRowRender: () => {
      const vnode = (
        <>
          <a-row class="runing-info">
            <a-col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <div class="runing-data">
                <div class="title">运行数据</div>
                <div class="content">
                  {Object.entries(expandRecord.value).map((item) => {
                    return runDataMap.map((rItem) => {
                      return item[0] === rItem.key ? (
                        <div class="content-item">
                          <div class="top">
                            <img src={rItem.img} width="15" />
                            <span>{rItem.name}</span>
                          </div>
                          <span class="data">
                            {item[1]}
                            {rItem.unit}
                          </span>
                        </div>
                      ) : (
                        ''
                      )
                    })
                  })}
                </div>
              </div>
            </a-col>
            <a-col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <div class="runing-trend">
                <div class="title">运行趋势</div>
                <div class="content">
                  <a-radio-group
                    defaultValue={runingTrend}
                    type="button"
                    onChange={handleChange}
                  >
                    <a-radio value="area">面积</a-radio>
                    <a-radio value="power">耗电</a-radio>
                    <a-radio value="water">用水</a-radio>
                  </a-radio-group>
                  {runingTrend.value === 'area' && <div id="area"></div>}
                  {runingTrend.value === 'power' && <div id="power"></div>}
                  {runingTrend.value === 'water' && <div id="water"></div>}
                </div>
              </div>
            </a-col>
            <a-col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
              <div class="runing-position">
                <div class="title">运行位置</div>
                <div class="content">
                  <div class="map" id="tx_map_d"></div>
                  <div>
                    <icon-location />
                    <span style="margin-left: 10px; font-size: 14px; color: #a3a4aa">
                      {address.value}
                    </span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </>
      )
      return vnode
    },
  })

  // 定义tab栏切换事件
  const handleChangeTab = (key) => {
    switch (key) {
      case '1':
        iotDataState.params.pageNum = 1
        state.params.pageNum = 1
        pageDataInit()
        break
      case '2':
        iotDataState.params.pageNum = 1
        state.params.pageNum = 1
        pageIotDataInit()
        break
      default:
        break
    }
  }
  // 定义表格加载中loading
  const iotDataLoading = ref(false)

  // 定义表格columns
  const iotDatacolumns = reactive([
    {
      title: '序号',
      width: 100,
      key: 'index',
      render: (row: any) => row.rowIndex + 1,
    },
    {
      title: '运行时间',
      dataIndex: 'tenantNick',
      key: 'tenantNick',
    },
    {
      title: '运行时长',
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '故障报警',
      key: 'actions',
      width: 150,
      slotName: 'actions',
    },
  ])

  // 定义分页信息
  const iotDataState = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: '',
    },
  })

  // 分页事件
  const onIotDataChange = (page: number) => {
    iotDataState.params.pageNum = page
    resGetRuningLog()
  }

  const onIotDataPageSizeChange = (size: number) => {
    iotDataState.params.pageSize = size
    resGetRuningLog()
  }

  // 定义物联数据列表
  const iotDataList = ref([])

  // 获取物联数据列表
  const resGetIotData = async () => {
    try {
      const { data } = await getRunLogList(
        _.pickBy({
          ...searchParams.value,
          pageNum: iotDataState.params.pageNum,
          pageSize: iotDataState.params.pageSize,
        })
      )
      iotDataList.value = data.items
      iotDataState.params.total = data.total
    } catch (error) {
      console.log(error)
    }
  }

  // 定义页面初始化事件
  const pageIotDataInit = () => {
    loading.value = true
    Promise.all([resGetIotData()])
      .then(() => {
        loading.value = false
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
  .runing-log-box {
    padding: 20px;
    background: #fff;
    margin: 20px;

    .extra-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .left {
        margin-right: 10px;
      }

      .right {
        display: flex;
        flex-direction: column;
        height: 40px;
        justify-content: space-between;
        .title {
          font-size: 16px;
          font-weight: 600;
          line-height: 16px;
        }

        .model {
          color: #646464;
          line-height: 16px;
        }
      }
    }

    :deep(.my-tabel-wrapper) {
      padding: 0;

      .layout-table {
        padding: 0;

        .layout-table__header {
          padding: 0;

          .arco-card-size-medium {
            .arco-card-body {
              padding: 0;
            }
          }
        }
      }
    }

    .runing-info {
      margin-top: 20px;

      .runing-data,
      .runing-trend,
      .runing-position {
        .title {
          font-weight: 600;
          margin-bottom: 20px;
        }
      }

      .runing-data {
        width: 70%;

        .content {
          background: #f5f7fb;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;

          .content-item {
            width: 29.333%;
            margin: 2% 2%;
            box-sizing: border-box;
            padding: 10px 10px 5px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 2px 2px 2px #ccc;

            .top {
              display: flex;
              flex-direction: row;
              align-items: center;
              span {
                margin-left: 5px;
                font-size: 12px;
                color: #a3a5b1;
              }
            }
            .data {
              font-weight: 500;
              margin-top: 10px;
              display: inline-block;
            }
          }
        }
      }
    }
  }

  :deep(.arco-tabs-nav) {
    height: 50px;
  }

  :deep(.arco-tabs-nav-type-line .arco-tabs-tab) {
    padding: 13px 0;
  }

  :deep(.runing-info) {
    margin-top: 20px;

    .runing-data,
    .runing-trend,
    .runing-position {
      .title {
        font-weight: 600;
        margin-bottom: 20px;
      }
    }

    .runing-data {
      width: 70%;

      .content {
        background: #f5f7fb;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;

        .content-item {
          width: 29.333%;
          margin: 2% 2%;
          box-sizing: border-box;
          padding: 10px 10px 5px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 2px 2px 2px #ccc;

          .top {
            display: flex;
            flex-direction: row;
            align-items: center;
            span {
              margin-left: 5px;
              font-size: 12px;
              color: #a3a5b1;
            }
          }
          .data {
            font-weight: 500;
            margin-top: 10px;
            display: inline-block;
          }
        }
      }
    }

    .runing-trend {
      .content {
        #area,
        #power,
        #water {
          width: 70%;
          height: 250px;
        }
      }
    }

    .runing-position {
      .content {
        #tx_map_d {
          width: 70%;
        }
      }
    }
  }

  .fault-content {
    box-shadow: 0px 0px 2px #ccc;
    padding: 5px 10px;

    .warning {
      width: 10px;
      height: 10px;
      background: #fe4d34;
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>
