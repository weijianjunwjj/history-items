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
  <view class="confirmShopOrder">
    <view class="confirmShopOrder-status flex-c">
      <image
        :src="getStatusImageUrl(orderInfo.orderStatus)"
        mode="widthFix"
        style="width: 108rpx"
      />
      <view class="ml-14">
        <view class="status-text">{{ orderStatusEnglish[orderInfo.orderStatus] }}</view>
        <view class="mt-2 status-desc flex-c">
          <template v-if="orderInfo.orderStatus === 6">
            <wd-count-down :time="time" format="mm:ss" @finish="onTimeFinish">
              <template #default="{ current }">
                <span class="c-white mr-1">Orders after</span>
                <view style="display: inline-block;width: 39px;">
                  <span class="status-desc">{{ current.minutes < 10 ? "0" + current.minutes : current.minutes }}</span>
                  <span class="status-desc">:</span>
                  <span class="status-desc">{{ current.seconds < 10 ? "0" + current.seconds : current.seconds }}</span>
                </view>
                <span class="c-white ml-1">will be automatically cancelled</span>
              </template>
            </wd-count-down>
          </template>
          <template v-else-if="orderInfo.orderStatus === 0">
            <wd-count-down :time="time2" format="mm:ss" @finish="onTimeFinish">
              <template #default="{ current }">
                <span class="c-white mr-1">After</span>
                <view style="display: inline-block;width: 39px;">
                  <span class="status-desc">{{ current.minutes < 10 ? "0" + current.minutes : current.minutes }}</span>
                  <span class="status-desc">:</span>
                  <span class="status-desc">{{ current.seconds < 10 ? "0" + current.seconds : current.seconds }}</span>
                </view>
                <span class="c-white ml-1">the order will be automatically canceled.</span>
              </template>
            </wd-count-down>
          </template>
          <template v-else>
            <view>{{ orderDescEnglish[orderInfo.orderStatus] }}</view>
          </template>
        </view>
      </view>
    </view>
    <view class="confirmShopOrder_contenter">
      <view class="confirmShopAddressInfo">
        <view style="width: 26px;">
          <image
            alt=""
            src="@/static/images/order/icon/location.png"
            style="width: 52rpx; height: 52rpx; margin-left: -10rpx"
          />
        </view>
        <view class="addressRightArea">
          <view v-if="!currentAddressDetail" class="emptyAddress">
            <view class="title">Address</view>
            <view class="content">Please add address here.</view>
          </view>
          <view v-else class="addressInfoTextContent">
            <p class="addressDetails">
              {{ currentAddressDetail?.stateName }},
              {{ currentAddressDetail?.cityName }},
              {{ currentAddressDetail?.detail }}
            </p>
            <p style="margin-top: 2px;">{{ currentAddressDetail?.name }}</p><p style="margin-top: 2px;">{{ currentAddressDetail?.phone }}</p>
          </view>
          <view class="flexAlign" @click="onOpenSelectAdressEvent">
            <wd-icon color="#545454" name="arrow-right" size="28px"></wd-icon>
          </view>
        </view>

        <!-- <image src="/static/images/shop/shopConfirmLine.png" class="broderBottomLine" /> -->
      </view>

      <view class="productInfomation">
        <view class="confirmShopLefImgbox">
          <image :src="getUrl(detail.imgurl)" class="shopGoodsImg" mode="widthFix" />
        </view>
        <view class="confirmShopContent">
          <p class="shop_title ellipsis">{{ detail.name }}</p>
          <p class="shop_specil">{{ detail.specVal }}</p>
          <view class="shop_desc">
            <view class="flex_cn">
              <template v-if="detail.ruleType == 1">
                <image
                  alt=""
                  class="shop_desctextCoinIconimg"
                  src="/static/images/shop/coinIcon.svg"
                  style="margin-left: 5rpx"
                />
                <text class="money">{{ detail.coin }}</text>
              </template>
              <template v-if="detail.ruleType == 2">
                <image
                  alt=""
                  class="shop_desctextIconimg"
                  style="width: 32rpx;height: 28rpx;"
                  src="/static/images/shop/integralIcon.svg"
                />
                <text class="money">{{ detail.point }}</text>
              </template>
              <template v-if="detail.ruleType == 3">
                <image
                  alt=""
                  class="shop_desctextIconimg"
                  style="width: 32rpx;height: 28rpx;"
                  src="/static/images/shop/integralIcon.svg"
                />
                <text class="money mr-1">{{ detail.point }}</text>
                +
                <image
                  alt=""
                  class="shop_desctextCoinIconimg"
                  src="/static/images/shop/coinIcon.svg"
                  style="margin-left: 5rpx"
                />
                <text class="money">{{ detail.coin }}</text>
              </template>
            </view>
            <wd-input-number v-if="orderInfo.orderStatus === 0" v-model="goodsValue" />
            <p v-else>X{{ goodsValue }}</p>
          </view>
        </view>
      </view>
      <view class="productPricesGroups productPricesGroups_top_border" style="padding: 20rpx 20rpx 0 20rpx;">
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
              <text class="money">{{ detail.coin }}</text>
            </template>
            <template v-if="detail.ruleType == 2">
              <image alt="" class="textIconimg" style="width: 32rpx;height: 28rpx;" src="/static/images/shop/integralIcon.svg" />
              <text class="money">{{ detail.point }}</text>
            </template>
            <template v-if="detail.ruleType == 3">
              <image alt="" class="textIconimg" style="width: 32rpx;height: 28rpx;" src="/static/images/shop/integralIcon.svg" />
              <text class="money mr-1">{{ detail.point }}</text>
              +
              <image
                alt=""
                class="textCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
                style="margin-left: 5rpx"
              />
              <text class="money">{{ detail.coin }}</text>
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
            <text class="money">{{ detail.freight }}</text>
          </view>
        </view>
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Points</p>
          <view class="flex_cn">
            <template v-if="detail.ruleType != 1">
              -
              <text class="money">{{ detail.point }}</text>
            </template>
            <template v-else>
              <text class="money">0</text>
            </template>
          </view>
        </view>
      </view>
      <view class="productPricesGroups productPricesGroups-marginTop" style="padding: 30rpx 20rpx 20rpx 20rpx;">
        <view class="flex_cn_bw productPricesGroups-itemsLone">
          <p class="proprig_label">Coupon</p>
          <p class="proprig_labelValue">
            No coupons available
            <wd-icon color="#959595" name="arrow-right" size="20px"></wd-icon>
          </p>
        </view>
      </view>
      <view v-if="Object.keys(orderInfo.order).length" class="productPricesGroups order-info-area" style="padding: 30rpx 20rpx 20rpx 20rpx;border-radius: 16rpx;">
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
        <view>
          <span style="font-size: 28rpx">Amount due：</span>
        </view>
        <view>
          <template v-if="detail.ruleType == 1">
            <image
              alt=""
              class="specimoneyCoinIconimg"
              src="/static/images/shop/coinIcon.svg"
              style="margin-left: 5rpx"
            />
            <text class="moneyTxt">
              {{ detail.coin * goodsValue + +detail.freight }}
            </text>
          </template>
          <template v-if="detail.ruleType == 2">
            <view class="flex-c">
              <view class="flex-c mr-1">
                <image alt="" class="specimoneyIconimg" src="/static/images/shop/integralIcon.svg" />
                <text class="moneyTxt">
                  {{ detail.point * goodsValue }}
                </text>
              </view>
              <span  v-if="detail.freight != 0" style="font-size: 24px;"> + </span>
              <view class="flex-c ml-1" v-if="detail.freight != 0">
                <image alt="" class="specimoneyCoinIconimg" src="/static/images/shop/coinIcon.svg" />
                <text class="moneyTxt">
                  {{ detail.coin * goodsValue + +detail.freight }}
                </text>
              </view>
            </view>
          </template>
          <template v-if="detail.ruleType == 3">
            <view class="flex-c">
              <view class="flex-c mr-1">
                <image alt="" class="specimoneyIconimg" src="/static/images/shop/integralIcon.svg" />
                <text class="moneyTxt">
                  {{ detail.point * goodsValue }}
                </text>
              </view>
              +
              <view class="flex-c ml-1">
                <image alt="" class="specimoneyCoinIconimg" src="/static/images/shop/coinIcon.svg" />
                <text class="moneyTxt">
                  {{ detail.coin * goodsValue + +detail.freight }}
                </text>
              </view>
            </view>
          </template>
        </view>
      </view>
      <view style="flex: 1" />
      <wd-button custom-class="specipopSureBtn" @click="onhandlePayorder">
        {{ orderInfo.orderStatus === 0 ? 'Submit' : 'Pay' }}
      </wd-button>
    </view>

    <payMentPopup
      :payDate="{
        coin: detail.coin * goodsValue,
        integral: detail.point * goodsValue,
        freight: detail.freight,
        proportion: proportions,
      }"
      :ruleType="detail.ruleType"
      :visible="payTypeShow"
      @cancel="onPayMentClosePopup"
      @confirm="onPayMentConfirm"
    />
    <selectAddress
      v-model:visible="addressSelectShow"
      @cancel="onAddressSelectClosePopup"
      @confirm="onAddressSelectConfirm"
    />
  </view>
