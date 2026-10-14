import App from './App'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import {
	debuggerModule
} from 'uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js'
import config from './config/index.js'
import {
	is
} from '@/utils/index.js';
import store from '@/store/index.js';



const errorHandler = (err, vm, info) => {
	if (debuggerModule){
		debuggerModule?.addVueError(err, vm, info);
	}
}

Vue.config.errorHandler = errorHandler;


Vue.config.productionTip = false
Vue.prototype.get_phone = function() {
	const phoneInfo = uni.getSystemInfoSync(); // 获取手机系统信息
	let statusBarObj = {
		h: 0 /* 状态栏默认高度 */
		//如果自己有需要其他属性的话，可以往这里添加
	}
	// 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
	statusBarObj.h = phoneInfo.statusBarHeight;
	return statusBarObj;
}


Vue.prototype.$url = config.baseURL
Vue.prototype.$is = is
Vue.prototype.$store = store
uni.$url = config.baseURL
uni.pageSize = config.pageSize



Vue.use(uView)

// 如此配置即可
uni.$u.config.unit = 'rpx'

App.mpType = 'app'
global.root = '全局的值';
const app = new Vue({
	...App
})


require('@/config/request.js')(app)
app.$mount()
