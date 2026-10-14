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
  <Title :text="detail.name" :white="false">
    <image
      src="@/static/images/common/share.png"
      style="width: 26px"
      mode="widthFix"
      @click="onShare"
    />
  </Title>
  <view class="crowRaffleDetailContainer">
    <view class="topBox">
      <view class="crowBannerSwiperBox">
        <image :src="getUrl(detail.banner)" alt="" class="bannerImg" mode="widthFix" />
      </view>

      <view class="crowActiveContentBox">
        <view class="activeItemInfo">
          <view class="active_title">
            <p class="ellipsis">{{ detail.name }}</p>
            <p style="width: 450rpx;text-align: right">{{ detail.participants }} in</p>
          </view>
          <p class="active_titleDesc">Draw at 6000 entries.</p>

          <view class="activeItemHeadct flexAlign">
            <view class="activeTimeBox flexAlign">
              <wd-icon name="time" size="20px" color="#A4A4A4" style="margin-right: 10rpx"></wd-icon>

              <template v-if="detail.endTimeDeadline">
                <text class="mr-2">Only</text>
                <wd-count-down :time="detail.endTimeDeadline * 1000" @finish="onTimeFinish" :format="format" />
              </template>
              <template v-else>Activity has ended</template>
            </view>
            <view class="activeItemHeadct_right">
              <template v-if="detail.ruleType == 1">
                <image src="/static/images/shop/coinIcon.svg" class="activecoinIcon" />
                <span class="num">{{ detail.coin }}</span>
              </template>
              <template v-if="detail.ruleType == 2">
                <image src="/static/images/shop/integralIcon.svg" class="activeintegralIcon" />
                <span class="num">{{ detail.integral }}</span>
              </template>
              <template v-if="detail.ruleType == 3">
                <image src="/static/images/shop/integralIcon.svg" class="activeintegralIcon" />
                <span class="num">{{ detail.integral }}</span>
                +
                <image src="/static/images/shop/coinIcon.svg" class="activecoinIcon" />
                <span class="num">{{ detail.coin }}</span>
              </template>
            </view>
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
              <image src="/static/images/shop/coinIcon.svg" class="coinIcon" />
              <span class="num">{{ detail.coin }}</span>
            </template>
            <template v-if="detail.ruleType == 2">
              <image src="/static/images/shop/integralIcon.svg" class="integralIcon" />
              <span class="num">{{ detail.integral }}</span>
            </template>
            <template v-if="detail.ruleType == 3">
              <image src="/static/images/shop/integralIcon.svg" class="integralIcon" />
              <span class="num">{{ detail.integral }}</span>
              +
              <image src="/static/images/shop/coinIcon.svg" class="coinIcon" />
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
          custom-class="groupBotBtn bookActivitybtn"
          style="background: #00dba1"
          v-if="detail.isBook"
          disabled
        >
          have already reserved
        </wd-button>
        <wd-button custom-class="groupBotBtn bookActivitybtn" @click="onHandleBookActive" v-else>
          Schedule Now
        </wd-button>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onNavigationBarButtonTap } from '@dcloudio/uni-app'
import { createOrderCrowd, getCrowdActivityDetail, activityBook } from '@/service/crow/crow'
import { useToast } from 'wot-design-uni'
import { getUrl } from '@/utils/utils'
import { getDictSn } from '@/service/community/community'

const toast = useToast()
const format = ref<string>('DDdays,HHh,mmmin,sss Left')
const detail: any = ref({})
const popupVisible = ref(false)
const count = ref(1)

const onClose = () => {
  popupVisible.value = false
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

function onTimeFinish(){
  detail.value.endTimeDeadline=0
}


async function onHandleTakeInActive() {
  if(detail.value.progress === 100) return uni.showToast({ title: 'The activity has ended', icon: 'none' })
  uni.navigateTo({
    url: `/pages/checkVerifyOrder/checkVerifyOrder?id=${detail.value.id}&pageflag=2`,
  })
}

const isActivityBook = ref(0)
onLoad(async (optios) => {
  const { id, isbook } = optios
  isActivityBook.value = isbook || 0
  const res: any = await getCrowdActivityDetail({ id: +id })
  console.log('resres',res)
  detail.value = res.data
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
  shareLink.value=resDic.data.list[0].value
})

onNavigationBarButtonTap((e: any) => {
  if (e.type == 'share') {
    //   分享-----
  }
})
</script>

<style lang="scss" scoped>
@import './crowRaffleDetail';
</style>
