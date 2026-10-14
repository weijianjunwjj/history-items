<template>
	<view>
		<view class="index-page">
			<view class="header" :style="{ 'padding-top': `${(h + 50) * 2}rpx` }">
				<image
					class="img-bg"
					style="z-index: 0"
					src="/static/home_bg.png"
				></image>

				<view class="flex-hc">
					<view class="header-info">
						<view class="full-w flex-hc" bindtap="toList">
							<text class="num">{{ missed_videocall_total }}</text>
							<text class="unit">通</text>
							<image
								src="/static/clear.png"
								class="ml-2"
								style="width: 15px; height: 15px; margin-top: 20px"
								@click="clearMissCall"
							></image>
						</view>

						<view class="txt1 center">未接视频来电</view>
					</view>

					<view class="header-info" style="margin-left: 53px">
						<view class="full-w flex-hc" bindtap="toList">
							<text class="num">{{ unfinished_workorder_total }}</text>
							<text class="unit">个</text>
						</view>

						<view class="txt1 center">未完成工单</view>
					</view>
				</view>
			</view>

			<view class="info-box flex-hvc">
				<button class="flex-vc" @click="toVideoCall">
					<image
						style="width: 60rpx; height: 64rpx"
						src="/static/video-call.png"
					></image>
					<text class="mt-1 fs-13 txt-1">视频通话</text>
				</button>

				<button class="flex-vc" @click="toWorkOrderAdmin">
					<image
						style="width: 60rpx; height: 64rpx"
						src="/static/workorder-admin.png"
					></image>
					<text class="mt-1 fs-13 txt-1">工单管理</text>
				</button>

				<button class="flex-vc" @click="toDeviceBindCode">
					<image
						style="width: 60rpx; height: 64rpx"
						src="/static/device-bindQRC.png"
					></image>
					<text class="mt-1 fs-13 txt-1">设备绑码</text>
				</button>
			</view>

			<view class="tabs-box">
				<u-tabs
					:current="current"
					:list="list1"
					class="mt-2"
					lineColor="#026fff"
					lineWidth="24px"
					lineHeight="3px"
					:activeStyle="{
						color: '#026fff',
						fontWeight: 'bold',
						fontSize: '32rpx'
					}"
					:inactiveStyle="{
						fontWeight: 'bold',
						color: '#2D3033',
						fontSize: '32rpx'
					}"
					itemStyle="height:92rpx;"
					@click="click"
				></u-tabs>
			</view>

			<scroll-list
				v-show="current === 0"
				ref="list"
				:option="option"
				:isFull="false"
				top="10px"
				height="760rpx"
				@refresh="refresh"
				@load="loadmore"
			>
					<view
						class="u-list-item"
						v-for="(item, index) in missed_videocall_list"
						:key="index"
					>
						<div class="u-list-item-div flex-vc">
							<div class="u-list-item-div-top flex-c">
								<span
									class="theme-c fs-18 bold"
									@click="callphone(item.userPhone)"
								>
									{{ item.userPhone }}
								</span>
								<span class="ml-3 txt-3 fs-12">
									{{ item.updateTime }}
								</span>
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
									<div class="txt-2">设备名称：</div>
									<div class="txt-1">{{ item.deviceName }}</div>
								</div>

								<div class="fs-12">
									<div class="txt-2">设备序列号：</div>
									<div class="txt-1">{{ item.deviceSn }}</div>
								</div>

								<div class="fs-12" style="margin-bottom: 24rpx">
									<div class="txt-2 fs-12">设备归属：</div>
									<div class="txt-1">{{ item.customerName }}</div>
								</div>
								
								<div class="fs-12" style="margin-bottom: 24rpx">
									<div class="txt-2 fs-12">等待时长：</div>
									<div class="txt-1">{{ getAnswerTime(item) }}</div>
								</div>
							</div>
						</div>
					</view>
			</scroll-list>

			<scroll-list
				v-show="current === 1"
				ref="list2"
				:option="option2"
				:isFull="false"
				top="10px"
				height="760rpx"
				@load="loadmore2"
				@refresh="refresh2"
			>
				<!-- <view class="u-list"> -->
					<view
						class="u-list-item"
						v-for="(item, index) in unfinished_workorder_list"
						:key="index"
					>
						<div class="u-list-item-div flex-vc" @click="workOrderJump(item)">
							<div class="u-list-item-div-top flex-c pt-3 pb-3">
								<u--image
									:showLoading="true"
									:src="item.deviceImage"
									width="40px"
									height="40px"
								></u--image>
								<div class="ml-2 txt-1">
									<div class="fs-18 mb-1">{{ item.deviceSn }}</div>
									<div class="fs-16">{{ item.deviceName }}</div>
								</div>
								<span
									class="status-mod"
									:class="statusMapper[item.ticketState].className"
								>
									{{ statusMapper[item.ticketState].text }}
								</span>
							</div>

							<div class="div-border"></div>

							<div class="u-list-item-div-bottom">
								<div class="fs-12" v-if="workTicketTypeList.length">
									<div class="txt-2">工单类型：</div>
									<div class="txt-1">
										{{ getTicketType(item, workTicketTypeList) }}
									</div>
								</div>

								<div class="fs-12">
									<div class="txt-2">问题描述：</div>
									<div class="txt-1">{{ item.ticketContent }}</div>
								</div>

								<div class="fs-12">
									<div class="txt-2">报修人：</div>
									<div class="txt-1">{{ item.reporterPhone }}</div>
								</div>
								<div class="fs-12">
									<div class="txt-2">报修时间：</div>
									<div class="txt-1">{{ item.createTime }}</div>
								</div>

								<div class="fs-12" style="margin-bottom: 24rpx">
									<div class="txt-2 fs-12">设备归属：</div>
									<div class="txt-1">{{ item.deviceCustomer }}</div>
								</div>
								
							</div>
						</div>
					</view>
				<!-- </view> -->
			</scroll-list>
		</view>
	
	

	</view>
