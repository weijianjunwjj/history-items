<route lang="json5">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '基础信息',
    'app-plus': {
      titleNView: false,
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <view class="basicInforMationContainer">
    <swiper
      class="swiper"
      :indicator-dots="false"
      :autoplay="autoplay"
      :duration="duration"
      :current="currentIndex"
      @change="onSwiperChange"
    >
      <swiper-item>
        <view class="progress">1/5</view>
        <view class="swiper-item">
          <p class="swiperItem_title">Gender?</p>
          <p class="swiperItem_desctitle">
            Please fill in carefully. Gender cannot be changed after registration.
          </p>

          <view class="userBasicSex">
            <view
              class="sexItemInfo flex-c"
              :class="{ activeSex: currentSex == 1 }"
              @click="onChangeUserSex(1)"
            >
              <image src="/static/images/login/man.png" class="sexImg" />
              <p>Men</p>
            </view>

            <view
              class="sexItemInfo sexWomen flex-c"
              :class="{ activeSex: currentSex == 2 }"
              @click="onChangeUserSex(2)"
            >
              <p>Women</p>
              <image src="/static/images/login/woman.png" class="sexImg" />
            </view>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="progress">2/5</view>
        <view class="swiper-item">
          <p class="swiperItem_title">Birthday?</p>
          <p class="swiperItem_desctitle">
            Only with the correct birthday can you be matched, and you will also receive blessings
            from your friends.
          </p>
          <view class="userBasicBirthday">
            <p class="dateLabel">Date</p>
            <view class="timeSelectContent flex-c">
              <wd-icon name="time" size="22px" color="#959595"></wd-icon>
              <!-- <wd-calendar
                v-model="valueTime"
                placeholder="Choose Date"
                style="flex: 1"
                :max-date="Date.now()"
              /> -->
              <picker
                mode="date"
                :value="valueTime"
                @change="bindDateChange"
                style="flex: 1; height: 100%; margin-left: 20rpx; color: #bbbbbb"
                class="flex-c"
              >
                <view class="uni-input">{{ valueTime ? valueTime : 'Choose Date' }}</view>
              </picker>
              <wd-icon
                name="close-circle-filled"
                size="22px"
                color="#959595"
                v-show="valueTime"
                @click="onCloseCalendarTime"
              ></wd-icon>
            </view>
          </view>
          <view class="flex-cc nextStepBtnP">
            <wd-button custom-class="nextStepBtn" type="info" @click="goToNextPage">
              Next Step
            </wd-button>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="progress">3/5</view>
        <view class="swiper-item">
          <p class="swiperItem_title">Name?</p>
          <p class="swiperItem_desctitle">
            Please enter your name in the field below. This will help us personalize your experience
            and make it more enjoyable.
          </p>
          <view class="userBasicName flex-cc">
            <wd-input
              type="text"
              v-model="userName"
              custom-input-class="cic"
              placeholder="Please enter your name."
              clearable
              style="width: 100%; text-align: center"
            />
          </view>

          <view class="flex-cc nextStepBtnP">
            <wd-button custom-class="nextStepBtn" type="info" @click="goToNextPage">
              Next Step
            </wd-button>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="progress">4/5</view>
        <view class="swiper-item">
          <p class="swiperItem_title">Location?</p>
          <p class="swiperItem_desctitle">
            Please enter your location address in the field below. This helps us provide you with
            relevant information and services tailored to your area.
          </p>
          <view class="userBasicLocation">
            <view class="pikerBoxInfo flex-c">
              <wd-picker
                :columns="addressState"
                v-model="stateLocalValue"
                @confirm="handleStateConfirm"
                placeholder="State"
                custom-class="wcLocatonPiker"
              />
            </view>

            <view class="pikerBoxInfo flex-c" style="margin-top: 72rpx">
              <wd-picker
                :columns="addressCity"
                v-model="cityocalValue"
                @confirm="handleCityConfirm"
                placeholder="City"
                custom-class="wcLocatonPiker"
              />
            </view>
          </view>

          <view class="flex-cc nextStepBtnP">
            <wd-button custom-class="nextStepBtn" type="info" @click="goToNextPage">
              Next Step
            </wd-button>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="progress">5/5</view>
        <view class="swiper-item">
          <p class="swiperItem_title">Avatar?</p>
          <p class="swiperItem_desctitle">
            Finally, choose a photo to use as your profile picture.
          </p>
          <view class="userBasicAvatar flex flex-vc just-c">
            <view class="uploadImgBox flex-cc">
              <wd-upload
                v-model:file-list="fileList"
                image-mode="aspectFill"
                :action="action"
                :limit="1"
                :multiple="false"
                :show-limit-num="false"
                @change="handleUploadChange"
                custom-class="wdCustomUploadClass"
                custom-preview-class="cpc-bi"
              ></wd-upload>
            </view>

            <p>Upload Avatar</p>
          </view>
          <view class="flex-cc nextStepBtnP">
            <wd-button custom-class="nextStepBtn" type="info" @click="onSubmitUserInfo">
              {{ isFinish ? 'Finished' : 'Next Step' }}
            </wd-button>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
import { getAddresslocation } from '@/service/adress/adress'
import { userEdit } from '@/service/login/login'
import { throttle } from 'lodash'
import { useToast } from 'wot-design-uni'
import type { UploadFile } from 'wot-design-uni/components/wd-upload/types'

const indicatorDots = ref(true)
const autoplay = ref(false)
const duration = ref(500)
const currentSex = ref()
const valueTime = ref<string>(null)
const userName = ref('')

const addressAllLocation = ref([])
const addressState = ref<any[]>()
const addressCity = ref<any[]>()
const stateLocalValue = ref('')
const cityocalValue = ref('')
const isFinish = ref(false)
const toast = useToast()
const { updateUserInfo } = useUserInfo()

function bindDateChange(e) {
  valueTime.value = e.detail.value
  setTimeout(() => {
    goToNextPage()
  }, 100)
}

const fileList = ref<UploadFile[]>([])
const action: string = '/File/upload'
const avatorUrl = ref('')

function handleUploadChange({ fileList: files }) {
  fileList.value = files

  if (fileList.value.length > 0) {
    avatorUrl.value =
      uni.getStorageSync('fileUrlPre') +
      JSON.parse(fileList.value[0].response as any).data.file_name
    isFinish.value = true
  } else {
    avatorUrl.value = ''
  }
}

function handleStateConfirm({ value }) {
  stateLocalValue.value = value
  cityocalValue.value = ''
  const areaDatanew = addressAllLocation.value.find((v) => v.id == value)?.children
  if (areaDatanew && areaDatanew.length) {
    addressCity.value = [
      areaDatanew.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      }),
    ]
  }
}

