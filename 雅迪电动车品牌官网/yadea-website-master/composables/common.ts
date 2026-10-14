/*
 * @Author: weijianjun
 * @Date: 2023-01-03 15:43:59
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-11 12:53:01
 * @FilePath: \yadea-website\composables\common.ts
 * @Description:
 *
 */
import { message } from 'ant-design-vue'
import _ from 'lodash'

export function isHavePng(url: string) {
  return url.indexOf('jpg') !== -1 || url.indexOf('png') !== -1
}

export const emptyImg =
  'data:image/png;base64,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'

// 当前元素是否出现在可视区域
export function isInView(ele: HTMLElement) {
  if (!ele) {
    return
  }
  const offset = ele.getBoundingClientRect()
  const offsetTop = offset.top
  const offsetBottom = offset.bottom

  return !(window.innerHeight <= offsetTop && offsetBottom >= 0)
}

export const clone = _.cloneDeep

export function transRestful(rest: string) {
  rest = rest.replace('::', '/')
  rest = rest.split('.')[0]
  if (rest.charAt(rest.length - 1) === 'y') {
    rest = rest.slice(0, -1) + 'ies'
  } else {
    rest = rest + 's'
  }

  return rest
}

export function onErr(err: any) {
  if (process.client) {
    message.error('网络异常！请稍后重试！')
  }
}

/**
 * @description: 数据类型的检测的方式
 * @param {any} data 要检测数据类型的变量
 * @param {string} type 具体的类型名称【小写】
 */
export const is = (type: string, data: any) => {
  return (
    Object.prototype.toString
      .call(data)
      .replace(/\[object (\w+)\]/, '$1')
      .toLowerCase() === type
  )
}

export function fList(list: { attributes: any }[]) {
  return list.map((item: { attributes: any }) => item.attributes)
}

export const sortClass = (sortData = [{}], key = '') => {
  const groupBy = (array: any[], f: { (item: any): any; (arg0: any): any }) => {
    const groups: any = {}
    array.forEach((o: any) => {
      const group = JSON.stringify(f(o))
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(group => {
      const key = JSON.parse(group)
      return {
        key,
        value: groups[group]
      }
    })
  }
  const sorted = groupBy(sortData, (item: { [x: string]: any }) => {
    return item[key] // 返回需要分组的对象
  })
  return sorted
}
export const sortClass2 = (sortData = [{}], name = '') => {
  const groupBy = (array: any[], f: { (item: any): any; (arg0: any): any }) => {
    const groups: any = {}
    array.forEach((o: any) => {
      const group = JSON.stringify(f(o))
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(group => {
      const key = JSON.parse(group)
      return {
        name: key,
        list: groups[group]
      }
    })
  }
  const sorted = groupBy(sortData, (item: { [x: string]: any }) => {
    return item[name] // 返回需要分组的对象
  })
  return sorted
}
export const replaceImgUrl = (url: string) => {
  return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const watchVal = (item: any, callback: () => {}) => {
  // count记录回调了多少次
  // let count = 0
  const watchItem = () => {
    if (item.value) {
      callback()
    } else {
      // count++
      setTimeout(() => {
        watchItem()
      })
    }
  }
  watchItem()
}

export const getVW = (vw: number) => {
  if (process.client && document) {
    return (vw / 1920) * document.body.clientWidth
  } else {
    return 0
  }
}
export const getMVW = (vw: number) => {
  if (process.client && document) {
    return (vw / 375) * document.body.clientWidth
  } else {
    return 0
  }
}

export function getScrollTop() {
  let scrollTop = 0
  if (process.client) {
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
  }

  return scrollTop
}

export function setBodyOverflow(style: string) {
  if (process.client) {
    document.body.style.overflow = style
  }
}

export function isMobile(userAgent: string) {
  return !!userAgent.match(/AppleWebKit.*Mobile.*/)
}

export function jumpTo(url: string) {
  console.log('url :>> ', url)
  if (url) {
    useRouter().push(url)
  }
}

export function toBookingRide(bgi: string) {
  console.log('bgi :>> ', bgi)
  useRouter().push('/booking-ride')
}
