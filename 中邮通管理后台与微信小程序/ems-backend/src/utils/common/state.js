import wxPayScore from '../../assets/images/wx-pay-score.png'
import wxPay from '../../assets/images/wx-pay.png'

export const states = ['全部', '待取件', '已取件', '运输中', '已签收', '已取消', '待支付']

export const menuType = {
  0: '目录',
  1: '菜单',
  2: '按钮',
  3: '其他',
}

export const settlementStatus = {
  0: '全部',
  1: '已出账',
  2: '未出账',
}

export const paymentStatus = {
  0: '全部',
  1: '已付款',
  2: '未付款',
}

export const orderStatus = {
  0: '全部',
  1: '已下单',
  2: '已揽件',
  7: '已取消',
}
export const logisticsStatus = {
  0: '全部',
  5: '运输中',
  6: '已签收',
}

export const mchType = {
  0: '普通商户',
  1: '特约商户',
}

export const colors = {
  unresolvedRed: '#F5222D',
  resolvedGreen: '#52C41A',
  已下单: '#1777FF',
  已取件: '#FBAC14',
  待支付: '#19C2C3',
  已支付: '#BFBFBF',
  运输中: '#1777FF',
  已签收: '#52C41A',
  已取消: '#BFBFBF',
}

export const getUnpayColor = (day) => {
  if (day == 0) {
    return {
      type: 'success',
      color: '#00BB88',
      bgc: '#00C08B',
    }
  }
  if (day >= 1 && day <= 2) {
    return {
      type: 'warning',
      color: '#FFAC00',
      bgc: '#FFB800',
    }
  }
  if (day >= 3) {
    return {
      type: 'error',
      color: '#FF4B1F',
      bgc: '#FF5A32',
    }
  }
  return {
    type: 'info',
    color: '#000',
    bgc: '#fff',
  }
}

export const timeSel = [
  { label: '揽收时间', value: 2 },
  { label: '下单时间', value: 0 },
  { label: '出账时间', value: 1 },
]

export const payTypes = {
  0: wxPay,
  1: wxPayScore,
}



export const commonPageSize = 20
