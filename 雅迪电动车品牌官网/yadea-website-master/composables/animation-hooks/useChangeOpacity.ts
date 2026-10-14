import { Ref } from 'nuxt/dist/app/compat/vue-demi'
import { isInView } from '../common'

/* 
  dom元素透明度变化
  parentDom: 要监听是否出现在窗口的dom的ref
  dom: 要操作的dom元素的ref
  className: 动画属性的class
  onlyDown: 是否仅向下滑动时出现动画(默认为false)
*/
export function useChangeOpacity(parentDom: Ref, dom: Ref[], className: string, onlyDown = false) {
  interface IRect {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
    x: number
    y: number
  }
  let vWidth = $ref<number>(0)
  let vHeight = $ref<number>(0)
  let rect = $ref<IRect>()
  function handleScrollBar() {
    if (process.client) {
      vWidth = window.innerWidth || document.documentElement.clientWidth
      vHeight = window.innerHeight || document.documentElement.clientHeight
      rect = parentDom.value.getBoundingClientRect()
      if (!onlyDown) {
        // 浏览器文档显示区的宽度
        // 浏览器文档显示区的高度
        // dom元素不在窗口中
        if (rect!.right < 0 || rect!.bottom < 0 || rect!.left > vWidth || rect!.top > vHeight) {
          // dom.forEach(item => {
          //   item.value.classList.remove(className)
          // })
        } else {
          // dom元素出现在浏览器窗口中
          dom.forEach(item => {
            item.value.classList.add(className)
          })
          // dom.value.classList.add(className)
        }
      } else {
        if (isInView(parentDom.value)) {
          // dom.value.classList.add(className)
          dom.forEach(item => {
            item.value.classList.add(className)
          })
        } else {
          // dom.value.classList.remove(className)
          // dom.forEach(item => {
          //   item.value.classList.remove(className)
          // })
        }
      }
    }
  }
  onMounted(() => {
    handleScrollBar()
    window.addEventListener('scroll', handleScrollBar)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollBar)
  })
}
