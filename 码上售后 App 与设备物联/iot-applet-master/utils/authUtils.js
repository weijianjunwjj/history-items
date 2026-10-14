import { loginByOpenid } from "../wxapi/request";


// 检测登录状态，返回 true / false
export function checkToken() {
  const token = wx.getStorageSync('token')
  return !!token
}

/**
 * 校验token,token不可用时用openid登录
 * @returns {Promise<*>}
 */
async function checkTokenAndLogin() {
  if (!checkToken()) {
    return loginByOpenid();
  }
}



export default {
  checkTokenAndLogin,
  checkToken
}
