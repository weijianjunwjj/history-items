<template>
  <view class="dynamicItemInfoContent" :id="'post-' + currentRow.id" @click="clickDynamic">
    <view class="flex dynamicItemInfo flex-cc">
      <view class="dynamicItemInfo_left flex-cc" @click.stop="clickUser(currentRow)">
        <image
          class="contactsAdver"
          mode="aspectFill"
          :src="getAvatar(currentRow)"
        />
        <image
          class="contactsSexIcon"
          src="/static/images/system/woman.png"
          v-if="currentRow.gender == 2"
        />
        <image class="contactsSexIcon" src="/static/images/system/man.png" v-else />
      </view>
      <view class="flex-1 dynamicItemInfo_right flex-v-sa1">
        <p class="dynamicUserName two-line-text">{{ currentRow.userName }}</p>
        <p class="dynamicPublishTime">{{ fetchDateFormat(currentRow.updatedAt) }}</p>
      </view>

      <view @click.stop="onDeleteDynamic" v-if="isMe">
        <wd-icon
          name="delete1"
          size="22px"
          color="#4d4d4d"
          class="wdDunamicDelete"
          v-if="userInfoDate?.Id == currentRow.userId"
        ></wd-icon>
      </view>
    </view>
    <view class="dynamicHeadTitle">{{ currentRow.title }}</view>
    <view class="dynamicArticleContent">
      <mp-html :content="currentRow.content" />
    </view>
    <view class="dynamicTopicGroups flex-c">
      <span v-for="(vt, vi) in currentRow.linkTopic" :key="vi">#{{ vt }}</span>
    </view>
    <view class="dynamicImgVideoContent">
      <view class="imgList">
        <view class="img-list-box">
          <view class="images" v-for="(item, index) in currentRow.imgList" :key="index">
            <template v-if="item">
              <view
                v-if="!isImageURL(item)"
                :style="{
                  width: imgWidth + 'rpx',
                  height: imgHeight + 'rpx',
                  marginRight: imgTwoMargin + 'rpx',
                  marginBottom: '5px',
                  background: '#000',
                }"
              >
                <DomVideoPlayer :src="getUrl(item)" controls muted objectFit="contain" />
              </view>
              <image
                v-else
                @click.stop="previewImg(index)"
                class="oneimg"
                :src="getUrl(item)"
                mode="aspectFill"
                :style="{
                  width: imgWidth + 'rpx',
                  height: imgHeight + 'rpx',
                  marginRight: imgTwoMargin + 'rpx',
                }"
              />
            </template>
          </view>
        </view>
      </view>
    </view>

    <view class="flex-c dynamicBottomTools">
      <view class="flex-cc" @click.stop="clickThumbsup">
        <image
          v-if="currentRow.likeStatus !== 2"
          src="../../static/images/community/h.svg"
          mode="scaleToFill"
          style="width: 20px; height:20px; margin-right: 10rpx"
        />
        <image
          v-else
          src="../../static/images/community/hs.svg"
          mode="scaleToFill"
          style="width: 20px; height: 20px; margin-right: 10rpx"
        />
        {{ currentRow.likeCount ? currentRow.likeCount : '' }}
      </view>

      <view class="flex-cc" style="margin-left: 24rpx" @click="clickDiscuss">
        <image
          src="../../static/images/community/comment-svg.svg"
          mode="scaleToFill"
          style="width: 20px; height: 20px; margin-right: 10rpx"
        />
        <!-- {{ currentRow.commentCount ? currentRow.commentCount : '' }} -->
        {{ commentCountChild ? commentCountChild : '' }}
      </view>
    </view>

    <!-- 评论区主体 -->
    <view class="dynamicDiscussMajorContetn" v-if="discussFold">
      <p class="dynamicDiscussMajorContetn-headTitle">All Comments</p>

      <CComment
        ref="ccRef"
        v-model:userInfo="userInfoCommon"
        v-model:tableData="tableData"
        v-model:tableTotal="tableTotal"
        @likeFun="likeFun"
        @replyFun="replyFun"
        @deleteFun="deleteFun"
        :deleteMode="deleteMode"
        :isMe="isMe"
        :postUserId="postUserId"
        :isMyPost="isMyPost"
      ></CComment>
    </view>

    <!-- 动态详情底部发送评论 -->
    <view class="dynamicDiscussBottom flex" v-if="ifCriticDetail && !isMyPost">
      <view class="dynamicDiscussBottom_adver flex-cc">
        <image class="contactsAdver" mode="aspectFill" :src="avatar" />
      </view>
      <view class="flex-1 dynamicDiscussBottom_input flex-c">
        <wd-input
          type="text"
          v-model="selTopicValue"
          placeholder="Write a comment…"
          no-border
          class="flex-c"
          custom-class="wdCustomDiscussInput"
          @focus="wdCustomDynamicInputFocus"
        />
      </view>
      <!-- <wd-button custom-class="send_btnJoinBtn" type="info">Send</wd-button> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import CComment from '@/components/cc-comment/index.vue'
