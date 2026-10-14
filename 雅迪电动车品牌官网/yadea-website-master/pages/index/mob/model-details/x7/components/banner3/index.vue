<template>
  <div class="banner-3-mob">
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
      <img class="desc-img" :src="replaceImgUrl(descImg1)" alt="" />
    </div>

    <!-- 第二个参数 -->
    <div ref="banner31" class="banner-3-0 banner-3-3">
      <div ref="bannerSecond" class="param-container">
        <div class="title HYQiHei-bold">爬坡高手 不信“斜”</div>
        <div class="subTitle HYQiHei">雅迪TTFAR闪电控制器</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">长久爬坡无压力，一路披荆斩棘</div>
        <div class="param-desc-flex">
          <div class="left-desc">
            <p>过载能力再创巅峰</p>
            <p>强弱电分离布局</p>
            <p>散热能力全面优化</p>
          </div>
          <div class="center-separation"></div>
          <div class="right-desc">
            <p>防御高手有高招</p>
            <p>全灌胶工艺</p>
            <p>IP67级防水</p>
          </div>
        </div>
      </div>
      <div class="image-container">
        <div class="detail-img-banner4">
          <img ref="detailImgBanner1" :src="replaceImgUrl(frameImgList[0])" alt="" />
          <img ref="detailImgBanner2" :src="replaceImgUrl(frameImgList[1])" alt="" />
          <img ref="detailImgBanner3" :src="replaceImgUrl(frameImgList[2])" alt="" />
          <img ref="detailImgBanner4" :src="replaceImgUrl(frameImgList[3])" alt="" />
          <img ref="detailImgBanner5" :src="replaceImgUrl(frameImgList[4])" alt="" />
        </div>
      </div>
    </div>

    <!-- 第三个参数 -->
    <div ref="banner32" class="banner-3-0">
      <div ref="bannerThird" class="param-container">
        <div class="title HYQiHei-bold">激进or平顺<br />看你登峰造极</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">全新油门调控及算法调教，2种骑行模式流畅切换</div>
        <div class="param-desc-flex">
          <div class="left-desc">
            <p>TTFAR增程模式</p>
            <p>都市王者，骑出风范</p>
          </div>
          <div class="center-separation"></div>
          <div class="right-desc">
            <p>SPORT动力模式</p>
            <p>超强动力，一键起飞</p>
          </div>
        </div>

        <div class="param-desc-flex">
          <div class="left-desc">
            <p>智能档位记忆功能</p>
            <p>专属档位，尽释个性</p>
          </div>
        </div>
      </div>
      <img class="desc-img desc-img2" :src="replaceImgUrl(descImg2)" alt="" />
    </div>

    <!-- 第四个参数 -->
    <div ref="banner33" class="banner-3-0 banner-3-3">
      <div ref="bannerFourth" class="param-container">
        <div class="title HYQiHei-bold">超长续航 尽管飙</div>
        <div class="subTitle HYQiHei">雅迪TTFAR石墨烯3代Plus电池</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title HYQiHei">独家石墨烯配方、<br />全新高活性超大板栅设计，能效非凡</div>
        <div class="param-desc-flex param-desc-flex-align-top param-desc-flex-padding60">
          <div class="left-desc">
            <p>容量MAX</p>
            <p>比普通铅酸电池容量</p>
            <p>提升约30%</p>
          </div>
          <div class="center-separation"></div>
          <div class="right-desc">
            <p>寿命MAX</p>
            <p>充放电循环1000次</p>
          </div>
        </div>

        <div class="param-desc-flex param-desc-flex-padding60">
          <div class="left-desc">
            <p>实力MAX</p>
            <p>拥有36项国家专利</p>
          </div>
          <div class="center-separation"></div>
          <div class="right-desc">
            <p>质保MAX</p>
            <p>24个月换新</p>
          </div>
        </div>
      </div>
      <img class="desc-img desc-img2" :src="replaceImgUrl(descImg3)" alt="" />
    </div>

    <!-- 第五个参数 -->
    <div ref="banner34" class="banner-3-0 banner-3-5-height">
      <div ref="bannerFifth" class="param-container param-container-banner3-5">
        <div class="title">稳定输出<br />潜能超乎想象</div>
        <div class="subTitle">雅迪TTFAR智能温感充电器</div>
        <div class="gradient-segmentation"></div>
        <div class="segmentation-title">低温充得满，高温充不鼓，凛然不惧</div>
        <div class="param-desc-flex param-desc-flex-padding51">
          <div class="left-desc">
            <p>工艺进阶</p>
            <p>防水、防霉</p>
            <p>又防震</p>
          </div>
          <div class="center-separation"></div>
          <div class="right-desc">
            <p class="p-margin-left">品质晋级</p>
            <p class="p-margin-left">充电器</p>
            <p class="p-margin-left">寿命大幅提升</p>
          </div>
          <div class="center-separation center-separation-margin-left"></div>
          <div class="right-desc">
            <p class="p-margin-left">结构升级</p>
            <p class="p-margin-left">双风道设计</p>
            <p class="p-margin-left">散热更好</p>
          </div>
        </div>
      </div>
      <!-- <img class="desc-img desc-img3" :src="replaceImgUrl(descImg4)" alt="" /> -->
    </div>
  </div>
