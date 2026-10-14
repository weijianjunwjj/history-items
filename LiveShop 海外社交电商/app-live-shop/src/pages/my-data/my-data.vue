<route lang="json5">
{
  style: {
    navigationBarTitleText: 'Edit Profile',
    enablePullDownRefresh: false,
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <div class="my-data">
    <header class="flex-cc">
      <view class="rel">
        <wd-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          image-mode="aspectFill"
          :action="action"
          :limit="1"
          :multiple="false"
          :show-limit-num="false"
          @change="handleUploadChange"
          custom-class="wdCustomUploadClass"
        ></wd-upload>
        <image
          src="../../static/images/my/upload-tx.png"
          class="upload-tx"
          @click="clearAndTriggerUpload"
        />
      </view>
    </header>

    <Card class="card mlr-6">
      <view class="card-item flex-sb-c">
        <text class="label">ID(non-editable)</text>
        <text class="value txt-r">{{ data.Id }}</text>
      </view>
      <view class="card-item flex-sb-c">
        <text class="label">Gender(non-editable)</text>
        <text class="value txt-r">{{ data.gender == 1 ? 'man' : 'woman' }}</text>
      </view>
      <view class="card-item flex-sb-c">
        <text class="label">Name</text>
        <view class="flex-c" @click="withSlot('nickname')">
          <text class="value name-nowrap txt-r" style="line-height: 33rpx">
            {{ data.nickname }}
          </text>
          <image
            src="../../static/images/my/right-arrow-grey.png"
            style="width: 14rpx; height: 23rpx"
            class="ml-4"
          />
        </view>
      </view>
      <view class="card-item flex-sb-c">
        <text class="label">Birthday</text>
        <view class="flex-c">
          <picker
            mode="date"
            :value="data.birthDay"
            @change="bindDateChange"
            style="flex: 1; height: 100%; margin-left: 20rpx; color: #bbbbbb"
            class="flex-c"
          >
            <view class="value txt-r">{{ data.birthDay ? data.birthDay : 'Choose Date' }}</view>
          </picker>
          <!-- <text class="value" style="line-height: 23rpx">{{ data.birthDay }}</text> -->
          <image
            src="../../static/images/my/right-arrow-grey.png"
            style="width: 14rpx; height: 23rpx"
            class="ml-4"
          />
        </view>
      </view>
      <view class="card-item flex-sb-c">
        <text class="label">Height</text>
        <view class="flex-c" @click="withSlot('height')">
          <text class="value txt-r" style="line-height: 23rpx">{{ data.height }}CM</text>
          <image
            src="../../static/images/my/right-arrow-grey.png"
            style="width: 14rpx; height: 23rpx"
            class="ml-4"
          />
        </view>
      </view>
      <view class="card-item flex-sb-c">
        <text class="label">Weight</text>
        <view class="flex-c" @click="withSlot('weight')">
          <text class="value txt-r" style="line-height: 23rpx">{{ data.weight }}KG</text>
          <image
            src="../../static/images/my/right-arrow-grey.png"
            style="width: 14rpx; height: 23rpx"
            class="ml-4"
          />
        </view>
      </view>
    </Card>
    <Card class="card mlr-6 mt-4">
      <view class="card-item flex-sb-c">
        <text class="label mr-4">Signature</text>
        <view class="flex-c" @click="withSlot('signature', 160)">
          <text class="value text-wrap" style="line-height: 33rpx">{{ data.signature }}</text>
          <image
            src="../../static/images/my/right-arrow-grey.png"
            style="min-width: 14rpx; width: 14rpx; height: 23rpx; display: block"
            class="ml-2"
          />
        </view>
      </view>
    </Card>

    <wd-message-box selector="wd-message-box-slot" custom-class="my-wd-message-box-slot">
      <wd-input
        type="text"
        v-model="curVal"
        :placeholder="`please input ${curLabel}`"
        :maxlength="maxLength"
      />
    </wd-message-box>

    <wd-button custom-class="saveBtn" @click="onSave">Save</wd-button>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useMessage } from 'wot-design-uni/components/wd-message-box'
import { userEdit, getUserInfo } from '@/service/login/login'
import { useToast } from 'wot-design-uni'
import { UploadFile } from 'wot-design-uni/components/wd-upload/types'
import { getAvatar, getUrl } from '@/utils/utils'
import { cloneDeep } from 'lodash'
import { useUserStore } from '@/store/user'

const { userInfo, updateUserInfo } = useUserInfo()
const data: any = ref({})
const toast = useToast()

const maxLength = ref(64)

const curLabel = ref('')
const curVal = ref('')

const message = useMessage('wd-message-box-slot')

const fileList = ref<UploadFile[]>([])
const action: string = '/File/upload'

function handleUploadChange({ fileList: files }) {
  console.log('files', files)
  if (files.length > 0) {
    data.value.avator0 = JSON.parse(files[0].response).data.file_name
    data.value.avator =
      uni.getStorageSync('fileUrlPre') + JSON.parse(files[0].response).data.file_name
  } else {
    data.value.avator0 = ''
    data.value.avator = ''
  }

  console.log('data.value', data.value)
}

function getBirthday(dateString: string) {
  return dayjs(dateString).format('YYYY.MM.DD')
}

function bindDateChange(e) {
  data.value.birthDay = e.detail.value
}

function withSlot(key, maxlength?) {
  curVal.value = data.value[key]
  if (maxlength) {
    maxLength.value = maxlength
  } else {
    maxLength.value = 64
  }
  message
    .confirm({
      title: 'Edit',
      confirmButtonText: 'sure',
      cancelButtonText: 'cancel',
    })
    .then(() => {
      console.log('curVal.value', curVal.value)
      data.value[key] = curVal.value
    })
    .catch((error) => {})
}

function onSave() {
  const {
    Id: id,
    nickname,
    gender,
    avator,
    avator0,
    birthDay,
    city,
    signature,
    weight,
    height,
  } = data.value
  const ava=avator0 || avator
  const params = {
    id, //用户id
    nickname, //用户昵称
    gender, //1 男，2女
    avator: ava, //头像
    birthDay, //生日
    city,
    weight: +weight,
    height: +height,
    signature,
  }
  console.log('params', params)
  userEdit(params).then(async (res) => {
    toast.success({msg:'save success',duration:2000})
    await updateUserInfo()
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 2000)
  })
}

