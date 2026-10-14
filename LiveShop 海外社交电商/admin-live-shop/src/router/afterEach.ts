import {RouteLocationNormalized} from "vue-router"
import appPinia from "@/pinia/app"
import {getObjectPath} from "@/utils/utils"
import cloneDeep from "lodash/cloneDeep.js"

/**
 * 更新当前路由
 * @param to
 */
function updateCurrentRouter(to: any) {
    const appStore = appPinia()
    appStore.currentRouter = {...to}
}

/**
 * 更新路由路径
 * @param to
 */
function updatePaths(to: any) {
    const appStore = appPinia()
    const paths = getObjectPath({arr: appStore.treeMenus, id: to.meta.id})
    appStore.paths = (paths && paths.reverse()) || []
}

/**
 * 更新标签
 * @param current
 */
function updateTabs(current: any) {
    const appStore = appPinia()
    const {href, hash, name, path, query, meta} = current
    const tag = appStore.tabs.find((item: any) => item.meta.id === meta.id)
    if (!tag && meta.id) {
        meta.tempPath = path // 主要解决临时动态路由
        appStore.tabs.push(cloneDeep({href, hash, name, path, query, meta}))
    }
}

const afterEach = (to: RouteLocationNormalized) => {
    updateCurrentRouter(to)
    updatePaths(to)
    updateTabs(to)
}

export default afterEach
