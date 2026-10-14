<route lang="json5" type="page">
{
style: {
navigationBarTitleText: 'Confirm the order',
enablePullDownRefresh: false,
navigationBarBackgroundColor: '#ffffff',
},
}
</route>

<template>
  <view class="checkVerifyOrder">
    <view v-if="orderInfo.orderStatus === 0" class="flexAlign checkVerifyOrder_top">
      <view>
        <image class="resultSuccessImg" src="/static/images/order/checkVerifyIcon.png"/>
      </view>
      <view class="resultRig_text">
        <p>Check the order</p>
        <p>Please check order details carefully</p>
      </view>
    </view>
    <view v-else class="flexAlign checkVerifyOrder_top">
      <view>
        <image :src="getStatusImageUrl(orderInfo.orderStatus)" class="resultSuccessImg"/>
      </view>
      <view class="resultRig_text">
        <p>{{ orderStatusEnglish[orderInfo.orderStatus] }}</p>
        <p>{{ orderDescEnglish[orderInfo.orderStatus] }}</p>
      </view>
    </view>

    <view class="payOrderContentBox localtionAloneBox">
      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">
            <image class="locationAddressImg" src="/static/images/order/localtionIcon.png"/>
            Address
          </p>
          <p class="proprig_labelValue" @click="onOpenSelectAdressEvent">
            {{ currentAddressDetail?.stateName }} {{ currentAddressDetail?.cityName }}
            <wd-icon color="#959595" name="arrow-right" size="20px"></wd-icon>
          </p>
        </view>
      </view>
    </view>

    <view class="payOrderContentBox">
      <view class="productInfomation">
        <view class="shopgoods_img">
          <image v-if="detail?.reward" :src="getUrl(detail?.reward[0])" class="shopgoodsImg"/>
        </view>
        <view class="shopgoods_content">
          <p class="shop_title">{{ detail.name }}</p>
          <view class="shop_desc">
            <view class="flex_cn">
              <template v-if="detail.ruleType == 1">
                <image
                  alt=""
                  class="shop_descCoinIconimg"
                  src="/static/images/shop/coinIcon.svg"
                  style="margin-left: 5rpx"
                />
                {{ detail.coin }}
              </template>
              <template v-if="detail.ruleType == 2">
                <image
                  alt=""
                  class="shop_desctextIconimg"
                  src="/static/images/shop/integralIcon.svg"
                />
                {{ detail.integral }}
              </template>

              <template v-if="detail.ruleType == 3">
                <image
                  alt=""
                  class="shop_desctextIconimg"
                  src="/static/images/shop/integralIcon.svg"
                />
                {{ detail.integral }}+
                <image
                  alt=""
                  class="shop_descCoinIconimg"
                  src="/static/images/shop/coinIcon.svg"
                  style="margin-left: 5rpx"
                />
                {{ detail.coin }}
              </template>
            </view>

            <wd-input-number
              v-if="orderInfo.orderStatus === 0"
              v-model="shopValue"
              custom-class="wdCustomInputNumClass"
              input-width="80rpx"
            />
            <view v-else>x{{ shopValue }}</view>
          </view>
        </view>
      </view>

      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Product Price</p>
          <view class="flex_cn">
            <template v-if="detail.ruleType == 1">
              <image
                alt=""
                class="textCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
                style="margin-left: 5rpx"
              />
              {{ detail.coin }}
            </template>
            <template v-if="detail.ruleType == 2">
              <image alt="" class="textIconimg" src="/static/images/shop/integralIcon.svg"/>
              {{ detail.integral }}
            </template>

            <template v-if="detail.ruleType == 3">
              <image alt="" class="textIconimg" src="/static/images/shop/integralIcon.svg"/>
              {{ detail.integral }}+
              <image
                alt=""
                class="textCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
                style="margin-left: 5rpx"
              />
              {{ detail.coin }}
            </template>
          </view>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Shipping Fee</p>
          <view class="flex_cn">
            <image
              class="textCoinIconimg"
              src="/static/images/shop/coinIcon.svg"
              style="margin-left: 5rpx"
            />
            {{ detail.freight }}
          </view>
        </view>

        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Points</p>
          <view class="flex_cn">
            <template v-if="detail.ruleType != 1">-{{ detail.integral }}</template>
            <template v-else>0</template>
          </view>
        </view>
      </view>
      <view class="productPricesGroups">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Coupon</p>
          <p class="proprig_labelValue">
            No coupons available
            <wd-icon color="#959595" name="arrow-right" size="20px"></wd-icon>
          </p>
        </view>
      </view>
      <view v-if="Object.keys(orderInfo.order).length" class="productPricesGroups order-info-area">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Order Number</p>
          <view class="proprig_labelValue">
            {{ orderInfo.order.orderSn }}
          </view>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Creation Time</p>
          <view class="proprig_labelValue">
            {{ orderInfo.order.createdAt }}
          </view>
        </view>
      </view>
    </view>

    <view class="confirmShopOrder_bottombtnbox">
      <view class="speciBotLeftmoney">
        <view style="font-size: 28rpx;color:#313131;">
          Amount Due:
        </view>
        <template v-if="detail.ruleType == 1">
          <image
            alt=""
            class="coinIconimg"
            src="/static/images/shop/coinIcon.svg"
          />{{ detail.coin * shopValue + +detail.freight }}
        </template>
        <template v-else>
          <image alt="" class="specimoneyIconimg" style="margin-bottom: 4px;" src="/static/images/shop/integralIcon.svg"/>{{ detail.integral * shopValue }}
          <span style="font-size: 26px;">+ </span>
          <image alt="" class="coinIconimg" src="/static/images/shop/coinIcon.svg"/>{{ detail.coin * shopValue + detail.freight }}
        </template>
      </view>
      <view style="flex: 1"/>
      <wd-button custom-class="specipopSureBtn" @click="handleSubmit">
        {{ orderInfo.orderStatus === 0 ? 'Submit' : 'Pay' }}
      </wd-button>
      <wd-message-box/>
    </view>

    <payMentPopup
      :payDate="{
        coin: detail.coin * shopValue,
        freight: detail.freight,
        integral: detail.integral * shopValue,
        proportion:detail.coin !==0 &&  detail.integral !==0 ?detail.coin / detail.integral:1,
      }"
      :ruleType="detail.ruleType"
      :visible="payTypeShow"
      @cancel="onPayMentClosePopup"
      @confirm="onPayMentConfirm"
    />
    <selectAddress
      :visible="addressSelectShow"
      @cancel="onAddressSelectClosePopup"
      @cancelDefault="onAddressDefaultDate"
      @confirm="onAddressSelectConfirm"
    />
  </view>
