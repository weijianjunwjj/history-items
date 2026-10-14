<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          <img src="~@/assets/images/logonew.png" class="dis-ib logo" />
          <!-- <div class="dis-ib logo"></div> -->
        </a-typography-title>
      </a-space>
    </div>
    <TopMenu />
    <ul class="right-side">
      <li>
        <a-dropdown trigger="click" style="z-index: 2000">
          <div class="avatar-box">
            <a-avatar
              :size="32"
              :style="{
                marginRight: '8px',
                cursor: 'pointer',
                overflow: 'hidden',
              }"
              class="f-hvc"
            >
              <img v-if="avatar" :preview="false" :src="avatar" />
              <img v-else :preview="false" src="~@/assets/images/avatar.png" />
              <!-- <icon-user :size="20" style="position: relative; left: 1px" /> -->
            </a-avatar>
            <div class="user-box">
              <span>{{ user.nickName }}</span>
              <span class="enterprise-box">
                @ {{ enterprise.enterpriseNick }}
              </span>
            </div>
          </div>
          <template #content>
            <a-doption>
              <a-space direction="vertical" @click="handleGoPersonSetting">
                <span><icon-user /> {{ $t('个人中心') }}</span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <span>
                  <icon-export />
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
  import useUser from '@/hooks/user'
  import { storeToRefs } from 'pinia'
  import Menu from '@/components/menu/index.vue'
  // import logo from '@/assets/images/logo.svg'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const { logout, routerList } = useUser()
  const handleLogout = () => {
    logout()
  }
  const handleGoPersonSetting = () => {
    router.push({ name: 'codeService_userAdmin_personSetting' })
  }

  const avatar = computed(() => {
    return userStore.user?.avatar
  })

  const userStore = useUserStore()
  const { user, enterprise } = storeToRefs(userStore)
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
      width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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

  .avatar-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 180px;

    .user-box {
      width: 120px;

      .enterprise-box {
        font-size: 10px;
        color: #165dff;
      }
    }
  }
</style>
