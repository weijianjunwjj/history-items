const obj = {
  serviceName: '南京递吾件融网络科技有限公司',
  phone: '18624093456',
  type: '普通商户',
  appid: 'wxa5536764957a3376',
  merchantNum: '1651753489',
  childMerchantNum: '1651753489',
  childMerchantNumAppid: 'wxa5536764957a3376',
  area: '江苏',
  SubAccountConfig: '南京递吾件融网络科技有限公司',
  createAt: '2023-07-05 14:37:38',
}

const list0 = []
for (let index = 0; index < 35; index++) {
  const item = JSON.parse(JSON.stringify(obj))
  item.id = index
  list0.push(item)
}

export default [
  {
    url: '/api/merchantNum',
    method: 'get',
    response: (res = {}) => {
      let { pageNum = 1, pageSize = 10 } = res.query
      pageNum = +pageNum
      pageSize = +pageSize
      let total = list0.length
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      console.log('startIndex :>> ', startIndex)
      console.log('endIndex :>> ', endIndex)
      const list = list0.slice(startIndex, endIndex)
      // console.log('list :>> ', list)

      return {
        code: 0,
        message: 'ok',
        data: {
          list,
          total,
        },
      }
    },
  },
]
