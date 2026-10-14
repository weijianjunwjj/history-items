export type RoleType = '' | '*' | 'admin' | 'user'
export interface UserState {
  roles: RoleType
  showKF: boolean
  bindWX: boolean
  enterpriseId: string
  user: object
}
