// my-component.js
import { API_BASE_URL } from '../../wxapi/request.js';
const app = getApp();

Component({
  properties: {
    outOrderNo: {
      type: String,
      value: '',
    },
  },
  data: {
    // 数据初始化
    websock: {},
  },
  methods: {
    initWebSocket: function () {
      const outOrderNo = this.data.outOrderNo;
      console.log('outOrderNo :>> ', outOrderNo);
      if (!outOrderNo) return;
      const url =
        API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://') +
        '/websocket/' +
        outOrderNo;
      console.log('websocket------url :>> ', url);
      this.setData({
        websock: wx.connectSocket({
          url: url,
        }),
      });
      console.log('this.data.websock :>> ', this.data.websock);
      this.data.websock.onOpen(res => {
        this.websocketOpen(res);
      });
      this.data.websock.onMessage(res => {
        this.websocketMessage(res);
      });
      this.data.websock.onError(res => {
        this.websocketError(res);
      });
      this.data.websock.onClose(res => {
        this.websocketClose(res);
      });
    },
    websocketOpen: function () {
      console.log('this :>> ', this);
      console.log('WebSocket连接成功');
      this.data.interval && clearInterval(this.data.interval);
    },
    websocketError: function (e) {
      console.error(e);
      console.log('WebSocket连接发生错误');
      function clearAll() {
        clearTimeout(app.globalData.timeout);
        clearInterval(interval);
      }
      // 去掉5s判断
      clearTimeout(app.globalData.timeout);
      const handleErr = (res, last) => {
        if ((res.code == 500 || res.data.code == 500) && last) {
          console.error('没有查询到订单，跳转订单列表');
          clearAll();
          wx.navigateTo({
            url: '/pages/order-history/order-history',
          });
        }
      };
      const query = last => {
        clearTimeout(app.globalData.timeout);
        wx.api.common
          .selectOrder({ orderId: this.data.outOrderNo, showAlert: false })
          .then(res => {
            console.log('轮询订单详情-res :>> ', res);
            const { waybillCode, orderStatus } = res?.data || {};
            // 成功
            if (waybillCode && ['0', '1'].includes(orderStatus)) {
              clearAll();
              wx.navigateTo({
                url:
                  '/pages/order-success-payScore/order-success-payScore?id=' +
                  this.data.outOrderNo,
              });
            }
            // 失败
            if (waybillCode == null && orderStatus === '-1') {
              clearAll();
              wx.showToast({
                title: '订单创建失败，请重新下单！',
                icon: 'none',
                image: '',
                duration: 2000,
                mask: false,
              });
            }

            // 没有
            handleErr(res, last);
          })
          .catch(res => {
            handleErr(res, last);
            console.error('websocketError-res :>> ', res);
          });
      };
      query();
      const interval = setInterval(() => {
        query();
      }, 1000 * 3);
      this.setData({
        interval,
      });

      setTimeout(() => {
        clearInterval(interval);
      }, 1000 * 17);
      setTimeout(() => {
        query(1);
      }, 1000 * 20);
    },
    websocketMessage: function (res) {
      console.log('收后端消息 :>> ', res);
      const data = JSON.parse(res.data);
      console.log('data :>> ', data);
      //服务商余额不足
      if (data.code == 500) {
        app.globalData.isOrderSuccess = false;
        wx.showToast({
          icon: 'none',
          title: data.message,
          duration: 3000,
        });
      }
      if (data.code == 0) {
        app.globalData.isOrderSuccess = true;
        app.handleQueryOrderStatus();
      }
    },
    triggerCustomEvent: function () {
      this.triggerEvent('websocketMessage', {
        message: this.data.receivedMessage,
      });
    },
    websocketClose: function () {
      console.log('---websocket connection closed---');
    },
  },
  lifetimes: {
    attached: function () {
      // 页面加载时执行
      this.initWebSocket();
      app.$bus.on('closeClearInterval', () => {
        clearInterval(this.data.interval);
      });
    },
    detached: function () {
      // 页面卸载时执行
      if (this.data.websock) {
        this.data.websock.close();
      }
    },
  },
  observers: {
    outOrderNo: function (outOrderNo) {
      if (outOrderNo) {
        console.log('orderId更新，重新连接WebSocket...');
        this.initWebSocket();
      }
    },
  },
});
