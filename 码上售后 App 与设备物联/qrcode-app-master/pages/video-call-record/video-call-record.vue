<template>
	<view class="video-call">
		<scroll-list
			ref="list"
			top="10px"
			height="calc(100vh - 20px)"
			:option="option"
			@refresh="refresh"
			@load="loadmore"
		>
			<view class="u-list">
				<view
					class="u-list-item u-list-item-div flex-vc"
					v-for="(item, index) in list"
					:key="index"
				>
					<div class="u-list-item-div-top flex-c">
						<span
							class="theme-c fs-18 bold"
							@click="callphone(item.userPhone)"
						>
							{{ item.userPhone }}
						</span>
						<span class="ml-3 txt-3 fs-12">{{ item.updateTime }}</span>
						<span
							class="status-mod"
							:class="statusCall[item.state].className"
						>
							{{ statusCall[item.state].text }}
						</span>
					</div>

					<div class="div-border"></div>

					<div class="u-list-item-div-bottom">
						<div class="fs-12">
							<div class="txt-2 item-label">设备名称：</div>
							<div class="txt-1 item-value">{{ item.deviceName }}</div>
						</div>

						<div class="fs-12">
							<div class="txt-2 item-label">设备序列号：</div>
							<div class="txt-1 item-value">{{ item.deviceSn }}</div>
						</div>

						<div class="fs-12">
							<div class="txt-2 fs-12 item-label">
								{{ item.state === -1 ? '等待时长：' : '通话时长' }}
							</div>
							<div class="txt-1 item-value">{{ getAnswerTime(item) }}</div>
						</div>

						<div class="fs-12" style="margin-bottom: 24rpx">
							<div class="txt-2 fs-12 item-label">来电位置：</div>
							<div
								class="txt-1 item-value"
								style="flex: 1"
								@click="openMap(item)"
							>
								<image
									:src="require('../../static/location.png')"
									v-if="item.address"
									class="mr-1"
									style="width:32rpx;height:32rpx; vertical-align:middle"
									alt=""
								/>
								{{ item.address }}
							</div>
						</div>

						<div class="fs-12" style="margin-bottom: 24rpx">
							<div class="txt-2 fs-12 item-label flex" style="flex: 1">
								<u-switch
									size="35"
									:value="mapping.get(item.resolvedFlag)"
									asyncChange
									@change="asyncChange(item, $event)"
								></u-switch>

								<u--text
									class="ml-2-i"
									size="20"
									:text="item.resolvedFlag ? '已解决' : '未解决'"
								></u--text>
							</div>
							<div class="txt-1" style="text-align: right;">
								<u-button
									type="primary"
									:plain="true"
									class="my-btn"
									v-if="item.workTicketId"
									@click="lookWorkOrder(item)"
								>
									查看工单
								</u-button>
								<u-button
									class="my-btn"
									type="primary"
									v-else
									@click="toCreateWorkOrder(item)"
								>
									创建工单
								</u-button>
							</div>
						</div>
					</div>
				</view>
			</view>
		</scroll-list>

	</view>
</template>

<script>
import { getVideoCallRecord, resolvedProblemStatus } from '@/config/api.js';
import { getAnswerTime } from '@/utils/index.js';
import { statusCall, mapping } from '@/utils/data.js';
import { callphone, toCreateWorkOrder } from '@/utils/uniapp.js';

