import { defineStore } from 'pinia'
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from '@/api/user'
import { setToken, clearToken } from '@/utils/auth'
import { removeRouteListener } from '@/utils/route-listener'
import useVideoUser from '@/store/modules/videoUser'
import { UserState } from './types'

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    roles: '',
    showKF: false,
    bindWX: false,
    enterpriseId: '',
    user: {},
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state }
    },
  },

  actions: {
    checkWX(data) {
      const { unionId, openId } = data.user
      this.bindWX = !!(unionId && openId)
    },
    async checkKFPermission() {
      try {
        const { data } = await getUserInfo()
        const { roles } = data
        this.setInfo(data)
        this.checkWX(data)
        if (roles.includes('customer_service')) {
          this.updateKF(true)
        } else {
          this.updateKF(false)
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    updateKF(isShow) {
      this.showKF = isShow
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
      this.checkWX(data)
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm)
        const token = res.data.access_token
        setToken(token)
      } catch (err) {
        clearToken()
        throw err
      }
    },

    async wxLogin(token: string) {
      try {
        setToken(token)
      } catch (err: any) {
        clearToken()
        return Promise.reject(err)
      }
    },

    // Logout
    async logout() {
      useVideoUser().logout()
      this.resetInfo()
      clearToken()
      removeRouteListener()
    },
  },
})

export default useUserStore
