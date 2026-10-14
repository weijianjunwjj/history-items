<route lang="json5">
  {
    style: {
      navigationBarTitleText: 'Details',
      enablePullDownRefresh: false,
      navigationBarBackgroundColor: '#ffffff',
    },
  }
  </route>

  <template>
    <view class="wallet-detail">
      <header>
        <view class="content txt-c head-card">
          <view class="fs-24 added-consumed">Wallet Balance</view>
          <view class="fs-64 mt-6 amount-bold">{{ amountToLoaString }}</view>
          <view class="fs-20 mt-12">
            <text class="added-consumed">Added Today：{{ detail.incrToday }}</text>
            <text class="ml-6 added-consumed">Consumed Today：{{ detail.decrToday }}</text>
          </view>
        </view>
      </header>
      <main>
        <view class="flex-c my-datetime-box">
          <text class="fs-32" style="color: #404040;font-weight: 500;margin-left: 11px;">Income And Expense</text>
          <wd-datetime-picker
            type="date"
            v-model="ymd"
            class="my-datatime"
            custom-label-class="my-datatime-label"
            custom-value-class="my-datatime-value"
            placeholder="please select"
            @confirm="handleConfirm"
            :maxDate="curDate"
          />
        </view>

        <view style="height: calc(100vh - 500rpx);">
          <Card v-if="!list.length" style="height: 100%;">
            <Empty />
          </Card>
          <Card class="p0" v-else style="height: 100%;">
            <scroll-view scroll-y="true" @scrolltolower="nextPage">
              <view class="list-item p-6 flex-sb-c" v-for="(item, index) in list" :key="index">
              <view>
                <view class="c-31 fs-28" style="font-weight: 500;">{{ sourceMap[item.source] }}</view>
                <view class="mt-3 fs-20" style="font-weight: 400;color: #959595;">{{ item.rechargeTime }}</view>
              </view>
              <view class="c-orange txt-font" v-if="item.type == 1">+{{ item.quantity }}</view>
              <view class="c-red txt-font" v-else>-{{ item.quantity }}</view>
            </view>
            </scroll-view>
          </Card>
        </view>
      </main>
    </view>
  </template>

  <script setup lang="ts">
  import { getUserCoinIndex } from '@/service/wallet-detail/wallet-detail'
  import dayjs from 'dayjs'
  import Empty from '@/components/Empty/Empty.vue'

  const list = ref([])
  const curDate=(new Date()).getTime()
  const page = ref(1)
  const canNext = ref(false)

  const ymd = ref<number>(curDate)
  const detail: any = ref({})
  let amountToLoaString = ref('')
  let maxDateNum = ref(0)

  const sourceMap=reactive({
    1:'Recharge',
    2:'Refund',
    3:'Refund',
    4:'Chat',
    5:'Product Exchange',
    6:'Activity Exchange',
  })

  function handleConfirm({ value }) {
    const formattedDate = dayjs(value).format('YYYY-MM-DD')
    list.value = []
    query(formattedDate)
  }
  const formateDate = (date: any) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  const nextPage = () => {
    if (canNext.value) {
      query()
    }
  }

  async function query(formattedDate?) {
    const date = formattedDate || formateDate(ymd.value)
    const res: any = await getUserCoinIndex({ 
      date:date,
      pageSize: 10,
      page: page.value
     })
    list.value = [...list.value, ...res.data.list]

    if (list.value.length == 10 || page.value * 10 < res.data.count) {
      canNext.value = true
      page.value++
    } else {
      canNext.value = false
    }

    detail.value = res.data
    amountToLoaString.value = res.data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onMounted(async () => {
    query()
  })
  </script>

  <style lang="scss" scoped>
  @import './index.scss';
  </style>
