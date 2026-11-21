<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex cursor-pointer items-center font-size-13>
      <span>下午好！</span>
      <span mr10>{{ userStore.name }}</span>
      <img :src="userStore.avatar" h-35 w-35 rounded-full />
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store'
import { renderIcon } from '@/utils'

const userStore = useUserStore()

const options = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: '14px' }),
  },
]

function handleSelect(key) {
  if (key === 'logout') {
    $dialog.confirm({
      title: '提示',
      type: 'info',
      content: '确认退出？',
      confirm() {
        userStore.logout()
        $message.success('已退出登录')
      },
    })
  }
}
</script>
