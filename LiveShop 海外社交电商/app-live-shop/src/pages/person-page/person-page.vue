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
  <div class="person-page">
    <header>
      <Title :white="false" text="" />
    </header>

    <main>
      <view class="tx flex-sb align-end plr-6" style="margin-top: -80rpx">
        <view class="tx-img rel">
          <image :src="avatar" class="circle" mode="aspectFill" style="width: 100%; height: 100%" />
          <gender-icon :gender="userInfo.gender" />
        </view>

        <view class="flex-c">
          <view v-if="Online" class="flex-c">
            <view
              class="circle mr-2 c-40"
              style="width: 8rpx; height: 8rpx; background: #00dba1"
            ></view>
            <text class="mr-5 fs_12 c1">Online</text>
          </view>
          <view v-else class="flex-c">
            <view
              class="circle mr-2 c-40"
              style="width: 8rpx; height: 8rpx; background: #dfdfdf"
            ></view>
            <text class="mr-5 fs_12 c1">Offline</text>
          </view>
          <image
            v-if="!isMe"
            class="mr-4"
            src="../../static/images/person-page/hi.png"
            style="width: 64rpx; height: 64rpx"
            @click="onSay()"
          />
          <wd-button
            v-if="isMe"
            custom-class="profile-button"
            @click="toPage('/pages/my-data/my-data')"
          >
            Edit Profile
          </wd-button>
          <template v-else>
            <wd-button
              v-if="!isFollow"
              :loading="followLoading"
              custom-class="follow-button"
              @click="toFollow"
            >
              Follow
            </wd-button>
            <wd-button
              v-else
              :loading="unFollowLoading"
              custom-class="followed-button"
              type="success"
              @click="toUnFollow"
            >
              Followed
            </wd-button>
          </template>
        </view>
      </view>
      <view class="plr-6">
        <view class="flex-c mt-5">
          <text class="user-name fw-800 fs-32 c-40 two-line-text" style="max-width: 230px">
            {{ userInfo.nickname }}
          </text>
          <image
            class="ml-5 mr-3"
            src="../../static/images/index/verified.png"
            style="width: 124rpx; height: 32rpx; line-height: 51rpx"
          />
          <text class="c1">ID:{{ userInfo.Id }}</text>
        </view>
        <view class="mtb-4 fs-24 c-95 text-wrap c1">BIO:{{ userInfo.signature }}</view>

        <view>
          <text class="fs_13" @click="toFollowPage">{{ follow }}</text>
          <text class="ml-2 c-95 fs_12" @click="toFollowPage">follow</text>
          <text class="ml-4 fs_13" @click="toFollower">{{ follower }}</text>
          <text class="ml-2 c-95 fs_12" @click="toFollower">follower</text>
        </view>
      </view>

      <view
        id="communityDynamiContent"
        :class="isScroll ? 'communityDynamiContent2' : 'communityDynamiContent1'"
        class="communityDynamiContent"
      >
        <view v-if="isScroll" class="flex-c" style="padding-top: 18px">
          <image
            :src="blackArrow"
            style="width: 20rpx; height: 36rpx; margin-left: 14px;margin-right: 10px;"
            @click="onBack"
          />
          <image
            :src="avatar"
            class="circle"
            mode="aspectFill"
            style="width: 37px; height: 37px"
          />
          <view class="flex-v" style="margin-left: 8px;">
            <text
              class="user-name fw-800  c-40 two-line-text"
              style="max-width: 230px;font-size: 16px;"
            >
              {{ userInfo.nickname }}
            </text>
            <text class="c1 id-max-width omit" style="font-size: 12px;">ID:{{ userInfo.Id }}</text>
          </view>

          <template v-if="isMe">
            <wd-button
              custom-class="profile-button button2"
              style="margin-left: auto"
              @click="toPage('/pages/my-data/my-data')"
            >
              Edit Profile
            </wd-button>
          </template>
          <template v-else>
            <wd-button
              v-if="!isFollow"
              :loading="followLoading"
              custom-class="follow-button button2"
              @click="toFollow"
            >
              Follow
            </wd-button>
            <wd-button
              v-else
              :loading="unFollowLoading"
              custom-class="followed-button button2"
              @click="toUnFollow"
            >
              Followed
            </wd-button>
          </template>
        </view>
        <wd-tabs
          v-model="productTabValue"
          color="#404040"
          inactiveColor="#404040"
          @click="handlewdTabClick"
        >
          <view v-for="(item, index) in productTabClassify" :key="index">
            <wd-tab :title="`${item.name}`" custom-class="my-tab"></wd-tab>
          </view>
        </wd-tabs>
      </view>

      <view v-show="productTabValue == 0" class="dynamicListContainer">
        <view class="card_pannel" style="height: calc(100vh - 600rpx)">
          <Photos :userId="Id" />
        </view>
      </view>
      <view v-show="productTabValue == 1" class="dynamicListContainer">
        <template v-if="postList?.length">
          <view style="margin-left: 28rpx; margin-right: 28rpx">
            <cc-pullScroolView
              ref="pullScroll"
              :pullDown="pullDown"
              class="pullScrollView"
              downErrorText="Refresh failure"
              downLoadingText="refresh..."
              downSuccessText="Refresh successfully"
              loosingText="Release refresh"
              pullingText="Pull to refresh"
              upErrorText="If loading fails, click Reload"
              upFinishText="No more for now"
              upLoadingText="loading..."
            >
              <Dynamic
                v-for="(item, index) in postList"
                :key="index"
                :currentRow="item"
                :discussFold="discussFold"
                :isMe="isMe"
                :isMyPost="getIsReallyMe(item)"
                style="margin-bottom: 16rpx"
                @clickDelete="clickDelete"
                @clickDiscuss="clickDiscuss"
                @clickDynamic="clickDynamic"
                @clickThumbsup="clickThumbsup"
              />
            </cc-pullScroolView>
          </view>
        </template>
        <template v-else>
          <view class="card_pannel" style="height: calc(100vh - 600rpx)">
            <Empty :text="isMe ? 'Post a thread about it.' : ''" />
          </view>
        </template>
      </view>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {onPostDel, onPostLike} from "@/service/community/community";
