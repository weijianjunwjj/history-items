<route lang="json5" type="page">
{
style: {
navigationBarTitleText: '聊天室',
enablePullDownRefresh: false,
navigationBarBackgroundColor: '#ffffff',
'app-plus': {
titleNView: {
buttons: [
{
type: 'menu',
float: 'right',
fontSize: '30px',
width: 'auto',
fontWeight: 'bold',
},
],
},
},
},
}
</route>

<template>
  <view class="chatRoomContainer">
    <wd-transition v-model:show="topMenuVisible" :duration="150" name="slide">
      <view class="topSelectMenu">
        <view>
          <wd-button custom-class="menuCusBtn" plain type="info" @click="onOpenRemarkPop">
            Add a note
          </wd-button>
        </view>
        <view style="margin-top: 10rpx">
          <wd-button custom-class="menuCusBtn" plain type="info" @click="onCancelFollowed">
            Unfollow
          </wd-button>
        </view>
      </view>
    </wd-transition>

    <view v-if="!isFollowed && followPopVisible" class="followUserInfo flex-c">
      <p class="flex-1">Click to follow for easier chat</p>
      <wd-button custom-class="followBtn" @click="onFollowBtn">Follow</wd-button>
      <wd-icon
        color="#000000"
        custom-class="customPosClose"
        name="error-fill"
        size="20px"
        @click="onCloseFollowTip"
      ></wd-icon>
    </view>
    <scroll-view
      ref="pullScroll"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      :scroll-y="true"
      :style="`height:${scrollViewHeight}px`"
      class="pullScrollView"
      upper-threshold="30"
      @scrolltoupper="handleScrollToTop"
    >
      <view :style="`height:${scrollViewHeight}px`">
        <view class="scrollContent">
          <view v-for="item in messageList" :key="item">
            <view v-if="item.isSelf">
              <view style="flex-direction: row-reverse;display: flex;align-items: baseline;">
                <view style="max-width: calc(100vw - 120px)">
                  <view v-if="item.messageType === 0" class="mineMessage" v-html="formatTextToHTML(item.text)"/>
                  <image
                    v-if="item.messageType === 1"
                    :src="item.attachment.url"
                    mode="widthFix"
                    style="width: 400rpx"
                    @click="checkOutThePictures(item.attachment.url)"
                  />
                  <view v-if="item.messageType === 2" class="mineMessage" @click="playAudio(item)">
                    {{ formatAudioTime(item.attachment.duration) }}s
                  </view>
                  <DomVideoPlayer
                    v-if="item.messageType === 3 && videoShow"
                    :src="item.attachment.url"
                    controls
                    muted
                    objectFit="contain"
                    style="height: 400rpx; width: 400rpx"
                    @videoInserted="handleVideoInsert"
                  />
                  <view v-if="item.spend === 1" class="flex-c coin">
                    <image mode="heightFix" src="/static/images/shop/coinIcon.svg"
                           style="height: 20rpx;margin-left: 30rpx"/>
                    -8
                  </view>
                </view>
                <wd-loading v-if="item.messageSendStatus === 'PENDING'" :size="12" style="margin-right: 10px"/>
                <wd-icon v-if="item.messageSendStatus === 'FAIL'" color="red" name="error-circle-filled"
                         size="24px"
                         style="margin-right: 10rpx;"></wd-icon>
              </view>
            </view>
            <view v-else>
              <view style="display: flex;align-items: flex-end;">
                <view>
                  <image :src="oppAvatar" class="adverImg" mode="aspectFill"/>
                </view>
                <view style="max-width: calc(100vw - 120px)">
                  <view v-if="item.messageType === 0" class="otherMessage" v-html="formatTextToHTML(item.text)"/>
                  <image
                    v-if="item.messageType === 1"
                    :src="item.attachment.url"
                    mode="widthFix"
                    style="width: 400rpx" @click="checkOutThePictures(item.attachment.url)"
                    @load="changeMainWindowHeight"
                  />
                  <view v-if="item.messageType === 2" class="otherMessage" @click="playAudio(item)">
                    {{ formatAudioTime(item.attachment.duration) }}s
                  </view>
                  <DomVideoPlayer v-if="item.messageType === 3 && videoShow" :src="item.attachment.url"
                                  controls
                                  muted objectFit="contain" style="height: 400rpx; width: 400rpx"
                                  @loading="changeMainWindowHeight"/>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!--        <p class="flex-cc chatTimeBreak">12:37</p>-->
      </view>
    </scroll-view>
    <message-input :conversation-id="oppUserId" class="msgInput" @heightChange="changeMainWindowHeight"
                   @message="sendPendingMessageNew"/>
  </view>
