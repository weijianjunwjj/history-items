<route lang="json5">
{
layout: 'default',
style: {
'app-plus': {
titleNView: false,
popGesture: 'none',
},
},
}
</route>

<template>
  <view class="my-wallet">
    <header>
      <Title text="My Wallet"/>
    </header>
    <view class="card">
      <view class="pt-10 plr-10">
        <view class="flex-sb-c">
          <view class="flex-sb-c" style="display: inline-flex">
            <image
              mode="scaleToFill"
              src="@img/my-wallet/coin.png"
              style="width: 32rpx; height: 32rpx"
            />
            <view class="ml-2" style="font-size: 28rpx; color: #404040;font-weight: 400;">Wallet Balance</view>
          </view>

          <view>
            <wd-button
              class="my-plain"
              hairline
              size="small"
              type="info"
              @click="toPage('/pages/wallet-detail/wallet-detail')"
            >
              Details
            </wd-button>
            <wd-button
              class="ml-3 my-plain"
              hairline
              size="small"
              type="info"
              @click="toPage('/pages/recharge-history/recharge-history')"
            >
              History
            </wd-button>
          </view>
        </view>

        <view class="flex-c mt-4">
          <text class="my-coins text-wrap">{{ coin }}</text>
        </view>
      </view>
    </view>
    <main>
      <view class="lists">
        <view class="list-radius">
          <view
            v-for="(item, index) in list"
            v-if="list.length"
            :key="index"
            class="list flex-sb-c"
            @click="onAddCoin(item)"
          >
            <!-- <image src="../../static/images/my-wallet/hot.png" class="hot-icon" style="" /> -->

            <view class="flex-c">
              <image
                mode="scaleToFill"
                src="@img/my-wallet/coin.png"
                style="width: 70rpx; height: 70rpx"
              />

              <view class="ml-3">
                <view style="font-weight: bold; font-size: 32rpx; color: #fba345">
                  {{ item.giftNum }}
                </view>
                <view style="font-size: 20rpx; color: #959595">+{{ item.giftRatio }}%</view>
              </view>
            </view>

            <view>
              <!-- <text class="red" style="font-size: 24rpx; color: #ff1313">12:34:21</text> -->
              <wd-button
                class="mlr-2 mlr-style"
                hairline
                style="background-color: #fba345"
                type="warning"
              >
                ${{ item.amount }}
              </wd-button>
            </view>
          </view>

          <Empty v-else/>
        </view>
      </view>
    </main>
  </view>
</template>

<script lang="ts" setup>
import {confirmGooglePay} from '@/service/order/order'
import Empty from '@/components/Empty/Empty.vue'
import {addCoin} from '@/service/recharge-record/recharge-record'
import {getCoinIndex} from '@/service/wallet/wallet'
import {toPage} from '@/utils/utils'

const billingclient = uni.requireNativePlugin("com-yy-liveshop_GooglePlayBillingModule")
const list = ref([])
let chargeOrderSn = ref('');
const {userInfo, updateUserInfo} = useUserInfo()
const coin = computed(() => {
  return userInfo.value.coin
})

async function onAddCoin(item) {
  const {id, gearName} = item
  console.log(item)
  const obj = {
    rechargeLevel: id,
  }
  const res = await addCoin(obj)
  console.log('res', res)
  const orderSn: any = res.data
  console.log('orderSn', orderSn)
  // uni.navigateTo({
  //   url: '/pages/pay/pay',
  // })
  // paypal(orderSn)
  googleInappPay(orderSn, gearName)
}

const PurchaseState = {
  UNSPECIFIED_STATE: 0,
  PURCHASED: 1,
  PENDING: 2,
};
const toast = async (title: string) => {
  return await uni.showToast({
    icon: 'none',
    duration: 2000,
    title: title,
  })
}
const ProductType = {
  INAPP: "inapp",
  SUBS: "subs",
};

const BillingResponseCode = {
  SERVICE_TIMEOUT: 3,
  FEATURE_NOT_SUPPORTED: 2,
  SERVICE_DISCONNECTED: 1,
  OK: 0,
  USER_CANCELED: 1,
  SERVICE_UNAVAILABLE: 2,
  BILLING_UNAVAILABLE: 3,
  ITEM_UNAVAILABLE: 4,
  DEVELOPER_ERROR: 5,
  ERROR: 6,
  ITEM_ALREADY_OWNED: 7,
  ITEM_NOT_OWNED: 8,
  NETWORK_ERROR: 12,
};

const ConnectionState = {
  DISCONNECTED: 0,
  CONNECTING: 1,
  CONNECTED: 2,
  CLOSED: 3,
};


