<!--
 * @Author: weijianjun
 * @Date: 2023-02-22 16:18:25
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 15:25:15
 * @FilePath: \yadea-website\pages\index\booking-ride\index.vue
 * @Description: 预约骑行
 * 
-->

<template>
  <div class="page-booking-ride" :style="`background-image:url(${replaceImgUrl(bgi)})`">
    <client-only>
      <div class="form-box pos-center-v">
        <div class="form-box-title">预约试驾</div>

        <a-form ref="formRef" class="my-form" :model="formState" :rules="rules" name="basic" autocomplete="off">
          <a-form-item label="体验车型" name="car">
            <a-select
              ref="select"
              v-model:value="formState.car"
              :bordered="false"
              :open="false"
              placeholder="请选择车型"
              @click="handleOpenModal"
            >
              <!-- <a-select-option value="jack">雅迪冠能 Q6</a-select-option> -->
              <template #suffixIcon>
                <SvgIcon name="arrow-right-black" class="arrow-right-black" />
              </template>
            </a-select>
          </a-form-item>

          <a-form-item label="体验地点" name="place">
            <a-cascader v-model:value="formState.place" :bordered="false" :options="options" placeholder="请选择省、市、区">
              <template #suffixIcon>
                <SvgIcon name="arrow-right-black" class="arrow-right-black" />
              </template>
            </a-cascader>
          </a-form-item>

          <a-form-item label="地点街道" name="street">
            <a-select ref="select" v-model:value="formState.street" :bordered="false" placeholder="请选择街道">
              <a-select-option v-for="(item, index) of streets" :key="index" :value="item.label">{{ item.label }}</a-select-option>
              <template #suffixIcon>
                <SvgIcon name="arrow-right-black" class="arrow-right-black" />
              </template>
            </a-select>
          </a-form-item>

          <a-form-item name="surname" label="姓氏">
            <div class="flex-c-sb">
              <a-input v-model:value="formState.surname" class="placeholder flex-1" :bordered="false" placeholder="请输入您的姓氏" />
              <a-radio-group
                v-model:value="formState['sexualDistinction']"
                class="flex-c"
                style="max-width: 161px; text-align: right; justify-content: flex-end"
              >
                <a-radio value="1">男士</a-radio>
                <a-radio value="2">女士</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>

          <a-form-item label="手机号码" name="mobile">
            <a-input v-model:value="formState.mobile" :maxlength="11" :bordered="false" placeholder="请输入手机号码" />
          </a-form-item>

          <a-form-item label="验证码" name="code">
            <div class="flex-c-sb">
              <a-input v-model:value="formState.code" :bordered="false" placeholder="请输入验证码" />

              <div class="get-code-dev">
                <div v-if="timer === 0" class="cur-point" @click="onGetCode">获取验证码</div>
                <div v-else>{{ timer }}秒后重新获取</div>
              </div>
            </div>
          </a-form-item>

          <a-form-item name="remember" style="border-bottom: 0; padding-bottom: 0; padding-top: 0.5vw">
            <div class="flex-c">
              <a-checkbox-group>
                <a-checkbox v-model:value="formState.remember" :on-click="rememberClick">我仔细阅读并接受了所附的 </a-checkbox>
              </a-checkbox-group>
              <div class="a-nbl cur-pos flex-c">
                <span class="txt-special" @click="openWin('/car-detail/privacy-policy/index.html')">《用户协议》</span
                ><span class="txt-special" @click="openWin('/car-detail/user-agreement/index.html')">《隐私条款》</span>
              </div>
            </div>
          </a-form-item>

          <a-form-item class="pt-4-vw submit-div">
            <a-button class="btn-submit fs-20-vw" type="primary" html-type="submit" @click="bookingRideClick">预约试驾</a-button>
          </a-form-item>
        </a-form>
      </div>

      <a-modal v-model:visible="visible" class="model-contrast-modal2" :footer="null" :closable="false">
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-32-vw fw-500">
                {{ currentCategory?.attributes?.name }}
                <!-- {{ currentCategory }} <SvgIcon name="down" :class="dropVisible && 'svgRotate'"></SvgIcon> -->
              </div>
              <!-- <div class="drop-menu" :class="dropVisible && 'drop-menu-show'">
                <template v-for="item in categoryList" :key="item.id">
                  <div class="fs-24-vw" @click="handleSelectCarCategory(item)">{{ item.attributes.name }}</div>
                </template>
              </div> -->
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" @click="visible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <a-radio-group v-model:value="product">
            <div class="modal-car-items">
              <template v-for="item in productsList" :key="item.id">
                <div class="modal-car-item" @click="handleOpenEditionModal(item.id)">
                  <div class="modal-car-item-top">
                    <a-radio :value="item.id"></a-radio>
                  </div>
                  <img :src="item.picUrl" alt="图片" />
                  <div class="fs-24-vw fw-500 ellipsis-1">{{ item.attributes.name }}</div>
                </div>
              </template>
            </div>
          </a-radio-group>
        </div>
      </a-modal>

      <a-modal
        v-model:visible="promptVisible"
        class="result-model"
        :width="400"
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
import { usePCS } from '@/configs/PCS'
import validate from '@/configs/validate'
// import bgi0 from '@/assets/images/booking-ride/banner.png'
import { message } from 'ant-design-vue'
import { result } from 'lodash'

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

