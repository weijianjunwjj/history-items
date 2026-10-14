// res 是返回的文件流，type 是文件MIME类型, fileName 是给下载的文件一个名称
// export function downFiles(res: any, type: string, fileName: string) {
//   const blob = new Blob([res], {
//     type,
//   })
//   const a = document.createElement('a')
//   const URL = window.URL || window.webkitURL
//   const herf = URL.createObjectURL(blob)
//   a.href = herf
//   a.download = `${fileName}`
//   document.body.appendChild(a)
//   a.click()
//   document.body.removeChild(a)
//   window.URL.revokeObjectURL(herf)
// }

export default function download(response: any, fileName: any) {
  // 用户环境信息
  const uA = window.navigator.userAgent
  // 判断是不是ie浏览器 不考虑兼容可以删除
  const isIE =
    /msie\s|trident\/|edge\//i.test(uA) &&
    !!(
      'uniqueID' in document ||
      'documentMode' in document ||
      'ActiveXObject' in window ||
      'MSInputMethodContext' in window
    )
  //
  if (!fileName) {
    // eslint-disable-next-line prefer-destructuring
    fileName = response.headers
      .get('Content-Disposition')
      .split(';')[1]
      .split("filename*=UTF-8''")[1]
    const fileNameUnicode = response.headers
      .get('Content-Disposition')
      .split('filename*=')[1]
    if (fileNameUnicode) {
      // 当存在 filename* 时，取filename* 并进行解码（为了解决中文乱码问题）
      fileName = decodeURIComponent(fileNameUnicode.split("''")[1])
    }
  }
  if (isIE) {
    // @ts-ignore
    navigator.msSaveBlob(response, fileName)
    // 可能会出现有body的情况
    // navigator.msSaveBlob(response.body, fileName)
  } else {
    // 响应文件 文件流做为路径
    const objectUrl = window.URL.createObjectURL(response)
    // 可能会出现有body的情况
    // const objectUrl = window.URL.createObjectURL(response.body)
    // 创建a标签 达到下载效果
    const a = document.createElement('a')
    a.addEventListener('click', () => {
      a.download = fileName
      a.href = objectUrl
    })
    const e = document.createEvent('MouseEvents')
    e.initEvent('click', false, false)
    a.dispatchEvent(e)
  }
}
