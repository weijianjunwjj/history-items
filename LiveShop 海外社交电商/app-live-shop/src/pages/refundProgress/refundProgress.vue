<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Refund Progress',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="refundProgressMajor">
    <view class="refundProgressMajor_contenter">
      <view class="refundItemsgroupContent">
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Refund Amount</p>
          <view class="flex_cn">
            <image
              src="/static/images/shop/coinIcon.svg"
              class="coinIconImg"
              style="margin-left: 5rpx"
            />
            {{ totalCoin - order.shippingFreight }}
          </view>
        </view>
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Refund Shipping Fees</p>
          <view class="flex_cn">
            <image
              src="/static/images/shop/coinIcon.svg"
              class="coinIconImg"
              style="margin-left: 5rpx"
            />
            {{ order.shippingFreight }}
          </view>
        </view>

        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Return Points</p>
          <view class="flex_cn">
            <image src="/static/images/shop/integralIcon.svg" class="iconImg" />
            {{ totalIntegral }}
          </view>
        </view>
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Total Refund</p>
          <view class="flex_cn">
            <view v-if="totalIntegral > 0">
              <image src="/static/images/shop/integralIcon.svg" class="iconImg" />{{ totalIntegral }}+
            </view>
            <image
              src="/static/images/shop/coinIcon.svg"
              class="coinIconImg"
              style="margin-left: 5rpx"
            />
            {{ totalCoinAndF }}
          </view>
        </view>
      </view>

      <view class="refundItemsgroupContent">
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Order Number</p>
          <p class="proprig_labelValue">{{ order.orderSn }}</p>
        </view>
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone">
          <p class="proprig_label">Refund Request Date</p>
          <p class="proprig_labelValue">{{ order.refundApplyTime }}</p>
        </view>
        <view
          class="flex_cn_bw refundItemsgroupContent-itemsLone"
          v-if="order.refundStatus === 1 && order.refundDoneTime"
        >
          <p class="proprig_label">Review Time</p>
          <p class="proprig_labelValue">{{ order.refundDoneTime }}</p>
        </view>
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone" v-if="order.refundStatus === 2">
          <p class="proprig_label">Review Time</p>
          <p class="proprig_labelValue">{{ order.refundDoneTime }}</p>
        </view>
        <view class="flex_cn_bw refundItemsgroupContent-itemsLone" v-if="order.refundStatus === 3">
          <p class="proprig_label">Rejection Time</p>
          <p class="proprig_labelValue">{{ order.refundDoneTime }}</p>
        </view>
      </view>

      <view class="refundItemsgroupContent" v-if="order.refundReason">
        <view class="refundItemsgroupContent-itemsLone">
          <p class="refundDetailTitle">Reason</p>
          <view class="refundDetailTexts">
            {{ order.refundReason }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {getOrderDetail} from '@/service/order/order'
import {isEmpty} from '@/utils/utils'

const _orderSn = ref()
const order: any = ref({})
const goodsValue = ref<number>(1)
onLoad((options) => {
  const { orderSn } = options
  _orderSn.value = orderSn
})

const queryOrder = async () => {
  const res = await getOrderDetail({ orderSn: _orderSn.value })
  if (!isEmpty(res.data)) {
    order.value = res.data
    goodsValue.value = order.value.orderGoods?.[0]?.num || 0
  }
}

const totalCoin = computed(() => {
  const _order = order.value
  return _order.paiedCoin * goodsValue.value
})
const totalCoinAndF = computed(() => {
  const _order = order.value
  return _order.shippingFreight + (_order.paiedCoin - _order.shippingFreight) * goodsValue.value
})
const totalIntegral = computed(() => {
  const _order = order.value
  return _order.paiedIntegral * goodsValue.value
})

onMounted(async () => {
  queryOrder()
})
</script>

<style lang="scss" scoped>
@import './refundProgress.scss';
</style>
