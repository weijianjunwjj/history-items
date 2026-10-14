import type { RouteRecordRaw } from 'vue-router'

export type RoleType = string[]
export interface UserState {
  user: object
  roles: RoleType
  leftRoutes: RouteRecordRaw[]
  enterprise: object
  agentParents: []
  permissions: []
  routerList: RouteRecordRaw[]
  bindWX: boolean
  loading: boolean
}
