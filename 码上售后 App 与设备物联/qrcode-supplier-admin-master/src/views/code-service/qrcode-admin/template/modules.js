/* eslint-disable global-require */
import preview from './CallModule/preview.png'
import CallModule1_preview from './CallModule1/preview.png'
import CallModule2_preview from './CallModule2/preview.png'
import DetailModule_preview from './DetailModule/preview.png'
import DetailModule_preview2 from './DetailModule2/preview.png'
import CallModuleComponent from './CallModule/index.vue'
import CallModuleComponent1 from './CallModule1/index.vue'
import CallModuleComponent2 from './CallModule2/index.vue'
import DetailModuleComponent from './DetailModule/index.vue'
import DetailModuleComponent2 from './DetailModule2/index.vue'
import cards from './cards.js'
import cards2 from './cards2.js'

/**
 * 拨号页模块
 * @returns {any}
 */
export function callModuleMap() {
  return {
    CallModule: {
      title: '默认模板',
      component: CallModuleComponent,
      image: preview,
      setting: {
        backgroundImage: 'https://file.iotive.cn/public/template/call-bg.png',
        header: {
          title: '一键视频报修',
        },
        btn: {
          text: '一键视频报修',
          desc: '设备问题，分秒响应',
          color: null,
          outerColor: null,
          circleColor: null,
          innerColor: null,
          icon: 'https://file.iotive.cn/public/template/btn-icon.png',
        },
        more: {
          text: '查看更多功能',
          color: null,
        },
      },
    },
    CallModule1: {
      title: '模板1',
      component: CallModuleComponent1,
      image: CallModule1_preview,
      setting: {
        backgroundImage:
          'https://file.iotive.cn/public/template/CallModule1/bgImg.png',
        header: { title: '一键视频报修', color: null },
        btn: {
          text: '一键视频报修',
          desc: '设备问题，分秒响应',
          color: null,
          outerColor: null,
          circleColor: null,
          innerColor: null,
          logo: 'http://qr1.keyicloud.cn/statics/qrcodeConfig/1/logo.png',
          img: 'https://file.iotive.cn/public/template/CallModule1/btnImg.png',
        },
        more: {
          text: '查看更多功能',
          color: null,
        },
      },
    },
    CallModule2: {
      title: '模板2',
      component: CallModuleComponent2,
      image: CallModule2_preview,
      setting: {
        backgroundImage: '',
        header: { title: '一键视频报修', color: '#020202' },

        tip: {
          text: '请尽量在WiFi或者流量充足情况下使用该功能',
          color: '#494949',
        },
        logo: {
          img: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/28/1qgmM89tQkS.png',
        },
        slogan: {
          text: '设备问题  分秒响应',
          color: '#020202',
        },
        btn: {
          text: '视频报修',
          color: '#FEFDFD',
          bgc: '#CA0328',
          icon: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiGmpjFA3c.png',
        },
        more: {
          text: '需要其他服务 请点我',
          icon: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/28/1qgfM6gca7E.png',
          color: '#020202',
        },
      },
    },
  }
}

export function callModules() {
  const modules = callModuleMap()
  // eslint-disable-next-line no-restricted-syntax
  Object.keys(modules).forEach((moduleName) => {
    modules[moduleName] = modules[moduleName].component
  })

  return modules
}

export function callDefaultSetting(name) {
  console.log('callDefaultSetting-name', name)
  console.log('callDefaultSetting-return', callModuleMap()[name].setting)
  return callModuleMap()[name].setting
}

/**
 * 设备详情页模块
 * @returns {any}
 */
export function detailModuleMap() {
  return {
    DetailModule: {
      title: '默认模板',
      component: DetailModuleComponent,
      image: DetailModule_preview,
      setting: {
        btn: {
          text: '一键视频报修',
          desc: '设备问题，分秒响应',
          color: null,
        },
        more: {
          text: '更多功能',
        },
        history: {
          text: '我扫码过的设备',
        },
        cards,
        tabs: [
          {
            id: '技术参数',
            text: '技术参数',
            type: 'deviceParameter',
            enabled: true,
          },
          {
            id: '设备简介',
            text: '设备简介',
            type: 'deviceDescription',
            enabled: true,
          },
          {
            id: '设备物联',
            text: '设备物联',
            type: 'deviceIot',
            enabled: false,
          },
          {
            id: '电池物联',
            text: '电池物联',
            type: 'batteryIot',
            enabled: false,
          },
        ],
      },
    },
    DetailModule2: {
      title: '默认模板2',
      component: DetailModuleComponent2,
      image: DetailModule_preview2,
      setting: {
        btn: {
          text: '视频报修 请点我',
          color: '#FEFDFD',
          bgc: '#CA0328',
          icon: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiGmpjFA3c.png',
        },
        book: {
          text: '设备说明书',
          color: '#FEFDFD',
          icon: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiOq9fZ4N6.png',
        },
        history: {
          text: '我扫码过的设备',
          icon: 'https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/07/29/1qiOs62L17I.png',
        },
        cards: cards2,
        tabs: [
          {
            id: '设备简介',
            text: '设备简介',
            type: 'deviceDescription',
            enabled: true,
          },
        ],
      },
    },
  }
}

export function detailModules() {
  const modules = detailModuleMap()
  Object.keys(modules).forEach((moduleName) => {
    modules[moduleName] = modules[moduleName].component
  })
  return modules
}

export function detailDefaultSetting(name) {
  return detailModuleMap()[name].setting
}
