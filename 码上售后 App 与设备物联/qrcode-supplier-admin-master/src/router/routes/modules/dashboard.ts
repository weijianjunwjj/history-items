export default {
  path: 'dashboard',
  name: 'dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  redirect: '/dashboard/dashboard',
  meta: {
    title: 'Dashboard',
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
    roles: ['*'],
  },
  children: [
    {
      path: 'dashboard',
      name: 'dashboard_dashboard',
      component: () => import('@/views/dashboard/dashboard/index.vue'),
      meta: {
        title: 'Dashboard',
        hideSide: true,
        requiresAuth: true,
        order: 1,
      },
    },
  ],
}
