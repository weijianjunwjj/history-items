export default {
  path: 'history-call-record',
  name: 'HistoryCallRecord',
  component: () => import('@/views/history-call-record/index.vue'),
  meta: {
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
  },
}
