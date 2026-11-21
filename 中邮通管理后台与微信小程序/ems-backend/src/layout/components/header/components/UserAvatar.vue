<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex cursor-pointer items-center font-size-13>
      <span>{{ getTimes() }}好！</span>
      <span mr10 >{{ nickname }}</span>
      <img :src="headimgurl" h-35 w-35 rounded-full />
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store'
import { renderIcon,isEmpty } from '@/utils'

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

function getTimes() {
  var currentDate = new Date()
  var hours = currentDate.getHours()

  if (hours < 12) {
    return '上午'
  } else if (hours >= 12 && hours < 18) {
    return '下午'
  } else {
    return '晚上'
  }
}

const nickname = computed(() => {
  return userStore.userInfo.nickName
})
const headimgurl = computed(() => {
  return userStore.userInfo.headImgUrl
})


</script>
