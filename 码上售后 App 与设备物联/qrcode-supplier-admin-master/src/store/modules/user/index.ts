import { defineStore } from 'pinia'
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  getRouter,
} from '@/api/user'
import { getEnterpriseProfile } from '@/api/code-service/organize-center/data-admin'
import { getParents } from '@/api/code-service/prod-center/otherDevice/index'
import { removeRouteListener } from '@/utils/route-listener'
import { RouteRecordRaw } from 'vue-router'
import {
  setToken,
  clearToken,
  $bus,
  clearEnterprise,
  setEnterprise,
  setAgentParents,
  clearAgentParents,
} from '@hx/packages/utils'
import { Notification } from '@arco-design/web-vue'
import useCommonStore from '@hx/packages/store'
import _ from 'lodash'
import { generateRouter, redirectRouter } from '@/utils/utils'
import appRoutes from '@/router/routes'
import { UserState } from './types'

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {},
    roles: [],
    leftRoutes: [],
    enterprise: {},
    agentParents: [],
    routerList: [],
    permissions: [],
    bindWX: false,
    loading: false,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state }
    },
  },

  actions: {
    switchLeftRoutes(routes: RouteRecordRaw[]) {
      this.leftRoutes = routes
    },
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'admin' : 'user'
        // resolve(this.role)
      })
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial)
    },

    // Reset user's information
    resetInfo() {
      this.$reset()
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo()
      this.setInfo(data)
      const { unionId, openId } = data.user
      this.bindWX = !!(unionId && openId)
    },

    setEnterprise(enterprise: any) {
      this.$patch({
        enterprise,
      })
    },

    setAgentParents(agentParents: any) {
      this.$patch({
        agentParents,
      })
    },

    setRouterList(routerList: any) {
      this.$patch({
        routerList,
      })
    },

    setLoading(loading: boolean) {
      this.$patch({
        loading,
      })
    },

    // Login
    // eslint-disable-next-line consistent-return
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm)
        const token = res.data.access_token
        setToken(token)
        this.getEnterprise()
        this.getAgentParents()
      } catch (err: any) {
        clearToken()
        clearEnterprise()
        clearAgentParents()
        return Promise.reject(err)
      }
    },

    async wxLogin(token: string) {
      try {
        setToken(token)
        this.getEnterprise()
        this.getAgentParents()
      } catch (err: any) {
        clearToken()
        clearEnterprise()
        clearAgentParents()
        return Promise.reject(err)
      }
    },

    async getEnterprise() {
      const { data } = await getEnterpriseProfile()
      this.setEnterprise(data)
      setEnterprise(data)
    },

    async getAgentParents() {
      const { data } = await getParents()
      this.setAgentParents(data)
      setAgentParents(data)
      if (data.length !== 0) this.roles.push('agent')
    },

    async getRouterList() {
      const roleIds: any[] = []
      if (
        this.user.roles[0]?.roleCode !== 'admin' &&
        this.user.roles.length !== 0
      ) {
        this.user.roles.forEach((item: { roleId: any }) => {
          roleIds.push(item.roleId)
        })
        const { data } = await getRouter(
          _.pickBy({
            enterpriseId: this.enterprise.enterpriseId,
            roleIds,
          })
        )
        const newRoutes = generateRouter(data)
        // newRoutes = redirectRouter(newRoutes)
        this.setRouterList(newRoutes)
      } else {
        // const newRoutes = appRoutes
        this.user.roles.forEach((item: { roleId: any }) => {
          roleIds.push(item.roleId)
        })
        const { data } = await getRouter(
          _.pickBy({
            enterpriseId: this.enterprise.enterpriseId,
            roleIds,
          })
        )
        data.push({
          path: 'system-setting',
          name: 'systemSetting',
          component: '@/views/system-setting/index.vue',
          title: '系统设置',
          sort: 99999,
          icon: 'icon-settings',
          children: [
            {
              path: 'organize-center',
              name: 'systemSetting_organizeCenter',
              label: 'systemSetting_organizeCenter',
              component: '@/views/system-setting/organize-center/index.vue',
              title: '组织管理',
              sort: 0,
              icon: 'icon-mind-mapping',
              children: [
                {
                  path: 'user-admin',
                  name: 'systemSetting_organizeCenter_userAdmin',
                  label: 'systemSetting_organizeCenter_userAdmin',
                  component:
                    '@/views/system-setting/organize-center/user-admin/index.vue',
                  title: '账号管理',
                  sort: 0,
                },
                {
                  path: 'roles-admin',
                  name: 'systemSetting_organizeCenter_rolesAdmin',
                  label: 'systemSetting_organizeCenter_rolesAdmin',
                  component:
                    '@/views/system-setting/organize-center/roles-admin/index.vue',
                  title: '角色管理',
                  sort: 1,
                },
                {
                  path: 'data-admin',
                  name: 'systemSetting_organizeCenter_dataAdmin',
                  label: 'systemSetting_organizeCenter_dataAdmin',
                  component:
                    '@/views/system-setting/organize-center/data-admin/index.vue',
                  title: '企业信息',
                  order: 2,
                },
              ],
            },
          ],
        })
        const newRoutes = generateRouter(data)
        this.setRouterList(newRoutes)
      }
    },

    // Logout
    async logout() {
      this.resetInfo()
      clearToken()
      clearEnterprise()
      clearAgentParents()
      removeRouteListener()
      window.location.href = '/login'
    },
  },
})

export default useUserStore
