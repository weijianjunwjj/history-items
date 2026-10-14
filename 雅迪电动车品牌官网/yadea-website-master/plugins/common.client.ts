/*
 * @Author: weijianjun
 * @Date: 2023-02-22 13:54:16
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-27 10:25:48
 * @FilePath: \yadea-website\plugins\demo.ts
 * @Description:
 *
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      jumpTo: (url: string) => {
        if (url) {
          useRouter().push(url)
        }
      },
      openWin: (url: string) => {
        window.open(url)
      }
    }
  }
})
