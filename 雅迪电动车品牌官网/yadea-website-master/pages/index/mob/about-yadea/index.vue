<!--
 * @Author: weijianjun
 * @Date: 2023-02-13 17:42:05
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 13:45:57
 * @FilePath: \website\pages\index\mob\about-yadea\index.vue
 * @Description: 
 * 
-->

<template>
  <div class="mobile-about-yadea-box page-pt">
    <div class="about-me-banner pos-rel">
      <MobileDisplay
        pic="https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner1_0cb3e7245e.png?updated_at=2023-03-20T07:21:51.522Z"
      ></MobileDisplay>
      <div class="about-me-text">
        <div class="title">关于我们</div>
        <p class="desc">
          雅迪科技集团成立于2001年<br />2016年5月，雅迪在香港联交所成功上市，成<br />为中国两轮电动车行业首家上市企业(股票代码:1585 HK)<br />
          雅迪始终坚持以用户为中心，持续引领行业高<br />质量、可持续发展<br />雅迪，让亿万人享受美好出行。
        </p>
      </div>
    </div>

    <!-- banner2 -->
    <div class="banner2">
      <div class="banner2-content">
        <img src="https://osswebsite.yadea.com.cn/banner2_32c06beca7.png?updated_at=2023-03-20T07:19:02.844Z" alt="" />

        <div class="banner2-content-item">
          <div class="title">使命</div>
          <div class="desc">让亿万人享受美好出行</div>
        </div>
        <div class="banner2-content-item">
          <div class="title">愿景</div>
          <div class="desc">服务全球用户，成为世界级企业</div>
        </div>
        <div class="banner2-content-item">
          <div class="title">核心价值观</div>
          <div class="desc">
            以用户为中心，以贡献者为本<br />
            坚持卓越共赢，经常自我反思，持续快乐创业
          </div>
        </div>
        <div class="pb-6-mvw"></div>
      </div>
    </div>

    <!-- 专注自身 -->
    <div class="focus-self">
      <div class="focus-self-mod1">
        <div class="focus-self-mod1-title title-common">创新与发展</div>
        <div class="focus-self-mod1-desc desc-common">
          雅迪专注于产品的自主研发和创新，历经多年发展雅迪已成为电动两轮车及零部件研发、生产及销售于一体的高端电动两轮车“智”造企业
        </div>
      </div>
      <div class="focus-self-mod2">
        <a-row v-for="(row, index) of data1" :key="index" class="focus-self-mod2-row" align="middle" justify="center">
          <a-col v-for="(col, index2) of row" :key="index2" :span="12" class="focus-self-mod2-row-col txt-c">
            <div class="flex-hvc">
              <div class="count">{{ col.count }}</div>
              <div v-if="col.unit" class="ml-1-mvw unit">{{ col.unit }}</div>
            </div>
            <div class="item">
              {{ col.item }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- banner3 -->
    <div class="banner3">
      <div class="banner3-title">中国雅迪 <span class="theme-color">为世界造好车</span></div>

      <div class="banner3-item">
        科技诠释中国智慧<br />
        助力中国“智”造全球化布局
      </div>
      <div class="banner3-item">
        磨砺品质科技利刃<br />
        重新定义行业先锋典范
      </div>
      <div class="banner3-item">
        颠覆传统审美标准<br />
        引领工业美学新风尚
      </div>
    </div>

    <div class="overall-box">
      <div class="tiltle fs-24-mvw fw-500 txt-white txt-c">
        <div>全局产业布局和供应链体系</div>
        <div>开创"海外市场本土化深耕"</div>
      </div>
      <div class="overall-box-bottom">
        <div class="bottom-title fs-13-mvw fw-500 txt-white txt-c">四大全球运营中心</div>
        <div class="bottom-desc fs-12-mvw txt-c">集团总部、德国运营中心、美国办事处、越南分公司</div>
      </div>
    </div>
    <div class="estate-box">
      <div class="tiltle fs-24-mvw fw-500 txt-white txt-c">聚合深厚产业基础和全球优势资源，雄厚实力厚积薄发</div>
      <div class="estate-box-bottom">
        <div class="bottom-title fs-13-mvw fw-500 txt-white txt-c">7大全球生产基地</div>
        <div class="bottom-desc fs-12-mvw txt-c">
          江苏无锡基地、广东清远基地、浙江宁波基地、重庆基地、天津基地、安徽金寨基地、越南北江基地
        </div>
      </div>
    </div>
    <!-- 发展历程 -->
    <div class="history about-banner6">
      <div class="title-common">发展历程</div>
      <div class="desc-common">雅迪始终坚持以用户为中心，提供让消费者有幸福感的产品和服务</div>

      <!-- <div class="desc-common">雅迪始终坚持以用户为中心, 提供让消费者有幸福感的产品和服务</div> -->
      <div class="swiper-box">
        <client-only>
          <swiper :modules="modules" :space-between="50" :loop="false" navigation @slide-change="onSwiperChange" @swiper="onSwiper">
            <!--            :autoplay="{
              delay,
              disableOnInteraction: false
            }"-->
            <!-- <swiper-slide> 123 </swiper-slide> -->
            <swiper-slide v-for="item in developHistoryList" :key="item.id">
              <div class="slide-box">
                <div class="slide-left">
                  <img :src="replaceImgUrl(item.value[0].picUrl)" alt="图片" />
                  <div class="title txt-special fw-600">{{ item.years }}</div>
                </div>
                <div class="slide-right">
                  <template v-for="subItem in item.value" :key="subItem.id">
                    <div class="desc">
                      <span class="month fs-13-mvw fw-600">{{ subItem.attributes.developMonth }}</span>
                      <span class="fs-13-mvw opt65 ellipsis-2">{{ subItem.attributes.content }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </client-only>
        <div class="custom-pagination">
          <template v-for="(item, index) in developHistoryList" :key="item.id">
            <div class="fs-13-mvw" :class="swiperActiveIndex === index && 'custom-pagination-active'" @click="handleClickIndex(index)">
              {{ item.years }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper'
import { delay } from '@/configs/data'

import 'swiper/css'
import 'swiper/less/navigation'

useHead({
  meta: [
    { name: 'keywords', content: '走进雅迪' },
    {
      name: 'description',
      content:
        '做为中国两轮电动车品牌的典范,雅迪是中国电动两轮车上市企业,雅迪集团始终坚持“提供让消费者有幸福感的产品和服务”,始终推行“更高端战略”,如果对我们的产品有兴趣,欢迎访问雅迪官方网站. '
    }
  ]
})

const { aboutYadeaApi } = useApi()

const modules = [Navigation, Autoplay]

const data1 = reactive([
  [
    {
      count: 1890,
      unit: '项',
      item: '专利'
    },
    {
      count: '1000+',
      unit: '',
      item: '研发成员'
    }
  ],
  [
    {
      count: 7000,
      unit: '万+',
      item: '用户'
    },
    {
      count: 6,
      unit: '个',
      item: '技术研发中心'
    }
  ],
  [
    {
      count: 2,
      unit: '个',
      item: 'CNAS实验室'
    },
    {
      count: 100,
      unit: '个',
      item: '国家和地区'
    }
  ],
  [
    {
      count: '40000+',
      unit: '',
      item: '门店'
    },
    {
      count: 5,
      unit: '星级',
      item: '售后服务企业'
    }
  ]
])

const data2 = reactive([
  {
    title: '使命',
    desc: '让亿万人享受美好出行'
  },
  {
    title: '愿景',
    desc: '服务全球用户，成为世界级企业'
  },
  {
    title: '核心价值观',
    desc: '以用户为中心，以贡献者为本坚持卓越共赢，经常自我反思，持续快乐创业'
  }
])

let curSwiper = null
const swiperActiveIndex = $ref(0)

const onSwiperChange = _.debounce(function (el) {
  const { realIndex } = el
  swiperActiveIndex = realIndex
}, 50)

const onSwiper = swiper => {
  curSwiper = swiper
}

const handleClickIndex = index => {
  curSwiper.slideTo(index)
  swiperActiveIndex = index
}

// 发展历程列表
const developHistoryList = $ref([])

// 获取发展历程列表
const getDevelopHistories = async () => {
  try {
    const { data } = await aboutYadeaApi.getDevelopHistories()
    const newDevelopHistoryArr = []
    const newDevelopHistoryList = data.value.data.map(item => {
      if (item.attributes.pic.data) {
        return { ...item, picUrl: item.attributes.pic.data[0].attributes.url }
      }
      return { ...item }
    })
    Object.keys(newDevelopHistoryList).map(item => {
      if (!newDevelopHistoryArr[newDevelopHistoryList[item].attributes.developYear]) {
        newDevelopHistoryArr[newDevelopHistoryList[item].attributes.developYear] = [newDevelopHistoryList[item]]
      } else {
        newDevelopHistoryArr[newDevelopHistoryList[item].attributes.developYear].push(newDevelopHistoryList[item])
      }
    })
    const arr = []
    for (const key in newDevelopHistoryArr) {
      arr.push({ years: key, value: newDevelopHistoryArr[key] })
    }
    developHistoryList = arr.reverse()
  } catch (error) {}
}

getDevelopHistories()

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.mobile-about-yadea-box {
  padding-top: @layout-m-header-height;

  .about-me-banner {
    width: 100%;
    height: 700mpxvw;
    // background: url('');
    background-size: cover;
    background-position: center center;
    overflow: hidden;
    color: #ffffff;
    text-align: center;
    video,
    .banner-img {
      width: 100%;
      height: 700mpxvw;
      object-fit: cover;
      object-position: center;
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
    }

    .title {
      padding-top: 60mpxvw;
      padding-bottom: 17mpxvw;
      font-size: 32mpxvw;
      z-index: 10;
    }
    .desc {
      font-size: 12mpxvw;
      line-height: 20mpxvw;
      .m-mlr(29);
      z-index: 10;
    }
  }

  .banner2 {
    padding: 20mpxvw 22mpxvw 0;
    img {
      width: 100%;
    }

    &-content {
      background: #f6f6f6;
      &-item {
        padding-top: 24mpxvw;
        padding-left: 32mpxvw;
        .title {
          margin-bottom: 4mpxvw;
          font-size: 11mpxvw;
          font-weight: 500;
          color: #ff5f00;
        }
        .desc {
          font-size: 12mpxvw;
          font-weight: 400;
        }
      }
    }
  }

  .banner3 {
    width: 100%;
    height: 579mpxvw;
    background: url('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Group_838_2x_1_e860c4d83f.png?updated_at=2023-03-27T11:43:48.053Z')
      no-repeat;
    background-size: contain;
    // background-position: center center;
    overflow: hidden;
    text-align: center;

    &-title {
      font-size: 24mpxvw;
      font-weight: 500;
      margin: 60mpxvw 0 0;
    }
    &-item {
      .m-fs(12);
      .m-mt(30);
    }
  }

  .focus-self {
    .m-mt(50);
    &-mod1 {
      &-title {
        font-size: 24mpxvw;
        font-weight: 500;
        .txt-c;
      }
      &-desc {
        .m-plr(32);
        .m-pt(16);
        .m-pb(43);
        .m-fs(13);
        .txt-c;
      }
    }
    &-mod2-row-col {
      .m-pb(60);
      .count {
        font-size: 32mpxvw;
        font-family: DINPro-Bold;
        font-weight: bold;
        color: #ff5f00;
      }
      .unit,
      .item {
        font-size: 14mpxvw;
        font-weight: 400;
      }
    }
  }

  .overall-box,
  .estate-box {
    width: 100%;
    height: 580mpxvw;
    background-image: url('https://osswebsite.yadea.com.cn/Rectangle_765_2x_629da3c6d6.png?updated_at=2023-03-20T07:13:43.924Z');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;

    .tiltle {
      padding: 60mpxvw 32mpxvw 0;
    }

    .overall-box-bottom,
    .estate-box-bottom {
      position: absolute;
      bottom: 40mpxvw;
      .bottom-desc {
        color: #e1e1e1;
        margin-top: 4mpxvw;
        padding: 0 43mpxvw;
      }
    }
  }

  .estate-box {
    background-image: url('https://osswebsite.yadea.com.cn/Rectangle_766_2x_256ead69d2.png?updated_at=2023-03-20T07:13:43.850Z');
    .tiltle {
      padding: 60mpxvw 37mpxvw 0;
    }

    .estate-box-bottom {
      .bottom-desc {
        padding: 0 20mpxvw;
      }
    }
  }

  .history {
    .title-common {
      .m-pt(50);
      .m-pb(8);
    }
    .desc-common {
      .m-plr(56);
      .txt-c;
      color: #323237;
    }
  }

  .title-common {
    font-size: 24mpxvw;
    font-weight: 500;
    .txt-c;
  }
  .desc-common {
    font-weight: 400;
    color: #323237;
    .m-fs(13);
  }

  .about-banner6 {
    padding-bottom: 64mpxvw;
    .swiper {
      margin-top: 20mpxvw;
      margin-bottom: 20mpxvw;
      height: 394mpxvw;
      width: 100%;

      .swiper-button-prev {
        bottom: 0;
        top: auto;
        left: 143mpxvw;
        &::after {
          content: '';
          background: url('@/assets/svg/second-left-arrow.svg') no-repeat;
          width: 24mpxvw;
          height: 24mpxvw;
          background-size: 100% 100%;
        }
      }

      .swiper-button-next {
        bottom: 0;
        top: auto;
        right: 143mpxvw;
        &::after {
          content: '';
          background: url('@/assets/svg/second-right-arrow.svg') no-repeat;
          width: 24mpxvw;
          height: 24mpxvw;
          background-size: 100% 100%;
        }
      }

      .slide-box {
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;

        .slide-left {
          position: relative;
          text-align: center;
          padding: 0 21mpxvw;
          img {
            width: 100%;
            height: 190mpxvw;
            object-fit: contain;
            object-position: center center;
          }
          .txt-special {
            font-size: 24mpxvw;
            margin: 16mpxvw 0 12mpxvw;
            text-align: left;
            font-family: DINPro-Bold;
          }
        }
        .slide-right {
          padding: 0 21mpxvw;
          position: absolute;
          padding-bottom: 50mpxvw;
          top: 242mpxvw;
          .desc {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding-bottom: 20mpxvw;

            .month {
              flex: 1;
              width: 150mpxvw;
            }

            .ellipsis-2 {
              flex: 7;
            }
          }
        }
      }
    }
    .custom-pagination {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e9e9e9;
      padding: 0 30mpxvw;

      div {
        cursor: pointer;
        font-family: DINPro;
        margin-top: 25mpxvw;
      }

      .custom-pagination-active {
        position: relative;

        &::after {
          content: '';
          width: 17mpxvw;
          height: 17mpxvw;
          background: rgba(255, 95, 0, 0.1);
          border-radius: 100%;
          position: absolute;
          top: -33mpxvw;
          left: 50%;
          transform: translateX(-50%);
        }
        &::before {
          width: 10mpxvw;
          height: 10mpxvw;
          background: #ff5f00;
          content: '';
          position: absolute;
          top: -30mpxvw;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 100%;
        }
      }
    }
  }
}
</style>
