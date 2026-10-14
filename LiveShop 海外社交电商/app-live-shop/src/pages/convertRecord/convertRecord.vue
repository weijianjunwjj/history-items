<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Redemption history',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="convertRecordContainer">
    <view class="searchHeadInputBox">
      <wd-search
        v-model="searchValue"
        custom-class="wdCustomSearchInputClass"
        hide-cancel
        placeholder="Search for product name"
        placeholder-left
        @change="secharChange"
      />
    </view>

    <view class="recoredListInfoBox">
      <cc-pullScroolView
       v-if="convertRecordList.length"
        ref="pullScroll"
        :pullDown="pullDown"
        class="pullScrollView"
        downErrorText="Refresh failure"
        downLoadingText="refresh..."
        downSuccessText="Refresh successfully"
        loosingText="Release refresh"
        pullingText="Pull to refresh"
        upErrorText="If loading fails, click Reload"
        upFinishText="No more for now"
        upLoadingText="loading..."
      >
        <view
          v-for="(item, index) in convertRecordList"
          :key="index"
          class="recordList_itembox"
          style="border-radius: 16rpx; overflow: hidden"
        >
          <view class="recordGoodsInfo">
            <view class="recordgoods_img">
              <image :src="getUrl(item.img)" class="regoodsImg" />
            </view>
            <view class="recordgoods_content">
              <view>
                <p class="record_title ellipsis-2">{{ item.name }}</p>
                <p class="record_num">Quantity：x {{ item.number }}</p>
              </view>
              <p class="record_time">
                <wd-icon
                  color="#A4A4A4"
                  name="time"
                  size="20px"
                  style="margin-right: 10rpx"
                ></wd-icon>
                {{ item.createdAt }}
              </p>
            </view>
          </view>

          <view class="recodeBotttom">
            <span style="margin-right: 10px;">Total:</span>
            <view v-if="item.priceShow == 1">
              <image
                class="recordCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
              />{{ item.paiedCoin }}
            </view>
            <view v-if="item.priceShow == 2">
              <image
                class="recordIconimg"
                src="/static/images/shop/integralIcon.svg"
              />{{ item.paiedIntegral }}
            </view>
            <view v-if="item.priceShow == 3">
              <image
                class="recordIconimg"
                src="/static/images/shop/integralIcon.svg"
              />{{ item.paiedIntegral }}/
              <image
                class="recordCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
              />{{ item.paiedCoin }}
            </view>
          </view>
        </view>
      </cc-pullScroolView>

      <Empty v-else />
      <!-- <wd-status-tip image="content" tip="No record" v-if="totalCount == 0" /> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onReachBottom } from '@dcloudio/uni-app'
import { getUrl } from '@/utils/utils'
import { getGroupOrderFinish } from '@/service/record/record'
import Empty from '@/components/Empty/Empty.vue'

const searchValue = ref<string>('')

const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const convertRecordList = ref([])
const pullScroll = ref()

// 下拉刷新
function pullDown() {
  convertRecordList.value = []
  pageBody.page = 1
  getConvertRecordList()
}

function secharChange({ value }) {
  searchValue.value = value
  convertRecordList.value = []
  pageBody.page = 1
  getConvertRecordList()
}

const getConvertRecordList = () => {
  getGroupOrderFinish({ ...pageBody, name: searchValue.value })
    .then((res: any) => {
      if (res.code === 0) {

        for (var i = 0; i < res.data.list.length; i++) {
          let itemObj = {
            orderStatus:res.data.list[i].orderStatus,
            orderSn:res.data.list[i].orderSn,
            ruleType:res.data.list[i].ruleType,
            rate:res.data.list[i].rate,
            createdAt:res.data.list[i].createdAt,
            waitCancelSec:res.data.list[i].waitCancelSec,
            paiedIntegral:res.data.list[i].paiedIntegral,
            paiedCoin:res.data.list[i].paiedCoin,

            priceShow: res.data.list[i].ruleType,
            number: res.data.list[i].type < 3 ? res.data.list[i].rewardList.length : res.data.list[i].orderGoods[0].num,
            img: res.data.list[i].type === 3?getUrl(res.data.list[i].orderGoods[0].img):getUrl(res.data.list[i].activity.reward[0]),
            name: res.data.list[i].type === 3? res.data.list[i].orderGoods[0].name:res.data.list[i].activity.name,
            spec: res.data.list[i].orderGoods[0]?.spec
          }

          if (itemObj.ruleType == 3) {
            // combine
            if (itemObj.paiedCoin == 0) {
              itemObj.priceShow = 2
            }
            if (itemObj.paiedIntegral == 0) {
              itemObj.priceShow = 1
            }
          }

          convertRecordList.value.push(itemObj)
        }

        totalCount.value = res.data.count
        setTimeout(() => {
          // 如果是最后一页
          if (pageBody.page * 10 >= totalCount.value) {
            pullScroll.value.finish()
          } else {
            // 不是最后一页
            pullScroll.value.success()
          }
        }, 600)
      }
    })
    .catch((err) => {
      //
    })
}

onLoad(() => {
  getConvertRecordList()
})

onReachBottom(() => {
  if (convertRecordList.value.length >= totalCount.value) return
  pullScroll.value.showUpLoading()
  pageBody.page += 1
  getConvertRecordList()
})

// onPullDownRefresh(() => {
//   pageBody.page = 1
//   getConvertRecordList()
// })
</script>

<style lang="scss" scoped>
@import './convertRecord';
</style>
