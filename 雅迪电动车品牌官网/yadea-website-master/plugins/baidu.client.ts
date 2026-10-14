/*
 * @Author: miaoyuxuan
 * @Date: 2023-03-06 20:23:06
 * @LastEditors: miaoyuxuan
 * @LastEditTime: 2023-03-06 20:24:22
 * @FilePath: /yadea-website/plugins/baidu.client.ts
 * @Description:
 *
 */
export default () => {
  /*
   ** 每次路由变更时进行统计
   */
  useRouter().afterEach((to, from) => {
    ;(function () {
      const hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?7c177e3df1f6df3eb7c75abdf28ba97e'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode?.insertBefore(hm, s)
    })()
  })
}
