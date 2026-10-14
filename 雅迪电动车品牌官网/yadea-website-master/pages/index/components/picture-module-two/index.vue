<!--
 * @Author: yqq
 * @Date: 2022-12-28 17:26:44
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-08 14:24:36
 * @FilePath: \website\pages\index\components\picture-module-two\index.vue
 * @Description: 
 * 
-->
<template>
  <!-- picture-module-two模块 -->
  <div class="industry-data-container mt-2" :style="{ backgroundImage: 'url(' + replaceImgUrl(mod.data?.bgImage) + ')' }">
    <!-- <div class="industry-data-container mt-2"> -->
    <div class="industry-data-items">
      <div class="industry-data-item">
        <!-- <SvgIcon name="earth" class="full" :color="themeColor" /> -->
        <p class="industry-data-title">全球累计骑行里程</p>
        <p class="industry-data-text picture-module-two-animate1">
          <count-to
            v-if="isShow1"
            :start-val="cyclingMileage - 10000"
            :end-val="cyclingMileage"
            :duration="duration"
            class="industry-data-text mr-2"
          ></count-to>
          <!-- <span class="industry-data-text mr-2">{{ mileage }}</span> -->
          <span class="span">km</span>
        </p>
      </div>
      <div class="industry-data-item">
        <!-- <SvgIcon name="co2" class="full" :color="themeColor" /> -->
        <!-- <img src="@/assets/images/home/industry-data-img2.png" alt="图片" /> -->
        <p class="industry-data-title">共减少碳排放</p>
        <p class="industry-data-text picture-module-two-animate2">
          <count-to
            v-if="isShow2"
            :start-val="carbonEmission - 10000"
            :end-val="carbonEmission"
            :duration="duration"
            class="industry-data-text mr-2"
          ></count-to>
          <span class="span">kg</span>
        </p>
      </div>
      <div class="industry-data-item">
        <!-- <SvgIcon name="trees" class="full" :color="themeColor" /> -->
        <!-- <img src="@/assets/images/home/industry-data-img3.png" alt="图片" /> -->
        <p class="industry-data-title">相当于种植环保树</p>
        <p class="industry-data-text picture-module-two-animate3">
          <count-to
            v-if="isShow3"
            :start-val="plantingTrees - 10000"
            :end-val="plantingTrees"
            :duration="duration"
            class="industry-data-text mr-2"
          ></count-to>
          <span class="span">棵</span>
        </p>
      </div>
    </div>
    <div class="industry-data-tips">
      注：弗若斯特沙利文公司为雅迪提供一定的电动两轮车市场行业数据参考使用，我司对所提供的数据有最终解释权。
    </div>
  </div>
</template>

<script setup>
import { themeColor, duration } from '@/configs/data'
import { useCounts } from '@/composables/useCount'

const { cyclingMileage, carbonEmission, plantingTrees } = useCounts()

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

const { isShow: isShow1 } = useIsShow('.picture-module-two-animate1')
const { isShow: isShow2 } = useIsShow('.picture-module-two-animate2')
const { isShow: isShow3 } = useIsShow('.picture-module-two-animate3')

onMounted(async () => {
  await nextTick()
  const { useHomePageStore } = store
  const homePageStore = useHomePageStore()
  homePageStore.loadNextMod()
})

useCounts()
</script>

<style lang="less" scoped>
.industry-data-container {
  width: 100%;
  height: 460pxvw;
  // background-image: url('@/assets/images/home/industry-data-back.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  margin-bottom: -1px;

  .industry-data-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 1320pxvw;
    position: absolute;
    top: 170pxvw;
    left: 50%;
    transform: translateX(-50%);

    .industry-data-item {
      min-width: 313pxvw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .industry-data-title {
        font-size: 20pxvw;
        font-weight: 500;
        color: #fff;
        margin: 10pxvw 0;
      }

      .industry-data-text {
        display: inline-block;
        font-size: 32pxvw;
        letter-spacing: 1px;
        font-weight: bold;
        font-family: DINPro-Bold;
        color: #fff;
        .span {
          font-size: 20pxvw;
          // font-family: OPPOSans 2-Regular, OPPOSans 20;
          font-weight: 400;
        }
      }

      svg {
        width: 218pxvw;
        height: 218pxvw;
      }
    }
  }

  .industry-data-tips {
    position: absolute;
    bottom: 32pxvw;
    font-size: 14pxvw;
    font-weight: 400;
    color: #888;
    line-height: 16px;
    width: 100%;
    text-align: center;
  }
}
</style>
