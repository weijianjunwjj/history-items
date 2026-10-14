<script>
import TIM from 'tim-wx-sdk';
import { genTestUserSig } from './debug/GenerateTestUserSig.js';
import {
	debuggerModule,
	installDebugger
} from 'uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js';
import { weAtob } from './utils/weapp-jwt.js';
import { isLogin, diffTime2 } from './utils/index.js';
import {
	permision,
	clearIOSBadge,
	checkCallPermission,
	addWhiteList,
	moveToBack,
	checkAndroidPermission
} from '@/utils/native.js';
import config from '@/config/index.js';
import wakeLock from '@/js_sdk/kun-bgrun/WakeLock.js';

const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');
const TUICallingEvent = uni.requireNativePlugin('globalEvent');

export default {
	data() {
		return {
			music1: '/static/audio/facetimeMusic.mp3',
			music2: '/static/audio/slience.mp3',
			tim: {},
			platform: '',
			timUserId: '',
			autoLoginInterval: null,
			timer: null,
			loginCount: 0,
			loginSuccessCount: 0,
			loginFailCount: 0
		};
	},
	onLaunch() {
		const that = this;
		this.platform = uni.getSystemInfoSync().platform;

		uni.setStorageSync('platform', this.platform);
		// 如果已登录,需要初始化
		if (isLogin()) {
			// const userInfo = uni.getStorageSync('userinfo');
			// 重新获取用户信息，防止token失效
			uni.$u.http
				.get('/system/user/getInfo')
				.then(userInfo => {
					this.init(userInfo);
				})
				.catch(err => {
					console.error(err);
					uni.showModal({
						content: '登录过期,需要重新登录',
						showCancel: false,
						success(res) {
							that.logout()
								.then(() => {
									uni.reLaunch({
										url: '/pages/login/login'
									});
								})
								.catch(() => {
									uni.removeStorageSync('token');
									uni.reLaunch({
										url: '/pages/login/login'
									});
								});
						}
					});
				});
		}
		// 如果未登录,需要监听登录事件并初始化
		uni.$on('logined', function(userInfo) {
			that.init(userInfo);
		});

		const Reset = () => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		};
		// 定义会话id
		let userID = null;

		// 重点注意： 为了 uni-app 更好地接入使用 tim，快速定位和解决问题，请勿修改 uni.$TUIKit 命名。
		// 如果您已经接入 tim ，请将 uni.tim 修改为 uni.$TUIKit。
		const tim = TIM.create({
			SDKAppID: genTestUserSig('').sdkAppID
		});

		// #ifdef APP-PLUS
		uni.$TUIKit = tim;
		this.tim = tim;
		// 如果是dev模式,开启调试悬浮球
		// if (config.mode === 'dev') {
		// installDebugger({
		// 	enableRequestInterceptor: true, //默认为false，指示是否拦截网络请求，参见下一条
		// 	showGlobalFloatWindow: true //默认为true，指定是否添加一个全局的调试按钮，点击可跳转至窗口
		// });
		// }

		// uni.$TUIKit.on(tim.EVENT.SDK_READY, this.handleSDKReady);
		// uni.$TUIKit.on(tim.EVENT.SDK_NOT_READY, this.handleSDKNotReady);

		// 将原生插件挂载在 uni 上
		uni.$TUICallKit = TUICallKit;
		uni.$TUICallingEvent = TUICallingEvent;

		uni.$TUIKit.on(TIM.EVENT.KICKED_OUT, this.handleKickedOut);
		uni.$TUICallingEvent.addEventListener('onError', (code, msg) => {
			console.error('onError-----------------', code, msg);
		});

		uni.$TUICallingEvent.addEventListener('onCallReceived', data => {
			console.error('onCallReceived-----------', JSON.stringify(data));
			userID = data.callerId;
		});
		uni.$TUICallingEvent.addEventListener('onCallCancelled', res => {
			console.error('onCallCancelled-----------');
			console.error('onCallCancelled-----------', res);
			Reset();
		});

		uni.$TUICallingEvent.addEventListener('onUserLeave', res => {
			console.error('onUserLeave--------------', res);
		});

		uni.$TUICallingEvent.addEventListener('onUserLineBusy', res => {
			console.error('onUserLineBusy -----------', res);
		});

		uni.$TUICallingEvent.addEventListener('onCallBegin', res => {
			console.error('onCallBegin-----------', JSON.stringify(res));
			if (userID) {
				uni.reLaunch({ url: '/pages/device-info/device-info?userID=' + userID });
			} else {
				console.error('userID为空！');
			}
		});
		uni.$TUICallingEvent.addEventListener('onCallEnd', res => {
			console.error('onCallEnd-----------', JSON.stringify(res));
			Reset();
		});

		if (this.platform == 'android') {
			// 检查相机权限和麦克风权限
			this.checkCallPermission();
			// 添加白名单
			this.addWhiteList();
		}

		// #endif
	},

	methods: {
		addWhiteList,
		moveToBack,
		checkAndroidPermission,
		checkCallPermission,
		handleKickedOut(e) {
			console.error('handleKickedOut------------');
			console.log('e :>> ', e);
			this.logout().then(() => {
				uni.reLaunch({
					url: '/pages/login/login'
				});
				uni.showModal({
					showCancel: false,
					content: '您的账号已在其他设备登陆'
				});
			});
		},
		logout() {
			return new Promise((resolve, reject) => {
				this.logoutTRTC();
				this.closeService();
				const userinfo = uni.getStorageSync('userinfo');
				const userId = userinfo?.user?.userId;
				uni.$u.http
					.get(`/qrcode/qrcodeKf/logout/${userId}`)
					.then(res => {
						uni.removeStorageSync('token');
						uni.removeStorageSync('userinfo');
						resolve();
					})
					.catch(err => {
						console.error(err);
						reject();
					});
			});
		},
		async requestAndroidPermission(permisionID) {
			var result = await permision.requestAndroidPermission(permisionID);
			var strStatus;
			if (result == 1) {
				strStatus = '已获得授权';
			} else if (result == 0) {
				strStatus = '未获得授权';
			} else {
				strStatus = '被永久拒绝权限';
			}
		},
		async init(userInfo) {
			this.$store.commit('set_userInfo', userInfo);
			this.loginTRTC();
			if (uni.getSystemInfoSync().platform == 'android') {
				setTimeout(() => {
					this.checkAndroidPermission();
				}, 4000);
				this.moveToBack();
				wakeLock.wakeLock();
				// 每隔0.5h登录一下trtc,防止登录失效
				clearInterval(this.autoLoginInterval);
				this.autoLoginInterval = setInterval(() => {
					this.loginTRTC();
				}, 1000 * 60 * 30);
				// 监听网络状态,如果网路不佳,重启APP
				uni.onNetworkStatusChange(function(res) {
					console.error('网络信息：' + JSON.stringify(res));
					console.log('isConnected:', res.isConnected);
					console.log('networkType:', res.networkType);
					if (!res.isConnected) {
						uni.createPushMessage({
							title: '网络状态不佳',
							content: '自动重启中...',
							success() {
								plus.runtime.restart();
							}
						});
					}
				});
			}
			const userId = userInfo.user.userId;
			const terminal = this.platform
			uni.$u.http
				.get(`/qrcode/qrcodeKf/login/${userId}?terminal=${terminal}`)
				.then(res => {})
				.catch(err => {
					console.error(err);
				});
		},
		logoutTRTC() {
			return new Promise((resolve, reject) => {
				let flag = true;
				// IM 登出
				uni.$TUIKit?.logout();
				// 登出 原生插件
				uni.$TUICallKit?.logout(res => {
					console.log(res);
					console.error('uni.$TUICallKit?.logout');
					if (flag) {
						resolve(1);
						flag = false;
					}
				});

				setTimeout(() => {
					if (flag) {
						resolve(1);
						flag = false;
					}
				}, 500);
			});
		},
		async loginTRTC() {
			this.loginCount++;
			const loginDuration = ((this.loginCount - 1) * 30) / 60;

			// uni.setStorageSync('客服系统重新登录', this.loginCount);
			// uni.setStorageSync('登录时长', loginDuration + 'h');

			// uni.createPushMessage({
			// 	title: '客服系统重新登录' + this.loginCount,
			// 	content: `登录时长：${loginDuration}h`
			// });
			await this.logoutTRTC();
			const that = this;
			const token = uni.getStorageSync('token');
			const jwt = this.parseJwt(token);
			const userID = jwt.user_id.toString();
			const userSig = genTestUserSig(userID).userSig;
			// 登录 IM
			uni.$TUIKit?.login({
				userID,
				userSig
			});
			console.error('uni.$TUIKit.login');
			// 登录原生插件
			this.timUserId = userID;
			const params = {
				SDKAppID: genTestUserSig('').sdkAppID,
				userID,
				userSig: userSig
			};

			uni.$TUICallKit.login(params, res => {
				console.error('uni.$TUICallKit.login', res);
				uni.$TUICallKit.enableFloatWindow(true);
				if (res.code === 0) {
					console.log('login success');
					const { avatar, nickName } = this.$store.state.userInfo.user;
					const options = {
						nickName,
						avatar
					};
					console.log('options :>> ', options);
					uni.$TUICallKit.setSelfInfo(options, res => {
						console.log(res);
						if (res.code === 0) {
							console.error('setSelfInfo success----------------');
						} else {
							console.error(
								`setSelfInfo failed, error message = ${res.msg}`
							);
						}
					});
					uni.showToast({
						title: `客服系统连接成功`,
						icon: 'none'
					});
					// this.loginSuccessCount++;
					// uni.createPushMessage({
					// 	content: `客服系统连接成功` + this.loginSuccessCount
					// });
				} else {
					console.log(`login failed, error message = ${res.msg}`);
					uni.showToast({
						title: `客服系统连接失败！`,
						icon: 'fail'
					});
					// this.loginFailCount++;
					// uni.createPushMessage({
					// 	content: `客服系统连接失败` + this.loginFailCount
					// });
				}
			});

			if (this.platform == 'ios') {
				uni.getPushClientId({
					success: res => {
						let push_clientid = res.cid;
						uni.$u.http
							.get(
								`/system/user/profile/updateUserCid?cid=${push_clientid}`
							)
							.then(res => {})
							.catch(err => {
								console.error(err);
							});
					},
					fail(err) {
						console.log(err);
						uni.showToast({
							title: 'fail',
							content: 'fail'
						});
					}
				});
			}
		},
		closeService() {
			wakeLock.releaseWakeLock();
			clearInterval(this.autoLoginInterval);
		},
		parseJwt(token) {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace('-', '+').replace('_', '/');
			return JSON.parse(weAtob(base64));
		}
	},
	onUnhandledRejection: function(err) {
		if (debuggerModule) debuggerModule.addAppErr(err);
	},
	onError: function(err) {
		console.error(err);
		if (debuggerModule) debuggerModule.addAppErr(err);
	},
	onShow() {
		console.log('App Show');
	},
	onHide() {
		console.log('App Hide');

		if (this.platform === 'ios') {
			clearIOSBadge();
		}
	}
};
</script>

<style>
@import '@/wxcomponents/vant/common/index.wxss';
</style>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-ui/index.scss';
@import '@/assets/css/atom.css';
@import '@/assets/scss/index.scss';
body,
page {
	padding-top: var(–window-bottom) px;
}
</style>
