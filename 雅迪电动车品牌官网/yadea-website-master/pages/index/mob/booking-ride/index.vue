<!--
 * @Author: weijianjun
 * @Date: 2023-02-22 16:18:25
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 15:27:42
 * @FilePath: \yadea-website\pages\index\mob\booking-ride\index.vue
 * @Description: 预约骑行
 * 
-->

<template>
  <div class="m-page-booking-ride m-page-pt">
    <mobile-banner :img="replaceImgUrl(bgi)" />
    <client-only>
      <div class="title">预约试驾</div>
      <van-form ref="vanorm" @submit="bookingRideClick">
        <van-cell-group inset>
          <van-field
            v-model="form.car"
            is-link
            readonly
            :rules="[{ required: true, message: '车型不能为空' }]"
            label="体验车型"
            placeholder="点击选择车型"
            @click="handleOpenModal"
          />

          <van-field
            v-model="form.area"
            is-link
            readonly
            name="area"
            label="体验地点"
            placeholder="点击选择省市区"
            :rules="[{ required: true, message: '省份不能为空' }]"
            @click="showArea = true"
          />
          <van-popup v-model:show="showArea" round position="bottom">
            <van-cascader
              v-model="form.area"
              title="请选择所在地区"
              :options="areaList0"
              @close="showArea = false"
              @finish="onConfirmArea"
            />
          </van-popup>

          <van-field
            v-model="form.street"
            is-link
            readonly
            name="area"
            label="地点街道"
            placeholder="点击选择街道"
            :rules="[{ required: true, message: '街道不能为空' }]"
            @click="showStreets = true"
          />
          <van-popup v-model:show="showStreets" position="bottom">
            <van-picker title="地点街道" :columns="streets" @confirm="onConfirmStreet" @cancel="showStreets = false" />
          </van-popup>

          <div class="user-name-and-sex content-bottom">
            <van-field
              v-model="form.surname"
              class="user-name-content content-bottom-none"
              name="surname"
              label="姓氏"
              placeholder="请输入您的姓氏"
              :rules="[{ required: true, message: '请填写姓氏' }]"
            />
            <van-field class="sex-content content-bottom-none" name="sex" :rules="[{ required: true, message: '请选择您的性别' }]">
              <template #input>
                <van-radio-group v-model="form.sex" direction="horizontal">
                  <van-radio name="1">男士</van-radio>
                  <van-radio name="2">女士</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </div>

          <van-field v-model="form.phone" label="手机号码" placeholder="请输入手机号码" :rules="[{ validator: phoneValidator }]" />

          <van-field
            v-model="form.sms"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '验证码不能为空' }]"
          >
            <template #button>
              <div v-if="timer === 0" class="placeholder-txt cur-point" @click="getAuthCodeClick">获取验证码</div>
              <div v-else>{{ timer }}秒后重新获取</div>
            </template>
          </van-field>
          <van-field
            name="checkbox"
            :rules="[{ required: true, message: '验证码不能为空' }]"
            style="border-bottom: 0px; padding-bottom: 3px"
          >
            <template #input
              ><van-checkbox v-model="form.checked" class="read-items" shape="square">我仔细阅读并接受了所附的 </van-checkbox>
              <div class="flex-c reads">
                <span class="theme-color" @click="$openWin('/car-detail/privacy-policy/index.html')">《用户协议》</span
                ><span class="theme-color" @click="$openWin('/car-detail/user-agreement/index.html')">《隐私条款》</span>
              </div>
            </template>
          </van-field>
        </van-cell-group>

        <div class="mtb-8-mvw mlr-4-mvw">
          <van-button block type="primary" native-type="submit" @submit="bookingRideClick"> 预约试驾 </van-button>
        </div>
      </van-form>

      <a-modal
        v-model:visible="visible"
        class="m-booking-ride-model-contrast-modal"
        width="100%"
        wrap-class-name="full-modal"
        :footer="null"
        :closable="false"
      >
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-20-mvw fw-500" @click="dropVisible = !dropVisible">
                {{ currentCategoryItem.attributes.name ?? '' }}
                <!-- <SvgIcon name="down" :class="dropVisible && 'svgRotate'"></SvgIcon> -->
              </div>
              <div class="drop-menu" :class="dropVisible && 'drop-menu-show'">
                <template v-for="item in categoryList" :key="item.id">
                  <div class="fs-24-vw" @click="handleSelectCarCategory(item)">{{ item.attributes.name }}</div>
                </template>
              </div>
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" @click="visible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <div class="modal-car-items">
            <a-radio-group v-model:value="product">
              <template v-for="item in productsList" :key="item.id">
                <div class="modal-car-item flex-col align-center" @click="handleOpenEditionModal(item.id)">
                  <div class="modal-car-item-top">
                    <a-radio :value="item.id"></a-radio>
                    <img :src="item.picUrl" alt="图片" />
                    <div class="fs-24-vw fw-500">{{ item.attributes.name }}</div>
                  </div>
                </div>
              </template>
            </a-radio-group>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model:visible="editionVisible"
        class="m-booking-ride-model-edition-contrast-modal"
        :width="800"
        :footer="null"
        :closable="false"
      >
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-32-vw fw-500">版本选择</div>
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" @click="editionVisible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <div class="fs-20-vw opt65 title">版本</div>
          <div class="fs-20-vw edition">
            <div class="edition-left fs-20-vw fw-600">雅迪 冠能 DQ6</div>
            <div class="edition-right">
              <div class="txt-white fs-20-vw"><SvgIcon name="whiteAdd"></SvgIcon>对比</div>
              <div class="txt-white fs-20-vw"><SvgIcon name="whiteClose"></SvgIcon>取消</div>
            </div>
          </div>
        </div>
      </a-modal>

      <!-- 预约结果提示框 -->
      <a-modal
        v-model:visible="promptVisible"
        class="result-model"
        :width="300"
        :closable="false"
        :mask-closable="false"
        :keyboard="false"
        :cancel-button-props="{ style: { display: 'none' } }"
        ok-text="确定"
        @ok="resultHandleOk()"
      >
        <div class="prompt-success">{{ promptMessage }}</div>
      </a-modal>
    </client-only>
  </div>
