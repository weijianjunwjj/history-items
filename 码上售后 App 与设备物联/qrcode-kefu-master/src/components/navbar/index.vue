<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          <!-- 码上服务系统 -->
          <img src="~@/assets/images/logonew.png" class="dis-ib logo" />
        </a-typography-title>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <TopMenu />
    <ul class="right-side">
      <li>
        <a-dropdown trigger="click">
          <div class="avatar-box">
            <a-avatar
              :size="32"
              shape="circle"
              :style="{ marginRight: '8px', cursor: 'pointer' }"
              class="f-hvc"
            >
              <img v-if="avatar" alt="avatar" :src="avatar" />
              <img v-else alt="avatar" src="~@/assets/images/avatar.png" />
              <!-- <icon-user
                v-else
                :size="20"
                style="position: relative; left: 1px"
              /> -->
            </a-avatar>
            <span>{{ nickName }}</span>
          </div>
          <template #content>
            <a-doption>
              <a-space direction="vertical" @click="handleGoPersonSetting">
                <span><icon-user /> {{ $t('个人中心') }}</span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore, useTabBarStore, useUserStore } from '@/store'
  import { LOCALE_OPTIONS } from '@/locale'
  import useLocale from '@/hooks/locale'
  import useUser from '@/hooks/user'
  import { storeToRefs } from 'pinia'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { listenerRouteChange } from '@/utils/route-listener'
  import { useRouter } from 'vue-router'
  import MessageBox from '../message-box/index.vue'

  const router = useRouter()

  const appStore = useAppStore()
  const { logout } = useUser()
  const handleLogout = () => {
    logout()
  }
  const nickName = ref('')
  // const avatar = ref('')
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  console.log(userStore.$state.user)
  nickName.value = userStore.$state.user.nickName
  // avatar.value = userStore.$state.user.avatar
  const avatar = computed(() => {
    return userStore.$state.user.avatar
  })

  const handleGoPersonSetting = () => {
    router.push({ name: 'personSetting' })
  }

  // const nickName = computed(() => {
  //   return userStore.user?.nickName
  // })
  const toggleDrawerMenu = inject('toggleDrawerMenu')
</script>

<style scoped lang="less">
  .logo {
    width: 180px;
    // height: 60px;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    span {
      display: inline-block;
      width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .avatar-box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: rgb(var(--gray-2));
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
