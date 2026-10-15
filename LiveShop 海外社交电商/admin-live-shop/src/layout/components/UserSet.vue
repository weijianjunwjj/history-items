<template>
  <div class="user-set">
    <template v-for="(item, idx) in userIcon" :key="idx">
      <n-el v-if="item.show" tag="div" class="set-item hover-color" @click="compData[item.fun]">
        <n-icon :size="item.size" :color="item.color">
          <component :is="item.name"></component>
        </n-icon>
      </n-el>
    </template>
    <n-el tag="div" class="set-item">
      <n-switch @update:value="compData.handleDarkTheme" v-model:value="darkTheme" size="medium">
        <template #checked-icon>
          <n-icon :size="14">
            <component :is="'ionicons5-MoonOutline'"></component>
          </n-icon>
        </template>
        <template #unchecked-icon>
          <n-icon :size="14">
            <component :is="'ionicons5-SunnyOutline'"></component>
          </n-icon>
        </template>
      </n-switch>
    </n-el>
    <div class="set-item">
      <span class="mr-2">{{ userInfo.nickname }}</span>
      <n-dropdown @select="compData.handleSelect" trigger="click" :options="userOptions">
        <n-avatar :src="userInfo.head_img"/>
      </n-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {NAvatar} from "naive-ui"
import {computed, reactive, ref} from "vue"
import appStore from "@/pinia/app"
import {useFullscreen} from "@vueuse/core"
import {useRouter} from "vue-router"
import localStore from "@/utils/localStore"
import {logout} from "@/api/login"
import head_img from '../../assets/yanghang.jpg'

const app = appStore()
const router = useRouter()
const {isFullscreen, toggle} = useFullscreen(document.body)
app.userSetting.isFullscreen = isFullscreen.value
const userIcon = ref([
  {size: 18, color: "0e7a0d", name: "ionicons5-HomeOutline", fun: "HomeOutline", show: true},
  {size: 18, color: "0e7a0d", name: "ionicons5-ScanOutline", fun: "ScanOutline", show: true}
])
const compData = reactive({
  searchModel: false,
  ScanOutline() {
    toggle()
  },
  HomeOutline() {
    window.location.href = "/"
  },
  handleDarkTheme(value: any) {
    app.userSetting.themeName = value ? "darkTheme" : null
  },
  async handleSelect(key: string | number) {
    if (key === "stmt3") {
      router.push("/own")
    }
    if (key === "stmt4") {
      const id = app.userInfo?.id
      try {
        await logout(id?.toString())
      } finally {
        app.$reset()
        localStore.clearAll()
        window.SITE_CONFIG.dynamicMenuRoutesHasAdded = false
        await router.push("/login")
      }

    }
  }
})
const darkTheme = ref(app.userSetting.themeName !== null)
const userOptions = [
  {label: "用户中心", key: "stmt3"},
  {key: "header-divider", type: "divider"},
  {label: "退出登录", key: "stmt4"}
]

interface UserInfo {
  head_img: string;
  nickname: string;
}

// 这里使用类型断言，确保 TypeScript 知道 storeUserInfo 的类型
const userInfo = computed<UserInfo>(() => {
  const storeUserInfo = appStore()?.userInfo as Partial<UserInfo> || {};  // 添加 Partial 类型
  return {
    head_img: storeUserInfo.head_img || head_img,  // 默认头像
    nickname: storeUserInfo.nickname || '用户',  // 默认昵称
  };
});
</script>
<style lang="less" scoped>
.user-set {
  display: flex;
  height: 50px;
  flex-shrink: 0;
  margin-left: 50px;

  .set-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 12px;
    padding-right: 12px;
    cursor: pointer;
    flex-shrink: 0;

    .n-icon {
      outline: none;

      svg {
        outline: none;
      }
    }

    &.hover-color {
      &:last-of-type {
        padding-right: 2px;
      }

      &:hover {
        color: var(--primary-color);
      }
    }
  }
}
</style>
