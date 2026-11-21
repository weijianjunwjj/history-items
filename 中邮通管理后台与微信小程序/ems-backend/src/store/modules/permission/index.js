import { defineStore } from 'pinia'
import { basicRoutes, asyncRoutes } from '../../../router/routes/index.js'
import { useUserStore } from '../user/index'
function hasPermission(route, role) {
  // * 不需要权限直接返回true
  if (!route.meta?.requireAuth) return true

  const routeRole = route.meta?.role ? route.meta.role : []

  // * 登录用户没有角色或者路由没有设置角色判定为没有权限
  if (!role.length || !routeRole.length) return false

  // * 路由指定的角色包含任一登录用户角色则判定有权限
  return role.some((item) => routeRole.includes(item))
}

function filterAsyncRoutes(routes = []) {
  const ret = []
  routes.forEach((route) => {
    const curRoute = {
      ...route,
      children: [],
    }
    if (route.children && route.children.length) {
      curRoute.children = filterAsyncRoutes(route.children)
    } else {
      Reflect.deleteProperty(curRoute, 'children')
    }
    ret.push(curRoute)
  })
  return ret
}


export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: [],
      showSysDelBtn:false,
      showSysEditBtn:false,
      btnNames:['修改','删除']
    }
  },
  getters: {
    routes() {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus() {
      return this.routes.filter((route) => route.name && !route.isHidden && route.name !== 'main')
    },
    sysBtn(){
      return this.routes?.find(item=>item?.meta?.title === '系统管理')?.children?.filter(item=> this.btnNames.includes(item?.meta?.title))
    }
  },
  actions: {
    generateRoutes(asyncRoutes) {
      const accessRoutes = filterAsyncRoutes(asyncRoutes)
      this.accessRoutes = accessRoutes
      this.showSysDelBtn = !!this.sysBtn?.find(item=>item?.meta?.title === '删除')
      this.showSysEditBtn = !!this.sysBtn?.find(item=>item?.meta?.title === '修改')
      return accessRoutes
    },
    resetPermission() {
      this.$reset()
    },
  },
})
