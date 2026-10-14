<template>
  <view>
    <wd-popup
      :close-on-click-modal="false"
      :modelValue="visible"
      :safe-area-inset-bottom="true"
      closable
      custom-style="height:auto;border-top-left-radius: 50rpx;border-top-right-radius: 50rpx;"
      position="bottom"
      @close="onPaymentClose"
    >
      <view class="paymentPopupInfoContent">
        <p class="poppupTitle">Payment Method</p>

        <view v-if="props.ruleType == 1 || props.ruleType === 3" class="paymentItemSelectInfo">
          <view class="paymentItemSelectInfo-left">
            <p class="payLeft_head">
              Coin Payment
              <span>Remaining Coins {{ userInfo.coin }}</span>
            </p>
            <view class="payLeft_paynumber flex_cn">
              <image class="textCoinIconimg" src="/static/images/shop/coinIcon.svg"/>
              {{ combinationCoin }}
              <view class="payLeft_paynumber flex_cn" style="font-size: 24rpx">
                (contains
                <image class="textCoinIconimg" src="/static/images/shop/coinIcon.svg"/>
                {{ Number(payDate.freight) }})
              </view>
            </view>
          </view>
          <view class="paymentItemSelectInfo-right">
            <wd-icon
              v-if="currentPayType == 1"
              color="#4FE178"
              name="check-outline"
              size="36rpx"
            ></wd-icon>
            <wd-icon
              v-else
              color="#000000"
              name="circle1"
              size="36rpx"
              @click="onChangePaymentStatus(1)"
            ></wd-icon>
          </view>
        </view>
        <view v-if="props.ruleType == 1 || props.ruleType === 3" class="segmentationLine"></view>
        <view v-if="props.ruleType == 2 || props.ruleType === 3" class="paymentItemSelectInfo">
          <view class="paymentItemSelectInfo-left">
            <p class="payLeft_head">
              Points Payment
              <span>Remaining Points {{ userInfo.integral }}</span>
            </p>
            <view class="payLeft_paynumber flex_cn">
              <image class="textIconimg" src="/static/images/shop/integralIcon.svg"/>
              {{ combinationIntegral }}
              <view class="payLeft_paynumber flex_cn" style="font-size: 24rpx">
                (contains
                <image class="textCoinIconimg" src="/static/images/shop/coinIcon.svg"/>
                {{ Number(payDate.freight) }})
              </view>
            </view>
          </view>
          <view class="paymentItemSelectInfo-right">
            <wd-icon
              v-if="currentPayType == 2"
              color="#4FE178"
              name="check-outline"
              size="36rpx"
            ></wd-icon>
            <wd-icon
              v-else
              color="#000000"
              name="circle1"
              size="36rpx"
              @click="onChangePaymentStatus(2)"
            ></wd-icon>
          </view>
        </view>
        <view v-if="props.ruleType === 2 || props.ruleType === 3" class="segmentationLine"></view>

        <view v-if="props.ruleType != 1" class="paymentItemSelectInfo">
          <view class="paymentItemSelectInfo-left">
            <p class="payLeft_head">Combined Payment</p>
            <p class="payLeft_desc">
              Remaining Points {{ userInfo.integral }}/Remaining Coins {{ userInfo.coin }}
            </p>
            <view class="payLeft_paynumber flex_cn">
              <image class="textIconimg" src="/static/images/shop/integralIcon.svg"/>
              {{ combinationPayments.integral }}
              <span>+</span>
              <image class="textCoinIconimg" src="/static/images/shop/coinIcon.svg"/>
              {{ Number(combinationPayments.coin) }}
              <view class="payLeft_paynumber flex_cn" style="font-size: 24rpx">
                (contains
                <image class="textCoinIconimg" src="/static/images/shop/coinIcon.svg"/>
                {{ Number(payDate.freight) }})
              </view>
            </view>
          </view>
          <view class="paymentItemSelectInfo-right">
            <wd-icon
              v-if="currentPayType == 3"
              color="#4FE178"
              name="check-outline"
              size="36rpx"
            ></wd-icon>
            <wd-icon
              v-else
              color="#000000"
              name="circle1"
              size="36rpx"
              @click="onChangePaymentStatus(3)"
            ></wd-icon>
          </view>
        </view>
        <view style="height: 16rpx"></view>
        <wd-button custom-class="popupPayBtn" @click="onSureSelectPay">Confirm Selection</wd-button>
      </view>
    </wd-popup>
    <wd-message-box selector="payment-confirm"/>
  </view>
</template>

<script lang="ts" setup>
const {userInfo, updateUserInfo} = useUserInfo()
import {useMessage, useToast} from 'wot-design-uni'

const toast = useToast()
const message = useMessage('payment-confirm')
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  payDate: {
    type: Object,
    default: () => ({coin: 0, integral: 0, freight: 0,proportion: 1}),
  },
  ruleType: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits()
