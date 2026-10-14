<route lang="json5">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '商品详情',
    'app-plus': {
      titleNView: false,
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <view class="shopDetailContainerBox">
    <view class="shopDetail_headtop">
      <wd-swiper
        v-model:current="currentSwiper"
        :indicator="{ type: 'fraction' }"
        :list="customSwiperList"
        autoplay
        height="620rpx"
        indicatorPosition="bottom-right"
        value-key="img"
      ></wd-swiper>
      <view class="goBackDetailBtn flexAlign" @click="handleGoBackPage">
        <image class="leftBackIcon" src="/static/images/shop/detailLeftBack.png" />
      </view>
    </view>
    <view class="shopDetail_middleTitle">
      <view class="middleTitle_content">
        <view class="shopgoods_moneys">
          <image
            class="dollarIconImg"
            src="/static/images/shop/dollarIcon.png"
            style="margin-left: 5rpx"
          />
          <span class="moneytext">{{ detail.purPrice }}</span>

          <template v-if="detail.ruleType == 1">
            <image
              class="coinIconimg"
              src="/static/images/shop/coinIcon.svg"
              style="margin-left: 20rpx"
            />
            <span class="numtext">{{ detail.coin }}</span>
          </template>
          <template v-if="detail.ruleType == 2">
            <image
              class="moneyIconimg"
              src="/static/images/shop/integralIcon.svg"
              style="width: 32rpx; margin-left: 20rpx"
            />
            <span class="numtext">{{ detail.point }}</span>
          </template>
          <template v-if="detail.ruleType == 3">
            <image
              class="moneyIconimg"
              src="/static/images/shop/integralIcon.svg"
              style="width: 32rpx; margin-left: 20rpx"
            />
            <span class="numtext">{{ detail.point }}</span>
            <span class="numtext-add">/</span>
            <image
              class="coinIconimg"
              src="/static/images/shop/coinIcon.svg"
              style="margin-left: 5rpx"
            />
            <span class="numtext">{{ detail.coin }}</span>
          </template>
        </view>

        <p class="shopgoods_title">{{ detail.name }}</p>
      </view>
    </view>

    <view class="shopDetail_specification">
      <view class="specification_content">
        <view class="specificationItem">
          <p class="specificationItem_label">Select</p>
          <view class="specificationItem_content">
            <p v-for="(item, index) in detail.spec[0].specVal" :key="index">
              {{ item }}
            </p>
          </view>
          <p class="specificationItem_more" @click="onOpenSpeciPopEvent">
            <wd-icon color="#959595" name="arrow-right" size="20px"></wd-icon>
          </p>
        </view>
        <view class="specificationItem">
          <p class="specificationItem_label">Address</p>
          <view class="specificationItem_content">
            {{ currentAddressDetail ? currentAddressDetail : 'Default address' }}
          </view>
          <p class="specificationItem_more" @click="onOpenSelectAdressEvent">
            <wd-icon color="#959595" name="arrow-right" size="20px"></wd-icon>
          </p>
        </view>
        <view class="specificationItem">
          <p class="specificationItem_label">Brand</p>
          <view class="specificationItem_content">{{ detail.brand }}</view>
        </view>
      </view>
    </view>

    <view class="shopDetailEditInfo">
      <view class="shopDetailEditInfo-head">
        <p style="margin-bottom: 16rpx">Product Details</p>
        <p class="shopDetailEditInfo-content">{{ detail.intro }}</p>
      </view>
      <view class="shopDetailEditInfo-editbox">
        <rich-text :nodes="detail.details || ''"></rich-text>
      </view>
    </view>

    <view class="shopDetailbottomBtnBox flexAlign">
      <wd-button custom-class="addressConfimBtn" @click="onShopDetailSailBuy">Pay</wd-button>
    </view>

    <selectAddress
      v-model:visible="addressSelectShow"
      @cancel="onAddressSelectClosePopup"
      @cancelDefault="onAddressDefaultDate"
      @confirm="onAddressSelectConfirm"
    />

    <wd-popup
      :modelValue="speciPopupVisible"
      :safe-area-inset-bottom="true"
      closable
      custom-style="height:auto;overflow: visible;border-radius:52rpx 52rpx 0 0;"
      position="bottom"
      @close="onspeciPopupClose"
    >
      <view class="specipopupContentInfn">
        <view class="specipopupTopgoodsBox">
          <view class="speciGoodsImgBox">
            <image
              :src="specSelDetail.specImg || customSwiperList[0].img"
              class="specipopGoodsImg"
              mode="widthFix"
            />
          </view>
          <view class="speciGoodsTextContetn">
            <p class="speciGoodsTextContetn_title">
              <!-- {{ Price }} -->
            </p>
            <p class="speciGoodsTextContetn_speci">
              Selected
              <span v-for="(item, index) in speciListDate" :key="index">
                <template v-if="item.activeName">[{{ item.activeName }}]</template>
              </span>
            </p>
          </view>
        </view>
        <view v-for="(item, index) in speciListDate" :key="index" class="speciGoodsSelectContent">
          <p class="speciGoodsSelectContent_title">{{ item.specName }}</p>
          <view class="speciGoodsSelectContent_selectItem">
            <p
              v-for="(v, i) in item.specVal"
              :key="i"
              :class="{ activeL: item.activeName == v }"
              class="flexAlign"
              @click="onClickChangeSpeciItem(item, v, i, index)"
            >
              {{ v }}
            </p>
          </view>
        </view>

        <view class="spectGoodsSelectNumber">
          <p>Quantity</p>

          <wd-input-number v-model="goodsValue" @change="handleGoodsNumChange" />
        </view>

        <view class="specipopupContentInfn_bottombtnbox">
          <view class="speciBotLeftmoney">
            <view v-if="detail.ruleType == 1">
              <image
                class="speCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
                style="margin-bottom: 8rpx"
              />
              {{ Coin * goodsValue }}
            </view>
            <view v-if="detail.ruleType == 2">
              <image
                class="specimoneyIconimg"
                src="/static/images/shop/integralIcon.svg"
                style="width: 32rpx; margin-bottom: 8rpx"
              />
              {{ Point * goodsValue }}
            </view>
            <view v-if="detail.ruleType == 3">
              <image
                class="specimoneyIconimg"
                src="/static/images/shop/integralIcon.svg"
                style="width: 32rpx; margin-bottom: 10rpx"
              />
              {{ Point * goodsValue }} {{ needShowPlus ? '+' : '/' }}
              <image
                class="speCoinIconimg"
                src="/static/images/shop/coinIcon.svg"
                style="margin-bottom: 10rpx"
              />
              {{ Coin * goodsValue }}
            </view>
          </view>

          <view>
            <wd-button custom-class="specipopSureBtn" @click="onShopDetailSailBuy">
              Confirm
            </wd-button>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { getProductDetails, getProductDetailsSpec } from '@/service/goods/goods'
import { getUrl } from '@/utils/utils'
import qs from 'qs'
import { getDictSn } from '@/service/community/community'

const currentSwiper = ref<number>(0)
const customSwiperList = ref([])

const detail: any = ref({})
const goodsValue = ref<number>(1)

function handleGoodsNumChange({ value }) {
  console.log(value)
}

const Price = computed(() => {
  return specSelDetail.value.price || detail.value.purPrice
})
const Coin = computed(() => {
  return specSelDetail.value.coin || detail.value.coin
})
const Point = computed(() => {
  return specSelDetail.value.point || detail.value.point
})

const speciPopupVisible = ref(false)

const speciListDate = ref<any>([])
const currentAddressId = ref()
const currentAddressDetail = ref('')

const specs = ref([])
const detailId = ref()
const specSelDetail: any = ref({ price: '' })
const needShowPlus = ref<boolean>(false)

function onSureShopGoodsSpeci() {
  // 拦截未选中规格
  let specValList = []
  speciListDate.value.map((item) => {
    if (typeof item.activeName != 'undefined' && item.activeName != '') {
      specValList.push(item.activeName)
    }
  })
  if (specValList.length < speciListDate.value.length)
    return uni.showToast({ title: 'Please select product specifications', icon: 'none' })

  //   getProductDetailsPopup({
  //     id: detail.value.id,
  //     color: speciListDate.value?.find((v) => v.name == '颜色')?.activeId + '' || '',
  //     size: speciListDate.value?.find((v) => v.name == '尺码')?.activeId + '' || '',
  //   }).then((res) => {
  //     console.log(res)
  //   })
  speciPopupVisible.value = false
  const skuId = specSelDetail.value.id
  const specVal = speciListDate.value.map((item) => item.activeName).join(',')
  const specName = speciListDate.value.map((item) => item?.specId)?.join(',')
  const params = {
    id: detail.value.id,
    skuNum: goodsValue.value,
    addressId: currentAddressId.value,
    proportion:
      detail.value.coin !== 0 && detail.value.point !== 0
        ? detail.value.coin / detail.value.point
        : 1,
    skuId,
    specVal,
    specName,
  }
  console.log('提交params提交', params)
  const paramsQuery = qs.stringify(params)
  uni.navigateTo({
    url: '/pages/confirmShopOrder/confirmShopOrder?' + paramsQuery,
  })
}

const whatsAppKF=ref('')

function onShopDetailSailBuy() {
  const { payOnline } = detail.value
  if (payOnline == 1) {
    speciPopupVisible.value = true
  } else {
    // 打开whatsapp客服
    // #ifdef APP-PLUS
    plus.runtime.openURL(whatsAppKF.value)
    // #endif
    // #ifndef APP-PLUS
    uni.navigateTo({
      url: whatsAppKF.value,
    });
    // #endif
  }
}

function onOpenSpeciPopEvent() {
  speciPopupVisible.value = true
}

function onspeciPopupClose() {
  speciPopupVisible.value = false
}

function handleGoBackPage() {
  uni.navigateBack()
}

const addressSelectShow = ref(false)

function onOpenSelectAdressEvent() {
  addressSelectShow.value = true
}

function onAddressSelectClosePopup() {
  addressSelectShow.value = false
}

function onAddressSelectConfirm(rows: any, items: any) {
  console.log('当前选择地址ID：', rows, items)
  currentAddressDetail.value = items.stateName + ' ' + items.stateName + '...'
  currentAddressId.value = items.id
  addressSelectShow.value = false
}

function onAddressDefaultDate(rows: any) {
  currentAddressDetail.value = rows.stateName + ' ' + rows.stateName + '...'
  currentAddressId.value = rows.id
}

const chooseSpec = ref([])

function onClickChangeSpeciItem(item: any, specVal: string, i: number, index: number) {
  const { specId, specName } = item
  item.activeName = specVal
  chooseSpec.value[index] = { specId, specName, specVal }
  const allLength = chooseSpec.value.length
  if (allLength === speciListDate.value.length) {
    onGetProductDetailsSpec(i)
  }
}

onLoad(async (options) => {
  const { id } = options
  detailId.value = +id
  const res: any = await getProductDetails({ id: +detailId.value })
  detail.value = res.data
  specs.value = detail.value.spec
  speciListDate.value = detail.value.spec
  customSwiperList.value = res.data?.img?.split(',').map((v: any) => {
    return { img: getUrl(v) }
  })
  specSelDetail.value.coin = detail.value.coin

})

onMounted(async () => {
  const {data}:{data:any} = await getDictSn({dictSn: 'WhatsAppKF'})
  whatsAppKF.value=data.list[0].value
})

async function onGetProductDetailsSpec(index) {
  const param = {
    id: detailId.value,
    specName: chooseSpec.value.map((item) => item.specId).join(','),
    specVal: chooseSpec.value.map((item) => item.specVal),
  }
  const res = await getProductDetailsSpec(param)
  const data = res.data[0]
  data.specImg = getUrl(data.specImg.split(',')[0])
  specSelDetail.value = data
  needShowPlus.value = true

  console.log({
    id: detailId.value,
    specName: specs.value?.map((item) => item?.specId)?.join(','),
    specVal: specs.value?.map((item) => item?.specVal?.[index]),
  })
}
</script>

<style lang="scss" scoped>
@import './shopDetail.scss';
</style>