</template>

<script lang="ts" setup>
import { getStatusImageUrl, orderStatusEnglish } from '@/utils/state'
import { orderPay } from '@/service/group'
import { createProductOrder, getProductDetails, getProductDetailsSpec } from '@/service/goods/goods'
import { getAddressList } from '@/service/adress/adress'
import payMentPopup from '@/components/payMentPopup/payMentPopup.vue'
import selectAddress from '@/components/selectAddress/selectAddress.vue'
import { useMessage, useToast } from 'wot-design-uni'
import { autoDecodeURIComponent, getUrl } from '@/utils/utils'
import { getOrderDetail } from '@/service/order/order'

const toast = useToast()

const payTypeShow = ref(false)
const detail: any = ref({})
const currentAddressId = ref()
const currentAddressDetail = ref()
const goodsValue = ref<number>(1)
const allAdressDateList = ref([])
const orderskuId = ref()
const detailOrderSn = ref<any>('')
const messageTip = useMessage()
const proportions = ref<number>(0)
const orderInfo = reactive({
  orderStatus: 0,
  order: {},
  orderSn: '',
})
const orderDesc = ref({
  1: '订单即将完成',
  2: '已完成订单，感谢使用',
  3: '订单退款已完成',
  4: '退款申请',
  5: '退款申请未通过',
  6: '',
  7: '',
  0: '',
})
// const getStatusImageUrl = (status: number) => {
//   const statusMap = {
//     1: 'pending',
//     2: 'pending',
//     3: 'subtract',
//     4: 'subtract',
//     5: 'rejected',
//     6: 'pending-pay',
//     7: 'pending',
//     8: 'pending-shipment',
//     default: 'pending-pay',
//   }

