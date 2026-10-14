<template>
  <view class="comment_item">
    <view class="top">
      <view class="top_left">
        <image
          :class="level == 2 ? 'user_avatar_s': 'user_avatar'"
          mode="aspectFill"
          :src="props.data?.user_avatar ? getUrl(props.data.user_avatar) : defaultUserAdver"
        />
        <uni-tag
          v-if="props.data.owner"
          class="tag"
          type="primary"
          :inverted="false"
          text="author"
          size="mini"
          circle
        />
        <span class="user_name">{{ props.data.user_name }}</span>
        <span class="user_name">{{ cReplyName }}</span>
      </view>

      <view class="top_right" @click="likeClick(props.data)">
          <image
            v-if="!props.data.is_like"
            src="../../../static/images/community/h.svg"
            mode="scaleToFill"
            style="width: 32rpx; height: 32rpx;"
          />
          <image
            v-else
            src="../../../static/images/community/hs.svg"
            mode="scaleToFill"
            style="width: 32rpx; height: 32rpx;"
          />
        <span :class="[props.data.is_like ? 'active' : cLikeCount == 0 ? 'isnone' : '', 'like_count']">
          {{ cLikeCount }}
        </span>
      </view>
    </view>

    <view class="content" @click="replyClick(props.data)">
      {{ c_content }}
      <span class="shrink" v-if="isShrink" @click.stop="expandContentFun(props.data.user_content)">
        ...view more
      </span>
    </view>
    <view class="bottom">
      <span class="create_time">{{ props.data.create_time }}</span>
      <!-- <span v-if="props.data.owner" class="delete" @click="deleteClick(props.data)">del</span> -->
      <!-- <span v-else class="reply" @click="replyClick(props.data)"
        >回复</span
      > -->
    </view>
  </view>
</template>

<script setup>
import { getUrl } from '@/utils/utils'

const { userInfo: userInfoDate } = useUserInfo()

const defaultUserAdver =
  userInfoDate?.gender == 1
    ? '/static/images/shop/defaultMan.png'
    : '/static/images/shop/defaultWoman.png'

// const defaultUserAdver = gender == 1 ? '/static/images/shop/defaultMan.png' : '/static/images/shop/defaultWoman.png'

const props = defineProps({
  // 评论数据
  data: {
    type: Object,
    default: () => {},
  },
  level: {
    type: Number,
    default: () => {return 0;}
  },
  // 父级评论数据
  pData: {
    type: Object,
    default: () => {},
  },
})

// 被回复人名称
const cReplyName = computed(() => {
  return props.data?.reply_name ? ` ▸ ` + props.data?.reply_name : ''
})

// 点赞数显示
const cLikeCount = computed(() => {
  return props.data.like_count > 99 ? '99+' : props.data.like_count
})

// 评论过长处理
let contentShowLength = 70 // 默认显示评论字符

let user_content = props.data.user_content
let isShrink = ref(user_content.length > contentShowLength) // 是否收缩评论
let c_content = ref('')
watch(
  () => isShrink.value,
  (newVal) => {
    c_content.value = newVal ? user_content.slice(0, contentShowLength + 1) : user_content
  },
  {
    immediate: true,
  },
)
// 删除变更显示定制
watch(
  () => props.data.user_content,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      c_content.value = newVal
    }
  },
)

// 展开评论
function expandContentFun() {
  isShrink.value = false
}

const emit = defineEmits(['likeClick', 'replyClick', 'deleteClick'])

// 点赞
function likeClick(item) {
  emit('likeClick', item)
}

// 回复
function replyClick(item) {
  // 自己不能回复自己
  if (item.owner) return
  emit('replyClick', item)
}

// 删除
function deleteClick(item) {
  emit('deleteClick', item)
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  align-items: center;
}
.ellipsis {
  overflow: hidden; //超出文本隐藏
  white-space: nowrap; //溢出不换行
  text-overflow: ellipsis; //溢出省略号显示
}

.comment_item {
  font-size: 28rpx;
  .top {
    @extend .center;
    justify-content: space-between;
    .top_left {
      display: flex;
      align-items: center;
      overflow: hidden;
      .user_avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 12rpx;
      }
      .user_avatar_s {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 12rpx;
      }
      .tag {
        margin-right: 6rpx;
      }
      .user_name {
        @extend .ellipsis;
        max-width: 180rpx;
        color: $uni-text-color-grey;
      }
    }
    .top_right {
      // @extend .center;
      .like_count {
        display: block;
        text-align: center;
        font-size: 24rpx;
        font-weight: 400;
        color: $uni-text-color-grey;
        color: #404040;
        &.isnone {
          color: #fff;
        }
      }
    }
  }
  .content {
    padding: 10rpx;
    margin-left: 70rpx;
    color: $uni-text-color;
    &:active {
      background-color: $uni-bg-color-hover;
    }
    .shrink {
      padding: 20rpx 20rpx 20rpx 0rpx;
      color: #00dba1;
    }
  }
  .bottom {
    padding-left: 80rpx;
    font-size: 24rpx;
    .create_time {
      color: $uni-text-color-grey;
    }
    .delete {
      padding: 20rpx 20rpx 0 20rpx;
      color: $uni-border-color;
    }
    .reply {
      color: $uni-color-primary;
    }
  }
}
</style>
