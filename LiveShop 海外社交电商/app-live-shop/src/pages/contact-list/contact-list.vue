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
  <Title text="Contact List" :white="false" style="background-color: #fff;">
    <template #suffix>
      <image
        src="/static/images/contact-list/search.png"
        style="width: 40rpx; height: 40rpx"
        @click="toPage('/pages/search/search')"
      />
    </template>
  </Title>
  <view class="myMessagesContainer">
    <view class="tabListCub flex-sb-c">
      <view
        class="tabItem flex flex-vc"
        :class="{ activeTab: item.checked }"
        v-for="(item, index) in tabListDate"
        :key="index"
        @click="onTabCheckChange(item)"
      >
        <image class="tabIcon" :src="item.checkimg" v-show="item.checked" />
        <image class="tabIcon" :src="item.img" v-show="!item.checked" />
        <p>{{ item.title }}</p>
      </view>
    </view>
    <FriendsList v-if="activityType==1" />
    <FollowerList v-if="activityType==2" />
    <FollowList v-if="activityType==3" />
  </view>
</template>

<script lang="ts" setup>
import {toPage} from '@/utils/utils'
import FriendsList from './components/FriendsList.vue'
import FollowList from './components/FollowList.vue'
import FollowerList from './components/FollowerList.vue'
import {useNimStore} from "@/store";

const nim = useNimStore().instance;
const tabListDate = reactive([
  {
    img: '/static/images/my-messages/mufriends.png',
    checkimg: '/static/images/my-messages/checkmufriends.png',
    title: 'Mutual Friends',
    checked: true,
    id: 1,
  },
  {
    img: '../../static/images/contact-list/follower.png',
    checkimg: '../../static/images/contact-list/follower-checked.png',
    title: 'Follower',
    checked: false,
    id: 2,
  },
  {
    img: '../../static/images/contact-list/follow.png',
    checkimg: '../../static/images/contact-list/follow-checked.png',
    title: 'Follow',
    checked: false,
    id: 3,
  },
])
const activityType = ref(1)


function onTabCheckChange(row: any) {
  tabListDate.map((r) => (r.checked = false))
  row.checked = true
  activityType.value = row.id
}

</script>

<style lang="scss" scoped>
@import './contact-list.scss';
</style>
