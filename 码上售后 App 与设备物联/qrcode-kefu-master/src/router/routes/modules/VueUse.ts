export default {
  path: 'vue-use',
  name: 'vueUse',
  component: () => import('@/components/VueUse/index.vue'),
  meta: {
    requiresAuth: false,
  },
}