export default {
	data() {
		return {
			mapping,
			option: {
				auto: true
			},
			getAnswerTime,
			statusCall,
			total: 0,
			pageNum: 0,
			pageSize: uni.pageSize,
			list: [],
			status: 'loadmore',
			loadingText: '努力加载中',
			loadmoreText: '轻轻上拉',
			nomoreText: '没有更多数据了',
			showMore: false,
			loading: true
		};
	},

	mounted() {
		console.error('mounted------------------');
		// this.$refs.uNotify.show({
		// 	top: 10,
		// 	type: 'error',
		// 	color: '#000',
		// 	bgColor: '#e8e8e8',
		// 	message: 'Hi uView',
		// 	duration: 1000 * 3,
		// 	fontSize: 20,
		// 	safeAreaInsetTop: true
		// });

		// 也可以通过主题形式调用，如：
		// this.$refs.uNotify.primary('Primary主题')

		// 关闭 notify
		// this.$refs.uNotify.close()
	},
	methods: {
		openMap(item) {
			console.log('item :>> ', item);
			const { latitude, address, longitude } = item;
			const opts = JSON.stringify(item);
			if (address) {
				uni.openLocation({
					latitude: Number(latitude),
					longitude: Number(longitude),
					name: address,
					address,
					success: function() {
						console.log('success');
					},
					fail(e) {
						console.error(e);
					}
				});
			} else {
				uni.showToast({
					title: '缺少经纬度！',
					icon: 'none'
				});
			}
		},
		asyncChange(item, e) {
			console.log('item :>> ', item);
			console.log('e :>> ', e);
			resolvedProblemStatus({
				id: item.id,
				sn: item.sn,
				resolvedFlag: mapping.get(e)
			}).then(res => {
				item.resolvedFlag = mapping.get(e);
				uni.showToast({
					title: '修改成功'
				});
			});
		},
		refresh() {
			this.pageNum = 1;
			this.getVideoCallRecord('refresh')
				.then(data => {
					this.$refs.list.refreshSuccess(data);
				})
				.catch(() => {
					this.$refs.list.refreshFail();
				});
		},
		lookWorkOrder(item) {
			const workOrderInfo = JSON.stringify(item);
			uni.navigateTo({
				url:
					'/pages/work-order-detail/work-order-detail?workOrderInfo=' +
					workOrderInfo
			});
		},
		callphone,
		toCreateWorkOrder,
		getVideoCallRecord(type) {
			return new Promise((resolve, reject) => {
				const { pageSize, pageNum } = this;
				getVideoCallRecord({
					pageSize,
					pageNum
				})
					.then(res => {
						console.log('res :>> ', res);
						const { items, total } = res;
						if (type === 'refresh') {
							this.list = items;
						} else {
							this.list = [...this.list, ...items];
						}
						resolve({ list: this.list, total });
					})
					.catch(err => {
						console.error(err);
						reject();
					});
			});
		},
		scrolltolower() {
			if (this.list.length < this.total) {
				this.status = 'loading';
				this.loadmore();
			} else {
				this.status = 'nomore';
			}
			this.showMore = true;
		},
		loadmore() {
			console.log('loadmore---');
			this.pageNum = this.pageNum + 1;
			this.getVideoCallRecord()
				.then(data => {
					console.log('this.$refs.list :>> ', this.$refs.list);
					this.$refs.list.loadSuccess(data);
				})
				.catch(() => {
					this.$refs.list.loadFail();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.u-list-item {
	margin-left: 15px;
	margin-right: 15px;
}

.my-btn {
	width: 152rpx;
	height: 48rpx;
	font-size: 24rpx;
}

.u-list-item-div {
	position: relative;
	padding-left: 20rpx;
	padding-right: 20rpx;
	background-color: #ffffff !important;
	border-radius: 4px 4px 4px 4px;
	&:not(:first-child) {
		margin-top: 10px;
	}
	&-top {
		width: 100%;
		height: 88rpx;
		.status-mod {
			position: absolute;
			top: 0;
			right: 0;
			width: 52px;
			height: 20px;
			line-height: 20px;
			border-radius: 0px 4px 0px 4px;
			font-size: 12px;
			text-align: center;
		}
	}
	&-bottom {
		width: 100%;
		> div {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 24rpx;
		}
	}
}

.item-label {
	width: 80px;
}
.item-value {
	flex: 1;
	text-align: right;
}

::v-deep {
	.u-list {
		height: calc(100vh - 40px) !important;
	}

	.u-loadmore__content__text {
		line-height: unset !important;
	}
}
</style>
