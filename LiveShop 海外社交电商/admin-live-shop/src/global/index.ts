import {
  breakpointsTailwind,
  useBreakpoints,
  useEventListener,
  useThrottleFn,
} from '@vueuse/core';
import appStore from '@/pinia/app';
import { htmlElementClass } from '@/utils/utils';
import to from 'await-to-js';
/**
 * 监听窗口
 */
const throttledFn = useThrottleFn(() => {
  const app = appStore();
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const xs = breakpoints.smaller('sm');
  const sm = breakpoints.between('sm', 'md');
  const md = breakpoints.between('md', 'lg');
  const lg = breakpoints.between('lg', 'xl');
  const xl = breakpoints.between('xl', '2xl');
  const xxl = breakpoints['2xl'];
  app.browser = { xs, sm, md, lg, xl, xxl };
  app.mobile = xs.value;
  app.collapsed = sm.value || md.value;
}, 200);

/**
 * 更新灰色模式
 * @constructor
 */
const updateHtmlGray = () => {
  const app = appStore();
  htmlElementClass(app.userSetting.gray, 'bag-grey');
};

/**
 * 更新色弱模式
 * @constructor
 */
const updateHtmlWeak = () => {
  const app = appStore();
  htmlElementClass(app.userSetting.weak, 'bag-weak');
};

const setupGlobal = () => {
  throttledFn().then(() => useEventListener(window, 'resize', throttledFn));
  
  // 使用 Object.defineProperty 劫持 to promise错误
  Object.defineProperty(globalThis, 'to', {
    get() {
      return to;
    },
  });
};

export default setupGlobal;
export { updateHtmlGray, updateHtmlWeak };
