<template>
	<div class="SearchHistory pt-9 plr-5">
		<view class="flex-sb-c">
			<text style="font-size:32rpx" class=" c-4b fw-500">Search History</text>
			<image v-if="history.length" src="@/static/images/index/delete.png" style="width: 30rpx; height: 36rpx"
				@click="onClear" />
		</view>

		<view class="content mt-5">
			<wd-button size="small" v-for="(item, index) in history" :key="index" class="mr-9 mb-4 btns"
				@click="onSearch(item)">
				{{ item }}
			</wd-button>
		</view>
	</div>
</template>

<script setup>
	import {
		getSearchHistory,
		clearSearchHistory
	} from '../hooks'

	const history = ref(getSearchHistory())
	const emit = defineEmits()

	function onClear() {
		history.value = []
		clearSearchHistory()
	}

	function onSearch(item) {
		emit('search', item)
	}
</script>

<style lang="scss" scoped>
	.SearchHistory {
		.btns {
			padding: 8rpx 20rpx;
			font-size: 28rpx;
			font-weight: 400;
			border: 2rpx solid #DFDFDF;
			border-radius: 24rpx;
			background: #FFFFFF;
			color: #404040;
		}
	}

	// .SearchHistory {
	// 	.btns {
	// 		border-radius: 24rpx 24rpx 24rpx 24rpx !important;
	// 		border: 2rpx solid #dfdfdf !important;
	// 	}
	// }
</style>
