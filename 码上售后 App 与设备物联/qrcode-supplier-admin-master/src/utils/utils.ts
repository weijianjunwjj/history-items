import Cookies from 'js-cookie'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('../views/**/**.vue')

// 清除登录信息
export function clearLoginInfo() {
  Cookies.remove('token')
}

export const isFalsy = (value: any) => (value === 0 ? false : !value)
// 在函数里 改变传入的对象本身是不好的 删除value为空的key
export const cleanObject = (object: any) => {
  const result = { ...object }
  Object.keys(object).forEach((key) => {
    const value = result[key]
    if (isFalsy(value)) {
      delete result[key]
    }
  })
  return result
}

export function translateGroupSystemNotice(message: any) {
  const groupName =
    message.payload.groupProfile.name || message.payload.groupProfile.groupID
  switch (message.payload.operationType) {
    case 1:
      return `${message.payload.operatorID} 申请加入群组：${groupName}`
    case 2:
      return `成功加入群组：${groupName}`
    case 3:
      return `申请加入群组：${groupName}被拒绝`
    case 4:
      return `你被管理员${message.payload.operatorID}踢出群组：${groupName}`
    case 5:
      return `群：${groupName} 已被${message.payload.operatorID}解散`
    case 6:
      return `${message.payload.operatorID}创建群：${groupName}`
    case 7:
      return `${message.payload.operatorID}邀请你加群：${groupName}`
    case 8:
      return `你退出群组：${groupName}`
    case 9:
      return `你被${message.payload.operatorID}设置为群：${groupName}的管理员`
    case 10:
      return `你被${message.payload.operatorID}撤销群：${groupName}的管理员身份`
    case 12:
      return `${message.payload.operatorID}邀请你加群：${groupName}`
    case 13:
      return `${message.payload.operatorID}同意加群：${groupName}`
    case 14:
      return `${message.payload.operatorID}拒接加群：${groupName}`
    case 255:
      return `自定义群系统通知: ${message.payload.userDefinedField}`
    default:
      return ''
  }
}

export function filterCallingMessage(currentMessageList: any[]) {
  currentMessageList.forEach((item) => {
    if (item.callType) {
      // 对于自己伪造的消息不需要解析
      return
    }
    if (item.type === TIM.TYPES.MSG_MERGER && item.payload.downloadKey !== '') {
      const promise = window.tim.downloadMergerMessage(item)
      promise
        .then(function (imResponse: any) {
          // 下载成功后，SDK会更新 message.payload.messageList 等信息
          item = imResponse
        })
        .catch(function (imError: any) {
          // 下载失败
          console.warn('downloadMergerMessage error:', imError)
        })
    }
    if (item.type === TIM.TYPES.MSG_CUSTOM) {
      let payloadData: any = {}
      try {
        payloadData = JSON.parse(item.payload.data)
      } catch (e) {
        payloadData = {}
      }
      if (payloadData.businessID === 1) {
        if (item.conversationType === TIM.TYPES.CONV_GROUP) {
          if (payloadData.actionType === 5) {
            item.nick = payloadData.inviteeList
              ? payloadData.inviteeList.join(',')
              : item.from
          }
          const _text = (
            window as any
          ).trtcCalling.extractCallingInfoFromMessage(item)
          const group_text = `${_text}`
          item.type = TIM.TYPES.MSG_GRP_TIP
          const customData = {
            operationType: 256,
            text: group_text,
            userIDList: [],
          }
          item.payload = customData // JSON.stringify(customData)
        }
        if (item.conversationType === TIM.TYPES.CONV_C2C) {
          const c2c_text = (
            window as any
          ).trtcCalling.extractCallingInfoFromMessage(item)
          const customData = {
            text: c2c_text,
          }
          item.payload = customData // JSON.stringify(customData)
        }
      }
    }
  })
}

// 两时间差
export const diffTime = (startTime: any, endTime: any) => {
  const app = window.$app
  momentDurationFormatSetup(moment)
  if (app.$g.none([startTime, endTime])) {
    return '00:00:00'
  }
  const seconds = moment(endTime).diff(moment(startTime), 'seconds')
  return moment.duration(seconds, 'seconds').format('HH:mm:ss', { trim: false })
}

