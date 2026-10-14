/*
  码上服务模块路由
*/
export default {
  path: 'code-service',
  name: 'codeService',
  component: () => import('@/views/code-service/index.vue'),
  redirect: '/code-service/device-admin',
  meta: {
    title: '系统设置',
    requiresAuth: true,
    order: 99999,
    icon: 'icon-dashboard',
  },
  children: [
    {
      path: 'organize-center',
      name: 'codeService_organizeCenter',
      component: () => import('@/views/code-service/organize-center/index.vue'),
      redirect: '/code-service/organize-center/user-admin',
      meta: {
        title: '组织管理',
        requiresAuth: true,
        order: 0,
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