</template>

<script setup>
import { areaList } from '@/configs/PCS'
import { useCascaderAreaData } from '@vant/area-data'
import validate from '@/configs/validate'
import { message } from 'ant-design-vue'
const { bookingRideApi } = useApi()

useHead({
  meta: [
    { name: 'keywords', content: '电动车,雅迪冠能,雅迪电动车,电动车品牌,电动自行车,智能电动车,电动摩托车,锂电池电动车' },
    {
      name: 'description',
      content:
        '雅迪致力于让亿万人享受美好出行,全球建有7大基地,自研雅迪冠能系列,雅迪冠能3 S9 MAX、雅迪冠能3 E9等旗舰产品,畅销全球超100个国家和地区。 '
    }
  ]
})

// ---data---
const bgi = $ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/%E7%A7%BB%E5%8A%A8%E7%AB%AF.jpg?updated_at=2023-03-28T06:40:31.987Z')

const { modelContrastApi } = useApi()
const showArea = $ref(false)
const showStreets = $ref(false)
const streets = $ref()
const areaList0 = useCascaderAreaData()
const product = $ref()
const form = $ref({
  checked: false,
  phone: ''
})

// 弹框是否展开
const visible = $ref(false)
// 下拉框是否展开
const dropVisible = $ref(false)
// 版本选择弹框是否展开
const editionVisible = $ref(false)
// 所有车辆产品list
const productsList = $ref([])
// 车辆类别list
const categoryList = $ref([])
// 当前选中的车辆类别
const currentCategory = $ref('全部车型')
const vanorm = ref()

const timer = $ref(0)

// 预约结果弹框是否展开
const promptVisible = $ref(false)

// 预约结果提示
const promptMessage = $ref('')

const phoneValidator = val =>
  new Promise(resolve => {
    if (!form.phone) {
      resolve('手机号不能为空')
    }
    if (!validate.phone.test(form.phone)) {
      resolve('手机号不正确')
    }

    resolve(true)
  })

// 打开弹框
const handleOpenModal = () => {
  visible = true
  getProductsCategory()
}

const handleOpenEditionModal = id => {
  getCarProduct(id)
  product = id
}

// 获取车辆详情
const getCarProduct = async id => {
  try {
    const { data: $data } = await modelContrastApi.getProduct(id)
    watchVal($data, () => {
      visible = false
      const data = clone($data.value.data)
      const { name } = data.attributes
      const item = data?.attributes?.backgroundPic?.data?.length ? data.attributes.backgroundPic.data[0]?.attributes : {}
      const backgroundPic = item?.url
      form.car = name
      if (backgroundPic) {
        bgi = backgroundPic
      }
    })
  } catch (error) {}
}

// 获取车辆所有产品
const getCarProducts = async categoryId => {
  try {
    const { data } = await modelContrastApi.getProducts(categoryId)
    watchVal(data, () => {
      const newProductsList = data.value.data.map(item => {
        if (item.attributes.picUrl.data) {
          return { ...item, picUrl: item.attributes.picUrl.data[0].attributes.url }
        }
        return { ...item }
      })
      productsList = [...newProductsList]
    })
  } catch (error) {}
}

