import { get, post } from "../request"

export default {
  getUserInfo: () => get('/wechat/userinfo'),
  editUserInfo: (p) => get(`/wechat/userinfo/avatar/update${p}`),
}