</template>

<script>
import {
	getMissedRecord,
	getUnfinishWorkorderList,
	clearMissedRecord,
	getWorkTicketTypeList
} from '@/config/api.js';
import { statusCall, statusMapper } from '@/utils/data.js';
import { callphone, workOrderJump } from '@/utils/uniapp.js';
import { getTicketType,getAnswerTime } from '@/utils';

export default {
	data() {
		return {
			loading: true,
			statusMapper,
			statusCall,
			h: 0,
			current: 0,
			missed_videocall_total: 0,
			unfinished_workorder_total: 0,
			missed_videocall_list: [],
			unfinished_workorder_list: [],
			urls: [],
			pageSize: uni.pageSize,
			pageNum: 0,
			total: 99,
			pageNum2: 0,
			total2: 99,
			workTicketTypeList: [],
			option: {
				size: 0,
				auto: false
			},
			option2: {
				size: 0,
				auto: false
			},
			scrollTop: 0,
			scrollTop2: 0
		};
	},
	computed: {
		list1() {
			return [
				{
					name: `未接视频来电(${this.missed_videocall_total || 0})`
				},
				{
					name: `未完成工单(${this.unfinished_workorder_total || 0})`
				}
			];
		}
	},
	onLoad(options) {
		this.h = this.get_phone().h;
		uni.$on('refreshData_getUnfinishWorkorderList', () => {
			this.refresh2();
		});
	},
	mounted() {
		this.init();
	},
	methods: {
		getAnswerTime,
		init() {
			this.$refs.list.show_loading()
			this.missed_videocall_list = [];
			this.unfinished_workorder_list = [];
			this.pageNum = 0;
			this.pageNum2 = 0;
			this.loadmore();
			this.loadmore2();
			this.getWorkTicketTypeList();
		},
		async getWorkTicketTypeList() {
			const data = await getWorkTicketTypeList();
			this.workTicketTypeList = data;
		},
		getTicketType,
		workOrderJump,
		toWorkOrderAdmin() {
			uni.switchTab({ url: '/pages/work-order-admin/work-order-admin' });
		},
		clearMissCall() {
			const that = this;
			clearMissedRecord().then(res => {
				uni.showToast({
					title: '清除完成',
					success() {
						that.missed_videocall_list = [];
						that.getMissedCall();
					}
				});
			});
		},
		//拨打电话
		callphone,
		toVideoCall() {
			uni.navigateTo({ url: '/pages/video-call-record/video-call-record' });
		},
		toDeviceBindCode() {
			uni.navigateTo({ url: '/pages/scan-code-bind-device/scan-code-bind-device' });
		},
		getMissedCall(type) {
			return new Promise((resolve, reject) => {
				const { pageSize, pageNum } = this;
				getMissedRecord({
					pageSize,
					pageNum
				})
					.then(res => {
						console.log('res :>> ', res);
						const { records, total } = res;
						this.missed_videocall_total = total;
						uni.setStorageSync('missed_videocall_total', total);
						if (type === 'refresh') {
							this.missed_videocall_list = records;
						} else {
							this.missed_videocall_list = [
								...this.missed_videocall_list,
								...records
							];
						}
						const data = { list: this.missed_videocall_list, total };
						resolve(data);
					})
					.catch(err => {
						console.error(err);
						reject();
					});
			});
		},
		get_unfinished_workorder_list(type) {
			return new Promise((resolve, reject) => {
				const params = {
					pageSize: this.pageSize,
					pageNum: this.pageNum2
				};

				getUnfinishWorkorderList(params)
					.then(res => {
						const { items, total } = res;

						if (type === 'refresh') {
							this.unfinished_workorder_list = items;
						} else {
							this.unfinished_workorder_list = [
								...this.unfinished_workorder_list,
								...items
							];
						}
						this.unfinished_workorder_total=total
						resolve({ list: this.unfinished_workorder_list, total });
					})
					.catch(err => {
						console.error(err);
						reject();
					});
			});
		},
		// scrolltolower() {
		// 	if (this.missed_videocall_list.length < this.missed_videocall_total) {
		// 		this.loadmore();
		// 	}
		// },
		// scrolltolower2() {
		// 	if (this.unfinished_workorder_list.length < this.unfinished_workorder_total) {
		// 		this.loadmore2();
		// 	}
		// },
		loadmore() {
			this.pageNum = this.pageNum + 1;
			this.getMissedCall()
				.then(data => {
					this.$refs.list.loadSuccess(data);
				})
				.catch(() => {
					uni.hideLoading();
					uni.showToast({
						title: err.errMsg || '请求失败',
						icon: 'error'
					});
					this.$refs.list.loadFail();
				});
		},
		loadmore2() {
			this.pageNum2 = this.pageNum2 + 1;
			this.get_unfinished_workorder_list()
				.then(data => {
					this.$refs.list2.loadSuccess(data);
				})
				.catch(() => {
					uni.hideLoading();
					uni.showToast({
						title: err.errMsg || '请求失败',
						icon: 'error'
					});
					this.$refs.list2.loadFail();
				});
		},
		refresh() {
			this.pageNum = 1;
			this.getMissedCall('refresh')
				.then(data => {
					this.$refs.list.refreshSuccess(data);
				})
				.catch(() => {
					this.$refs.list.refreshFail();
				});
		},
		refresh2() {
			this.pageNum2 = 1;
			this.get_unfinished_workorder_list('refresh')
				.then(data => {
					this.$refs.list2.refreshSuccess(data);
				})
				.catch(() => {
					this.$refs.list2.refreshFail();
				});
		},
		click(item) {
			console.log('item', item);
			this.scrollTop = 0;
			this.scrollTop2 = 0;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 200
			});
			this.current = item.index;
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	position: absolute;
	width: 200px;
	height: 200px;
	background: grey;
	z-index: 10000;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
}