const currentPayType = ref<number>(1)
watch(() => props.visible, () => {
  updateUserInfo()
  computedMoney()

})
// 组合支付
const combinationPayments = reactive({
  coin: 0,
  integral: 0,
})
// 计算过后的积分(只积分支付)
const combinationIntegral = ref<number>(0)
// 计算过后的金币(只金币支付)
const combinationCoin = ref<number>(0)
watch(
  () => props.ruleType,
  (n) => {
console.log('看看走没走进来', props.ruleType)
    if (n && n == 3) {
      currentPayType.value = 2
    } else {
      currentPayType.value = 1
    }
  },
)
// 是否可以成功支付 0可以 1需要支付 2积分不足
const canSuccessPay = ref<number>(0)
const successPay = () => {
  return emit('confirm', currentPayType.value)
}
const cannotPay = () => {
  toast.show('The balance is insufficient to purchase')
  setTimeout(() => {
    uni.switchTab({url: '/pages/index/index'})
  }, 1500)
}
const needToCharge = async () => {
  try {
    const confirm = await message.confirm({
      title: 'The balance is insufficient',
    })
    uni.navigateTo({url: '/pages/my-wallet/my-wallet'})
  } catch (err) {
    console.log('cancel')
  }
}
// 计算规则
// 1.仅金币
// 金币充足，则直接支付
// 金币不足，去充值
// 2.仅积分
// 积分充足，则直接支付
// 积分不足，跳转会首页
// 3.积分+金币
// 金币和积分都够 则直接支付
// 金币足够 积分不够 那么就对应转换成（当前用户所有积分+（商品的金币+转换后的金币的数量））
// 金币不足 积分足够 那么就对应转换成（（商品所需积分+缺额金币对应兑换积分）+用户金币余额）
// 金币不足 积分也不足 那么就跳转充值
// ！积分转金币要取整+取余

const computedPayment = () => {
// 用户账户的金币和积分数
  const {coin: userCoin, integral: userIntegral} = userInfo.value
  const {coin, integral, freight} = props.payDate
  const canPayFreight = Number(freight) <= userCoin
  // 金币计算比例
  const proportion = props.payDate.proportion
  // 用户刨除运费后能够使用的金币数量
  const canPayCoin = userCoin - Number(freight)

  // 首先计算用户余额够不够支付运费
  if (canPayFreight) {
    console.log('看看走没走进来1', currentPayType.value, typeof currentPayType.value)
    if (currentPayType.value === 3) {
      console.log('看看走没走进来2')
      //   用户金币数量大于商品所需数量
      if (canPayCoin >= coin) {
        console.log('用户金币数量大于商品所需数量')

        // 用户积分大于等于商品积分
        if (userIntegral >= integral) {
          console.log('用户积分大于等于商品积分')
          combinationPayments.coin = Number(freight) + Number(coin)
          combinationPayments.integral = integral
          // 直接支付
          canSuccessPay.value = 0
        } else {
          console.log('用户积分小于商品积分（积分不够）')
          //   用户积分小于商品积分（积分不够）
          //   先换算一下需要多少金币换成积分
          const needCoin = Math.ceil(Math.abs(integral - userIntegral) * proportion)
          console.log('用多少金币换积分', needCoin)
          if (canPayCoin - coin - needCoin > 0) {
            console.log('走这了吗？')
            combinationPayments.coin = Number(freight) + Number(coin) + Math.ceil(Number(integral * proportion))
            combinationPayments.integral = 0
            //   可以支付
            canSuccessPay.value = 0
          } else if (canPayCoin - coin - needCoin === 0) {
            combinationPayments.coin = Number(userCoin)
            combinationPayments.integral = needCoin * proportion
            canSuccessPay.value = 0
          } else {
            combinationPayments.coin = coin
            combinationPayments.integral = integral
            canSuccessPay.value = 1
          }
        }
      } else {
        console.log('用户金币数量小于商品所需数量（金币不够）')
        // 用户金币不足的情况
        const needIntegral = Math.ceil(Math.abs(coin - userCoin) / proportion) % 1
        if (userIntegral - needIntegral - integral >= 0) {
          combinationPayments.coin = userCoin
          combinationPayments.integral = needIntegral + integral
          //   可以支付
          //   可以用积分换金币去支付
          canSuccessPay.value = 0
        } else {
          combinationPayments.coin = coin
          combinationPayments.integral = integral
          canSuccessPay.value = 1
        }
      }
    } else {
      const needCharge = currentPayType.value === 1 ? combinationCoin.value > userCoin : combinationIntegral.value > userIntegral // boolean 判断是否需要充值的变量 用value来切换是计算积分还是计算金币
      if (needCharge) {
        if (currentPayType.value === 1) {
          canSuccessPay.value = 1
        } else {
          canSuccessPay.value = 2
        }
      } else {
        // emit('confirm', {type:currentPayType.value})
        canSuccessPay.value = 0
      }
    }
  } else {
    canSuccessPay.value = 1
  }
}
// 判断积分比例并且是否足额 同时如果不足额的话需要还是不需要去进行对应兑换
const computedMoney = () => {
  // 用户账户的金币和积分数
  const {coin: userCoin, integral: userIntegral} = userInfo.value
  const {coin, integral, freight} = props.payDate
  const canPayFreight = Number(freight) <= userCoin
  const canUseCoin = userCoin - Number(freight) // 剩余可使用硬币
  // 金币计算比例
  const proportion = props.payDate.proportion
  console.log('proportion:::',proportion)
  // 不管能不能支付运费的事情  这个地方只是单纯的去计算并显示
  // 先是纯金币
  combinationCoin.value = Number(integral) > 0 ? Math.ceil(integral * proportion) + coin  : coin
  // combinationCoin.value =  integral * proportion +coin
  console.log('纯金币的显示', combinationCoin.value)
  // 纯积分
  combinationIntegral.value = Number(coin) > 0 ? Math.ceil(Math.abs(coin) / proportion) + integral : integral
  console.log('纯积分的显示', Math.ceil(Math.abs(coin) / proportion), proportion, coin)
  // 这下面的逻辑是计算混合支付的显示
  if (canPayFreight) {
    //   足够支付运费
    if (canUseCoin > coin) {
      // 够支付金币
      if (userIntegral > integral) {
        combinationPayments.coin = coin
        combinationPayments.integral = integral
      } else {
        //   积分不够了，需要用金币转换
        const needCoin = Math.ceil(Math.abs(integral - userIntegral) * proportion)
        if (canUseCoin < needCoin + Number(coin)) {
          //   如果剩余金币不够转换积分
          combinationPayments.coin = coin
          combinationPayments.integral = integral
        } else {
          combinationPayments.coin = coin + needCoin
          combinationPayments.integral = userIntegral
        }
      }
    } else {
      // 金币不足，看看用不用积分进行兑换
      const needIntegral = Math.ceil(Math.abs(coin - userCoin) / proportion) % 1
      if (userIntegral - integral > needIntegral) {
        //   足够用对应的积分转换金币
        combinationPayments.coin = userCoin
        combinationPayments.integral = Number(integral) + needIntegral
      } else {
        // 不够的情况
        combinationPayments.coin = coin
        combinationPayments.integral = integral
      }
    }
  } else {
    combinationPayments.coin = coin
    combinationPayments.integral = integral
  }
}


