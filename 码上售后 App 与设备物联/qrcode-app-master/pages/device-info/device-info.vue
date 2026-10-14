<template>
	<view class="page-device-info">
		<u-tabs
			:current="current"
			:list="tabs"
			lineColor="#026fff"
			lineWidth="24px"
			lineHeight="2px"
			:activeStyle="{
				color: '#026fff',
				fontSize: '32rpx'
			}"
			:inactiveStyle="{
				color: '#2D3033',
				fontSize: '32rpx'
			}"
			itemStyle="height:84rpx;"
			@click="click"
		></u-tabs>

		<main class="mt-3">
			<template v-if="current == 0">
				<view class="pl-4 pr-4">
					<view class="tab1-item">
						<view class="tab1-label">设备图片：</view>
						<view class="tab1-value"><u--image :showLoading="true" :src="deviceInfo.deviceVO.deviceImage" width="80px" height="80px"></u--image></view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">设备名称：</view>
						<view class="tab1-value">{{ deviceInfo.deviceVO.name }}</view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">设备序列号：</view>
						<view class="tab1-value">{{ deviceInfo.deviceVO.sn }}</view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">设备归属：</view>
						<view class="tab1-value">{{ deviceInfo.deviceVO.customerName }}</view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">设备位置：</view>
						<view class="tab1-value">{{ deviceInfo.deviceVO.address }}</view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">收货地址：</view>
						<view class="tab1-value">{{ deviceInfo.deviceVO.deliveryAddress || '---' }}</view>
					</view>
					<view class="tab1-item">
						<view class="tab1-label">视频报修记录：</view>
						<view class="tab1-value">{{ deviceInfo.faceRepairNums || 0 }}次</view>
					</view>
				</view>
			</template>

			<template v-if="current == 1">
				<view>
					<u-list @scrolltolower="scrolltolower">
						<u-list-item class="my-list-item pl-2 pr-2" v-for="(item, index) in indexList" :key="index">
							<div class="my-list-item-top flex-c">
								<span class="theme-c fs-18 bold">{{ item.reporterPhone }}</span>
								<span class="ml-3 txt-3 fs-12">{{ formatTime(item.createTime) }}</span>
								<span class="status-mod" :class="statusMapper[item.ticketState].className">{{ statusMapper[item.ticketState].text }}</span>
							</div>

							<div class="div-border"></div>

							<div class="my-list-item-bottom pt-2 pb-3 text-wrap">{{ item.ticketContent || '---' }}</div>
						</u-list-item>
					</u-list>
				</view>
			</template>

			<template v-if="current == 2">
				<view class="pl-4 pr-4">
					<view class="tab1-item">
						<view class="tab1-label">报修人账号：</view>
						<view class="tab1-value">{{ deviceInfo.repairUserDto.phone }}</view>
					</view>

					<view class="tab1-item">
						<view class="tab1-label">视频连线次数：</view>
						<view class="tab1-value">{{ deviceInfo.repairUserDto.faceTimeNums || 0 }}次</view>
					</view>

					<view class="tab1-item">
						<view class="tab1-label">上次视频连线：</view>
						<view class="tab1-value">{{ deviceInfo.repairUserDto.latestFaceTime || 0 }}</view>
					</view>

					<view class="tab1-item">
						<view class="tab1-label">上次连线时长：</view>
						<view class="tab1-value">{{ diffTime(deviceInfo.repairUserDto.latestFaceTime, deviceInfo.repairUserDto.latestFaceFinishTime) }}</view>
					</view>
				</view>
			</template>
		</main>
	</view>
</template>

<script>
import { getFaceTimeInfoList } from '@/config/api.js';
import { formatTime, diffTime } from '@/utils';
import { statusMapper } from '@/utils/data.js';

export default {
	data() {
		return {
			videoContext: null,
			statusMapper,
			current: 0,
			indexList: [],
			deviceInfo: {
				deviceVO: {},
				repairRecordDtos: [],
				repairUserDto: {}
			},
			tabs: [
				{
					name: '设备信息'
				},
				{
					name: '设备报修记录'
				},
				{
					name: '客户信息'
				}
			]
		};
	},
	onLoad(opts) {
		this.videoContext = uni.createVideoContext('myVideo');
		//创建一个视频上下文的操作对象，通过id标识获取myVideo
		// console.error(
		//   '------------------device-info-onLoad----------------------------------------------'
		// );
		// console.log('opts', opts);
		const userID = opts.userID;
		// '18352517082-1498497126920065024-1516731517491650562'
		console.log('userID', userID);
		if (!userID) return;
		const phone = userID.split('-')[0];
		const scene = `${userID.split('-')[1]}-${userID.split('-')[2]}`;
		const params = JSON.stringify([{ phone, scene }]);
		// console.error('params :>> ', params);
		getFaceTimeInfoList(params)
			.then(obj => {
				// console.log('getFaceTimeInfoList-obj :>> ', obj);
				const data = Object.values(obj)[0];
				// console.log('data :>> ', data);
				this.deviceInfo = data;
				this.indexList = data.repairRecordDtos;
			})
			.catch(e => {
				console.error(e);
			});
	},
	onShow() {
	},
	onUnload() {
	},
	methods: {
		diffTime,
		formatTime,
		click(item) {
			// console.log('item', item);
			this.current = item.index;
		},
		scrolltolower(e) {
			console.log('e :>> ', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.page-device-info {
}

.tab1-item {
	display: flex;
	.tab1-label {
		width: 200rpx;
		font-size: 28rpx;
		color: $txt-c-2;
		margin-bottom: 24rpx;
	}

	.tab1-value {
		font-size: 28rpx;
		color: $txt-c-1;
		flex: 1;
	}
}

.div-border {
	height: 1rpx;
	background: #ebeceb;
}

.my-list-item {
	position: relative;
	background: #ffffff;
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
	border-radius: 2px 2px 2px 2px;
	margin: 30rpx 30rpx 0 30rpx;
	&:last-child {
		margin-bottom: 30rpx;
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

::v-deep {
	.u-list {
		height: calc(100vh - 111px) !important;
	}
}

/deep/ .u-tabs__wrapper__nav__line {
	border-radius: 2px !important;
}
/deep/ .u-tabs__wrapper__nav__item {
	flex: 1 !important;
}
</style>
