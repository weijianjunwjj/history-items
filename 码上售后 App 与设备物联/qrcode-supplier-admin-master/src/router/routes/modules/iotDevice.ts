/*
  码上服务模块路由
*/
export default {
  path: 'iot-device',
  name: 'iotDevice',
  component: () => import('@/views/iot-device/index.vue'),
  redirect: '/iot-device/iot-device-admin',
  meta: {
    title: '设备物联',
    requiresAuth: true,
    order: 1,
    icon: 'icon-dashboard',
  },
  children: [
    {
      path: 'iot-device-admin',
      name: 'iotDevice_iotDeviceAdmin',
      component: () => import('@/views/iot-device/iot-device-admin/index.vue'),
      redirect: '/iot-device/iot-device-admin/device-admin',
      meta: {
        title: '设备物联管理',
        requiresAuth: true,
        order: 0,
        icon: 'icon-code-sandbox',
      },
      children: [
        {
          path: 'device-admin',
          name: 'iotDevice_iotDeviceAdmin_deviceAdmin',
          component: () =>
            import(
              '@/views/iot-device/iot-device-admin/device-admin/index.vue'
            ),
          meta: {
            title: '设备管理',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'runing-log',
          name: 'iotDevice_iotDeviceAdmin_runingLog',
          component: () =>
            import('@/views/iot-device/iot-device-admin/runing-log/index.vue'),
          meta: {
            title: '运行日志',
            hideInMenu: true,
            activeMenu: 'iotDevice_iotDeviceAdmin_deviceAdmin',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'product-config',
          name: 'iotDevice_iotDeviceAdmin_productConfig',
          component: () =>
            import(
              '@/views/iot-device/iot-device-admin/product-config/product-config/index.vue'
            ),
          meta: {
            title: '产品配置',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'param-setting',
          name: 'iotDevice_iotDeviceAdmin_paramSetting',
          component: () =>
            import(
              '@/views/iot-device/iot-device-admin/product-config/param-setting/index.vue'
            ),
          meta: {
            title: '参数设置',
            requiresAuth: true,
            hideInMenu: true,
            activeMenu: 'iotDevice_iotDeviceAdmin_productConfig',
            order: 2,
          },
        },
        {
          path: 'weibao-remind',
          name: 'iotDevice_iotDeviceAdmin_weibaoRemind',
          component: () =>
            import(
              '@/views/iot-device/iot-device-admin/product-config/weibao-remind/index.vue'
            ),
          meta: {
            title: '维保提醒',
            requiresAuth: true,
            hideInMenu: true,
            activeMenu: 'iotDevice_iotDeviceAdmin_productConfig',
            order: 2,
          },
        },
        {
          path: 'warning-log',
          name: 'iotDevice_iotDeviceAdmin_warningLog',
          component: () =>
            import('@/views/iot-device/iot-device-admin/warning-log/index.vue'),
          meta: {
            title: '报警记录',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'weibao-log',
          name: 'iotDevice_iotDeviceAdmin_weibaoLog',
          component: () =>
            import('@/views/iot-device/iot-device-admin/weibao-log/index.vue'),
          meta: {
            title: '维保提醒记录',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'device-map',
          name: 'iotDevice_iotDeviceAdmin_deviceMap',
          component: () =>
            import('@/views/iot-device/iot-device-admin/device-map/index.vue'),
          meta: {
            title: '设备地图',
            requiresAuth: true,
            order: 2,
          },
        },
      ],
    },
  ],
}
