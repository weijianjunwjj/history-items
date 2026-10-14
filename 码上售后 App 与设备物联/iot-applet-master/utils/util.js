import api from '../wxapi/api'

const app = getApp()
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export const debounce = function (fn, interval) {
  // debounce中的interval 和 throttle中的 interval含义不一样
  // 在debounce中可以可以把interval理解成 用户停止了某个连续的操作后 再推迟interval执行fn
  let timerId = null

  return function () {
    const current = +new Date()
    const args = [].slice.call(arguments, 0)
    const context = this
    // 如果调用很密集 可以保证fn永远不会触发 必须等到有前后两个调用的间隔大于等于interval fn才能被执行
    // 如果调用很少 fn会在interval结束后被执行
    clearTimeout(timerId)
    timerId = setTimeout(function () {
      fn.apply(context, args)
    }, interval)
  }
}


export function getLocation(page) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        wx.getLocation({
          altitude: true,
          type: 'gcj02',  // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: ({ latitude, longitude }) => {
            if (page && page.setData) {
              page.setData({
                latitude,
                longitude
              });
            }
            setAddress(latitude, longitude)
            resolve({ lat: latitude, lng: longitude })
          }
        })
      }
    });
  });

}

function setAddress(lat, lng) {
  return new Promise((resolve, reject) => {
    wx.setStorageSync('lat', lat);
    wx.setStorageSync('lng', lng);
    api.getLocation({ lat, lng }).then(res => {
      console.log(res);
      const address = res.data
      wx.setStorageSync('address', address)
      resolve({
        lat, lng, address
      })
    })
  })
}


export function getTop(num = 0) {
  console.log('app', app);
  return ~~app.globalData.CustomBar + num
}


export function formatMins(min) {
  if (!min) {
    return '-'
  }
  else if (min > 0 && min < 60) {
    return `${min}min`
  } else if (min == 60) {
    return '1h'
  }
  else {
    const m = min % 60
    return (Math.floor(min / 60) + "h" + (min % 60) + "min");
  }
}


export function validateMobile(phone) {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (phone.length == 0) {
    wx.showToast({
      title: '输入的手机号为空，，请重新输入！',
      icon: 'none',
      duration: 1500
    })

    return
  } else if (phone.length < 11) {
    wx.showToast({
      title: '手机号长度有误，请重新输入！',
      icon: 'none',
      duration: 1500
    })

    return
  } else if (!myreg.test(phone)) {
    wx.showToast({
      title: '手机号有误，请重新输入！',
      icon: 'none',
      duration: 1500
    })

    return
  } else {
    return true
  }
}

export const getMapPin = (item) => {
  const { repairFlag, warnFlag, status } = item

  if (repairFlag) {
    return '/images/map-pin-danger.png'
  }
  if (warnFlag) {
    return '/images/map-pin-warn.png'
  }
  return `/images/map-pin-${status}.png`
}

export const diffTime = (faultDate, completeTime) => {

  var stime = Date.parse(new Date(faultDate));

  var etime = Date.parse(new Date(completeTime));

  var usedTime = etime - stime; //两个时间戳相差的毫秒数


  //计算出小时数

  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数

  var hours = Math.floor(leave1 / (3600 * 1000));

  //计算相差分钟数

  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数

  //计算相差秒数
  var leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
  var seconds = Math.floor(leave3 / 1000);//将剩余的毫秒数转化成秒数

  var minutes = Math.floor(leave2 / (60 * 1000))

  var hoursStr = hours == 0 ? "" : hours + "h";



  var time = hoursStr + minutes + "min" + seconds + "s";

  return time;

}

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    const info = wx.getStorageSync('userInfo')
    console.log('getUserInfo-info', info);
    if (info) {
      resolve(info)
    } else {
      wx.api.getUserInfo().then(({ data }) => {
        console.log('data', data);
        resolve(data)
      })
    }
  })

}

export const getMyDeviceL = () => {
  return new Promise((resolve, reject) => {
    const info = wx.getStorageSync('device-length')
    console.log('getMyDeviceL-info', info);
    if (info) {
      resolve(info)
    } else {
      wx.api.myDevices().then(({ data }) => {
        console.log('data', data);
        resolve(data.length)
      })
    }

  })
}

/**
 *  @description:   归档，对一维json数组进行归档（根据key）
 *  @param {Array}  arr:一维数组
 *  @param {String} key：key字符串
 */
const sort = function (arr, key) {
  return [...new Set(arr.map((i) => i[key]))].reduce((p, c) => [...p, arr.filter((i) => i[key] === c)], [])
}
const url_params = obj => {
  let params = Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  }).join('&')
  return params
}

export default {
  sort,formatMins,url_params
}
