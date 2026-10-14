import type { Router, LocationQueryRaw } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import { useUserStore } from '@/store'
import { isLogin } from '@hx/packages/utils'
import { storeToRefs } from 'pinia'

export const pageRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@hx/packages/views/login/index.vue'),
    meta: {
      requiresAuth: false,
      isWX: true,
    },
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/map/index.vue'),
  },
  {
    path: '/wx-login',
    name: 'wx-login',
    component: () => import('@/views/wx-login/index.vue'),
  },
  {
    path: '/wx-bind-code',
    name: 'wx-bind-code',
    component: () => import('@/views/wx-bind-code/index.vue'),
  },
  {
    path: '/notFound',
    name: 'notFound',
    component: () => import('@hx/packages/views/not-found/index.vue'),
  },
]

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute(route: any, _pageRoutes: any) {
  let temp: any = []
  for (let i = 0; i < _pageRoutes.length; i++) {
    if (route.path === _pageRoutes[i].path) {
      return true
    }
    if (_pageRoutes[i].children && _pageRoutes[i].children.length >= 1) {
      temp = temp.concat(_pageRoutes[i].children)
    }
  }

  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

export default function setupPermissionGuard(router: Router) {
  NProgress.start()
  // eslint-disable-next-line consistent-return
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const { routerList } = storeToRefs(userStore)
    userStore.setLoading(true)
    // 已登录 去的是登录页面

    if (
      window.SITE_CONFIG.dynamicMenuRoutesHasAdded ||
      fnCurrentRouteIsPageRoute(to, pageRoutes)
    ) {
      return next()
    }

    await userStore.info()
    await userStore.getEnterprise()
    await userStore.getAgentParents()
    await userStore.getRouterList()
    routerList.value.forEach((item) => {
      router.addRoute('root', item)
    })

    router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: { name: 'notFound' },
    })
    // router.addRoute({
    //   name: 'codeService_userAdmin_personSetting',
    //   path: '/person-setting',
    //   component: () =>
    //     import('@/views/code-service/user-admin/person-setting/index.vue'),
    //   meta: {
    //     title: '用户设置',
    //     requiresAuth: true,
    //     activeMenu: 'codeService_userAdmin',
    //     order: 0,
    //     hideInMenu: true,
    //   },
    // })

    userStore.setRouterList(routerList.value)

    window.SITE_CONFIG.dynamicMenuRoutesHasAdded = true

    if (to.path === '/') {
      next({
        name: routerList.value[0].name,
        query: {
          ...to.query,
        },
      })
    } else {
      next({ ...to, replace: true })
    }
    // if (isLogin() && to.name === 'login') {
    //   if (routerList.value.length === 0) {
    //     // 菜单为空直接放行
    //     next()
    //   } else {
    //     // 菜单不为空 回到首页
    //     await userStore.info()
    //     await userStore.getEnterprise()
    //     await userStore.getAgentParents()
    //     next({ path: '/' })
    //   }
    // } else if (isLogin() && to.name !== 'login') {
    //   await userStore.info()
    //   await userStore.getEnterprise()
    //   await userStore.getAgentParents()
    //   if (routerList.value.length === 0) {
    //     // 已登录但是没有用户菜单
    //     await userStore.getRouterList()
    //     routerList.value.forEach((item) => {
    //       router.addRoute('root', item)
    //     })
    //     router.addRoute({
    //       path: '/:pathMatch(.*)*',
    //       name: 'notFound',
    //       component: () => import('@hx/packages/views/not-found/index.vue'),
    //     })
    //     router.replace({
    //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //       name: to.name!,
    //       query: {
    //         ...to.query,
    //       },
    //     })
    //   }
    //   if (to.path === '/') {
    //     next({
    //       name: routerList.value[0].name,
    //       query: {
    //         ...to.query,
    //       },
    //     })
    //   } else {
    //     next()
    //   }
    //   next()
    // } else if (!isLogin() && to.name === 'login') {
    //   // 未登录 去的是登录页面
    //   next()
    // } else if (!isLogin() && to.name !== 'login') {
    //   // 未登录 去的不是登录页面
    //   next({ name: 'login' })
    // }
  })

  router.afterEach(() => {
    NProgress.done()
    const userStore = useUserStore()
    userStore.setLoading(false)
  })
}
