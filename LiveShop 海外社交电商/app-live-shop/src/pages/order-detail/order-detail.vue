<route lang="json5">
{
	layout: 'default',
	style: {
		navigationBarTitleText: 'Order Details',
		'app-plus': {
			titleNView: false,
			popGesture: 'none',
		},
	},
}
</route>

<template>
	<Title :white="false" :style="'background-color: #fff'" text="Order Details"></Title>
	<view class="confirmShopOrder">
		<view class="confirmShopOrder-status flex-c">
			<image
				:src="getStatusImageUrl(orderInfo.orderStatus)"
				mode="widthFix"
				:style="orderInfo.orderStatus == 5 ? 'width: 36px' : 'width: 45px'"
			/>
			<view class="ml-14">
				<view class="status-text">{{ orderStatusEnglish[orderInfo.orderStatus] }}</view>
				<view class="mt-2 status-desc flex-c">
					<template v-if="orderInfo.orderStatus === 6" style="height: 45px;">
						<wd-count-down :time="orderInfo.waitCancelSec * 1000" format="mm:ss" @finish="onTimeFinish">
							<template #default="{ current }">
								<span class="status-desc mr-1">Orders after</span>
                <view style="display: inline-block;width: 35px;">
                  <span class="status-desc">{{ current.minutes < 10 ? "0" + current.minutes : current.minutes }}</span>
                  <span class="status-desc">:</span>
                  <span class="status-desc">{{ current.seconds < 10 ? "0" + current.seconds : current.seconds }}</span>
                </view>
								<span class="status-desc ml-1">will be automatically cancelled</span>
							</template>
						</wd-count-down>
					</template>
					<template v-else>
						<view style="height: 45px;">{{ orderDescEnglish[orderInfo.orderStatus] }}</view>
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
					style="width: 26px; height: 26px;"
				/>
        </view>
				<view class="addressRightArea">
          <view class="addressDetails">
            {{ currentAddressDetail?.stateName }},
            {{ currentAddressDetail?.cityName }},
            {{ currentAddressDetail?.detail }}
          </view>
          <p class="addressInfoTextContent-p">{{ currentAddressDetail?.name }}</p>
					<p class="addressInfoTextContent-p">{{ currentAddressDetail?.phone }}</p>
				</view>
			</view>
			<view class="productInfomation">
				<view style="display: flex;">
					<view class="confirmShopLefImgbox">
						<image :src="detail.img" class="shopGoodsImg" mode="widthFix" />
					</view>
					<view class="confirmShopContent">
						<p class="shop_title ellipsis">{{ detail.name }}</p>
						<p class="shop_specil">{{ detail.spec }}</p>
						<view class="shop_desc">
							<view class="flex_cn">
								<template v-if="detail.goodsIntegral != 0 && detail.goodsCoin != 0">
									<image
										alt=""
										class="shop_desctextIconimg"
										style="width: 32rpx;height: 28rpx;"
										src="/static/images/shop/integralIcon.svg"
									/>
									<text class="money mr-1">{{ detail.goodsIntegral }}</text>
									+
									<image
										alt=""
										class="shop_desctextCoinIconimg"
										src="/static/images/shop/coinIcon.svg"
										style="margin-left: 5rpx"
									/>
									<text class="money">{{ detail.goodsCoin }}</text>
								</template>
								<template v-else>
									<template v-if="detail.goodsCoin != 0">
										<image
											alt=""
											class="shop_desctextCoinIconimg"
											src="/static/images/shop/coinIcon.svg"
											style="margin-left: 5rpx"
										/>
										<text class="money">{{ detail.goodsCoin }}</text>
									</template>
									<template v-if="detail.goodsIntegral != 0">
										<image
											alt=""
											class="shop_desctextIconimg"
											style="width: 32rpx;height: 28rpx;"
											src="/static/images/shop/integralIcon.svg"
										/>
										<text class="money">{{ detail.goodsIntegral }}</text>
									</template>
								</template>
							</view>
							<p>x{{ detail.number }}</p>
						</view>
					</view>
				</view>
				<view style="margin-top: 12px;text-align: right;" v-if="orderInfo.orderStatus == 9">
					<wd-button
						plain
						@click="lookProgress"
						style="height: 30px;font-weight: 400;font-size: 14px;border-radius: 8px;color: #404040;border-color: #dfdfdf;"
					>Progress</wd-button>
				</view>
			</view>

			<view v-if="detail.type < 3" class="productPricesGroups order-info-area" style="padding: 20rpx 20rpx 20rpx 20rpx;border-radius: 16rpx;">
				<view class="flex_cn_bw productPricesGroups-itemsLone" v-for="(item, index) in detail.rewardList">
					<view>
						<p class="proprig_label">Claim Code <span class="proprig_rewardValue">{{ item.rewardSn }}</span></p>
					</view>
					<view class="proprig_labelValue">
						<wd-tag plain v-if="item.rewardStatus == 3" style="border-radius: 8rpx; border-color: #959595;" color="#959595">Awaiting</wd-tag>
						<wd-tag plain v-if="item.rewardStatus == 1" style="border-radius: 8rpx; border-color: #959595;" color="#959595">Not Won</wd-tag>
						<wd-tag v-if="item.rewardStatus == 2" style="border-radius: 8rpx;" color="#fff" bg-color="#000">Won</wd-tag>
						<wd-tag v-if="item.rewardStatus == 4">Void</wd-tag>
					</view>
				</view>
			</view>

			<view class="productPricesGroups productPricesGroups_top_border" style="padding: 20rpx 20rpx 0 20rpx;">
				<view class="flex_cn_bw productPricesGroups-itemsLone">
					<p class="proprig_label">Product Price</p>
					<view class="flex_cn">
						<template v-if="detail.integral == 0">
							<image
								alt=""
								class="textCoinIconimg"
								src="/static/images/shop/coinIcon.svg"
								style="margin-left: 5rpx"
							/>
							<text class="money">{{ detail.coin }}</text>
						</template>
						<template v-if="detail.coin == 0">
							<image alt="" class="textIconimg" style="width: 32rpx;height: 28rpx;" src="/static/images/shop/integralIcon.svg" />
							<text class="money">{{ detail.integral }}</text>
						</template>
						<template v-if="detail.coin != 0 && detail.integral != 0">
							<image alt="" class="textIconimg" style="width: 32rpx;height: 28rpx;" src="/static/images/shop/integralIcon.svg" />
							<text class="money mr-1">{{ detail.integral }}</text>
							+
							<image alt="" class="textCoinIconimg" src="/static/images/shop/coinIcon.svg" style="margin-left: 5rpx" />
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
						<text class="money">{{ detail.shippingFreight }}</text>
					</view>
				</view>
				<view class="flex_cn_bw productPricesGroups-itemsLone">
					<p class="proprig_label">Points</p>
					<view class="flex_cn">
						<template v-if="detail.ruleType != 1">
							<image alt="" class="textIconimg" style="width: 32rpx;height: 28rpx;" src="/static/images/shop/integralIcon.svg" />
							<text class="money">{{ detail.integral }}</text>
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
					</p>
				</view>
			</view>
			<view class="productPricesGroups order-info-area" style="padding: 20rpx 20rpx 20rpx 20rpx;border-radius: 16rpx;">
				<view class="flex_cn_bw productPricesGroups-itemsLone">
					<p class="proprig_label">Order Number</p>
					<view class="proprig_labelValue">
						{{ detail.orderSn }}
					</view>
				</view>
				<view class="flex_cn_bw productPricesGroups-itemsLone">
					<p class="proprig_label">Creation Time</p>
					<view class="proprig_labelValue">
						{{ detail.createdAt }}
					</view>
				</view>
			</view>
		</view>

		<view class="confirmShopOrder_bottombtnbox" v-if="![2,9,4,3].includes(detail.orderStatus)">
			<view class="speciBotLeftmoney">
				<view>
					<span style="font-size: 28rpx">Amount due：</span>
				</view>
				<view>
					<template v-if="detail.priceShow == 1">
						<image
							alt=""
							class="specimoneyCoinIconimg"
							src="/static/images/shop/coinIcon.svg"
							style="margin-left: 5rpx"
						/>
						<text class="moneyTxt">
							{{ detail.coin + detail.shippingFreight }}
						</text>
					</template>
					<template v-if="detail.priceShow == 2">
						<image alt="" class="specimoneyIconimg" src="/static/images/shop/integralIcon.svg" />
						<text class="moneyTxt">
							{{ detail.integral }}
						</text>
					</template>
					<template v-if="detail.priceShow == 3">
						<view class="flex-c">
							<view class="flex-c mr-1">
								<image alt="" class="specimoneyIconimg" src="/static/images/shop/integralIcon.svg" />
								<text class="moneyTxt">
									{{ detail.integral }}
								</text>
							</view>
							+
							<view class="flex-c ml-1">
								<image alt="" class="specimoneyCoinIconimg" src="/static/images/shop/coinIcon.svg" />
								<text class="moneyTxt">
									{{ detail.coin + detail.shippingFreight }}
								</text>
							</view>
						</view>
					</template>
				</view>
			</view>
			<view style="flex: 1" />
			<view v-if="detail.orderStatus == 6">
				<wd-button
          :loading="cancelLoading"
					style="margin-right: 10px;"
					custom-class="specipopSureBtn2"
          @click="handleCancelOrder"
        >
          Cancel
        </wd-button>
        <wd-button custom-class="specipopSureBtn" @click="payTypeShow = true">
          Pay
        </wd-button>
			</view>
			<view v-if="detail.orderStatus == 8 || detail.orderStatus == 7">
        <wd-button custom-class="specipopSureBtn" @click="handleRefund">
          Refund
        </wd-button>
			</view>
		</view>

		<payMentPopup
			:payDate="{
				coin: detail.coin,
				integral: detail.integral,
				freight: detail.shippingFreight,
				proportion: proportions,
			}"
			:ruleType="detail.ruleType"
			:visible="payTypeShow"
			@cancel="payTypeShow = false"
			@confirm="onPayMentConfirm"
		/>
	</view>
