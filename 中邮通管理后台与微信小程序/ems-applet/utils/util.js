import userApi from '../wxapi/api/user.js';
import { checkTokenAndLogin2 } from './authUtils.js';
import Api from '../wxapi/api.js';
import CONFIG from './config.js';
const {
  prePaidRemind, //待支付提醒
  orderPayRemind,
  orderErrorRemind,
} = CONFIG;

const numeral = require('numeral');

const app = getApp();

const getName = () => wx.getStorageSync('nickName');
const getPhone = () => wx.getStorageSync('phoneCode');
const getAvatar = () => wx.getStorageSync('avatarUrl');
const getGender = () => wx.getStorageSync('gender');

export const isCanSavePerosnInfo = () => {
  const phoneCode = getPhone();
  const avatarUrl = getAvatar();
  const name = getName();

  return phoneCode && avatarUrl && name;
};

export function getPhoneNumber(e) {
  console.log('e :>> ', e);
  wx.api.user.phoneCode({ phoneCode: e.detail.code }).then(res => {
    console.log('res :>> ', res);
    wx.setStorageSync('phoneCode', res.data);
    wx.showToast({
      title: '授权成功',
    });
    if (isCanSavePerosnInfo()) {
      savePerosnInfo();
    }
  });
}

export function getUserProfile() {
  wx.getUserProfile({
    desc: '用于完善用户信息',
    success: res => {
      console.log(res);
      const { avatarUrl, nickName, gender } = res.userInfo;
      wx.setStorageSync('avatarUrl', avatarUrl);
      wx.setStorageSync('nickName', nickName);
      wx.setStorageSync('gender', gender);
      wx.showToast({
        title: '授权成功',
      });
      if (isCanSavePerosnInfo()) {
        savePerosnInfo();
      }
    },
  });
}

export function savePerosnInfo() {
  const phone = getPhone();
  const avatarUrl = getAvatar();
  const name = getName();
  const gender = getGender();
  const p = {
    phone,
    avatarUrl,
    name,
    gender,
  };

  console.log('p :>> ', p);

  userApi.savePersonInfo(p).then(res => {
    console.log('savePersonInfo-res :>> ', res);
  });
}

// 小程序一次性订阅消息
export function requestSubscribeMessage() {
  return subscription([prePaidRemind, orderPayRemind, orderErrorRemind]);
}

export const subscription = tmplIds => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log('订阅消息', res);
        if (!res.subscriptionsSetting.mainSwitch) {
          // 关闭订阅消息主按钮
          return wx.showModal({
            title: '提⽰',
            content:
              '您已关闭订阅消息通知，请点击“确认”按钮在设置中打开订阅通知。',
            success: function (res) {
              wx.hideLoading()
              if (res.confirm) {
                wx.openSetting({
                  success(res) {},
                });
              }
            },
          });
        } else {
          // 开放订阅消息主按钮
          // ⽤户点击确定或者取消，但不勾选‘总是保持以上选择，不再询问’，下⼀次授权会再弹窗（⽤户授权允许⼀次，才会收到⼀次消息）
          // ⽤户勾选了‘总是保持以上选择，不再询问’后不会再弹窗（依然⾛授权，只是不弹窗，保持之前的选择）
          // ⽤户勾选了‘总是保持以上选择，不再询问’后才能获取到每⼀项的授权状态
          // 但是勾选了‘总是保持以上选择，不再询问’后，就不会再次弹出了，res.subscriptionsSetting.itemSettings会返回之前的授权结果
          // 所以暂时不能实现在多个授权中每次只弹出未授权的项
          wx.requestSubscribeMessage({
            tmplIds, // 需要订阅的消息模板的id的集合，⼀次调⽤最多可订阅3条消息
            success(res) {
              console.log('授权', res);
              const openSetting = () => {
                wx.openSetting({
                  success(res) {},
                });
              };
              const showModal = (content, showCancel = true) => {
                wx.showModal({
                  title: '提醒',
                  content,
                  showCancel,
                  cancelText: '取消',
                  cancelColor: '#000000',
                  confirmText: '确定',
                  confirmColor: '#3CC51F',
                  success: result => {
                    wx.hideLoading()
                    if (result.confirm) {
                      openSetting();
                    } else {
                      wx.hideToast();
                      wx.showModal({
                        title: '提醒',
                        content: '下单失败，请开启通知后再进行下单',
                        showCancel: false,
                        cancelColor: '#000000',
                        confirmText: '确定',
                        confirmColor: '#3CC51F',
                      });
                    }
                  },
                });
              };
              const isPrePaidRemind0 = res[prePaidRemind];
              const orderPayRemind0 = res[orderPayRemind];
              const orderErrorRemind0 = res[orderErrorRemind];
              console.log({
                isPrePaidRemind0,
                orderPayRemind0,
                orderErrorRemind0,
              });
              if (isPrePaidRemind0 !== 'accept') {
                return showModal(
                  '请点击订阅消息，开启待支付通知，避免影响快递寄出'
                );
              }
              if (orderPayRemind0 !== 'accept') {
                return showModal(
                  '请点击订阅消息，开启订单支付通知，避免影响快递寄出'
                );
              }
              if (orderErrorRemind0 !== 'accept') {
                return showModal(
                  '请点击订阅消息，开启订单异常通知，避免影响快递寄出'
                );
              }
              resolve();
            },
            fail(e) {
              console.log('fail---');
              console.error(e);
              reject();
              wx.hideLoading()
            },
          });
        }
      },
      fail(){
        wx.hideLoading()
      }
    });
  });
};

