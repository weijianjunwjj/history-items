import { request } from '@/utils'

// headers: { 'content-type': 'application/x-www-form-urlencoded' },

export default {
  getQrCodeUrl: () => request.get('/wechat/qr/getQrCodeUrl', { noNeedToken: true }),
  getToken: (params) => request.get('/wechat/qr/getToken', { params }, { noNeedToken: true }),
  getUserInfoById: (params) => request.get('/user/getUserInfoById', { params }),
  isWXAuth: (params) => request.get('/wechat/qr/confirm', { params }),
  sendSMS: (params) => request.get('/login/sms/send', { params }),
  wxBindMobile: (params) => request.get('/user/bind', { params }),
  wxunBindMobile: (params) => request.get('/user/releaseBind', { params }),
  wxLogout: () => request.get('/wechat/qr/logout'),
  findUserInfo: () => request.get('/wechat/qr/findUserInfo'),
}