.u-list {
	// padding-top: 10px;
	// height: 760rpx !important;
	&-item {
		margin-left: 15px;
		margin-right: 15px;
		// margin-top: 10px;
		&:not(:first-child) {
			margin-top: 10px;
		}
		&-div {
			position: relative;
			padding-left: 20rpx;
			padding-right: 20rpx;
			background-color: #ffffff !important;
			border-radius: 4px 4px 4px 4px;
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
	}
}

.header {
	position: relative;
	height: 526rpx;
	box-sizing: border-box;
	background-color: #fff;

	.img-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.9);
		margin-left: 15px;
	}

	&-info {
		.num {
			font-size: 96rpx;
			font-weight: normal;
			color: $theme;
			margin-right: 16px;
			line-height: 37px;
		}

		.unit {
			font-size: 13px;
			font-weight: normal;
			color: $theme;
			margin-top: 20px;
		}
	}

	.txt1 {
		font-size: 13px;
		font-weight: normal;
		color: #a2a2a2;
		margin-top: 15px;
	}
}

.info-box {
	position: relative;
	width: 690rpx;
	height: 105px;
	background: #ffffff;
	box-shadow: 0px 4px 20px 0px rgba(102, 100, 93, 0.2);
	border-radius: 4px 4px 4px 4px;
	margin: auto;
	margin-top: -130rpx;
	font-size: 26rpx;
	color: #494a49;
	z-index: 2;
}

.tabs-box {
	height: 134rpx;
	background-color: #fff;
	margin-top: -90rpx;
	padding-top: 90rpx;
}

/deep/ .u-tabs__wrapper__nav__line {
	border-radius: 2px 2px 2px 2px !important;
}
/deep/ .u-tabs__wrapper__nav__item {
	flex: 1 !important;
}

button::after {
	border: none;
}

button {
	background-color: transparent !important;
	padding-left: 0;
	padding-right: 0;
	line-height: inherit;
	border-radius: 0;
}
</style>
