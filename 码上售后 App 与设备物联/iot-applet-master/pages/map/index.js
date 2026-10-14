import { formatMins, getTop } from '../../utils/util'
import api from '../../wxapi/api'
import { state, device_info } from '../../utils/global'
import { getMapPin } from '../../utils/util'
const app = getApp();


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    navbarBtn: { // 胶囊位置信息
      height: 0,
      top: 0,
      right: 0
    },
    titleHeight: 0,
    mapData: {
      scale: 12,
      latitude: '',
      longitude: '',
      markers: [],
    },
    search: '',
    popVisible: true,
    popHeight: wx.getSystemInfoSync().windowHeight * 0.5,
    scrollHeight: wx.getSystemInfoSync().windowHeight * 0.5 - 75 + 'px',
    address: {},
    deviceList: [],
    detail: {},
    // 滑动数据
    startPoint: [0, 0],
    deviceData: [],
    state,
    device_info,
    faultData: []
  },
  lifetimes: {
    attached: function (options) {
      this.mapCtx = wx.createMapContext('myMap', this)
      getApp().$bus.on('PageCur', name => {
        if (name === 'map') {
          this.init()
        }
      })

      setTimeout(() => {
        console.log('mapData------------------',this.data.mapData);
      }, 1200);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.deviceList();
      console.error('this', this.data);
    },
    deviceMapList() {
      wx.navigateTo({
        url: '/pages/map/device-map-list/index',
      })
    },
    getTop,
    lookDetail() {
      const item = JSON.stringify(this.data.detail)
      console.log(item);
      wx.navigateTo({
        url: '/pages/device/detail/index' + `?item=${item}`,
      })
    },
    async getAddressFun(lat, lng) {
      if (lat && lng) {
        const { data } = await api.getLocation({
          lat, lng
        });
        this.setData({
          address: data
        })
      }
    },

    onSearchChange(e) {
      this.setData({
        search: e.detail,
      });
    },
    // 获取设备列表
    async deviceList() {
      try {
        const { data: deviceList } = await api.myDevices({});
        var markers = [];
        console.error('deviceList---',deviceList);
        let showList = [];
        if (deviceList.length > 0) {

          deviceList.forEach((item, index) => {
            item.deviceData.workTime = formatMins(item.deviceData.workTime)
            console.log('item',item);
            markers.push({
              id: index,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: getMapPin(item),
              // iconPath: item.status === 0 ? '/images/map.png' : '/images/device/map_no.png',
              width: "80rpx",
              height: "80rpx",
              joinCluster: true
            });
            showList.push(item)
          })
          // if (markers[0]) {
          //   markers[0].width = '120rpx'
          //   markers[0].height = '120rpx'
          // }
        }
        //计算缩放系数
        // var c_latitude = (Number(from_lat) + Number(to_lat)) / 2;
        // var c_longitude = (Number(from_lng) + Number(to_lng)) / 2;
        // var zoom = this.getZoom(to_lng, from_lng, to_lat, from_lat);
        console.log('markers', markers);
        if (showList.length > 0) {
          this.setData({
            deviceList: showList,
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
            'mapData.markers': markers,
            'mapData.latitude': markers[0].latitude,
            'mapData.longitude': markers[0].longitude,
            'mapData.scale': 18
          })
          this.getAddressFun(markers[0].latitude, markers[0].longitude);
          this.getDeviceDetail(markers[0].id);
          this.onShow();
        }



      } catch (error) {
        console.log(error)
      }
    },
    getZoom(maxLng, minLng, maxLat, minLat) {
      var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"] //级别18到3。
      //最大最小的坐标点
      var distance = this.distance(minLat, minLng, maxLat, maxLng).toFixed(1); //获取两点距离,保留小数点后两位
      for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance * 1000 > 0) {
          return 18 - i + 2;
        }
      }
    },
    distance(la1, lo1, la2, lo2) {
      var La1 = la1 * Math.PI / 180.0;
      var La2 = la2 * Math.PI / 180.0;
      var La3 = La1 - La2;
      var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
      s = s * 6378.137; //地球半径
      s = Math.round(s * 10000) / 10000;
      return s
    },
    // 点击marker
    onMarkerChange(e) {
      console.log(e);
      this.getDeviceDetail(e.detail.markerId);
      this.onShow();
    },
    async getDeviceDetail(index) {
      try {
        console.log('index', index);
        console.log(' this.data.deviceList', this.data.deviceList);
        const detail = this.data.deviceList[index]
        const markers = this.data.mapData.markers
        markers.forEach((item) => {
          const { id } = item
          console.log(id);
          item.width = "80rpx"
          item.height = "80rpx"
        })
        markers[index].width = "120rpx"
        markers[index].height = "120rpx"
        console.log('markers', markers);
        if (!detail) {
          return console.error('detail 为空');
        }
        this.setData({
          'mapData.markers': markers,
          'mapData.latitude': detail.latitude,
          'mapData.longitude': detail.longitude,
          detail: detail,
        })
        if (detail.deviceData) {
          this.setData({
            deviceData: [{
              lable: '压力',
              value: detail.deviceData.pressure + 'bar',
              // icon: 'icon_yl_nor@2x.png'
            },
            {
              lable: '流量',
              value: detail.deviceData.flow + 'L/min',
              // icon: 'icon_ll_nor@2x.png'
            },
            {
              lable: '温度',
              value: detail.deviceData.motorTempreture + '℃',
              // icon: 'icon_dj_nor@2x.png'
            },
            {
              lable: '开机时长',
              value: detail.deviceData.workHour + '分钟',
              // icon: 'icon_kjsc_nor@2x.png'
            },
            {
              lable: '电流',
              value: detail.deviceData.current + 'A',
              // icon: 'icon_kjsc_nor@2x.png'
            },
            {
              lable: '电压',
              value: detail.deviceData.voltage + 'V',
              // icon: 'icon_kjsc_nor@2x.png'
            },
            {
              lable: '外部温度',
              value: detail.deviceData.outerTempreture + '°C',
              // icon: 'icon_kjsc_nor@2x.png'
            },
            {
              lable: '工作总时长',
              value: detail.deviceData.workHour + '°C',
              // icon: 'icon_kjsc_nor@2x.png'
            }
            ],
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 弹窗
    onShow() {
      this.setData({
        popVisible: true
      });
    },
    onClose() {
      this.setData({
        popVisible: false
      });
    },
    toDeviceList() {
      wx.navigateTo({
        url: './deviceList',
      })
    },
    touchStart(e) {
      this.setData({
        startPoint: [e.touches[0].pageX, e.touches[0].pageY]
      })
    },
    touchMove(e) {
      var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
      var startPoint = this.data.startPoint;
      // 比较pageX的值
      if (Math.abs(curPoint[0] - startPoint[0]) < Math.abs(curPoint[1] - startPoint[1])) {
        if (curPoint[1] - startPoint[1] >= 50) {
          this.onClose();
        }
      }
    },
    toDeviceInfo(e) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../deviceInfo/deviceInfo?deviceId=' + id,
      })
    }
  }
})
