import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import appPinia from '@/pinia/app';
import { userInfo, getDictSn } from '@/api/login';
import router from '@/router/index';
import localStore from '@/utils/localStore';

const views = import.meta.glob('@/view/**/*.vue');

function createRouterComponent(menus: any[]) {
    menus.forEach(item => {
        const key = Object.keys(views).find(path => path.endsWith(`/view/${item.component}/index.vue`));
        if (item.component && key && views[key]) {
            router.addRoute(item.namespace || 'main', {
                path: item.router || `/${item.component}`,
                name: `menu-${item.id}`,
                component: views[key],
                meta: item,
            });
        }
        if (Array.isArray(item.children)) createRouterComponent(item.children);
    });
}

const beforeEach = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const appStore = appPinia();
    if (appStore.configOptions.whiteList.some(path => to.path.startsWith(path))) {
        next();
        return;
    }
    if (!localStore.get('token')) {
        next(appStore.configOptions.resetPath);
        return;
    }
    try {
        if (!Object.keys(appStore.userInfo).length) {
            const res = await userInfo();
            appStore.userInfo = res.data;
        }
        if (!appStore.hasRoles) {
            if (!appStore.treeMenus.length) await appStore.setMenuList();
            createRouterComponent(appStore.treeMenus);
            appStore.hasRoles = true;
            window.SITE_CONFIG.dynamicMenuRoutesHasAdded = true;
            getDictSn('FILE_URL_PRE').then(res => {
                appStore.fileUrlPre = res.data?.list?.[0]?.value || '/api/';
            }).catch(() => { appStore.fileUrlPre = '/api/'; });
            next({ path: to.fullPath, replace: true });
            return;
        }
        next();
    } catch {
        localStore.remove('token');
        appStore.$reset();
        window.SITE_CONFIG.dynamicMenuRoutesHasAdded = false;
        next(appStore.configOptions.resetPath);
    }
};

export default beforeEach;