</template>

<script lang="ts" setup>
	import {getUrl} from '@/utils/utils'
	import {cancelOrder, getOrderDetail, refundApply} from '@/service/order/order'
	import {getStatusImageUrl, orderStatusEnglish, orderDescEnglish} from '@/utils/state'
	import {getAddressList} from '@/service/adress/adress'
	import {useToast, useMessage} from 'wot-design-uni'
	import { orderPay } from '@/service/group'
	import _, {isEmpty} from 'lodash'

  const toast = useToast()
	const message = useMessage()
	const orderInfo: any = ref({})
	const detail: any = ref({})
	const payTypeShow = ref(false)
	const proportions = ref<number>(1)
	const currentAddressId = ref()
	const currentAddressDetail = ref()
	const cancelLoading = ref(false)
	const _orderSn = ref('')

	onLoad(async (options) => {
		const {orderSn} = options
		_orderSn.value = orderSn

		await queryOrder()
		await getAddressListFn()
	})

	const queryOrder = async () => {
		const res = await getOrderDetail({orderSn: _orderSn.value})
		if (!isEmpty(res.data)) {
			orderInfo.value = res.data
			currentAddressId.value = res.data.addressId

			detail.value = {
				orderStatus:res.data.orderStatus,
				orderSn:res.data.orderSn,
				ruleType:res.data.ruleType,
				rate:res.data.rate,
				createdAt:res.data.createdAt,
				waitCancelSec:res.data.waitCancelSec,
				shippingFreight: res.data.shippingFreight,
				type: res.data.type,
				rewardList: res.data.rewardList,

				integral:0,
				coin:0,
				goodsIntegral: 0,  // 商品单价
				goodsCoin: 0, // 商品单价
				priceShow: res.data.ruleType,
				number: res.data.type < 3 ? res.data.rewardList.length : res.data.orderGoods[0].num,
				img: res.data.type === 3?getUrl(res.data.orderGoods[0].img):getUrl(res.data.activity.reward[0]),
				name: res.data.type === 3? res.data.orderGoods[0].name:res.data.activity.name,
				spec: res.data.orderGoods[0]?.spec
			}

			// 商品单价显示控制【和订单状态没关系】
			if (res.data.type < 3) {
				detail.value.goodsCoin = res.data.activity.coin
				detail.value.goodsIntegral = res.data.activity.integral
			} else {
				detail.value.goodsCoin = res.data.orderGoods[0].coin
				detail.value.goodsIntegral = res.data.orderGoods[0].integral
			}

			// 订单价格显示，支付后的订单统一显示为订单价格，未支付的需要计算
			if (detail.value.orderStatus == 6) {
				if (res.data.type < 3) {
					detail.value.coin = res.data.activity.coin * detail.value.number
					detail.value.integral = res.data.activity.integral * detail.value.number
				} else {
					detail.value.coin = res.data.orderGoods[0].coin * detail.value.number
					detail.value.integral = res.data.orderGoods[0].integral * detail.value.number
				}
			} else {
				detail.value.coin = res.data.paiedCoin - detail.value.shippingFreight
      	detail.value.integral = res.data.paiedIntegral
			}

			if (detail.value.orderStatus == 6) {
				if (detail.value.ruleType == 3) {
					// combine
					if (detail.value.coin == 0) {
						detail.value.priceShow = 2
					}
					if (detail.value.integral == 0) {
						detail.value.priceShow = 1
					}
				}
				if (detail.value.ruleType == 2) {
					// combine
					if (detail.value.shippingFreight != 0) {
						detail.value.priceShow = 3
					}
				}
			} else {
				if (detail.value.ruleType == 3) {
					// combine
					if (detail.value.integral == 0) {
						detail.value.priceShow = 1
					}
				}
				if (detail.value.ruleType == 2) {
					// combine
					if (detail.value.shippingFreight != 0) {
						detail.value.priceShow = 3
					}
				}
			}

			proportions.value = Number(res.data.rate[0]) !== 0 && Number(res.data.rate[1]) !== 0 ? res.data.rate[0] / res.data.rate[1] : 1
		}
	}

	// 订单关闭
	const handleCancelOrder = _.debounce(async () => {
		cancelLoading.value = true
		const res = await cancelOrder(_orderSn.value)
    if (res.code == 0) {
      toast.show('success')
      cancelLoading.value = true
      // 取消订单，详情情况，回到订单列表
      uni.redirectTo({url: '/pages/order/order'})
    }
	}, 300)

	const onPayMentConfirm = async (payType: number) => {
		orderPay({
			orderSn: _orderSn.value,
			type: payType,
		}).then((res) => {
			if (res.code === 0) {
				payTypeShow.value = false
				uni.navigateTo({
					url: '/pages/paymentResult/paymentResult?orderSn=' + _orderSn.value,
				})
			}
		})
	}

  // 退款进度
  const lookProgress = () => {
    uni.navigateTo({
      url: '/pages/refundProgress/refundProgress?orderSn=' + _orderSn.value,
    })
  }

	// 退款
	const handleRefund = async () => {
		try {
			await message.confirm({
				confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel',
				title: 'Are you sure?',
				msg: '',
			})
			const {code, data, msg} = await refundApply({orderSn: _orderSn.value})
			if (code === 0) {
				await uni.showToast({
					icon: 'none',
					title: msg,
				})
				setTimeout(() => {
					uni.redirectTo({url: '/pages/order/order'})
				}, 2000)
			} else {
				throw new Error(data)
			}
		} catch (e) {
			console.log(e)
			if (!e?.action) {
				toast.show(e?.data?.msg || 'NetWork Error!')
			}
		}
	}

	const getAddressListFn = async () => {
		const res = await getAddressList({page: 1, pageSize: 20})
		if (res.code === 0) {
				currentAddressDetail.value = res.data?.list.find(
					v => v.id == currentAddressId.value,
				)
			}
	}

	const onTimeFinish = () => {
		uni.showModal({
			title: 'Tip',
			content: 'Your order has been automatically cancelled',
			showCancel: false,
			success: ({confirm}) => {
				if (confirm) {
					uni.navigateBack()
				}
			},
		})
	}
</script>
<style lang="scss" scoped>
	@import './order-detail.scss';
</style>
