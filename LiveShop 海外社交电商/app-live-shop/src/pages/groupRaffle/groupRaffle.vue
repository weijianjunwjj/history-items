<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Group lottery',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="groupRaffleContainer">
    <SwiperAd :adId="'3_5_2'"></SwiperAd>

    <Empty v-if="list.length <= 0 " />
    <view class="allCardBox">
      <view class="groupActiveContentBox" v-for="(v, idx) in list" @click="onClickActiveComEvent(v)">
      <view class="activeItemInfo">
        <view class="activeItemHeadct flex">
          <p class="activeTitle">{{ v.name }}</p>
          <view class="activeTimeBox flexAlign">
            <wd-count-down :time="v.endTimeDeadline * 1000" :format="format" v-if="v.endTimeDeadline" @finish="onTimeFinish(v)" />
            <p v-else>Activity has ended</p>
          </view>
        </view>
        <view class="activeItemProductBox">
          <scroll-view :scroll-top="0" :scroll-x="true" class="scroll-X">
            <view class="shopScrollContent">
              <view class="shopGoodsItemInfo" v-for="(vv, index) in v.reward" :key="index">
                <view class="shopgoods_img">
                  <image :src="getUrl(vv)" alt="" class="shopgoodsImg" mode="widthFix" />
                </view>
                <view class="shopgoods_title ellipsis">{{ v.name }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Empty from '@/components/Empty/Empty.vue'
import {getGroupActivity} from '@/service/group'
import SwiperAd from '@/components/swiper-ad/swiper-ad.vue'
import {getUrl} from '@/utils/utils'
import {getCrowdActivityDetail} from '@/service/crow/crow'

const format = ref<string>('Only DDdays,HHh,mmmin,sss left')

function onTimeFinish(item){
  item.endTimeDeadline=0
}

const list = ref([])

async function onClickActiveComEvent(row: any) {
  // 拿ID获取最新时间数据
  const { id } = row
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
    url: '/pages/groupRaffleDetail/groupRaffleDetail?id=' + row.id,
  })
}

const pages = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)

onReachBottom(() => {
  if (list.value.length >= totalCount.value) return
  pages.page += 1
  getList()
})

const getList = async () => {
  const { page, pageSize } = pages
  const res: any = await getGroupActivity({ page, pageSize })
  list.value = [...list.value, ...res.data.list]
  totalCount.value = res.data.count
}

onMounted(async () => {
 await getList()
})

</script>

<style lang="scss" scoped>
@import './groupRaffle.scss';
:deep(.wd-swiper__track) {
  border-radius: 0;
}
</style>