</template>

<script lang="ts" setup>
import {useMessage} from "wot-design-uni";
import {addRemark, freeMessageCount, getUserIdFromAccId, unreadMessages, updateRemark} from "@/service/chat/message";
import messageInput from "./components/messageInput.vue";
import {formatTextToHTML, getUrl} from "@/utils/utils";
import {followUser, unFollowUser} from "@/service/search/search";
import {useNimStore, useUserStore} from "@/store";
import db from "@/utils/sqlite";
import DomVideoPlayer from "@/components/DomVideoPlayer/DomVideoPlayer.vue";
import {getUserInfo} from "@/service/login/login";
import {NimInstance} from "@/utils/nimInstance";

const scrollViewHeight = ref<number>(1000);
const nim = useNimStore().instance;
const $n = new NimInstance();
$n.NIMInstance = nim;
const message = useMessage();
const oppUserId = ref(""); //对方用户ID
const oppAvatar = ref(""); //对方头像
const oppId = ref<string>(""); //对方id  用来关注和备注和取消关注的
const isFollowed = ref(false); //是否关注
const followPopVisible = ref(true); //顶部关注提示
const topMenuVisible = ref(false);
const videoShow = ref(true); // 控制视频组件刷新
const scrollTop = ref(0);
const pullScroll = ref();
const messageList = ref([]);
const context = uni.createInnerAudioContext();
const remarkInputValue = ref("");
const remarkPopVisible = ref(false);
const timesMap = ref(new Date().getTime());
const freeTotal = ref(6);
const formatAudioTime = (time: number) => {
  return isNaN(time) ? 0 : Math.round(time / 1000);
};
const haveRemark = ref<boolean>(false);
let lastTime = ref(0);
const handleVideoInsert = (id?) => {
  console.warn("触发了视频加载完毕事件");
  changeMainWindowHeight();
};
const handleScrollToTop = async () => {
  let now = new Date().getTime();
  if (now - lastTime.value > 100) {
    try {
      lastTime.value = now;
      timesMap.value = messageList.value[0].createTime;
      messageList.value = [...await getList(), ...messageList.value];
    } catch (err) {
      console.error(err);
    }
  }

};
const haveFreeTotal = async (id) => {
  const {data} = await freeMessageCount(Number(id));
  console.log(data);
  freeTotal.value = 6 - data.freeCount;
  // freeTotal.value = data.freeCount+1;
};
const getList = async () => {
  const res = await db.getListById(oppUserId.value, timesMap.value);

  const message = res.map((item) => {
    return {...JSON.parse(item.messageContent), messageSendStatus: item.messageSendStatus, spend: item.spend};
  });

  // const uniqueArray = (array) => {
  //   const seen = new Set();
  //   return array.reduce((acc, obj) => {
  //     if (!seen.has(obj.createTime)) {
  //       seen.add(obj.createTime);
  //       acc.push(obj);
  //     }
  //     return acc;
  //   }, []);
  // };
  // console.warn('去重后的数据length',[...uniqueArray(message)].length)
  console.warn("去重后的数据", message);
  return message.reverse();
};