function handleCityConfirm({ value }) {
  cityocalValue.value = value
  goToNextPage()
}

function onChangeUserSex(eI: number) {
  currentSex.value = eI
  goToNextPage()
}

function onCloseCalendarTime() {
  valueTime.value = null
}

const getAddressLocationAll = () => {
  getAddresslocation().then((res) => {
    if (res.code === 0) {
      addressAllLocation.value = res.data as []
      addressState.value = [
        addressAllLocation.value.map((item) => {
          return {
            value: item.id,
            label: item.name,
          }
        }),
      ]
    }
  })
}

async function onSubmitUserInfo() {
  if (currentSex.value == null) {
    return toast.show('Please select your gender')
  }
  if (valueTime.value == null) {
    return toast.show('Please select your birthDay')
  }
  if (userName.value == '') {
    return toast.show('Please input your name')
  }
  if (stateLocalValue.value == '') {
    return toast.show('Please select your state')
  }
  if (cityocalValue.value == '') {
    return toast.show('Please select your city')
  }
  const userInfo = uni.getStorageSync('userInfo')
  const params = {
    id: userInfo.Id,
    nickname: userName.value,
    gender: currentSex.value,
    avator: avatorUrl.value,
    birthDay: valueTime.value,
    // birthDay: valueTime.value ? dayjs(valueTime.value).format('YYYY-MM-DD') : '',
    state: stateLocalValue.value,
    city: cityocalValue.value,
  }
  console.log('params-----------------------', params)
  userEdit(params).then((res: any) => {
    if (res.code === 0) {
      updateUserInfo()
      uni.switchTab({
        url: '/pages/index/index',
        fail: (fail) => {
          uni.redirectTo({
            url: '/pages/index/index',
          })
        },
      })
    }
  })
}

// 状态变量
const currentIndex = ref(0) // 当前页面索引
// 跳转到下一页
const goToNextPage = throttle(() => {
  if (currentIndex.value < 4) {
    currentIndex.value += 1
  }
}, 500)

// 跳转到上一页（可选）
const goToPreviousPage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

function onBlurName() {
  goToNextPage()
}

// 监听 swiper 的切换事件
const onSwiperChange = (event) => {
  currentIndex.value = event.detail.current
}

onLoad(() => {
  getAddressLocationAll()
})
</script>

<style lang="scss" scoped>
.nextStepBtnP {
  position: fixed;
  bottom: 211px;
  left: 0;
  right: 0;
  margin: auto;
}

