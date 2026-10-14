<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="home-page">
    <SearchBar
      :search="search"
      @focus="onSearchFocus"
      @blur="onSearchBlur"
      @search="onSearch"
      @click="onClickInput"
      @showFilterPopup="showFilterPopup = true"
    />

    <UserList :avatarUserList="avatarUserList" />
    <RecommendCard :recommendUserList="recommendUserList" />
    <FilterPopup v-model:show="showFilterPopup" @filter="onFilter" />
  </view>
</template>

<script lang="ts" setup>
import SearchBar from './components/SearchBar.vue'
import FilterPopup from './components/FilterPopup.vue'
import UserList from './components/UserList.vue'
import RecommendCard from './components/RecommendCard.vue'
import {getHomeIndex, getHomeUser} from '@/service/index'
import {closeScreenshots, getUrl, openScreenshots} from '@/utils/utils'

const { safeAreaInsets } = uni.getSystemInfoSync()

const showFilterPopup = ref(false)
const searchStatus = ref(2) // 0-未搜索，1-待搜索，2-已搜索
const avatarUserList = ref([])
const recommendUserList = ref([])
const defaultParams = {
  gender: 0,
  rangeAge: [],
  distance: [],
}

const search = computed(() => ({
  noSearch: searchStatus.value === 0,
  awaitSearch: searchStatus.value === 1,
  searched: searchStatus.value === 2,
}))
const isScroll = ref(false)

function onSearchFocus() {
  // uni.navigateTo({
  //   url: '/pages/search/search',
  // })
}
function onClickInput() {
  uni.navigateTo({
    url: '/pages/search/search',
  })
}
function onSearchBlur() {
  searchStatus.value = 0
}
function onSearch() {
  searchStatus.value = 2
}

function onFilter(params) {
  console.log('params', params)
  getRecommendUserList(params)
  showFilterPopup.value = false
}

const getRecommendUserList = async (params?) => {
  const par = params || defaultParams
  const { data }: { data: any } = await getHomeIndex(par)
  console.log('data1', data)
  recommendUserList.value = data
}

const handleGetHomeUser = async () => {
  const { data }: { data: any } = await getHomeUser()
  console.log('data', data)
  avatarUserList.value = data.map((item) => {
    return {
      ...item,
      avatar: getUrl(item.avatar),
    }
  })
  // avatarUserList.value = [...avatarUserList.value, ...avatarUserList.value, ...avatarUserList.value, ...avatarUserList.value]
  console.log('avatarUserList.value', avatarUserList.value)
}

onMounted(() => {
  getRecommendUserList()
  handleGetHomeUser()
})

onShow(() => {
  closeScreenshots()
})

onHide(() => {
  console.log('离开首页')
  openScreenshots()
})
</script>

<style lang="scss">
.home-page {
  background: linear-gradient(180deg, rgba(0, 219, 161, 0.05) 0%, rgba(0, 219, 161, 0) 26%), #f6f6f6;
  margin-bottom: 30rpx;
}
</style>
