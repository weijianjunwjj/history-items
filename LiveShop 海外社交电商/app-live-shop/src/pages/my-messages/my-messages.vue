<route lang="json5" type="page">
{
style: {
navigationBarTitleText: 'My Messages',
enablePullDownRefresh: false,
navigationBarBackgroundColor: '#ffffff',
},
}
</route>

<template>
  <view class="myMessagesContainer">
    <view class="tabListCub flex-sb-c">
      <view
        v-for="(item, index) in tabListDate"
        :key="index"
        :class="{ activeTab: item.checked }"
        class="tabItem relative flex flex-vc"
        @click="onTabCheckChange(item)"
      >
        <!--        <wd-badge class="absolute " :max="99" :modelValue="item.count" type="success"/>-->
        <image v-if="item.checked" :src="item.checkimg" class="tabIcon"/>
        <image v-else :src="item.img" class="tabIcon"/>
        <p>{{ item.title }}</p>
      </view>
    </view>
    <cc-pullScroolView
      v-if="conversationList.length"
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
      <view
        v-for="item in conversationList"
        :key="item"
        class="flex-c noticeItemInfo"
        @click="onToUserChatRoom(item)"
      >
        <view class="dynamicItemInfo_leftIcon flex-cc">
          <image
            :src="
              item.avatar
                ? getUrl(item.avatar)
                : item.gender === 1
                  ? '/static/images/login/man.png'
                  : '/static/images/login/woman.png'
            "
            class="contactsAdver"
            mode="aspectFill"
          />
          <image
            v-if="item.gender === 2"
            class="contactsSexIcon"
            src="/static/images/system/woman.png"
          />
          <!-- v-if="gender == 2" -->
          <image v-else class="contactsSexIcon" src="/static/images/system/man.png"/>
        </view>

        <view class="flex-1 noticeItemInfo_rigMessage">
          <view class="flex-sb-c">
            <p class="sysTitle">{{ item.showName }}</p>
            <p class="sysTime">{{ formatTime(item.createTime) }}</p>
          </view>
          <view class="flex-c">
            <view
              v-if="item.lastMessage.messageType === 0"
              class="flex-1 ellipsis-2 messageContent"
              v-html="formatTextToHTML(item.lastMessage.text)"
            ></view>
            <view
              v-if="item.lastMessage.messageType === 1"
              class="flex-1 ellipsis-2 messageContent"
            >
              Picture messages
            </view>
            <view
              v-if="item.lastMessage.messageType === 2"
              class="flex-1 ellipsis-2 messageContent"
            >
              Voice messages
            </view>
            <view
              v-if="item.lastMessage.messageType === 3"
              class="flex-1 ellipsis-2 messageContent"
            >
              Video messages
            </view>
            <view class="messageNum flex-cc">
              <wd-badge :max="99" :modelValue="item.unreadCount" type="success"/>
            </view>
          </view>
        </view>
      </view>
    </cc-pullScroolView>
    <Empty v-else/>
  </view>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import {getUserIdFromAccId, unreadMessages} from "@/service/chat/message";
import {formatTextToHTML, getUrl} from "@/utils/utils";
import {useNimStore} from "@/store";
import Empty from "@/components/Empty/Empty.vue";

const nim = useNimStore().instance;
const nimStore = useNimStore()
const pageBody = reactive({
  page: 1,
  pageSize: 10
});

// 会话列表
const conversationList = ref([]);
const totalCount = ref(0);
const pullScroll = ref();
const myMessagesList = ref([]);
const tabListDate = reactive([
  {
    img: "/static/images/my-messages/dm.png",
    checkimg: "/static/images/my-messages/checkdm.png",
    title: "DM",
    checked: true,
    groupId: 1,
    count: 0
  },
  {
    img: "/static/images/my-messages/mufriends.png",
    checkimg: "/static/images/my-messages/checkmufriends.png",
    title: "Mutual Friends",
    checked: false,
    groupId: 2,
    count: 0
  }
]);
const activityType = ref(1);

// 下拉刷新
async function pullDown() {
  myMessagesList.value = [];
  pageBody.page = 1;
  await getListData(tabListDate.find(i => i.checked === true).groupId);
  await nextTick(() => {
    pullScroll.value.success();
  });
}

async function onTabCheckChange(row: any) {
  tabListDate.map((r) => (r.checked = false));
  row.checked = true;
  activityType.value = row.groupId;
  await getListData(row.groupId);
  pageBody.page = 1;
}

const formatTime = (time: Date) => {
  return dayjs(time).format("MM-DD");
};
onReachBottom(() => {
  if (myMessagesList.value.length >= totalCount.value) return;
  pullScroll.value.showUpLoading();
  pageBody.page += 1;
});

async function onToUserChatRoom(row: any) {
  try {
    await unreadMessages(nim, row.conversationId);
    await uni.navigateTo({
      url: `/pages/chatRoom/chatRoom?conversationId=${row.conversationId}&userName=${row.name}&id=${row.userId}`
    });
  } catch (err) {
    console.error("error:::", err);
  }
}

const getListData = async (groupId?: string | number) => {

  let listData = groupId && groupId === 2 ? nimStore.mfList.conversationList : nimStore.dmList.conversationList
  try {
    const allIds = listData.map(item => {
      return item.conversationId.split("|1|")[1];
    });
    const {data} = await getUserIdFromAccId(allIds);
    for (let i of listData) {
      if (data[i.conversationId.split("|1|")[1]] && Object.keys(data[i.conversationId.split("|1|")[1]])) {
        const thisData = data[i.conversationId.split("|1|")[1]]
        i.avatar = thisData.avatar
        i.showName = thisData.nickname || thisData.username
        i.gender = thisData.gender === 2 ? 2 : 1
        i.userId = thisData.id
      }
    }
  } catch (err) {
    console.error("err", err);
  }
  conversationList.value = listData.filter(item => item?.userId)
  // console.log(conversationList.value)
};

onLoad(async () => {
  await getListData(tabListDate.find(i => i.checked === true).groupId);
  nimStore.watchDmList(async () => {
    await getListData(tabListDate.find(i => i.checked === true).groupId)
  })
  nimStore.watchMFList(async () => {
    await getListData(tabListDate.find(i => i.checked === true).groupId)
  })

});

</script>

<style lang="scss" scoped>
@import './my-messages.scss';
</style>
