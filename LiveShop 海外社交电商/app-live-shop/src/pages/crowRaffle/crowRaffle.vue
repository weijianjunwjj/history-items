<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Croefunding Gift',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="crowRaffleContainer">
    <view class="crowBannerSwiperBox">
      <SwiperAd :adId="'4_5_2'"></SwiperAd>
    </view>

    <view
      v-if="crowRaffleList.length"
      class="crowActiveContentBox"
      v-for="(item, index) in crowRaffleList"
      :key="index"
      @click="onClickActiveComEvent(item)"
    >
      <view class="activeItemInfoMarjor">
        <view class="activeItemInfoMarjor_activedetail">
          <view class="shopgoods_img">
            <image :src="getUrl(item?.reward[0])" class="shopgoodsImg" />
          </view>
          <view class="shopgoods_content">
            <view class="shop_title">
              <p class="shop_title-txt">{{ item.name }}</p>
              <p>{{ item.participants }} in</p>
            </view>
            <p class="shop_titleDesc ellipsis">{{ item.shortDesc }}</p>
            <view class="progressBox">
              <wd-progress
                :percentage="item.progress"
                hide-text
                :color="item.progress < 60 ? '#00DBA1' : '#FBA345'"
                style="width: 344rpx"
              ></wd-progress>
              <p style="margin-left: 20rpx">{{ item.progress }}％</p>
            </view>
            <view class="shop_desc">
              <view class="flex-c">
                <template v-if="item.ruleType == 1">
                  <image
                    src="/static/images/shop/coinIcon.svg"
                    class="textCoinIconimg"
                    style="margin-left: 5rpx"
                    mode="widthFix"
                  />
                  <span>{{ item.coin }}</span>
                </template>
                <template v-if="item.ruleType == 2">
                  <image
                    src="/static/images/shop/integralIcon.svg"
                    class="textIconimg"
                    style="margin-left: 5rpx"
                    mode="widthFix"
                  />
                  <span>{{ item.integral }}</span>
                </template>
                <template v-if="item.ruleType == 3">
                  <image src="/static/images/shop/integralIcon.svg" class="textIconimg" mode="widthFix" />
                  <span>{{ item.integral }}</span>
                  <view style="margin: 0 5rpx;">+</view>
                  <image
                    src="/static/images/shop/coinIcon.svg"
                    class="textCoinIconimg"
                    mode="widthFix"
                  />
                  <span>{{ item.coin }}</span>
                </template>
              </view>
              <view style="flex-direction: row;justify-content: flex-end;">
                <wd-button v-if="item.endTimeDeadline" custom-class="partInActiveBtn">Join Now</wd-button>
                <wd-button v-else custom-class="partEndActiveBtn">Ended</wd-button>
              </view>
            </view>
          </view>
        </view>
        <view class="activeItemInfoMarjor_bottomtime flex_cn">
          <wd-icon name="time" size="20px" color="#A4A4A4" style="margin-right: 10rpx"></wd-icon>
          <wd-count-down
            :time="item.endTimeDeadline * 1000"
            :format="format"
            v-if="item.endTimeDeadline"
          />
          <p v-else>Activity has ended</p>
        </view>
      </view>
    </view>
    <Empty v-else />
    <!-- <view v-else class="noData">
      <wd-status-tip
        :image="getUrl('admin/2024-10-30/574f7669-1f19-4936-a3c6-4e35bd7d2dbf.png')"
        tip="No content for now"
      />
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import Empty from '@/components/Empty/Empty.vue'
import { getActivityCrowdList, getCrowdActivityDetail } from '@/service/crow/crow'
import { getUrl } from '@/utils/utils'
import SwiperAd from '@/components/swiper-ad/swiper-ad.vue'

const current = ref<number>(0)
const customSwiperList = ref([])

const format = ref<string>('Only DD days,HH h,mm min,ss left')
const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const crowRaffleList = ref([])

function handleClick(e: any) {
  console.log(e.item)
  //   uni.navigateTo({
  //     url: e.item.url,
  //   })
}

async function onClickActiveComEvent(row: any) {
  const { id } = row
  // 拿ID获取最新时间数据
  const { data }: any = await getCrowdActivityDetail({ id })
  console.log('data', data)
  const { startTimeDeadline, endTimeDeadline } = data
  if (startTimeDeadline < 0) {
    return uni.showToast({
      title: 'Activity did not start',
      icon: 'none',
      mask: true,
    })
  }
  if (endTimeDeadline == 0) {
    return uni.showToast({
      title: 'Activity has ended',
      icon: 'none',
      mask: true,
    })
  }

  uni.navigateTo({
    url: '/pages/crowRaffleDetail/crowRaffleDetail?id=' + row.id,
  })
}

const getCrowRaffleList = () => {
  getActivityCrowdList({ ...pageBody })
    .then((res: any) => {
      if (res.code === 0) {
        crowRaffleList.value = [...crowRaffleList.value, ...res.data.list]
        totalCount.value = res.data.count
        console.log('******', crowRaffleList.value)
      }
    })
    .catch((err) => {
      //
    })
}

onReachBottom(() => {
  if (crowRaffleList.value.length >= totalCount.value) return
  pageBody.page += 1
  getCrowRaffleList()
})

onLoad(() => {
  getCrowRaffleList()
})
</script>

<style lang="scss" scoped>
@import './crowRaffle';

:deep(.wd-swiper__track) {
  border-radius: 0;
}

.partInActiveBtn {
  border-radius: 20rpx !important;
}
</style>
