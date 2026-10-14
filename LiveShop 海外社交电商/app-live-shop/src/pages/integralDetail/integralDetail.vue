<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Points Details',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="integralDetailContainer">
    <view class="integralHeadUserInfo">
      <view class="headUserContent flex">
        <p class="headUserContent-titleLabel">Points Account Balance</p>
        <p class="headUserContent-integralNum">{{ convertMoney(userDateNum.total) }}</p>
        <p class="headUserContent-integralTotal">
          <span>Added Today：{{ userDateNum.incrToday }}</span>
          <span>Consumed Today：{{ userDateNum.decrToday }}</span>
        </p>
      </view>
    </view>

    <view class="integralTabsBox">
      <view class="tabsContentBox">
        <wd-tabs
          v-model="productTabValue"
          @click="handlewdTabClick"
          color="#404040"
          inactiveColor="#404040"
        >
          <wd-tab title="All" name="all"></wd-tab>
          <wd-tab title="Add" name="add"></wd-tab>
          <wd-tab title="Consume" name="cut"></wd-tab>
        </wd-tabs>
      </view>
    </view>

    <view class="wdTabContentBox">
      <scroll-view
        :scroll-top="0"
        :scroll-y="true"
        class="scroll-Y"
        :refresher-threshold="40"
        :refresher-enabled="isLoadingTop"
        :refresher-triggered="isTriggeredTop"
        @scrolltolower="handelLower"
        @refresherrefresh="handleRefresher"
      >
        <view class="integralItemBox">
          <!-- <view class="no-data-avail" v-if="integralTableList.length <= 0">
            <image
              src="../../static/images/integralDetail/No-data-available.png"
              mode="scaleToFill"
              class="no-data-img"
            />
          </view> -->
          <Empty v-if="integralTableList.length <= 0" />
          <view class="flex itemsInfoContent" v-for="item in integralTableList" :key="item.id">
            <view class="itemsLeft flex">
              <p>
                {{
                  {
                    1: 'Daily Attendance',
                    2: 'Greet Sb',
                    3: 'Thumbs Up',
                    4: 'Discuss',
                    5: 'Commodity Exchange',
                    6: 'Send Back',
                    7: 'Participate Activities',
                    8: 'Be Commented',
                    9: 'Be Liked',
                    10: 'Release Dynamic',
                  }[item.source]
                }}
              </p>
              <p>{{ item.createdAt }}</p>
            </view>
            <view :class="['itemsRight', { add: item.type == 1, cut: item.type == 2 }]">
              {{ item.type == 1 ? '+' : '-' }}
              {{ item.quantity }}
            </view>
          </view>
          <!-- <wd-loadmore
            custom-class="loadmore"
            :state="state"
            error-text="Network loading error, please try again later"
            loading-text="loading"
            finished-text="loading completed"
          /> -->
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getIntegralIndex } from '@/service/order/order'
import { convertMoney } from '@/utils/utils'
import Empty from '@/components/Empty/Empty.vue'

const productTabValue = ref('all')
const type = ref(null)
const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const state = ref('loading')
const isTriggeredTop = ref(false)
const isLoadingTop = ref(true)
const totalCount = ref(0)
const integralTableList = ref([])
const userDateNum = ref({
  total: '',
  incrToday: '',
  decrToday: '',
})

function handlewdTabClick(e: any) {
  if (e.index !== 0) {
    type.value = e.index
  } else {
    type.value = null
  }
  pageBody.page = 1
  integralTableList.value = []
  getIntergralList()
}

function handelLower() {
  if (integralTableList.value.length >= totalCount.value) return
  pageBody.page += 1
  getIntergralList()
}
async function handleRefresher() {
  isTriggeredTop.value = true
  pageBody.page = 1
  integralTableList.value = []
  await getIntergralList()
  setTimeout(() => {
    isTriggeredTop.value = false
  }, 1000)
}

const getIntergralList = () => {
  getIntegralIndex({ ...pageBody, type: type.value })
    .then((res: any) => {
      if (res.code === 0) {
        integralTableList.value = [...integralTableList.value, ...res.data.list]
        totalCount.value = res.data.count
        state.value = integralTableList.value.length === totalCount.value ? 'finished' : 'loading'
        userDateNum.value.total = res.data.total
        userDateNum.value.decrToday = res.data.decrToday
        userDateNum.value.incrToday = res.data.incrToday
      }
    })
    .catch((err) => {
      state.value = 'error'
    })
}
onLoad(() => {
  getIntergralList()
})

onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<style>
page{
  background: #f6f6f6;
}
</style>

<style lang="scss" scoped>

:deep(uni-page-body) {
  height: 100%;
}
:deep(.wot-theme-light) {
  height: 100%;
}
.integralDetailContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .integralHeadUserInfo {
    box-sizing: border-box;
    padding: 18rpx 32rpx;
    .headUserContent {
      padding-top:43px;
      padding-bottom: 20px;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #0b0b0b;
      border-radius: 40rpx;
      &-titleLabel {
        font-size: 26rpx;
        font-weight: 400;
        color: #ffffff;
      }
      &-integralNum {
        margin-top: 30rpx;
        margin-bottom: 50rpx;
        font-size: 64rpx;
        font-weight: 800;
        color: #ffffff;
      }
      &-integralTotal {
        font-size: 24rpx;
        font-weight: 400;
        color: #ffffff;
        span {
          margin-right: 30rpx;
        }
      }
    }
  }
  .integralTabsBox {
    box-sizing: border-box;
    padding: 18rpx 32rpx;
    .tabsContentBox {
      width: 100%;
      height: 100%;
      height: 92rpx;
      background: #ffffff;
      border-radius: 92rpx;
      :deep(.wd-tabs) {
        background: none;
        .wd-tabs__nav {
          background: none;
        }
        .wd-tabs__line {
          background: #00dba1;
        }
      }
    }
  }
  .wdTabContentBox {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 340rpx - 92rpx - 36rpx);
    padding: 0 32rpx;

    .scroll-Y {
      width: 100%;
      // height: 100%;
      height: calc(100vh - 340rpx - 92rpx - 36rpx);
      background: #fff;
      border-top-left-radius: 16rpx;
      border-top-right-radius: 16rpx;
      padding-bottom: 50rpx;
      .integralItemBox {
        background: #fff;
        height: 100%;
        box-sizing: border-box;
        padding-top: 28rpx;
        padding-left: 32rpx;
        padding-right: 32rpx;
        padding-bottom: 20rpx;
        .no-data-avail {
          display: flex;
          justify-content: center;
          .no-data-img {
            width: 420rpx;
            height: 290rpx;
            margin-top: 200rpx;
          }
        }
        .itemsInfoContent {
          box-sizing: border-box;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20rpx;
          margin-bottom: 20rpx;
          border-bottom: 1rpx solid RGBA(219, 219, 219, 0.3);
          &:last-child {
            border: none;
          }
          .itemsLeft {
            flex-direction: column;
            p:first-child {
              margin-bottom: 5rpx;
              font-size: 28rpx;
              font-weight: 500;
              color: #404040;
            }
            p:last-child {
              font-size: 20rpx;
              font-weight: 300;
              color: #404040;
            }
          }
          .itemsRight {
            font-size: 40rpx;
            font-weight: 800;
            color: #333333;
          }
          .add {
            color: #fba345;
          }
          .cut {
            color: #ff2929;
          }
        }
      }
    }
  }
}
</style>
