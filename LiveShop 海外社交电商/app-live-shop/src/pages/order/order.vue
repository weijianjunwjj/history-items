<route lang="json5">
{
  style: {
    navigationBarTitleText: 'My Orders',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="order-page">
    <!-- 顶部导航标签 -->
    <wd-tabs
      v-model="tab"
      swipeable
      line-width="50rpx"
      custom-class="my-tabs"
      @change="onChangeTabs"
    >
      <wd-tab v-for="(item, index) in tabs" :key="index" :title="item.title" :name="item.name">
        <!-- 列表内容 -->
      </wd-tab>
    </wd-tabs>

    <div class="mt-6 hide">1</div>

    <!--  ref：唯一ref pullDown:下拉刷新事件  onReachBottom：上拉加载事件 -->
    <cc-pullScroolView class="pullScrollView" ref="pullScroll" :pullDown="pullDown" v-if=orderList.length>
      <view class="tab-content">
        <view v-for="(order, idx) in orderList" :key="idx" class="order-item">
          <view v-if="order.orderStatus != 6 || (order.orderStatus == 6 && order.waitCancelSec > 0)">
            <!-- 订单信息 -->
            <view class="order-info">
              <view class="order-number">Number：{{ order.orderSn }}</view>
              <view class="order-status">{{ orderStatusObj[order.orderStatus] }}</view>
            </view>
            <!-- 商品信息 -->
            <view class="product">
              <image :src="order.img"
                    class="product-img"
                    style="width: 186rpx;height: 186rpx; border-radius: 16rpx; overflow: hidden;"/>
              <view class="product-info">
                <wd-text bold color="#313131" size="14px" :text="order.name" :lines="2"></wd-text>
                <view class="product-spec">{{ order.spec }}</view>
                <view class="price flex-sb">
                  <view class="flex-c">
                    <view v-if="order.priceShow == 1">
                      <image
                        class="coinIcon"
                        src="/static/images/shop/coinIcon.svg"
                      /><span class="num ml-1">{{ order.coin }}</span>
                    </view>
                    <view v-if="order.priceShow == 2">
                      <image
                        class="integralIcon"
                        src="/static/images/shop/integralIcon.svg"
                      /><span class="num ml-1">{{ order.integral }}</span>
                    </view>
                    <view v-if="order.priceShow == 3">
                      <image
                        class="integralIcon"
                        src="/static/images/shop/integralIcon.svg"
                      />{{ order.integral }}<span class="numand ml-1 mr-1">+</span>
                      <image
                        class="coinIcon"
                        src="/static/images/shop/coinIcon.svg"
                      />{{ order.coin }}
                    </view>
                  </view>
                  <view class="flex-c goods-num" v-if="order.orderStatus == 6">
                    x{{ order.number }}
                  </view>
                </view>
              </view>
            </view>

            <view class="order-footer flex-sb-c mt-5">
              <view class="time flex-c" v-if="order.orderStatus == 6">
                <image
                  src="../../static/images/order/clock.png"
                  style="width: 16px; height: 16px"
                />
                <view class="ml-3" >
                  <wd-count-down custom-class="time-text" :time="order.waitCancelSec * 1000" format="mm:ss" />
                </view>
              </view>
              <view v-else> </view>

              <!-- 操作按钮 -->
              <view class="actions">
                <wd-button
                  v-if="order.orderStatus == 6"
                  @click="cancelOrderFunc(order)"
                  :round="false"
                  size="small"
                  style="border-radius: 8px;border: 1px solid #DFDFDF;width: 73px;height: 30px;"
                  plain
                  class="mlr-2"
                  :loading="order.loading"
                >
                  Cancel
                </wd-button>
                <wd-button
                  @click="toDetail(order)"
                  plain
                  :round="false"
                  style="border-radius: 8px;border: 1px solid #DFDFDF;width: 73px;height: 30px;"
                  type="info"
                  size="small"
                  class="mlr-2"
                >
                  {{ getBtnName(order) }}
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </cc-pullScroolView>

    <Empty v-else/>
  </view>
</template>

<script lang="ts" setup>
import {useToast} from 'wot-design-uni'
import {cancelOrder, getGroupOrder, refundApply} from '../../service/order/order'
import {orderStatusArray, orderStatusObj} from '../../utils/state'
import _ from 'lodash'
import {getUrl} from '@/utils/utils'
import Empty from '@/components/Empty/Empty.vue'

const tab = ref(6)
const arr = orderStatusArray.map((item) => ({
  title: item.value,
  name: item.key.toString(),
}))
// 模拟标签页数据
const tabs = ref(arr)
const orderStatus = ref(6)

// 模拟订单列表
const orderList = ref([])

const onChangeTabs = (e) => {
  const { name } = e
  orderStatus.value = name
  orderList.value = []
  query()
}

const cancelOrderFunc = _.debounce(async (order) => {
  const { orderSn } = order
  order.loading = true
  try {
    await cancelOrder(orderSn)
    uni.showToast({
      title: 'Cancelled successfully',
      icon: 'none',
      mask: true,
    })
    order.loading = false
    pullDown()
  } catch (error) {
    console.error(error)
    order.loading = false
  }
}, 300)

const toDetail = ({orderSn}) => {
  uni.navigateTo({
    url: `/pages/order-detail/order-detail?orderSn=${orderSn}`
  })
}

const getBtnName = (order) => {
  switch (order.orderStatus) {
    case 6:
      return "Pay"
    case 8:
      return "Refund"
    default:
      return "Details"
  }
}

const refundOrder = async ({orderSn}) => {
  await refundApply({orderSn})
  useToast().show('退款成功')
  reset()
}

const reset = () => {
  orderList.value = []
  pages.page = 1
  query()
}

const pages = reactive({
  page: 1,
  pageSize: 20,
  totalNum: 0,
})

async function query() {
  const {page, pageSize} = pages
  const params = {
    page,
    pageSize,
    orderStatus: +orderStatus.value,
  }

  const res = await getGroupOrder(params)
  const data: any = res.data

  for (var i = 0; i < data.list.length; i++) {
    let itemObj = {
      orderStatus:data.list[i].orderStatus,
      orderSn:data.list[i].orderSn,
      ruleType:data.list[i].ruleType,
      rate:data.list[i].rate,
      createdAt:data.list[i].createdAt,
      waitCancelSec:data.list[i].waitCancelSec,

      integral:0,
      coin:0,
      priceShow: data.list[i].ruleType,
      number: data.list[i].type < 3 ? data.list[i].rewardList.length : data.list[i].orderGoods[0].num,
      img: data.list[i].type === 3?getUrl(data.list[i].orderGoods[0].img):getUrl(data.list[i].activity.reward[0]),
      name: data.list[i].type === 3? data.list[i].orderGoods[0].name:data.list[i].activity.name,
      spec: data.list[i].orderGoods[0]?.spec
    }

    if (orderStatus.value == 6) {
      if (data.list[i].type < 3) {
        itemObj.coin = data.list[i].activity.coin
        itemObj.integral = data.list[i].activity.integral
      } else {
        itemObj.coin = data.list[i].orderGoods[0].coin
        itemObj.integral = data.list[i].orderGoods[0].integral
      }
    } else {
      itemObj.coin = data.list[i].paiedCoin
      itemObj.integral = data.list[i].paiedIntegral
    }
    

    if (itemObj.ruleType == 3) {
      // combine
      if (itemObj.coin == 0) {
        itemObj.priceShow = 2
      }
      if (itemObj.integral == 0) {
        itemObj.priceShow = 1
      }
    }

    orderList.value.push(itemObj)
  }

  pages.totalNum = data.count
  setTimeout(() => {
    // 如果是最后一页
    if (pages.page * 10 >= pages.totalNum) {
      pullScroll.value.finish()
    } else {
      // 不是最后一页
      pullScroll.value.success()
    }
  }, 600)
}

const pullScroll = ref()

onReachBottom(() => {
  if (pages.page * 10 >= pages.totalNum) {
  } else {
    // 显示加载中
    pullScroll.value.showUpLoading()
    pages.page++
    query()
  }
})

function pageRefresh() {
  nextTick(() => {
    pullScroll.value.refresh()
  })
}

// 下拉刷新
function pullDown() {
  orderList.value = []
  pages.page = 1
  query()
}
</script>

<style lang="scss" scoped>
@import './order.scss';
</style>
