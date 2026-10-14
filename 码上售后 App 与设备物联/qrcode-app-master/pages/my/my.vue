<template>
	<!-- <view><u-button class="mt-4" @click="logout">退出</u-button></view> -->
	<view class="my-container">
		<view class="header" :style="{ 'padding-top': `${h * 2}rpx` }">
			<view class="header-box flex">
				<u--image
					v-if="userInfo.user"
					:showLoading="true"
					:src="userInfo.user.avatar"
					 shape="circle"
					width="130rpx"
					height="130rpx"
				></u--image>
				<image
					v-else
					:src="'/static/image/my-page/portrait.png'"
					class="circle"
					style="width:130rpx;height:130rpx ;"
				></image>

				<view class="flex-v just-sb ml-3">
					<text class="user-name">{{ userInfo.user.nickName }}</text>

					<text class="user-tip">
						您有 {{ missed_videocall_total }} 通未接视频来电
					</text>
				</view>
			</view>
		</view>

		<view class="content">
			<view class="title">管理功能</view>
			<view class="list">
				<!-- <view class="list-item" bindtap="to_tab1">
					<view class="list-item-left  align-center"><image mode="widthFix" src="/static/image/my-page/user-check.png"></image></view>
					<view class="list-item-right">
						<view>接听状态</view>
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>
				<view class="list-item" bindtap="to_tab2">
					<view class="list-item-left flex align-center"><image mode="widthFix" src="/static/image/my-page/bell-states.png"></image></view>
					<view class="list-item-right">
						<view>通知消息</view>
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view> -->

				<view class="list-item" @click="logout">
					<view class="list-item-left flex align-center">
						<image
							mode="widthFix"
							src="/static/image/my-page/icon-log-out.png"
						></image>
					</view>
					<view class="list-item-right">
						<view>退出登录</view>
						<u-icon name="arrow-right" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="footer fs-12 txt-3">当前版本：V{{ config.version }}</view>

		<u-modal
			:show="show"
			:title="title"
			:content="content"
			showCancelButton
			width="300px"
			@confirm="confirmLogout"
			@cancel="show = false"
		></u-modal>
	</view>
</template>

<script>
import { kfOffline } from '@/config/api.js';
import config from '@/config/index.js';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			config,
			missed_videocall_total: 0,
			h: 0,
			show: false,
			title: '提示',
			content: `您确定要退出应用吗？`
		};
	},
	computed: {
		// 推荐写法如下：
		...mapState({
			userInfo: state => state.userInfo // 模块化写法
		})
	},
	onLoad() {
		this.h = this.get_phone().h;
	},
	onShow() {
		this.init();
	},
	methods: {
		init() {
			// this.userInfo = uni.getStorageSync('userinfo') || {};
			this.missed_videocall_total =
				uni.getStorageSync('missed_videocall_total') || 0;
		},
		confirmLogout() {
			getApp().logoutTRTC();
			getApp().closeService();
			const userinfo = uni.getStorageSync('userinfo');
			const userId = userinfo?.user?.userId;
			kfOffline(userId)
				.then(res => {
					console.error('/qrcodeKf/logout-res :>> ', res);
					uni.showToast({
						title: '退出成功'
					});
					uni.removeStorageSync('token');
					uni.removeStorageSync('userinfo');
					uni.reLaunch({
						url: '/pages/login/login'
					});
				})
				.catch(err => {
					console.error(err);
				});
		},
		logout() {
			this.show = true;
		}
	}
};
</script>

<style lang="scss">
.my-container {
	.header {
		height: 284rpx;
		background: linear-gradient(309deg, #5694ff 0%, #326dfd 100%);
		border-radius: 0px 0px 16px 16px;
		padding-left: 46rpx;
		display: flex;
		align-items: flex-end;
		margin-bottom: 48rpx;

		&-box {
			// width: 340rpx;
			color: white;
			margin-bottom: 20rpx;

			image {
				width: 130rpx;
			}

			.user-name {
				font-size: 40rpx;
				color: #ffffff;
			}

			.user-tip {
				font-size: 24rpx;
				margin-bottom: 20rpx;
			}
		}
	}

	.content {
		.title {
			height: 90rpx;
			line-height: 90rpx;
			background: #ffffff;
			border-radius: 0px 0px 0px 0px;
			font-size: 28rpx;
			font-weight: 600;
			color: #4d4d66;
			padding: 0 48rpx;
			border-bottom: 0.5px solid #d8d8d8;
		}

		.list {
			&-item {
				position: relative;
				height: 65px;
				background: #ffffff;
				border-radius: 0px 0px 0px 0px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 48rpx;

				&::before {
					content: '';
					width: calc(100% - 48px);
					border-bottom: 0.5px solid #d8d8d8;
					position: absolute;
					bottom: 0px;
					right: 0;
				}

				&-left {
					image {
						width: 48rpx;
						margin-right: 12px;
					}
				}

				&-right {
					flex: 1;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 100px;
		left: 50%;
		right: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
}
</style>
