<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <enterpriseLogo :enterprise="enterprise"></enterpriseLogo>
      <a-descriptions
        :column="{ xs: 1, md: 2, lg: 2 }"
        :label-style="{
          width: '80px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
      >
        <a-descriptions-item label="用户名:">
          {{ userStore.$state.user.nickName }}
        </a-descriptions-item>
        <a-descriptions-item label="账户ID:">
          {{ userStore.$state.user.userId }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号码:">
          <span v-if="phone">
            {{
              phone?.substr(0, 3) +
              '******' +
              phone?.substr(9, phone?.split('').length)
            }}
          </span>
          <span v-else>暂未绑定</span>
        </a-descriptions-item>
        <a-descriptions-item label="注册时间:">
          {{ dayjs(userStore.$state.user.createTime).format('YYYY-MM-DD') }}
        </a-descriptions-item>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store'
  // import { storeToRefs } from 'pinia'
  import dayjs from 'dayjs'
  import enterpriseLogo from './enterpriseLogo.vue'

  const userStore = useUserStore()
  // const { user } = storeToRefs(userStore)

  const phone = computed(() => {
    return userStore.$state.user.phone
  })
</script>

<style scoped lang="less">
  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }
  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;
    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
