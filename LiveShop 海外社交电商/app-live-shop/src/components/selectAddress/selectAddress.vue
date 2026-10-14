<template>
  <view>
    <wd-popup
      v-model="props.visible"
      position="bottom"
      :safe-area-inset-bottom="true"
      :close-on-click-modal="false"
      custom-style="height:500px;border-top-left-radius: 50rpx;border-top-right-radius: 50rpx;"
    >
      <view class="selectAddressInfoContent">
        <p class="poppupTitle flex-cc rel">
          <view style="position: absolute; left: 0" v-if="isAddEditflag=='add'" @click="cancelAddAddress">
            <wd-icon name="thin-arrow-left" size="20" color="#666"></wd-icon>
          </view>
          <text class="text">
            {{ { list: 'Change Address', add: 'Add Address' }[isAddEditflag] }}
          </text>
          <view style="position: absolute; right: 0" @click="onAddressClose">
            <wd-icon name="close" size="20" color="#666"></wd-icon>
          </view>
        </p>
        <template v-if="isAddEditflag == 'list'">
          <view class="selectAddressInfoItem" v-for="(item, index) in addressList" :key="index">
            <view class="selectAddressInfoItem-right">
              <wd-icon
                name="check-outline"
                size="25px"
                color="#4FE178"
                v-if="currentPayType == item.id"
              ></wd-icon>
              <wd-icon
                name="circle1"
                size="25px"
                color="#000000"
                v-else
                @click="onChangePaymentStatus(item)"
              ></wd-icon>
            </view>
            <view class="selectAddressInfoItem-left">
              <p class="seladress_adress">
                {{ item.stateName }} {{ item.cityName }} {{ item.detail }}
              </p>
              <p class="seladress_name">{{ item.name }}</p>
              <p class="seladress_phone">{{ item.phone }}</p>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="addAdressFormContentBox">
            <view class="formItemInfo">
              <wd-col-picker
                title="Change Address"
                label="Country"
                v-model="addressvalue"
                :columns="addressarea"
                :column-change="columnChange"
                custom-class="wdCustomcloPikerClass"
                placeholder="Please Select"
              ></wd-col-picker>
            </view>

            <view class="formItemInfo">
              <wd-input
                type="number"
                v-model="addressForm.zipcode"
                placeholder="Postal Code"
                :maxlength="10"
                no-border
              />
            </view>

            <p class="formitem_line"></p>
            <view class="formItemInfo">
              <wd-input
                type="text"
                v-model="addressForm.detail"
                placeholder="Detailed Address And House Number."
                no-border
              />
            </view>
            <p class="formitem_line"></p>
            <view class="formItemInfo">
              <wd-input
                type="text"
                v-model="addressForm.name"
                placeholder="Recipient's Name"
                no-border
              />
            </view>
            <p class="formitem_line"></p>
            <view class="formItemInfo">
              <wd-input
                type="number"
                v-model="addressForm.phone"
                placeholder="Mobile Number"
                :maxlength="11"
                no-border
              />
            </view>
            <p class="formitem_line"></p>
          </view>
        </template>

        <view class="bottomBtnBox">
          <template v-if="isAddEditflag == 'list'">
            <wd-button custom-class="addressConfimBtn addAddressBtn" @click="onAddadress">
              Add New Address
            </wd-button>
            <wd-button custom-class="addressConfimBtn" @click="onSureSelectPay">
              Confirm Selection
            </wd-button>
          </template>
          <template v-else>
            <wd-button custom-class="addressConfimBtn" @click="onAddformadress">
              Add Address
            </wd-button>
          </template>
        </view>
      </view>
    </wd-popup>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import {addressAdd, getAddressList, getAddresslocation} from '@/service/adress/adress'
// const { colPickerData, findChildrenByCode } = useColPickerData()
import {useToast} from 'wot-design-uni'

const toast = useToast()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits()

const currentPayType = ref<number>(0)
const isAddEditflag = ref('list')
const addressList = ref([])
const addressAllLocation = ref([])

const addressForm = ref<{
  zipcode: string
  detail: string
  name: string
  phone: number
}>({
  zipcode: '',
  detail: '',
  name: '',
  phone: null,
})

function onAddadress() {
  isAddEditflag.value = 'add'
}

