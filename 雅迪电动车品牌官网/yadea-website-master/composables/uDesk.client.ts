/*
 * @Author: miaoyuxuan
 * @Date: 2023-03-08 17:13:16
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-09 16:47:21
 * @FilePath: \yadea-website\composables\uDesk.client.ts
 * @Description: uDesk配置
 *
 */
export function uDesk() {
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
}
