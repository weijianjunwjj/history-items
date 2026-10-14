<template>
  <div class="SearchBar2 flex-sb-c pr-6">
    <image src="@/static/images/index/left-arrow.png" style="width: 20rpx; height: 36rpx" class="ml-4"
           @click="onBack" />
    <wd-search placeholder-class="placeholderClass" custom-class="searchInput" v-model="searchValue" @focus="focus"
               @blur="blur" @search="onSearch"
               @change="change" @clear="onClear"
               :focus="true" placeholder="Enter the username or ID." placeholder-left hide-cancel
               style="width: calc(100% - 112rpx); height: 60rpx; padding-right: 32rpx"></wd-search>
    <view style="font-size:32rpx" class="fw-400" @click.stop="onSearch">Search</view>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  searchVal: String
});


const searchValue = ref(props.searchVal);


watch(() => props.searchVal, (_searchVal) => {
  searchValue.value = _searchVal;
});


const emit = defineEmits();

function focus() {
  console.log("聚焦");
  emit("focus");
}

function blur() {
  console.log("失焦");
  emit("blur");
}

function onSearch(value) {
  console.log("搜索");
  console.log("value", value);
  console.log("typeof value.value ", typeof value.value);
  if (typeof value.value === "string") {
    emit("search", value.value);
  } else {
    console.log("typeof searchValue.value ", typeof searchValue.value);
    console.log("searchValue.value", searchValue.value);
    if (typeof searchValue.value === "string") {
      emit("search", searchValue.value);
    }
  }
}

function onClear() {
  console.log("重置");
  emit("clear");
}

async function change({ value }) {
  // console.log('输入', value)
  console.log("change----------value", value);
  await nextTick();
  searchValue.value = value;
  // emit('change', value)
}

function onBack() {
  uni.navigateBack({
    delta: 1
  });
}
</script>
<!--<style lang="scss" scoped>-->
<!--.searchInput{-->
<!--  background-color: red !important;-->
<!--}-->
<!--</style>-->
<style lang="scss">
.SearchBar2 {
  background-color: #ffffff;
  .wd-search {
    background: none !important;

    .wd-search__block {
      border-radius: 32rpx 32rpx 32rpx 32rpx !important;
      background: #f7f7f7 !important;
    }
  }
}
</style>