//   const imgId = statusMap[status] || statusMap.default
//   return `/static/images/order/icon/${imgId}.png`
// }

// 取出用户信息
const userInfo = JSON.parse(uni.getStorageSync('userStore'))
const onhandlePayorder = async () => {
  const status = orderInfo.orderStatus
  if (status === 0) {
    const params = {
      productId: +detail.value.id,
      skuNum: +goodsValue.value,
      addressId: +currentAddressId.value,
      skuId: +orderskuId.value,
    }
    try {
      const orderSnRes = await createProductOrder(params) // 创建订单并生成orderSn
      if (orderSnRes.code === 0) {
        // 接口调用成功逻辑
        const data = orderSnRes.data
        orderInfo.orderSn = data
        const {
          code: detailCode,
          data: detailData,
          msg: detailMessage,
        } = await getOrderDetail({ orderSn: data })
        if (detailCode === 0) {
          console.log(detailData)
          orderInfo.orderStatus = detailData.orderStatus
          orderInfo.order = detailData
        } else {
          throw detailMessage
        }
      } else {
        // 失败了要抛出去
        throw orderSnRes.msg
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    // 下单支付功能
    payTypeShow.value = true
  }
}
// async function onhandlePayorder() {
// 	const params = {
// 		productId: +detail.value.id,
// 		skuNum: +goodsValue.value,
// 		addressId: +currentAddressId.value,
// 		skuId: +orderskuId.value,
// 	}
// 	const res = await createProductOrder(params)
// 	if (res.code === 0) {
// 		detailOrderSn.value = res.data
// 		orderInfo.order = res.data
// 		console.log(orderInfo.order)
// 		payTypeShow.value = true
// 	} else {
// 		toast.error(res.msg)
// 	}
// }

async function onPayMentConfirm(payType: number) {
  console.log('支付方式', payType)
  orderPay({
    orderSn: orderInfo.orderSn,
    type: payType,
  }).then((res) => {
    console.log(res)
    if (res.code === 0) {
      payTypeShow.value = false
      uni.navigateTo({
        url: '/pages/paymentResult/paymentResult?orderSn=' + orderInfo.orderSn,
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
  console.log('地址get:::', items)
  currentAddressDetail.value = items
  currentAddressId.value = items.id
  addressSelectShow.value = false
}

const getAddressListFn = () => {
  getAddressList({ page: 1, pageSize: 20 }).then((res: any) => {
    if (res.code === 0) {
      allAdressDateList.value = res.data?.list
      currentAddressDetail.value = allAdressDateList.value.find(
        (v) => v.id == currentAddressId.value,
      )
    }
  })
}

onLoad(async (optios) => {
  const { id, skuNum, addressId, skuId, proportion } = optios
  orderskuId.value = skuId
  goodsValue.value = skuNum
  currentAddressId.value = addressId
  proportions.value = proportion * 1
  getAddressListFn()
  const specName = autoDecodeURIComponent(optios.specName)
  const specVal = autoDecodeURIComponent(optios.specVal)

  const params = {
    id: +id,
    specName,
    specVal: specVal.split(','),
  }
  const arr: any = await Promise.all([
    getProductDetails({ id: +id }),
    getProductDetailsSpec(params),
  ])
  const [res, res2]: [res: any, res2: any] = arr
  // const res: any = await getProductDetails({ id: +id })
  detail.value = res.data
  detail.value.imgurl = res.data?.img?.split(',')[0]
  detail.value.specVal = specVal
  const { coin, point } = res2.data[0]
  detail.value.coin = coin
  detail.value.point = point
})

function onTimeFinish() {
  uni.showModal({
    title: 'Tip',
    content: 'Your order has been automatically cancelled, please place a new order',
    showCancel: false,
    success: ({ confirm }) => {
      if (confirm) {
        uni.navigateBack()
      }
    },
  })
}

const time = computed(() => {
  return orderInfo.order.waitCancelSec ? orderInfo.order.waitCancelSec * 1000 : 60 * 1000
})
const time2 = 900 * 1000

const orderDescEnglish = ref({
  1: 'Order is about to be completed,ready for pickup.',
  2: 'Order completed,thank you for using our service.',
  3: 'Order refund has been completed.',
  4: 'refund application',
  5: 'refund request not approved.',
  6: '',
  7: '',
})
</script>

<style lang="scss" scoped>
@import './confirmShopOrder.scss';
</style>
