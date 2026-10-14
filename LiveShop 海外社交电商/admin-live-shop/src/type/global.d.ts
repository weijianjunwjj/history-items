// 声明 SiteConfig 接口
interface SiteConfig {
  dynamicMenuRoutesHasAdded: boolean;
  // 你可以继续添加其他属性
  // example: apiBaseUrl: string;
}

// 扩展全局 window 对象
declare global {
  interface Window {
    SITE_CONFIG: SiteConfig;
    $message: {
      success(msg: string): void;
      error(msg: string): void;
      warning(msg: string): void;
      info(msg: string): void;
      // 你可以继续添加其他方法
    };
  }
  /**
   * A helper function to handle promises with simplified error handling.
   * 
   * @param promise The promise to resolve.
   * @param errorExt Optional additional information to pass to the error object.
   * @return A promise that resolves to a tuple [error, data].
   */
  function to<T, U = Error>(
    promise: Promise<T>,
    errorExt?: object
  ): Promise<[U, undefined] | [null, T]>;
}

interface ImportMeta {
  glob: (pattern: string, options?: { eager?: boolean }) => Record<string, RouterComponent>;
  // 如果你需要 globEager，也可以扩展它
  globEager: (pattern: string) => Record<string, RouterComponent>;
}

interface RouterComponent {
  // 根据你的路由组件类型来定义
  [key: string]: any;
}

// 必须导出一个空模块，以确保这是一个模块
export {};