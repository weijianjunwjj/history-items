import {RouteRecordRaw} from "vue-router"
import Main from "@/layout/index.vue"
import {renderIcon} from "@/config/icon"
const routerMap: Array<RouteRecordRaw> = [
    {
        path: "/:W+",
        component: () => import("@/view/single/error/404.vue"),
    },
    {
        path: "/",
        name: "main",
        component: () => import("@/layout/index.vue"),
        redirect: "home",
        children: [],
    },
    {
        path: "/login", name: "login", meta: {title: "登录"},
        component: () => import("@/view/login/index.vue"),
    },
    {
        path: "/",
        name: "_home",
        component: Main,
        children: [
            {
                path: "/home", name: "home", meta: {title: "首页", icon: renderIcon("ionicons5-HomeOutline")},
                component: () => import("@/view/single/home/index.vue"),
            },
            {
                path: "/own", name: "own", meta: {title: "用户中心", icon: renderIcon("ionicons5-HomeOutline")},
                component: () => import("@/view/single/own/index.vue"),
            }
        ]
    }
]

export default routerMap
