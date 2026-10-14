// 小程序开发api接口工具包，https://github.com/gooking/wxapi
import { is, checkNetwork } from '../utils/util.js';
const CONFIG = require('../config.js');
const { appid } = CONFIG;
// 全局参数
const env = __wxConfig.envVersion;
console.log('env------', env);
const dev = 'https://test-zyt.5dsp.com';
// const dev = 'http://192.168.2.91:9090';
const rel = 'https://zyt.5dsp.com';
const baseUrls = {
  develop: dev,
  trial: dev,
  release: rel,
};
export const API_BASE_URL = baseUrls[env];
console.log('API_BASE_URL', API_BASE_URL);

Array.prototype.last = function () {
  return this[this.length - 1];
};
Array.prototype.excludes = function (value) {
  return !this.includes(value);
};

const request = (
  url,
  needSubDomain,
  needLogin = true,
  method,
  data,
  showAlert
) => {
  return new Promise(async (resolve, reject) => {
    let _url =
      API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url;
    let header = {};
    if (needLogin) {
      // 验证是否登录
      const token = wx.getStorageSync('token');
      if (!token) {
        loginByOpenid()
          .then(async _token => {
            const token2 = _token || wx.getStorageSync('token');

            await checkNetwork();
            wx.request({
              url: _url,
              method: method,
              data: data,
              header: { Authorization: 'Bearer ' + token2 },
              success(_res) {
                const res = _res.data;
                if (res.code == 0) {
                  resolve(res);
                } else {
                  console.log('showAlert :>> ', showAlert);
                  if (showAlert) {
                    showMsg(res);
                  }
                  reject(res);
                }
              },
              fail(error) {
                console.error('全局错误2---', error);
                reject(error);
              },
            });
          })
          .catch(err => {
            reject(err);
          });
      } else {
        header = { Authorization: 'Bearer ' + token };
      }
    }

    await checkNetwork();

    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success(res) {
        if (res?.data?.code === 401) {
          console.log('401---登录失效---------');
          wx.removeStorageSync('token');
          loginByOpenid()
            .then(() => {
              return request(url, needSubDomain, needLogin, method, data);
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        } else {
          resolve(res?.data);
        }
      },
      fail(error) {
        console.error('全局错误---', error);
        reject(error);
      },
    });
  });
};

function showMsg(_res) {
  const showToast = res => {
    const code = res?.code || res?.data?.code;
    console.log('code :>> ', code);
    if ([0, undefined, 401].excludes(code)) {
      if (res.message === '该用户存在未支付订单') {
        wx.showModal({
          title: '支付提醒',
          content: '您存在未支付订单，点击去支付',
          showCancel: false,
          cancelColor: '#000000',
          confirmText: '去支付',
          confirmColor: '#3CC51F',
          success: result => {
            if (result.confirm) {
              wx.reLaunch({
                url: '/pages/order-history/order-history?active=0',
              });
            }
          },
        });
        return;
      }

      const msg = res.message === 'system error' ? '系统错误！' : res.message;
      const title = msg || '系统错误！';
      wx.showToast({
        title,
        icon: 'none',
        duration: 2000,
      });
    }
  };

  showToast(_res);
}

export function get(
  url,
  { params = {}, needLogin = true, showAlert = true } = {}
) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'get', params, showAlert)
      .then(res => {
        console.log('Get-res--------------- :>> ', res);
        if (res.code == 0) {
          resolve(res);
        } else {
          console.log('showAlert :>> ', showAlert);
          if (showAlert) {
            showMsg(res);
          }
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function del(
  url,
  { params = {}, needLogin = true, showAlert = true } = {}
) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'delete', params, showAlert)
      .then(res => {
        if (res.code == 0) {
          resolve(res);
        } else {
          if (showAlert) {
            showMsg(res);
          }
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function post(
  url,
  data,
  { params = {}, needLogin = true, showAlert = true } = {}
) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'post', data, showAlert)
      .then(res => {
        if (res.code == 0) {
          resolve(res);
        } else {
          if (showAlert) {
            showMsg(res);
          }
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function put(
  url,
  data,
  { params = {}, needLogin = true, showAlert = true } = {}
) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'put', data, showAlert)
      .then(res => {
        if (res.code == 0) {
          resolve(res);
        } else {
          if (showAlert) {
            showMsg(res);
          }
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      return Promise.resolve(callback()).then(function () {
        return value;
      });
    },
    function (reason) {
      return Promise.resolve(callback()).then(function () {
        throw reason;
      });
    }
  );
};

export function loginByOpenid() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success(res) {
        console.log('1-wx.login---res :>> ', res);
        if (res.code) {
          maLogin({ code: res.code, appId: appid })
            .then(res => {
              console.log('2-maLogin---res :>> ', res);
              if (res.code == 0) {
                //可能这里没存进去
                const token = res?.data?.token;
                console.log('3-token--- :>> ', token);
                wx.setStorageSync('token', token);
                resolve(token);
              } else {
                reject(res);
                showMsg(res);
              }
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      },
    });
  });
}

export function maLogin({ code, appId }) {
  //小程序登录授权
  return request(
    `/api/auth/login?code=${code}&appId=${appId}`,
    false,
    false,
    'post'
  );
}

export default {
  API_BASE_URL,
};
