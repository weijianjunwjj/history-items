<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="search">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <div class="page-search" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <SearchBar v-model:searchVal="searchVal" @search="onSearch" @clear="onClear" />
    <SearchHistory v-if="isShowHistory" @search="onSearch2" />
    <SearchResults v-else :user-list="userList" @follow="onFollow" @unFollow="onUnFollow" />
  </div>
</template>

<script setup lang="ts">
import SearchResults from './components/SearchResults.vue'
import SearchHistory from './components/SearchHistory.vue'
import SearchBar from './components/SearchBar.vue'
import { getSearchIndex, followUser, unFollowUser } from '@/service/search/search'
import { debounce } from 'lodash'
import { useToast } from 'wot-design-uni'
import { addSearchRecord } from './hooks'

const { safeAreaInsets } = uni.getSystemInfoSync()
const toast = useToast()

const isShowHistory = ref(true)
const userList = ref([])
const searchVal = ref('')

const onSearch = async (searchValue) => {
  console.log('searchValue', searchValue)
  if (typeof searchValue === 'string') {
    isShowHistory.value = false
    addSearchRecord(searchValue)
    const res: any = await getSearchIndex({
      keyword: searchValue,
      page: 1,
      pageSize: 10,
    })
    console.log('res.data', res.data)
    userList.value = res.data.list
  }
}

function onSearch2(searchValue) {
  searchVal.value = searchValue
  onSearch(searchValue)
}

const onUnFollow = debounce(async (item) => {
  const userId: number = item.userId
  await unFollowUser(userId)
  toast.show('Unfollow success')
  item.relation = 0
}, 200)
const onFollow = debounce(async (item) => {
  const userId: number = item.userId
  const {data}=await followUser(userId)
  toast.show('follow success')
  item.relation =data || 1
}, 200)

function onClear() {
  isShowHistory.value = true
}
</script>

<style lang="scss" scoped>
$safeAreaBottom: env(safe-area-inset-bottom, 20px);
$safeAreaTop: env(safe-area-inset-top, 20px);

.page-search {
  background: #fff;
  height: calc(95vh - #{$safeAreaBottom} - #{$safeAreaTop});
}
</style>
