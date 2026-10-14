import { get, post } from "../request"


export default {
  getLocation: params => get(`/qrcode/getLocation`, { params }),
}