<template>
  <view>
    <wd-popup
      :modelValue="visible"
      position="bottom"
      :safe-area-inset-bottom="true"
      :close-on-click-modal="false"
      closable
      custom-style="height:auto;border-top-left-radius: 50rpx;border-top-right-radius: 50rpx;"
      @close="onPaymentClose"
    >
      <view class="addressConfigInfoContent">
        <p class="poppupTitle">
          {{ { add: "Add Address", edit: "Edit Address" }[isAddEditflag] }}
        </p>

        <view class="addAdressFormContentBox">
          <view class="formItemInfo">
            <wd-col-picker
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
          <view class="formItemInfo flex-sb-c">
            <view class="flex align-c selectArea">
              <wd-icon v-if="addressForm.isDefault" color="#4FE178" name="check-outline"
                      @click="addressForm.isDefault = 0" size="18px" />
              <wd-icon v-else color="#000000" name="circle1" size="18px" @click="addressForm.isDefault = 1" />
              <view>Default</view>
            </view>
            <view class="buttonArea">
              <view :class="{'btn':true,'isSelect':addressForm.tag === 2}" @click="handleChangeTag(2)">COMPANY</view>
              <view :class="{'btn':true,'isSelect':addressForm.tag === 1}" @click="handleChangeTag(1)">HOME</view>
            </view>
          </view>

          <p class="formitem_line"></p>
        </view>

        <view class="bottomBtnBox">
          <wd-button custom-class="addressConfimBtn" @click="onFormAdressSubmit">
            {{ { add: "Add Address", edit: "Edit Address" }[isAddEditflag] }}
          </wd-button>
        </view>
      </view>
    </wd-popup>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { configAddress, getAddresslocation } from "@/service/adress/adress";
import { useToast } from "wot-design-uni";

const toast = useToast();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits();

const isAddEditflag = ref("add");
const addressAllLocation = ref([]);

const addressForm = ref<{
  id: any
  zipcode: string
  detail: string
  name: string
  phone: number,
  isDefault: number,
  tag: number
}>({
  id: undefined,
  zipcode: "",
  detail: "",
  name: "",
  phone: null,
  isDefault: 0,
  tag: 0
});

watch(
  () => props.visible,
  (n) => {
    if (n) {
      resetAddressForm();
      isAddEditflag.value = props.currentRow.id ? "edit" : "add";
      addressForm.value.id = props.currentRow.id;
      addressForm.value.tag = props.currentRow.tag;
      addressForm.value.isDefault = props.currentRow.isDefault;
      addressForm.value.zipcode = props.currentRow.zipcode;
      addressForm.value.detail = props.currentRow.detail;
      addressForm.value.name = props.currentRow.name;
      addressForm.value.phone = props.currentRow.phone;
      addressvalue.value = [String(props.currentRow.stateId), String(props.currentRow.cityId)];
      if (props.currentRow.id) {
        addressarea.value = [
          addressAllLocation.value.map((item) => {
            return {
              value: String(item.id),
              label: item.name
            };
          }),
          addressAllLocation.value
            .find((v) => v.id == props.currentRow.stateId)
            ?.children.map((item) => {
            return {
              value: String(item.id),
              label: item.name
            };
          })
        ];
      }
    }
  }
);
const handleChangeTag = (tag: number) => {
  addressForm.value.tag = addressForm.value.tag !== tag ? tag : 0;
};

function onPaymentClose() {
  resetAddressForm();
  emit("cancel");
}

function onFormAdressSubmit() {
  if (!addressForm.value.name || !addressForm.value.phone) {
    toast.warning({
      zIndex: 10000,
      msg: "The content cannot be empty!"
    });
    return;
  }
  configAddress({
    ...addressForm.value,
    stateId: Number(addressvalue.value[0]),
    cityId: Number(addressvalue.value[1])

  }).then((res) => {
    if (res.code === 0) {
      toast.success(addressForm.value.id ? "Edit Successfully" : "Successfully Added");
      emit("confirm");
    }
  });
}

function resetAddressForm() {
  addressvalue.value = [];
  addressForm.value = {
    id: undefined,
    zipcode: "",
    detail: "",
    name: "",
    phone: null,
    isDefault: 0,
    tag: 0
  };
  isAddEditflag.value = "add";
}

const addressvalue = ref<string[]>([]);

const addressarea = ref<any[]>();

const columnChange = ({ selectedItem, resolve, finish }) => {
  const areaDatanew = addressAllLocation.value.find((v) => v.id == selectedItem.value)?.children;
  if (areaDatanew && areaDatanew.length) {
    resolve(
      areaDatanew.map((item) => {
        return {
          value: String(item.id),
          label: item.name
        };
      })
    );
  } else {
    finish();
  }
};

const getAddressLocationAll = () => {
  getAddresslocation().then((res) => {
    if (res.code === 0) {
      addressAllLocation.value = res.data as [];
      addressarea.value = [
        addressAllLocation.value.map((item) => {
          return {
            value: String(item.id),
            label: item.name
          };
        })
      ];
    }
  });
};

onMounted(() => {
  getAddressLocationAll();
});
</script>

<style lang="scss" scoped>
.flex_cn {
  display: flex;
  align-items: center;
}

:deep(.wd-popup__close) {
  top: 40rpx;
  right: 52rpx;
}

.addressConfigInfoContent {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 52rpx;
  padding-bottom: 234rpx;

  .poppupTitle {
    box-sizing: border-box;
    padding: 40rpx 0;
    font-size: 32rpx;
    font-weight: 800;
    color: #313131;
    text-align: center;
  }

  .addAdressFormContentBox {
    .formItemInfo {
      box-sizing: border-box;
      padding: 25rpx 0;

      .buttonArea {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12rpx 36rpx;
          font-size: 28rpx;
          font-weight: 400;
          color: #000000;
          background-color: #DFDFDF;
          border-radius: 36rpx;
          margin-left: 14rpx;
        }

        .isSelect {
          background-color: #00DBA1;
        }
      }

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
}
</style>
