<!--
 * @Author: yqq
 * @Date: 2022-12-28 16:57:57
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-06 16:52:17
 * @FilePath: \website\pages\index\components\double-picture-one\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- double-picture-one模块 -->
  <div v-if="mod" class="banner3 ptb-2 plr-2">
    <client-only>
      <a-row :gutter="[20]" class="m0 banner3-box">
        <a-col v-for="(item, index) in mod.data" :key="index" :span="12">
          <img class="full-w" :src="replaceImgUrl(item?.bgImage)" alt="" />
          <div class="banner3-content-left pos-middle-h">
            <div class="flex-col just-sb align-center double-picture-one-animate my-animate" :class="isShow && 'my-animate-sildeUp'">
              <div
                class="txt-white fs-30-vw load-fade-in homepage-sub-title"
                style="font-weight: unset"
                :style="{ color: item?.descColor }"
              >
                {{ item?.desc1 }}
              </div>
              <div class="txt-white fs-60-vw load-fade-in homepage-title" :style="{ color: item?.descColor }">{{ item?.desc2 }}</div>
              <div class="mt-6-vw">
                <MyButton v-if="item?.button1Status" class-name="test-drive fs-18-vw mr-5" type="ghost" :href="item?.buttonUrl1">{{
                  item.button1
                }}</MyButton>
                <MyButton v-if="item?.button2Status" class-name="learn-more fs-18-vw txt-black" :href="item?.buttonUrl2">
                  {{ item?.button2 }}
                </MyButton>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </client-only>
  </div>
</template>

<script setup>
import { isInView } from '@/composables/common.ts'

defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: []
      }
    }
  }
})

const isShow = ref(false)

function handleScroll() {
  const dom = document.querySelector('.double-picture-one-animate')

  if (isInView(dom)) {
    isShow.value = true
  } else {
    isShow.value = false
  }
}
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
.banner3 {
  height: 800pxvw;

  &-box {
    height: 100%;
    overflow: hidden;
  }
  &-content {
    &-left,
    &-right {
      width: 100%;
      min-height: 183pxvw;
      margin-top: 80pxvw;
      top: 0;

      .homepage-title {
        margin-top: 8pxvw;
      }
    }
  }
}
</style>
