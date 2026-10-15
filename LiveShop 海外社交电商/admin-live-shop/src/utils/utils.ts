import cloneDeep from 'lodash/cloneDeep.js';
import { renderIcon } from '@/config/icon';
import isArray from 'lodash/isArray';
import { getList } from '@/api/system/menu';
import appPinia from '@/pinia/app';
import dayjs from 'dayjs'

const removeElements = (tree: any): void => {
  for (let i = tree.length - 1; i >= 0; i--) {
    const node = tree[i];
    if (node.level >= 3) {
      tree.splice(i, 1); // 从父节点的 children 数组中移除当前节点
    } else if (node.children) {
      removeElements(node.children); // 递归处理子节点
      if (node.children.length === 0) {
        delete node.children; // 如果子节点为空数组，则删除 children 字段
      }
    }
  }
};

const reBuildIcon = (allMenus: any) => {
  const data: any = [];
  allMenus?.forEach((item: any) => {
    if (item.icon) {
      item.icon = renderIcon(item.icon || '');
    } else {
      delete item.icon;
    }
    if (isArray(item.children)) {
      item.children = reBuildIcon(item.children || []);
    }
    data.push(item);
  });

  return data;
};

/**
 * 生成链路
 * @param arr
 * @param id
 */
const getObjectPath = ({ arr = <any>[], id = '' }) => {
  const data = cloneDeep(arr);
  for (const i in arr) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(i)) {
      if (arr[i].id === id) {
        return [data[i]];
      }
      if (data[i].children) {
        const node: any = getObjectPath({ arr: data[i].children, id });
        if (node !== undefined) {
          return node.concat(data[i]);
        }
      }
    }
  }
};

interface RouteItem {
  id: number;
  title: string;
  fid: number;
  url: string;
  auth: number;
  sort: number;
  show: number;
  icon: string;
  level: number;
  component: string;
  router: string;
  log: number;
  permission: number;
  method: number;
  children?: RouteItem[];
}

const data: RouteItem[] = [
  // 你的路由数据
];

export function processRoutes(routes: RouteItem[], parentPath = ''): RouteItem[] {
  if (!Array.isArray(routes)) return [];
  return routes.map(route => {
    const path = route.router || route.component || '';
    const router = (path.startsWith('/') ? path : `${parentPath}/${path}`)
      .replace(/\/+/g, '/');
    return {
      ...route,
      router,
      ...(route.children ? { children: processRoutes(route.children, router) } : {}),
    };
  });
}

export async function getMenuList() {
  const appStore = appPinia();
  const res = await getList(null);
  appStore.treeMenus = processRoutes(res.data);
}

function htmlElementClass(
  state: boolean,
  clsName: string,
  target?: HTMLElement
) {
  const targetEl = target || document.body;
  if (state) {
    targetEl.classList.add(clsName);
  } else {
    targetEl.classList.remove(clsName);
  }
}

export function resetIcons(menuItems) {
  menuItems.forEach(item => {
    // 将每个节点的 icon 属性设置为 null
    item.icon = null;

    // 如果有子菜单，递归调用
    if (item.children && item.children.length > 0) {
      resetIcons(item.children);
    }
  });
}

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export function formatDate(dateString: string) {
  if (!dateString) return '';

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回的月份是从0开始的，所以需要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 使用模板字符串返回格式化的日期时间
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// uuid
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

export function forin(a, b) {
  for (const key in b) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * @description: 数据类型的检测的方式
 * @param {any} data 要检测数据类型的变量
 * @param {string} type 具体的类型名称【小写】
 */
export const is = (type, data) => {
  return (
    Object.prototype.toString
      .call(data)
      .replace(/\[object (\w+)\]/, '$1')
      .toLowerCase() === type
  );
};

export function getUrl(url: string) {
  if (typeof url !== 'string' || !url) return '';
  const curUrl = appPinia().fileUrlPre || '/api/';
  const legacyPrefix = 'https://files.njyykj.com/';
  if (url.startsWith(legacyPrefix)) return curUrl + url.slice(legacyPrefix.length);
  if (/^(https?:|data:|blob:|\/)/i.test(url)) return url;
  return curUrl.replace(/\/?$/, '/') + url;
}

export function removeCurUrlPrefix(url: string) {
  const curUrl = appPinia().fileUrlPre; // 当前前缀
  if (is('string', url)) {
    if (url.startsWith(curUrl)) {
      return url.replace(curUrl, ''); // 去掉前缀
    } else {
      return url; // 原样返回
    }
  } else {
    console.error(`${url} is not string`);
  }
}


/**
 * 计算年龄
 * @param {string} birthDate - 出生日期，格式为 'YYYY-MM-DD'
 * @returns {number} - 年龄
 */
export function calculateAge(birthDate) {
  const currentDate = dayjs()
  return currentDate.diff(birthDate, 'year')
}

export const isEmptyObj = (val) => JSON.stringify(val) === '{}'

export const isEmptyArr = (val) => JSON.stringify(val) === '[]'

export const isEmpty = (val) =>
  [undefined, null, ''].some((item) => item === val) || isEmptyObj(val) || isEmptyArr(val)

export const noEmpty = (val) =>
  [undefined, null, ''].every((item) => item !== val) && !isEmptyObj(val) && !isEmptyArr(val)

export function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 补零
  const day = String(now.getDate()).padStart(2, '0'); // 补零

  return `${year}-${month}-${day}`;
}

export function getYesterdayDate() {
  const now = new Date();
  now.setDate(now.getDate() - 1); // 将当前日期减去一天

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 补零
  const day = String(now.getDate()).padStart(2, '0'); // 补零

  return `${year}-${month}-${day}`;
}

export function getLast7DaysInReverse() {
  const dates = [];
  const today = new Date(); // 获取当前日期
  today.setDate(today.getDate() - 1); // 昨天的日期

  for (let i = 6; i >= 0; i--) { // 倒序循环
    const date = new Date(today); // 克隆日期对象
    date.setDate(today.getDate() - i); // 从 7 天前开始推算
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 补齐两位
    const day = String(date.getDate()).padStart(2, '0'); // 补齐两位
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

export const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
};

export const isVideo = (url) => {
  return /\.(mp4|webm|ogg|mov|avi|flv|mkv)$/i.test(url);
};

export { removeElements, getObjectPath, htmlElementClass, reBuildIcon };
