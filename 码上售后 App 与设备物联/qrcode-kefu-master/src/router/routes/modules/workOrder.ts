export default {
  path: 'workOrder',
  name: 'workOrder',
  redirect: '/workOrder/orderList',
  component: () => import('@/views/work-order/index.vue'),
  meta: {
    icon: 'icon-dashboard',
    requiresAuth: true,
    order: 0,
  },
  children: [
    {
      path: 'orderList',
      name: 'orderList',
      component: () => import('@/views/work-order/work-order/index.vue'),
      meta: {
        locale: 'icon-dashboard',
        requiresAuth: true,
        order: 1,
      },
    },
    {
      path: 'orderDetail/:id?',
      name: 'orderDetail',
      component: () => import('@/views/work-order/order-detail/index.vue'),
      meta: {
        locale: 'icon-dashboard',
        requiresAuth: true,
        order: 1,
      },
    },
  ],
}
