<template>
	<view>
		<header class="pl-3 pr-3 white mtb-2">
			<my-title title="扫描二维码" />

			<div class="btn">
				<u-button type="primary" block @click="onScan">扫描设备二维码</u-button>
			</div>
		</header>

		<main>
			<div
				class="main-header p-3  txt-3 fs-16 bold white"
				style="padding-bottom:1px"
			>
				近期绑定记录
				<div class="div-border mt-3"></div>
			</div>

			<scroll-list ref="list" :option="option" @load="loadmore" @refresh="refresh">
				<view class="u-list def-bg">
					<view
						v-for="(item, index) in list"
						:key="index"
						class="u-list-item flex-c mb-2 ptb-4 plr-3 white"
					>
						<div class="flex-c">
							<u--image
								:showLoading="true"
								:src="item.deviceImage"
								width="80px"
								height="80px"
							></u--image>
							<div class="ml-4 txt-1">
								<div class="fs-16 txt-1">{{ item.sn }}</div>
								<div class="fs-13 mt-3 txt-2">{{ item.productName }}</div>
								<div class="fs-13 mt-3 txt-2">
									绑定时间：{{ item.bindTime }}
								</div>
							</div>
						</div>
					</view>
				</view>
			</scroll-list>
		</main>
	</view>
</template>

<script>
import { getRecentBindDevice,scanQrcode } from '@/config/api';

export default {
	data() {
		return {
			option: {
				size: 0,
				page: 1,
				auto: false
			},
			list: [],
			total: 0,
			pageNum: 0,
			pageSize:uni.pageSize
		};
	},
	created() {
		this.loadmore();
	},

	methods: {
		refresh() {
			this.pageNum = 1;
			this.getRecentBindDevice('refresh')
				.then(data => {
					this.$refs.list.refreshSuccess(data);
				})
				.catch(err => {
					this.$refs.list.refreshFail();
				});
		},
		loadmore(type) {
			console.log('loadmore---------------------');
			this.pageNum = ~~this.pageNum + 1;
			this.getRecentBindDevice()
				.then(data => {
					this.$refs.list.loadSuccess(data);
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.errMsg || '请求失败',
						icon: 'error'
					});
					this.$refs.list.loadFail();
				});
		},
		getRecentBindDevice(type) {
			return new Promise((resolve, reject) => {
				const { pageSize, pageNum } = this;
				getRecentBindDevice({
					pageSize,
					pageNum
				})
					.then(res => {
						console.error('res------------- :>> ', res);
						const { records, total } = res;
						if (type === 'refresh') {
							this.list = records;
						} else {
							this.list = [...this.list, ...records];
						}
						resolve({ list: this.list, total });
					})
					.catch(err => {
						console.error(err);
						reject(err);
					});
			});
		},
		onScan() {
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
								const obj = JSON.stringify(data);
								uni.navigateTo({
									url:
										'/pages/scan-code-bind-device-detail/scan-code-bind-device-detail?result=' +
										encodeURIComponent(obj)
								});
							})
							.catch(err => {
								console.error(err);
							});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.u-list {
	height: calc(100vh - 270rpx) !important;
}
.btn {
	padding: 44rpx 0;
}
</style>
