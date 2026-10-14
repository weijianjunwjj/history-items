<template>
  <div class="SearchResults pt-1 plr-5">
    <view class="content mt-1">
      <view
        class="ptb-5  flex-sb-c"
        v-for="(item, index) in userList"
        :key="index"
        @click="onClick(item)"
      >
        <view class="flex-sb-c">
          <view class="rel" style="width: 102rpx; height: 102rpx">
            <image
              :src="
                item.avator
                  ? getUrl(item.avator)
                  : item.gender == 1
                    ? DefaultAvatarMan
                    : DefaultAvatarWoman
              "
              style="width: 102rpx; height: 102rpx"
              class="circle"
            />
            <view class="pos-absolute right-0 bottom-0">
              <image
                v-if="item.gender == 1"
                src="../../../static/images/index/man.png"
                style="width: 32rpx; height: 32rpx"
              />
              <image
                v-else
                src="../../../static/images/index/woman.png"
                style="width: 32rpx; height: 32rpx"
              />
            </view>
          </view>
          <view class="flex flex-col flex-justify-between ml-6">
            <view class="c-40 fs-32 fw-800 two-line-text">{{ item.nickname }}</view>
            <view class="fs-28 two-line-text" style="width: 440rpx;">{{ item.sign }}</view>
            <view class="fs-24">ID:{{ item.id }}</view>
          </view>
        </view>

        <view v-if="item.id !== userId">
          <image
            v-if="item.relation == 0"
            src="../../../static/images/index/unfollowed.png"
            style="width: 57rpx; height: 51rpx"
            @click.stop="onFollow(item)"
          />
          <image
            v-else-if="item.relation == 3"
            src="../../../static/images/index/follow2.png"
            style="width: 51rpx; height: 45rpx"
            @click.stop="onUnFollow(item)"
          />
          <image
            v-else-if="item.relation == 1"
            src="../../../static/images/index/followed.png"
            style="width: 48rpx; height: 31rpx"
            @click.stop="onUnFollow(item)"
          />
        </view>
      </view>

      <wd-status-tip
        v-if="!userList.length"
        :image="getUrl('admin/2024-10-30/574f7669-1f19-4936-a3c6-4e35bd7d2dbf.png')"
        :tip="emptyTip"
      />
    </view>
  </div>
</template>

<script setup lang="ts">
import { getUrl } from '@/utils/utils'
import { DefaultAvatarMan, DefaultAvatarWoman } from '@/config'
import { useUserStore } from '@/store/user'

const props = defineProps({
  userList: Array,
  showTitle:{
    type:Boolean,
    default:true
  },
  emptyTip:{
    type:String,
    default:'Followers list is empty'
  }
})

const emit = defineEmits()

const store = useUserStore()
const userId = computed(() => {
  return store.userInfo.Id
})

function onFollow(item) {
  console.log('item', item)
  emit('follow', item)
}
function onUnFollow(item) {
  emit('unFollow', item)
  console.log('unFollow', item)
}

function onClick(item: any) {
  console.log('item', item)
  if (item.userId) {
    uni.navigateTo({
      url: '/pages/person-page/person-page?id=' + item.userId,
    })
  }
}
</script>

<style lang="scss">
.SearchResults {
  .btns {
    border-radius: 24rpx 24rpx 24rpx 24rpx !important;
    border: 2rpx solid #dfdfdf !important;
  }
}
</style>