function onChangePaymentStatus(key: number) {
  console.log('key', key)
  currentPayType.value = key
  computedMoney()
}

function onSureSelectPay() {
  console.log('---------', canSuccessPay.value)
  computedPayment()
  console.log('???', canSuccessPay.value)
  switch (canSuccessPay.value) {
    case 0:
      successPay()
      break;
    case 1:
      needToCharge()
      break;
    case 2:
      cannotPay()
      break;
  }
  console.log('---------')

}

function onPaymentClose() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.flex_cn {
  display: flex;
  align-items: center;
}

.paymentPopupInfoContent {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 52rpx;
  padding-bottom: 135rpx;

  .poppupTitle {
    box-sizing: border-box;
    padding: 40rpx 0;
    font-size: 32rpx;
    font-weight: 800;
    color: #313131;
    text-align: center;
  }

  .paymentItemSelectInfo {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;

    &-left {
      .payLeft_head {
        font-size: 32rpx;
        font-weight: 500;
        color: #313131;

        span {
          font-size: 22rpx;
          font-weight: 300;
          color: #959595;
        }
      }

      .payLeft_desc {
        font-size: 22rpx;
        font-weight: 300;
        color: #959595;
      }

      .payLeft_paynumber {
        margin-top: 5rpx;
        font-size: 40rpx;
        font-weight: 800;
        color: #fba345;

        .textIconimg {
          width: 16px;
          height: 15px;
          margin-right: 8rpx;
        }
        .textCoinIconimg {
          width: 16px;
          height: 16px;
          margin-right: 8rpx;
        }

        span {
          display: block;
          margin: 0 4rpx;
          color: #000000;
        }
      }
    }
  }

  .segmentationLine {
    width: 100%;
    border: 2rpx solid;
    border-image: linear-gradient(90deg, rgba(200, 200, 200, 1), rgba(238, 238, 238, 1)) 2 2;
  }

  .popupPayBtn {
    position: absolute;
    bottom: 50rpx;
    left: 50%;
    width: 90%;
    background: #000000;
    transform: translateX(-50%);
  }
}

:deep(.wd-popup__close) {
  top: 40rpx;
  right: 52rpx;
}
</style>