import DomVideoPlayer from '@/components/DomVideoPlayer/DomVideoPlayer.vue'
import _ from 'lodash'
import { getAvatar, getUrl } from '@/utils/utils'
import {
  CommentAddPostComment,
  CommentDel,
  CommentLike,
  getCommentPostComment,
} from '@/service/community/comment'

const { userInfo: userInfoDate, updateUserInfo }: { userInfo: any; updateUserInfo: any } =
  useUserInfo()
updateUserInfo()

const userInfoCommon = computed(() => {
  return {
    id: userInfoDate.value?.Id,
    user_name: userInfoDate.value?.nickname,
    user_avatar: userInfoDate.value?.avator,
    gender: userInfoDate.value?.gender,
  }
})

const avatar = computed(() => {
  return getAvatar(userInfoDate.value)
})

const props = defineProps({
  ifCriticDetail: {
    // 是否是评论详情
    type: Boolean,
    default: false,
  },
  discussFold: {
    // 评论折叠是否开启
    type: Boolean,
    default: false,
  },
  currentRow: {
    type: Object,
    default: () => ({
      imgList: [],
    }),
  },
  isMe: {
    type: Boolean,
    default: true,
  },
  isMyPost: {
    type: Boolean,
    default: false,
  },
  postUserId: {
    type: Number,
    default: 0,
  },
})

console.log('props.isMyPost', props.isMyPost)

const emit = defineEmits()

const windowWidth = ref(0)
const windowHeight = ref(0)
const imgWidth = ref(0)
const imgHeight = ref(0)
let imgTwoMargin = ref(0)
const selTopicValue = ref('')
let commentCountChild = ref(props.currentRow.commentCount)
let videoZIndex = ref<boolean>(false)
let viewVideoVal = ref(null) // 视频问题

function judgeImg() {
  // console.log(windowWidth.value)
  if (props.currentRow?.imgList.length == 1) {
    // imgWidth.value = (windowWidth.value * 2) / 3
    // imgHeight.value = (windowHeight.value * 3) / 5
    imgWidth.value = 360
    imgHeight.value = 448
  } else if (props.currentRow?.imgList.length == 4 || props.currentRow?.imgList.length == 2) {
    // imgWidth.value = windowWidth.value / 3.3
    // imgHeight.value = imgWidth.value
    imgWidth.value = 300
    imgHeight.value = 374
    imgTwoMargin.value = 14
  } else {
    // imgWidth.value = windowWidth.value / 3.4
    // imgHeight.value = imgWidth.value
    imgWidth.value = 204
    imgHeight.value = 204
  }
}

function wdCustomDynamicInputFocus() {
  openComment()
}
const isImageURL = (url: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i
  return imageExtensions.test(url)
}
// 点击动态
function clickDynamic() {
  emit('clickDynamic', props.currentRow)
}
// 点击用户信息
function clickUser(item) {
  emit('clickUser', item)
}

const clickThumbsup = _.debounce(() => {
  if (props.currentRow.likeStatus == 1) {
    props.currentRow.likeStatus = 2
  } else {
    props.currentRow.likeStatus = 1
  }
  props.currentRow.likeCount =
    props.currentRow.likeStatus == 2
      ? props.currentRow.likeCount + 1
      : props.currentRow.likeCount - 1
  emit('clickThumbsup', props.currentRow)
}, 200)

// 评论
function clickDiscuss() {
  emit('clickDiscuss', props.currentRow.id)
}

function onDeleteDynamic() {
  emit('clickDelete', props.currentRow.id)
}

function defaultAdverImg(sex: number) {
  if (sex == 1) {
    return '/static/images/shop/defaultMan.png'
  }
  return '/static/images/shop/defaultWoman.png'
}