const handlePurchasesUpdated = (res) => {
  console.log("#7 purchase updated callback", res);
  if (res.code === BillingResponseCode.OK) {
    for (const detail of res.purchases) {
      if (detail.purchaseState === PurchaseState.PURCHASED) {
        confirmGooglePay({
          "orderSn": chargeOrderSn.value,
          "billingOrderId": detail.orderId,
          "purchaseToken": detail.purchaseToken
        }).then(res => {
          if (res.code != 0) {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
          } else {
            chargeOrderSn.value = "";
          }
          console.log("google billing confim result " + res.msg)
        })
      }
    }
  }
};


const googleInappPay = (sn, productId) => {
  console.log(" start google pay =>productId", productId)
  console.log(" start google pay =>orderSn", sn)
  chargeOrderSn.value = sn
  billingclient.launchBillingFlow({"orderSn": sn, "productId": productId}, (res) => {
    if (res.code != BillingResponseCode.OK) {
      console.log(" launch billing flow failed", res);
      toast('launch billing flow failed,please retry')
    } else {
      console.log("after launch billing flow  success", res);
    }
  });

};

onLoad(() => {
  console.log("wallet onLoad")
  billingclient.hello((res) => {
    console.log("billingclient hello test", res)
  })

  try {
    // 初始化客户端
    billingclient.initialize((res) => {
      if (res.code != BillingResponseCode.OK) {
        // console.log("billing client initialize  failed", res.code, res.msg);
        return toast('billing client initialize  failed,please restart the app')
      }

      console.log("billing client initialize  success");
      // 监听回调
      const globalEvent = uni.requireNativePlugin('globalEvent');
      globalEvent.addEventListener('purchasesUpdated', handlePurchasesUpdated);

      // 建立连接
      billingclient.startConnection((res) => {
        if (res.code != BillingResponseCode.OK) {
          console.log(" billing client connected failed", res);
          return toast('billing client connected failed')
        }
        console.log(" billing client connected  success");
      }, (res) => {
        console.log(" billing client disconnected");
        toast('billing client disconnected,please reload the page')
      })
    })
  } catch (error) {
    // Code to handle the error
    console.error("billing client initialize occurred an error", error.message);
  } finally {
    console.log("billingclient", billingclient)
  }


});


onUnload(() => {
  billingclient.endConnection();
});


onShow(async (opt) => {
  updateUserInfo()
  console.log('opt----------------------', opt)

  setTimeout(function () {
    var args = plus.runtime.arguments
    console.log('args----------------------------', args)
    if (args) {
    }
  }, 100)
  const res: any = await getCoinIndex({})
  console.log('res', res)
  list.value = res.data
})
</script>

<style>
page {
  background: #f6f6f6;
}
</style>
<style lang="scss" scoped>
header {
  height: calc(218rpx + var(--status-bar-height));
  background: #000000;
}

.card {
  // width: 672rpx;
  width: 694rpx;
  background: #ffffff;
  // box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(0, 0, 0, 0.16);
  margin: auto;
  margin-top: calc(-100rpx);
  padding-bottom: 46rpx;
  background: url('../../static/images/my-wallet/my-wallet-heard-bg.png') no-repeat;
  background-size: 100%;
  background-position: center top;
  border-bottom-left-radius: 16rpx;
  border-bottom-right-radius: 16rpx;

  .my-coins {
    font-weight: bold;
    font-size: 60rpx;
    color: #fba345;
    line-height: 70rpx;
  }
}

.lists {
  margin-left: 28rpx;
  margin-right: 28rpx;
  margin-top: 40rpx;

  .list-radius {
    border-radius: 16rpx;
    overflow: hidden;
  }

  .list {
    position: relative;
    background: #ffffff;
    border-bottom: 2rpx solid #efefef;
    padding: 36rpx 32rpx;

    .hot-icon {
      width: 87rpx;
      height: 60rpx;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}

.my-plain {
  color: #959595 !important;
  background-color: #fff !important;
  border: #959595 solid 1rpx !important;
  border-radius: 8px !important;
  width: 66px !important;
  height: 24px !important;
}

:deep(.orange-btn) {
  background-color: #fba345 !important;
  color: #fff !important;
}

:deep(.txt-c) {
  font-weight: 32rpx !important;
  font-weight: 500 !important;
}

.mlr-style {
  width: 176rpx !important;
  padding: 12rpx 24rpx !important;
  border-radius: 20rpx !important;
  background: #fba345;
}

// .bnt-radius {
//   border-radius: 16rpx !important;
// }
:deep(.wd-button) {
  // border-radius: 16rpx !important;
}
</style>
