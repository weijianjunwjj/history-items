const BASE_URI = {
	'development': 'https://api-dev.iotive.cn',
	'production': 'https://api.iotive.cn',
}


const modules={
	mode:'dev2',
	baseURL: '',
	version:'2.1.2',
	pageSize:20,
}

if(modules.mode==='dev'){
	modules.baseURL=BASE_URI.development
}else{
	modules.baseURL=BASE_URI.production
}


module.exports = modules
