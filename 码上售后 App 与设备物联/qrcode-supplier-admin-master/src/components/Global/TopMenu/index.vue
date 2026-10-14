<template>
  <div class="menu-demo">
    <a-menu
      mode="horizontal"
      :selected-keys="selectedKey"
      @menu-item-click="menuClick"
    >
      <a-menu-item v-for="item of myRoutes" :key="String(item.name)">{{
        item.meta?.title
      }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
  import usePermission from '@/hooks/permission'
  // import appRoutes from '@/router/routes'
  import { useUserStore } from '@/store'
  import { listenerRouteChange } from '@/utils/route-listener'
  import { RouteRecordNormalized } from 'vue-router'
  import { storeToRefs } from 'pinia'

  const router = useRouter()
  const Permission = usePermission()
  const userStore = useUserStore()
  const selectedKey = ref<string[]>([])
  const { routerList } = storeToRefs(userStore)
  const myRoutes = routerList.value
    .filter((item) => Permission.accessRouter(item))
    .sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return (a.meta.order || 0) - (b.meta.order || 0)
    })
  // console.log('myRoutes', myRoutes)
  listenerRouteChange((newRoute) => {
    if (newRoute.meta.requiresAuth && !newRoute.meta.hideInMenu) {
      const key = newRoute.matched[newRoute.matched.length - 1]?.name as string
      // console.log('key', key)
      if (key.includes('_')) {
        const _key = key.split('_')[0]
        selectedKey.value = [_key]
      } else {
        selectedKey.value = [key]
      }
      const [_key] = selectedKey.value
      const _leftRoutes =
        myRoutes.find((item) => item.name === _key)?.children || []
      // console.log('_leftRoutes', _leftRoutes)
      userStore.switchLeftRoutes(_leftRoutes)
    } else if (
      newRoute.meta.requiresAuth &&
      newRoute.meta.hideInMenu &&
      newRoute.meta.activeMenu
    ) {
      const key = newRoute.meta.activeMenu
      // console.log('key', key)
      if (key.includes('_')) {
        const _key = key.split('_')[0]
        selectedKey.value = [_key]
      } else {
        selectedKey.value = [key]
      }
      const [_key] = selectedKey.value
      const _leftRoutes =
        myRoutes.find((item) => item.name === _key)?.children || []
      // console.log('_leftRoutes', _leftRoutes)
      userStore.switchLeftRoutes(_leftRoutes)
    }
  }, true)
  // const selectedKeys = routes.find((item) => item.name === route.name)
  const menuClick = (name: string): void => {
    // 更新左侧路由
    const leftRoutes =
      routerList.value.find((_route) => _route.name === name)?.children || []
    userStore.switchLeftRoutes(leftRoutes)
    // console.error('name', name)
    router.push({ name })
  }

  onMounted(() => {
    // userStore.switchLeftRoutes(myRoutes[0]?.children || [])
  })
</script>

<style scoped>
  .menu-demo {
    box-sizing: border-box;
    width: calc(100% - 386px);
    background-color: var(--color-neutral-2);
  }
</style>