</template>
<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
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
const descImg1 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/150_fad664c1f4.png?updated_at=2023-03-28T09:22:03.929Z')
const descImg2 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_1_61de0f00d8.png?updated_at=2023-03-30T01:43:00.879Z')
const descImg3 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/150_5_849c63ceaf.png?updated_at=2023-03-30T02:58:50.324Z')
const descImg4 = ref('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_2_98bec1bdc7.png?updated_at=2023-03-30T03:07:49.029Z')
const handleWheel = e => {
  const rect = bannerStepImage.value.getBoundingClientRect()
  const vWidth = window.innerWidth || document.documentElement.clientWidth
  const vHeight = window.innerHeight || document.documentElement.clientHeight
  if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
    document.body.style.overflow = 'visible'
  } else {
    // dom元素出现在浏览器窗口中

    const event = e.wheelDelta || e.detail
    //第一步：先判断浏览器IE，谷歌滑轮事件
    if (event > 0) {
      //向上滚动
      test(false, event)
    } else {
      // 向下滚动
      test(true, event)
    }
  }
}
const test = (flag, offset) => {
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

  console.log(scale.value)

  detailImgBanner1.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${-scale.value * 2}, 1, 1)`
  detailImgBanner2.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${-scale.value * 1}, 1, 1)`
  detailImgBanner3.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1)`
  detailImgBanner4.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${scale.value * 1}, 1, 1)`
  detailImgBanner5.value.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${scale.value * 2}, 1, 1)`
}

onMounted(async () => {
  // await nextTick()
  // window.addEventListener('wheel', handleWheel)
})

onUnmounted(() => {
  // window.removeEventListener('wheel', handleWheel)
})

const banner0ParamList = ref([
  'https://osswebsite.yadea.com.cn/banner3_param0_2e3d308a53.png?updated_at=2023-03-21T01:55:40.361Z',
  'https://osswebsite.yadea.com.cn/banner3_2_9bb00a406b.png?updated_at=2023-03-21T01:55:25.049Z',
  'https://osswebsite.yadea.com.cn/banner3_3_38cc13fc2b.png?updated_at=2023-03-21T01:55:21.811Z',
  'https://osswebsite.yadea.com.cn/banner3_4_99b6a2f981.png?updated_at=2023-03-21T01:55:17.321Z'
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
.banner-3-mob {
  background-color: #000;
  width: 100%;
  overflow-x: hidden;

  .banner-3-0 {
    text-align: center;
    .param-container {
      .title {
        color: #6abb3f;
        font-size: 24mpxvw;
        line-height: 26mpxvw;
        margin: 36mpxvw 0 0;
      }

      .subTitle {
        color: #ffffff;
        font-size: 14mpxvw;
        line-height: 16mpxvw;
        margin: 11mpxvw 0 0;
      }

      .gradient-segmentation {
        display: inline-block;
        width: 153mpxvw;
        height: 3mpxvw;
        background: linear-gradient(to right, black, #6abb3f, black);
        margin-top: 25mpxvw;
      }

      .segmentation-title {
        color: #ffffff;
        font-size: 12mpxvw;
        line-height: 15mpxvw;
      }

      .param-list {
        display: flex;
        flex-wrap: wrap;
        margin: 23mpxvw auto;
        justify-content: center;

        .item-img {
          height: 63mpxvw;
          margin: 0 35mpxvw 0 45mpxvw;

          &:nth-last-child(-n + 3) {
            margin-left: 0;
          }
        }
      }

      .introduce-list {
        margin-top: 21mpxvw;

        .title {
          color: #6abb3f;
          margin-left: 36mpxvw;
          font-size: 24mpxvw;
          &::before {
            content: '';
            display: inline-block;
            position: relative;
            left: -36mpxvw;
            top: -3mpxvw;
            width: 13mpxvw;
            height: 13mpxvw;
            border-radius: 50%;
            background-color: #6abb3f;
          }
        }

        .subTitle {
          margin: -18mpxvw 0 12mpxvw 46mpxvw;
          font-size: 24mpxvw;
        }
      }

      .param-desc-flex {
        display: flex;
        color: #fff;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 50mpxvw;
        margin: 25mpxvw 0 0;

        .left-desc {
          flex: 1;
          p {
            margin: 0;
            padding: 0;
            font-size: 12mpxvw;
            text-align: left;
            &:nth-of-type(1) {
              color: #70b929;
            }
          }
        }

        .center-separation {
          display: inline-block;
          width: 2mpxvw;
          height: 29mpxvw;
          background-color: #69ae27;
        }

        .center-separation-margin-left {
          margin-left: 15mpxvw;
        }

        .right-desc {
          flex: 1;
          p {
            margin: 0;
            padding: 0 0 0 20mpxvw;
            font-size: 12mpxvw;
            text-align: left;
            &:nth-of-type(1) {
              color: #70b929;
            }
          }

          .p-margin-left {
            padding: 0 0 0 10mpxvw;
          }
        }

        // .right-desc-width {
        //   width: 128mpxvw;
        //   padding: 0 0 0 15mpxvw;
        // }
      }

      .param-desc-flex-align-top {
        align-items: start;
      }

      .param-desc-flex-padding60 {
        padding: 0 60mpxvw;
      }

      .param-desc-flex-padding51 {
        padding: 0 30mpxvw 0 50mpxvw;
      }
    }

    .param-container-banner3-5 {
      margin: -252mpxvw 0 0;
    }

    .desc-img {
      width: 100%;
      height: 648mpxvw;
      position: relative;
      top: -180mpxvw;
    }

    .desc-img2 {
      top: -130mpxvw;
    }

    .desc-img3 {
      width: 100%;
      background: url('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_2_98bec1bdc7.png?updated_at=2023-03-30T03:07:49.029Z');
    }

    .image-container {
      .detail-img {
        width: 100%;
        height: 1275mpxvw;
        margin: -50mpxvw 0 0 -80mpxvw;
      }

      .detail-img-banner3 {
        margin: 50mpxvw -45mpxvw 0 0;
        width: 972mpxvw;
        height: 821mpxvw;
      }

      .detail-img-banner4 {
        width: 100%;
        height: 264mpxvw;
        position: relative;

        img {
          position: absolute;
          top: 80mpxvw;
          left: 50mpxvw;
          right: 0;
          object-fit: contain;
          &:nth-of-type(1) {
            z-index: 80;
            width: 105mpxvw;
            left: 135mpxvw;
          }
          &:nth-of-type(2) {
            z-index: 70;
            width: 215mpxvw;

            top: 110mpxvw;
          }
          &:nth-of-type(3) {
            z-index: 60;
            width: 215mpxvw;
            top: 65mpxvw;
          }
          &:nth-of-type(4) {
            z-index: 50;
            width: 170mpxvw;
            top: 73mpxvw;
            left: 65mpxvw;
          }
          &:nth-of-type(5) {
            z-index: 40;
            width: 214mpxvw;
            top: 80mpxvw;
          }
        }
      }
    }
  }

  .banner-3-5-height {
    width: 100%;
    height: 508mpxvw;
    background: url('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_2_98bec1bdc7.png?updated_at=2023-03-30T03:07:49.029Z');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .banner-3-2 {
    margin-top: -100mpxvw;
  }

  .banner-3-3 {
    margin: -300mpxvw 0 0;
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
