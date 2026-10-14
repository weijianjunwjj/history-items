export default {
  path: 'video-call',
  name: 'videoCall',
  component: () => import('@/views/video-call/empty.vue'),
  meta: {
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
  },
}
