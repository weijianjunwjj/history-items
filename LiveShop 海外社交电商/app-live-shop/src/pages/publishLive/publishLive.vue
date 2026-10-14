<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: 'Post Update',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="publishLiveContainer" @click="onClosePop">
    <view class="publish_marjorContent">
      <wd-input
        type="text"
        custom-input-class="cic"
        v-model="publishTitle"
        placeholder=" Please enter the title"
        clearable
        :maxlength="30"
        style="margin-bottom: 12px;"
      />
      <view class="editorContent">
        <lsj-edit
          ref="lsjEdit"
          placeholder="Please enter the update content…"
          :maxCount="200"
          :html="lsjEditHtml"
          @onReady="editReady"
          style="height: 260rpx;"
        ></lsj-edit>
      </view>

      <!-- 话题搜索框框 -->
      <view class="mb-5">
        <TopicsSearch ref="topicsSearch" v-model:selectedTopicList="selectedTopicList" />
      </view>

      <!-- <view
        class="textareaSelectPop"
        v-if="selectTopicPop"
        :style="{ top: customHtmlTop - 10 + 'px' }"
      >
        <view
          class="topicSelectItems flex-sb-c"
          v-for="(item, index) in allTopicList"
          :key="index"
          @click.stop="onClickSelectTopicLabel(item)"
        >
          <p class="topicitemLabel flex-1 ellipsis">#{{ item.name }}</p>
          <p class="topicitemSpace">{{ item.heat ? item.heat + 'w Hot' : '' }}</p>
        </view>
      </view> -->
      <!-- <view
        class="hotTopicInfoContent flex-c"
        style="margin-top: 10rpx; overflow: hidden"
        id="hotTopic"
      >
        <view
          class="topicItems flex-cc"
          @click.stop="onInsertPublishDesc(item.name)"
          v-for="(item, index) in hotTopicList"
          :key="index"
        >
          #{{ item.name }}
        </view>
      </view> -->
      <!-- <view class="hotTopicInfoContent customTopicInfo flex-c">
        <view class="topicItems flex-cc" @click.stop="onInsertPublishTopic"># TOPIC</view>
      </view> -->
      <view class="publishUploadContentBox">
        <wd-upload
          :accept="uploadType"
          v-model:file-list="fileList"
          image-mode="aspectFill"
          :action="action"
          :limit="9"
          :source-type="['album']"
          multiple
          @change="handleUploadChange"
          :before-upload="beforeUpload"
          custom-class="wdCustomUploadClass"
          :before-choose="beforeChoose"
        ></wd-upload>
      </view>
    </view>

    <view class="publish_bottombtnbox">
      <view class="publishBotLeftmoney" @click.stop="onSaveCurrentPublish">
        <wd-icon name="save" size="26px" color="#666666"></wd-icon>
        <p>SAVE</p>
      </view>
      <wd-button custom-class="publishSureBtn" @click.stop="onClickPublishSubmit">
        Publish Now
      </wd-button>
    </view>
    <!-- <wd-message-box selector="message-slot">
			<wd-radio-group v-model="uploadType" shape="button">
				<wd-radio value="video">Video</wd-radio>
				<wd-radio value="image">Image</wd-radio>
			</wd-radio-group>
		</wd-message-box> -->
    <wd-message-box selector="message-slot" custom-class="custom-msg-box">
      <view class="overlay-box">
        <view class="select-box">
          <view class="header">please select a tpye</view>
          <view class="select-bnt">
            <view
              class="add-box"
              :class="uploadType == 'image' ? 'select-active' : ''"
              @click="uploadType = 'image'"
            >
              <view class="content">
                <image
                  class="img"
                  src="../../static/images/person-page/select-imgicon.png"
                  mode="scaleToFill"
                />
                <view class="tiptxt">Photo</view>
              </view>
            </view>
            <view
              class="add-box"
              :class="uploadType == 'video' ? 'select-active' : ''"
              @click="uploadType = 'video'"
            >
              <view class="content">
                <image
                  class="img"
                  src="../../static/images/person-page/select-videoicon.png"
                  mode="scaleToFill"
                />
                <view class="tiptxt">Video</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </wd-message-box>
  </view>
</template>

<script lang="ts" setup>
import { onPostAdd, getHotTopicList, getDictSn } from '@/service/community/community'
import type { UploadFile } from 'wot-design-uni/components/wd-upload/types'
import { useMessage, useToast } from 'wot-design-uni'
import TopicsSearch from '../../components/TopicsSearch/TopicsSearch.vue'
import eventBus from '@/utils/eventBus';

const message = useMessage()
const mediaMessage = useMessage('message-slot')
const toast = useToast()

