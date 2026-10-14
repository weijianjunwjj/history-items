/*
  码上服务模块路由
*/
export default {
  path: 'code-service',
  name: 'codeService',
  component: () => import('@/views/code-service/index.vue'),
  redirect: '/code-service/device-admin',
  meta: {
    title: '码上售后',
    requiresAuth: true,
    order: 1,
    icon: 'icon-dashboard',
  },
  children: [
    {
      path: 'device-admin',
      name: 'codeService_deviceAdmin',
      component: () => import('@/views/code-service/device-admin/index.vue'),
      redirect: '/code-service/device-admin/device-admin',
      meta: {
        title: '设备管理',
        requiresAuth: true,
        order: 0,
        icon: 'icon-common',
      },
      children: [
        {
          path: 'device-admin',
          name: 'codeService_deviceAdmin_deviceAdmin',
          component: () =>
            import('@/views/code-service/device-admin/device-admin/index.vue'),
          meta: {
            title: '我的设备',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'other-device',
          name: 'codeService_deviceAdmin_otherDevice',
          component: () =>
            import('@/views/code-service/device-admin/other-device/index.vue'),
          meta: {
            title: '经销的设备',
            requiresAuth: true,
            order: 2,
            roles: ['agent'],
          },
        },
        {
          path: 'prod-admin',
          name: 'codeService_deviceAdmin_prodAdmin',
          component: () =>
            import('@/views/code-service/device-admin/prod-admin/index.vue'),
          meta: {
            title: '产品管理',
            requiresAuth: true,
            order: 3,
          },
        },
        {
          path: 'prod-cate',
          name: 'codeService_deviceAdmin_prodCate',
          component: () =>
            import('@/views/code-service/device-admin/prod-cate/index.vue'),
          meta: {
            title: '产品类别',
            requiresAuth: true,
            order: 4,
          },
        },
        {
          path: 'course-admin',
          name: 'codeService_deviceAdmin_courseAdmin',
          component: () =>
            import('@/views/code-service/device-admin/course-admin/index.vue'),
          meta: {
            title: '教程管理',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'common-problems',
          name: 'codeService_deviceAdmin_commonProblems',
          component: () =>
            import(
              '@/views/code-service/device-admin/common-problems/index.vue'
            ),
          meta: {
            title: '常见问题',
            requiresAuth: true,
            order: 2,
          },
        },
      ],
    },
    {
      path: 'workOrder-admin',
      name: 'codeService_workOrderAdmin',
      component: () => import('@/views/code-service/wordOrder-admin/index.vue'),
      redirect: '/code-service/workOrder-admin/workOrder-type',
      meta: {
        title: '工单管理',
        requiresAuth: true,
        order: 0,
        icon: 'icon-file',
      },
      children: [
        {
          path: 'workOrder-type',
          name: 'codeService_workOrderAdmin_workOrderType',
          component: () =>
            import(
              '@/views/code-service/wordOrder-admin/workOrder-type/index.vue'
            ),
          meta: {
            title: '工单类型',
            requiresAuth: true,
            order: 1,
          },
        },
        {
          path: 'wordOrder-admin',
          name: 'codeService_workOrderAdmin_repairOrder',
          component: () =>
            import(
              '@/views/code-service/wordOrder-admin/wordOrder-admin/index.vue'
            ),
          meta: {
            title: '工单管理',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'call-record',
          name: 'codeService_workOrderAdmin_videoConnection',
          component: () =>
            import(
              '@/views/code-service/wordOrder-admin/call-record/index.vue'
            ),
          meta: {
            title: '通话记录',
            requiresAuth: true,
            order: 1,
          },
        },
      ],
    },

    {
      path: 'qrcode-admin',
      name: 'codeService_qrcodeAdmin',
      component: () => import('@/views/code-service/qrcode-admin/index.vue'),
      redirect: '/code-service/organize-center/customer-admin',
      meta: {
        title: '二维码管理',
        requiresAuth: true,
        order: 1,
        icon: 'icon-qrcode',
      },
      children: [
        {
          path: 'template-admin',
          name: 'codeService_qrcodeAdmin_templateAdmin',
          component: () =>
            import('@/views/code-service/qrcode-admin/template/index.vue'),
          meta: {
            title: '模板管理',
            requiresAuth: true,
            order: 6,
          },
        },
        {
          path: 'qrcode-create',
          name: 'codeService_qrcodeAdmin_qrcodeCreate',
          component: () =>
            import('@/views/code-service/qrcode-admin/qrcode-create/index.vue'),
          meta: {
            title: '二维码生成',
            requiresAuth: true,
            order: 5,
            // icon: 'icon-wechat',
          },
        },
        {
          path: 'qrcode-detail',
          name: 'codeService_qrcodeAdmin_qrcodeDetail',
          component: () =>
            import('@/views/code-service/qrcode-admin/qrcode-detail/index.vue'),
          meta: {
            title: '二维码明细',
            requiresAuth: true,
            order: 6,
          },
        },
        {
          path: 'scanning-code-record',
          name: 'codeService_qrcodeAdmin_scanningCodeTimes',
          component: () =>
            import(
              '@/views/code-service/qrcode-admin/scanning-code-record/index.vue'
            ),
          meta: {
            title: '扫码记录',
            requiresAuth: true,
            order: 2,
          },
        },
      ],
    },
    {
      path: 'wenjuan-survey',
      name: 'codeService_wenjuanSurvey',
      component: () => import('@/views/code-service/wenjuan-survey/index.vue'),
      redirect: '/code-service/wenjuan-survey/launch-admin',
      meta: {
        title: '问卷调查',
        requiresAuth: true,
        order: 2,
        icon: 'icon-select-all',
      },
      children: [
        {
          path: 'launch-admin',
          name: 'codeService_wenjuanSurvey_launchAdmin',
          component: () =>
            import(
              '@/views/code-service/wenjuan-survey/launch-admin/index.vue'
            ),
          meta: {
            title: '投放管理',
            requiresAuth: true,
            order: 0,
          },
        },
        {
          path: 'wenjuan-statistics',
          name: 'codeService_wenjuanSurvey_wenjuanStatistics',
          component: () =>
            import(
              '@/views/code-service/wenjuan-survey/wenjuan-statistics/index.vue'
            ),
          meta: {
            title: '问卷统计',
            requiresAuth: true,
            order: 0,
          },
        },
      ],
    },
    {
      path: 'user-admin',
      name: 'codeService_userAdmin',
      component: () => import('@/views/code-service/organize-center/index.vue'),
      redirect: '/code-service/organize-center/customer-admin',
      meta: {
        title: '用户管理',
        requiresAuth: true,
        order: 3,
        icon: 'icon-user',
      },
      children: [
        {
          path: 'customer-service',
          name: 'codeService_userAdmin_customerService',
          component: () =>
            import('@/views/code-service/user-admin/user-admin/index.vue'),
          meta: {
            title: '扫码用户',
            requiresAuth: true,
            order: 0,
          },
        },
        {
          path: 'customer-admin',
          name: 'codeService_userAdmin_customerAdmin',
          component: () =>
            import('@/views/code-service/user-admin/customer-admin/index.vue'),
          meta: {
            title: '客户管理',
            requiresAuth: true,
            order: 1,
          },
        },
        {
          path: 'person-setting',
          name: 'codeService_userAdmin_personSetting',
          component: () =>
            import('@/views/code-service/user-admin/person-setting/index.vue'),
          meta: {
            title: '用户设置',
            requiresAuth: true,
            activeMenu: 'codeService_userAdmin',
            order: 0,
            hideInMenu: true,
          },
        },
      ],
    },
    {
      path: 'organize-center',
      name: 'codeService_organizeCenter',
      component: () => import('@/views/code-service/organize-center/index.vue'),
      redirect: '/code-service/organize-center/user-admin',
      meta: {
        title: '组织管理',
        requiresAuth: true,
        order: 4,
        icon: 'icon-mind-mapping',
      },
      children: [
        {
          path: 'user-admin',
          name: 'codeService_organizeCenter_userAdmin',
          component: () =>
            import('@/views/code-service/organize-center/user-admin/index.vue'),
          meta: {
            title: '账号管理',
            requiresAuth: true,
            order: 0,
          },
        },
        {
          path: 'roles-admin',
          name: 'codeService_organizeCenter_rolesAdmin',
          component: () =>
            import(
              '@/views/code-service/organize-center/roles-admin/index.vue'
            ),
          meta: {
            title: '角色管理',
            requiresAuth: true,
            order: 0,
          },
        },
        {
          path: 'kefu-admin',
          name: 'codeService_organizeCenter_kefuAdmin',
          component: () =>
            import('@/views/code-service/organize-center/kefu-admin/index.vue'),
          meta: {
            title: '客服管理',
            requiresAuth: true,
            order: 2,
          },
        },
        {
          path: 'group-admin',
          name: 'codeService_organizeCenter_groupAdmin',
          component: () =>
            import(
              '@/views/code-service/organize-center/group-admin/index.vue'
            ),
          meta: {
            title: '分组管理',
            requiresAuth: true,
            order: 5,
          },
        },
        {
          path: 'global-setting',
          name: 'codeService_organizeCenter_globalSetting',
          component: () =>
            import(
              '@/views/code-service/organize-center/global-setting/index.vue'
            ),
          meta: {
            title: '全局配置',
            requiresAuth: true,
            order: 3,
          },
        },
        {
          path: 'data-admin',
          name: 'codeService_organizeCenter_dataAdmin',
          component: () =>
            import('@/views/code-service/organize-center/data-admin/index.vue'),
          meta: {
            title: '企业信息',
            requiresAuth: true,
            order: 4,
          },
        },
      ],
    },
  ],
}
