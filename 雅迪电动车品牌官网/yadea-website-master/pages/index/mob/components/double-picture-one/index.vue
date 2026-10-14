<!--
 * @Author: yqq
 * @Date: 2023-01-03 16:50:02
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 11:13:39
 * @FilePath: \website\pages\index\mob\components\double-picture-one\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- double-picture-one -->
  <div v-if="mod" class="banner3 mt-2-mvw">
    <!-- <template v-for="item in mod.data" :key="item.id"> -->
    <div class="banner3-content mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data[0]?.bgImage) + ')' }">
      <div class="my-animate double-picture-one-animate0" :class="isShow0 && 'my-animate-sildeUp'">
        <span class="fs-12-mvw txt-white ellipsis-1" :style="{ color: mod?.data[0]?.mobileDescColor }">{{ mod?.data[0]?.desc1 }}</span>
        <p class="fs-24-mvw txt-white lh32 fw-500 ellipsis-1" :style="{ color: mod?.data[0]?.mobileDescColor }">
          {{ mod?.data[0]?.desc2 }}
        </p>
        <div class="btn-box flex just-center">
          <MobileButton v-if="mod?.data[0]?.button1Status" type="ghost" :href="mod?.data[0]?.buttonUrl1">
            {{ mod?.data[0]?.button1 }}
          </MobileButton>
          <MobileButton v-if="mod?.data[0]?.button2Status" :route="mod?.data[0]?.buttonUrl2">
            {{ mod?.data[0]?.button2 }}
          </MobileButton>
        </div>
      </div>
    </div>
    <div class="banner3-content mt-2-mvw" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data[1]?.bgImage) + ')' }">
      <div class="my-animate double-picture-one-animate1" :class="isShow1 && 'my-animate-sildeUp'">
        <span class="fs-12-mvw txt-white ellipsis-1" :style="{ color: mod?.data[1]?.mobileDescColor }">{{ mod?.data[1]?.desc1 }}</span>
        <p class="fs-24-mvw txt-white lh32 fw-500 ellipsis-1" :style="{ color: mod?.data[1]?.mobileDescColor }">
          {{ mod?.data[1]?.desc2 }}
        </p>
        <div class="btn-box flex just-center">
          <MobileButton v-if="mod?.data[1]?.button1Status" type="ghost" :href="mod?.data[1]?.buttonUrl1">
            {{ mod?.data[1]?.button1 }}
          </MobileButton>
          <MobileButton v-if="mod?.data[1]?.button2Status" :route="mod?.data[1]?.buttonUrl2">{{ mod?.data[1]?.button2 }}</MobileButton>
        </div>
      </div>
    </div>
    <!-- </template> -->
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
  },
  mobDriveUrl: {
    type: String,
    default: ''
  }
})
const { isShow: isShow0 } = useIsShow('.double-picture-one-animate0')
const { isShow: isShow1 } = useIsShow('.double-picture-one-animate1')

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

  .yadi-mbtn-small {
    font-size: 12mpxvw;
    width: 88mpxvw;
    height: 29mpxvw;
  }

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
