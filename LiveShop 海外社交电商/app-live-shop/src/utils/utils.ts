import {getCurrentInstance} from 'vue'
import {DefaultAvatarMan, DefaultAvatarWoman} from '@/config'
import {useUserStore} from '@/store'
import {stopLocationTracking} from './locationService'
import {processedEmojis} from '@/utils/processed_emojis'
import {getDictSn} from '@/service/community/community'

export const isNull = (pp) => {
  return [null, undefined, 0].includes(pp)
}

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
  )
}

export function formatSeconds(seconds) {
  if (isNull(seconds)) return '00:00'

  // 计算小时数
  const hours = Math.floor(seconds / 3600)

  // 计算剩余的分钟数
  const minutes = Math.floor((seconds % 3600) / 60)

  // 格式化小时和分钟，如果是个位数前面补零
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

export const isEmptyObj = (val) => JSON.stringify(val) === '{}'

export const isEmptyArr = (val) => JSON.stringify(val) === '[]'

export const isEmpty = (val) =>
  [undefined, null, ''].some((item) => item === val) || isEmptyObj(val) || isEmptyArr(val)

export const noEmpty = (val) =>
  [undefined, null, ''].every((item) => item !== val) && !isEmptyObj(val) && !isEmptyArr(val)

export const noNaN = (val) => !Number.isNaN(val)

export const toPage = (url, data?) => {
  // 检查 data 是否为空或 null
  if (data && Object.keys(data).length > 0) {
    uni.navigateTo({
      url: `${url}?data=${encodeURIComponent(JSON.stringify(data))}`,
    })
  } else {
    uni.navigateTo({url})
  }
}

export function showToast(message, type?) {
  const proxy: any = getCurrentInstance().proxy
  proxy.$toast(message, type)
}

export function parseUrlParams(query) {
  const params = {}
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      params[key] = decodeURIComponent(query[key]) // 解码参数
    }
  }
  return params
}

export function getUrl(url) {
  if (url?.startsWith('/static/')) return url;
  const defaultUrlPrefix = 'https://files.njyykj.com/';
  // 获取存储的文件URL前缀，如果未设置则使用默认值
  const fileUrlPre = uni.getStorageSync('fileUrlPre') || defaultUrlPrefix;

  // 检查url是否为字符串
  if (typeof url !== 'string') {
    throw new Error(`Invalid argument: Expected a string, got ${typeof url}`);
  }
  // 如果url已经是完整的HTTP/HTTPS链接
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.replace(defaultUrlPrefix, fileUrlPre);
  }
  // 如果url非空且不包含协议头，则添加前缀
  return url ? `${fileUrlPre}${url}` : '';
}

export const getAvatar = (obj: any) => {
  const {avatar, avator, gender} = obj
  const ava = avatar ?? avator
  let genderUrl = gender == 1 ? DefaultAvatarMan : DefaultAvatarWoman
  const tx = noEmpty(ava) ? getUrl(ava) : genderUrl
  return tx
}

const toFixed = (n, fixed) => {
  const factor = Math.pow(10, fixed)
  return Math.round(n * factor) / factor
}

/**
 * 数字金额格式化处理
 * @param {string} money  要格式化的字符
 * @param {number} fixed  保留的小数位
 * @returns {string}
 */
export function convertMoney(money: string, fixed = 0) {
  return parseFloat(money)
    .toFixed(fixed)
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/\,$/, '')
    .split('')
    .reverse()
    .join('')
}

/** 当天时间显示24小时制 ；本年时间显示月/日；本年之前时间显示年/月/日
 * 格式化时间
 * @param data
 */
export function timeFormatting(data: string) {
  if (!data) return
  let date = new Date()
  let y = date.getFullYear().toString().padStart(2, '0')
  let MM: any = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate().toString().padStart(2, '0')
  let h = date.getHours().toString().padStart(2, '0')
  let m = date.getMinutes().toString().padStart(2, '0')
  let s = date.getSeconds().toString().padStart(2, '0')

  let form = new Date(data)
  let year = form.getFullYear().toString().padStart(2, '0')
  let month: any = form.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = form.getDate().toString().padStart(2, '0')
  let hours = form.getHours().toString().padStart(2, '0')
  let minutes = form.getMinutes().toString().padStart(2, '0')
  let seconds = form.getSeconds().toString().padStart(2, '0')
  if (y === year && MM === month && d === day) {
    return hours + ':' + minutes
  } else if (y === year) {
    return month + '.' + day
  } else if (y > year) {
    return year + '.' + month + '.' + day
  }
}

// 禁止截屏
export function closeScreenshots() {
  uni.setUserCaptureScreen({
    enable: false,
  })
}

// 允许截屏
export function openScreenshots() {
  uni.setUserCaptureScreen({
    enable: true,
  })
}

