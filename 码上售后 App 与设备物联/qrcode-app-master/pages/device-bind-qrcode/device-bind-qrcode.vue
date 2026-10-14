<template>
	<view>
		<view class="search mt-2 white mb-2">
			<view class="pt-3 pb-3 pl-3 fs-16 black  bb-1">选择关联设备</view>

			<view class=" pt-2 pb-2 pl-3 pr-3 flex-c grey fs-13">
				<u-search
					ref="mySearch"
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
			<view
				class="list-item flex-c just-sb"
				v-for="(item, index) of list"
			>
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
					@click="handleScan(item)"
					v-if="!item.qrcodeId"
				>
					<image class="qrcode-img" src="/static/scan.png"></image>
					<text class="fs-13 mt-1" style="color: #026FFF;font-weight: normal;">
						扫码绑定
					</text>
				</button>

				<button class="flex-vc center" style="width: 114rpx;" v-else>
					<image class="qrcode-img" src="/static/bind-code.png"></image>
					<text
						class="fs-13 mt-1 grey"
						style="color: #a2a2a2;font-weight: normal;"
					>
						已绑码
					</text>
				</button>
			</view>
		</scroll-view>

		<van-dialog id="van-dialog" />

	</view>
</template>

<script>
import { queryDevice, bind, scanQrcode } from '@/config/api.js';
import Dialog from '@/wxcomponents/vant/dialog/dialog';

export default {
	data() {
		return {
			qrcode: {},
			list: [],
			pageNum: 1,
			pageSize: uni.pageSize,
			searchVal: '',
			show: false,
			scrollTop: 0,
			curId: 0,
			sn: '',
			modalData: {}
		};
	},
	onLoad() {
		this.query();
	},
	onReady() {
			const search=this.$refs.mySearch
			console.log('search :>> ', search);
			// setInterval(()=>{
			// 	search.getFocus()
			// },500)
	},
	methods: {
		handleScan(item) {
			console.log('item', item);
			const { sn } = item;
			const that = this;
			uni.scanCode({
				success: function(res) {
					console.error(res);
					if (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);

						console.log('2-wx.scanCode---');
						const url = res.result;
						console.log('url :>> ', url);
						scanQrcode(url)
							.then(data => {
								console.log('3-$api.scanQrcode-data', data);

								if (!data) {
									setTimeout(() => {
										uni.showToast({
											title: '二维码无效',
											icon: 'error',
											mask: true
										});
									}, 200);
									return;
								}
								if (data.deviceSn) {
									setTimeout(function() {
										uni.showToast({
											title: '二维码已绑定',
											icon: 'error',
											mask: true
										});
									}, 200);
									return;
								}

								that.sn = sn;
								that.modalData = data;
								Dialog.confirm({
									title: '您确定要绑码吗？',
									message: '二维码编号：'+data.id
								})
									.then(() => {
										// on confirm
										that.confirmModal();
									})
									.catch(() => {
										// on cancel
										that.closeModal();
									});
							})
							.catch(err => {
								console.error(err);
							});
					}
				}
			});
		},
		closeModal() {
			Dialog.close();
		},
		confirmModal() {
			console.log('绑定中');
			const sn = this.sn;
			console.log('sn :>> ', sn);
			console.log('this.modalData :>> ', this.modalData);
			const params = {
				deviceSn: sn,
				qrcodeId: this.modalData.id
			};
			console.log('params :>> ', params);
			bind(params)
				.then(res => {
					console.log('res', res);
					uni.showToast({
						title: '绑定成功'
					});
					setTimeout(() => {
						this.closeModal();
						this.searchVal = '';
						this.confirmTap()
					}, 1500);
				})
				.catch(err => {
					console.log(err);
				});
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
			this.show = true;
			const searchVal = this.searchVal;
			uni.showLoading({
				title: '加载中~'
			});
			queryDevice({
				sn: searchVal,
				selfIdentity: searchVal,
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
		onbind() {
			console.log('绑定中');
			const target = this.list.find(item => item.checked);
			if (!target) {
				return uni.showToast({
					title: '请选择要绑定的设备',
					icon: 'none'
				});
			}
			const { id, sn } = target;
			const params = {
				deviceSn: sn,
				qrcodeId: this.qrcode.id
			};
			console.log(params);
			bind(params)
				.then(res => {
					console.log('res', res);
					uni.showToast({
						title: '绑定成功'
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/scan-code-bind-device/scan-code-bind-device'
						});
					}, 1000);
				})
				.catch(err => {
					console.log(err);
				});
		},
		confirmTap() {
			console.log('confirmTap');
			this.pageNum = 1;
			this.query(2);
			this.scrollTop = 0;
		},
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
