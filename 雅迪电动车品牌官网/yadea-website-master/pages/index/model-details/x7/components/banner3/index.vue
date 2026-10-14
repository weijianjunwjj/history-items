<template>
  <div class="banner-3">
    <!-- 第一个参数 -->
    <div ref="banner30" class="banner-3-0 banner-3-0-height">
      <div ref="bannerFirst" class="param-container">
        <div class="title HYQiHei-bold">超强动力 随芯所驭</div>
        <div class="subTitle HYQiHei">雅迪国际领先TTFAR PRO电机</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">拧动握把，即刻闯入澎湃世界</div>
        <div class="param-list">
          <img v-for="(item, index) in banner0ParamList" :key="index" class="item-img" :src="item" alt="" />
        </div>
      </div>
      <div class="image-container">
        <img class="detail-img" src="https://osswebsite.yadea.com.cn/banner3_1_790bfe7909.png?updated_at=2023-03-21T01:19:08.058Z" alt="" />
      </div>
    </div>

    <!-- 第二个参数 -->
    <div ref="banner31" class="banner-3-0 banner-3-3">
      <div class="image-container">
        <div ref="bannerStepImage" class="detail-img-banner4">
          <img ref="detailImgBanner1" :src="replaceImgUrl(frameImgList[0])" alt="" />
          <img ref="detailImgBanner2" :src="replaceImgUrl(frameImgList[1])" alt="" />
          <img ref="detailImgBanner3" :src="replaceImgUrl(frameImgList[2])" alt="" />
          <img ref="detailImgBanner4" :src="replaceImgUrl(frameImgList[3])" alt="" />
          <img ref="detailImgBanner5" :src="replaceImgUrl(frameImgList[4])" alt="" />
        </div>
      </div>
      <div ref="bannerSecond" class="param-container param-container-banner3-4">
        <div class="title HYQiHei-bold">爬坡高手 不信“斜”</div>
        <div class="subTitle HYQiHei">雅迪TTFAR闪电控制器</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">长久爬坡无压力，一路披荆斩棘</div>
        <div class="introduce-list">
          <div v-for="(item, index) in banner1IntroduceList" :key="index" class="item">
            <div class="title HYQiHei">{{ item.title }}</div>
            <div class="subTitle HYQiHei">{{ item.subTitle }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三个参数 -->
    <div ref="banner32" class="banner-3-0">
      <div ref="bannerThird" class="param-container">
        <div class="title HYQiHei-bold">激进or平顺<br />看你登峰造极</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">全新油门调控及算法调教，2种骑行模式流畅切换</div>
        <div class="introduce-list">
          <div v-for="(item, index) in banner2IntroduceList" :key="index" class="item">
            <div class="title HYQiHei">{{ item.title }}</div>
            <div class="subTitle HYQiHei">{{ item.subTitle }}</div>
          </div>
        </div>
      </div>
      <div class="image-container">
        <img
          class="detail-img-banner3"
          src="https://osswebsite.yadea.com.cn/banner3_3_0_e87a757ca2.png?updated_at=2023-03-21T02:21:58.260Z"
          alt=""
        />
      </div>
    </div>

    <!-- 第四个参数 -->
    <div ref="banner33" class="banner-3-0 banner-3-3">
      <div class="image-container">
        <img
          class="detail-img-banner4"
          src="https://osswebsite.yadea.com.cn/banner3_4_0_1fa52b23bb.png?updated_at=2023-03-21T02:46:25.461Z"
          alt=""
        />
      </div>
      <div ref="bannerFourth" class="param-container param-container-banner3-4">
        <div class="title HYQiHei-bold">超长续航 尽管飙</div>
        <div class="subTitle HYQiHei">雅迪TTFAR石墨烯3代Plus电池</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">采用石墨烯配方、<br />全新高活性超大板栅设计，能效非凡</div>
        <div class="introduce-list">
          <div v-for="(item, index) in banner3IntroduceList" :key="index" class="item">
            <div class="title HYQiHei">{{ item.title }}</div>
            <div class="subTitle HYQiHei">{{ item.subTitle }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第五个参数 -->
    <div ref="banner34" class="banner-3-0 banner-3-4">
      <div ref="bannerFifth" class="param-container param-container-banner3-5">
        <div class="title">稳定输出 潜能超乎想象</div>
        <div class="subTitle">雅迪TTFAR智能温感充电器</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title">低温充得满，高温充不鼓，凛然不惧</div>
        <div class="introduce-list">
          <div v-for="(item, index) in banner4IntroduceList" :key="index" class="item">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.subTitle }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
import _ from 'lodash'
const banner30 = ref()
const banner31 = ref()
const banner32 = ref()
const banner33 = ref()
const banner34 = ref()
const bannerFirst = ref()
const bannerSecond = ref()
const bannerThird = ref()
const bannerFourth = ref()
const bannerFifth = ref()

useChangeOpacity(banner30, [bannerFirst], 'banner3-animation', false)
useChangeOpacity(banner31, [bannerSecond], 'banner3-animation', false)
useChangeOpacity(banner32, [bannerThird], 'banner3-animation', false)
useChangeOpacity(banner33, [bannerFourth], 'banner3-animation', false)
useChangeOpacity(banner34, [bannerFifth], 'banner3-animation', false)

const bannerStepImage = ref()
const detailImgBanner1 = ref()
const detailImgBanner2 = ref()
const detailImgBanner3 = ref()
const detailImgBanner4 = ref()
const detailImgBanner5 = ref()
const scale = ref(0)
const isCalculate = ref(false)
const lastEvent = ref(0)

const handleWheel = _.throttle(e => {
  const rect = bannerStepImage.value.getBoundingClientRect()
  const vWidth = window.innerWidth || document.documentElement.clientWidth
  const vHeight = window.innerHeight || document.documentElement.clientHeight
  if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight / 2 - 864 / 4) {
    document.body.style.overflow = 'visible'
  } else {
    // dom元素出现在浏览器窗口中
    const event = e.wheelDelta || e.detail

    if (lastEvent.value != event) {
      showAnimation(false, event)
    }
    lastEvent.value = event
  }
}, 50)