:deep(.cpc-bi) {
  .wd-upload__mask {
    border-radius: 50% !important;
  }
  .wd-upload__picture {
    border-radius: 50% !important;
    border: 1px solid #dfdfdf;
  }
}
:deep(.cic) {
  border-color: #dfdfdf;
}
.progress {
  position: absolute;
  top: 104rpx;
  right: 54rpx;
  font-weight: 500;
  font-size: 32rpx;
  color: #4d4d4d;
  line-height: 38rpx;
}
uni-page-body {
  height: 100%;
}
:deep(.wot-theme-light) {
  height: 100%;
}
.basicInforMationContainer {
  width: 100%;
  height: 100%;
  background: #ffffff;

  .swiper {
    width: 100%;
    height: 95vh;
    background-image: url('../../static/images/login/basicInfoBg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
  }
  .swiper-item {
    display: block;
    height: 100%;
    width: 100%;
    padding: 188rpx 88rpx 0 88rpx;
    box-sizing: border-box;
    .swiperItem_title {
      font-weight: 800;
      font-size: 48rpx;
      color: #313131;
    }
    .swiperItem_desctitle {
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 32rpx;
      color: #313131;
    }
    .userBasicSex {
      margin-top: 122rpx;
      .sexItemInfo {
        width: 100%;
        height: 176rpx;
        background: linear-gradient(100deg, #c7ffe0 0%, #e3fff8 100%);
        border-radius: 138rpx;
        padding: 0 104rpx;
        box-sizing: border-box;
        position: relative;
        justify-content: flex-end;
        .sexImg {
          width: 140rpx;
          height: 202rpx;
          position: absolute;
          bottom: 0;
          left: 72rpx;
        }
        p {
          font-weight: 800;
          font-size: 48rpx;
          color: #076980;
        }
      }
      .sexWomen {
        margin-top: 58rpx;
        justify-content: flex-start;
        background: linear-gradient(260deg, #c7ffe0 0%, #e3fff8 100%);
        .sexImg {
          right: 72rpx;
          left: inherit;
          width: 80px;
        }
        p {
          font-weight: 800;
          font-size: 48rpx;
          color: #940d4e;
        }
      }
      .activeSex {
        background: #25e5b3;
        p {
          color: #ffffff;
        }
      }
    }
    .userBasicBirthday {
      margin-top: 70px;
      .dateLabel {
        font-weight: 600;
        font-size: 30rpx;
        color: #404040;
      }
      .timeSelectContent {
        height: 84rpx;
        border-radius: 16rpx;
        border: 2rpx solid #dfdfdf;
        padding: 0 32rpx;
        box-sizing: border-box;
        margin-top: 16rpx;
        :deep(.wd-calendar) {
          .wd-calendar__cell {
            background: none;
          }
          .wd-calendar__arrow {
            display: none;
          }
        }
      }
    }
    .userBasicName {
      margin-top: 200rpx;
    }
    .userBasicLocation {
      margin-top: 76px;
      padding: 0 20rpx;
      box-sizing: border-box;
      .pikerBoxInfo {
        height: 72rpx;
        border-radius: 16rpx;
        border: 2rpx solid #dfdfdf;
        .wcLocatonPiker {
          width: 100%;
          :deep(.wd-picker__cell) {
            background: none;
          }
        }
      }
    }
    .userBasicAvatar {
      margin-top: 196rpx;
      .uploadImgBox {
        width: 200rpx;
        height: 200rpx;
        background: #f7f7f7;
        border: 3rpx solid #dfdfdf;
        border-radius: 50%;
        box-sizing: border-box;
        :deep(.wdCustomUploadClass) {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          .wd-upload__evoke {
            margin: 0;
            background: none;
          }
          .wd-upload__preview {
            margin: 0;
            width: 200rpx;
            height: 200rpx;
            // .wd-upload__close {
            //   top: 50%;
            //   left: 50%;
            //   transform: translate(-50%, -50%);
            // }
          }
        }
      }
      p {
        font-weight: 400;
        font-size: 20px;
        color: #313131;
        margin-top: 26rpx;
      }
    }
    .nextStepBtn {
      background: #25e5b3;
      color: #ffffff;
    }
  }
  :deep(.uni-swiper-dots) {
    z-index: -1;
    .uni-swiper-dot {
      background: #00dba1;
    }
    .uni-swiper-dot-active {
      width: 60rpx;
      height: 16rpx;
      background: #00dba1;
      border-radius: 44rpx;
    }
  }
}
</style>
