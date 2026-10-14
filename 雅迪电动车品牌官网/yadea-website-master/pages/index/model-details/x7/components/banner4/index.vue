<template>
  <div ref="banner4" class="banner-4">
    <div ref="bannerFirst" class="describe-container">
      <div class="title HYQiHei-bold">人车合一 贴地飞行</div>
      <div class="gradient-segmentation"></div>
      <div class="subTitle HYQiHei">大师级专业操控调教，表现够顶<br />直立且运动的人机三角<br />舒展激进骑行姿态，开阔视野自信主宰</div>
    </div>
    <div class="photo-param-container">
      <div v-for="(item, index) in photoParamList" :key="index" class="param-item">
        <img class="top-img" :src="item.image" alt="" />
        <div class="title HYQiHei">{{ item.title }}</div>
        <div class="subTitle HYQiHei">{{ item.subTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
const banner4 = ref()
const bannerFirst = ref()
useChangeOpacity(banner4, [bannerFirst], 'banner4-animation', false)
const photoParamList = ref([
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param1_98a18d62d6.png?updated_at=2023-03-22T06:36:00.430Z',
    title: '人机三角调教',
    subTitle: '直线不偏移，过弯更灵活'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param2_7c2ba9a865.png?updated_at=2023-03-22T06:50:08.515Z',
    title: '气囊减震',
    subTitle: '战斗与舒适并存'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param3_06b173222b.png?updated_at=2023-03-22T06:51:20.208Z',
    title: '大盘碟刹',
    subTitle: '最高速刹停仅1.9秒，强大信心保障'
  },
  {
    image: 'http://osswebsite.yadea.com.cn/banner4_param4_bbb3300643.png?updated_at=2023-03-22T06:52:34.823Z',
    title: 'TTFAR高性能轮胎',
    subTitle: '全天候稳定输出'
  }
])
</script>
<style lang="less">
.banner-4 {
  position: relative;
  width: 100%;
  background: url('http://osswebsite.yadea.com.cn/banner4_9e7920c958.png?updated_at=2023-03-22T06:08:33.479Z') no-repeat;
  background-size: 110%;
  background-color: #141414;
  background-position: 70% 0;

  .describe-container {
    padding: 405pxvw 0 0 1090pxvw;
    .title {
      font-size: 55pxvw;
      color: #6abb3f;
    }
    .gradient-segmentation {
      display: inline-block;
      width: 362pxvw;
      height: 14pxvw;
      background: linear-gradient(to right, #6abb3f -40%, transparent 70%);
      border-radius: 5pxvw;
      margin: 65pxvw 0 0;
    }
    .subTitle {
      font-size: 24pxvw;
      color: #ffffff;
      line-height: 31pxvw;
      margin: -2pxvw 0 0;
    }
  }

  .photo-param-container {
    margin: 497pxvw 0 0;
    padding: 0 150pxvw;
    display: flex;
    justify-content: space-between;
    .param-item {
      text-align: center;
      .top-img {
        width: 376pxvw;
        height: 429pxvw;
      }

      .title {
        margin: 43pxvw 0 0;
        color: #6abb3f;
      }

      .subTitle {
        margin: 0 0 145pxvw;
        color: #ffffff;
      }
    }
  }

  .banner4-animation {
    animation: opacityBanner4 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner4 {
    0% {
      opacity: 0;
      position: relative;
      top: 100px;
    }
    100% {
      opacity: 1;
      position: relative;
      top: 0;
    }
  }
}
</style>
