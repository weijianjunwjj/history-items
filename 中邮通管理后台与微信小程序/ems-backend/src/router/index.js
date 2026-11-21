import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { basicRoutes, EMPTY_ROUTE, NOT_FOUND_ROUTE } from './routes'
import { getToken, isNullOrWhitespace } from '@/utils'
import { useUserStore, usePermissionStore } from '@/store'
import api from '@/views/modules/system-management/role-management/api.js'

const Layout = () => import('@/layout/index.vue')
const isHash = import.meta.env.VITE_USE_HASH === 'true'
const modules = import.meta.glob('@/views/**/**.vue')
console.log('modules :>> ', modules)
// 模块路由(基于 Layout)
const moduleRoutes = {
  path: '/',
  name: 'main',
  children: [],
  component: Layout,
}

export const router = createRouter({
  history: isHash ? createWebHashHistory('/') : createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app) {
  await addDynamicRoutes()
  setupRouterGuard(router)
  app.use(router)
}

export async function resetRouter() {
  const basicRouteNames = getRouteNames(basicRoutes)
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (!basicRouteNames.includes(name)) {
      router.removeRoute(name)
    }
  })
}

function getIcon(menu) {
  const { parentId, icon: icon0, url } = menu
  if (parentId === 0) {
    const str = url.substring(1)
    const icon = icon0 || str
    return icon
  }else{
    return ''
  }

  // if (parentId !== 0) {
  //   return ''
  // }

  return icon0
}
function getIsHidden(menu) {
  return menu.url == '/' ? true : ![0, 1].includes(menu.type)
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 */
function fnAddDynamicMenuRoutes(menuList = []) {
  const temp = []

  for (let i = 0; i < menuList.length; i++) {
    const menu = menuList[i]
    // console.log('menu :>> ', menu)
    const route = {
      path: menu.url,
      component: null,
      name: menu.url?.replace(/\//g, '_').replace(/^_/, ''),
      redirect: null,
      isHidden: getIsHidden(menu),
      meta: {
        id: menu.menuId,
        title: menu.name,
        customIcon: getIcon(menu),
        order: menu.orderNum,
      },
    }

    if (menu.url === '/') {
      const myMenuList = menuList.filter((item) => item.type == 1)
      const home_path = myMenuList[0].url || myMenuList[0]?.children[0].url
      route.redirect = home_path
    } else {
      if (menu.children?.length) {
        route.redirect = menu.children[0].url
      }
    }

    // console.log('menu :>> ', menu)
    // console.log('menu.url :>> ', menu.url)

    const key = `/src/views/modules${menu.url}/index.vue`
    const val = modules[key]

    // console.log('key :>> ', key)
    // console.log('val :>> ', val)

    route.component = val
    if (menu.children && menu.children.length > 0) {
      route.children = fnAddDynamicMenuRoutes(menu.children)
    }
    temp.push(route)
  }
  return temp
}

async function getMenus() {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 调用2个接口
  const VUE_NAIVE_ADMIN_USERINFO = JSON.parse(localStorage.getItem('VUE_NAIVE_ADMIN_USERINFO'))
  console.error('VUE_NAIVE_ADMIN_USERINFO :>> ', VUE_NAIVE_ADMIN_USERINFO)
  const access = userStore.access || VUE_NAIVE_ADMIN_USERINFO?.value.access
  console.log('access :>> ', access)
  // if (!access) {
  //   await permissionStore.getUserInfo()
  // }
  const [res1, res2] = await Promise.all([api.getListByRoleMenu(access), api.getListNoPageMenu()])
  const selMenuIds = res1.data
  const listRaw = res2.data
  const listMatched = []
  listRaw.forEach((item, index, array) => {
    item.key = item.menuId.toString()
    item.label = item.name
    if (item.children == null && selMenuIds.filter((item) => item === item.menuId)) {
      listMatched.push(item)
    } else {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.children = []
      item.children?.forEach((item2, index) => {
        item2.key = item2.parentId.toString() + item2.menuId.toString()
        item2.label = item2.name
        if (selMenuIds.some((item) => item === item2.menuId)) {
          newItem.children.push(item2)
        }
        if (index === item.children.length - 1) {
          if (newItem.children.length) {
            listMatched.push(newItem)
          }
        }
      })
    }
  })
  console.log('listMatched :>> ', listMatched)
  if (listMatched?.length) {
    return fnAddDynamicMenuRoutes(listMatched)
    // return fnAddDynamicMenuRoutes(listMatched.filter((item) => item.type != 2))
  }
}

export async function addDynamicRoutes() {
  const token = getToken()

  // 没有token情况
  if (isNullOrWhitespace(token)) {
    router.addRoute(EMPTY_ROUTE)
    return
  }

  // 有token的情况
  try {
    const permissionStore = usePermissionStore()
    const userStore = useUserStore()
    const userId = userStore.userId
    await userStore.getUserInfo()
    const asyncRoutes2 = await getMenus()
    const my_moduleRoutes = await permissionStore.generateRoutes(asyncRoutes2)
    const my_routes = [
      {
        ...moduleRoutes,
        children: my_moduleRoutes,
        redirect: { name: my_moduleRoutes.length ? my_moduleRoutes[0].name : '404' },
      },
      { path: '/:catchAll(.*)', redirect: { name: '404' } },
    ]
    console.log('my_routes :>> ', my_routes)

    my_routes.forEach((item) => {
      router.addRoute(item)
      router.options.routes.push(item)
    })
    window.SITE_CONFIG = {
      route: my_moduleRoutes,
    }
    router.hasRoute(EMPTY_ROUTE.name) && router.removeRoute(EMPTY_ROUTE.name)
    router.addRoute(NOT_FOUND_ROUTE)
  } catch (error) {
    console.error(error)
  }
}

export function getRouteNames(routes) {
  return routes.map((route) => getRouteName(route)).flat(1)
}

function getRouteName(route) {
  const names = [route.name]
  if (route.children && route.children.length) {
    names.push(...route.children.map((item) => getRouteName(item)).flat(1))
  }
  return names
}
