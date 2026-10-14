<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '确认支付',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="confirmPayment">
    <view class="payOrderContentBox">
      <view class="productInfomation">
        <view class="shopgoods_img">
          <image :src="detail.activity?.reward[0]" class="shopgoodsImg" />
        </view>
        <view class="shopgoods_content">
          <p class="shop_title">{{ detail.activity?.name }}</p>
          <view class="shop_desc">
            <view class="flex_cn">
              <image src="/static/images/shop/integralIcon.png" alt="" class="shop_desctextIconimg" />
              {{ detail.activity?.integral }} +
              <image src="/static/images/shop/coinIcon.png" alt="" class="shop_desctextIconimg"
                style="margin-left: 5rpx" />
              {{ detail.activity?.coin }}
            </view>
            <p>数量：x{{ detail.activity?.num }}</p>
            <!-- <wd-input-number
              v-model="shopValue"
              @change="handleShopValueChange"
              disabled
              custom-class="wdCustomInputNumClass"
              input-width="80rpx"
            /> -->
          </view>
        </view>
      </view>

      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">商品单价</p>
          <view class="flex_cn">
            <image src="/static/images/shop/integralIcon.png" class="textIconimg" />
            {{ detail.activity?.integral }}+
            <image src="/static/images/shop/coinIcon.png" class="textIconimg" style="margin-left: 5rpx" />
            {{ detail.activity?.coin }}
          </view>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">运费</p>
          <view class="flex_cn">
            <image src="/static/images/shop/coinIcon.png" class="textIconimg" style="margin-left: 5rpx" />
            {{ detail.shippingFreight }}
          </view>
        </view>
      </view>

      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">订单编号</p>
          <p class="proprig_labelValue">{{ detail.orderSn }}</p>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">创建时间</p>
          <p class="proprig_labelValue">{{ detail.createdAt }}</p>
        </view>
      </view>
      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">地址</p>
          <p class="proprig_labelValue" @click="onOpenSelectAdressEvent">
            请选择收货地址
            <wd-icon name="arrow-right" size="20px" color="#959595"></wd-icon>
          </p>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">优惠券</p>
          <p class="proprig_labelValue">
            暂无优惠券
            <wd-icon name="arrow-right" size="20px" color="#959595"></wd-icon>
          </p>
        </view>
      </view>
      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">合计</p>
          <view class="flex_cn">
            <image src="/static/images/shop/integralIcon.png" class="textIconimg" />
            {{ detail.paiedIntegral }} +
            <image src="/static/images/shop/coinIcon.png" class="textIconimg" style="margin-left: 5rpx" />
            {{ detail.paiedCoin }}
          </view>
        </view>
      </view>
    </view>
    <wd-button custom-class="confirPayBtn" @click="onhandlePayorder">立即支付</wd-button>
    <payMentPopup :visible="payTypeShow" :payDate="{
      coin: 300,
      integral: 5000,
    }" @cancel="onPayMentClosePopup" @confirm="onPayMentConfirm" />
    <selectAddress v-model:visible="addressSelectShow" @cancel="onAddressSelectClosePopup"
                   @confirm="onAddressSelectConfirm"/>
  </view>
</template>

<script lang="ts" setup>
import {orderPay} from '@/service/group'
import payMentPopup from '@/components/payMentPopup/payMentPopup.vue'
import selectAddress from '@/components/selectAddress/selectAddress.vue'
import {getOrderDetail} from '@/service/order/order'


const shopValue = ref<number>(1)
const payTypeShow = ref(false)
const currentPayType = ref<number>(1)

const detail: any = ref({})

async function onhandlePayorder () {
  //   await orderPay({
  //     orderSn: detail.orderSn,
  //   })

  payTypeShow.value = true
}

function onChangePaymentStatus (key: number) {
  currentPayType.value = key
}

async function onSureSelectPay () {
  payTypeShow.value = false
  console.log('确认选择')
}

// 商品数量加减
function handleShopValueChange ({ value }) {
  console.log(value)
}

function onPayMentConfirm (payType: number) {
  orderPay({
    orderSn: detail.value.orderSn,
  }).then((res) => {
    if (res.code === 0) {
      payTypeShow.value = false
      uni.navigateTo({
        url: '/pages/paymentResult/paymentResult?orderSn=' + detail.value.orderSn,
      })
    }
  })
}
function onPayMentClosePopup () {
  payTypeShow.value = false
}

// 收货地址选择
const addressSelectShow = ref(false)

function onOpenSelectAdressEvent () {
  addressSelectShow.value = true
}

function onAddressSelectClosePopup () {
  addressSelectShow.value = false
}
function onAddressSelectConfirm (rows: any) {
  console.log('当前选择地址数据：', rows)
  addressSelectShow.value = false
}

onLoad(async (optios) => {
  console.log(optios)
  const { orderSn } = optios
  const res: any = await getOrderDetail({ orderSn })
  console.log('res', res)
  res.data.orderSn = orderSn
  detail.value = res.data

  console.log('detail.value', detail.value)
})


</script>

<style lang="scss" scoped>
@import './confirmPayment';
</style>
