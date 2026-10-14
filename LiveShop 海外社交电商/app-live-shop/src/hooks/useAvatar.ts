import { DefaultAvatarMan, DefaultAvatarWoman } from '@/config'
import { getUrl } from '@/utils/utils'
let count=0
export function useAvatar(data) {
  count++
  return computed(() => {
    return data.value.avator
      ? getUrl(data.value.avator)
      : (data.value.gender == 1 ? DefaultAvatarMan : DefaultAvatarWoman);
  });
}
