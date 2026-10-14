<template>
  <!-- <view class="c_total">评论 {{ props.tableTotal }}</view> -->
  <template v-if="dataList && dataList.length">
    <view class="c_comment" v-for="(item1, index1) in dataList" :key="item1.id">
      <!-- 一级评论 -->
      <CommonComp
        :data="item1"
        @likeClick="() => likeClick({ item1, index1 })"
        @replyClick="() => replyClick({ item1, index1 })"
        @deleteClick="() => deleteClick({ item1, index1 })"
      />
      <view class="children_item" v-if="item1.children && item1.children.length">
        <!-- 二级评论 -->
        <CommonComp
          v-for="(item2, index2) in uniqBy(item1.childrenShow, 'id')"
          :key="item2.id"
          :data="item2"
          :level="2"
          :pData="item1"
          @likeClick="() => likeClick({ item1, index1, item2, index2 })"
          @replyClick="() => replyClick({ item1, index1, item2, index2 })"
          @deleteClick="() => deleteClick({ item1, index1, item2, index2 })"
        />
        <!-- 展开折叠的二级评论 -->
        <view
          class="expand_reply flex-c"
          v-if="expandTxtShow({ item1, index1 })"
          @click="() => expandReplyFun({ item1, index1 })"
        >
          <span class="txt" v-if="item1.childrenShow.length <= 1">
            <!-- view more {{ item1.children.length - item1.childrenShow.length }}strip reply -->
            View More Comments
          </span>
          <uni-icons type="down" size="10" color="#00DBA1" v-if="item1.childrenShow.length <= 1"></uni-icons>
        </view>
      </view>
    </view>
  </template>
  <!-- 空盒子 -->
  <view class="empty_box" v-else-if="!isMyPost">
    <uni-icons type="chatboxes" size="36" color="#c0c0c0"></uni-icons>
    <view>
      <span class="txt">There's nothing here,</span>
      <span class="txt click" @click.stop="() => newCommentFun()">Write a comment...</span>
    </view>
  </view>
  <!-- 评论弹窗 -->
  <uni-popup ref="cPopupRef" type="bottom" @change="popChange">
    <view class="c_popup_box">
      <view class="reply_text">
        <template v-if="Object.keys(replyTemp).length">
          <span class="text_aid">Reply Give:</span>
          <span class="text_main">
            {{ replyTemp.item2 ? replyTemp.item2.user_name : replyTemp.item1.user_name }}
          </span>
        </template>
        <span v-else class="text_main">Post a new comment</span>
      </view>
      <view class="content">
        <view class="text_area">
          <uni-easyinput
            class="text_area"
            type="textarea"
            v-model="commentValue"
            :placeholder="commentPlaceholder"
            :focus="focus"
            trim
            autoHeight
            maxlength="300"
          ></uni-easyinput>
        </view>
        <wd-button custom-class="send_btnJoinBtn" type="info" @click="sendClick(replyTemp)">
          Send
        </wd-button>
      </view>
    </view>
  </uni-popup>
  <!-- 删除弹窗 -->
  <uni-popup ref="delPopupRef" type="dialog">
    <uni-popup-dialog
      mode="base"
      title="DELETE"
      content="Are you sure to delete this comment?"
      confirmText="confirm"
      cancelText="cancel"
      :before-close="true"
      @close="delCloseFun"
      @confirm="delConfirmFun"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script setup>
