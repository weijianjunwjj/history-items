// 订单状态 1待收货 2已完成 3已退款 4退款申请 5已拒绝 6待付款 7已支付 8待发货 9售后

export const orderStatusObj = {
	6: 'Pending',
	8: 'Pending',
	1: 'Pending',
	2: 'Finished',
	3: 'Completed',
	4: 'Servicing',
	5: 'Rejected',
}

export const orderDescEnglish = {
	1: 'Order is about to be completed,ready for pickup.',
	2: 'Order completed,thank you for using our service.',
	3: 'Order refund has been completed.',
	4: 'refund application',
	5: 'refund request not approved.',
	6: '',
	7: 'Arranging pickup with the logistics company.',
	8: 'In the process of notifying logistics for collection.'
}

export const orderStatusArray = [
	{ key: 6, value: 'To Pay' },
	{ key: 8, value: 'To Ship' },
	{ key: 1, value: 'Shipped' },
	{ key: 2, value: 'Finished' },
	{ key: 9, value: 'Returns' }
];

export const orderStatusEnglish = {
	1: 'Pending Shipment',
	2: 'Finished',
	3: 'Returned',
	4: 'Refund Application ',
	5: 'Rejected',
	6: 'Pending Payment',
	// 7: 'Paid',
  7: 'pending shipment',
	8: 'Pending Delivery',
	0: 'Pending Payment',
}

export const getStatusImageUrl = (status: number) => {
  const statusMap = {
    1: 'pending',
    2: 'pending',
    3: 'subtract',
    4: 'subtract',
    5: 'rejected',
    6: 'pending-pay',
    7: 'pending',
    8: 'pending-shipment',
    default: 'pending-pay',
  }

  const imgId = statusMap[status] || statusMap.default

  return `/static/images/order/icon/${imgId}.svg`
}
