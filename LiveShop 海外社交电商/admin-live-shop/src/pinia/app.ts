import { defineStore } from 'pinia';
import config from '@/config';
import { processRoutes } from '@/utils/utils';
import { getMenu } from '@/api/system/auth';

const paths = ['userSetting'],
    id = 'app';
const appLocal = window.localStorage.getItem(id);
if (appLocal) {
    const { userSetting } = JSON.parse(appLocal);
    if (userSetting.lasting) {
        paths.push('tabs');
    }
}

interface UserSetting {
    layoutName: string; // 主题名称
    themeColor: string; // 主题颜色
    themeErrorColor: string; // 主题颜色
    themeSuccessColor: string; // 主题颜色
    themeWarningColor: string; // 主题颜色
    themeName: null | string; // 主题模式 深色 和 白色
    language: null | string; // 语言
    tabsStyle: string; // 标签风格
    lasting: boolean; // 标签持久化
    gray: boolean; // 灰色模式
    weak: boolean; // 色弱模式
    isFullscreen: boolean; // 全屏模式
    animation: string; // 类型 参考animation.css
    disableAnimation: boolean; // 动画
    permissions: Array<string>; // 权限数组
    keepAlive: boolean; // 是否缓存
}

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

const app = defineStore({
    id,
    persist: {
        storage: window.localStorage,
        paths,
    },
    // 持久化存储插件其他配置
    state: () => {
        return {
            browser: {}, // 当前浏览器信息
            configOptions: config, // 框架配置
            collapsed: false, // 是否折叠
            mobile: false, // 是否移动端
            userSetting: <UserSetting>{
                // 主题设置
                layoutName: 'ml', // 主题名称
                themeColor: '#2d8cf0', // 主题颜色
                themeErrorColor: '#ed4014', // 主题颜色
                themeSuccessColor: '#19be6b', // 主题颜色
                themeWarningColor: '#ff9900', // 主题颜色
                themeName: null, // 主题模式 深色 和 白色
                language: 'zhCN', // 语言
                tabsStyle: 'sutra', // 标签风格
                lasting: true, // 标签持久化
                gray: false, // 灰色模式
                weak: false, // 色弱模式
                isFullscreen: false, // 全屏模式
                animation: 'animate__backInLeft', // 类型 参考animation.css
                disableAnimation: false, // 动画
                keepAlive: false, // 是否缓存
            },
            userInfo: {},
            userState: false,
            treeMenus: <RouteItem[]>[], // 渲染的菜单
            allMenus: [],
            permissions: [], // 权限节点
            paths: [], // 路由路径
            tabs: <any>[], // 标签
            hasRoles: false, // 是否加载菜单
            currentRouter: {}, // 当前路由信息
            fileUrlPre: "", // 文件链接前缀
        };
    },
    getters: {
        getTabs(state) {
            return state.tabs.sort(
                (a, b) => (b.meta.order || 0) - (a.meta.order || 0)
            );
        },
    },
    actions: {
        // 添加 reset 方法，重置所有状态
        reset() {
            this.$reset();
        },
        async setMenuList() {
            const res = await getMenu();
            this.treeMenus = processRoutes(res.data);
            return res;
        },
    },
});

export default app;