// 当前选中的车辆类别
const currentCategoryItem = $ref({
  attributes: {
    name: ''
  }
})

// 获取车辆类别
const getProductsCategory = async () => {
  try {
    const { data } = await modelContrastApi.getProductsCategory()
    watchVal(data, () => {
      categoryList = data.value.data
    })
    currentCategoryItem = categoryList.find(item => {
      return item.attributes.name === '冠能系列'
    })
    getCarProducts(currentCategoryItem.id)
  } catch (error) {}
}

// 选中车辆产品类别
const handleSelectCarCategory = item => {
  currentCategory = item.attributes.name
  dropVisible = false
  getCarProducts(item.id)
}

const onConfirmArea = opt => {
  const { selectedOptions, value } = opt
  showArea = false
  form.area = selectedOptions.map(option => option.text).join('/')
  form.areaCodeList = selectedOptions.map(option => option.text)
  let $streets = getStreets(value)
  $streets = $streets.map(item => {
    return {
      text: item.name,
      value: item.code
    }
  })
  streets = $streets
  form.street = undefined
}

function onConfirmStreet(e) {
  const { selectedOptions } = e
  showStreets = false
  form.street = selectedOptions[0].text
}

const getAuthCodeClick = async value => {
  // timer = 60
  const interval = setInterval(() => {
    if (timer > 0) {
      timer--
    } else {
      clearInterval(interval)
    }
  }, 1000)

  const params = {
    phone: form.phone
  }
  const { data } = await bookingRideApi.getAuthCode(params)
  const $data = data.value
  if ($data.status == 200) {
    message.success('发送成功')
  }
}

const bookingRideClick = async values => {
  const reqData = {
    userName: form.surname,
    userSex: form.sex === '1' ? '男士' : '女士',
    province: form.areaCodeList[0],
    city: form.areaCodeList[1],
    coutry: '中国',
    userAddress: form.street,
    carType: form.car,
    carSeries: form.car,
    code: form.sms, // 验证码
    phone: form.phone // 手机号码
  }
  const { data } = await bookingRideApi.preBook(reqData)
  const $data = data.value
  if ($data.status == 200) {
    promptMessage = '预约成功'
  } else {
    promptMessage = '预约失败'
  }
  // 弹出结果确认框
  promptVisible = true
}

// 预约结果弹出框确定按钮点击事件
const resultHandleOk = () => {
  if (promptMessage === '预约成功') {
    // 跳转首页
    useRouter().push('/')
  } else {
    promptVisible = false
  }
}

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.m-page-booking-ride {
  .title {
    .m-fs(20);
    .m-mt(30);
    .m-ml(25);
    .m-mb(25);
    font-weight: bold;
  }
  .reads {
    .m-fs(12);
    cursor: pointer;
  }

  .user-name-and-sex {
    display: flex;
    justify-content: space-between;

    .content-bottom-none {
      border-bottom: none;
    }

    .user-name-content {
      flex: 2;
      height: auto;
    }
    .sex-content {
      height: auto;
      flex: 1;

      .van-radio-group {
        display: flex;
        justify-content: flex-end;

        .van-radio {
          width: 45mpxvw;
          overflow: visible;
        }

        .van-radio__icon--checked {
          .van-icon-success {
            position: relative;
          }

          .van-icon-success:before {
            content: '';
            width: calc(100% + 6px);
            height: calc(100% + 6px);
            position: absolute;
            top: -3px;
            left: -3px;
            border: 1px solid #ff5f00;
            border-radius: 100%;
          }
        }
      }

      .van-radio--horizontal:last-of-type {
        margin-right: 0;
      }
    }
  }
  .van-field__label {
    .m-w(60);
    .m-fs(14);
    .m-mr(30);
    font-weight: 400;
  }

  .content-bottom {
    border-bottom: 1px solid #d9d9d9;
  }

  .van-cell-group--inset {
    .m-mlr(25);
  }

  .van-cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
    .m-ptb(20);
    border-bottom: 1px solid #d9d9d9;

    &:after {
      display: none;
    }
  }

  .van-radio-group {
    width: 100%;
  }

  .placeholder-txt {
    // .m-fs(14);
    font-weight: 400;
    color: #000000;
    opacity: 0.65;
  }

  input::-webkit-input-placeholder {
    .placeholder-txt;
  }

  .van-radio__icon {
    .m-w(12);
    .m-h(12);

    .van-icon {
      .m-w(12);
      .m-h(12);
    }
  }

  .van-radio__label {
    .m-fs(12);
    .m-ml(8);
    font-weight: 400;
    color: #000000;
  }

  .read-items {
    .m-fs(12);
    font-weight: 400;
    color: #000000;

    .van-icon {
    }
  }

  .van-badge__wrapper,
  .van-checkbox__icon--square {
    .m-w(16);
    .m-h(16);
  }
}

