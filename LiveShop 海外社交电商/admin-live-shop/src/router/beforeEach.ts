import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import appPinia from '@/pinia/app';
import { userInfo } from '@/api/login';
import { RouterComponent } from 'src/type';
import router from '@/router/index';
import isArray from 'lodash/isArray.js';
import { processRoutes } from '@/utils/utils';
import { getMenu } from '@/api/system/auth';
import { getDictSn } from "@/api/login"

const namespace = 'main';
//框架页面组件
const views: Record<string, RouterComponent> = import.meta.glob(
    '@/view/**/*.vue',
    { eager: true }
);

function findComponent(filePath: string) {
    const key = Object.keys(views).find(path => {
        return path.toLowerCase().indexOf(filePath.toLowerCase()) > -1;
    });

    if (key != undefined) {
        return filePath && views[key] && views[key].default;
    } else {
        return null;
    }
}

function addRouter(item: any) {
    if (item.component) {
        const componentPath: string = `/view/${item.component}/index.vue`
        const component = findComponent(componentPath);
        if (component) {
            if (item.level == 2) {
                const obj = {
                    path: `/${item.component}`,
                    name: item.title,
                    component,
                    meta: item,
                };
                router.addRoute(item.namespace ? item.namespace : namespace, obj);
            } else {
                router.addRoute(item.namespace ? item.namespace : namespace, {
                    path: item.router,
                    name: item.title,
                    component,
                    meta: item,
                });
            }
        }
    }
}

/**
 * 创建路由组件
 * @param allMenus
 */
function createRouterComponent(allMenus: any) {
    allMenus.forEach((item: any) => {
        addRouter(item);
        if (isArray(item.children)) {
            createRouterComponent(item.children);
        }
    });
}

/**
 * 校验路由是否在白名单中
 * @param path
 */
function hasWhiteRouter(path: string) {
    const appStore = appPinia();
    return appStore.configOptions.whiteList.some(
        (e: string) => path.indexOf(e) === 0
    );
}

/**
 * 是否登录
 */
function hasUserInfo() {
    const appStore = appPinia();
    return Object.keys(appStore.userInfo).length !== 0;
}

/**
 * 获取并更新用户信息
 * @param to
 * @param from
 * @param next
 */
function getUserInfo(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const appStore = appPinia();
    userInfo()
        .then(res => {
            appStore.userInfo = res.data;
            updateRouterAll(to, from, next);
        })
        .catch(() => {
            // 退出登录
            next(appStore.configOptions.resetPath);
        });
}

/**
 * 获取后端接口菜单数据
 * @param to
 * @param from
 * @param next
 */
async function updateRouterAll(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const appStore = appPinia();
    if (appStore.hasRoles) {
        next();
    } else {
        const appStore = appPinia();
        // 已登录并且没有菜单去获取菜单
        if (!appStore.treeMenus?.length) {
            const res = await getMenu();
            appStore.treeMenus = processRoutes(res.data);
        }
        getPublicDictionary() //获取通用字典存储pinia
        createRouterComponent(appStore.treeMenus);
        next(to.fullPath);
        appStore.hasRoles = true;
    }
}

function getPublicDictionary() {
    if (!appStore.fileUrlPre) {
        const appStore = appPinia();
        getDictSn("FILE_URL_PRE").then((res: any) => {
            if (res.code === 0) {
                appStore.fileUrlPre = res?.data?.list[0]?.value
            }
        })
    }

}

const beforeEach = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    // 如果是白名单路径，或者菜单已经添加过了，直接放行
    if (
        hasWhiteRouter(to.path) ||
        window.SITE_CONFIG['dynamicMenuRoutesHasAdded']
    ) {
        next(); // 直接调用 next 并 return，避免继续执行后续代码
        return;
    }

    // 如果用户信息已存在
    if (hasUserInfo()) {
        await updateRouterAll(to, from, next); // 调用 updateRouterAll，确保在异步函数内只调用一次 next
        return; // 防止继续调用 getUserInfo
    }

    // 否则获取用户信息
    getUserInfo(to, from, next);
};


export default beforeEach;