// 检测是否需要扣金币
const canSend = () => {
  const coin = useUserStore().userInfo.coin;
  if (freeTotal.value > 0) {
    return 2;
  } else {
    return coin >= 8 ? 1 : 0;
  }
};
// TODO: 当前此逻辑暂时注释，调整逻辑为单独发送打招呼消息
// // 发送未发送的消息
// const sendPendingMessage = async (message?) => {
//   console.log("Sending...");
//   /**
//    * @return {Number} 0-不够了 1-可以 2-免费
//    */
//   const res = await db.getListById(oppUserId.value, new Date().getTime());
//   console.warn('------------>', res)
//   const messages = res.filter(item => item.messageSendStatus === "PENDING")
//     .map(item => {
//       try {
//         return JSON.parse(item.messageContent);
//       } catch (error) {
//         console.error(`Failed to parse message content for item: ${item}`, error);
//
//         return null; // 或者 return undefined;
//       }
//     })
//     .filter(message => message !== null && message !== undefined);
//   console.warn("准备发的message:", messages, messages.length);
//   if (message && Object.keys(message).length) {
//     messageList.value.push(message)
//   }
//   if (messages.length > 0) {
//     for (const message of messages.reverse()) {
//       try {
//         if (canSend() === 0) {
//           throw new Error('0')
//         }
//         const msg = await nim.V2NIMMessageService.sendMessage(message, oppUserId.value);
//         // await db.deleteColumn(message.messageClientId);
//         // msg.message.messageSendStatus = "SUCCESS";
//
//         await db.updateMessageStatus(msg, msg.message.createTime, "SUCCESS", canSend());
//         freeTotal.value--
//         // await db.insertTableData(msg);
//         const findList1 = messageList.value.find(item => item.messageClientId === msg.message.messageClientId)
//         msg.message.messageSendStatus = 'SUCCESS'
//         messageList.value = messageList.value.map(item =>
//           item.messageClientId === msg.message.messageClientId ? msg.message : item
//         );
//         console.log('执行到这了', msg)
//         await useUserStore().updateUserInfo()
//       } catch (e) {
//         console.log("发送失败", e);
//         // await db.insertTableData(message)
//         await db.updateMessageStatus({message: message}, message.createTime, "FAIL", 0);
//       }
//     }
//   }
//   // nextTick(async () => {
//   //   // messageList.value = await getList();
//   //   changeMainWindowHeight();
//   // });
//
// };
// DONE：打招呼发送的逻辑
const sendHiMessage = async (messageClientId: string) => {
  const res = await db.getMessageByClientId(messageClientId);
  const message = JSON.parse(res[0].messageContent);
  // console.error(message);
  // console.error("  看看调用了几次");
  await sendPendingMessageNew(message);
};
// 发送消息新函数
const sendPendingMessageNew = async (message?) => {
  if (message && Object.keys(message).length) {
    messageList.value.push(message);
  }
  await unreadMessages(nim, oppUserId.value)
  changeMainWindowHeight();

  let cs = canSend();
  try {
    console.log(cs);
    if (cs === 0) {
      await uni.showToast({
        icon: 'none',
        title: 'Insufficient balance, please recharge',
        duration: 1500
      })
      throw new Error(cs.toString());
    }
    await $n.checkLoginStatusFunc("Network error, please restart the app");
    const msg = await nim.V2NIMMessageService.sendMessage(message, oppUserId.value);

    await db.updateMessageStatus(msg, msg.message.createTime, "SUCCESS", cs);
    freeTotal.value--;
    msg.message.messageSendStatus = "SUCCESS";
    msg.message.spend = cs;
    messageList.value = messageList.value.map(item =>
      item.messageClientId === msg.message.messageClientId ? msg.message : item
    );
    await useUserStore().updateUserInfo();
  } catch (e) {
    await db.updateMessageStatus({message: message}, message.createTime, "FAIL", cs);
    message.messageSendStatus = "FAIL";
    messageList.value = messageList.value.map(item =>
      item.messageClientId === message.messageClientId ? message : item
    );
  }
};


onNavigationBarButtonTap((e: any) => {
  topMenuVisible.value = !topMenuVisible.value;
});

