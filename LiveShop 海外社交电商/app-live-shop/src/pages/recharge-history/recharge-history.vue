<route lang="json5">
{
  style: {
    navigationBarTitleText: 'History',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <div class="recharge-record">
    <view class="lists mlr-6">
      <template v-if="list.length">
        <view class="list mtb-4" v-for="(item, index) in list" :key="index">
          <view class="flex-sb-c" style="font-size: 28rpx">
            <text class="c-95 fs-28">
              Number:
              <text class="order-sn">{{ item.orderSn }}</text>
            </text>
            <text class="fs-28">Completed</text>
          </view>
          <view class="mt-8 flex-sb-c">
            <view class="flex-c">
              <image
                src="@img/my-wallet/coin.png"
                mode="scaleToFill"
                style="width: 72rpx; height: 72rpx"
              />

              <view class="ml-6">
                <view style="font-size: 32rpx">{{ item.levelName }}</view>
                <view class="c-orange mt-3 c-xtip">
                  <span class="x-symbol">x</span>
                  {{ item.coinReceived }}
                </view>
              </view>
            </view>
            <view class="c-orange">${{ item.paiedAmount }}</view>
          </view>
          <view class="flex-sb-c mt-8 mb-2 mar-top">
            <view
              class="flex-c"
              :class="
                getTimeDifference(item.createdAt, item.payTime) == '00:00' ? 'count-down-show' : ''
              "
            >
              <image src="@/static/images/order/clock.png" style="width: 27rpx; height: 27rpx" />
              <text class="ml-3 c-95">{{ getTimeDifference(item.createdAt, item.payTime) }}</text>
            </view>

            <view>
              <wd-button
                plain
                hairline
                type="info"
                size="small"
                style="color: #959595"
                @click="toDetail(item)"
              >
                Details
              </wd-button>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <Empty />
      </template>
    </view>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getRechargeOrderIndex } from '@/service/recharge-record/recharge-record'
import { toPage,getUrl } from '@/utils/utils'
import Empty from '@/components/Empty/Empty.vue'

dayjs.extend(duration)

function getTimeDifference(startTime, endTime) {
  const start = dayjs(startTime)
  const end = dayjs(endTime)

  // 计算时间差，以毫秒为单位
  const diffInMillis = end.diff(start)

  // 将差值转换为小时和分钟
  const diffDuration = dayjs.duration(diffInMillis)
  const hours = diffDuration.hours()
  const minutes = diffDuration.minutes()

  // 格式化成 xx:xx 的格式
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const pages = reactive({
  page: 1,
  pageSize: 10,
})

const list = ref([])

async function query() {
  const res: any = await getRechargeOrderIndex({ ...pages })
  console.log('res', res)
  list.value = res.data.list
}

function toDetail(item) {
  console.log('item', item)
  toPage('/pages/recharge-detail/recharge-detail', item)
}

onMounted(() => {
  query()
})
</script>

<style lang="scss">
page {
  background: #f6f6f6;
}
.recharge-record {
  .list {
    background: #fff;
    padding: 20rpx;
  }
  .order-sn {
    margin-left: 8rpx;
  }
  .c-xtip {
    color: #707070;
    font-size: 22rpx;
    margin-top: 6rpx !important;
    .x-symbol {
      font-size: 28rpx;
      font-weight: 400;
      margin-right: 2rpx;
    }
  }
  .count-down-show {
    visibility: hidden;
  }
}
</style>
<style lang="scss" scoped>
:deep(.uni-page-head__title) {
  font-size: 32rpx;
  font-weight: 500 !important;
}
.mar-top {
  margin-top: 30rpx !important;
}
</style>
