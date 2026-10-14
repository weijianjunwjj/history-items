<template>
  <div class="page-model-details-modern">
    <Banner1 />
    <Banner2 />
    <Banner3 />
    <Banner4 />
    <Banner5 />
    <Banner6 />
    <Banner7 />
    <Banner8 />
    <Banner9 />
    <Banner10 />
    <!-- 重磅联名 -->
    <div class="banner13">
      <div class="title HYQiHei-bold">重磅联名</div>
      <swiper :modules="modules" :pagination="{ clickable: true }">
        <swiper-slide v-for="item in banner13List" :key="item">
          <img :src="replaceImgUrl(item)" alt="" />
        </swiper-slide>
      </swiper>
    </div>
    <Banner11 />
    <WjjFooter p="https://item.jd.com/10071448506922.html" />
  </div>
</template>
<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import Banner1 from './components/banner1.vue'
import Banner2 from './components/banner2.vue'
import Banner3 from './components/banner3.vue'
import Banner4 from './components/banner4.vue'
import Banner5 from './components/banner5.vue'
import Banner6 from './components/banner6.vue'
import Banner7 from './components/banner7.vue'
import Banner8 from './components/banner8.vue'
import Banner9 from './components/banner9.vue'
import Banner10 from './components/banner10.vue'
import Banner11 from './components/banner11.vue'
import WjjFooter from './components/wjj-footer.vue'
useHead({
  meta: [
    { name: 'keywords', content: '雅迪摩登电动车_雅迪摩登多少钱_价格|图片-雅迪电动车官网' },
    {
      name: 'description',
      content: '本页面为雅迪摩登电动车产品介绍，了解更多雅迪电动车相关内容，欢迎访问雅迪电动车官方网站。'
    }
  ]
})

const modules = [Pagination]

// banner13数据
const banner13List = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_ca7fd80670.jpg?updated_at=2023-03-30T10:34:19.069Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_605acc13fe.jpg?updated_at=2023-03-30T10:34:19.056Z'
]
</script>

<style lang="less">
.page-model-details-modern {
  .banner13 {
    padding-bottom: 50pxvw;
    .title {
      font-size: 55pxvw;
      color: #a0d2b9;
      text-align: center;
      margin-bottom: 30pxvw;
    }
    .swiper {
      height: 35vw;
      .swiper-slide {
        text-align: center;
        img {
          width: 1100pxvw;
          height: 550pxvw;
          object-fit: contain;
          border-radius: 30px;
        }
      }
      .swiper-pagination-bullet {
        width: 38pxvw;
        height: 38pxvw;
        background: transparent;
        border: 1px solid #a0d2b9;
        margin: 0 22pxvw;
      }

      .swiper-pagination-bullet.swiper-pagination-bullet-active {
        background: #a0d2b9;
      }
    }
  }
}
</style>
