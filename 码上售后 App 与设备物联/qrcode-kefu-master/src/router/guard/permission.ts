import type { Router, LocationQueryRaw } from 'vue-router'
import NProgress from 'nprogress' // progress bar

import { useUserStore } from '@/store'
import { isLogin } from '@/utils/auth'

export default function setupPermissionGuard(router: Router) {
  // eslint-disable-next-line consistent-return
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    if (isLogin()) {
      try {
        if (window.SITE_CONFIG.dynamicAttrHasAdded) {
          return next()
        }
        await userStore.checkKFPermission()
        window.SITE_CONFIG.dynamicAttrHasAdded = true

        if (to.path === '/') {
          if (userStore.showKF) {
            next({
              name: 'videoCall',
              replace: true,
            })
          } else {
            next({
              name: 'workOrder',
              replace: true,
            })
          }
        }

        next()
      } catch (error) {
        next({
          name: 'login',
          query: {
            ...to.query,
          } as LocationQueryRaw,
        })
      }
    } else {
      if (to.name === 'login') {
        return next()
      }
      next({
        name: 'login',
        query: {
          ...to.query,
        } as LocationQueryRaw,
      })
      // NProgress.done()
    }
  })
  router.afterEach((to, from) => {
    NProgress.done()
  })
}
