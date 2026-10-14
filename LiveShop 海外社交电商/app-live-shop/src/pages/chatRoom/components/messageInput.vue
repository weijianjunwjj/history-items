<script lang="ts" setup>
import {processedEmojis} from "@/utils/processed_emojis";
import {useNimStore} from "@/store";
import {cloneDeep} from "lodash";
import db from "@/utils/sqlite";

const props = defineProps({
  conversationId: String
});
const emit = defineEmits();
// const nim = inject('$nim')
const nim = useNimStore().instance;
// 是否显示发送按钮
const showSend = ref<boolean>(false);
const showEmoji = ref<boolean>(false);
const showPanel = ref<boolean>(false);
const inputFocus = ref<boolean>(false);
onMounted(() => {
  // console.error(props.conversationId)
})
watch(() => showEmoji.value, (newVal) => {
  // emit()

  if (newVal === true) {
    showPanel.value = false;
    inputFocus.value = false;
  }
  nextTick(() => {
    console.log("高度变化了");
    emit("heightChange");
  });
});
watch(() => showPanel.value, (newVal) => {
  // emit()
  if (newVal === true) {
    showEmoji.value = false;
    inputFocus.value = false;
  }
  nextTick(() => {
    console.log("高度变化了");
    emit("heightChange");
  });
});
// 面板功能区数组数据
const panelList = [
  {
    src: "/static/images/chat/Image.png",
    id: 0,
    text: "Photo"
  },
  {
    src: "/static/images/chat/Camera.png",
    id: 1,
    text: "Shooting"
  },
  {
    src: "/static/images/chat/Video.png",
    id: 2,
    text: "Video"
  },
  {
    src: "/static/images/chat/Filming.png",
    id: 3,
    text: "Filming"
  }
];
//录音功能实例
const voiceInstance = uni.getRecorderManager();
// 用来播放音频的额
const innerAudioContext = uni.createInnerAudioContext();
// 作为全局维护发送的消息的响应式数据 防止我写多了就乱套了
const messageContext = reactive({
  sendTextMessage: "", // 文字消息的vmodel绑定值
  // 发送什么消息 0-文字 1-语音 2-图片 3-视频 4-文件 5-emoji
  sendType: 0,
  isSpeaking: false
});
voiceInstance.onStart(async () => {
  console.log("开始录音了");

});
voiceInstance.onStop(async (data) => {
  console.log("结束录音了", data);
  try {
    const {tempFilePath} = data;
    const message = nim.V2NIMMessageCreator.createAudioMessage(tempFilePath);
    // message.message.audioTime = message.message.attachment.duration;
    const send = await sendMessageFunc(message);
    emit("message", send);
    // await uni.removeSavedFile({ filePath: audioInfo.fileList[0].filePath });
  } catch (err) {
    console.error(err);
  }
});
const sendMessageFunc = async (message) => {
  const insertMessage = cloneDeep(message);
  insertMessage.conversationId = props.conversationId;
  insertMessage.messageSendStatus = "PENDING";
  await db.insertTableData({message: insertMessage});
  return insertMessage
};
// 点击面板发送图片等 枚举值 0-图片相册选择 1-相机拍照 2-视频相册选择 3-视频录制
const sendFile = (type: number) => {
  switch (type) {
    case 0:
      sendImage(type);
      break;
    case 1:
      sendImage(type);
      break;
    case 2:
      sendVideo(type);
      break;
    case 3:
      sendVideo(type);
      break;
  }
};
// 点击图片上传逻辑
const sendImage = async (type?: number) => {
  const image = await uni.chooseImage({count: 1, sourceType: type === 0 ? ["album"] : ["camera"]});
  const message = nim.V2NIMMessageCreator.createImageMessage(image.tempFilePaths[0]);
  const send = await sendMessageFunc(message);
  console.log("图片", send);
  emit("message", send);
};
// 点击视频上传逻辑
const sendVideo = async (type?: number) => {
  try {
    const video = await uni.chooseVideo({sourceType: type === 2 ? ["album"] : ["camera"]});
    const message = nim.V2NIMMessageCreator.createVideoMessage(video.tempFilePath);
    const send = await sendMessageFunc(message);
    emit("message", send);
  } catch (err) {
    console.error("videoChooseErr:", err);
  }
};
// 点击这几个图标触发切换模式的函数
const changeType = (type: number) => {
  switch (type) {
    case 1:
      messageContext.sendType = messageContext.sendType === 1 ? 0 : 1;
      break;
    case 2:
      showPanel.value = !showPanel.value;
      break;
    case 5:
      showEmoji.value = !showEmoji.value;
      messageContext.sendType = 0;
      showSend.value = showEmoji.value;
      break;
  }
};
// 点击触发语音功能
const toSpeak = (type: number) => {
  switch (type) {
    case 0:
      console.log("触发说话了");
      voiceInstance.start({
        duration: 60000
      });
      break;
    case 1:
      voiceInstance.stop();
      break;
  }
  messageContext.isSpeaking = !messageContext.isSpeaking;
};
const handleFocus = async () => {
  showPanel.value = false;
  showEmoji.value = false;
  await nextTick(() => {
    inputFocus.value = true;
  });
};
const sendText = async () => {
  const message = nim.V2NIMMessageCreator.createTextMessage(messageContext.sendTextMessage);
  try {
    // console.warn('构建的什么消息体',message);
    // const insertMessage = cloneDeep(message)
    // insertMessage.conversationId = props.conversationId
    // insertMessage.messageSendStatus = 'PENDING'
    // await db.insertTableData({message: insertMessage})
    const send = await sendMessageFunc(message);
    emit("message", send);
  } catch (err) {
    console.error("发送失败", err);
    message.isSend = 0
  }

  messageContext.sendTextMessage = "";
};
const addEmoji = (item) => {
  const {url} = item;
  // 插入表情符号
  messageContext.sendTextMessage += url;
};
const touchend = () => {
  toSpeak(1);
  messageContext.isSpeaking = false;
};
const longTap = () => {
  toSpeak(0);
  messageContext.isSpeaking = true;
};
const keyboardChange = (data) => {
  console.log("键盘高度变化", data);
  emit("heightChange");
};
</script>

