<template>
	<div>
		<cc-pullScroolView v-if="list.length" ref="pullScroll" :pullDown="pullDown" class="pullScrollView" downErrorText="Refresh failure"
			downLoadingText="refresh..." downSuccessText="Refresh successfully" loosingText="Release refresh"
			pullingText="Pull to refresh" upErrorText="If loading fails, click Reload" upFinishText="No more for now"
			upLoadingText="loading...">
			<view v-for="(item, index) in list" :key="index" class="flex-c noticeItemInfo" @click="onToUserChatRoom(item)">
				<view class="dynamicItemInfo_leftIcon flex-cc">
					<image :src="getAvatar(item)" mode="aspectFill" class="contactsAdver" />
					<image v-if="item.gender == 2" class="contactsSexIcon" src="/static/images/system/woman.png" />
					<image v-else class="contactsSexIcon" src="/static/images/system/man.png" />
				</view>

				<view class="flex-1 noticeItemInfo_rigMessage">
					<view class="flex-sb-c">
						<p class="sysTitle">{{ item.nickname }}</p>
					</view>
					<view class="flex-c">
						<view class="flex-1 ellipsis-2 messageContent">{{ item.sign }}</view>
					</view>
					<view class="flex-c">
						<view class="flex-1 ellipsis-2 messageContent">ID:{{ item.id }}</view>
					</view>
				</view>

				<view style="margin-left: 76rpx">
					<image src="/static/images/my-messages/dm.png" style="width: 54rpx; height: 54rpx" />
				</view>
			</view>
		</cc-pullScroolView>

    <Empty v-else />
		<!-- // <view @click="handleClick">打开数据库</view> -->
		<!-- // <view @click="handleClick1">关闭数据库</view> -->
	</div>
</template>

<script setup lang="ts">
import {getUserFriend} from "@/service/person-page/person-page";
import {getAvatar} from "@/utils/utils";
import Empty from "@/components/Empty/Empty.vue";

const { userInfo } = useUserInfo()
	const pageBody = reactive({
		page: 1,
		pageSize: 10,
	})

	const list = ref([])
	const totalCount = ref(0)
	const pullScroll = ref()
	// 下拉刷新
	function pullDown() {
		list.value = []
		pageBody.page = 1
		query()
	}

	onReachBottom(() => {
		if (list.value.length >= totalCount.value) return
		pullScroll.value.showUpLoading()
		pageBody.page += 1
	})

	function onToUserChatRoom(row : any) {
		uni.navigateTo({
      url: `/pages/chatRoom/chatRoom?conversationId=${userInfo.value.imAccountId}|1|${row.accId}&id=${row.id}&userName=${row.nickname}`
		})
	}

	async function query() {
		const { data } : { data : any } = await getUserFriend({ ...pageBody })
		console.log('data', data)
		list.value = [...list.value, ...(data?.list || [])]
		totalCount.value = data?.count || 0
		setTimeout(() => {
			if (pageBody.page * 10 >= totalCount.value) {
				pullScroll.value.finish()
			} else {
				pullScroll.value.success()
			}
		}, 600)
	}

	onMounted(() => {
		query()
	})
</script>

<style lang="scss" scoped>
	@import '../common.scss';
</style>
