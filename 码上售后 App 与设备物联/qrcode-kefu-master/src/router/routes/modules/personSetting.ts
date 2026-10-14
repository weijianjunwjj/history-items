export default {
  path: 'person-setting',
  name: 'personSetting',
  component: () => import('@/views/person-setting/index.vue'),
  meta: {
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
  },
}
