<route lang="json5">
{
layout: 'default',
style: {
navigationBarTitleText: '商城',
'app-plus': {
titleNView: false,
popGesture: 'none',
},
},
}
</route>

<template>
  <view class="shopbarContainer">
    <view :style="{ paddingTop: safeAreaInsets?.top + 25 + 'px' }" class="shopContent_headtop">
      <view class="userAvatorBox flexAlign">
        <image :src="avatar" alt="" class="userAvatorImg" mode="aspectFill"/>
      </view>
      <view class="userNameContent flex-1">
        <p class="usernamelabel">
          Username：{{ userInfo.nickname }}

          <view @click.stop="onToPageMy">
            <image
              class="settingIcon"
              mode="widthFix"
              src="../../static/images/shop/setting.png"
              style="width: 32rpx"
            />
          </view>
        </p>
        <p class="userintegral">
          {{ userInfo.integral }}
          <span>Points</span>
        </p>
      </view>
    </view>

    <view class="funcMenuInfo">
      <wd-grid clickable>
        <wd-grid-item
          v-for="(item, index) in gridItemDate"
          :key="index"
          custom-class="custom-grid-item"
          use-icon-slot
          use-text-slot
          @itemclick="onGridItemClickEvent(item)"
        >
          <template #icon>
            <image :src="item.iconImg" class="grid-slot-img"/>
          </template>
          <template #text>
            <view class="custom-text">
              <view class="">
                {{ item.name.split(' ')[0] }}
              </view>
              <view class="">
                {{ item.name.split(' ')[1] }}
              </view>
            </view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </view>

    <view class="productConversion flex">Product Redemption</view>
    <view class="productCommodity">
      <wd-tabs
        v-model="productTabValue"

        autoLineWidth
        color="#404040"
        inactiveColor="#404040"
        slidable="always"
        @click="handlewdTabClick"
      >
        <block v-for="(item, index) in productTabClassify" :key="index">
          <wd-tab :title="`${item.name}`"></wd-tab>
        </block>
      </wd-tabs>

      <view class="wdTabContentBox">
        <cc-pullScroolView
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
          <view class="shopScrollContent">
            <view
              v-for="(item, index) in shopProductDateList"
              :key="index"
              class="shopGoodsItemInfo"
              @click="onRouterShopDetail(item)"
            >
              <view class="shopgoods_img">
                <image
                  :src="getUrl(item.productImgUrl)"
                  alt=""
                  class="shopgoodsImg"
                  mode="widthFix"
                  style="width: 100%"
                />
              </view>
              <view class="shopgoods_title ellipsis">{{ item.name }}</view>
              <view class="shopgoods_desc flex-c">
                <template v-if="item.productRule.ruleType == 1">
                  <image
                    alt=""
                    class="textIconimg"
                    src="/static/images/shop/coinIcon.svg"
                    style="margin-left: 5rpx"
                  />
                  <span>{{ item.productRule.coin }}</span>
                </template>
                <template v-if="item.productRule.ruleType == 2">
                  <image alt="" class="textIconimg_point" src="/static/images/shop/integralIcon.svg"/>
                  <span>{{ item.productRule.point }}</span>
                </template>
                <template v-if="item.productRule.ruleType == 3">
                  <image alt="" class="textIconimg_point" src="/static/images/shop/integralIcon.svg"/>
                  <span>{{ item.productRule.point }}</span>
                  <span class="mlr-0">/</span>
                  <image
                    alt=""
                    class="textIconimg"
                    src="/static/images/shop/coinIcon.svg"
                    style="margin-left: 5rpx"
                  />
                  <span>{{ item.productRule.coin }}</span>
                </template>
              </view>
            </view>
            <!-- <wd-status-tip
              image="content"
              tip="There is no product content"
              v-if="totalCount == 0"
            /> -->
          </view>
        </cc-pullScroolView>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {getProductIndex} from '@/service/goods/goods'
import {getAvatar, getUrl} from '@/utils/utils'
import {getDictSn} from '@/service/community/community'
import {useUserStore} from '@/store'

const userStore = useUserStore()
const avatar = computed(() => {
  return getAvatar(userStore.userInfo)
})
const {userInfo, updateUserInfo}: { userInfo: any } = useUserInfo()

const defaultUserAdver =
  userInfo.value.gender == 1
    ? '/static/images/shop/defaultMan.png'
    : '/static/images/shop/defaultWoman.png'

const {safeAreaInsets} = uni.getSystemInfoSync()
const gridItemDate = ref([
  {
    name: 'Points Details',
    iconImg: '/static/images/shop/group1.png',
    url: '/pages/integralDetail/integralDetail',
  },
  {
    name: 'Redemption History',
    iconImg: '/static/images/shop/group2.png',
    url: '/pages/convertRecord/convertRecord',
  },
  {
    name: 'Group Lottery',
    iconImg: '/static/images/shop/group3.png',
    url: '/pages/groupRaffle/groupRaffle',
  },
  {
    name: 'Crowdfunding Gift',
    iconImg: '/static/images/shop/group4.png',
    url: '/pages/crowRaffle/crowRaffle',
  },
])

const productTabClassify = ref([])
const productTabValue = ref(0)
const shopProductDateList = ref([])
const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const shopKeyword = ref('')
const pullScroll = ref()

// 下拉刷新
function pullDown() {
  shopProductDateList.value = []
  pageBody.page = 1
  getShopProductList()
}

onReachBottom(() => {
  if (shopProductDateList.value.length >= totalCount.value) return
  pullScroll.value.showUpLoading()
  pageBody.page += 1
  getShopProductList()
})

function onGridItemClickEvent(row: any) {
  uni.navigateTo({
    url: row.url,
  })
}

function handlewdTabClick(e: any) {
  shopKeyword.value = productTabClassify.value[e.index].id + ''
  pageBody.page = 1
  pullScroll.value.showUpLoading()
  shopProductDateList.value = []
  getShopProductList()
}

function onRouterShopDetail(row: any) {
  uni.navigateTo({
    url: '/pages/shopDetail/shopDetail?id=' + row.id,
  })
}

function onToPageMy() {
  uni.switchTab({
    url: '/pages/my/my',
  })
}

const getShopProductList = () => {
  //type  0，全部，1，类目，2，分类，3，商品名称
  getProductIndex({...pageBody, type: 2, keyword: shopKeyword.value}).then((res: any) => {
    if (res.code === 0) {
      res.data?.list?.forEach((item: any) => {
        item.productImgUrl = item.img?.split(',')[0]
      })
      shopProductDateList.value = [...shopProductDateList.value, ...(res.data.list || [])]
      totalCount.value = res.data.count
      setTimeout(() => {
        if (pageBody.page * 10 >= totalCount.value) {
          pullScroll.value.finish()
        } else {
          pullScroll.value.success()
        }
      }, 600)
    }
  })
}

function getCategoryIndexFn() {
  getDictSn({
    dictSn: 'GOODS_CLASS',
  }).then((res: any) => {
    console.log('res', res)
    const tabs = res.data.list.map((item) => {
      return {
        name: item.label,
        id: item.value,
      }
    })
    productTabClassify.value = tabs
    shopKeyword.value = productTabClassify.value[0]?.id + ''
    getShopProductList()
  })
}

onLoad(() => {
  getCategoryIndexFn()
})

onShow(() => {
  updateUserInfo()
})
</script>

<style lang="scss" scoped>
@import './shop.scss';
</style>