export const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

export const debounce = function (fn, interval) {
  // debounce中的interval 和 throttle中的 interval含义不一样
  // 在debounce中可以可以把interval理解成 用户停止了某个连续的操作后 再推迟interval执行fn
  let timerId = null;

  return function () {
    const current = +new Date();
    const args = [].slice.call(arguments, 0);
    const context = this;
    // 如果调用很密集 可以保证fn永远不会触发 必须等到有前后两个调用的间隔大于等于interval fn才能被执行
    // 如果调用很少 fn会在interval结束后被执行
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      fn.apply(context, args);
    }, interval);
  };
};

export function throttle(fn, delay) {
  let timer;
  return function () {
    if (!timer) {
      fn.apply(this, arguments);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

/**
 *  @description:   归档，对一维json数组进行归档（根据key）
 *  @param {Array}  arr:一维数组
 *  @param {String} key：key字符串
 */
export const sort = function (arr, key) {
  return [...new Set(arr.map(i => i[key]))].reduce(
    (p, c) => [...p, arr.filter(i => i[key] === c)],
    []
  );
};

/**
 *  @description:   去对象数组重
 */
export const unique_obj_arr = (arr, key) => {
  const res = new Map();
  return arr.filter(arr => !res.has(arr[key]) && res.set(arr[key], 1));
};
/**
 *  @description:   去对象数组重
 */
export const unique_obj_arr2 = (arr1, arr2, key) => {
  // 创建一个新的 Map，以 id 为键，存储 arr1 中的对象
  let combinedMap = new Map(arr1.map(obj => [obj.id, obj]));

  // 遍历 arr2，如果存在相同的 id，则用 arr2 中的对象替换
  arr2.forEach(obj => combinedMap.set(obj.id, obj));

  // 从 Map 中提取值，得到最终合并后的数组
  let combinedArray = Array.from(combinedMap.values());

  return combinedArray;
};

export const url_params = obj => {
  let params = Object.keys(obj)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    })
    .join('&');
  return params;
};
export function scanCode() {
  wx.scanCode({
    success: function (res) {
      console.log('res :>> ', res);
      var url = res.result;
      console.log('扫码结果：' + url);
      let urlParamsStr = url.split('?')[1];
      let urlParamsArr = urlParamsStr.split('&');

      let paramsObj = {};
      urlParamsArr.forEach(param => {
        let [key, val] = param.split('=');
        paramsObj[key] = val;
      });

      let uid = paramsObj.uid;
      let shareCode = paramsObj.shareCode;
      wx.reLaunch({
        url:
          '/pages/online-shipping/online-shipping' +
          `?uid=${uid}&shareCode=${shareCode}`,
      });

      // 在这里可以对扫码结果进行处理
    },
    fail: function (res) {
      console.log('扫码失败');
      wx.showToast({
        icon: 'none',
        title: '扫码取消',
      });
      // 处理扫码失败的情况
    },
  });
}

export const openLocation = (latitude, longitude) => {
  const key = 'DQ6BZ-6FWH7-TGJXT-PVR6X-2LTJK-L2B4V'; //使用在腾讯位置服务申请的key
  const referer = '逍遥邮'; //调用插件的app的名称
  const location = JSON.stringify({
    latitude: latitude || 39.89631551,
    longitude: longitude || 116.323459711,
  });
  const category = '生活服务,娱乐休闲';

  wx.navigateTo({
    url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`,
    success() {
      wx.setStorageSync('isNew', 0);
    },
  });
};

/**
 *  @description:将传入的数字除以1000并保留两位小数
 */
export const divide1000fixed2 = count => {
  return numeral(count).divide(1000).format('0.00');
};
/**
 *  @description:将传入的数字除以1000并保留两位小数
 */
export const tofixed2 = count => {
  return numeral(count).format('0.00');
};

/**
 * @description: 数据类型的检测的方式
 * @param {any} data 要检测数据类型的变量
 * @param {string} type 具体的类型名称【小写】
 */
export const is = (type, data) => {
  return (
    Object.prototype.toString
      .call(data)
      .replace(/\[object (\w+)\]/, '$1')
      .toLowerCase() === type
  );
};

/**
 * @description: 检查是否授权手机号
 */
export async function checkIsAuthPhone() {
  const func = () => {
    const phone = wx.getStorageSync('phoneCode');

    if (!phone) {
      Api.user.getUserInfo().then(res => {
        console.log('getUserInfo-res :>> ', res);
        const phone = res?.data?.mobile;
        console.log('phone :>> ', phone);
        if (!phone) {
          //前后端都没存，跳转授权手机号页面
          console.error('前后端都没存，跳转授权手机号页面');
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const path = currentPage.route;
          const loginPath = 'pages/login/login';
          console.log('path :>> ', path);
          if (path !== loginPath) {
            wx.navigateTo({
              url: '/pages/login/login',
            });
          }
        } else {
          if (phone) {
            //后端存，前端没存，赶紧存前端缓存
            wx.setStorageSync('phoneCode', phone);
          }
        }
      });
    }
  };

  await checkTokenAndLogin2(func);
  func();
}

export const noNull = val => {
  return ![undefined, null].includes(val);
};

/**
 * @description: 检查是否支付过
 */
export const isPaid = settleStatus => {
  // {0：待支付，1：已支付，2：支付失败，3：已支付，4：已支付}
  return [1].includes(settleStatus);
}; 

export function reverseArrayKeyValues(arr) {
  var reversedObj = {};
  for (var key in arr) {
    if (arr.hasOwnProperty(key)) {
      reversedObj[arr[key]] = key;
    }
  }
  return reversedObj;
}

// 外部变量缓存promise
let promise;

// 防抖函数
export const checkNetwork = debounce(function () {
  // 将new Promise赋值给外部变量
  const app = getApp();
  promise = new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        if (res.networkType === 'none') {
          if (!app.globalData.hasShownModal) {
            wx.showModal({
              title: '网络不可用',
              content: '请检查您的网络设置!',
              showCancel: false,
              success: result => {
                app.globalData.hasShownModal = true;
                wx.hideLoading();
                if (result.confirm) {
                  app.globalData.hasShownModal = false;
                }
              },
            });
          }

          return reject();
        }
        return resolve();
      },
    });
  });

  // 返回外部promise变量
  return promise;
}, 500);


export function getCurrentDateTime() {
  var currentDate = new Date();

  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 使用 padStart 补齐月份和日期的格式
  var day = currentDate.getDate().toString().padStart(2, '0');
  var hours = currentDate.getHours().toString().padStart(2, '0');
  var minutes = currentDate.getMinutes().toString().padStart(2, '0');
  var seconds = currentDate.getSeconds().toString().padStart(2, '0');

  var formattedDateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return formattedDateTime;
}

export function getCurrentDate() {
  var currentDate = new Date();

  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 使用 padStart 补齐月份和日期的格式
  var day = currentDate.getDate().toString().padStart(2, '0');

  var formattedDateTime = year + "-" + month + "-" + day
  return formattedDateTime;
}

export function calculateTimeDifference(inputTime) {
  var inputDate = new Date(inputTime); // 将输入的时间字符串转换为 Date 对象

  // 将输入时间加上一天
  var tomorrow = new Date(inputDate.getTime() + 24 * 60 * 60 * 1000);

  var currentDate = new Date(); // 获取当前时间的 Date 对象

  // 计算时间差（单位：毫秒）
  var timeDifference = tomorrow - currentDate;

  // 将时间差转换为小时、分钟和秒
  var seconds = Math.floor(timeDifference / 1000) % 60;
  var minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
  var hours = Math.floor(timeDifference / (1000 * 60 * 60));

  // 格式化小时、分钟和秒
  var formattedHours = hours.toString().padStart(2, '0') + "小时";
  var formattedMinutes = minutes.toString().padStart(2, '0') + "分";
  var formattedSeconds = seconds.toString().padStart(2, '0') + "秒";

  return formattedHours + formattedMinutes + formattedSeconds;
}






export function maskPhoneNumber(phoneNumber) {
  // 确保phoneNumber是字符串
  let phoneStr = String(phoneNumber);

  // 验证手机号长度是否为11位
  if (phoneStr.length !== 11) {
      return "Invalid phone number";
  }

  // 使用substring替换中间四位数字为星号
  return phoneStr.substring(0, 3) + '****' + phoneStr.substring(7);
}

export default {
  maskPhoneNumber,
  reverseArrayKeyValues,
  noNull,
  is,
  sort,
  url_params,
  debounce,
};
