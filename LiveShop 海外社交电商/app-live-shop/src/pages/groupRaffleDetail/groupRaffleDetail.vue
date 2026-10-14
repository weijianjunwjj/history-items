<route lang="json5" type="page">
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
  <Title :white="false" text="Lottery details">
    <image
      mode="widthFix"
      src="@/static/images/common/share.png"
      style="width: 26px"
      @click="onShare"
    />
  </Title>
  <view class="groupRaffleContainer">
    <view class="groupBannerSwiperBox">
      <image :src="getUrl(detail.banner)" alt="" class="bannerImg" mode="widthFix" />
    </view>
    <view class="groupActiveContentBox">
      <p class="detailTitme">Prize Details</p>
      <view class="activeItemInfo">
        <view class="activeItemProductBox">
          <scroll-view :scroll-top="0" :scroll-x="true" class="scroll-X">
            <view class="shopScrollContent">
              <view
                v-for="(v, i) in detail.reward"
                :key="i"
                :class="i == 0 ? 'isFirstClass' : 'shopGoodsItemInfo'"
              >
                <view class="shopgoods_img">
                  <image :src="getUrl(v)" alt="" mode="widthFix" class="shopgoodsImg" />
                </view>
                <view class="shopgoods_title">{{ detail.name }}</view>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="activeItemHeadct">
          <view class="activeTimeBox flexAlign">
            <wd-icon color="#A4A4A4" name="time" size="22px" style="margin-right: 10rpx"></wd-icon>

            <template v-if="detail.endTimeDeadline">
              <span style="margin-right: 9rpx;font-size: 15px;font-weight: 400;">Only</span>
              <wd-count-down
                :format="format"
                :time="detail.endTimeDeadline * 1000"
                style="font-size: 15px;color: #00DBA1;font-weight: normal;"
                @finish="onTimeFinish"
              />
            </template>
            <template v-else>Activity has ended</template>
          </view>
          <view class="progressBox">
            <wd-progress
              :percentage="detail.progress"
              :color="detail.progress < 60 ? '#00DBA1' : '#FBA345'"
              hide-text
              style="width: 300rpx"
            ></wd-progress>
            <p style="margin-left: 20rpx">{{ detail.progress }}％</p>
          </view>
        </view>
      </view>
    </view>

    <view class="groupDetailInfo">
      <p class="detailTitle">Event Details</p>
      <view class="detaileditBox">
        <rich-text :nodes="detail.detail"></rich-text>
      </view>
    </view>

    <view class="groupBottomPosContent flexAlign">
      <template v-if="!isActivityBook">
        <view class="grbtLeft">
          <view>Discounted Price:</view>
          <view class="flex-c">
            <template v-if="detail.ruleType == 1">
              <image class="coinIcon" src="/static/images/shop/coinIcon.svg" />
              <span class="num">{{ detail.coin }}</span>
            </template>
            <template v-if="detail.ruleType == 2">
              <image class="integralIcon" src="/static/images/shop/integralIcon.svg" />
              <span class="num">{{ detail.integral }}</span>
            </template>
            <template v-if="detail.ruleType == 3">
              <image class="integralIcon" src="/static/images/shop/integralIcon.svg" />
              <span class="num">{{ detail.integral }}</span>
              <view class="numand"> + </view>
              <image class="coinIcon" src="/static/images/shop/coinIcon.svg" />
              <span class="num">{{ detail.coin }}</span>
            </template>
          </view>
        </view>
        <view>
          <wd-button custom-class="groupBotBtn" @click="onHandleTakeInActive">
            Submit Order
          </wd-button>
        </view>
      </template>
      <template v-else>
        <wd-button
          v-if="detail.isBook"
          custom-class="groupBotBtn bookActivitybtn"
          disabled
          style="background: #00dba1"
        >
          have already reserved
        </wd-button>
        <wd-button v-else custom-class="groupBotBtn bookActivitybtn" @click="onHandleBookActive">
          Schedule Now
        </wd-button>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { createOrderGroup, getGroupActivityDetail } from '@/service/group'
import { activityBook } from '@/service/crow/crow'
import { onNavigationBarButtonTap } from '@dcloudio/uni-app'
import { getUrl } from '@/utils/utils'
import { useToast } from 'wot-design-uni'
import { getDictSn } from '@/service/community/community'

const format = ref<string>('DDdays,HHh,mmmin,sss Left')
const toast = useToast()
const detail: any = ref({})
const count = ref(1)
const isActivityBook = ref(0)

onLoad(async (optios) => {
  const { id, isbook } = optios
  isActivityBook.value = isbook || 0
  const res: any = await getGroupActivityDetail({ id: +id })
  detail.value = res.data
})

function onTimeFinish() {
  console.log('倒计时结束')
  detail.value.endTimeDeadline = 0
}

function onHandleBookActive() {
  activityBook({ activityId: detail.value.id }).then((res) => {
    if (res.code === 0) {
      toast.success('book successfully')
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/community/community',
        })
      }, 1200)
    }
  })
}

async function onHandleTakeInActive() {
  console.log(detail.value.endTimeDeadline)
  if (detail.value.endTimeDeadline <= 0)
    return uni.showToast({ title: 'The activity has ended', icon: 'none' })
  uni.navigateTo({
    url: `/pages/checkVerifyOrder/checkVerifyOrder?id=${detail.value.id}&pageflag=1`,
  })
}

const uniShareShowStatus = ref(false)
onNavigationBarButtonTap((e: any) => {
  if (e.type == 'share') {
    //   分享-----
    uniShareShowStatus.value = true
  }
})

const shareLink = ref('')
function onShare() {
  uni.setClipboardData({
    data: shareLink.value,
    success: function () {
      uni.showToast({
        title: 'share successfully！',
        icon: 'none',
        mask: true,
      })
    },
  })
}

onMounted(async () => {
  const resDic: any = await getDictSn({ dictSn: 'APP_LINK' })
  shareLink.value = resDic.data.list[0].value
})
</script>

<style lang="scss" scoped>
@import './groupRaffleDetail';
</style>
