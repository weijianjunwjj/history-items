import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getAuthUser as getUserInfoApi} from '@/service/login/login'
import {UserInfo} from './type'
import {debounce, throttle} from 'lodash'

const defaultUserInfo: UserInfo = {
  Id: 0,
  username: '',
  nickname: '',
  password: '',
  create_ip: '',
  create_time: '',
  update_time: '',
  status: 0,
  openid: '',
  gender: 0,
  integral: 0,
  coin: 0,
  lockedCoinQuantity: 0,
  providerName: '',
  avator: '',
  country: 0,
  countryName: '',
  state: 0,
  stateName: '',
  city: 0,
  cityName: '',
  birthDay: '',
  height: 0,
  weight: 0,
  profileStatus: 0,
  version: 0,
  isOnline: true,
  signature: '',
  imAccessKey: '',
  imToken: '',
  imAccountId: '',
}

export const useUserStore = defineStore(
  'userStore',
  () => {
    const userInfoStorage = uni.getStorageSync('userInfo')
    const userInfo = ref<UserInfo>({ ...defaultUserInfo, ...userInfoStorage })

    const setUserInfo = (val: UserInfo) => {
      userInfo.value = {...defaultUserInfo, ...val,}
    }

    const updateUserInfo = debounce(async () => {
      const { data }: { data: any } = await getUserInfoApi()
      setUserInfo(data)
    }, 800)

    const clearUserInfo = () => {
      userInfo.value = { ...defaultUserInfo }
    }

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      updateUserInfo,
    }
  },
  {
    persist: true,
  },
)
