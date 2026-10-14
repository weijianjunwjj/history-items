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
    <div class="about-me pos-rel">
      <div class="txt-c fs-60-vw txt-white about-me-text pos-middle-v">关于我们</div>
    </div>
    <div class="yadea-info fs-24-vw">
      <div class="fs-24-mvw fw-500 txt-c title-common">关于雅迪</div>

      <p class="yadea-info-p desc-common">
        雅迪科技集团成立于2001年，雅迪畅销全球100个国家和地区，连续五年全球销量第一，致力于打造新一代绿色科技出行生活方式，引领行业升级，成为电动车行业真正的领航者，2016年5月，雅迪在香港成功上市（股票代码：01585.HK），成为中国电动车行业首家上市的公司
      </p>

      <img
        class="full-w"
        :src="
          replaceImgUrl(
            'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Rectangle_614_2813670394_bf011931e2.png?updated_at=2023-03-16T01:58:40.533Z'
          )
        "
        alt=""
      />
    </div>
    <!-- 专注自身 -->
    <div class="focus-self">
      <div class="focus-self-mod1">
        <div class="focus-self-mod1-title title-common">专注于自身</div>
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
    <!-- 使命 -->
    <div class="mission flex-hvc">
      <div class="mission-content flex-col-sb">
        <div v-for="(item, index) of data2" :key="index" class="mission-content-item">
          <div class="title mb-1-mvw">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <div class="overall-box">
      <div class="tiltle fs-24-mvw fw-500 txt-white txt-c">
        全局产业布局和供应链体系<br />开创&nbsp;&nbsp;“海外市场本土化深耕”&nbsp;&nbsp;
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
      <div class="desc-common">雅迪始终坚持以用户为中心, 提供让消费者有幸福感的产品和服务</div>
      <div class="swiper-box">
        <client-only>
          <swiper :modules="modules" :space-between="50" :loop="true" navigation @slide-change="onSwiperChange" @swiper="onSwiper">
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
      count: 1350,
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
      count: 7,
      unit: '',
      item: '大生产基地'
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
      unit: '年',
      item: '连续销量第一'
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
  curSwiper.slideTo(index + 1)
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

  .about-me {
    width: 100%;
    height: 220mpxvw;
    background: url('@/assets/images/mobile/about-yedea/bg1.png');
    background-size: cover;
    background-position: center center;
    overflow: hidden;

    .about-me-text {
      left: 20mpxvw;
      font-size: 32mpxvw;
      color: #ffffff;
    }

    .data-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 426pxvw;

      .data-box-item + .data-box-item {
        margin-left: 168pxvw;
      }
    }
  }

  .yadea-info {
    padding-top: 25mpxvw;
    padding-bottom: 20mpxvw;
    .m-plr(25);
    &-p {
      font-size: 14mpxvw;
      font-weight: 400;
      color: #323237;
      line-height: 28mpxvw;
      .m-pt(20);
      .m-pb(40);
      .txt-j;
    }
  }
  .focus-self {
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
  .mission {
    height: 347mpxvw;
    background: url('https://osswebsite.yadea.com.cn/Rectangle_615_b2acb80495_001fc0732c.png?updated_at=2023-03-16T01:57:20.977Z') no-repeat;
    background-size: contain;
    &-content {
      width: 325mpxvw;
      height: 287mpxvw;
      background: rgba(255, 255, 255, 0.9);
      opacity: 0.9;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #ffffff;
      background-color: #fff;
      margin: auto;
      .m-plr(33);
      .m-ptb(32);
      &-item {
        // .m-mb(24);
        .title {
          font-size: 18mpxvw;
          font-weight: 500;
          color: #ff5f00;
        }
        .desc {
          font-size: 13mpxvw;
          font-weight: 400;
        }
      }
    }
  }

  .overall-box,
  .estate-box {
    width: 100%;
    height: 700mpxvw;
    background-image: url('https://osswebsite.yadea.com.cn/Rectangle_765_2x_629da3c6d6.png?updated_at=2023-03-20T07:13:43.924Z');
    background-size: contain;
    background-position: center;
    position: relative;

    .tiltle {
      padding: 60mpxvw 32mpxvw 0;
    }

    .overall-box-bottom,
    .estate-box-bottom {
      position: absolute;
      bottom: 70mpxvw;
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
            object-fit: cover;
            object-position: center center;
          }
          .txt-special {
            font-size: 24mpxvw;
            margin: 16mpxvw 0 12mpxvw;
            text-align: left;
            font-family: DINPro-Bold;
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
        margin-top: 17mpxvw;
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
          top: -25mpxvw;
          left: 50%;
          transform: translateX(-50%);
        }
        &::before {
          width: 10mpxvw;
          height: 10mpxvw;
          background: #ff5f00;
          content: '';
          position: absolute;
          top: -22mpxvw;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 100%;
        }
      }
    }
  }
}
</style>
