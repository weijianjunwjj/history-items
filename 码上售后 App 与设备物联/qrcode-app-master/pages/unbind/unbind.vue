<template>
	<view>
		<view class="search mt-2 white mb-2">
			<view class="pt-3 pb-3 pl-3 fs-16 black  bb-1">
				选择要解绑的设备（仅显示已绑码的设备）
			</view>

			<view class=" pt-2 pb-2 pl-3 pr-3 flex-c grey fs-13">
				<u-search
					v-model="searchVal"
					height="72"
					searchIconSize="44"
					shape="square"
					:showAction="true"
					actionText="搜索"
					placeholder="请输入设备序列号或自编码"
					@search="confirmTap"
					@custom="confirmTap"
					@clear="clearS"
				></u-search>
			</view>
		</view>

		<scroll-view
			scroll-y
			style="height:calc(100vh - 120px)"
			@scrolltolower="searchScrollLower"
			:scroll-top="scrollTop"
		>
			<view class="list-item flex-c just-sb" v-for="(item, index) of list">
				<view class="flex1 flex-sb">
					<view class="image mr-3">
						<u--image
							:showLoading="true"
							:src="item.deviceImage"
							width="120rpx"
							height="120rpx"
						></u--image>
					</view>
					<view class="info flex-v flex1">
						<template v-if="item.selfIdentity">
							<view class="fs-16 black mb-1 flex-c">
								<text class="fs-13 ">自编码：</text>
								<text>{{ item.selfIdentity }}</text>
							</view>
							<view class="fs-16 black mb-1 flex-c">
								<text class="fs-13 ">序列号：</text>
								<text>{{ item.sn }}</text>
							</view>
							<text class="fs-13 grey">{{ item.model }}</text>
						</template>
						<template v-else>
							<text class="fs-16 black mb-1">{{ item.sn }}</text>
							<text class="fs-13 grey">{{ item.model }}</text>
						</template>
					</view>
				</view>

				<button
					class="flex-vc center"
					style="width: 114rpx;"
					@click="handleUnbind(item)"
				>
					<image class="qrcode-img" src="/static/unbind2.png"></image>
					<text class="fs-13 mt-1 grey" style="font-weight: normal;">
						解绑设备
					</text>
				</button>
			</view>
		</scroll-view>

		<u-modal
			title="提示"
			:show="show"
			@confirm="confirmModal"
			@cancel="closeModal"
			ref="uModal"
			show-cancel-button
		>
			<view class="slot-content">
				<view class="mb-2">请输入"确认解绑"以解除绑定</view>

				<u--input
					placeholder="确认解绑"
					border="surround"
					v-model="confirmVal"
				></u--input>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { queryDevice, unbind, scanQrcode } from '@/config/api.js';
import Dialog from '@/wxcomponents/vant/dialog/dialog';

export default {
	data() {
		return {
			qrcode: {},
			list: [],
			pageNum: 1,
			pageSize: uni.pageSize,
			searchVal: '',
			confirmVal: '',
			show: false,
			scrollTop: 0,
			curId: 0,
			sn: '',
			modalData: {},
			asyncClose:true,
		};
	},
	onLoad() {
		this.query();
	},
	methods: {
		handleUnbind(item) {
			console.log('item', item);
			const { sn } = item;
			this.modalData = item;
			this.sn = sn;
			this.confirmVal = '';
			this.show = true;
		},
		closeModal() {
			this.show = false;
		},
		confirmModal() {
			const { sn } = this;
			const params = {
				deviceSn: sn,
				qrcodeId: this.modalData.qrcodeId
			};
			console.log(params);

			const val = this.confirmVal.replace(/\s*/g, '');

			console.log('val', val);

			if (val === '确认解绑') {
				unbind(params)
					.then(res => {
						console.log('res', res);
						uni.showToast({
							title: '解绑成功'
						});
						this.closeModal();
						this.searchVal = '';
						this.query(2);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				uni.showToast({
					title: '输入有误',
					icon: 'error'
				});
			}
		},
		clearS() {
			this.searchVal = '';
		},
		searchScrollLower: function() {
			if(this.total===this.list.length){
				return uni.showToast({
					title:'没有更多了~',
					icon:'none'
				})
			}
			let i = Number(this.pageNum);
			i++;
			this.pageNum = i;
			this.query(1);
		},
		query(type) {
			const searchVal = this.searchVal;
			uni.showLoading({
				title: '加载中~'
			});
			queryDevice({
				sn: searchVal,
				selfIdentity: searchVal,
				bindState: 1,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}).then(data => {
				console.log('data', data);
				const new_items = data.items;
				this.total=data.total
				if (type === 2) {
					this.list = [...new_items];
				} else {
					this.list = [...this.list, ...new_items];
				}
				uni.hideLoading();
			});
		},
		confirmTap() {
			console.log('confirmTap');
			this.pageNum = 1;
			this.query(2);
			this.scrollTop = 0;
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
}

.bb-1 {
	border-bottom: 1rpx solid #efefee;
}

.form-input {
	border-radius: 25px;
	margin-bottom: 0;
}

.searchBox {
	display: flex;
	align-items: center;
	width: 100%;
	border-radius: 50rpx;
	border: 1px solid #ececec;
	// height: 80rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
}

.form-input2 {
	flex: 1;
	box-sizing: border-box;
	padding-left: 20rpx;
	margin-right: 20rpx;
	font-size: 28rpx;
	height: 80rpx;
	background: #ffffff;
}

.list-item {
	padding: 18px 15px;
	background-color: #fff;
	margin-bottom: 20rpx;
}

.max-w {
	// max-width: 100rpx;
	word-break: break-all;
}

.qrcode {
	width: 60rpx;
	height: 60rpx;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	text-align: center;
	line-height: 60rpx;
}
.qrcode-img {
	width: 40rpx;
	height: 38rpx;
}

button::after {
	border: none;
}

button {
	background-color: transparent !important;
	padding: 0 !important;
	line-height: inherit;
	border-radius: 0;
}

::v-deep {
	.u-search__action {
		color: $theme;
		font-size: 30rpx;
	}
}
</style>
