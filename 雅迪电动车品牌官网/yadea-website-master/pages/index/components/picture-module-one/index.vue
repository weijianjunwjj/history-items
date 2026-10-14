<!--
 * @Author: yqq
 * @Date: 2022-12-28 17:19:59
 * @LastEditors: yqq
 * @LastEditTime: 2023-01-17 13:57:20
 * @FilePath: \yadea-website\pages\index\components\picture-module-one\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- picture-module-one模块 -->
  <div id="picture-module-one" ref="box" class="appointment-container ptb-2 plr-4">
    <div class="appointment-box" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod?.data?.bgImage) + ')' }">
      <div class="appointment-introduce">
        <div class="picture-module-one-animate my-animate" :class="isShow && 'my-animate-sildeUp'">
          <p id="test" class="fs-60-vw fw-500">
            {{ mod?.data?.desc1 }}
          </p>
          <span class="fs-24-vw">{{ mod?.data?.desc2 }}</span>
          <div class="btn-box">
            <MyButton v-if="mod?.data?.button1Status" class="btn-search-distributor" :href="mod?.data?.buttonUrl1">
              {{ mod?.data?.button1 }}
            </MyButton>
            <MyButton v-if="mod?.data?.button1Status" type="primary" class="btn-appointment-drive" :href="mod?.data?.buttonUrl2">
              {{ mod?.data?.button2 }}
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isInView } from '@/composables/common.ts'

defineProps({
  mod: {
    type: Object,
    default: () => {
      return {
        data: {}
      }
    }
  }
})

const isShow = ref(false)

function handleScroll() {
  const dom = document.querySelector('.picture-module-one-animate')

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
.appointment-container {
  height: 910pxvw;

  .appointment-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;

    .appointment-introduce {
      position: absolute;
      top: 340pxvw;
      left: 140pxvw;

      p {
        color: #ffffff;
        line-height: 70px;
        margin: 0;
      }

      span {
        color: #ffffff;
        line-height: 28px;
        display: inline-block;
        margin-top: 20pxvw;
      }

      .btn-box {
        margin-top: 60pxvw;

        :deep(.btn-search-distributor) {
          width: 148px;
          height: 46px;
          margin-right: 30pxvw;
        }

        :deep(.btn-appointment-drive) {
          width: 148px;
          height: 46px;
          line-height: 21px;
        }
      }
    }
  }
}
</style>
