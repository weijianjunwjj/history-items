import { defaultRequest } from '@hx/packages/service/request'

export function getWxLoginToken(randomKey: any) {
  return defaultRequest.get({
    url: `auth/refreshWxLoginToken/${randomKey}`,
  })
}

export function loginByWx(params: any) {
  return defaultRequest.post(
    { url: `auth/wxlogin`, params },
    { errorMessageMode: 'none' }
  )
}
