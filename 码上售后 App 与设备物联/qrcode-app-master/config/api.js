const http = uni.$u.http;

// post请求，获取菜单
// export const postMenu = (params, config = {}) => http.post('/ebapi/public_api/index', params, config)

// get请求，获取菜单，注意：get请求的配置等，都在第二个参数中，详见前面解释
export const getCode = () =>
	http.get('/code', {
		custom: {
			auth: false,
		},
	});

export const login = data =>
	http.post('/auth/login', data, {
		custom: {
			auth: false,
		},
	});

export const getInfo = config => http.get('/system/user/getInfo');

export const kfOffline = userId => http.get(`/qrcode/qrcodeKf/logout/${userId}`);
// 通话模块
export const getMissedRecord = params =>
	http.get('/qrcode/deviceFacetimeRecord/getMissedRecord', {
		params,
	});

export const getFaceTimeInfoList = data =>
	http.post('/qrcode/deviceFacetimeRecord/getFaceTimeInfoList', data, {
		headers: {
			'Content-Type': 'application/json', // 如果写成contentType会报错
		},
	});
export const getVideoCallRecord = params =>
	http.get('/qrcode/deviceFacetimeRecord/list', {
		params
	});

export const getUnfinishWorkorderList = params =>
	http.get('/qrcode/work-ticket/list', {
		params: {
			...params,
			ticketState: 2
		},
	});


export const getWorkorderList = params =>
	http.get('/qrcode/work-ticket/list', {
		params,
	});



export const getRecentBindDevice = params =>
	http.get('/qrcode/device/getRecentBindDevice', {
		params,
	});

// 清除未接来电
export const clearMissedRecord = params =>
	http.get('/qrcode/deviceFacetimeRecord/clearMissedRecord', {
		params,
	});

// 获取工单类型列表
export const getWorkTicketTypeList = data =>
	http.post('/qrcode/workTicketType/list', data);

// 查询工程师列表
export function getEngineerList() {
	return http.get('/system/user/listByRoleCode?roleCode=engineer')
}

// 新增工单
export const addWorkTicket = data =>
	http.post('/qrcode/work-ticket/add', data);

// 派发工单
export const dispatchWorkTicket = data =>
	http.post('/qrcode/work-ticket/dispatch', data);


// 关闭工单
export const closeWorkTicket = data =>
	http.post('/qrcode/work-ticket/close', data);

// 获取工单
export const getWorkTicket = id =>
	http.get(`/qrcode/work-ticket/get/${id}`);

// 更新通话解决问题状态
export const resolvedProblemStatus = data =>
	http.post('/qrcode/deviceFacetimeRecord/resolved', data);


export const queryDevice = (params) => http.get('/qrcode/device/query', {
	params
})

export const unbind = data => http.post('/qrcode/qrcode/unbind', data)
export const bind = data => http.post('/qrcode/qrcode/bind', data)

// 扫描二维码
export const scanQrcode = (url) => http.get(`/qrcode/qrcode/byUrl`, {
	params: {
		url
	}
})

// 上传
export const upload = (files, config) => http.upload('/file/upload', {
	params: {},
	/* 会加在url上 */
	files, // 需要上传的文件列表。使用 files 时，filePath 和 name 不生效。App、H5（ 2.6.15+）
	// 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
	custom: {
		auth: true
	}, // 可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
	name: 'file', // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
	timeout: 60000, // H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)
	/* 会与全局header合并，如有同名属性，局部覆盖全局 */
	header: {
		Authorization: uni.getStorageSync('token') ?
			'Bearer ' + uni.getStorageSync('token') : ''
	},
	// HTTP 请求中其他额外的 form data
	formData: {
		folder: config.folder || 'workticket/files/$day'
	},
	// 返回当前请求的task, options。请勿在此处修改options。非必填
	getTask: (task, options) => {
		task.onProgressUpdate((res) => {
			console.log('上传进度' + res.progress);
			console.log('已经上传的数据长度' + res.totalBytesSent);
			console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

			// 测试条件，取消上传任务。
			// if (res.progress > 50) {
			//   uploadTask.abort();
			// }
		});
	},

})