function previewImg(key: number) {
  uni.previewImage({
    current: key,
    urls: props.currentRow.imgList,
    longPressActions: {
      itemList: ['save'],
    },
  })
}

function fetchDateFormat(setdateTimeStamp = '') {
  try {
    setdateTimeStamp = setdateTimeStamp.trim() || ''
    const propsDate = setdateTimeStamp.split(/\s+/)[0] || ''
    const propsTime = setdateTimeStamp.split(/\s+/)[1] || ''
    const propsYear = propsDate.trim().split('-')[0] || ''
    const propsMD = `${propsDate.trim().split('-')[1]}-${propsDate.trim().split('-')[2]}` || ''
    const prosHM = `${propsTime.trim().split(':')[0]}:${propsTime.trim().split(':')[1]}` || ''
    const myDate = new Date()
    const currentYear = myDate.getFullYear().toString()
    const currentDay = myDate.getDate().toString()

    let result = ''
    let mStr = ""

    let currentMonth = myDate.getMonth() + 1

    if (currentMonth < 10) {
      mStr = '0' + currentMonth.toString()
    } else {
      mStr = currentMonth.toString()
    }
    const currentDate = `${currentYear}-${mStr}-${currentDay}`

    // 今年
    if (propsYear === currentYear) {
      // 今天
      if (propsDate === currentDate) {
        result = prosHM
      } else {
        result = `${propsMD} ${prosHM}`
      }
    } else {
      result = `${propsDate} ${propsTime}`
    }

    return result
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  const res = uni.getSystemInfoSync()
  windowHeight.value = res.windowHeight
  windowWidth.value = res.windowWidth
  judgeImg()
  videoSetOutFun()
})

// 视频组件延迟加载
const videoSetOutFun = () => {
  videoZIndex.value = false
  setTimeout(() => {
    videoZIndex.value = true
  }, 500)
}
// 唤起新评论弹框
const ccRef = ref(null)
function openComment() {
  ccRef.value.newCommentFun()
}

// 点赞回调事件
function likeFun({ params }, callback) {
  CommentLike({ commentId: params.id, likeStatus: params.is_like ? 2 : 1 }).then((res) => {
    if (res.code === 0) {
      callback(res)
    }
  })
}

// 评论回调事件
function replyFun({ params }, callback) {
  console.log('params', params)
  commentCountChild.value = params.commentCount
  emit('updateCommentCount',props.currentRow,commentCountChild.value)
  let paramsDate = {}
  if (params.id == 10001) {
    paramsDate = {
      postId: props.currentRow.id,
      content: params.user_content,
    }
  } else {
    paramsDate = {
      parentId: params.reply_id,
      content: params.user_content,
    }
  }
  CommentAddPostComment(paramsDate).then((res) => {
    if (res.code === 0) {
      callback(res.data)
    }
  })
}

const deleteMode = ref('all')
function deleteFun({ params, mode }, callback) {
  switch (deleteMode as any) {
    case 'bind':
      // 逻辑: 调用接口进行评论内容修改 update
      setTimeout(() => callback(), 500) // 目前为了展示效果, 直接执行callback
      break
    case 'only':
      // 逻辑: 调用接口删除一个评论 delete
      setTimeout(() => callback(), 500) // 目前为了展示效果, 直接执行callback
      break
    default:
      CommentDel({ id: params[0] }).then((res) => {
        if (res.code === 0) {
          callback(res)
        }
      })
      break
  }
}


watch(() => props.currentRow.commentCount, (commentCount) => {
  tableTotal.value=commentCount
})

const tableTotal = ref(props.currentRow.commentCount) // 评论总数
watch(
  () => tableTotal.value,
  (newVal) => {
    console.log('tableTotal.value', tableTotal.value)
    commentCountChild.value = newVal
    emit('updateCommentCount',props.currentRow,commentCountChild.value)
  },
)



const pageBody = reactive({
  page: 1,
  pageSize: 10,
})
const totalCount = ref(0)
const totalPage = ref(0)

