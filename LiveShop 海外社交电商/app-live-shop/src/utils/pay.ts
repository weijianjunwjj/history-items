import { paypalCapture, paypalCreate } from '@/service/order/order'
import { useUserStore } from '@/store'

export const paypal = (orderSn) => {
  uni.showLoading({
    title: 'loading...',
  })
  const hideLoading = () => {
    uni.hideLoading()
  }
  return new Promise(async (resolve, reject) => {
    const res: any = await paypalCreate({ orderSn })
    console.error('res--------', res)
    const payPalOrderId = res.data.payPalOrderId

    console.log('payPalOrderId', payPalOrderId)
    //订单对象，从服务器获取
    var orderInfo = {
      clientId: 'AbNK7ejgf7RHBRKsi2akaenZ1EuIJaX5GqN5XOLbzOq_Ns5Cbb83Ee9VK9P80sxc9ue8xVA7QBzZXB31', //客户端id
      orderId: payPalOrderId, //订单id
      userAction: 'continue', //  paynow/continue
      currency: 'USD', // 币种
      environment: 'sandbox', //运行环境 sandbox/live
    }
    console.error('orderInfo----------------', orderInfo)
    uni.getProvider({
      service: 'payment',
      success: function (res) {
        console.log('res---------------------', res)
        console.log(res.provider)
        const isPay = res.provider.includes('paypal')
        console.log('isPay', isPay)
        if (isPay) {
          setTimeout(() => {
            hideLoading()
          }, 2000)
          uni.requestPayment({
            provider: 'paypal',
            orderInfo: orderInfo,
            success: async function (res) {
              console.log('res--------requestPayment', res)
              console.log('准备调起支付paypal~~~')
              let rawdata = JSON.parse(res.rawdata)
              console.log('orderId：' + rawdata.orderId)
              uni.showLoading({
                title: 'pay...',
              })
              const res2: any = await paypalCapture({
                orderSn, //订单号
                payPalOrderId, //paypal订单号
              })
              uni.hideLoading()
              uni.navigateTo({
                url: '/pages/recharge-detail/recharge-detail?orderSn=' + orderSn,
              })
              const { updateUserInfo } = useUserInfo()
              updateUserInfo()
            },
            fail: function (err) {
              console.error('fail:------------------------------' + JSON.stringify(err))
              hideLoading()
            },
          })
        } else {
          uni.showToast({
            title: '抱歉，当前您的系统暂不支持使用Paypal支付。',
            icon: 'none',
          })
        }
      },
    })
  })
}
