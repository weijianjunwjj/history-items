export function callphone(userPhone) {
	uni.makePhoneCall({
		phoneNumber: userPhone //仅为示例 this.servicePhone是你要拨打的电话号码
	});
}

export function toCreateWorkOrder(item) {
	console.log('toCreateWorkOrder');
	const deviceInfo = JSON.stringify(item)
	uni.navigateTo({
		url: '/pages/create-work-order/create-work-order?deviceInfo=' + deviceInfo
	})
}


export function workOrderJump(item) {
	const ticketState = Number(item.ticketState)
	const workOrderInfo = JSON.stringify(item)
	console.log('item :>> ', item);
	console.log('ticketState :>> ', ticketState);
	switch (ticketState) {
		case 1:
			uni.navigateTo({
				url: '/pages/work-order-assignment/work-order-assignment?workOrderInfo=' + workOrderInfo
			})
			break;
		case 2:
			uni.navigateTo({
				url: '/pages/processing-results/processing-results?workOrderInfo=' + workOrderInfo
			})
			break;
		case 3:
			uni.navigateTo({
				url: '/pages/work-order-detail/work-order-detail?workOrderInfo=' + workOrderInfo
			})
			break;
		default:
			break;
	}


}
