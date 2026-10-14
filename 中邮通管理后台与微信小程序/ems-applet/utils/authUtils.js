import { loginByOpenid } from '../wxapi/request';

// 检测登录状态，返回 true / false
export function checkToken() {
  const token = wx.getStorageSync('token');
  return !!token;
}

let lock = false;
/**
 * 校验token,token不可用时用openid登录
 * @returns {Promise<*>}
 */
export function checkTokenAndLogin(callback) {
  return new Promise((resolve, reject) => {
    if (lock) {
      console.warn('login请求中，不允许重复请求！');
      setTimeout(() => {
        if (callback) {
          callback();
        }
      }, 1000);
      return reject();
    }
    const isCheckToken = checkToken();
    console.log('isCheckToken :>> ', isCheckToken);
    if (!isCheckToken) {
      lock = true;
      setTimeout(() => {
        lock = false;
        console.warn('锁已解除!');
      }, 1000);
      console.error('1---------------------------------');
      resolve(loginByOpenid())
    } else {
      resolve();
    }
  });
}
/**
 * 校验token,token不可用时用openid登录
 * @returns {Promise<*>}
 */
export function checkTokenAndLogin2() {
  return new Promise((resolve, reject) => {
    const isCheckToken = checkToken();
    if (!isCheckToken) {
      resolve(loginByOpenid());
    } else {
      resolve();
    }
  });
}