const isModalOpen = ref(true)
const { bookingRideApi } = useApi()
const Citys = usePCS(2)
// ---data---
const bgi = $ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/001.jpg?updated_at=2023-03-28T06:48:08.116Z')
const formState = $ref({
  remember: false
})
const product = $ref()
const timer = $ref(0)

const streets = $ref([])

const { modelContrastApi } = useApi()
// 弹框是否展开
const visible = $ref(false)
// 预约结果弹框是否展开
const promptVisible = $ref(false)
// 预约结果提示
const promptMessage = $ref('')
// 下拉框是否展开
const dropVisible = $ref(false)
// 车辆类别list
const categoryList = $ref([])
// 当前选中的车辆类别
const currentCategory = $ref('冠能系列')

// 所有车辆产品list
const productsList = $ref([])
// 车辆详情list
const carDetailList = $ref([])

const formRef = ref()
const rules = {
  car: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject('车型不能为空')
      }
    },
    trigger: ['change']
  },
  place: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject('省份不能为空')
      }
    },
    trigger: ['change', 'blur']
  },
  street: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject('街道不能为空')
      }
    },
    trigger: ['change', 'blur']
  },
  surname: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (!formState.surname) {
        return Promise.reject('姓氏不能为空')
      } else if (!formState['sexualDistinction']) {
        return Promise.reject('性别不能为空')
      } else {
        return Promise.resolve()
      }
    },
    trigger: ['change', 'blur']
  },
  mobile: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        if (validate.phone.test(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('请输入正确的手机号码')
        }
      } else {
        return Promise.reject('手机号码不能为空')
      }
    },
    trigger: ['change', 'blur']
  },
  code: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject('验证码不能为空')
      }
    },
    trigger: ['change', 'blur']
  },
  remember: {
    required: true,
    validator: (rule, value, cbfn) => {
      if (value) {
        return Promise.resolve()
      } else {
        return Promise.reject('请仔细阅读隐私条款，如已读请勾选')
      }
    },
    trigger: ['change', 'blur']
  }
}

// 重新选择替换index
const reselectIndex = $ref(null)

const options = $ref([...Citys])

// 重新选择
const handleClickReselect = index => {
  reselectIndex = index
  visible = true
}

watch(
  () => formState.place,
  place => {
    if (place) {
      const areaNameList = []
      const area = place[2]
      // 获取省市区名称
      const province = options.filter(e => {
        if (e.value == place[0]) {
          return e
        }
      })

      areaNameList.push(province[0]?.label)

      const city = province[0]?.children.filter(e => {
        if (e.value === place[1]) {
          return e
        }
      })

      areaNameList.push(city[0]?.label)

      const district = city[0]?.children.filter(e => {
        if (e.value === place[2]) {
          return e
        }
      })

      areaNameList.push(district[0]?.label)

      formState.areaNameList = areaNameList

      let $streets = getStreets(area)
      $streets = $streets.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.code
        }
      })
      // console.log('$streets :>> ', $streets)
      formState.street = undefined
      streets = $streets
    }
  }
)

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

// 打开弹框
const handleOpenModal = () => {
  visible = true
  getProductsCategory()
}

// 获取车辆类别
const getProductsCategory = async () => {
  try {
    const { data } = await modelContrastApi.getProductsCategory()
    watchVal(data, () => {
      categoryList = data.value.data
    })
    // getCarProducts()
    currentCategory = categoryList.find(item => {
      return item.attributes.name === '冠能系列'
    })
    getCarProducts(currentCategory?.id)
  } catch (error) {}
}

// 选中车辆产品类别
const handleSelectCarCategory = item => {
  currentCategory = item.attributes.name
  dropVisible = false
  getCarProducts(item.id)
}

// 打开版本选择弹框
const handleOpenEditionModal = id => {
  product = id
  getCarProduct(id)
}

// 获取车辆详情
const getCarProduct = async id => {
  try {
    const { data: $data } = await modelContrastApi.getProduct(id)
    watchVal($data, () => {
      const data = clone($data.value.data)
      const { name } = data.attributes
      const item = data?.attributes?.backgroundPic?.data?.length ? data.attributes.backgroundPic.data[0]?.attributes : {}
      const backgroundPic = item?.url
      formState.car = name
      if (backgroundPic) {
        bgi = backgroundPic
      }
      visible = false
      reselectIndex = null
    })
  } catch (error) {}
}

const rememberClick = () => {
  formState.remember = !formState.remember
}

function openWin(url) {
  const _url = url
  window.open(_url)
}

