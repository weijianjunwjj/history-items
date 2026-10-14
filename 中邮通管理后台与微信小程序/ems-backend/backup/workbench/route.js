const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Dashboard',
  path: '/',
  component: Layout,
  isHidden: false,
  redirect: '/order-management/index',
  children: [
    {
      name: 'Workbench',
      path: 'workbench',
      component: () => import('./index.vue'),
      meta: {
        title: '工作台',
        icon: 'mdi:home',
        order: 0,
      },
    },
  ],
}