export function isLoginPage() {
  const pages = getCurrentPages() // 获取当前页面栈
  if (pages.length > 0) {
    const currentRoute = pages[pages.length - 1].route // 获取栈顶页面的路由
    return currentRoute === 'pages/login/index' // 判断是否是登录页面路径
  }
  return false
}

export function clearAll() {
  const userStore = useUserStore()
  userStore.clearUserInfo()
  uni.clearStorage()
  stopLocationTracking()
}

export function isLogin() {
  return uni.getStorageSync('token')
}

// debounce.js
const debounceInstances = new Map()

export function debounce(func, wait, key = 'default') {
  let timeout = debounceInstances.get(key)

  return function (...args) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
      debounceInstances.delete(key) // 调用后清除实例
    }, wait)

    debounceInstances.set(key, timeout)
  }
}

const debounceInstancesPromise = new Map()

export function debouncePromise(func, wait = 800, key = 'default') {
  let timeout = debounceInstancesPromise.get(key)
  let resolveLastPromise
  let rejectLastPromise

  return function (...args) {
    // 如果存在之前未完成的 Promise，则拒绝
    if (timeout && rejectLastPromise) {
      rejectLastPromise(new Error('Debounced by a newer call'))
    }

    const promise = new Promise((resolve, reject) => {
      resolveLastPromise = resolve
      rejectLastPromise = reject

      // 重置定时器
      if (timeout) {
        clearTimeout(timeout)
      }

      // 设置新的定时器
      timeout = setTimeout(() => {
        Promise.resolve(func.apply(this, args))
          .then(resolve) // 仅 resolve 最后一次的 Promise
          .catch(reject) // 处理 func 的错误

        debounceInstancesPromise.delete(key) // 清除对应的实例
      }, wait)

      debounceInstancesPromise.set(key, timeout)
    })

    return promise
  }
}

// 文字消息转换处理
export const formatTextToHTML = (text: string) => {
  const emojiMap = new Map<string, string>()
  processedEmojis.forEach((emoji) => {
    emojiMap.set(emoji.key, emoji.url)
  })
  let result = text.replace(/\[(.*?)\]/g, (match) => {
    let key = match.slice(1, -1)
    let url = emojiMap.get(key)
    return (
      `<image src="${url}" style="height: 20px;display: inline-block" mode="heightFix"/>` || match
    )
  })
  return `${result}`
}

export async function updateFileUrlPre() {
  // 先预设一个地址保底
  uni.setStorageSync('fileUrlPre', 'https://files.njyykj.com/')
  const res: any = await getDictSn({dictSn: 'FILE_URL_PRE'})
  const FILE_URL_PRE = res.data.list?.[0].value
  if (FILE_URL_PRE) {
    uni.setStorageSync('fileUrlPre', FILE_URL_PRE)
  }
}

// 判断是否是当天
export const isToday = (id: string) => {
  const getSayHiArr = uni.getStorageSync('sayHi') || []
  const isSay = getSayHiArr.find(i => i.id === id)
  const today = new Date();
  // 设置时间为今天凌晨00:00:00
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // 设置时间为今天晚上23:59:59
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  // 将输入的date转换为毫秒数以便比较
  const isFull = getSayHiArr.filter(item => new Date(item.time).getTime() >= startOfDay.getTime() && new Date(item.time).getTime() <= endOfDay.getTime()).length
  console.warn(isFull)
  console.warn(isSay)
  if (isFull > 2) {
    return true
  }
  if (isSay) {
    const dateMs = new Date(isSay.time).getTime();
    // 检查给定的日期是否在今日范围内
    return dateMs >= startOfDay.getTime() && dateMs <= endOfDay.getTime();
  } else {
    return false
  }
}
export const updateHiArr = (newItem: { id: string, time: Date }) => {
  console.log('到这里了吗')
  const arr = uni.getStorageSync('sayHi') || []
  const {id, time} = newItem;
  const existingItemIndex = arr.findIndex(item => item.id === id);
  if (existingItemIndex !== -1) {
    if (new Date(time) > new Date(arr[existingItemIndex].time)) {
      arr[existingItemIndex] = newItem;
    }
  } else {
    arr.push(newItem);
  }
  uni.setStorageSync('sayHi', arr);
}

export function autoDecodeURIComponent(str) {
  let decodedStr = str;

  // 使用 try-catch 捕捉解码失败的情况
  while (true) {
    try {
      const temp = decodeURIComponent(decodedStr);
      // 如果解码后没有变化，说明已经是最后一次编码
      if (temp === decodedStr) {
        break;
      }
      decodedStr = temp;
    } catch (e) {
      break; // 解码失败时跳出循环
    }
  }

  return decodedStr;
}

export function uniqueById(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item.id)) {
      return false;
    } else {
      seen.add(item.id);
      return true;
    }
  });
}
