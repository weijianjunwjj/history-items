import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store'
import { contains } from '@hx/packages/utils/untils'

export default function usePermission() {
  const userStore = useUserStore()
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles?.length ||
        route.meta?.roles?.includes('*') ||
        contains(route.meta?.roles, userStore.roles)
      )
    },
    findFirstPermissionRoute(_routers: any, roles: string[]) {
      const cloneRouters = [..._routers]
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift()
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || contains(el, roles)
          })
        )
          return { name: firstElement.name }
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children)
        }
      }
      return null
    },
    // You can add any rules you want
  }
}
