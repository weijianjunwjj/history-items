import axios from 'axios'
import qs from 'qs'

// 获取工单列表
// 获取验证码
export function uploadAvatar(data: any, configs: any) {
  return axios({
    method: 'post',
    url: 'hx-system/user/profile/avatar',
    timeout: 20000,
    data,
    ...configs,
  })
}

// 用户密码重置
export function updateUserPwd(data: any) {
  return axios({
    method: 'put',
    url: `hx-system/user/profile/updatePwd?${qs.stringify(data, {
      arrayFormat: 'repeat',
    })}`,
  })
}

// 修改用户手机
export function updateUserProfile(data: any) {
  return axios({
    method: 'put',
    url: 'hx-system/user/profile',
    data,
  })
}

export function uploadReq(url: string, data: any, configs: any) {
  return axios({
    method: 'post',
    url: url || '/file/upload',
    params: data,
    ...configs,
  })
}

// // 用户头像上传
// export function uploadAvatar(data: any, configs: any) {
//   return defaultRequest.post({
//     url: 'hx-system/user/profile/avatar',
//     params: data,
//     ...configs,
//   })
// }
