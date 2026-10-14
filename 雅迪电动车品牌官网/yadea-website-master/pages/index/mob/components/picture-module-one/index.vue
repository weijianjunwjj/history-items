<!--
 * @Author: yqq
 * @Date: 2023-01-04 14:41:15
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-17 13:58:35
 * @FilePath: \yadea-website\pages\m\components\picture-module-one\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- picture-module-one -->
  <div v-if="mod" class="banner3 mt-2">
    <div class="banner3-content mt-2 white" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data?.bgImage) + ')' }">
      <div class="picture-module-one-animate my-animate" :class="isShow && 'my-animate-sildeUp'">
        <span class="fs-32-mvw txt-white fw-bold ellipsis-1">{{ mod?.data?.desc1 }}</span>
        <p class="fs-20-mvw txt-white ellipsis-1">{{ mod?.data?.desc2 }}</p>
        <div class="btn-box">
          <MobileButton v-if="mod?.data?.button1Status" type="ghost" :herf="mod?.data?.buttonUrl1">{{ mod?.data?.button1 }}</MobileButton>
          <MobileButton v-if="mod?.data?.button2Status" :herf="mod?.data?.buttonUrl2">{{ mod?.data?.button2 }}</MobileButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIsShow } from '@/composables/useIsShow'

defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: []
      }
    }
  }
})
const { isShow } = useIsShow('.picture-module-one-animate')

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less" scoped>
.banner3-content {
  width: 100%;
  height: 445mpxvw;
  background-size: cover;
  background-position: center;
  padding-top: 50mpxvw;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-of-type {
    margin-top: 0;
  }

  p {
    margin: 0;
  }

  p,
  span {
    width: 100%;
    text-align: center;
    padding: 0 20px;
  }

  .btn-box {
    margin-top: 10mpxvw;
    display: flex;
    flex-direction: row;
    justify-content: center;

    button {
      &:first-of-type {
        margin-right: 5mpxvw;
      }
      &:last-of-type {
        margin-left: 5mpxvw;
      }
    }
  }
}
</style>