const publishTitle = ref<string>('')
const selectionEnd = ref(0)
const selectTopicPop = ref(false)
const uploadType = ref<string | null>()
const editorIns = ref(null)
const editorHTml = ref('')
const editorText = ref('')
const topicMaxSize = ref(0)
const hotTopicList = ref([])
const topicsSearch = ref()
let overlayShow = ref<boolean>(false)
let selectUpCss = ref('')

const selectedTopicList=ref([])

// const selectedTopicList0 = computed(() => {
//   return  topicsSearch.value.selectedTopicList?.map((item) => item.name)
// })

// 编辑器初始化完毕，返回edit对象
function editReady(edit) {
  editorIns.value = edit
  // ---监听光标进入
  edit.$on('edit:focus', (e) => {
    // console.log('监听光标进入', e)
    selectTopicPop.value = false
  })
  // ---监听输入
  edit.$on('edit:input', (e) => {
    editorHTml.value = e.detail.html
    editorText.value = e.detail.text
    if (e.detail.delta.ops[e.detail.delta.ops.length - 1].insert.includes('#')) {
      let str = e.detail.delta.ops[e.detail.delta.ops.length - 1].insert
      if (str.trim().slice(-1) == '#') {
        editorIns.value.tool('undo')
        selectTopicPop.value = true
      }
    } else {
      //多级结构有空格 字符不在最后一项 无法识别 # ????
    }

    // if (/\#/.test(e.detail.text.trim().slice(-1))) {
    //   selectTopicPop.value = true
    //     editorIns.value.tool('undo')
    // } else {
    //   selectTopicPop.value = false
    // }
  })
  // ---监听光标指向不同样式时回调
  edit.$on('edit:statuschange', (e) => {
    // console.log('监听光标当前位置样式变化', JSON.stringify(e))
  })
}

// 插入话题
async function addLink(str: string) {
  editorIns.value.addLink({
    prefix: '#',
    suffix: '#',
    name: str,
    // data: { // 插入链接可以跳转
    //   name: '跳转',
    //   qqGroupChatID: '123456',
    // },
  })
}
// @某人
function addLink2(userName: string, userId: number) {
  editorIns.value.addLink({
    prefix: '@',
    name: userName,
    data: {
      userId: userId,
    },
  })
}

// 提取字符串中的话题
function getHashtagData(str: string) {
  let regex = /\#([^#]+)\#/g
  let item
  let arr = []
  while ((item = regex.exec(str)) !== null) {
    arr.push(item[1])
  }
  return arr
}

function onClickPublishSubmit() {
  //   editorIns.value.getContents().then((res: any) => {
  //     console.log(res.html)
  //     console.log(res.text)
  //     console.log('提取话题', getHashtagData(res.text))
  //   })

  const mediaUrl = fileList.value
    .map((v) => {
      return JSON.parse(v.response as any).data.file_name
    })
    .join(',')

  console.log('publishTitle.value', publishTitle.value)
  if (!publishTitle.value) {
    return uni.showToast({
      title: 'Please enter the title',
      icon: 'none',
      duration: 3000,
      mask: false,
    })
  }
  if (!editorHTml.value) {
    return uni.showToast({
      title: 'Please enter the update content',
      icon: 'none',
      duration: 3000,
      mask: false,
    })
  }
  const linkTopic = selectedTopicList.value?.map((item) => item.name)

  let params = {
    title: publishTitle.value,
    content: editorHTml.value,
    mediaUrl: mediaUrl,
    mediaType: 1,
    linkTopic,
    // linkTopic: getHashtagData(editorText.value),
  }

  onPostAdd(params).then((res: any) => {
    if (res.code === 0) {
      toast.success('Successfully Added')
      eventBus.emit('refresh_clist');
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/community/community',
        })
      }, 1200)
    }
  })
}

const fileList = ref<UploadFile[]>([])
const action: string = '/File/upload'
const beforeUpload = ({files, resolve}) => {
  for (let i = 0; i < files.length; i++) {
    if (files[i].size >= 10485760) {
      return message.show('The file cannot be larger than 10M')
    }
  }
  resolve(true)
}
// 选择图片前上传操作
const beforeChoose = async ({ resolve }) => {
  try {
    if (!fileList.value.length) {
      await mediaMessage.confirm({
        confirmButtonText: 'Ok',
        cancelButtonText: '×',
      })
      if (!uploadType.value) return message.show('Please select first!')
      resolve(true)
    } else {
      resolve(true)
    }
  } catch (err) {
    resolve(false)
  }
}
function handleUploadChange({ fileList: files }) {
  fileList.value = files
}

function handleTextAreaInput(e: any) {
  selectionEnd.value = e?.cursor
  if (/\#/.test(e.value.slice(-1))) {
    selectTopicPop.value = true
  } else {
    selectTopicPop.value = false
  }
}

function onClosePop() {
  selectTopicPop.value = false
}