// 语音条监听事件
context.onPlay(() => {
});
context.onStop(() => {
  context.destroy();
});
// 图片消息点击放大
const checkOutThePictures = async (url) => {
  await uni.previewImage({
    urls: [url]
  });
};
//  视频点击放大
const playVideo = (item) => {
  const context = uni.createVideoContext(item.fromDeviceId);
  context.requestFullScreen();
};

function onOpenRemarkPop() {
  topMenuVisible.value = false;
  remarkPopVisible.value = true;
  message
    .prompt({
      title: `Current Name: ${"username"}`,
      inputValue: remarkInputValue.value,
      inputPlaceholder: "Please enter a remark name",
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel"
    })
    .then(async (res) => {
      if (!res.value) {
        await message.show("The note cannot be empty!");
        throw new Error("取消备注");
      }
      try {
        if (haveRemark.value) {
          await updateRemark(oppId.value, res.value);
        } else {
          await addRemark(oppId.value, res.value);
        }
        remarkInputValue.value = res.value + "";
        await uni.setNavigationBarTitle({
          title: remarkInputValue.value
        });
      } catch (err) {
        console.error("添加备注失败了");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function onCancelFollowed() {
  topMenuVisible.value = false;
  isFollowed.value = false;
  try {
    const res = await unFollowUser(Number(oppId.value));
  } catch (error) {
    isFollowed.value = true;
    console.log("取消关注失败", error);
  }
}

async function onFollowBtn() {
  console.log("当前要关注的用户id", oppUserId.value);
  isFollowed.value = true;
  try {
    await followUser(Number(oppId.value));
  } catch (err) {
    isFollowed.value = false;
    console.log("关注失败", err);
  }
}

function onCloseFollowTip() {
  followPopVisible.value = false;
}


const pushMessage = (message) => {
  console.log("我收到消息了", message);
  messageList.value.push(message);
  unreadMessages(nim, oppUserId.value)
  changeMainWindowHeight()

};
const playAudio = (item) => {
  context.src = item.attachment.url;
  context.play();
  // countdown(item)
};
const changeMainWindowHeight = () => {
  console.log(111111)
  nextTick(() => {
    uni.createSelectorQuery().select(".msgInput").boundingClientRect((res) => {
      const windowHeight = uni.getWindowInfo();
      scrollViewHeight.value = windowHeight.windowHeight - Math.floor(res.height);
    }).exec();
    uni.createSelectorQuery().select(".scrollContent").boundingClientRect((res) => {
      if (res) {
        scrollTop.value = new Date().getTime();
      }
    }).exec();
  });
};
onUnload(() => {
  uni.$off();
})
onLoad(async (optios) => {
  const {id, conversationId, userName, sayHiId} = optios;
  const {data: userData} = await getUserInfo(id);
  // console.warn("@@@@=>", data);
  const {gender, isFollowed: follow} = userData;
  const {data} = await getUserIdFromAccId([conversationId.split('|1|')[1]])
  console.log(userData)
  const eachOtherInfo = data[conversationId.split('|1|')[1]]
  oppId.value = id;
  oppUserId.value = conversationId;
  messageList.value = await getList();
  await unreadMessages(nim, conversationId)
  oppAvatar.value = eachOtherInfo.avatar ? getUrl(eachOtherInfo.avatar) : Number(gender) === 1 ? "/static/images/login/man.png" : "/static/images/login/woman.png"
  isFollowed.value = follow
  haveRemark.value = !!eachOtherInfo.nickname
  remarkInputValue.value = eachOtherInfo.nickname || eachOtherInfo.username
  console.log(remarkInputValue.value)
  uni.$on("receiveTextMessages", pushMessage);
  await uni.setNavigationBarTitle({
    title: remarkInputValue.value
  });
  await haveFreeTotal(id);
  if (sayHiId) {
    await sendHiMessage(sayHiId);
  }
  changeMainWindowHeight();

});
</script>

<style lang="scss" scoped>
@import './chatRoom.scss';
</style>
