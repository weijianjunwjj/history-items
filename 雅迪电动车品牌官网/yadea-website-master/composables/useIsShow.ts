/*
 * @Author: yqq
 * @Date: 2023-01-04 16:53:15
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-07 10:08:03
 * @FilePath: \yadea-website\composables\useIsShow.ts
 * @Description:
 *
 */
import { isInView } from './common'

export function useIsShow(className: string) {
  const isShow = ref(false)

  function handleScroll() {
    if (process.client) {
      const dom: HTMLElement = document.querySelector(className)!

      if (isInView(dom)) {
        isShow.value = true
      } else {
        isShow.value = false
      }
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  return { isShow }
}