// 两时间差
export const diffDate = (startTime: any, endTime: any) => {
  const seconds = moment(endTime).diff(moment(startTime), 'seconds')
  if (seconds < 60) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds,
    }
  }
  const min_total = Math.floor(seconds / 60) // 分钟
  const sec = Math.floor(seconds % 60) // 余秒
  if (min_total < 60) {
    return {
      days: 0,
      hours: 0,
      minutes: min_total,
      seconds: sec,
    }
  }
  const hour_total = Math.floor(min_total / 60) // 小时数
  const min = Math.floor(min_total % 60) // 余分钟
  if (hour_total < 24) {
    return {
      days: 0,
      hours: hour_total,
      minutes: min,
      seconds: sec,
    }
  }
  const day_total = Math.floor(hour_total / 24) // 天
  const hour = Math.floor(hour_total % 24) // 剩余小时
  return {
    days: day_total,
    hours: hour,
    minutes: min,
    seconds: sec,
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time: any, cFormat?: any) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return ''
  }
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time *= 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: any, key: any) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = `0${value}`
      }
      return value || 0
    }
  )
  return time_str
}

/**
 * 格式化video通话时间
 * @export
 * @param {number} int
 * @returns
 */
function formatInt(int: number) {
  return int < 10 ? `0${int}` : int
}
export function formatDuration(duration: number) {
  if (duration < 60) {
    return `00:00:${formatInt(duration)}`
  }
  if (duration < 60 * 60) {
    const min = Math.trunc(duration / 60)
    const sec = duration - min * 60
    return `00:${formatInt(min)}:${formatInt(sec)}`
  }
  const hour = Math.trunc(duration / (60 * 60))
  const remainder = duration - hour * (60 * 60)
  const min = Math.trunc(remainder / 60)
  const sec = remainder - min * 60
  return `${formatInt(hour)}:${formatInt(min)}:${formatInt(sec)}`
}

/**
 * 利用 document.title 做新消息提示
 * @export
 * @param {Number} count
 */
export function titleNotify(count: number) {
  const hasNewMessage = count > 0
  if (hasNewMessage) {
    if (document.title.search(/\((.*?)\)/) >= 0) {
      document.title = document.title.replace(
        /\((.*?)\)/,
        `(${count > 99 ? '99+' : count})`
      )
    } else {
      document.title = `(${count})${document.title}`
    }
  } else {
    document.title = document.title.replace(/\((.*?)\)/, '')
  }
}

export function getAudioVideo(constraintsData: any) {
  if (navigator.mediaDevices?.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // 首先，如果有getUserMedia的话，就获得它
      const getUserMedia =
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).msGetUserMedia
      // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
      if (!getUserMedia) {
        return Promise.reject({ code: 404 })
      }

      // 否则，为老的navigator.getUserMedia方法包裹一个Promise

      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
  return navigator.mediaDevices.getUserMedia(constraintsData)
}

export const debounce = function (fn: () => void, interval: number) {
  // debounce中的interval 和 throttle中的 interval含义不一样
  // 在debounce中可以可以把interval理解成 用户停止了某个连续的操作后 再推迟interval执行fn
  let timerId: any = null

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

export const generateRouter = (userRouters: any) => {
  // console.log(modules)
  const newRouters: RouteRecordRaw[] = userRouters.map((router: any) => {
    const modules_key = router.component.replace('@', '..')
    const component = modules[modules_key]
    // console.log('modules_key', modules_key)
    // console.log('component', component)
    const routes: RouteRecordRaw = {
      path: router.path,
      name: router.name,
      component,
      meta: {
        title: router.title,
        order: router.sort,
        icon: router.icon,
        requiresAuth: true,
        activeMenu: router.activeMenu,
        hideInMenu: router.hideInMenu === 'Y',
        hideSide: router.hideSide === 'Y',
      },
    }
    // if (isParent) {
    //   routes.component = () => import(/* @vite-ignore */ router.component)
    // }
    if (routes && router.children) {
      routes.children = generateRouter(router.children)
      routes.redirect = {
        name: router.children[0].name,
      }
    }
    if (router.roles) {
      routes.meta.roles = [router.roles]
    } else {
      routes.meta.roles = ['*']
    }
    return routes
  })
  return newRouters
}

export function generateKey(keyLength = 18) {
  let rlt = ''
  for (let i = 0; i < keyLength; i++) {
    if (Math.round(Math.random())) {
      rlt += Math.ceil(Math.random() * 9)
    } else {
      const ranNum = Math.ceil(Math.random() * 23)
      if (Math.round(Math.random())) {
        rlt += String.fromCharCode(65 + ranNum)
      } else {
        rlt += String.fromCharCode(97 + ranNum)
      }
    }
    // 加上-，不要的可以去掉
    if ((i + 1) % 6 === 0 && i > 2 && i < 17) {
      rlt += '-'
    }
  }
  return rlt
}
