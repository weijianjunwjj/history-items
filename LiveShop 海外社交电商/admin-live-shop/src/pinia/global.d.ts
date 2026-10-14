// global.d.ts
import appPinia from './app';  // 引入你的 store 定义

declare global {
  var appStore: ReturnType<typeof appPinia>;  // 声明 appStore 的类型为 appPinia() 的返回类型
}

export {};