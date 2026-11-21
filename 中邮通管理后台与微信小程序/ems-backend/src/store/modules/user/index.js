import { defineStore } from 'pinia'
import { resetRouter, addDynamicRoutes } from '@/router'
import { useTagsStore, usePermissionStore } from '@/store'
import { removeToken, toLogin, lStorage,setToken } from '@/utils'
import loginApi from '../../../views/login/api.js'
import { useRouter, useRoute } from 'vue-router'

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
      route:useRoute(),
      router:useRouter(),
      isAdmin:false
    }
  },
  getters: {
    userId() {
      return this.userInfo?.userId
    },
    name() {
      return this.userInfo?.name
    },
    avatar() {
      return this.userInfo?.avatar
    },
    roleId() {
      return this.userInfo?.roleId
    },
    nickname() {
      return this.userInfo?.nickname
    },
    headimgurl() {
      return this.userInfo?.headimgurl
    },
  },
  actions: {
    async loginSuccess({route = {},router = {}}) {
      const { query } = route || this.route
      const router0 = router || this.router
      $message.loading('正在验证...')
      await Promise.all([this.getUserInfo(), addDynamicRoutes()])
      $message.success('登录成功')
      if (query.redirect) {
        const path = query.redirect
        Reflect.deleteProperty(query, 'redirect')
        router0.replace({ path, query })
      } else {
        router0.replace('/')
      }
    },
    async getUserInfo() {
      try {
        const res = await loginApi.findUserInfo()
        this.setUserInfo(res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        this.logout()
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTags } = useTagsStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetTags()
      resetPermission()
      resetRouter()
      // this.$reset()
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.isAdmin = this.userInfo.roleId == 1
      // 同步浏览器缓存
      lStorage.set('userInfo', this.userInfo, 19980722)
    },
  },
})
