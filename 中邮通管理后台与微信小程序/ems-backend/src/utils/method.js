/**
 * 全局方法
 */
import $bus from './$bus.js'
export default function (app) {
  const g = app.config.globalProperties
  // 添加发布订阅模式
  g.$bus = $bus
}