async function onGetCode() {
  if (!validate.phone.test(formState.mobile)) {
    return console.error('手机号错误！')
  }

  timer = 60
  const interval = setInterval(() => {
    if (timer > 0) {
      timer--
    } else {
      clearInterval(interval)
    }
  }, 1000)

  const authCodeParams = {
    phone: formState.mobile
  }
  const { data } = await bookingRideApi.getAuthCode(authCodeParams)
  const $data = data.value
  if ($data.status == 200) {
    message.success('发送成功')
  }
}

// const formRef = ref()
const bookingRideClick = async () => {
  try {
    await formRef.value.validateFields()
    const reqData = {
      userName: formState.surname, //
      userSex: formState.sexualDistinction === '1' ? '男士' : '女士',
      province: formState.areaNameList[0],
      city: formState.areaNameList[1],
      coutry: '中国',
      userAddress: formState.street,
      carType: formState.car,
      carSeries: formState.car,
      code: formState.code, // 验证码
      phone: formState.mobile // 手机号码
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
  } catch (errorInfo) {
    console.log('Failed:', errorInfo)
  }
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
</script>

<style lang="less">
.page-booking-ride {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center center;

  .txt-special {
    .fs(14);
    cursor: pointer;
  }

  .form-box {
    position: absolute;
    // top: 112pxvw;
    right: 140pxvw;
    width: 602pxvw;
    // height: 860pxvw;
    background: #ffffff;

    .placeholder {
      .fs(18);
      font-weight: 400;
      color: #000000;
      opacity: 0.65;
    }

    .get-code-dev {
      min-width: 140px;
      text-align: right;
      width: 120pxvw;
      .fs(18);
      opacity: 0.65;
    }

    &-title {
      .fs(32);
      font-weight: bold;
      .pt(80);
      .pl(60);
      .pb(30);
    }

    .my-form {
      .plr(60);

      .ant-form-item {
        margin-bottom: 0;
        .pt(30);
        .pb(26);
        border-bottom: 1px solid #d9d9d9;
      }

      .ant-form-item-label {
        width: 105pxvw;
        text-align: left;
      }

      .ant-form-item-label > label,
      .ant-radio-wrapper {
        .fs(18);
        font-weight: 400;
      }

      input::-webkit-input-placeholder,
      .ant-select-selection-placeholder {
        .placeholder;
      }

      .ant-select-single:not(.ant-select-customize-input) .ant-select-selector,
      .ant-input {
        padding-left: 0;
      }

      .ant-form-item-has-error .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input) .ant-select-selector {
        border-color: transparent !important;
      }

      .submit-div {
        padding-bottom: 60pxvw;
      }

      .btn-submit {
        width: 100%;
        height: 62pxvw !important;
      }
    }

    .ant-checkbox-checked::after {
      border: 0;
    }
  }

  .ant-form-item-explain,
  .ant-form-item-extra {
    .fs(14);
  }

  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
  }

  .ant-checkbox-wrapper.ant-checkbox-wrapper-checked {
    position: relative;
    .flex-c;
  }
  .ant-checkbox {
    position: static;
  }

  .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
    display: none;
  }

  .ant-form label {
    .fs(14);
  }

  .ant-form-item-label > label::after {
    display: none;
  }

  .arrow-right-black {
    width: 16pxvw;
    height: 16pxvw;
    color: #000000;
  }
}

.model-contrast-modal2 {
  width: 1400pxvw !important;
  .ant-modal-content {
    border-radius: 10pxvw;
    height: 800pxvw !important;
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
    padding: 30pxvw 40pxvw 25pxvw 40pxvw;

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
          width: 200pxvw;
          padding: 10pxvw;
          display: none;
          box-shadow: 0px 7px 44px 0px rgba(0, 0, 0, 0.08);
          border-radius: 8pxvw;
          z-index: 999;
          background: #fff;

          div {
            margin: 10pxvw;
            padding-bottom: 10pxvw;
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

      .modal-car-item {
        width: 315pxvw;
        height: 332pxvw;
        background: #ffffff;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #e9e9e9;
        margin-left: 20pxvw;
        margin-top: 20pxvw;
        overflow: hidden;
        position: relative;

        .modal-car-item-top {
          text-align: right;
          margin: 15pxvw 15pxvw 5pxvw 0;
          // span {
          //   width: 20pxvw;
          //   height: 20pxvw;
          //   // background: #ff5f00;
          //   display: inline-block;
          //   border-radius: 10pxvw;
          //   border: 1px solid #e9e9e9;
          // }

          .isSelected {
            border: 1px solid #ff5f00;
            position: relative;

            &::before {
              width: 16pxvw;
              height: 16pxvw;
              background: #ff5f00;
              border-radius: 100%;
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }

        img {
          width: 315pxvw;
          height: 197pxvw;
          object-fit: cover;
          object-position: center center;
        }

        .fs-24-vw {
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 40pxvw;
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
      font-size: 18pxvw;
      text-align: center;
    }
  }
}
</style>
