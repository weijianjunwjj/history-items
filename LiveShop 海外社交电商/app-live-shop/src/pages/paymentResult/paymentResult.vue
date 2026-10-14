<route lang="json5">
  {
    layout: 'default',
    style: {
      navigationBarTitleText: 'Payment Result',
      'app-plus': {
        titleNView: false,
        popGesture: 'none',
      },
    },
  }
  </route>

  <template>
    <view class="paymentResultInfoBox">
      <view
        class="paymentResultInfoBox_head"
        :style="{ paddingTop:  30 + 'px' }"
      >
        <view class="customPageNavbar">
          <view class="customPageNavbar-cicle" @click="handleClickLeft">
            <image class="cicleLeftImg" src="/static/images/shop/pageBackIcon.png" />
          </view>
          <view class="customPageNavbar-title">Payment Result</view>
          <view class="customPageNavbar-cicle"></view>
        </view>

        <view class="payResultContent flexAlign">
          <view>
            <image class="resultSuccessImg" src="/static/images/shop/paySuccessIcon.png" />
          </view>
          <view class="resultRig_text">
            <p>Payment Successful！</p>
            <p>Thanks for choosing us!</p>
          </view>
        </view>
      </view>
      <wd-gap bg-color="#626262" height="9px" style="width: calc(100vw - 28px);margin: -30px auto 0 auto;border-radius: 8rpx;"></wd-gap>
      <view class="resultDetailInfomation">
        <view class="resultItem">
          <p class="p1">Order Number</p>
          <p class="p2">{{ detail.orderSn }}</p>
        </view>
        <view class="resultItem">
          <p class="p1">Creation Time</p>
          <p class="p2">{{ detail.createdAt.split(" ")[0] }} &nbsp;&nbsp;{{ detail.createdAt.split(" ")[1] }}</p>
        </view>
        <view class="resultItem">
          <p class="p1">Payment Time</p>
          <p class="p2">{{ detail.payTime.split(" ")[0] }} &nbsp;&nbsp;{{ detail.payTime.split(" ")[1] }}</p>
        </view>
        <view class="resultItem">
          <p  class="p1">Total</p>
          <p class="integralAndCoin">
            <view v-if="detail.priceShow == 1">
              <image
                class="resultCoinIcon"
                src="/static/images/shop/coinIcon.svg"
              /><span class="num ml-1">{{ detail.paiedCoin }}</span>
            </view>
            <view v-if="detail.priceShow == 2">
              <image
                class="resultIcon"
                src="/static/images/shop/integralIcon.svg"
              /><span class="num ml-1">{{ detail.paiedIntegral }}</span>
            </view>
            <view v-if="detail.priceShow == 3">
              <image
                class="resultIcon"
                src="/static/images/shop/integralIcon.svg"
              />{{ detail.paiedIntegral }}<span class="numand ml-1">+</span>
              <image
                class="resultCoinIcon"
                src="/static/images/shop/coinIcon.svg"
              />{{ detail.paiedCoin }}
            </view>
          </p>
        </view>
      </view>
      <wd-button custom-class="orderDetailBtn" @click="onToPageOrderDetail">Order Details</wd-button>
    </view>
  </template>

  <script lang="ts" setup>
  import { getOrderDetail } from '@/service/order/order'


  function handleClickLeft() {
    uni.navigateBack()
  }

  function onToPageOrderDetail() {
    uni.navigateTo({
      url: '/pages/order-detail/order-detail?orderSn=' + detail.value.orderSn,
    })
  }

  const detail: any = ref({})

  onLoad(async (optios) => {
    const orderSn = optios.orderSn
    const res: any = await getOrderDetail({ orderSn })

    detail.value = {
				orderStatus:res.data.orderStatus,
				orderSn:res.data.orderSn,
				ruleType:res.data.ruleType,
				rate:res.data.rate,
				createdAt:res.data.createdAt,
        payTime:res.data.payTime,
				waitCancelSec:res.data.waitCancelSec,
				shippingFreight: res.data.shippingFreight,

				paiedIntegral:res.data.paiedIntegral,
				paiedCoin:res.data.paiedCoin,
				priceShow: res.data.ruleType,
				number: res.data.type < 3 ? res.data.rewardList.length : res.data.orderGoods[0].num,
				name: res.data.type === 3? res.data.orderGoods[0].name:res.data.activity.name,
				spec: res.data.orderGoods[0]?.spec
			}

			if (detail.value.ruleType == 3) {
				// combine
				if (detail.value.paiedCoin == 0) {
					detail.value.priceShow = 2
				}
				if (detail.value.paiedIntegral == 0) {
					detail.value.priceShow = 1
				}
			}

      if (detail.value.ruleType == 2) {
        // combine
        if (detail.value.shippingFreight != 0) {
          detail.value.priceShow = 3
        }
      }
  })
  </script>

  <style lang="scss" scoped>
  @import './paymentResult.scss';
  </style>
