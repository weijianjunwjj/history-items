// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('../config.js')
const { appId } = CONFIG
const API_BASE_URL = 'https://api-dev.iotive.cn/maapi' // 开发环境
// const API_BASE_URL = 'https://api-dev.iotive.cn/maapi' // 测试环境
// const API_BASE_URL = 'https://api.iotive.cn/maapi'  // 正式环境
let modalShow = false

const request = (url, needSubDomain, isAuth, method, data) => {
  return new Promise((resolve, reject) => {
    
    let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
    let header = {}
    if (isAuth) {
      // 验证是否登录
      const token = wx.getStorageSync('token');
      if (!token) {
        loginByOpenid().then(() => {
          wx.request({
            url: _url,
            method: method,
            data: data,
            header: { Authorization: 'Bearer ' + token },
            success(res) {
              resolve(res.data)
            },
            fail(error) {
              reject(error)
            }
          })
        }).catch((err) => {
          wx.navigateTo({
            url: '/pages/login/index'
          })
          console.log('isAuth---');
          console.error(err);
          reject(err)
        });
      } else {
        header = { Authorization: 'Bearer ' + token };
      }
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success(res) {
        if (res.data.code === 401) {
          wx.clearStorageSync();
          loginByOpenid().then(() => {
            return request(url, needSubDomain, isAuth, method, data);
          }
          ).catch((err) => {
            console.error(err);
            reject(err)
            wx.navigateTo({
              url: '/pages/login/index'
            })
          })
        }else{
          resolve(res.data)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  })
}


export function get(url, { params = {}, needLogin = true, showAlert = true } = {}) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'get', params).then(res => {
      console.log('res',res);
      if (res.success) {
        resolve(res)
      } else if (res.code !== 401) {
        if (showAlert) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        reject(res)
      }
    }).catch(err=>{
      reject(err)
    })
  })
}

export function post(url, data, { params = {}, needLogin = true, showAlert = true } = {}) {
  return new Promise((resolve, reject) => {
    request(url, false, needLogin, 'post', data).then(res => {
      if (res.success) {
        resolve(res)
      } else if (res.status !== 401) {
        if (showAlert) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        reject(res)
      }
    }).catch(err=>{
      console.log(err);
      reject(err)
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

Array.prototype.last = function () {
  return this[this.length - 1]
}



export function loginByOpenid() {
  return new Promise(function (reslove, reject) {
    wx.login({
      success(res) {
        if (res.code) {
          maLogin({ code: res.code, appId: appId }).then(res => {
            if (res.success) {
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('phone', res.data.phone);
              reslove();
            } else {
              reject();
            }
          }).catch(reject)
        }
      }
    });
  });
}

export function maLogin(data) { //小程序登录授权
  return request('/wechat/wxapp/login', false, false, "post", data,)
}

export function maRegister(data) { //小程序登录授权
  return request('/wechat/wxapp/register', false, false, "post", data)
}

export default {
  API_BASE_URL
}

