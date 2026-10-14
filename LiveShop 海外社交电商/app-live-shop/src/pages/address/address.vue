<route lang="json5">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'Address Management',
    'app-plus': {
      titleNView: false,
      popGesture: 'none',
    },
  },
}
</route>

<template>
  <Title text="Address Management" :white="false" style="background-color: #fff;">
    <view style="font-size: 32rpx; font-weight: 400; color: #00DBA1;" @click="onNavTopRight">Add</view>
  </Title>
  <view class="addressManagementContainer">
    <view class="addressViewInfo" v-if="addressList?.length">
      <cc-pullScroolView
        class="pullScrollView"
        ref="pullScroll"
        :pullDown="pullDown"
        upFinishText="No More For Now"
        pullingText="Pull to refresh"
        loosingText="Release refresh"
        downLoadingText="refresh..."
        upLoadingText="loading..."
        downSuccessText="Refresh successfully"
        downErrorText="Refresh failure"
        upErrorText="If loading fails, click Reload"
      >
        <wd-swipe-action v-for="(item, index) in addressList" :key="index">
          <view class="addressItem_content flex-sb-c">
            <view class="flex-1">
              <view class="addressDetail">
                {{ item.stateName }} {{ item.cityName }} {{ item.detail }}
              </view>
              <view class="addressName flex-c">
                <view style="max-width: 70%;">
                  <span style="width: 50%;overflow: hidden;" class="text-wrap">{{ item.name }}</span>
                  <span style="margin-left: 10rpx;width: 50%;" class="text-wrap">{{ item.phone }}</span>
                </view>
                <view>
                  <wd-tag type="warning" round color="#404040" bg-color="#FBA345"
                          style=" margin-left:16rpx;height: 28rpx; line-height: 28rpx; padding:0 20rpx"
                          v-if="item.isDefault == 1">
                    <text style="font-size:20rpx;font-weight: 400;">DEFAULT</text>
                  </wd-tag>
                  <wd-tag type="warning" round color="#404040" bg-color="#00DBA1"
                          style=" margin-left:8rpx;height: 28rpx; line-height: 28rpx; padding:0 20rpx"
                          v-if="item.tag === 1">
                    <text style="font-size:20rpx;font-weight: 400;">HOME</text>
                  </wd-tag>
                  <wd-tag type="warning" round color="#404040" bg-color="#00DBA1"
                          style=" margin-left:8rpx;height: 28rpx; line-height: 28rpx; padding:0 20rpx"
                          v-if="item.tag === 2">
                    <text style="font-size:20rpx;font-weight: 400;">COMPANY</text>
                  </wd-tag>
                </view>
              </view>
            </view>
            <view class="adderssEdit" @click="onClickAddressEdit(item)">
              <image
                src="@/static/images/address/edit.svg"
                mode="scaleToFill"
                style="width: 28px;height: 28px;"
              />
            </view>
          </view>
          <template #right>
            <view class="wdSwipeAction flex">
              <wd-button round block custom-class="actionRigBtn" style="background: #dfdfdf;font-size: 24rpx;font-weight: 400;color: #4d4d4d;"
                         @click="onClickEditDefaultAddress(item)">
                Set As
                <br />
                Default
              </wd-button>
              <wd-button round block custom-class="actionRigBtn" style="background: #ff4b4b;font-size: 24rpx;font-weight: 400;color: #fff;"
                         @click="onClickDeleteAddress(item)">
                Delete
              </wd-button>
            </view>
          </template>
        </wd-swipe-action>
      </cc-pullScroolView>

    </view>

    <Empty v-else />

    <addressConfig :visible="addressConfigVisible" :currentRow="currentAddressObj" @cancel="onAddressCancel" @confirm="onAddressConfirm" />
  </view>
</template>

<script lang="ts" setup>
// import { toPage, getUrl } from '@/utils/utils'
import { onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { getAddressList, addressDel, addressEdit } from "@/service/adress/adress";
import { useToast, useMessage } from "wot-design-uni";
import addressConfig from "@/components/addressConfig/addressConfig.vue";
import Empty from "@/components/Empty/Empty.vue";

const message = useMessage();
const toast = useToast();
const addressList = ref([]);
const addressConfigVisible = ref(false);
const currentAddressObj = ref({});

const pageBody = reactive({
  page: 1,
  pageSize: 10
});
const totalCount = ref(0);
const pullScroll = ref();

function onNavTopRight() {
  addressConfigVisible.value = true;
}

function onAddressCancel() {
  currentAddressObj.value = {};
  addressConfigVisible.value = false;
}

function onAddressConfirm() {
  getAddressListFn();
  currentAddressObj.value = {};
  addressConfigVisible.value = false;
}

function onClickAddressEdit(row: any) {
  currentAddressObj.value = row;
  addressConfigVisible.value = true;
}

function onClickEditDefaultAddress(row: any) {
  const editAddressForm = Object.assign({}, row);
  editAddressForm.isDefault = 1;
  addressEdit(editAddressForm).then((res: any) => {
    if (res.code === 0) {
      toast.success("Successfully set");
      addressList.value = [];
      getAddressListFn();
    }
  });
}

function onClickDeleteAddress(item: any) {
  message
    .confirm({
      msg: "Are you sure you want to delete this address?",
      confirmButtonText: "delete",
      cancelButtonText: "cancel",
      closeOnClickModal: false
    })
    .then(() => {
      addressDel({ id: item.id }).then((res: any) => {
        if (res.code === 0) {
          toast.success("Successfully delete");
          addressList.value = [];
          getAddressListFn();
        }
      });
    });
}

const getAddressListFn = async () => {
  try {
    const res = await getAddressList({ ...pageBody });
    if (res.code === 0) {
      addressList.value = pageBody.page === 1
        ? res.data.list
        : [...addressList.value, ...(res.data.list || [])];
      totalCount.value = res.data.count;
      console.log(addressList.value);
      setTimeout(() => {
        if (pageBody.page * 10 >= totalCount.value) {
          pullScroll.value?.finish();
        } else {
          pullScroll.value?.success();
        }
      }, 600);
    }
  } catch (error) {
    console.error("获取地址列表失败:", error);
  }
};

// 下拉刷新
function pullDown() {
  addressList.value = [];
  pageBody.page = 1;
  getAddressListFn();
}

onReachBottom(() => {
  if (addressList.value.length >= totalCount.value) return;
  pullScroll.value.showUpLoading();
  pageBody.page += 1;
  getAddressListFn();
});

onLoad(() => {
  getAddressListFn();
});

onNavigationBarButtonTap((e: any) => {
  addressConfigVisible.value = true;
});
</script>

<style lang="scss" scoped>
@import './address.scss';

:deep(.uni-page-head-btn) {
  margin-right: 28rpx;
}

:deep(.uni-page-head__title) {
  font-size: 32rpx;
  font-weight: bold;
  color: #404040;
}
</style>