watch(
  () => userInfo.value,
  (val) => {
    query()
  },
  { deep: true },
)

async function query() {
  fileList.value = [
    {
      url: getAvatar(userInfo.value),
    },
  ]
  data.value = cloneDeep(userInfo.value)
}

const uploadRef = ref()

function clearAndTriggerUpload() {
  // 清空文件列表
  fileList.value = []
}

onMounted(() => {
  query()
})
</script>

<style lang="scss" scoped>
:deep(.wdCustomUploadClass) {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  .wd-upload__picture {
    border-radius: 50%;
  }
  .wd-upload__evoke {
    margin: 0;
    background: #f1f1f1;
    border-radius: 50%;
    width: 182rpx;
    height: 182rpx;
  }
  .wd-upload__preview {
    margin: 0;
  }
}
</style>

<style lang="scss">
page {
  background-color: #f6f6f6;
}
.my-data {
  header {
    height: 264rpx;
  }
  .upload-tx {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 44rpx;
    height: 44rpx;
  }
  .saveBtn {
    position: fixed;
    bottom: 56rpx;
    left: 0;
    right: 0;
    margin: auto;
    width: 694rpx;
    background-color: #000 !important;
  }
  .card {
    padding: 14rpx 0;
    .card-item {
      padding: 14rpx 20rpx;
      .label {
        font-size: 28rpx;
        color: #404040;
      }
      .value {
        font-size: 28rpx;
        color: #959595;
      }
    }
  }
  .wd-upload__close {
    display: none !important;
  }
  .flex-sb-c {
    box-sizing: border-box;
  }
  .name-nowrap {
    width: 500rpx;
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏超出容器的内容 */
    // text-overflow: ellipsis;
  }
  :deep(.wd-upload__close) {
    display: none !important;
  }
}

.my-wd-message-box-slot {
  .wd-button {
    width: 80px !important;
    min-width: auto !important;
  }
}
</style>