import {getUserInfo} from "@/service/login/login";
import {getFollowFans, getPostIndex} from "@/service/person-page/person-page";
import {followUser, unFollowUser} from "@/service/search/search";
import {clearAll, getAvatar, getUrl, isToday, toPage, uniqueById, updateHiArr, openScreenshots, closeScreenshots} from "@/utils/utils";
import dayjs from "dayjs";
import {cloneDeep, debounce, throttle} from "lodash";
import {useMessage} from "wot-design-uni/components/wd-message-box";
import {useToast} from "wot-design-uni/components/wd-toast";
import {useNimStore, useUserStore} from "@/store";
import {usePostStore} from "@/store/post";
import Empty from "@/components/Empty/Empty.vue";
import db from "@/utils/sqlite";
import blackArrow from "@/static/images/components/left-arrow-black.png";

const postStore = usePostStore();
const type = "Update";
const postList = computed(() => {
  return postStore.postLists[type];
});
const nim = useNimStore().instance;
const avatar = computed(() => {
  return getAvatar(userInfo.value);
});
const userInfo: any = ref({});
const Id = ref();
const isMe = ref(true);
const followLoading = ref(false);
const unFollowLoading = ref(false);
const follow = ref(0);
const follower = ref(0);

const isFollow = computed(() => {
  return userInfo.value.isFollowed;
});
const Online = computed(() => {
  return userInfo.value.isOnline;
});

function getIsReallyMe(item) {
  const IsMyPost = item.userId === userInfo.value.Id;
  return IsMyPost;
}

const message = useMessage();
const toast = useToast();
const productTabValue = ref(0);
const productTabClassify = ref([
  { name: "Photos", id: 1 },
  { name: "Updates", id: 2 }
]);

const pageBody = reactive({
  page: 1,
  pageSize: 10
});
const totalCount = ref(0);
const pullScroll = ref();
const postType = ref(1);

// 下拉刷新
function pullDown() {
  postStore.clear(type);
  pageBody.page = 1;
  getCommunityList();
}

onReachBottom(() => {
  if (postList.value.length >= totalCount.value) return;
  pullScroll.value.showUpLoading();
  pageBody.page += 1;
  getCommunityList();
});