</template>

<script lang="ts" setup>
import {createOrderGroup, getGroupActivityDetail, orderPay} from '@/service/group' //拼团
import {createOrderCrowd, getCrowdActivityDetail} from '@/service/crow/crow' //众筹
import payMentPopup from '@/components/payMentPopup/payMentPopup.vue'
import selectAddress from '@/components/selectAddress/selectAddress.vue'
import {useToast} from 'wot-design-uni'
import {getUrl} from '@/utils/utils'
import {getStatusImageUrl, orderStatusEnglish} from '@/utils/state'
import {getOrderDetail} from '@/service/order/order'

const pageFlag = ref('1') // 1拼团 2众筹
const toast = useToast()
const shopValue = ref<number>(1)
const payTypeShow = ref(false)
const detail: any = ref({})
const currentAddressId = ref()
const currentAddressDetail = ref()
const detailOrderSn = ref<any>('')
const orderInfo = reactive({
  orderStatus: 0,
  order: {},
  orderSn: '',
})
const orderDescEnglish = ref({
  1: 'Order is about to be completed,ready for pickup.',
  2: 'Order completed,thank you for using our service.',
  3: 'Order refund has been completed.',
  4: 'refund application',
  5: 'refund request not approved.',
  6: '',
  7: '',
})
// 下单后查看订单详情，用于补充下单页面缺失的流程

const handleSubmit = async () => {
  const status = orderInfo.orderStatus
  if (status === 0) {
    try {
      const params = {
        activityId: detail.value.id,
        activityNum: shopValue.value,
        addressId: currentAddressId.value,
      }
      let res
      if (pageFlag.value === '1') {
        res = await createOrderGroup(params)
      } else {
        res = await createOrderCrowd(params)
      }
      const {data} = res
      detailOrderSn.value = data
      const {
        code: detailCode,
        data: detailData,
        msg: detailMessage,
      } = await getOrderDetail({orderSn: data})
      if (detailCode === 0) {
        orderInfo.orderStatus = detailData.orderStatus
        orderInfo.order = detailData
      } else {
        throw detailMessage
      }
    } catch (e) {
      console.error('下单失败了：', e)
    }
  } else {
    payTypeShow.value = true
  }
}

async function onPayMentConfirm(payType: number) {
  console.log('ssssss')
  orderPay({
    orderSn: detailOrderSn.value,
    type: payType,
  }).then((res) => {
    console.log(res)
    if (res.code === 0) {
      payTypeShow.value = false
      uni.navigateTo({
        url: '/pages/paymentResult/paymentResult?orderSn=' + detailOrderSn.value,
      })
    }
  })
}

function onPayMentClosePopup() {
  payTypeShow.value = false
}

// 收货地址选择
const addressSelectShow = ref(false)

function onOpenSelectAdressEvent() {
  addressSelectShow.value = true
}

function onAddressSelectClosePopup() {
  addressSelectShow.value = false
}

function onAddressSelectConfirm(rows: any, items: any) {
  currentAddressDetail.value = items
  currentAddressId.value = items.id
  addressSelectShow.value = false
}

function onAddressDefaultDate(rows: any) {
  currentAddressDetail.value = rows
  currentAddressId.value = rows.id
}

onLoad(async (optios) => {
  const {id, pageflag} = optios
  pageFlag.value = pageflag

  if (pageFlag.value === '1') {
    //拼团
    const res: any = await getGroupActivityDetail({id: +id})
    detail.value = res.data
  } else {
    // 众筹
    const res: any = await getCrowdActivityDetail({id: +id})
    detail.value = res.data
    console.log('众筹', detail.value)
  }

  //   const { orderSn } = optios
  //   const res: any = await getOrderDetail({ orderSn })
  //   res.data.orderSn = orderSn
  //   detail.value = res.data
})
</script>

<style lang="scss" scoped>
@import './checkVerifyOrder.scss';
</style>
