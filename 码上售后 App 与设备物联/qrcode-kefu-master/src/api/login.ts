import axios from 'axios'

// 获取验证码
export function getCodeImg() {
  return axios({
    url: '/code',
    method: 'get',
    timeout: 20000,
  })
}