import CommonComp from './componets/common.vue'
import { reactive, ref, watch } from 'vue'
import { getCommentCommentComment } from '@/service/community/comment'
import { getAvatar, getUrl } from '@/utils/utils'
import {uniqBy} from 'lodash'
const props = defineProps({
  /** 用户信息
   *    id: number // 用户id
   *    user_name: number // 用户名
   *    user_avatar: string // 用户头像地址
   */
  userInfo: {
    type: Object,
    default: () => {},
  },
  /** 评论列表
   *    id: number // 评论id
   *    parent_id: number // 父级评论id
   *    reply_id: number // 被回复人评论id
   *    reply_name: string // 被回复人名称
   *    user_name: string // 用户名
   *    user_avatar: string // 评论者头像地址
   *    user_content: string // 评论内容
   *    is_like: boolean // 是否点赞
   *    like_count: number // 点赞数统计
   *    create_time: string // 创建时间
   */
  tableData: {
    type: Array,
    default: () => [],
  },
  // 评论总数
  tableTotal: {
    type: Number,
    default: 0,
  },
  // 评论删除模式
  // bind - 当被删除的一级评论存在回复评论, 那么该评论内容变更显示为[当前评论内容已被移除]
  // only - 仅删除当前评论(后端删除相关联的回复评论, 否则总数显示不对)
  // all - 删除所有评论包括回复评论
  deleteMode: {
    type: String,
    default: 'all',
  },
  isMe: {
    type: Boolean,
    default: true,
  },
  isMyPost: {
    type: Boolean,
    default: true,
  },
  postUserId: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits([
  'update:tableTotal',
  'likeFun', // 点赞事件
  'replyFun', // 回复事件
  'deleteFun', // 删除事件
])

// 渲染数据(前端的格式)
let dataList = ref([])
const isJoint = ref(false)
watch(
  () => props.tableData,
  (newVal) => {
    if (newVal.length !== dataList.value.length) {
      let temp = props.tableData
      dataList.value = treeTransForm(temp)
    }
  },
  { deep: true, immediate: true },
)


console.log('dataList', dataList)

// 数据转换
function treeTransForm(data) {
  let newData = JSON.parse(JSON.stringify(data))
  let result = []
  let map = {}
  newData.forEach((item, i) => {
    /////////
    item.owner = item.user_id === props.postUserId // 是否为所有者 所有者可以进行删除 不能回复
    map[item.id] = item
  })
  newData.forEach((item) => {
    let parent = map[item.parent_id]
    if (parent) {
      ;(parent.children || (parent.children = [])).push(item) // 所有回复
      if (parent.children.length === 1) {
        ;(parent.childrenShow = []).push(item) // 显示的回复
      }
    } else {
      result.push(item)
      //   getAllChildTreeDate(item.commentCount, item.id, item.level)
    }
  })
  return result
}
const allChildrenDate = ref([])
function getAllChildTreeDate(maxSize, findId, level, callback) {
  if (maxSize > 3 && level === 1) {
    getCommentCommentComment({ page: 1, pageSize: maxSize, commentId: findId }).then((res) => {
      if (res.code === 0) {
        allChildrenDate.value = res.data.list
        let newarr = formattingNewDate()
        callback(newarr)
      }
    })
  }
}

function formattingNewDate() {
  let newCustomArray = []
  allChildrenDate.value.forEach((item) => {
    const user_avatar = getAvatar({
      gender: item.gender,
      avatar: item.avator,
    })
    newCustomArray.push({
      id: item.commentId,
      parent_id: item.ancestorId == 0 ? null : item.ancestorId,
      reply_id: item.replyId == 0 ? null : item.replyId,
      reply_name: item.replyUserName,
      user_id: item.userId,
      user_name: item.userName,
      user_avatar,
      user_content: item.content,
      like_count: item.likeCount,
      create_time: item.replyTime,
      is_like: item.likeStatus == 2 ? true : false,
      commentCount: item.commentCount,
      level: item.level,
    })
  })
  isJoint.value = true
  let arrChild = treeTransForm(newCustomArray)
  return arrChild
  //   dataList.value = [...dataList.value, ...arrChild]
}

// 点赞
let setLike = (item) => {
  item.is_like = !item.is_like
  item.like_count = item.is_like ? item.like_count + 1 : item.like_count - 1
}
function likeClick({ item1, index1, item2, index2 }) {
  let item = item2 || item1
  setLike(item)
  emit('likeFun', { params: item }, (res) => {
    // 请求后端失败, 重置点赞
    if (res.code !== 0) {
      setLike(item)
    }
  })
}

// 回复
let cPopupRef = ref(null) // 弹窗实例
let replyTemp = reactive({}) // 临时数据
function replyClick({ item1, index1, item2, index2 }) {
  replyTemp = JSON.parse(JSON.stringify({ item1, index1, item2, index2 }))
  cPopupRef.value.open()
}

// 发起新评论
let isNewComment = ref(false) // 是否为新评论
defineExpose({ newCommentFun })
function newCommentFun() {
  isNewComment.value = true
  cPopupRef.value.open()
}

// 评论弹窗
let focus = ref(false)
function popChange(e) {
  // 关闭弹窗
  if (!e.show) {
    commentValue.value = '' // 清空输入框值
    replyTemp = {} // 清空被回复人信息
    isNewComment.value = false // 恢复是否为新评论默认值
  }
  focus.value = e.show
}
let commentValue = ref('') // 输入框值
let commentPlaceholder = ref('Reply Eleven...') // 输入框占位符

// 发送评论
function sendClick(replyTemp) {
  if (commentValue.value == "") {
    return uni.showToast({
      title: 'The content cannot be empty',
      icon: "none",
      mask: true
    })
  }

  const { item1, index1, item2, index2 } = replyTemp || {}
  let item = item2 || item1
  let params = {}
  // 新评论
  if (isNewComment.value) {
    params = {
      id: 10001, // 评论id
      parent_id: null, // 父级评论id
      reply_id: null, // 被回复评论id
      reply_name: null, // 被回复人名称
    }
  } else {
    // 回复评论
    params = {
      id: Math.random(), // 评论id
      parent_id: item?.parent_id ?? item.id, // 父级评论id
      reply_id: item.id, // 被回复评论id
      reply_name: item.user_name, // 被回复人名称
    }
  }
  params = {
    ...params,
    user_name: props.userInfo.user_name, // 用户名
    //  用户头像地址
    user_avatar: getAvatar({
      gender: props.userInfo.gender,
      avatar: props.userInfo.user_avatar,
    }),
    user_content: commentValue.value, //  用户评论内容
    is_like: false, // 是否点赞
    like_count: 0, // 点赞数统计
    create_time: 'just now', // 创建时间
    owner: props.postUserId === props.userInfo.id, // 是否为所有者 所有者可以进行删除 管理员默认true
    commentCount: props.tableTotal + 1, // 评论数
  }

  uni.showLoading({
    title: 'Being Sent',
    mask: true,
  })
  emit('replyFun', { params }, (res) => {
    uni.hideLoading()
    // 拿到后端返回的id赋值, 因为删除要用到id
    params = { ...params, id: res.id, tableTotal: props.tableTotal + 1 }
    // 新评论
    if (isNewComment.value) {
      dataList.value.push(params)
    } else {
      // 回复
      let c_data = dataList.value[index1]
      ;(c_data.children || (c_data.children = [])).push(params)
      // 如果已展开所有回复, 那么此时插入children长度会大于childrenShow长度1, 所以就直接展开显示即可
      if (
        c_data.children.length ===
        (c_data.childrenShow || (c_data.childrenShow = [])).length + 1
      ) {
        c_data.childrenShow.push(params)
      }
    }
    emit('update:tableTotal', props.tableTotal + 1)
    cPopupRef.value.close()
  })
}

// 删除
const delPopupRef = ref(null)
let delTemp = reactive({}) // 临时数据
function deleteClick({ item1, index1, item2, index2 }) {
  delTemp = JSON.parse(JSON.stringify({ item1, index1, item2, index2 }))
  delPopupRef.value.open()
}
// 关闭删除弹窗
function delCloseFun() {
  delTemp = {}
  delPopupRef.value.close()
}
// 确定删除
function delConfirmFun({ item1, index1, item2, index2 } = delTemp) {
  let c_data = dataList.value[index1]
  uni.showLoading({
    title: 'deleting',
    mask: true,
  })
  // 删除二级评论
  if (index2 >= 0) {
    emit('deleteFun', { params: [c_data.children[index2].id] }, (res) => {
      uni.hideLoading()
      emit('update:tableTotal', props.tableTotal - 1)
      c_data.children.splice(index2, 1)
      c_data.childrenShow.splice(index2, 1)
    })
  } else {
    // 删除一级评论
    if (c_data.children && c_data.children.length) {
      // 如果一级评论包含回复评论
      switch (props.deleteMode) {
        case 'bind':
          // 一级评论内容展示修改为: 当前评论内容已被移除
          c_data.user_content = 'The current comment has been removed'
          break
        case 'only':
          // 后端自行根据删除的一级评论id, 查找关联的子评论进行删除
          emit(
            'deleteFun',
            {
              mode: props.deleteMode,
              params: [c_data.id],
            },
            (res) => {
              uni.hideLoading()
              emit('update:tableTotal', props.tableTotal - c_data.children.length + 1)
              dataList.value.splice(index1, 1)
            },
          )
          break
        default:
          // all
          // 收集子评论id, 提交给后端统一删除
          let delIdArr = [c_data.id]
          c_data.children.forEach((_, i) => {
            delIdArr.push(_.id)
          })
          emit('deleteFun', { params: delIdArr, mode: props.deleteMode }, (res) => {
            uni.hideLoading()
            emit('update:tableTotal', props.tableTotal - c_data.children.length + 1)
            dataList.value.splice(index1, 1)
          })
          break
      }
    } else {
      // 一级评论无回复, 直接删除
      emit('deleteFun', { params: [c_data.id] }, (res) => {
        uni.hideLoading()
        emit('update:tableTotal', props.tableTotal - 1)
        dataList.value.splice(index1, 1)
      })
    }
  }
  delCloseFun()
}

// 更多评论文字显示
function expandTxtShow({ item1, index1 }) {
  return (
    item1.childrenShow &&
    item1.childrenShow.length &&
    item1.children.length - item1.childrenShow.length
  )
}
// 展开更多评论
function expandReplyFun({ item1, index1 }) {
  if (item1.commentCount > dataList.value[index1].children.length) {
    getAllChildTreeDate(
      item1.commentCount,
      dataList.value[index1].id,
      dataList.value[index1].level,
      (res) => {
        dataList.value[index1].children = res
        let csLen = dataList.value[index1].childrenShow.length
        dataList.value[index1].childrenShow.push(
          ...dataList.value[index1].children.slice(csLen, csLen + 6), // 截取5条评论
        )
      },
    )
  } else {
    let csLen = dataList.value[index1].childrenShow.length
    dataList.value[index1].childrenShow.push(
      ...dataList.value[index1].children.slice(csLen, csLen + 6), // 截取5条评论
    )
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  align-items: center;
}

.c_total {
  padding: 20rpx 30rpx 0 30rpx;
  font-size: 28rpx;
}
.empty_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 150rpx 10rpx;
  font-size: 28rpx;
  .txt {
    color: $uni-text-color-disable;
  }
  .click {
    color: $uni-color-primary;
  }
}
.c_comment {
  padding: 20rpx 0;
  font-size: 28rpx;
  border-bottom: 2rpx solid #efefef;
  &:last-child {
    border: none;
  }
  .children_item {
    padding: 20rpx 30rpx;
    margin-top: 10rpx;
    margin-left: 80rpx;
    padding-left: 0;
    // background-color: $uni-bg-color-grey;
    .expand_reply {
      margin-top: 10rpx;
      margin-left: 80rpx;
      .txt {
        font-size: 10px;
        font-weight: 400;
        color: #00dba1;
      }
    }
  }
}
.c_popup_box {
  background-color: #fff;
  .reply_text {
    @extend .center;
    padding: 20rpx 20rpx 0 20rpx;
    font-size: 26rpx;
    .text_aid {
      color: $uni-text-color-grey;
      margin-right: 5rpx;
    }
    .text_main {
    }
  }
  .content {
    @extend .center;
    .text_area {
      flex: 1;
      padding: 20rpx;
    }
    .send_btn {
      @extend .center;
      justify-content: center;
      width: 120rpx;
      height: 60rpx;
      border-radius: 20rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: $uni-color-primary;
      margin-right: 20rpx;
    }
    .send_btnJoinBtn {
      @extend .center;
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
}
</style>