const getCommunityList = () => {
  getPostIndex(Id.value).then((res: any) => {
    if (res.code === 0) {
      if (res.data.count === 0) {
        postStore.clear(type);
        totalCount.value = 0;
        pullScroll.value.finish();
      } else {
        res.data.list.forEach((item) => {
          item.imgList = item.mediaUrl?.split(",").map((v) => getUrl(v));
          item.publishTime = dayjs(item.createdAt).valueOf();
        });
        const list = uniqueById([...postList.value, ...res.data.list]);
        postStore.setPosts(type, list);
        totalCount.value = res.data.count;
        setTimeout(() => {
          if (pageBody.page * 10 >= totalCount.value) {
            pullScroll.value.finish();
          } else {
            pullScroll.value.success();
          }
        }, 600);
      }
    }
  });
};

function clickDynamic(row: any) {
  uni.navigateTo({
    url: `/pages/communityDetail/communityDetail?id=${row.id}&isMyPost=${getIsReallyMe(row)}&type=${type}`
  });
}

const discussFold = ref(false);

function clickDiscuss() {
  // discussFold.value = !discussFold.value
}

function clickThumbsup(row: any) {
  onPostLike({ postId: row.id, likeStatus: row.likeStatus });
}

function clickDelete(rowid: number) {
  message
    .confirm({
      msg: "Are you sure you want to delete this dynamic?",
      confirmButtonText: "confirm",
      cancelButtonText: "cancel",
      closeOnClickModal: false
    })
    .then(() => {
      onPostDel({ id: rowid }).then((res: any) => {
        if (res.code === 0) {
          toast.success("successfully delete");
          pullDown();
        }
      });
    });
}

function handlewdTabClick(e: any) {
  postType.value = productTabClassify.value[e.index].id;
  postStore.clear(type);
  if (e.index == 1) {
    getCommunityList();
  }
}

const { userInfo: _userInfo, updateUserInfo } = useUserInfo();
const userInfo0 = computed(() => {
  return _userInfo.value;
});
onLoad(async (options) => {
  const { id } = options;
  if (id) {
    Id.value = id;
  }
});

async function initUserInfo(_id?) {
  const id = _id || Id.value;
  const myId = +userInfo0.value.Id;
  if (id != myId) {
    isMe.value = false;
    // 别人主页
    Id.value = +id;
    const { data }: { data: any } = await getUserInfo(id);
    userInfo.value = data;
    initFollows();
  } else {
    isMe.value = true;
    // 自己主页
    Id.value = +userInfo0.value.Id;
    userInfo.value = userInfo0.value;
    initFollows();
  }
}

watch(
  () => userInfo0.value,
  (newValue, oldValue) => {
    // debugger
    initUserInfo();
  },
  { deep: true }
);

const toFollow = debounce(async () => {
  const userId: number = Id.value;
  followLoading.value = true;
  await followUser(userId);
  userInfo.value.isFollowed = true;
  toast.show("Follow success");
  followLoading.value = false;
  initFollows();
}, 200);

const toUnFollow = debounce(async () => {
  const userId: number = Id.value;
  unFollowLoading.value = true;
  await unFollowUser(userId);
  unFollowLoading.value = false;
  userInfo.value.isFollowed = false;
  toast.show("Unfollow success");
  await initFollows();
}, 200);

async function onSay() {
  const { imAccountId: id, isMutualFollow, username, Id } = userInfo.value;
  const conversationId = `${useUserStore().userInfo.imAccountId}|1|${id}`;
  const messageBeforeSend = nim.V2NIMMessageCreator.createTextMessage(`Hi I am ${useUserStore().userInfo.username}`);

  if (!isMutualFollow) {
    if (isToday(conversationId)) {
      await uni.showToast({
        title: "You've already greeted him/her today",
        icon: "none"
      });
    } else {
      updateHiArr({ id: conversationId, time: new Date() });
      const message = await insertMessage(messageBeforeSend, conversationId);
      await navigateToChatRoom(conversationId, username, Id, message);
    }
  } else {
    const message = await insertMessage(messageBeforeSend, conversationId);
    await navigateToChatRoom(conversationId, username, Id, message);
  }
}

async function insertMessage(message, conversationId) {
  const insertMessage = cloneDeep(message);
  insertMessage.messageSendStatus = "PENDING";
  // insertMessage.conversationId = conversationId;
  const res = await db.insertTableData({ message: insertMessage });
  console.warn("插入的数据", res);
  return insertMessage;
}

async function navigateToChatRoom(conversationId, userName, id, message) {
  await uni.navigateTo({
    url: `/pages/chatRoom/chatRoom?conversationId=${conversationId}&userName=${userName}&id=${id}&sayHiId=${message.messageClientId}`
  });

}


