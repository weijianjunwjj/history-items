<template>
  <view class="topics-search">
    <wd-input
      v-model="searchVal"
      type="text"
      no-border
      placeholder="Please enter a topic and search"
      clearable
      :maxlength="30"
      @input="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />

    <view
      class="textareaSelectPop"
      v-if="selectTopicPop"
      :style="{ top: customHtmlTop - 10 + 'px' }"
    >
      <view
        class="topicSelectItems flex-sb-c"
        v-for="(item, index) in searchTopicList"
        :key="index"
        @click.stop="onClickSelectTopicLabel(item)"
      >
        <p class="topicitemLabel flex-1 ellipsis">#{{ item.name }}</p>
        <p class="topicitemSpace txt-r" style="min-width: 70px">
          {{ item.heat ? item.heat + 'w Hot' : 'New' }}
        </p>
      </view>
    </view>

    <!-- 此为话题搜索列表 -->
    <view
      class="hotTopicInfoContent flex-c"
      style="margin-top: 10rpx; overflow: hidden"
      id="hotTopic"
    >
      <template v-for="(item, index) in selectedTopicList" :key="index">
        <wd-tag closable round @close="handleClose(index)" custom-class="my-tag ml-2 mb-3">
          #{{ item.name }}
        </wd-tag>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getHotTopicList } from '@/service/community/community'
import { debounce, get } from 'lodash'

const searchVal = ref('')
const selectTopicPop = ref(false)
const showSearchList = ref(false)

const searchTopicList = ref([])
const props = defineProps({
  selectedTopicList: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const emit = defineEmits([])

const selectedTopicList = computed({
  get() {
    return props.selectedTopicList
  },
  set(val) {
    emit('update:selectedTopicList', val)
  },
})

const onChange = debounce(function (val) {
  console.log('val :>> ', val)
  onSearchTopicName(val.value)
}, 200)

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

function onClickSelectTopicLabel(item) {
  console.log('item :>> ', item)
  selectedTopicList.value.push(item)
}

function handleClose(i) {
  selectedTopicList.value = selectedTopicList.value.filter((value, index) => index !== i)
}

function onFocus() {
  showSearchList.value = true
  onSearchTopicName(searchVal.value)
}
function onBlur() {
  console.log('onBlur')
  selectTopicPop.value = false
}

const onSearchTopicName = (keyword: string = null) => {
  getHotTopicList({ size: 20, name: keyword }).then((res: any) => {
    selectTopicPop.value = true
    console.log('res.data', res.data)
    searchTopicList.value = res.data
    console.log('searchTopicList.value?.length', searchTopicList.value?.length)
    if (searchTopicList.value?.length == 0) {
      searchTopicList.value.push({ id: 0, name: searchVal.value, heat: 0 })
    }
  })
}

defineExpose({
  selectedTopicList,
})
</script>

<style scoped lang="scss">
.topics-search {
  .hotTopicInfoContent {
    padding: 0 2rpx;
    box-sizing: border-box;
    flex-wrap: wrap;
    .topicItems {
      // height: 50rpx;
      background: #f7f7f7;
      border-radius: 24rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      font-weight: 500;
      font-size: 24rpx;
      color: #959595;
      margin-right: 12rpx;
      margin-bottom: 10rpx;
    }
  }
  .topicSelectItems{
    line-height: 36px;
    border-bottom: 1px solid #F7F7F7;
  }
  .my-tag {
    display: flex;
    :deep(.wd-tag__close) {
      margin-left: 5px !important;
    }
  }
}
</style>
