<route lang="json5">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '社区',
    'app-plus': {
      titleNView: false,
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <view class="communityContainer">
    <view class="status_bar"></view>
    <view class="adverSpaceInfoBox plr-28">
      <SwiperAd :adId="'5_5_2'"></SwiperAd>
    </view>

    <view class="activityMajorContent flex plr-28" v-if="activityBookingList.length > 0">
      <view
        class="activityItemsInfo"
        v-for="(item, index) in activityBookingList"
        :key="index"
        @click="onClickActivityBooking(item)"
      >
        <view class="activityBanner">
          <image :src="getUrl(item.banner)" class="actBanner_img" />
        </view>
        <view class="activityTextInfo flex-sb-c">
          <view>
            <p class="activityName ellipsis">{{ item.name }}</p>
            <p class="activityJoinNum">{{ item.participants }} people join</p>
          </view>
          <view>
            <wd-button custom-class="activityJoinBtn" type="info">Go Now</wd-button>
          </view>
        </view>
      </view>
    </view>

    <view
      class="communityDynamiContent"
      id="communityDynamiContent"
      :class="isScroll ? 'communityDynamiContent2' : 'communityDynamiContent1'"
    >
      <wd-tabs
        v-model="productTabValue"
        @click="handlewdTabClick"
        color="#404040"
        inactiveColor="#404040"
      >
        <block v-for="(item, index) in productTabClassify" :key="index">
          <wd-tab :title="`${item.name}`"></wd-tab>
        </block>
      </wd-tabs>
    </view>

    <view class="dynamicListContainer plr-28" v-if="postList.length">
      <cc-pullScroolView
        class="pullScrollView"
        ref="pullScroll"
        :pullDown="pullDown"
        :upFinishText="!showLoading ? `No more for now` : ''"
        pullingText="Pull to refresh"
        loosingText="Release refresh"
        downLoadingText="refresh..."
        upLoadingText="loading..."
        downSuccessText="Refresh successfully"
        downErrorText="Refresh failure"
        upErrorText="If loading fails, click Reload"
      >
        <view class="flex-cc w-full mt-6" v-show="showLoading">
          <wd-loading color="#00dba1" />
        </view>

        <template v-if="!showLoading">
          <Dynamic
            v-for="(item, index) in postList"
            style="margin-bottom: 16rpx"
            @clickDynamic="clickDynamic"
            @clickDiscuss="clickDiscuss(item.id, index)"
            @clickThumbsup="clickThumbsup"
            @clickDelete="clickDelete"
            @clickUser="onClickUser"
            :discussFold="item.discussFold"
            :key="index"
            :currentRow="item"
            :isMe="false"
            :isMyPost="getIsReallyMe(item)"
          />
        </template>
      </cc-pullScroolView>
    </view>
    <Empty v-else />

    <view
      class="pulishBtnInfoBox"
      :style="{ bottom: fixedBottom + 10 + 'px' }"
      @click="toPage('/pages/publishLive/publishLive')"
    >
      <image src="/static/images/community/publishbtnImg.png" class="publish_icon" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import {getUrl, toPage,openScreenshots, closeScreenshots} from '@/utils/utils'
import Dynamic from '@/components/Dynamic/Dynamic.vue'
import {getActivityBookingList, getPostCommunityList, onPostDel, onPostLike} from '@/service/community/community'
import dayjs from 'dayjs'
import {useMessage, useToast} from 'wot-design-uni'
import {debounce, throttle} from 'lodash'
import {usePostStore} from '@/store/post'
import Empty from '@/components/Empty/Empty.vue'
import SwiperAd from '@/components/swiper-ad/swiper-ad.vue'
import eventBus from '@/utils/eventBus'

const isScroll = ref(false)
const postStore = usePostStore()
const productTabValue = ref(0)
const productTabClassify = ref([
  { name: 'Recommend', id: 1 },
  { name: 'Follow', id: 2 },
])
const type = computed(() => {
  return productTabClassify.value[productTabValue.value].name
})
const postList = computed(() => {
  return postStore.postLists[type.value]
})

function clear() {
  postStore.clear(type.value)
}

const message = useMessage()
const toast = useToast()

const { userInfo } = useUserInfo()
const showLoading = ref(false)
function getIsReallyMe(item) {
  const IsMyPost = item.userId === userInfo.value.Id
  return IsMyPost
}

const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const pullScroll = ref()
const postType = ref(1)
const dataPullisFlag = ref(true) //加载更多请求锁

// 下拉刷新
function pullDown() {
  clear()
  pageBody.page = 1
  dataPullisFlag.value = true
  maxDistance.value = 5
  getCommunityList()
}

onReachBottom(() => {
  if (!dataPullisFlag.value) return
  pullScroll.value.showUpLoading()
  pageBody.page += 1
  getCommunityList()
})

function onClickActivityBooking(item: any) {
  if (item.activityType === 1) {
    uni.navigateTo({
      url: `/pages/crowRaffleDetail/crowRaffleDetail?id=${item.id}&isbook=1`,
    })
  } else {
    uni.navigateTo({
      url: `/pages/groupRaffleDetail/groupRaffleDetail?id=${item.id}&isbook=1`,
    })
  }
  //1 众筹 2拼团
}

function clickDynamic(row: any) {
  uni.navigateTo({
    url: `/pages/communityDetail/communityDetail?id=${row.id}&isMe=0&isMyPost=${getIsReallyMe(row)}&type=${type.value}`,
  })
}

function onClickUser(item) {
  console.log('item', item)
  uni.navigateTo({
    url: '/pages/person-page/person-page?id=' + item.userId,
  })
}

function clickDiscuss(id: any, index: any) {}

function clickThumbsup(row: any) {
  onPostLike({ postId: row.id, likeStatus: row.likeStatus })
}

function clickDelete(rowid: number) {
  message
    .confirm({
      msg: 'Are you sure you want to delete this dynamic?',
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      closeOnClickModal: false,
    })
    .then(() => {
      onPostDel({ id: rowid }).then((res: any) => {
        if (res.code === 0) {
          toast.success('successfully delete')
          getCommunityList()
        }
      })
    })
}

function handlewdTabClick(e: any) {
  pageBody.page = 1
  pageBody.maxDistance = 5
  postType.value = productTabClassify.value[e.index].id
  clear()
  showLoading.value = true
  getCommunityList()
}

const activityBookingList = ref([])

const getActivityList = () => {
  getActivityBookingList({ page: 1, pageSize: 2 }).then(async (res: any) => {
    if (res.code === 0) {
      activityBookingList.value = res.data.list
      await nextTick()
      queryTop()
    }
  })
}

const maxDistance = ref(5)
const getCommunityList = debounce(() => {
  getPostCommunityList({
    ...pageBody,
    postType: postType.value,
    minDistance: 0,
    maxDistance: maxDistance.value,
  }).then((res: any) => {
    if (res.code === 0) {
      if (res.data?.list && res.data.list?.length > 0) {
        dataPullisFlag.value = true
        maxDistance.value = res.data.maxDistance
        totalCount.value = res.data.count
        pageBody.page = res.data.page

        res.data.list.forEach((item) => {
          item.imgList = item.mediaUrl ? item.mediaUrl?.split(',').map((v) => getUrl(v)) : []
          item.publishTime = dayjs(item.createdAt).valueOf()
          item.discussFold = false
        })

        let currentAllHistoryList: any = []
        let currentHistortLength = postList.value.length

        currentAllHistoryList = [...postList.value, ...res.data.list]
        let map: any = new Map()
        for (let item of currentAllHistoryList) {
          if (!map.has(item.id)) {
            map.set(item.id, item)
          }
        }
        let arr = [...map.values()]
        postStore.setPosts(type.value, arr)
        if (arr.length == currentHistortLength) {
          pageBody.page += 1
          getCommunityList()
        }

        setTimeout(() => {
          if (pageBody.page * 10 >= totalCount.value) {
            pullScroll.value.finish()
          } else {
            pullScroll.value.success()
          }
          showLoading.value = false
        }, 300)
      } else {
        totalCount.value = 0
        dataPullisFlag.value = false
        pullScroll.value.finish()
        showLoading.value = false
      }
    }
  })
}, 300)

const fixedBottom = ref(50)

function init() {
  getActivityList()
  // getAdverSement()
  uni.getSystemInfo({
    success: function (info) {
      let bottomBarHeight = info.safeAreaInsets.bottom
      fixedBottom.value = bottomBarHeight
    },
  })
}

onShow(() => {
  init()
  closeScreenshots()
})

onHide(() => {
  openScreenshots()
})

onMounted(() => {
  eventBus.on('refresh_clist', (payload) => {
    console.log('收到事件数据:', payload)
    pullDown()
  })
})

onUnmounted(() => {
  // 组件销毁时移除监听器，避免内存泄漏
  eventBus.off('refresh_clist')
})

onMounted(() => {
  showLoading.value = true
  getCommunityList()
})

const scrollTopL = ref(0)

function queryTop() {
  uni.getSystemInfo({
    success: (systemInfo) => {
      // 获取状态栏高度
      const statusBarHeight = systemInfo.statusBarHeight

      // 创建节点选择器
      const query = uni.createSelectorQuery()
      query
        .select('#communityDynamiContent') // 替换为你的节点 id
        .boundingClientRect((rect) => {
          console.log('rect', rect)
          if (rect) {
            // 节点到页面顶部的距离
            const nodeTop = rect.top

            // 总距离 = 状态栏高度 + 节点到页面顶部的距离
            const totalDistance = statusBarHeight + nodeTop
            scrollTopL.value = totalDistance
            console.log('节点到屏幕顶部的距离:', totalDistance)
          } else {
            console.error('未找到指定节点')
          }
        })
        .exec()
    },
    fail: (err) => {
      console.error('获取系统信息失败:', err)
    },
  })
}

onPageScroll(
  throttle((opt): any => {
    const { scrollTop } = opt
    if (opt.scrollTop > scrollTopL.value) {
      isScroll.value = true
    } else {
      isScroll.value = false
    }
  }, 100),
)
</script>

<style lang="scss" scoped>
@import './community.scss';
.communityDynamiContent1 {
  padding-top: 24rpx;
}
.communityDynamiContent2 {
  position: fixed !important;
  top: 0;
  width: 100%;
  padding-top: var(--status-bar-height);
  background-color: #00dba1;
  z-index: 1998;
  :deep(.wd-tabs .wd-tabs__line) {
    background-color: #fff !important;
  }
}

.plr-28 {
  padding-left: 28rpx;
  padding-right: 28rpx;
}
</style>
