<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      sendIndex: null,
      isShow1: true,
    }
  },
  props: {
    state: {
      type: String,
      default: '',
    },
  },
  watch: {
    state(state) {
      if (state) {
        console.log('state更新，重新连接WebSocket。。。')
        this.initWebSocket()
      }
    },
  },
  mounted() {
    //初始化websocket
    this.initWebSocket()
  },
  unmounted: function () {
    // // 离开页面生命周期函数
    // this.websocketClose()
    this.$bus.off('refresh_qr_code')
  },
  methods: {
    initWebSocket: function () {
      // 建立连接
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      const state = this.state
      console.log('state :>> ', state)
      if (!state) return
      const url =
      window.$api_test.replace('https://', 'wss://').replace('http://', 'ws://') +
        '/websocket/' +
        state

      console.log('websocket------url :>> ', url)
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketOpen
      // this.websock.send = this.websocketSend
      this.websock.onerror = this.websocketError
      this.websock.onmessage = this.websocketMessage
      // this.websock.onclose = this.websocketClose
      // clearInterval(this.interval)
      // this.interval = setInterval(() => {
      //   console.log('每隔15s自动连接WebSocket---')
      //   this.initWebSocket()
      // }, 1000 * 15)
    },
    // 连接成功后调用
    websocketOpen: function () {
      console.log('WebSocket连接成功')
      clearInterval(this.sendIndex)
      //       if (socket.readyState === WebSocket.OPEN) {
      //     socket.send('Hello, Server!');
      // } else {
      //     console.log('WebSocket is not open. ReadyState: ', socket.readyState);
      // }
      this.sendIndex = setInterval(() => {
        this.websock.send('ping')
      }, 500)
    },
    // 发生错误时调用
    websocketError: function (e) {
      console.log('WebSocket连接发生错误')
      clearInterval(this.sendIndex)
    },
    // 给后端发消息时调用
    websocketSend: function (e) {
      console.log('给后端发消息...')
      console.log(e)
    },
    // 接收后端消息
    // vue 客户端根据返回的cmd类型处理不同的业务响应
    websocketMessage: function (res) {
      console.log('收后端消息 :>> ', res)
      if(res.data === 'pong'){
        return console.log('pong')
      }
      try {
        const data = JSON.parse(res.data)
        console.log('data :>> ', data)
        this.$emit('websocketMessage', data)
      } catch (error) {
        console.log(error)
      }
     
      //处理订阅信息
      // if(data.cmd === "topic"){
      //   //TODO 系统通知
      //
      // }else if(data.cmd === "user"){
      //   //TODO 用户消息
      //
      // }
    },
    // 关闭连接时调用
    websocketClose: function () {
      console.log('---websocket connection closed---')
      clearInterval(this.sendIndex)
      if (this.isShow1) {
        this.isShow1 = false
        $dialog.confirm({
          title: '警告',
          content: '服务器失去连接，点击重新连接',
          positiveText: '重新连接',
          closeOnEsc: false,
          maskClosable: false,
          closable: false,
          onPositiveClick: () => {
            this.initWebSocket()
            this.$bus.emit('refresh_qr_code')
            $message.loading('连接中...')
            setTimeout(() => {
              $message.success('连接成功！')
            }, 1000)
            this.isShow1 = true
            console.log('this.isShow1 :>> ', this.isShow1)
          },
          onNegativeClick: () => {
            // message.error('不确定')
            this.isShow1 = true
            console.log('this.isShow1 :>> ', this.isShow1)
          },
        })
      }
    },
  },
}
</script>

<style scoped></style>
