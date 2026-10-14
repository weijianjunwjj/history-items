<route lang="json5">
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
  <div>
    <Title text="Follow" :white="false" style="background-color: #fff" />
    <List :showTitle="false" emptyTip="Follow are empty" :user-list="userList" @follow="onFollow" @unFollow="onUnFollow" />
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import List from './components/List.vue'
import { followUser, unFollowUser } from '@/service/search/search'
import { useToast } from 'wot-design-uni'
import {  getUserIndex } from '@/service/person-page/person-page'
import { useUserStore } from '@/store/user'

const toast = useToast()
const userList = ref([])

const onUnFollow = debounce(async (item) => {
  const userId: number = item.id
  await unFollowUser(userId)
  toast.show('Unfollow success')
  item.relation = 0
}, 200)
const onFollow = debounce(async (item) => {
  const userId: number = item.id
  const { data } = await followUser(userId)
  toast.show('follow success')
  item.relation = data || 1
}, 200)

const pages = reactive({
  page: 1,
  pageSize: 20,
})

const userId: any = ref()


const query = async () => {
  const p = {
    ...pages,
    userId: userId.value,
  }
  const res:any = await getUserIndex(p)
  console.log('res', res)
  userList.value=res.data.list
}

onLoad((options) => {
  userId.value = +options.id
  query()
})
</script>

<style scoped></style>
