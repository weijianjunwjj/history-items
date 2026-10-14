
var g_wakelock = null;  
//允许程序后台运行，以持续获取GPS位置  
function wakeLock() {  
    //Android  
    var main = plus.android.runtimeMainActivity();  
    var Context = plus.android.importClass("android.content.Context");  
    var PowerManager = plus.android.importClass("android.os.PowerManager");  
    var pm = main.getSystemService(Context.POWER_SERVICE);  
    g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");  
    g_wakelock.acquire();  
	console.error('开启g_wakelock.acquire()');
}  

//结束程序后台运行  
function releaseWakeLock() {  
    if(g_wakelock != null && g_wakelock.isHeld()) {  
        g_wakelock.release();  
        g_wakelock = null;  
    }  
}  
module.exports={
	wakeLock:wakeLock,
	releaseWakeLock:releaseWakeLock
}