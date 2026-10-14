export const Express = {
  POST: '中国邮政',
  EMS: 'EMS',
  EYB: '电商标快',
  POSTB: '国内邮政小包 ',
  STO: '申通快递 ',
  YTO: '圆通快递 ',
  YUNDA: '韵达快递 ',
  DBKD: '德邦快递 ',
  ZTO: '中通快递 ',
  HTKY: '极兔快递 ',
  SF: '顺丰速运 ',
};

const getExpressImg=name=>{
  return `https://zyt-network.oss-cn-qingdao.aliyuncs.com/images/express-icon/${name}.png`
}

export const Express0 = {
  POST: {
    name: '中国邮政',
    img: getExpressImg('yz'),
  },
  EMS: {
    name: 'EMS',
    img:  getExpressImg('EMS'),
  },
  EYB: {
    name: '电商标快',
    img:  getExpressImg('EMS'),
  },
  POSTB: {
    name: '国内邮政小包',
    img:  getExpressImg('yz'),
  },
  STO: {
    name: '申通快递',
    img:  getExpressImg('st'),
  },
  YTO: {
    name: '圆通快递',
    img:  getExpressImg('yt'),
  },
  YUNDA: {
    name: '韵达快递',
    img:  getExpressImg('yd'),
  },
  DBKD: {
    name: '德邦快递',
    img:  getExpressImg('db'),
  },
  ZTO: {
    name: '中通快递',
    img:  getExpressImg('zt'),
  },
  HTKY: {
    name: '极兔快递',
    img:  getExpressImg('jt'),
  },
  SF: {
    name: '顺丰速运',
    img:  getExpressImg('sf'),
  },
};

export const ExpressImg = {
  POST:  getExpressImg('yz'),
  EMS: '/images/EMS.png',
  EYB: '/images/EMS.png',
  POSTB:  getExpressImg('yz'),
  STO: '/images/st.png',
  YTO: '/images/yt.png',
  YUNDA: '/images/yd.png',
  DBKD: '/images/db.png',
  ZTO: '/images/st.png',
  HTKY: '/images/jt.png',
  SF: '/images/sf.png',
};


// 已下单=>待取件=>已取件=>待支付=>已揽件=>运输中=>派送中=>已签收

export const getOrderStatusName = (orderStatus, logisticsStatus) => {
  if (logisticsStatus == 'CREATE' || logisticsStatus == null) {
    /*
	  进入订单状态
	  */
    if (orderStatus == 0) return '已下单';

    if (orderStatus == 1) return '待取件';

    if (orderStatus == -1 || orderStatus == -2) return '已取消';

    if (orderStatus == 4 || orderStatus == 5) return '已取件';

    return '待取件';
  } else {
    /*
	   进入物流状态
	  */

    if (logisticsStatus == 'ACCEPT') return '已揽件';

    if (logisticsStatus == 'DELIVERING') return '派送中';

    if (logisticsStatus == 'FAILED') return '包裹异常';

    if (logisticsStatus == 'REJECT') return '已拒签';

    if (logisticsStatus == 'AGENT_SIGN') return '待提货';

    if (logisticsStatus == 'SIGN') return '已签收';

    return '运输中';
  }
};
