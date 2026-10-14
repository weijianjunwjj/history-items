<template>
	<view class="page-login">
		<view class="logo flex-vc">
			<image
				style="width: 200rpx;height: 200rpx;"
				src="../../static/logo.png"
			></image>
			<text class="mt-2">服务商登录</text>
		</view>

		<view class="main">
			<view class="form-box">
				<view class="form-title">服务商ID</view>
				<input
					v-model="form.enterpriseName"
					placeholder-class="textAreaHolder"
					class="form-input"
					placeholder="请输入服务商ID"
				/>

				<view class="form-title">账号</view>
				<input
					v-model="form.userName"
					placeholder-class="textAreaHolder"
					class="form-input"
					placeholder="请输入账号"
				/>

				<view class="form-title">密码</view>
				<input
					v-model="form.password"
					type="password"
					placeholder-class="textAreaHolder"
					class="form-input"
					placeholder="请输入密码"
				/>

				<view class="form-title">验证码</view>
				<view class="flex">
					<input
						v-model="form.code"
						placeholder-class="textAreaHolder"
						class="form-input"
						placeholder="请输入右侧结果"
					/>
					<image
						class="ml-4"
						bindtap="updateCode"
						style="width: 220rpx;height: 80rpx;"
						:src="`data:image/png;base64,${codeImg}`"
					></image>
				</view>
			</view>

			<u-button class="btn" type="primary" block @click="submit">登录</u-button>
		</view>
	</view>
</template>

<script>
import { getCode, login, getInfo } from '@/config/api.js';
export default {
	data() {
		return {
			form: {
				enterpriseName: '',
				userName: '',
				password: '',
				code: '',
				timer: null,
				uuid: ''
			},
			codeImg: ''
		};
	},
	onLoad() {
		const enterpriseName = uni.getStorageSync('enterpriseName');
		const userName = uni.getStorageSync('userName');
		const password = uni.getStorageSync('password');

		this.form = {
			...this.form,
			enterpriseName,
			userName,
			password
		};

		this.timer = setInterval(() => {
			if (this.codeImg === '') {
				this.updateCode();
			} else {
				clearInterval(this.timer);
			}
		}, 1000);

		// 1分钟后无论如何都要终止轮询
		setTimeout(() => {
			clearInterval(this.timer);
			if (this.codeImg === '') {
				uni.showModal({
					title: '提示',
					content: '请开启APP的网络权限'
				});
			}
		}, 1000 * 60);
	},
	onShow() {},
	methods: {
		validate() {
			const { code, password, userName, uuid, enterpriseName } = this.form;

			if (!enterpriseName) {
				uni.showToast({
					title: '请输入服务商ID',
					icon: 'none'
				});
				return;
			}
			if (!userName) {
				uni.showToast({
					title: '请输入账号',
					icon: 'none'
				});
				return;
			}
			if (!password) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return;
			}
			if (!code) {
				uni.showToast({
					title: '请输入右侧结果',
					icon: 'none'
				});
				return;
			}

			return true;
		},
		updateCode() {
			getCode()
				.then(res => {
					this.codeImg = res.img;
					this.form.uuid = res.uuid;
				})
				.catch(err => {
					console.error(err);
				});
		},

		submit() {
			console.log('submit');
			const validate = this.validate();
			console.log('validate', validate);
			if (!validate) {
				return;
			}
			let { code, password, userName, uuid, enterpriseName } = this.form;

			console.log('this.form', this.form);
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			login({
				code,
				enterpriseName,
				password,
				userName,
				uuid
			})
				.then(data => {
					uni.hideLoading();
					console.log('data :>> ', data);
					const token = data.access_token;
					uni.setStorageSync('token', token);
					uni.setStorageSync('userName', userName);

					getInfo().then(info => {
						console.log(info);
						uni.setStorageSync('userinfo', info);
						uni.$emit('logined', info);
						uni.showToast({
							title: '登录成功！',
							icon: 'success',
							duration: 1000,
							success: () => {
								uni.setStorageSync('enterpriseName', enterpriseName);
								uni.setStorageSync('userName', userName);
								uni.setStorageSync('password', password);
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}, 1000);
							}
						});
					});
				})
				.catch(err => {
					uni.hideLoading();
					console.error(err);
					this.updateCode();
				});
		}
	}
};
</script>

<style>
page {
	background: #fff;
}
</style>

<style lang="scss" scoped>
.logo {
	margin-top: 71px;

	& > text {
		font-size: 17px;
		font-weight: 500;
		color: #000000;
	}

	margin-bottom: 40px;
}
</style>
