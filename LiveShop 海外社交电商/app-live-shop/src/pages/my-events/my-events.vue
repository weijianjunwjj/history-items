<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'My Events',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="myEventContainer">
    <view class="searchHeadInputBox">
      <wd-search
        v-model="searchValue"
        @change="secharChange"
        hide-cancel
        placeholder-left
        placeholder="Search for activity name"
        custom-class="wdCustomSearchInputClass"
      />
    </view>
    <view class="tabListCub flex-sb-c">
      <view
        class="tabItem flex flex-vc"
        :class="{ activeTab: item.checked }"
        v-for="(item, index) in tabListDate"
        :key="index"
        @click="onTabCheckChange(item)"
      >
        <image class="tabIcon" :src="item.checkimg" v-if="item.checked" />
        <image class="tabIcon" :src="item.img" v-else />
        <p>{{ item.title }}</p>
      </view>
    </view>

    <view class="recoredListInfoBox">
      <cc-pullScroolView
        v-if="myEventsList.length"
        class="pullScrollView"
        ref="pullScroll"
        :pullDown="pullDown"
        upFinishText="Have reached the end"
        pullingText="Pull to refresh"
        loosingText="Release refresh"
        downLoadingText="refresh..."
        upLoadingText="loading..."
        downSuccessText="Refresh successfully"
        downErrorText="Refresh failure"
        upErrorText="If loading fails, click Reload"
      >
        <view
          class="activeItemInfoMarjor"
          v-for="(item, index) in myEventsList"
          :key="index"
          @click="onActivePage(item)"
        >
          <view class="activeItemInfoMarjor_activedetail">
            <view class="eventBannerImg">
              <image :src="getUrl(item?.reward[0])" class="bannerImg" mode="aspectFill" />
            </view>
            <view class="shopgoods_content">
              <view class="shop_title">
                <p class="omit" style="width: 230rpx;">{{ item.name }}</p>
                <p style="width: 230rpx;" class="txt-r">
                  {{ item.participants }} {{ activityType == 1 ? 'participants' : 'subscribers' }}
                </p>
              </view>
              <p class="shop_titleDesc ellipsis-2">{{ item.shortDesc }}</p>
              <view class="progressBox">
                <wd-progress
                  :percentage="item.progress"
                  hide-text
                  :color="item.progress < 60 ? '#00DBA1' : '#FBA345'"
                  style="width: 280rpx"
                ></wd-progress>
                <p style="margin-left: 20rpx">{{ item.progress }}％</p>
              </view>
            </view>
          </view>
          <view class="activeItemInfoMarjor_bottomtime flex-c just-sb">
            <view class="flex-c">
              <wd-icon
                name="time"
                size="20px"
                color="#A4A4A4"
                style="margin-right: 10rpx"
              ></wd-icon>
              <wd-count-down
                :time="activityType == 1 ? item.endTimeDeadline * 1000 : item.bookingDeadlineSec * 1000"
                :format="activityType == 1 ? format1 : format2"
                v-if="activityType == 1 ? item.endTimeDeadline * 1000 : item.bookingDeadlineSec * 1000"
              />
              <p v-else>Event Has Ended</p>
            </view>

            <!-- <wd-button
              custom-class="activeBtn"
              plain
              v-if="activityType == 2"
              @click.stop="onChannelActiveBook(item)"
            >
              Channel
            </wd-button> -->
          </view>
        </view>
      </cc-pullScroolView>

      <Empty v-else />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getUrl } from '@/utils/utils'
import { getActivityMine, getCrowdActivityDetail } from '@/service/crow/crow'
import { useToast } from 'wot-design-uni'
import Empty from '@/components/Empty/Empty.vue'


const toast = useToast()
const searchValue = ref<string>('')
const format1 = ref<string>('Only end DDdays,HHh,mmmin,sss left')
const format2 = ref<string>('Only start DDdays,HHh,mmmin,sss')
const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const myEventsList = ref([])
const pullScroll = ref()

const tabListDate = reactive([
  {
    img: '/static/images/my-messages/partici.png',
    checkimg: '/static/images/my-messages/checkpartici.png',
    title: 'Participating',
    checked: true,
    id: 1,
  },
  {
    img: '/static/images/my-messages/booked.png',
    checkimg: '/static/images/my-messages/checkbooked.png',
    title: 'Booked',
    checked: false,
    id: 2,
  },
])
const activityType = ref(1)

function onTabCheckChange(row: any) {
  tabListDate.map((r) => (r.checked = false))
  row.checked = true
  pullScroll.value?.showUpLoading()
  activityType.value = row.id
  console.log(activityType.value);
  
  pageBody.page = 1
  myEventsList.value = []
  getActiveEventList()
}

// 下拉刷新
function pullDown() {
  myEventsList.value = []
  pageBody.page = 1
  getActiveEventList()
}

function secharChange({ value }) {
  searchValue.value = value
  myEventsList.value = []
  pageBody.page = 1
  getActiveEventList()
}

const getActiveEventList = () => {
  getActivityMine({ ...pageBody, name: searchValue.value, type: activityType.value })
    .then((res: any) => {
      if (res.code === 0) {
        myEventsList.value = [...myEventsList.value, ...res.data.list]
        totalCount.value = res.data.count

        setTimeout(() => {
          if (pageBody.page * 10 >= totalCount.value) {
            pullScroll.value?.finish()
          } else {
            pullScroll.value?.success()
          }
        }, 600)
      }
    })
    .catch((err) => {
      pullScroll.value?.error()
    })
}

getActiveEventList()

async function onActivePage(row: any) {
  console.log('row', row)
  const {data}:{data:any} = await getCrowdActivityDetail({ id: row.id })
  console.log('data', data)
  const DeadlineSec = activityType.value == 1 ? data.endTimeDeadline : data.bookingDeadlineSec
  console.log('DeadlineSec', DeadlineSec)
  if (DeadlineSec == 0) {
    return uni.showToast({
      title: 'Activity has ended',
      icon: 'none',
      mask: true,
    })
  }

  if (activityType.value == 1) {
    if (row.activityType === 1) {
      uni.navigateTo({
        url: `/pages/crowRaffleDetail/crowRaffleDetail?id=${row.id}`,
      })
    } else {
      uni.navigateTo({
        url: `/pages/groupRaffleDetail/groupRaffleDetail?id=${row.id}`,
      })
    }
  } else {
    if (row.activityType === 1) {
      uni.navigateTo({
        url: `/pages/crowRaffleDetail/crowRaffleDetail?id=${row.id}&isbook=1`,
      })
    } else {
      uni.navigateTo({
        url: `/pages/groupRaffleDetail/groupRaffleDetail?id=${row.id}&isbook=1`,
      })
    }
  }
}

onReachBottom(() => {
  if (myEventsList.value.length >= totalCount.value) return
  pullScroll.value?.showUpLoading()
  pageBody.page += 1
  getActiveEventList()
})
</script>

<style lang="scss" scoped>
@import './my-events.scss';
</style>