const tableData = ref([])
const getCommentPostCommentList = () => {
  getCommentPostComment({ ...pageBody, postId: props.currentRow.id }).then((res: any) => {
    if (res.code === 0) {
      let newCustomArray = []
      res.data.list?.forEach((item) => {
        newCustomArray.push({
          id: item.commentId,
          parent_id: item.ancestorId == 0 ? null : item.ancestorId,
          reply_id: item.replyId == 0 ? null : item.replyId,
          reply_name: item.replyUserName,
          user_id: item.userId,
          user_name: item.userName,
          user_avatar: getAvatar({ avatar: item.avator, gender: item.gender }),
          user_content: item.content,
          like_count: item.likeCount,
          create_time: item.replyTime,
          is_like: item.likeStatus == 2 ? true : false,
          commentCount: item.commentCount,
          level: item.level,
        })
      })

      tableData.value = [...tableData.value, ...newCustomArray]
      totalCount.value = res.data.count
      totalPage.value = res.data.totalPage
    }
  })
}

defineExpose({ onCustomReachBottom })

function onCustomReachBottom() {
  if (totalPage.value <= pageBody.page) return
  pageBody.page += 1
  getCommentPostCommentList()
}

onLoad(() => {
  //详情 获取评论数据
  if (props.discussFold) {
    getCommentPostCommentList()
  }
})
</script>

<style lang="scss" scoped>
.dynamicItemInfoContent {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  padding-bottom: 36rpx;
  box-sizing: border-box;

  .dynamicItemInfo {
    position: relative;

    .wdDunamicDelete {
      position: absolute;
      top: 0;
      right: 0;
    }

    .dynamicItemInfo_left {
      position: relative;
      width: 78rpx;
      height: 78rpx;
      border-radius: 50%;

      .contactsAdver {
        width: 78rpx;
        height: 78rpx;
        border-radius: 50%;
      }

      .contactsSexIcon {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        right: -4rpx;
        bottom: -6rpx;
      }
    }

    .dynamicItemInfo_right {
      margin-left: 16rpx;

      .dynamicUserName {
        font-weight: 600;
        font-size: 32rpx;
        color: #404040;
        width: 230px;
      }

      .dynamicPublishTime {
        font-weight: 400;
        font-size: 24rpx;
        color: #404040;
      }
    }
  }

  .dynamicHeadTitle {
    font-weight: 600;
    font-size: 32rpx;
    color: #313131;
    margin-top: 24rpx;
    margin-bottom: 14rpx;
  }

  .dynamicArticleContent {
    font-weight: 500;
    font-size: 30rpx;
    color: #404040;
    line-height: 35rpx;
  }

  .dynamicTopicGroups {
    flex-wrap: wrap;

    span {
      font-weight: 500;
      font-size: 28rpx;
      color: #00dba1;
      margin-top: 14rpx;
      margin-right: 10rpx;
    }
  }

  .dynamicImgVideoContent {
    margin-top: 14rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .images {
      // margin-right: 10rpx;
      display: inline-block;
    }

    .oneimg {
      margin-bottom: 10rpx;
    }
  }

  .dynamicBottomTools {
    margin-top: 24rpx;
    justify-content: flex-end;
    font-weight: 500;
    font-size: 30rpx;
    color: #404040;
  }

  .dynamicDiscussMajorContetn {
    border-top: 2rpx solid #efefef;
    padding-top: 36rpx;
    margin-top: 36rpx;
    box-sizing: border-box;
    transition: all 1s;

    &-headTitle {
      font-weight: 500;
      font-size: 32rpx;
      color: #404040;
    }

  }

  :deep(.dynamicDiscussMajorContetn) {
	  .c_comment .children_item{
	  	padding-right: 0 !important;
	  }
  }

  .dynamicDiscussBottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 158rpx;
    background: #ffffff;
    padding: 16rpx 28rpx;
    box-sizing: border-box;

    // padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
    // padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
    .dynamicDiscussBottom_adver {
      width: 64rpx;
      height: 64rpx;

      .contactsAdver {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
      }
    }

    .dynamicDiscussBottom_input {
      margin-left: 16rpx;
      height: 64rpx;
      background: #f7f7f7;
      border-radius: 12rpx;
      padding-left: 20rpx;
      box-sizing: border-box;

      .wdCustomDiscussInput {
        width: 100%;
        height: 100%;
        background: none;
      }
    }

    .send_btnJoinBtn {
      margin-left: 10rpx;
      width: 120rpx;
      height: 60rpx;
      min-width: 120rpx;
      background: #00dba1;
      font-weight: 500;
      font-size: 28rpx;
      color: #ffffff;
      border-radius: 10rpx;
    }
  }

  .chat-icon-box {
    position: relative;
  }

  .img-list-box {
    max-width: 630rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
