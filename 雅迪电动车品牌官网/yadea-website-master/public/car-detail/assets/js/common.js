/*
 * @Author: yqq
 * @Date: 2023-03-03 20:31:20
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-11 16:41:01
 * @FilePath: \website\public\car-detail\assets\js\common.js
 * @Description:
 *
 */
const url = 'http://114.55.124.233:1337/api/'
function replaceImgUrl(url) {
  return url ? url.replace('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/', 'https://osswebsite.yadea.com.cn/') : ''
}

function toInt() {
  window.open('https://www.yadea.com/')
}
function toDY() {
  location.href = 'https://v.douyin.com/eWF9guG/'
}
function toWB() {
  location.href = 'https://m.weibo.cn/u/1940087542'
}

$.ajax(`${url}website-grayed`, {
  type: 'GET',
  dataType: 'json',
  success: ({ data }) => {
    console.log(data)
    if (data.attributes.status) {
      document.body.classList.add('allPageGrey')
    } else {
      document.body.classList.remove('allPageGrey')
    }
  },
  error: res => {
    console.log(res)
  }
})
;(function (a, h, c, b, f, g) {
  a['UdeskApiObject'] = f
  a[f] =
    a[f] ||
    function () {
      ;(a[f].d = a[f].d || []).push(arguments)
    }
  g = h.createElement(c)
  g.async = 1
  g.charset = 'utf-8'
  g.src = b
  c = h.getElementsByTagName(c)[0]
  c.parentNode.insertBefore(g, c)
})(window, document, 'script', 'https://assets-cli.udesk.cn/im_client/js/udeskApi.js', 'ud')
ud({
  code: '4503dde0',
  link: 'https://yadea.udesk.cn/im_client/?web_plugin_id=94631',
  targetSelector: '.online-kf-id',
  selector: '.online-kf-id'
})