const showAnimation = _.throttle((flag, offset) => {
  if (isCalculate) {
    document.body.style.overflow = 'hidden'
    scale.value += -offset * 0.03
  }
  if (scale.value > 81 || scale.value < 0) {
    isCalculate.value = false
    document.body.style.overflow = 'visible'
    return
  }

  isCalculate.value = true

  detailImgBanner1.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${-scale.value * 2}, 1, 1)`
  detailImgBanner2.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${-scale.value * 1}, 1, 1)`
  detailImgBanner3.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1)`
  detailImgBanner4.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${scale.value * 1}, 1, 1)`
  detailImgBanner5.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${scale.value * 2}, 1, 1)`
}, 50)

onMounted(async () => {
  await nextTick()
  window.addEventListener('wheel', handleWheel)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
})

const banner0ParamList = ref([
  'https://osswebsite.yadea.com.cn/banner3_param0_2e3d308a53.png?updated_at=2023-03-21T01:55:40.361Z',
  'https://osswebsite.yadea.com.cn/banner3_2_9bb00a406b.png?updated_at=2023-03-21T01:55:25.049Z',
  'https://osswebsite.yadea.com.cn/banner3_3_38cc13fc2b.png?updated_at=2023-03-21T01:55:21.811Z',
  'https://osswebsite.yadea.com.cn/banner3_4_99b6a2f981.png?updated_at=2023-03-21T01:55:17.321Z'
])

const banner1IntroduceList = ref([
  {
    title: '过载能力再创巅峰',
    subTitle: '强弱电分离布局 散热能力全面优化'
  },
  {
    title: '防御高手有高招',
    subTitle: '全灌胶工艺，IP67级防水'
  }
])

const banner2IntroduceList = ref([
  {
    title: 'TTFAR增程模式',
    subTitle: '都市王者，骑出风范'
  },
  {
    title: 'SPORT动力模式',
    subTitle: '超强动力，一键起飞'
  },
  {
    title: '智能档位记忆功能',
    subTitle: '专属档位，尽释个性'
  }
])

const banner3IntroduceList = ref([
  {
    title: '容量MAX',
    subTitle: '比普通铅酸电池容量提升约30%'
  },
  {
    title: '寿命MAX',
    subTitle: '充放电循环1000次'
  },
  {
    title: '实力MAX',
    subTitle: '拥有36项国家专利'
  },
  {
    title: '质保MAX',
    subTitle: '24个月换新'
  }
])

const banner4IntroduceList = ref([
  {
    title: '工艺进阶',
    subTitle: '防水、防霉、又防震'
  },
  {
    title: '品质晋级',
    subTitle: '充电器寿命大幅提升'
  },
  {
    title: '结构升级',
    subTitle: '双风道设计，散热更好'
  }
])

const frameImgList = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/kongzhiqi_04_6d1d2b6bae.png?updated_at=2023-03-26T07:40:58.588Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/kongzhiqi_03_0d8b08ddc6.png?updated_at=2023-03-26T07:40:58.594Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/kongzhiqi_02_b10a8e34b4.png?updated_at=2023-03-26T07:40:58.615Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/kongzhiqi_01_ce9f172ff7.png?updated_at=2023-03-26T07:40:58.578Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_afdfca5032.png?updated_at=2023-03-26T07:40:58.636Z'
]
defineProps({
  bannerType: {
    type: String,
    default: '0'
  }
})
</script>
<style lang="less">
.banner-3 {
  background-color: #000;
  width: 100%;
  overflow-x: hidden;

  .banner-3-0 {
    display: flex;
    .param-container {
      margin: 210pxvw 0 0 361pxvw;

      .title {
        display: inline-block;
        color: #6abb3f;
        font-size: 55pxvw;
        line-height: 61pxvw;
      }

      .subTitle {
        color: #ffffff;
        font-size: 30pxvw;
        margin: 6pxvw 0 0;
      }

      .gradient-segmentation {
        display: inline-block;
        width: 362pxvw;
        height: 14pxvw;
        background: linear-gradient(to right, #6abb3f -10%, transparent 60%);
        border-radius: 5pxvw;
        margin-top: 70pxvw;
      }

      .segmentation-title {
        color: #ffffff;
        font-size: 24pxvw;
        margin: -3pxvw 0 0;
        line-height: 31pxvw;
      }

      .param-list {
        display: flex;
        flex-wrap: wrap;
        width: 537pxvw;
        margin: 23pxvw 0 0 12pxvw;

        .item-img {
          height: 141pxvw;
          margin-right: 120pxvw;
          margin-bottom: 23pxvw;
          &:nth-of-type(3) {
            margin-right: 0;
          }
        }
      }

      .introduce-list {
        margin-top: 21pxvw;

        .title {
          color: #6abb3f;
          margin-left: 36pxvw;
          font-size: 24pxvw;
          &::before {
            content: '';
            display: inline-block;
            position: relative;
            left: -36pxvw;
            top: -3pxvw;
            width: 13pxvw;
            height: 13pxvw;
            border-radius: 50%;
            background-color: #6abb3f;
          }
        }

        .subTitle {
          margin: -18pxvw 0 12pxvw 46pxvw;
          font-size: 24pxvw;
        }
      }
    }

    .param-container-banner3-2 {
      margin: 299pxvw 0 0 165pxvw;
    }

    .param-container-banner3-4 {
      margin: 240pxvw 0 0 -20pxvw;
    }

    .param-container-banner3-5 {
      margin: 372pxvw 0 245pxvw 360pxvw;
    }

    .image-container {
      .detail-img {
        width: 1122pxvw;
        height: 1275pxvw;
        margin: -50pxvw 0 0 -80pxvw;
      }

      .detail-img-banner3 {
        margin: 50pxvw -45pxvw 0 0;
        width: 972pxvw;
        height: 821pxvw;
      }

      .detail-img-banner4 {
        margin: 50pxvw 0 0 135pxvw;
        width: 1054pxvw;
        height: 864pxvw;
        position: relative;

        img {
          position: absolute;
          bottom: 0;
          left: 100pxvw;
          object-fit: contain;
          &:nth-of-type(1) {
            z-index: 80;
            width: 275pxvw;
            height: 127pxvw;
            bottom: 420pxvw;
            left: 295pxvw;
          }
          &:nth-of-type(2) {
            z-index: 70;
            width: 635pxvw;
            height: 108pxvw;
            bottom: 365pxvw;
            left: 50pxvw;
          }
          &:nth-of-type(3) {
            z-index: 60;
            width: 514pxvw;
            height: 231pxvw;
            bottom: 350pxvw;
          }
          &:nth-of-type(4) {
            z-index: 50;
            width: 456pxvw;
            height: 202pxvw;
            left: 135pxvw;
            bottom: 365pxvw;
          }
          &:nth-of-type(5) {
            z-index: 40;
            width: 534pxvw;
            height: 240pxvw;
            bottom: 305pxvw;
          }
        }
      }
    }
  }

  .banner-3-0-height {
    width: 100%;
    height: 1000pxvw;
    overflow: hidden;
  }

  .banner-3-2 {
    margin-top: -100pxvw;
  }

  .banner-3-3 {
    margin: 0;
  }

  .banner-3-4 {
    width: 100%;
    background: url('http://osswebsite.yadea.com.cn/banner3_4_bg_d4b6a4f5af.png?updated_at=2023-03-21T02:58:34.521Z') no-repeat;
    background-size: 100%;
    background-position: 100% 100%;
  }

  .banner3-animation {
    animation: opacityBanner3 1.5s ease-in-out 0s 1;
  }

  @keyframes opacityBanner3 {
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

  .banner3-step-image-animation {
    animation: imageFrame 1.5s ease-in-out 0s 1;
  }

  @keyframes imageFrame {
    0% {
      opacity: 1;
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
