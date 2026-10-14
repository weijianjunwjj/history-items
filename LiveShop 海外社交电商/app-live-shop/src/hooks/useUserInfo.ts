import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { UserInfo } from '@/store/type'
import { debounce } from '@/utils/utils'

export function useUserInfo() {
  const userStore = useUserStore()

  // 计算属性：响应式地获取用户信息
  const userInfo = computed(()=>userStore.userInfo)

  // 更新用户信息
  const updateUserInfo = () => {
    return new Promise(async (resolve, reject) => {
      await userStore.updateUserInfo()
      resolve(1)
    })
  }

  return {
    userInfo,
    updateUserInfo,
  }
}
