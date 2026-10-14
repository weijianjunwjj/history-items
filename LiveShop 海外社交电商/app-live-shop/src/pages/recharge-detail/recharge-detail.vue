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
  <view class="order-detail-page">
    <!-- 订单状态 -->
    <view class="order-status flex-c">
      <image src="../../static/images/common/done.png" style="width: 80rpx;height: 70rpx;"  />
      <view class="ml-14 ">
        <view class="status-text">Completed</view>
        <view class="status-desc flex-c mt-4">
          <view>Order completed, thank you for using our service.</view>
        </view>
      </view>
    </view>

    <!-- 个人信息 -->
    <view class="person-info" style="margin-top: -60rpx;">
      <wd-card class="rel">
        <template #title>
          <view class="flex-c">
            <image
              src="../../static/images/my-wallet/coin.png/"
              style="width: 60rpx; height: 60rpx"
            />
            <text class="ml-5 fs-60 c-orange">{{ order.coinReceived }}</text>
          </view>
        </template>

        <view class="flex-sb-c">
          <view class="mt-4">total price of the items</view>

          <view>${{ order.rechargeAmount }}</view>
        </view>
      </wd-card>
    </view>

    <!-- 订单编号 -->
    <view class="order-sn">
      <wd-card custom-title-class="p0" custom-footer-class="p0">
        <view class="plr-4 pt-6" style="padding-bottom: 0">
          <view class="flex-sb-c pb-6">
            <label>Order Number</label>
            <span class="flex-sb-c">
              <span class="text ml-2 black">{{ order.orderSn }}</span>
            </span>
          </view>

          <view class="flex-sb-c pb-6">
            <label>Creation Time</label>
            <span class="flex-sb-c">
              <span class="text ml-2 black">{{ order.createdAt }}</span>
            </span>
          </view>

          <view class="flex-sb-c pb-6">
            <label>Payment Time</label>
            <span class="flex-sb-c">
              <span class="text ml-2 black">{{ order.payTime }}</span>
            </span>
          </view>
        </view>
      </wd-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import { rechargeOrderDetail } from '@/service/recharge-record/recharge-record';

const order: any = ref({})

onLoad(async (options) => {
  console.log('options', options)
  if (options.data) {
    const data = JSON.parse(decodeURIComponent(options.data))
    console.log(data) // { name: 'John', age: 25 }
    order.value = data
  }
  if (options.orderSn) {
    const {data}:{data:any}=await rechargeOrderDetail(options.orderSn)
    console.log('data', data)
    order.value=data
  }

})
</script>

<style lang="scss">
page {
  background: #f6f6f6;
}
</style>

<style lang="scss" scoped>

.arrow-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  margin: auto;
}

:deep(.black-btn) {
  background-color: #000 !important;
  color: #fff !important;
}
:deep(.grey-btn) {
  background-color: #dfdfdf !important;
  color: #000 !important;
}

.order-detail-page {
  padding-bottom: 180rpx;
}

.order-status {
  background: #000000;
  padding: 38rpx 62rpx;
  padding-bottom: 78rpx;
  height: calc(288rpx);
  box-sizing: border-box;

  .status-text {
    font-size: 34rpx;
    font-bold: bold;
    color: #fff;
  }

  .status-desc {
    font-size: 28rpx;
    color: #c9e4dd;
  }
}
</style>
