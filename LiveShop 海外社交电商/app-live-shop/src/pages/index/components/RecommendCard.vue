<template>
  <div class="RecommendCard">
    <view class="DynamiContent">
      <wd-tabs v-model="tabValue" color="#404040" inactiveColor="#404040" @click="handlewdTabClick">
        <template v-for="(item, index) in tabs" :key="index">
          <wd-tab :title="`${item.name}`"></wd-tab>
        </template>
      </wd-tabs>
    </view>

    <scroll-view v-if="recommendUserList.length" :scroll-y="true" class="scroll-view plr-5"
                 style="padding-bottom: 80px">
      <view v-for="(item, index) in recommendUserList" :key="index" class="card-item" @click="onClick(item)">
        <image
          v-if="item.album.length"
          :src="getUrl(item.album[0])"
          mode="aspectFill"
          style="
            width: 100%;
            height: 718rpx;
            border-top-right-radius: 16rpx;
            border-top-left-radius: 16rpx;
          "
        />
        <image v-else mode="aspectFill" style="
            width: 100%;
            height: 718rpx;
            border-top-right-radius: 16rpx;
            border-top-left-radius: 16rpx;
          " />
        <view class="p-6">
          <view class="flex-sb-c">
            <view class="flex-c">
              <text class="c-40 fs-32 fw-800 omit" style="line-height: 51rpx;width: 140px;">{{ item.name }}</text>

              <image
                class="ml-3"
                src="@/static/images/index/verified.png"
                style="width: 124rpx; height: 32rpx; line-height: 51rpx"
              />
            </view>

            <view class="flex rel">
              <view class="flex-c" style="margin-right: 126rpx">
                <view :style="{'background': item.isOnline ? '#00dba1' : '#DFDFDF'}" class="dot-online"></view>
                <text class="ml-2 c-40 fs-24">{{ item.isOnline ? "Online" : "Offline" }}</text>
              </view>
              <image
                src="@/static/images/index/hi.png"
                style="width: 116rpx; height: 116rpx; position: absolute; bottom: 0; right: 20rpx"
                @click="onSay(item)"
              />
            </view>
          </view>
          <view class="flex-sb-c">
            <view>
              <view class="flex-c c-40 fs-24 mtb-1" style="line-height: 28rpx">
                <text>{{ item.city }}</text>
                <view v-if="item.city" class="dot mlr-3"></view>
                <text>{{ item.age }} years old</text>
              </view>
              <view class="flex-c c-95 fs-24 mt-2" style="line-height: 28rpx">
                <text>{{ item.albumNum }} photos</text>
                <text class="mlr-3">|</text>
                <text>{{ item.updateNum }} updates</text>
              </view>
            </view>

            <view>
              <wd-button custom-class="homepage-btn" >Homepage</wd-button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <Empty v-else />
  </div>
</template>

<script lang="ts" setup>
import { getUrl, isToday, updateHiArr } from "@/utils/utils";
import { useNimStore } from "@/store";
import Empty from "@/components/Empty/Empty.vue";
import { cloneDeep } from "lodash";
import db from "@/utils/sqlite";

const { userInfo } = useUserInfo();
const nim = useNimStore().instance;
const tabValue = ref(0);
const tabs = ref([{ name: "Recommend" }]);
const recommendUserList = defineModel("recommendUserList");
console.log(888888, recommendUserList.value);
const isScroll = ref(false);

function handlewdTabClick(e: any) {
  console.log(e);
}

function onClick(item) {
  console.log("item", item);
  uni.navigateTo({
    url: "/pages/person-page/person-page?id=" + item.id
  });
}

async function onSay(item) {
  const conversationId = `${userInfo.value.imAccountId}|1|${item.accId}`;
  const messageBeforeSend = nim.V2NIMMessageCreator.createTextMessage(`Hi,I am ${userInfo.value.username}`);
  const isFollow = (relation) => relation === 3;

  if (!isFollow(item.relation)) {
    if (isToday(conversationId)) {
      await uni.showToast({
        title: "You've already greeted him/her today",
        icon: "none"
      });
    } else {
      updateHiArr({ id: conversationId, time: new Date() });
      await handleSendMessage(messageBeforeSend, conversationId, item);
    }
  } else {
    await handleSendMessage(messageBeforeSend, conversationId, item);
  }
}

async function handleSendMessage(message, conversationId, item) {
  const insertMessage = cloneDeep(message);
  // insertMessage.conversationId = conversationId;
  insertMessage.messageSendStatus = "PENDING";

  try {
    await db.insertTableData({ message: insertMessage });
    await uni.navigateTo({
      url: `/pages/chatRoom/chatRoom?conversationId=${conversationId}&userName=${item.name}&id=${item.id}&sayHiId=${insertMessage.messageClientId}`
    });
  } catch (error) {
    console.error("打招呼error:", error);
    insertMessage.messageSendStatus = "FAIL";
    await db.insertTableData(insertMessage);
  }
}

</script>

<style lang="scss" scoped>
.DynamiContent {
  // padding-top: 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  :deep(.wd-tabs) {
    background: none;

    .wd-tabs__nav {
      background: none;
    }

    .wd-tabs__line {
      background: #00dba1;
    }

    .wd-tabs__nav-item.is-active {
      font-weight: 800;
      font-size: 16px;
    }

    .wd-tabs__nav-item {
      font-size: 16px;
      font-weight: 500;
      flex: 0 1 35%;
    }
  }
}
</style>

<style lang="scss">
.RecommendCard {
  .scroll-view {
    width: 100%; /* 设置宽度为页面宽度 */
    max-width: 100vw; /* 限制宽度 */
    box-sizing: border-box;
  }

  .card-item {
    border-radius: 8rpx;
    overflow: hidden;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 26rpx;
  }

  .homepage-btn {
    font-size: 28rpx !important;
    width: 188rpx !important;
    height: 64rpx !important;
  }

  .dot-online {
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
  }
}
</style>