<template>
  <view class="container">
    <view class="inputArea flex-c">
      <!-- 输入框部分位置 -->
      <image
        class="icon voice"
        mode="heightFix"
        src="@/static/images/chat/voice.png"
        @click="changeType(1)"
      />
      <input v-if="messageContext.sendType === 0" v-model="messageContext.sendTextMessage"
             :cursor-spacing="10"
             :focus="inputFocus"
             class="messageInput"
             @blur="inputFocus = false"
             @keyboardheightchange="keyboardChange" @touchend.prevent="handleFocus"

      />
      <!--      @click="toSpeak(0)"-->
      <view
        v-if="messageContext.sendType === 1"
        :class="{'voiceButton':true,'isSpeaking':messageContext.isSpeaking}"
        @longpress="longTap" @touchend="touchend"
      >
        {{ messageContext.isSpeaking ? `Press And Hold To Speak` : `Release To Send` }}
      </view>
      <image
        class="icon emoji"
        mode="heightFix"
        src="@/static/images/chat/emoji.png"
        @click="changeType(5)"
      />
      <image v-if="!messageContext.sendTextMessage"
             class="icon add"
             mode="heightFix"
             src="@/static/images/chat/addOther.png"
             @click="changeType(2)"
      />
      <!--      v-if="showSend"-->
      <image v-else class="icon send" mode="heightFix" src="@/static/images/chat/send-message.png"
             @click="sendText"/>
    </view>
    <view v-if="showPanel" class="panel">
      <view v-for="item in panelList" :key="item" class="panel_item">
        <view class="panel_item_icon" @click="sendFile(item.id)">
          <image :src="item.src" class="icon" mode="heightFix"/>
        </view>
        <text class="panel_item_text">{{ item.text }}</text>
      </view>
    </view>
    <view v-show="showEmoji" class="emojiPanel">
      <view v-for="item in processedEmojis" :key="item.key" style="font-size: 26px;" @click="addEmoji(item)">
        {{ item.url }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