.m-booking-ride-model-contrast-modal {
  top: 0;
  .icon-cha {
    width: 24mpxvw !important;
    height: 24mpxvw !important;
  }

  .ant-radio-group {
    display: flex;
    flex-direction: row;
    padding-left: 1.041667vw;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ant-modal-content {
    border-radius: 10pxvw;
    width: 100% !important;
    height: 100vh !important;
    margin: 0 auto;
    padding-bottom: 50pxvw;
    overflow: auto;
  }

  .ant-modal-body {
    padding: 0;
  }

  .modal-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 25mpxvw 20mpxvw;

    .modal-top-left {
      .drop-box {
        position: relative;

        svg {
          width: 38pxvw;
          height: 38pxvw;
          margin-left: 24pxvw;
        }

        .svgRotate {
          transform: rotate(180deg);
          transition: all 0.5s;
        }

        .drop-menu {
          position: absolute;
          width: 200mpxvw;
          padding: 10mpxvw;
          display: none;
          box-shadow: 0px 7px 44px 0px rgba(0, 0, 0, 0.08);
          border-radius: 8mpxvw;
          z-index: 999;
          background: #fff;

          div {
            margin: 10mpxvw;
            padding-bottom: 10mpxvw;
            border-bottom: 1px solid #e9e9e9;

            &:first-of-type {
              margin-top: 0;
            }
          }
        }

        .drop-menu-show {
          display: block;
        }
      }
    }

    .modal-top-right {
      svg {
        width: 32pxvw;
        height: 32pxvw;
      }
    }
  }

  .modal-content {
    .modal-car-items {
      display: flex;
      flex-direction: row;
      padding-left: 20pxvw;
      flex-wrap: wrap;
      justify-content: center;

      .modal-car-item {
        width: 163mpxvw;
        background: #ffffff;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #e9e9e9;
        margin-left: 5mpxvw;
        margin-right: 5mpxvw;
        margin-top: 10mpxvw;
        overflow: hidden;
        position: relative;
        .m-p(10);

        .modal-car-item-top {
          width: 100%;
          text-align: right;

          // span {
          //   width: 12mpxvw;
          //   height: 12mpxvw;
          //   // background: #ff5f00;
          //   display: inline-block;
          //   border-radius: 10pxvw;
          //   border: 1px solid #e9e9e9;
          //   margin: 15pxvw 15pxvw 5pxvw 0;
          // }

          // .isSelected {
          //   border: 1px solid #ff5f00;
          //   position: relative;

          //   &::before {
          //     width: 12mpxvw;
          //     height: 12mpxvw;
          //     background: #ff5f00;
          //     border-radius: 100%;
          //     content: '';
          //     position: absolute;
          //     left: 50%;
          //     top: 50%;
          //     transform: translate(-50%, -50%);
          //   }
          // }
        }

        img {
          width: 100%;
        }

        .fs-24-vw {
          text-align: center;
          margin: 16mpxvw 0 19mpxvw;
          font-size: 12mpxvw;
        }
      }
    }
  }
}

.m-booking-ride-model-edition-contrast-modal {
  .ant-modal-content {
    border-radius: 10pxvw;
    width: 800pxvw !important;
    height: 450pxvw !important;
    margin: 200pxvw auto;
    padding: 50pxvw 50pxvw 50pxvw 50pxvw;
  }

  .ant-modal-body {
    padding: 0;
  }

  .modal-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .modal-top-right {
      svg {
        width: 32pxvw;
        height: 32pxvw;
      }
    }
  }

  .modal-content {
    .title {
      margin-top: 55pxvw;
      padding-bottom: 13pxvw;
      border-bottom: 1px solid #e9e9e9;
    }

    .edition {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 26pxvw 0;
      border-bottom: 1px solid #e9e9e9;

      .edition-right {
        display: flex;
        flex-direction: row;
        align-items: center;

        div {
          width: 94pxvw;
          height: 41pxvw;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          svg {
            width: 20pxvw;
            height: 20pxvw;
            margin-right: 10pxvw;
          }

          &:first-of-type {
            background: #000000;
          }

          &:last-of-type {
            background: #ff5f00;
          }
        }
      }
    }
  }
}

.result-model.ant-modal {
  margin: 200pxvw auto !important;
}

.result-model {
  .ant-modal-footer {
    text-align: center;
  }
}

.result-model {
  .ant-modal-body {
    .prompt-success {
      font-size: 16mpxvw;
      text-align: center;
    }
  }
}
</style>
