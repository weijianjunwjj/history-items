<template>
  <div class="menu-demo">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      @menu-item-click="menuClick"
    >
      <a-menu-item v-for="(item, index) of menus" :key="String(index)">{{
        item.name
      }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store'

  const router = useRouter()
  const route = useRoute()
  const menus1 = [
    {
      name: '视频客服',
      route: 'videoCall',
      id: '0',
    },
    {
      name: '历史通话记录',
      route: 'HistoryCallRecord',
      id: '1',
    },
    {
      name: '工单管理',
      route: 'orderList',
      id: '2',
    },
  ]
  const menus2 = [
    {
      name: '工单管理',
      route: 'orderList',
      id: '0',
    },
  ]
  const menus = ref(menus1)

  const userStore = useUserStore()

  watch(
    () => userStore.showKF,
    (v) => {
      if (!v) {
        menus.value = menus2
      } else {
        menus.value = menus1
      }
    },
    {
      deep: true,
      immediate: true,
    }
  )

  const app = window.$app
  console.log('route', route)
  console.log('route.name', route.name)
  const selectedKeys = computed(() => {
    return menus.value.find((item) => item.route === route.name)?.id
  })

  watch(
    () => selectedKeys.value,
    (_selectedKeys) => {
      console.error('_selectedKeys', _selectedKeys)
    },
    {
      immediate: true,
    }
  )

  const menuClick = (i: any): void => {
    console.log('i', i)
    const name = menus.value[i].route
    console.log('name', name)
    router.push({ name })
  }

  onMounted(() => {
    app.$bus.on('top-menu-change', (name: any) => {
      console.log('name', name)
      // eslint-disable-next-line no-debugger
      const id = menus.value.find((item) => item.route === name)?.id
      selectedKeys.value = id
    })
  })
</script>

<style scoped>
  .menu-demo {
    box-sizing: border-box;
    width: calc(100% - 330px);
    background-color: var(--color-neutral-2);
  }
</style>