function toFollower() {
  const id = userInfo.value.Id;
  uni.navigateTo({ url: "/pages/follower/follower?id=" + id });
}

function toFollowPage() {
  if (!isMe.value) return;
  const id = userInfo.value.Id;
  uni.navigateTo({ url: "/pages/follow/follow?id=" + id });
}

const initFollows = debounce(async function() {
  const userId = userInfo.value.Id;
  if (!userId) return;
  const res: any = await getFollowFans(userId);
  follow.value = res.data.following;
  follower.value = res.data.fans;
  uni.hideLoading();
}, 100);

function onLogout() {
  clearAll();
  uni.redirectTo({ url: "/pages/login/login" });
}

onShow(async (opt) => {
  discussFold.value = false;
  console.log("opt", opt);
  // 刷新列表
  await initUserInfo();
  pullDown();
  queryTop();
  closeScreenshots()
});

onHide(() => {
  openScreenshots()
})

const isScroll = ref(false);
const scrollTopL = ref(0);

function queryTop() {
  uni.getSystemInfo({
    success: (systemInfo) => {
      // 获取状态栏高度
      const statusBarHeight = systemInfo.statusBarHeight;

      // 创建节点选择器
      const query = uni.createSelectorQuery();
      query
        .select("#communityDynamiContent") // 替换为你的节点 id
        .boundingClientRect((rect) => {
          console.log("rect", rect);
          if (rect) {
            // 节点到页面顶部的距离
            const nodeTop = rect.top;

            // 总距离 = 状态栏高度 + 节点到页面顶部的距离
            const totalDistance = statusBarHeight + nodeTop;
            scrollTopL.value = totalDistance;
            console.log("节点到屏幕顶部的距离:", totalDistance);
          } else {
            console.error("未找到指定节点");
          }
        })
        .exec();
    },
    fail: (err) => {
      console.error("获取系统信息失败:", err);
    }
  });
}

onPageScroll(
  throttle((opt): any => {
    if (opt.scrollTop > scrollTopL.value) {
      isScroll.value = true;
    } else {
      isScroll.value = false;
    }
  }, 100)
);

function onBack() {
  uni.navigateBack({
    delta: 1
  });
}
</script>

<style lang="scss">
page {
  background-color: #f6f6f6;
  // 这是测试
}

.person-page {
  header {
    background: url(../../static/images/person-page/bg.png) no-repeat center center;
    background-size: cover;
    width: 100%;
    height: calc(200rpx + var(--status-bar-height));
  }

  main {
    .tx-img {
      width: 182rpx;
      height: 182rpx;
      border: 10rpx solid #f6f6f6;
      border-radius: 50%;
      background: #fff;
    }
  }

  .gender-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
  }
}
</style>

<style lang="scss" scoped>
.c1 {
  font-size: 24rpx;
  font-weight: 400;
  color: #404040;
}

.communityDynamiContent {
  box-sizing: border-box;

  :deep(.wd-tabs) {
    .is-active {
      .wd-tabs__nav-item-text {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .wd-tabs__nav-item {
      font-size: 16px;
      font-weight: 400;
      flex: 0 1 35%;
    }
  }
}

.communityDynamiContent1 {
  padding-top: 24rpx;

  :deep(.wd-tabs) {
    .wd-tabs__nav {
      background-color: #f6f6f6;
    }

    .wd-tabs__line {
      background-color: #00dba1;
    }
  }
}

.communityDynamiContent2 {
  position: fixed !important;
  top: 0;
  width: 100%;
  padding-top: var(--status-bar-height);
  background-color: #00dba1 !important;
  z-index: 1998;

  :deep(.wd-tabs) {
    .wd-tabs__nav {
      background-color: #00dba1 !important;
    }

    .wd-tabs__line {
      background-color: #fff !important;
    }
  }
}

.card_pannel {
  margin-left: 28rpx;
  margin-right: 28rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 16rpx 16rpx 0 16rpx;
}

:deep(.follow-button) {
  width: 94px;
  height: 32px !important;
}

:deep(.button2) {
  margin-left: auto;
  margin-right: 14px;
}

:deep(.followed-button) {
  width: 94px;
  height: 32px !important;
}

:deep(.profile-button) {
  width: 106px;
  height: 32px !important;
}

.dynamicListContainer {
  margin-top: 10rpx;
}

.id-max-width {
  max-width: 127px;
}
</style>
