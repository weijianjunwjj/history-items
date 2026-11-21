<template>
  <AppPage>
    <div class="billing-management">
      <n-card flex-1 rounded-4 class="main">
        <n-grid cols="1 s:1 m:2 l:3 xl:4 2xl:4" responsive="screen" x-gap="15" y-gap="15" v-if="isAdmin">
          <n-grid-item>
            <header class="header">
              <div>今日订单数据</div>
            </header>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="服务商名：">
              <n-select
                v-model:value="searchForm.serviceName1"
                :options="options.serviceName"
                @update:value="handleUpdateService1"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select
                v-model:value="searchForm.areaNames1"
                :options="options.areaNames1"
                @update:value="handleUpdateArea1"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select
                v-model:value="searchForm.dateSelect1"
                :options="options.timeSel"
                @update:value="handleUpdateDate1"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid cols="1 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen" x-gap="15" y-gap="15" v-else>
          <n-grid-item>
            <header class="header">
              <div>今日订单数据</div>
            </header>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select
                v-model:value="searchForm.areaNames1"
                :options="options.areaNames1"
                @update:value="handleUpdateArea1"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select
                v-model:value="searchForm.dateSelect1"
                :options="options.timeSel"
                @update:value="handleUpdateDate1"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <main class="mt-18">
          <n-grid x-gap="16" :cols="4">
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d1?.today?.totalAmount || 0 }}</span>
                  <div class="mb-14 mt-14 font-size-14 black-6">总订单款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">昨日</div>
                  <div class="black-8" mt-10>￥{{ d1?.yesterday?.totalAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">
                    {{ d1?.today?.payAmount || 0 }}
                    <span class="percent">
                      /{{ getPercent(d1?.today?.payAmount, d1?.today?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">已收款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">昨日</div>
                  <div class="black-8" mt-10>￥{{ d1?.yesterday?.payAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d1?.today?.unpayAmount || 0 }}
                     <span class="percent">
                      /{{ getPercent(d1?.today?.unpayAmount, d1?.today?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">未收款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">昨日</div>
                  <div class="black-8" mt-10>￥{{ d1?.yesterday?.unpayAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d1?.today?.badAmount || 0 }}
                     <span class="percent">
                      /{{ getPercent(d1?.today?.badAmount, d1?.today?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">坏账款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">昨日</div>
                  <div class="black-8" mt-10>￥{{ d1?.yesterday?.badAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </main>
      </n-card>
      <n-card flex-1 rounded-4 mt-14 class="main">
        <n-grid cols="1 s:1 m:2 l:3 xl:4 2xl:4" responsive="screen" x-gap="15" y-gap="15"  v-if="isAdmin">
          <n-grid-item>
            <header class="header">
              <div>本月订单数据</div>
            </header>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="服务商名：">
              <n-select
                v-model:value="searchForm.serviceName2"
                :options="options.serviceName"
                @update:value="handleUpdateService2"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select
                v-model:value="searchForm.areaNames2"
                :options="options.areaNames2"
                @update:value="handleUpdateArea2"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select
                v-model:value="searchForm.dateSelect2"
                :options="options.timeSel"
                @update:value="handleUpdateDate2"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid cols="1 s:1 m:3 l:3 xl:3 2xl:3"  responsive="screen" x-gap="15" y-gap="15" v-else>
          <n-grid-item>
            <header class="header">
              <div>本月订单数据</div>
            </header>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select
                v-model:value="searchForm.areaNames2"
                :options="options.areaNames2"
                @update:value="handleUpdateArea2"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select
                v-model:value="searchForm.dateSelect2"
                :options="options.timeSel"
                @update:value="handleUpdateDate2"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <main class="mt-18">
          <n-grid x-gap="16" :cols="4">
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d2?.thisMonth?.totalAmount || 0 }}</span>
                  <div class="mb-14 mt-14 font-size-14 black-6">总订单款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">上月</div>
                  <div class="black-8" mt-10>￥{{ d2?.lastMonth?.totalAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d2?.thisMonth?.payAmount || 0 }}
                     <span class="percent">
                      /{{ getPercent(d2?.thisMonth?.payAmount, d2?.thisMonth?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">已收款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">上月</div>
                  <div class="black-8" mt-10>￥{{ d2?.lastMonth?.payAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d2?.thisMonth?.unpayAmount || 0 }}
                     <span class="percent">
                      /{{ getPercent(d2?.thisMonth?.unpayAmount, d2?.thisMonth?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">未收款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">上月</div>
                  <div class="black-8" mt-10>￥{{ d2?.lastMonth?.unpayAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-sb align-c my-card pl-20 pr-20 pt-26 pb-30">
                <div class="flex-v">
                  <span class="font-size-36 black-8">{{ d2?.thisMonth?.badAmount || 0 }}
                    <span class="percent">
                      /{{ getPercent(d2?.thisMonth?.badAmount, d2?.thisMonth?.totalAmount) }}
                    </span>
                  </span>
                  <div class="mb-14 mt-14 font-size-14 black-6">坏账款（元）</div>
                </div>

                <div class="font-size-14 flex-v">
                  <div class="black-4">上月</div>
                  <div class="black-8" mt-10>￥{{ d2?.lastMonth?.badAmount || 0 }}</div>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </main>
      </n-card>
      <n-card flex-1 rounded-4 mt-14 class="main">
        <n-grid cols="1 s:2 m:3 l:4 xl:5 2xl:6" responsive="screen" x-gap="15" y-gap="15" v-if="isAdmin">
          <n-grid-item>
            <n-form-item label="服务商名：">
              <n-select v-model:value="searchForm.serviceName3" :options="options.serviceName" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select v-model:value="searchForm.areaNames3" :options="options.areaNames3" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select v-model:value="searchForm.dateSelect3" :options="options.timeSel" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="2">
            <n-form-item label="日期选择：" path="inputValue">
              <n-date-picker
                v-model:value="searchForm.selectTime"
                type="daterange"
                class="full-w flex-1"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <div style="width: 62px">
              <n-button type="primary" @click="getData3">查询</n-button>
            </div>
          </n-grid-item>
        </n-grid>
        <n-grid cols="1 s:2 m:3 l:4 xl:5 2xl:5" responsive="screen" x-gap="15" y-gap="15" v-else>
          <n-grid-item>
            <n-form-item label="地区名：">
              <n-select v-model:value="searchForm.areaNames3" :options="options.areaNames3" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="时间选择：">
              <n-select v-model:value="searchForm.dateSelect3" :options="options.timeSel" />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="2">
            <n-form-item label="日期选择：" path="inputValue">
              <n-date-picker
                v-model:value="searchForm.selectTime"
                type="daterange"
                class="full-w flex-1"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <div style="width: 62px">
              <n-button type="primary" @click="getData3">查询</n-button>
            </div>
          </n-grid-item>
        </n-grid>

        <!-- <header class="header flex-sb">
            <div class="flex flex-1">
              <n-form-item label="地区名：">
                <n-select v-model:value="searchForm.areaNames3" :options="options.areaNames3" />
              </n-form-item>
              <n-form-item label="服务商名：">
                <n-select v-model:value="searchForm.serviceName3" :options="options.serviceName" />
              </n-form-item>
              <n-form-item label="时间选择：">
                <n-select v-model:value="searchForm.dateSelect3" :options="options.timeSel" />
              </n-form-item>
              <n-form-item label="日期选择：" path="inputValue">
                <n-date-picker
                  v-model:value="searchForm.selectTime"
                  type="daterange"
                  class="full-w"
                />
              </n-form-item>
            </div>
            <div style="width: 62px" ml-40>
              <n-button type="primary" @click="getData3">查询</n-button>
            </div>
          </header> -->

        <main class="mt-18">
          <n-grid x-gap="16" :cols="4">
            <n-gi>
              <div class="flex just-c align-c my-card2 pl-20 pr-20 mt-26 mb-30">
                <div class="flex-v">
                  <div class="mb-14 mt-14 font-size-14 black-6">总订单款（元）</div>
                  <span class="font-size-36 black-8">{{ d3?.totalAmount }}</span>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-c align-c my-card2 pl-20 pr-20 mt-26 mb-30">
                <div class="flex-v">
                  <div class="mb-14 mt-14 font-size-14 black-6">已收款（元）</div>
                  <span class="font-size-36 black-8">{{ d3?.payAmount }}</span>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-c align-c my-card2 pl-20 pr-20 mt-26 mb-30">
                <div class="flex-v">
                  <div class="mb-14 mt-14 font-size-14 black-6">未收款（元）</div>
                  <span class="font-size-36 black-8">{{ d3?.unpayAmount }}</span>
                </div>
              </div>
            </n-gi>
            <n-gi>
              <div class="flex just-c align-c my-card2 pl-20 pr-20 mt-26 mb-30">
                <div class="flex-v">
                  <div class="mb-14 mt-14 font-size-14 black-6">坏账款（元）</div>
                  <span class="font-size-36 black-8">{{ d3?.badAmount }}</span>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </main>

        <VChart :option="trendOption" class="h-480 w-full" autoresize />
      </n-card>
    </div>
  </AppPage>
</template>

<script setup>
import { settlementStatus, paymentStatus, orderStatus, formatDate, timeSel,firstDayTimestamp,unique_obj_arr } from '@/utils'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import api from '../api'
import orderApi from '../../order-management/api.js'
import { useUserStore } from '~/src/store'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const show = ref(true)

const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.isAdmin
})

const options = reactive({
  areaName: [],
  timeSel,
  settleStatus: Object.entries(settlementStatus).map((item) => {
    const [value, label] = item
    return {
      label,
      value,
    }
  }),
  payStatus: Object.entries(paymentStatus).map(([value, label]) => {
    return {
      label,
      value,
    }
  }),
  orderStatus: Object.entries(orderStatus).map(([value, label]) => {
    return {
      label,
      value,
    }
  }),
})

const d1 = ref({})
const d2 = ref({})
const d3 = ref({})

function getPercent(num1, num2) {
  num1 = num1 || 0
  num2 = num2 || 0

  if (num1 === 0 || num2 == 0) {
    return '-'
  }

  return ((num1 / num2) * 100).toFixed(0) + '%'
}


const trendOption = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    top: '5%',
    data: ['总订单', '取消订单', '支付订单', '未出账订单', '未支付订单', '坏账订单'],
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '总订单',
      type: 'line',
      data: [],
    },
    {
      name: '取消订单',
      type: 'line',
      data: [],
    },
    {
      name: '支付订单',
      type: 'line',
      data: [],
    },
    {
      name: '未出账订单',
      type: 'line',
      data: [],
    },
    {
      name: '未支付订单',
      type: 'line',
      data: [],
    },
    {
      name: '坏账订单',
      type: 'line',
      data: [],
    },
  ],
})

const searchForm = reactive({
  dateSelect1: 2,
  dateSelect2: 2,
  dateSelect3: 2,
  areaNames1: undefined,
  areaNames2: undefined,
  areaNames3: undefined,
  selectTime: [firstDayTimestamp, Date.now()],
})

const p1 = computed(() => {
  console.error('p1-computed')
  let areaNames = searchForm.areaNames1 ? [searchForm.areaNames1] : null
  let p = {
    areaNames,
    dateSelect: searchForm.dateSelect1,
  }
  if (searchForm.serviceName1 !== '全部' && searchForm.areaNames1 == '全部') {
    const index = options?.serviceName0?.findIndex((item) => item.roleId == searchForm.serviceName1)
    areaNames = options?.serviceName0[index]?.areaVos?.map((item) => item.areaName)
    p.areaNames = areaNames
  }

  console.log('searchForm.serviceName1 :>> ', searchForm.serviceName1)
  if (searchForm.serviceName1 === '全部' && searchForm.areaNames1 === '全部') {
    p.areaNames = []
    p.isAllAreasSelect = 1
  }

  return p
})
const p2 = computed(() => {
  let areaNames = null
  let p = {
    areaNames: searchForm.areaNames2 ? [searchForm.areaNames2] : null,
    dateSelect: searchForm.dateSelect2,
  }
  if (searchForm.serviceName2 !== '全部' && searchForm.areaNames2 == '全部') {
    const index = options?.serviceName0?.findIndex((item) => item.roleId == searchForm.serviceName2)
    areaNames = options?.serviceName0[index]?.areaVos?.map((item) => item.areaName)
    p.areaNames = areaNames
  }
  console.log('searchForm.serviceName2  :>> ', searchForm.serviceName2 )
  if (searchForm.serviceName2 === '全部' && searchForm.areaNames2 === '全部') {
    p.areaNames = []
    p.isAllAreasSelect = 1
  }

  return p
})
const p3 = computed(() => {
  let areaNames = searchForm.areaNames3 ? [searchForm.areaNames3] : null
  let p = {
    areaNames,
    dateSelect: searchForm.dateSelect3,
    startDate: searchForm.startDate || null,
    endDate: searchForm.endDate || null,
  }
  if (searchForm.serviceName3 !== '全部' && searchForm.areaNames3 == '全部') {
    const index = options?.serviceName0?.findIndex((item) => item.roleId == searchForm.serviceName3)
    areaNames = options?.serviceName0[index]?.areaVos?.map((item) => item.areaName)
    p.areaNames = areaNames
  }

  if (searchForm.serviceName3 === '全部' && searchForm.areaNames3 === '全部') {
    p.areaNames = []
    p.isAllAreasSelect = 1
  }

  return p
})

const getData1 = () => {
  api.findBillManageDataByDay(p1.value).then((res) => {
    d1.value = res.data
  })
}
const getData2 = () => {
  api.findBillManageDataByMonth(p2.value).then((res) => {
    d2.value = res.data
  })
}
const getData3 = () => {
  api.findBillManageDataList(p3.value).then((res) => {
    const data3 = res.data
    d3.value = data3
    const data = data3.detailList.map((item) => item.dateAt)
    trendOption.xAxis[0].data = data
    trendOption.series[0].data = data3.detailList.map((item) => item.totalCount)
    trendOption.series[1].data = data3.detailList.map((item) => item.cancelCount)
    trendOption.series[2].data = data3.detailList.map((item) => item.payCount)
    trendOption.series[3].data = data3.detailList.map((item) => item.unbillCount)
    trendOption.series[4].data = data3.detailList.map((item) => item.unpayCount)
    trendOption.series[5].data = data3.detailList.map((item) => item.badCount)
  })
}

function handleUpdateArea1(v) {
  getData1()
}
function handleUpdateService1(v) {
  searchForm.areaNames1 = '全部'
  getData1()
}

function handleUpdateDate1(v) {
  getData1()
}

function handleUpdateArea2(v) {
  getData2()
}
function handleUpdateService2(v) {
  searchForm.areaNames2 = '全部'
  getData2()
}

function handleUpdateDate2(v) {
  getData2()
}

// ----------------------------------------------------------------------
watch(
  () => searchForm.serviceName1,
  (v) => {
    searchForm.areaNames1 = '全部'
    console.error('p1-watch')
    console.log('v :>> ', v)
    if (!$is0(v)) {
      options.areaNames1 =
        options.serviceName0
          ?.find((item) => item.roleId == searchForm.serviceName1)
          ?.areaVos?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
      options.areaNames1 =  unique_obj_arr(options.areaNames1, 'label')
    }
    if (v === '全部') {
      const obj1 = options.serviceName0?.map((item) => item.areaVos).flat()
      const obj2 = obj1?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
      options.areaNames1 = unique_obj_arr(obj2, 'label')  
    }
    options.areaNames1.unshift({
      label: '全部',
      value: '全部',
    })
  }
)
watch(
  () => searchForm.serviceName2,
  (v) => {
    searchForm.areaNames2 = '全部'

    if (!$is0(v)) {
      options.areaNames2 =
        options.serviceName0
          .find((item) => item.roleId == searchForm.serviceName2)
          ?.areaVos?.map((item) => ({ label: item.areaName, value: item.areaName })) || []

      options.areaNames2 =  unique_obj_arr(options.areaNames2, 'label')
    }
    if (v === '全部') {
      console.log('options.serviceName0 :>> ', options.serviceName0)
      const obj1 = options.serviceName0?.map((item) => item.areaVos).flat()
      const obj2 = obj1?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
      options.areaNames2 = unique_obj_arr(obj2, 'label')  
    }
    options.areaNames2.unshift({
      label: '全部',
      value: '全部',
    })
  }
)
watch(
  () => searchForm.serviceName3,
  (v) => {
    searchForm.areaNames3 = '全部'

    if (!$is0(v)) {
      options.areaNames3 =
        options.serviceName0
          .find((item) => item.roleId == searchForm.serviceName3)
          ?.areaVos?.map((item) => ({ label: item.areaName, value: item.areaName })) || []

      options.areaNames3 =  unique_obj_arr(options.areaNames3, 'label')
    }
    if (v === '全部') {
      console.log('options.serviceName0 :>> ', options.serviceName0)
      const obj1 = options.serviceName0?.map((item) => item.areaVos).flat()
      const obj2 = obj1?.map((item) => ({ label: item.areaName, value: item.areaName })) || []
      options.areaNames3 = unique_obj_arr(obj2, 'label')   
    }
    
    options.areaNames3.unshift({
      label: '全部',
      value: '全部',
    })
  }
)


const checkSelectTime = () => {
  const selectTime = searchForm?.selectTime
  if (selectTime == null) return
  searchForm.startDate = formatDate(selectTime[0])
  searchForm.endDate = formatDate(selectTime[1])
}
checkSelectTime()
watch(
  () => searchForm.selectTime,
  (selectTime) => {
    checkSelectTime()
  }
)

orderApi
  .getServiceArea({
    rId: !userStore.isAdmin ? userStore.userInfo.roleId : null,
  })
  .then(({ data }) => {
    options.serviceName0 = data
    options.serviceName = data.map((item) => {
      return {
        label: item.roleName,
        value: item.roleId,
      }
    })
    options.serviceName.unshift({
      label: '全部',
      value: '全部',
    })
    searchForm.serviceName1 = options.serviceName[0].value
    searchForm.serviceName2 = options.serviceName[0].value
    searchForm.serviceName3 = options.serviceName[0].value

    searchForm.areaNames1 = '全部'
    searchForm.areaNames2 = '全部'
    searchForm.areaNames3 = '全部'
    init()
  })

async function init() {
  const p01 = p1.value
  const p02 = p2.value
  const p03 = p3.value

  const [err, res] = await $to(
    Promise.all([
      api.findBillManageDataByDay(p01),
      api.findBillManageDataByMonth(p02),
      api.findBillManageDataList(p03),
    ])
  )

  if (!err) {
    const [{ data: data1 }, { data: data2 }, { data: data3 }] = res
    d1.value = data1
    d2.value = data2
    d3.value = data3

    const data = data3.detailList.map((item) => item.dateAt)
    trendOption.xAxis[0].data = data
    trendOption.series[0].data = data3.detailList.map((item) => item.totalCount)
    trendOption.series[1].data = data3.detailList.map((item) => item.cancelCount)
    trendOption.series[2].data = data3.detailList.map((item) => item.payCount)
    trendOption.series[3].data = data3.detailList.map((item) => item.unbillCount)
    trendOption.series[4].data = data3.detailList.map((item) => item.unpayCount)
    trendOption.series[5].data = data3.detailList.map((item) => item.badCount)

    show.value = false
  }
}
</script>

<style lang="scss">
.billing-management {
  .percent {
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #00988a;
    line-height: 21px;
  }
  header {
    .n-form-item-label {
    }
  }
  main {
    .my-card {
      background: #f9f9fb;
      border-radius: 4px;
    }
    .my-card2 {
      border-right: 1px solid #f0f0f0;
    }
  }
  .n-form-item {
    display: flex;
    align-items: center;
    label {
      width: 73px;
      margin-right: 10px;
      line-height: 34px;
    }
    .n-form-item-blank {
      flex: 0.8;
      min-width: 162px;
      margin-right: 10px;
    }
  }
}
</style>
