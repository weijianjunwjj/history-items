<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Post',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="communityDetailContainer">
    <Dynamic
      style="margin-bottom: 16rpx"
      :ifCriticDetail="true"
      :discussFold="true"
      :currentRow="detail"
      @clickThumbsup="clickThumbsup"
      @clickDelete="clickDelete"
      @updateCommentCount="updateCommentCount"
      v-if="detail?.id"
      :isMe="isMe"
      :isMyPost="isMyPost"
      :postUserId="postUserId"
      ref="dynamicRef"
    />
  </view>
</template>

<script lang="ts" setup>
import Dynamic from '@/components/Dynamic/Dynamic.vue'
import { getPostDetail, onPostDel, onPostLike } from '@/service/community/community'
import dayjs from 'dayjs'
import { useToast, useMessage } from 'wot-design-uni'
import { getUrl } from '@/utils/utils'
import { usePostStore } from '@/store/post'

const postStore = usePostStore()

const message = useMessage()
const toast = useToast()

const isMe = ref(true)
const isMyPost = ref(false)
const postUserId = ref(0)

function clickThumbsup(row: any) {
  const { likeStatus, likeCount } = row
  onPostLike({ postId: row.id, likeStatus: row.likeStatus })
  postStore.updatePostLike(type.value, row.id, { likeStatus, likeCount })
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
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/community/community',
            })
          }, 1200)
        }
      })
    })
}

function updateCommentCount(row, commentCount) {
  console.log('row', row)
  console.log('commentCount', commentCount)
  postStore.updatePostLike(type.value, row.id, { commentCount })
}

const dynamicRef = ref()

onReachBottom(() => {
  dynamicRef.value.onCustomReachBottom()
})

const detail: any = ref({})
const type = ref('')

onLoad(async (optios) => {
  console.log('optios', optios)
  const { id, isMe: _isMe, isMyPost: _isMyPost } = optios
  if (_isMe == '0') {
    isMe.value = false
  }
  if (_isMyPost == 'true') {
    isMyPost.value = true
  }
  if (optios.type) {
    type.value = optios.type
  }

  const res: any = await getPostDetail(id)
  if (res.code === 0) {
    res.data.imgList = res.data.mediaUrl?.split(',').map((v) => getUrl(v))
    res.data.publishTime = dayjs(res.data.createdAt).valueOf()
    detail.value = res.data
    const { commentCount, likeStatus, likeCount } = detail.value
    const postList = postStore.postLists[optios.type]
    let targetPost = postList.find((item) => item.id == id)
    targetPost = { ...targetPost, commentCount, likeStatus, likeCount }
    const indexPost = postList.findIndex((item) => item.id == id)
    postList[indexPost]=targetPost
    postStore.setPosts(optios.type,postList)
    postUserId.value = res.data.userId
  }
})
</script>

<style lang="scss" scoped>
@import './communityDetail.scss';
</style>
