

export let view

export function isOpenPush() {
	var UIApplication = plus.ios.import("UIApplication");
	var app = UIApplication.sharedApplication();
	var enabledTypes = 0;
	if (app.currentUserNotificationSettings) {
		var settings = app.currentUserNotificationSettings();
		enabledTypes = settings.plusGetAttribute("types");
		console.log("enabledTypes1:" + enabledTypes);
		if (enabledTypes == 0) {
			plus.nativeUI.confirm("推送设置没有开启，是否去开启？", function(e) {
				if (e.index == 0) {
					var NSURL2 = plus.ios.import("NSURL");
					var setting2 = NSURL2.URLWithString("app-settings:");
					var application2 = UIApplication.sharedApplication();
					application2.openURL(setting2);
					plus.ios.deleteObject(setting2);
					plus.ios.deleteObject(NSURL2);
					plus.ios.deleteObject(application2);
				}
			}, {
				"buttons": ["确定", "取消"],
				"verticalAlign": "center"
			});
		}
		plus.ios.deleteObject(settings);
	} else {
		enabledTypes = app.enabledRemoteNotificationTypes();
		if (enabledTypes == 0) {
			console.log("推送未开启!");
		} else {
			console.log("已经开启推送功能!")
		}
		console.log("enabledTypes2:" + enabledTypes);
	}
	plus.ios.deleteObject(app);
}







export function checkLocationPermission(platform) {
	const is_ios = platform == 'ios'
	if (is_ios) {
		var cllocationManger = plus.ios.import('CLLocationManager');
		var enable = cllocationManger.locationServicesEnabled();
		var status = cllocationManger.authorizationStatus();
		plus.ios.deleteObject(cllocationManger);
		if (enable && status != 2) {
			console.log('手机系统的定位已经打开');
		} else {
			console.log('手机系统的定位没有打开');
			console.log(`pow-locationRes- 缺少位置权限`);
			uni.showModal({
				title: '提示',
				content: '请前往设置-隐私-定位服务打开定位服务功能',
				showCancel: false, // 不显示取消按钮
				success() {
					var UIApplication = plus.ios.import('UIApplication');
					var application2 = UIApplication.sharedApplication();
					var NSURL2 = plus.ios.import('NSURL');
					var setting2 = NSURL2.URLWithString('app-settings:');
					application2.openURL(setting2);
					plus.ios.deleteObject(setting2);
					plus.ios.deleteObject(NSURL2);
					plus.ios.deleteObject(application2);
				}
			});
		}
	} else {
		var context = plus.android.importClass('android.content.Context');
		var locationManager = plus.android.importClass('android.location.LocationManager');
		var main = plus.android.runtimeMainActivity();
		var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
		if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
			uni.showModal({
				title: '提示',
				content: '请打开定位服务功能',
				showCancel: false, // 不显示取消按钮
				success() {
					if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
						var Intent = plus.android.importClass('android.content.Intent');
						var Settings = plus.android.importClass('android.provider.Settings');
						var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
						main.startActivity(intent); // 打开系统设置GPS服务页面
					} else {
						console.log('GPS功能已开启');
					}
				}
			});
		}
	}


}

