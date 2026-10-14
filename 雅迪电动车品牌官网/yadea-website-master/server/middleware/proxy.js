/*
 * @Author: weijianjun
 * @Date: 2023-03-10 09:56:51
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-10 11:20:56
 * @FilePath: \yadea-website\server\middleware\apiProxy.js
 * @Description:
 *
 */
import env from '../../env/envData'

let { VITE_API_URL_JSON: BACKEND_URL, VITE_API_URL } = env

export default defineEventHandler(async e => {
  const req = e.node.req
  const url0 = req.url
  const proxyList = ['/api/queryShop']
  const isProxy = proxyList.every(item => url0.includes(item))
  console.log('req :>> ', req)
  console.log('url0 :>> ', url0)
  console.log('isProxy :>> ', isProxy)
  // console.log('req :>> ', req)

  if (isProxy) {
    const { method } = req
    const options = {}
    const { headers } = req
    options.headers = headers
    options.method = method
    if (method !== 'get' && method !== 'GET') {
      options.body = JSON.stringify(await readBody(e))
    }
    const url = url0
    const reqUrl = BACKEND_URL ? BACKEND_URL + url : VITE_API_URL + url
    // const noHttp = !url0.includes('http')
    // const reqUrl = noHttp ? (BACKEND_URL ? BACKEND_URL + url : VITE_API_URL + url) : url
    console.log('reqUrl :>> ', reqUrl)
    const resBody = await $fetch(reqUrl, options)
      .then(res => {
        // console.log('res :>> ', res)
        return res
      })
      .catch(err => {
        console.error(err)
        return err
        // return {
        //   code: '1',
        //   msg: '服务端错误',
        //   payload: null
        // }
      })
    return resBody
  }
})
