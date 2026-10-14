import permision from "@/js_sdk/wa-permission/permission.js"

export function create_global_ball() {
	if (plus && plus.nativeObj) {
		let page = {},
			onType = false
		view = new plus.nativeObj.View('HF', {
			bottom: '0px',
			left: '60%',
			height: '40px',
			width: '40px',
		});
		view.drawRect({
			color: '#CACACA',
			radius: '20px'
		}, {
			top: '0px',
			left: '0px',
			width: '100%',
			height: '100%'
		});
		view.drawText('设备', {
			top: '0px',
			left: '0px',
			width: '100%',
			height: '100%'
		}, {
			size: '16px',
			color: '#000'
		});
		view.addEventListener("touchstart", (touch) => {
			page = touch
		})
		view.addEventListener("touchmove", (touch) => {
			if ((touch.pageY - 20 > 0 && touch.pageX - 50 > 0) &&
				(Math.abs(touch.pageX - page.pageX) > 20 ||
					Math.abs(touch.pageY - page.pageY) > 20)) {
				view.setStyle({
					top: (touch.pageY - 20) + 'px',
					left: (touch.pageX - 50) + 'px'
				})
				onType = true
			} else {
				onType = false
			}
		})
		view.addEventListener("click", (e) => {
			uni.createPushMessage({
				content: '手动登录trtc'
			})
			getApp().loginTRTC()
		})
		view.setStyle({
			top: '300px',
			left: '0px'
		})
	} else {
		console.warn('IMDebuggerWindow: 当前环境不支持添加全局悬浮窗，您需要手动开启调试窗口');
	}
}


export function clearIOSBadge() {
	if (plus.os.name.toLowerCase() == 'ios') {
		//导入ios UIApplication  
		var UIApplication = plus.ios.import("UIApplication");
		var app = UIApplication.sharedApplication();
		//获取应用图标的数量  
		// var oldNum = app.applicationIconBadgeNumber();  
		// var newNum = oldNum - 1;  
		//设置应用图标的数量  
		plus.runtime.setBadgeNumber(0);
		//导入个推原生类  
		var GeTuiSdk = plus.ios.importClass('GeTuiSdk');
		GeTuiSdk.setBadge(0);
	}
}



export function checkCallPermission() {
	switch (uni.getSystemInfoSync().platform) {

		case 'android':

			permision.requestAndroidPermission("android.permission.RECORD_AUDIO")

			permision.requestAndroidPermission("android.permission.CAMERA")

			break;

		case 'ios':

			permision.judgeIosPermission("record")

			permision.judgeIosPermission("camera")

			break;

	}
}




export function addWhiteList() {
	// 白名单
	var main = plus.android.runtimeMainActivity();
	var packName = main.getPackageName();
	var Context = plus.android.importClass('android.content.Context');
	var PowerManager = plus.android.importClass('android.os.PowerManager');
	// 获取电源类
	var pm = main.getSystemService(Context.POWER_SERVICE);
	const isWhiteList = pm.isIgnoringBatteryOptimizations(packName);
	console.error('是否在白名单-------------------------------：', isWhiteList); //是否白名单
	uni.setStorageSync('是否在白名单', isWhiteList);

	if (!isWhiteList) {
		try {
			var Uri = plus.android.importClass('android.net.Uri');
			console.log('Uri :>> ', Uri);
			var Settings = plus.android.importClass('android.provider.Settings');
			console.log('Settings :>> ', Settings);
			var packageURI = Uri.parse('package:' + packName);
			console.log('packageURI :>> ', packageURI);
			var intents = plus.android.newObject(
				'android.content.Intent',
				Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
				packageURI
			); // 电池
			console.log('intents :>> ', intents);
			main.startActivity(intents);
		} catch (e) {
			console.error(e);
			uni.showModal({
				content: '调起白名单失败',
				icon: 'fail',
			})
			console.error('电池白名单-调起失败')
		}
	}
}
export function moveToBack() {
	// 隐藏“再按一次退出应用”的提示，将应用隐藏至后台
	let main = plus.android.runtimeMainActivity();
	plus.runtime.quit = function() {
		main.moveTaskToBack(false);
	};
	//重写提示：如果提示为 ‘再按一次退出应用’ 就隐藏应用，其他提示正常显示
	plus.nativeUI.toast = function(str) {
		if (str == '再按一次退出应用') {
			main.moveTaskToBack(false);
			return false;
		} else {
			uni.showToast({
				title: str,
				icon: 'none'
			});
		}
	};
}



export function checkAndroidPermission() {
	var main = plus.android.runtimeMainActivity();
	var NotificationManagerCompat = plus.android.importClass(
		'android.support.v4.app.NotificationManagerCompat'
	);
	var Intent = plus.android.importClass('android.content.Intent');
	var Context = plus.android.importClass('android.content.Context');
	if (NotificationManagerCompat == null) {
		NotificationManagerCompat = plus.android.importClass(
			'androidx.core.app.NotificationManagerCompat'
		);
	}
	var areNotificationsEnabled = NotificationManagerCompat.from(
		main
	).areNotificationsEnabled();
	var Settings = plus.android.importClass('android.provider.Settings');
	// APP是否开启了悬浮窗
	const canDrawOverlays = Settings.canDrawOverlays(main);
	const appName = '[码上售后]';
	let isPass = false;
	if (!canDrawOverlays) {
		uni.showModal({
			title: '提示',
			content: `为了接听电话，请先打开${appName}悬浮窗权限`,
			showCancel: false,
			success: function(res) {
				console.log(res);
				if (res.confirm) {
					let intent = new Intent();
					intent.setAction(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
					// 跳转到应用的弹窗开启列表
					main.startActivity(intent);
				}
			}
		});
	}
	// 如果悬浮窗权限开启了,执行后续代码
	if (!canDrawOverlays) return;

	// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
	if (!areNotificationsEnabled) {
		uni.showModal({
			title: '提示',
			content: `为了收到通知，请先打开${appName}通知权限`,
			showCancel: false,
			success: function(res) {
				if (res.confirm) {
					var Build = plus.android.importClass('android.os.Build'); //android 8.0已经android8以上版本引导
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute('uid');
					const SDK_INT = Build.VERSION.SDK_INT;

					if (SDK_INT >= 26) {
						var intent = new Intent(
							'android.settings.APP_NOTIFICATION_SETTINGS'
						);
						intent.putExtra(
							'android.provider.extra.APP_PACKAGE',
							pkName
						);
					} else if (Build.VERSION.SDK_INT >= 21) {
						//android 5.0-7.0
						var intent = new Intent(
							'android.settings.APP_NOTIFICATION_SETTINGS'
						);
						intent.putExtra('app_package', pkName);
						intent.putExtra('app_uid', uid);
					} else {
						//(<21)其他--跳转到该应用管理的详情页
						var Settings = plus.android.importClass(
							'android.provider.Settings'
						);
						var Uri = plus.android.importClass('android.net.Uri');
						var intent = new Intent();
						intent.setAction(
							Settings.ACTION_APPLICATION_DETAILS_SETTINGS
						);
						var uri = Uri.fromParts(
							'package',
							main.getPackageName(),
							null
						);
						intent.setData(uri);
					}
					// 跳转到该应用的系统通知设置页
					main.startActivity(intent);
				}
			}
		});
	}
}
