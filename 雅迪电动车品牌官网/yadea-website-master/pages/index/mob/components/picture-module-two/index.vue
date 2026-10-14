<!--
 * @Author: yqq
 * @Date: 2023-01-04 10:28:52
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-08 14:16:28
 * @FilePath: \website\pages\index\mob\components\picture-module-two\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- picture-module-two模块 -->
  <div class="mob-industry-data-container mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod.data?.bgImage) + ')' }">
    <div class="industry-data-items picture-module-two my-animate" :class="isShow && 'my-animate-sildeUp'">
      <div class="industry-data-item">
        <!-- <SvgIcon name="earth" size="98" :color="themeColor" /> -->
        <div class="industry-data">
          <p class="industry-data-title txt-white fs-12-mvw fw-500">全球累计骑行里程</p>
          <p class="industry-data-text txt-white fs-20-mvw fw-bold">
            <!-- 252,519,492,827 -->
            <count-to
              v-if="isShow"
              class="count-to"
              :start-val="cyclingMileage - 10000"
              :end-val="cyclingMileage"
              :duration="duration"
            ></count-to>
            <span class="fs-12-mvw ml-1">km</span>
          </p>
        </div>
      </div>
      <div class="industry-data-item">
        <!-- <SvgIcon name="co2" size="98" :color="themeColor" /> -->
        <div class="industry-data">
          <p class="industry-data-title txt-white fs-12-mvw fw-500">共减少碳排放</p>
          <p class="industry-data-text txt-white fs-20-mvw fw-bold">
            <count-to
              v-if="isShow"
              class="count-to"
              :start-val="carbonEmission - 10000"
              :end-val="carbonEmission"
              :duration="duration"
            ></count-to>
            <span class="fs-12-mvw ml-1">kg</span>
          </p>
        </div>
      </div>
      <div class="industry-data-item">
        <!-- <SvgIcon name="trees" size="98" :color="themeColor" /> -->
        <div class="industry-data">
          <p class="industry-data-title txt-white fs-12-mvw fw-500">相当于种植环保树</p>
          <p class="industry-data-text txt-white fs-20-mvw fw-bold">
            <count-to
              v-if="isShow"
              class="count-to"
              :start-val="plantingTrees - 10000"
              :end-val="plantingTrees"
              :duration="duration"
            ></count-to>
            <span class="fs-12-mvw ml-1">棵</span>
          </p>
        </div>
      </div>
    </div>
    <div class="industry-data-tips txt-white">
      注：弗若斯特沙利文公司为雅迪提供一定的电动两轮车市场行业数据参考使用，我司对所提供的数据有最终解释权。
    </div>
  </div>
</template>

<script setup>
import { duration } from '@/configs/data'
import { useIsShow } from '@/composables/useIsShow'
import { useCounts } from '@/composables/useCount'

const { cyclingMileage, carbonEmission, plantingTrees } = useCounts()

defineProps({
  mod: {
    type: [Array, Object],
    default: () => {
      return {
        data: {}
      }
    }
  }
})
const { isShow } = useIsShow('.picture-module-two')

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})
</script>

<style lang="less">
.mob-industry-data-container {
  width: 100%;
  height: 350mpxvw;
  background-size: cover;
  background-position: center;
  position: relative;
  text-align: center;
  // padding-left: 45mpxvw;

  .industry-data-items {
    display: flex;
    flex-direction: column;
    padding-top: 50mpxvw;
    width: 100%;

    .industry-data-item {
      // display: flex;
      // flex-direction: row;
      // align-items: center;

      svg {
        width: 98mpxvw;
        height: 98mpxvw;
        float: left;
        margin-right: 10mpxvw;
      }

      .industry-data {
        // float: left;
        height: 100%;
        width: calc(100% - 108mpxvw);
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;
        // img {
        //   width: 98mpxvw;
        //   height: 98mpxvw;
        //   margin-right: 10px;
        // }

        .count-to {
          font-family: DINPro-Bold;
          line-height: 24mpxvw;
          margin-top: 9mpxvw;
          display: inline-block;
          .m-fs(20);
        }

        p {
          line-height: 12mpxvw;
          margin: 0;
          letter-spacing: 0;
        }
      }
    }

    .industry-data-item + .industry-data-item {
      margin-top: 24mpxvw;
    }
  }

  .industry-data-tips {
    text-align: center;
    position: absolute;
    bottom: 12mpxvw;
    left: 50%;
    transform: translateX(-50%);
    width: 176mpxvw;
    opacity: 0.45;
    .m-fs(6);
  }
}
</style>
