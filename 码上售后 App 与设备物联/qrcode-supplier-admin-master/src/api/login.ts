// import axios from 'axios'
import { defaultRequest } from '@hx/packages/service/request'

// 获取验证码
export function getCodeImg() {
  return defaultRequest.get({ url: '/code' })
}
