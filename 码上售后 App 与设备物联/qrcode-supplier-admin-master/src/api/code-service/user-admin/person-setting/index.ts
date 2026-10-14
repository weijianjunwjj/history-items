import { defaultRequest } from '@hx/packages/service/request'
import qs from 'qs'

// 用户密码重置
export function updateUserPwd(data: any) {
  return defaultRequest.put({
    url: `system/user/profile/updatePwd?${qs.stringify(data, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 修改用户手机
export function updateUserProfile(data: any) {
  return defaultRequest.put({
    url: 'system/user/profile',
    data,
  })
}

// 用户头像上传
export function uploadAvatar(data: any, configs: any) {
  return defaultRequest.post({
    url: 'system/user/profile/avatar',
    params: data,
    ...configs,
  })
}
