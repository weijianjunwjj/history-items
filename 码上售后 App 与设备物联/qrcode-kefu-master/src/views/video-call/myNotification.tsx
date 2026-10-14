import { Notification } from '@arco-design/web-vue'
import '../../assets/style/css/dialling.css'

export default (phone: any) => {
  const app = window.$app

  let myNotification = {
    close: () => {},
  }

  const accept = () => {
    console.warn('已接通')
    app.$router.push({ name: 'videoCall' })
    app.$bus.emit('top-menu-change', 'videoCall')
    app.$bus.emit('video-accept')
    myNotification.close()
  }
  const refuse = () => {
    console.error('已拒绝')
    app.$bus.emit('video-reject')
    myNotification.close()
  }

  console.log('phone', phone)
  const content = (
    <div class="choose_1">
      <div class="title_1">{phone} 来电话啦</div>
      <div class="buttons_1">
        <div class="accept_1" onClick={accept}></div>
        <div class="refuse_1" onClick={refuse}></div>
      </div>
    </div>
  )

  app.$bus.on('my-notification-close', () => {
    console.error('关闭notification')
    myNotification.close()
  })

  myNotification = Notification.info({
    id: 'video-call-notification',
    content: () => content,
    showIcon: false,
    closable: true,
    duration: 1000 * 30,
  })
}