function onChangePaymentStatus(row: any) {
  currentPayType.value = row.id
}

function onSureSelectPay() {
  const arr = addressList.value?.find((v) => v.id == currentPayType.value) || {}
  emit('confirm', currentPayType.value, arr)
}

const cancelAddAddress = () => {
  isAddEditflag.value = 'list'
}
function onAddressClose() {
  isAddEditflag.value = 'list'
  emit('cancel')
}

function onAddformadress() {
  if (!addressForm.value.name || !addressForm.value.phone) {
    toast.warning({
      zIndex: 10000,
      msg: 'Related content cannot be empty',
    })
    return
  }

  addressAdd({
    ...addressForm.value,
    stateId: addressvalue.value[0],
    cityId: addressvalue.value[1],
    isDefault: 0,
  }).then((res) => {
    if (res.code === 0) {
      toast.success('Successfully Added')
      resetAddressForm()
      getAddressListFn()

      isAddEditflag.value = 'list'
    }
  })
}

function resetAddressForm() {
  addressvalue.value = []
  addressForm.value = {
    zipcode: '',
    detail: '',
    name: '',
    phone: null,
  }
}

const addressvalue = ref<string[]>([])

const addressarea = ref<any[]>()

const columnChange = ({ selectedItem, resolve, finish }) => {
  const areaDatanew = addressAllLocation.value.find((v) => v.id == selectedItem.value)?.children
  //   const areaData = findChildrenByCode(addressAllLocation.value, selectedItem.value)
  if (areaDatanew && areaDatanew.length) {
    resolve(
      areaDatanew.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      }),
    )
  } else {
    finish()
  }
}

const getAddressListFn = () => {
  getAddressList({ page: 1, pageSize: 20 }).then((res: any) => {
    if (res.code === 0) {
      addressList.value = res.data?.list
      currentPayType.value = res.data?.list[0]?.id
      const arr = res.data.list.find((v) => v.isDefault == 1)
      if (arr?.id) {
        currentPayType.value = arr.id
        emit('cancelDefault', arr)
      }
    }
  })
}

const getAddressLocationAll = () => {
  getAddresslocation().then((res) => {
    if (res.code === 0) {
      addressAllLocation.value = res.data as []
      addressarea.value = [
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

onLoad(() => {
  getAddressListFn()
  getAddressLocationAll()
})
</script>

<style lang="scss" scoped>
.flex_cn {
  display: flex;
  align-items: center;
}

:deep(.wd-popup__close) {
  display: none;
}

.selectAddressInfoContent {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 52rpx;
  padding-bottom: 234rpx;

  .poppupTitle {
    box-sizing: border-box;
    text-align: center;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 11;
    padding-top: 20px;
    padding-bottom: 17px;
    .text {
      font-weight: 800;
      font-size: 32rpx;
      color: #313131;
      line-height: 38rpx;
    }
  }

  .selectAddressInfoItem {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;

    &-right {
      width: 60rpx;
    }

    &-left {
      width: calc(100% - 70rpx);
      margin-left: 10rpx;

      .seladress_adress {
        overflow: hidden;
        font-size: 32rpx;
        font-weight: 500;
        color: #313131;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .seladress_name {
        margin-top: 5rpx;
        overflow: hidden;
        font-size: 28rpx;
        font-weight: 300;
        color: #313131;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .seladress_phone {
        margin-top: 5rpx;
        font-size: 28rpx;
        font-weight: 300;
        color: #313131;
      }
    }
  }

  .addAdressFormContentBox {
    .formItemInfo {
      box-sizing: border-box;
      padding: 25rpx 0;
    }

    .formitem_line {
      width: 100%;
      border: 2rpx solid;
      border-image: linear-gradient(90deg, rgba(200, 200, 200, 1), rgba(238, 238, 238, 1)) 2 2;
    }

    :deep(.wdCustomcloPikerClass) {
      .wd-col-picker__cell {
        padding: 0;
      }
    }
  }

  .bottomBtnBox {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 50rpx;
    background: #ffffff;
  }

  .addressConfimBtn {
    width: 90%;
    height: 80rpx;
    background: #000000;
  }

  .addAddressBtn {
    margin-bottom: 24rpx;
  }
}
</style>
