<template>
	<view>
		<view class="header mt-2 white mb-2">
			<view class="pt-3 pb-3 pl-3 fs-16 black bb-1">扫描的二维码</view>

			<view class="pt-2 pb-2 pl-3 flex-c grey fs-13">
				<u--image
					:showLoading="true"
					:src="qrcode.filePath"
					width="120rpx"
					height="120rpx"
					class="mr-3"
				></u--image>

				<view>
					<view class="mb-1">
						<text>二维码编码：</text>
						<text>{{ qrcode.id }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="search mt-2 white mb-2">
			<view class="pt-3 pb-3 pl-3 fs-16 black  bb-1">
				选择关联设备（仅显示未绑码的设备）
			</view>

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

		<view class="list">
			<radio-group class="radio-group" @change="radioChange">
				<scroll-view
					scroll-y
					style="height:calc(100vh - 660rpx)"
					@scrolltolower="searchScrollLower"
					:scroll-top="scrollTop"
				>
					<view
						class="list-item flex-c"
						v-for="(item, index) of list"
						@click="radioChange2(item)"
					>
						<view class="mr-3">
							<radio
								class="radio"
								:checked="active == item.id"
								:value="item.id"
								color="#026FFE"
							></radio>
						</view>
						<view class="image mr-3">
							<u--image
								:showLoading="true"
								:src="item.deviceImage"
								width="120rpx"
								height="120rpx"
							></u--image>
						</view>
						<view class="info flex-v">
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
				</scroll-view>
			</radio-group>

			<u-button class="btn" type="primary" template @click="onbind">
				确认绑定
			</u-button>
		</view>
	</view>
</template>

<script>
import { queryDevice, bind } from '@/config/api.js';
export default {
	data() {
		return {
			active: '',
			qrcode: {},
			list: [],
			pageNum: 1,
			pageSize: 50,
			searchVal: '',
			show: false,
			scrollTop: 0,
			curId: 0,
			total:0
		};
	},
	onLoad({ result }) {
		try {
			console.log('result :>> ', result);
			let obj = decodeURIComponent(result);
			obj = JSON.parse(obj);
			this.qrcode = obj;
		} catch (error) {
			console.log(error);
		}

		this.query();
	},
	methods: {
		unique_obj_arr(arr, key) {
			const res = new Map();
			return arr.filter(arr => !res.has(arr[key]) && res.set(arr[key], 1));
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
				bindState: 2,
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}).then(data => {
				const new_items = JSON.parse(JSON.stringify(data.items));
				console.log('type :>> ', type);
				this.total=data.total
				let list = [];
				if (type === 2) {
					list = [...new_items];
				} else {
					list = [...this.list, ...new_items];
				}
				const newList = this.unique_obj_arr(list, 'id');
				console.log('newList :>> ', newList);
				this.list=newList
				uni.hideLoading();
			});
		},
		onbind() {
			console.log('绑定中');
			const target = this.list.find(item => item.id === this.active);
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
			this.active = '';
			this.query(2);
			this.scrollTop = 0;
		},
		radioChange(e) {
			console.log('e :>> ', e);
			this.radioChange0(e.detail.value);
		},
		radioChange0(id) {
			// const list = this.list;
			this.active = id;
			// for (let i = 0, len = list.length; i < len; ++i) {
			// 	list[i].checked = false;
			// 	// list[i].checked = list[i].id === id;
			// }
			// this.list = list;
		},
		radioChange2(e) {
			console.log(e);
			const { id } = e;
			this.radioChange0(id);
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

radio-group {
	radio {
		transform: scale(0.7);
	}
}

.btn {
	position: fixed;
	bottom: 20px;
	left: 0;
	right: 0;
	z-index: 19;
}

.list {
	margin-bottom: 50px;
}

::v-deep {
	.u-search__action {
		color: $theme;
		font-size: 30rpx;
	}

	.u-search__content__close {
		font-size: 44rpx !important;
	}
}
</style>
