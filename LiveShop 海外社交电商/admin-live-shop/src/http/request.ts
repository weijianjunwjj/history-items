import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import localStore from '@/utils/localStore';
import appPinia from '@/pinia/app';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  hint?: boolean;
}

const http: AxiosInstance = axios.create({ timeout: 15000 });

axiosRetry(http, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: retryCount => retryCount * 1500, // 间隔时间
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const appStore = appPinia();
    config.headers['X-TOKEN'] = localStore.get('token');
    config.baseURL = appStore.configOptions.baseUrl;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const logout = () => {
  localStore.remove('app');
  localStore.remove('token');
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false;
  const appStore = appPinia();
  appStore.$reset();
  http.$router.push(http.$configOptions.resetPath);
};

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status, config } = response;

    // 对响应数据做点什么
    const newToken = response.headers?.['new-token'];
    const newExpiresAt = response.headers?.['new-expires-at'];
    if (newToken && newExpiresAt) {
      // 更新本地存储的 token 和过期时间
      localStore.set('token', newToken);
      localStore.set('expiresAt', newExpiresAt);
    }

    if (status === 200 && config.responseType === 'blob') {
      // 下载文件流
      return Promise.resolve(data);
    }
    if (status == 401) {
      logout();
      return Promise.reject(false);
    }
    if (data.code === 0) {
      // 正常的文本数据返回
      return Promise.resolve(data);
    } else if (data.code === 14) {
      logout();
      return Promise.reject(false);
    } else {
      window.$message?.error(data.msg || '请求失败');
      return Promise.reject({
        code: data.code,
        details: data.details,
        msg: data.msg,
      });
    }
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      logout();
      return Promise.reject(error);
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        code: 'timeout',
      });
    }
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject({
        code: 'canceled',
      });
    }
    return Promise.reject(error);
  }
);

const post = (url: string, params?: any, config?: CustomAxiosRequestConfig) => {
  return http.post(url, params, config);
};

const get = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return http.get(url, { params, ...config });
};

const remove = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return http.delete(url, {
    ...config,
    data: params, // 将 params 放入 data 中以传递请求体
  });
};

export { post, get, remove, http as axios };
