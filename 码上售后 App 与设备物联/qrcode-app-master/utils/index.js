import moment from 'moment';
var momentDurationFormatSetup = require('moment-duration-format');

export function isLogin() {
	return !!uni.getStorageSync('token');
}

/**
 * @description: 数据类型的检测的方式
 * @param {any} data 要检测数据类型的变量
 * @param {string} type 具体的类型名称【小写】
 */
export const is = (type, data) => {
	return (
		Object.prototype.toString
		.call(data)
		.replace(/\[object (\w+)\]/, '$1')
		.toLowerCase() === type
	);
};

export const none = val => {
	const isNone = _val => [null, undefined].includes(_val);
	if (is('array', val)) {
		return val.some(item => isNone(item));
	}
	return isNone(val);
};

// 格式化时间戳
export function formatTime(value) {
	if (value) {
		let date = new Date(value); // 时间戳为秒：10位数
		let year = date.getFullYear();
		let month =
			date.getMonth() + 1 < 10 ?
			`0${date.getMonth() + 1}` :
			date.getMonth() + 1;
		let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
		let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
		let minute =
			date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
		let second =
			date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	} else {
		return '';
	}
}

// 两时间差
export const diffTime = (startTime, endTime) => {
	momentDurationFormatSetup(moment);
	if (none([startTime, endTime])) {
		return '--';
	}
	const seconds = moment(endTime).diff(moment(startTime), 'seconds');
	return moment
		.duration(seconds, 'seconds')
		.format('HH:mm:ss', {
			trim: false
		});
};

// 两时间差
export const diffTime2 = (startTime, endTime) => {
	momentDurationFormatSetup(moment);
	if (none([startTime, endTime])) {
		return '--';
	}
	const seconds = moment(endTime).diff(moment(startTime), 'seconds');

	return formatSeconds(seconds)
};



// 获取等待时长 
export const getAnswerTime = (record) => {
	if (record.state !== -1 && record.answerTime) {
		// 已接电话
		return diffTime2(record.answerTime, record.finishTime)
	} else if (record.state === -1) {
		// 未接电话
		return diffTime2(record.createTime, record.updateTime)
	} else {
		return '---'
	}
}

//秒数转化为时分秒
export function formatSeconds(value) {
	var secondTime = parseInt(value); // 秒
	var minuteTime = 0; // 分
	var hourTime = 0; // 小时
	if (secondTime > 60) {
		//如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60);
		//获取秒数，秒数取余，得到整数秒数
		secondTime = parseInt(secondTime % 60);
		//如果分钟大于60，将分钟转换成小时
		if (minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60);
			//获取小时后取余的分，获取分钟除以60取余的分
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = '' + parseInt(secondTime) + '秒';

	if (minuteTime > 0) {
		result = '' + parseInt(minuteTime) + '分' + result;
	}
	if (hourTime > 0) {
		result = '' + parseInt(hourTime) + '时' + result;
	}
	return result;
}



export function getTicketType(item, workTicketTypeList) {
	const ticketType =
		workTicketTypeList.find(_ => _.id === item.ticketTypeId)
		?.ticketType || '设备故障';

	return ticketType;
}
