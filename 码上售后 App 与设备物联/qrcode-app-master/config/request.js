// 此vm参数为页面的实例，可以通过它引用vuex中的变量

import _config from './index.js'

const {
	baseURL
} = _config

module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = baseURL; /* 根域名 */
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		config.custom = config.custom || {}
		config.custom.auth = config.custom.auth ?? true

		// console.log('config---',config);
		const token = uni.getStorageSync('token')
		if (config.custom.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			config.header.Authorization = 'Bearer ' + token
			if (!token) {
				uni.reLaunch({
					url: '/pages/login/login'
				});
				
				return Promise.reject(config)
			}
		}

		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data

		// 自定义参数
		const custom = response.config?.custom
		// console.error('interceptors-------response :>> ', response);
		// console.error('interceptors-------data :>> ', data);
		// console.log('custom :>> ', custom);
		
		if (response.statusCode !== 200 || data.code==500) {
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			// console.log('custom.toast :>> ', custom.toast);
			if (custom.toast !== false) {
				uni.$u.toast(data.msg)
			}
			return Promise.reject(data)
		}
		return data.data === undefined ? data : data.data
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}
