const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Demo',
  path: '/demo',
  component: Layout,
  redirect: '/demo/crud',
  isHidden: false,
  meta: {
    title: '示例页面',
    icon: 'uil:pagelines',
    role: ['admin'],
    requireAuth: true,
    order: 3,
  },
  children: [
    {
      name: 'Crud',
      path: 'crud',
      component: () => import('./table/index.vue'),
      meta: {
        title: 'CRUD表格',
        icon: 'ic:baseline-table-view',
        role: ['aaa'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'MDEditor',
      path: 'md-editor',
      component: () => import('./editor/md-editor.vue'),
      meta: {
        title: 'MD编辑器',
        icon: 'ri:markdown-line',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'RichTextEditor',
      path: 'rich-text',
      component: () => import('./editor/rich-text.vue'),
      meta: {
        title: '富文本编辑器',
        icon: 'ic:sharp-text-rotation-none',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'Upload',
      path: 'upload',
      component: () => import('./upload/index.vue'),
      meta: {
        title: '图片上传',
        icon: 'mdi:upload',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'Tree',
      path: 'tree',
      component: () => import('./tree/index.vue'),
      meta: {
        title: '树形结构',
        icon: 'mdi:upload',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
  ],
}
