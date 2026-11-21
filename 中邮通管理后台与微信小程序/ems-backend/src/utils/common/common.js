import dayjs from 'dayjs'

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}

/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  var context, args
  var previous = 0

  return function () {
    var now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    let context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {Function} cb
 * @return {ResizeObserver}
 */
export function useResize(el, cb) {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}

export function downloadUrl(url) {
  if (url) {
    location.href = url
  } else {
    console.error('url 为 空')
  }
}

export function downloadCSV(url) {
  return new Promise((resolve, reject) => {
    let fileName
    fetch(url)
      .then((response) => {
        console.log('response :>> ', response)
        fileName = response.headers
          ?.get('Content-Disposition')
          ?.split(';')[1]
          ?.split('filename*=UTF-8\'\'')[1]
        console.log('fileName :>> ', fileName)
        const fileNameUnicode = response.headers?.get('Content-Disposition')?.split('filename*=')[1]
        console.log('fileNameUnicode :>> ', fileNameUnicode)
        if (fileNameUnicode) {
          // 当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
          fileName = decodeURIComponent(fileNameUnicode.split('\'\'')[1])
        }
        console.log('fileName :>> ', fileName)
        return response.blob()
      })
      .then((blob) => {
        console.log('blob :>> ', blob)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        resolve()
      })
      .catch(() => reject())
  })
}

export function copyToClipboard(text) {
  // 创建一个textarea元素
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)

  // 选择textarea中的文本
  textarea.select()

  // 执行复制操作
  try {
    document.execCommand('copy')
    $message.success('复制成功')
  } catch (err) {
    console.error('复制失败', err)
    $message.error('复制失败')
  }

  // 移除textarea元素
  document.body.removeChild(textarea)
}

export function downloadTxtFile(text, name) {
  const fileName = name || 'example.txt'

  // 创建一个Blob对象
  const blob = new Blob([text], { type: 'text/plain' })

  // 创建一个指向该Blob的URL
  const fileUrl = URL.createObjectURL(blob)

  // 创建一个a元素并设置属性
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = fileName

  // 模拟点击并移除元素
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 清理Blob URL
  URL.revokeObjectURL(fileUrl)
}

const now = new Date()
now.setDate(1)
export const firstDayTimestamp = now.getTime()


export const unique_obj_arr = (arr, key) => {
  const res = new Map()
  return arr.filter(arr => !res.has(arr[key]) && res.set(arr[key], 1))
}
