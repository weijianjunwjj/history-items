import { App } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import appPinia from '@/pinia/app';
import { updateHtmlGray, updateHtmlWeak } from '@/global';

const pinia = createPinia();

function initStore(app: App) {
  const appStore = appPinia();
  const { configOptions } = app.config.globalProperties;
  appStore.configOptions = configOptions;
  updateHtmlGray();
  updateHtmlWeak();
}

const setupPinia = (app: App) => {
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
  initStore(app);
  const appStore = appPinia();
  // 使用 Object.defineProperty 劫持 store 访问
  Object.defineProperty(globalThis, 'appStore', {
    get() {
      return appStore;
    },
  });
};

export default setupPinia;
