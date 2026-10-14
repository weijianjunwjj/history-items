import iot from './iot-api'
import qrcode from './qrcode-api'
import wechat from './wechat-api'
const api = {
  ...iot,
  ...qrcode,
  ...wechat,
}

export default api