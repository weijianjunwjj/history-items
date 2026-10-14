import axios from 'axios'

export function getUserInfoByWX(params: any) {
  return axios.get('/maapi/wechat/mp/userInfo', params)
}
export function WXBindSys(params: any) {
  return axios({
    method: 'get',
    url: '/maapi/wechat/mp/bind',
    params,
    headers: {
      enterpriseId: params.enterpriseId,
    },
  })
}
export function WXUnbindSys() {
  return axios.get('system/user/unbind/mp')
}

export function getWxLoginToken(randomKey: any) {
  return axios.get(`auth/refreshWxLoginToken/${randomKey}`)
}

export function loginByWx(params: any) {
  return axios({ method: 'post', url: `auth/wxlogin`, params })
}
