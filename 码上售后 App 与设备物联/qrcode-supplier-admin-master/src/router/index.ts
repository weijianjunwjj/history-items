import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import MyLayout from '@/layout/my-layout.vue'
import createRouteGuard from './guard'
import { pageRoutes } from './guard/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...pageRoutes,
    {
      name: 'root',
      path: '/',
      component: MyLayout,
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'notFound',
    //   component: () => import('@hx/packages/views/not-found/index.vue'),
    // },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

createRouteGuard(router)

export default router