function insertHtmlEditor(str: string) {
  const linkFlag = str
  const editorCtx = editorIns.value
  // 先插入一段文本内容
  editorCtx.insertText({
    text: linkFlag,
  })
  // 获取全文delta内容
  editorCtx.getContents({
    success(res: any) {
      let options = res.delta.ops
      const findex = options.findIndex((item) => {
        return (
          item.insert && typeof item.insert !== 'object' && item.insert?.indexOf(linkFlag) !== -1
        )
      })
      if (findex > -1) {
        const findOption = options[findex]
        const findAttributes = findOption.attributes
        // 将该findOption分成三部分：前内容 要插入的link 后内容
        const [prefix, suffix] = findOption.insert.split(linkFlag)
        const handleOps = []
        if (prefix) {
          const prefixOps = findAttributes
            ? {
                insert: prefix,
                attributes: findAttributes,
              }
            : {
                insert: prefix,
              }
          handleOps.push(prefixOps)
        }
        // 插入的标签
        const linkOps = {
          insert: linkFlag,
          attributes: {
            color: '#00dba1',
          },
        }
        handleOps.push(linkOps)

        if (suffix) {
          const suffixOps = findAttributes
            ? {
                insert: suffix,
                attributes: findAttributes,
              }
            : {
                insert: suffix,
              }
          handleOps.push(suffixOps)
        }

        options.splice(findex, 1)
        options.splice(findex, 0, ...handleOps)
        editorCtx.blur()
        editorCtx.setContents({
          delta: {
            ops: options,
          },
        })
      }
    },
  })
}

function onInsertPublishDesc(value: string) {
  addLink(value)
}

function onInsertPublishTopic() {
  selectTopicPop.value = true
}

function onClickSelectTopicLabel(item: any) {
  addLink(item.name)
  selectTopicPop.value = false
}

function onSaveCurrentPublish() {
  if (!editorText.value.trim()) {
    return uni.showToast({
      title: 'Please enter the title and content',
      icon: 'none',
      mask: true,
    })
  }
  message
    .confirm({
      msg: 'Confirm to save and exit?',
      confirmButtonText: 'save',
      cancelButtonText: 'cancel',
      closeOnClickModal: false,
    })
    .then(() => {
      let params = {
        title: publishTitle.value,
        editorHTml: editorHTml.value,
        editorText: editorText.value,
        editorTopic: selectedTopicList.value,
        mediaUrl: fileList.value,
      }
      uni.setStorageSync('draft', JSON.stringify(params))

      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 100)
    })
    .catch(() => {
      uni.removeStorageSync('draft')
    })
}

const allTopicList = ref([])

const onSearchTopicName = (keyword: string = null) => {
  getHotTopicList({ size: 20, name: keyword }).then((res: any) => {
    if (res.code === 0) {
      allTopicList.value = res.data
    }
  })
}
const lsjEditHtml = ref('')

onLoad(async () => {
  const resDic: any = await getDictSn({ dictSn: 'HOT_TOPIC_NUMBER' })
  topicMaxSize.value = resDic.data?.list[0]?.value
  const res: any = await getHotTopicList({ size: topicMaxSize.value })
  if (res.code === 0) {
    hotTopicList.value = res.data
  }

  if (uni.getStorageSync('draft')) {
    message
      .confirm({
        msg: 'Whether to restore the last edit?',
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        closeOnClickModal: false,
      })
      .then(() => {
        let draftData = JSON.parse(uni.getStorageSync('draft'))
        fileList.value = draftData.mediaUrl
        publishTitle.value = draftData.title
        editorHTml.value = draftData.editorHTml
        editorText.value = draftData.editorText
        selectedTopicList.value = draftData.editorTopic
        lsjEditHtml.value = draftData.editorHTml
        setTimeout(() => {
          uni.removeStorageSync('draft')
        }, 200)
      })
      .catch(() => {
        uni.removeStorageSync('draft')
      })
  }
})
const customHtmlTop = ref(0)
onMounted(() => {
  uni
    .createSelectorQuery()
    .select('#hotTopic')
    .boundingClientRect((data: any) => {
      customHtmlTop.value = data.top
    })
    .exec()
})

// onBackPress((e) => {
//   if (e.from === 'backbutton') {
//     console.log('导航栏返回按钮被点击')
//     return true
//   }
//   return false
// })
// 选择上传类型样式
const selectUpCssFun = (event: string) => {
  selectUpCss.value = event
  uploadType.value = selectUpCss.value
}
const onMsgShow = () => {
  // mediaMessage.confirm()
  // .catch((error) => {
  //   console.log(error)
  // })
  mediaMessage.confirm({}).catch((error) => {
    console.log(error)
  })
}
</script>

<style lang="scss" scoped>
@import './publishLive.scss';
</style>
