<template>
  <div class="q9-detail-container">
    <div
      class="banner1"
      :style="{
        backgroundImage:
          'url(' +
          replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/UX_ef58802bcf.png?updated_at=2023-03-25T06:02:46.839Z') +
          ')'
      }"
    >
      <div><span class="main-title HYQiHei-bold txt-white">雅迪冠能</span><span class="less-title HYQiHei txt-white">奢享Q9</span></div>
      <div class="banner1-desc HYQiHei-bold txt-white">超长续航 就耀出色</div>
      <div class="banner1-selling-point HYQiHei-bold txt-white">女王复古美学 | UX女王优享工艺 | 国际领先TTFAR 5.0增程系统</div>
    </div>
    <div ref="banner2" class="banner2">
      <video
        :src="
          replaceImgUrl(
            'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Q9_100m_20230329_7ce8f8132f.mp4?updated_at=2023-03-29T13:16:45.817Z'
          )
        "
        muted
        autoplay
        loop
      ></video>
      <div ref="banner2Title" class="title HYQiHei-bold">女王驾到</div>
      <div ref="banner2Desc" class="desc HYQiHei-bold">雅迪以“她”为灵感缪斯</div>
      <div ref="banner2text" class="desc HYQiHei-bold">打造新时代女王的绝美座驾</div>
      <br />
      <br />
      <div ref="banner2Desc2" class="desc HYQiHei-bold">卓越的设计美学，精湛的优享工艺，定制的人机操控</div>
      <div ref="banner2Desc3" class="desc HYQiHei-bold">至美之作，重塑想象</div>
      <MyButton class-name="live-movie HYQiHei-bold txt-black" size="big" @click="handleOpenVideoModal">
        <SvgIcon name="play" class="live-svg" />
        观看完整影片
      </MyButton>
    </div>
    <div
      ref="banner3"
      class="banner3"
      :style="{
        backgroundImage:
          'url(' +
          replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner3_28c8da0bb9.png?updated_at=2023-03-23T02:36:29.650Z') +
          ')'
      }"
    >
      <div ref="banner3Top" class="banner3-top">
        <div class="title HYQiHei-bold">女王就要</div>
        <div class="desc HYQiHei-bold">天生出众 气场全开</div>
      </div>
      <img
        ref="banner3Img"
        class="car-img"
        :src="
          replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/banner3_q9_d562efb217.png?updated_at=2023-03-23T02:34:18.599Z')
        "
        alt=""
      />
      <div ref="banner3TextBox" class="text-box">
        <div ref="banner3TextContnt">
          <div class="title HYQiHei-bold">女王复古美学</div>
          <div class="desc HYQiHei">
            是经典, 更是蜕变新生<br />
            基于经典车身比例的复古圆润, 勾勒简约有力的现代线条<br />
            前脸造型有力又不失温柔, 优雅迷人又沉静大气<br />
            目光所触, 心潮澎湃
          </div>
        </div>
      </div>
    </div>
    <div class="banner4">
      <div ref="banner4Top" class="banner4-top">
        <div class="banner4-top-left">
          <div ref="banner4TopLeft">
            <div class="title HYQiHei-bold">全新复古配色<br />女王本色 自我定义</div>
            <div class="desc HYQiHei-bold">
              至美灵感源自时尚艺术标志<br />海沫绿、梦露白、雾岛蓝、铁塔灰<br />至奢至纯，感受怦然心动的瞬间<br />无限魅力随色彩蔓延
            </div>
          </div>
          <div class="color-text HYQiHei-bold">{{ colorGroup[colorActiveIndex].colorText }}</div>
          <div class="color-group">
            <template v-for="(item, index) in colorGroup" :key="item.bgColor">
              <span
                :class="index === colorActiveIndex && 'active'"
                :style="`background: ${item.bgColor}`"
                @click="handleChangeColorItem(index, item.bgColor)"
              ></span>
            </template>
          </div>
        </div>
        <div class="banner4-top-right">
          <div
            class="banner4-right-top-background"
            :style="{
              backgroundImage: 'url(' + replaceImgUrl(colorGroup[colorActiveIndex].bgImg) + ')'
            }"
          >
            <img
              ref="banner4RightTopImg"
              :src="
                replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_b7675c1cd5.png?updated_at=2023-03-29T06:01:57.949Z')
              "
              alt=""
            />
          </div>
        </div>
      </div>
      <div ref="banner4Bottom" class="banner4-bottom">
        <div ref="banner4BottomLeft" class="banner4-bottom-left">
          <img
            :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/135_d144d987df.png?updated_at=2023-03-29T11:59:32.900Z')"
            alt=""
          />
        </div>
        <div class="banner4-bottom-right">
          <div ref="banner4BottomTitle" class="title HYQiHei-bold">复古美学工艺<br />全方位精致 怎样都好看</div>
          <div ref="banner4BottomDesc" class="desc HYQiHei-bold">细节巧思，无需刻意彰显，照样引人注目</div>
          <div class="brightened-dot-box">
            <div ref="topDelayChange1" class="brightened-dot-item">
              <div class="brightened-dot-title HYQiHei-bold">天生瓷感肌</div>
              <div class="brightened-dot-desc HYQiHei">3C仿真工艺, 造就细腻导流罩</div>
            </div>
            <div ref="topDelayChange2" class="brightened-dot-item">
              <div class="brightened-dot-title HYQiHei-bold">自带光芒</div>
              <div class="brightened-dot-desc HYQiHei">镜面电镀工艺, 装饰件更富光泽</div>
            </div>
            <div ref="topDelayChange3" class="brightened-dot-item">
              <div class="brightened-dot-title HYQiHei-bold">星河入眼</div>
              <div class="brightened-dot-desc HYQiHei">大灯清澈深邃, 令星空大灯灿若银河</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="banner5"
      :style="{
        backgroundImage:
          'url(' +
          replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/6_2x_79412afccf.png?updated_at=2023-03-23T02:30:27.521Z') +
          ')'
      }"
    >
      <div class="title HYQiHei-bold">女王就要<br />舒适满分 优雅就座</div>
      <div class="desc fs-30-vw HYQiHei-bold">UX女王优享工艺<br />你需要的舒适装备 <br />雅迪冠能奢享Q9为你量身定做<br />女王, 请上座</div>
    </div>
    <div ref="banner6" class="banner6">
      <div class="banner6-top">
        <div ref="banner6Title" class="title HYQiHei-bold">0压空气座垫</div>
        <div ref="banner6Desc" class="desc HYQiHei-bold fs-30-vw">坐享云端, 久骑不累</div>
      </div>
      <div ref="banner6Middle" class="banner6-middle">
        <template v-for="(item, index) in banner6MiddleList" :key="index">
          <div
            :class="banner6Active === index && 'active'"
            class="banner6-middle-item fs-30-vw txt-c HYQiHei"
            @click="handleClickBanner6Tab(index)"
          >
            {{ item.top }}<br />{{ item.bot }}
          </div>
        </template>
      </div>
      <div class="banner6-middle-content">
        <div ref="banner6MiddleContent" class="desc fs-24-vw" v-html="banner6ImgList[banner6Active].text"></div>
        <div ref="banner6ImgBox" class="content-img" :class="banner6Active === 1 && 'content-img2'">
          <img
            ref="banner6Img"
            :src="
              replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/7_2x_efd74a196b.png?updated_at=2023-03-20T10:17:24.337Z')
            "
          />
        </div>
      </div>
    </div>
    <div class="banner7">
      <div class="banner7-left">
        <img
          :src="
            replaceImgUrl(
              'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230310_Q914213_2x_bcf8975b53.png?updated_at=2023-03-20T10:42:42.992Z'
            )
          "
          alt=""
        />
      </div>
      <div class="banner7-right">
        <div class="title HYQiHei-bold">女王专属高级定制</div>
        <div class="desc fs-30-vw HYQiHei-bold">精调人机，让优雅从始至终</div>
        <div class="text HYQiHei fs-24-vw">
          结合女性身型，<br />设计坐垫高度、车把高度、前身角度、踏板高度，<br />各种身材, 各种穿搭都能脚踏实地, 出入优雅自如。
        </div>
      </div>
    </div>
    <div class="banner8">
      <div class="banner8-left">
        <div class="title HYQiHei-bold">开启舒适体验新境界</div>
        <div class="desc fs-30-vw HYQiHei-bold">精工慢调减震工艺, 哪里都是舒适区</div>
        <div class="text HYQiHei fs-24-vw">后减震工艺升级, 提升回弹效果,<br />压缩后一次复原, 减轻抖动, <br />完美化解颠簸困扰。</div>
      </div>
      <div class="banner8-right">
        <img
          :src="
            replaceImgUrl(
              'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/20230310_Q914200_2x_be38fcdf13.png?updated_at=2023-03-23T02:14:19.136Z'
            )
          "
          alt=""
        />
      </div>
    </div>
    <div ref="banner9" class="banner9">
      <div ref="banner9Title" class="title HYQiHei-bold">在意细节 更在乎你</div>
      <div ref="banner9Desc" class="desc fs-30-vw HYQiHei-bold">人性化细节设计，周到保护无微不至</div>
      <swiper
        :modules="modules"
        :navigation="{ enabled: true, prevEl: '#bannerPcPrev', nextEl: '#bannerPcNext' }"
        @slide-change="handleSlideChange"
      >
        <swiper-slide class="banner9-swiper1 banner9-swiper">
          <div class="banner9-img">
            <img
              :src="
                replaceImgUrl(
                  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_1261x517_6cf983a41f.png?updated_at=2023-03-29T11:32:55.345Z'
                )
              "
              alt=""
            />
          </div>
          <div :class="isShowAnimate && 'rightChangePos'">
            <div ref="banner9TextTitle" class="text-title fs-30-vw HYQiHei-bold">掌控全场</div>
            <div ref="banner9Text" class="text fs-24-vw HYQiHei">航空车把, 轻巧掌控全场<br />包裹式设计, 无铁件外漏, 净享神清气爽</div>
          </div>
        </swiper-slide>
        <swiper-slide class="banner9-swiper2 banner9-swiper">
          <div class="text-box" :class="isShowAnimate && 'rightChangePos'">
            <div class="text-title fs-30-vw HYQiHei-bold">省力刹把</div>
            <div class="text fs-24-vw HYQiHei">刹把握距缩短, <br />女生也能省力刹车。</div>
          </div>
          <div>
            <div class="banner9-img">
              <img
                :src="
                  replaceImgUrl(
                    'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_587x638_5cd52eaa4b.png?updated_at=2023-03-29T11:32:55.231Z'
                  )
                "
                alt=""
              />
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="banner9-swiper3 banner9-swiper">
          <div class="text-box" :class="isShowAnimate && 'rightChangePos'">
            <div class="text-title fs-30-vw HYQiHei-bold">隐藏挂钩</div>
            <div class="text fs-24-vw HYQiHei">防触碰膝盖，贴心无微不至。</div>
          </div>
          <div>
            <div class="banner9-img">
              <img
                :src="
                  replaceImgUrl(
                    'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/3_632x542_9d640ec227.png?updated_at=2023-03-29T11:32:55.043Z'
                  )
                "
                alt=""
              />
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="banner9-swiper4 banner9-swiper">
          <div class="text-box" :class="isShowAnimate && 'rightChangePos'">
            <div class="text-title fs-30-vw HYQiHei-bold">面面俱到</div>
            <div class="text fs-24-vw HYQiHei">整车及座桶内壁光滑无瑕, <br />悉心呵护, 防止刮伤。</div>
          </div>
          <div>
            <div class="banner9-img">
              <img
                :src="
                  replaceImgUrl(
                    'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/4_603x777_51de5d7f14.png?updated_at=2023-03-29T11:32:55.185Z'
                  )
                "
                alt=""
              />
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="banner9-swiper5 banner9-swiper">
          <div class="text-box" :class="isShowAnimate && 'rightChangePos'">
            <div class="text-title fs-30-vw HYQiHei-bold">贴心撑脚</div>
            <div class="text fs-24-vw HYQiHei">贴心双撑胶套,<br />及右置弹簧设计,<br />懂你的每个小细节,<br />周到保护不刮腿。</div>
          </div>
          <div>
            <div class="banner9-img">
              <img
                :src="
                  replaceImgUrl(
                    'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/5_776x603_6b83def4a0.png?updated_at=2023-03-29T11:32:55.358Z'
                  )
                "
                alt=""
              />
            </div>
          </div>
        </swiper-slide>
        <div id="bannerPcPrev" class="common-swiper-btn prev">
          <div class="div-bgimg"></div>
        </div>
        <div id="bannerPcNext" class="common-swiper-btn next">
          <div class="div-bgimg"></div>
        </div>
      </swiper>
    </div>
    <div ref="banner10" class="banner10">
      <div class="banner10-top">
        <div ref="banner10FirstTitle" class="first-title HYQiHei-bold">女王就要</div>
        <div ref="banner10SecondTitle" class="second-title HYQiHei-bold">游刃有余 随心所驭</div>
        <div ref="banner10Desc" class="desc fs-30-vw HYQiHei-bold">搭载雅迪国际领先TTFAR 5.0增程系统</div>
      </div>
      <div class="banner10-middle">
        <template v-for="(item, index) in banner10Middle" :key="item">
          <div
            class="banner10-middle-item fs-26-vw txt-c HYQiHei"
            :class="banner10ActiveIndex === index && 'active'"
            @click="banner10ActiveIndex = index"
            v-html="item"
          ></div>
        </template>
      </div>
      <div class="banner10-middle-container">
        <template v-for="(item, index) in banner10MiddleContainer" :key="index">
          <div :class="banner10ActiveIndex === index && 'active'" class="banner10-middle-content">
            <div class="desc fs-24-vw HYQiHei" v-html="item.text"></div>
            <div class="content-img">
              <img :src="replaceImgUrl(item.imgUrl)" />
            </div>
          </div>
        </template>
      </div>
      <div class="banner10-bottom">
        <div class="banner10-bottom-left">
          <div class="title HYQiHei-bold">女王就要<br />尽智 尽美</div>
          <div class="desc fs-30-vw HYQiHei-bold">YADEA OS智慧中枢, 解锁丝滑体验</div>
          <div class="text fs-24-vw HYQiHei">告别繁杂, App、蓝牙、小程序, 智能解锁, 说走就走。</div>
        </div>
        <div class="banner10-bottom-right">
          <!-- <img
            class="banner10-bottom-right-back"
            :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_50de3f5a94.png?updated_at=2023-03-21T06:20:17.045Z')"
            alt=""
          /> -->
          <img
            class="banner10-bottom-right-front"
            :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Q9_0aedc972cd.png?updated_at=2023-03-29T11:56:34.894Z')"
            alt=""
          />
        </div>
      </div>
    </div>
    <!-- 跨界合作 -->
    <div class="banner13">
      <div class="title HYQiHei-bold">跨界合作</div>
      <swiper :modules="modules" :pagination="{ clickable: true }">
        <swiper-slide v-for="item in banner13List" :key="item">
          <img :src="replaceImgUrl(item)" alt="" />
        </swiper-slide>
      </swiper>
    </div>
    <!-- 车型美图 -->
    <div class="car-container banner11">
      <span class="car-img-title HYQiHei-bold">车型美图</span>

      <!-- 表格图片介绍 -->
      <div v-show="arrowFlag" class="car-param-img-container car-param-img-container-smart-car">
        <!-- 左边图片 -->
        <div class="param-left-img-container param-left-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList[0])" alt="" />
        </div>

        <!-- 中间图片 -->
        <div class="param-center-container param-center-container-smart-car">
          <!-- 上边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList[1])" alt="" />

          <!-- 下边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList[2])" alt="" />
        </div>

        <!-- 右边图片 -->
        <div class="param-right-img-container param-right-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList[3])" alt="" />
        </div>
      </div>
      <div v-show="!arrowFlag" class="car-param-img-container car-param-img-container-smart-car">
        <!-- 左边图片 -->
        <div class="param-left-img-container param-left-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList2[0])" alt="" />
        </div>

        <!-- 中间图片 -->
        <div class="param-center-container param-center-container-smart-car">
          <!-- 上边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList2[1])" alt="" />

          <!-- 下边图片 -->
          <img :src="replaceImgUrl(introduce3ParamList2[2])" alt="" />
        </div>

        <!-- 右边图片 -->
        <div class="param-right-img-container param-right-img-container-smart-car">
          <img :src="replaceImgUrl(introduce3ParamList2[3])" alt="" />
        </div>
      </div>

      <!-- 左右箭头 -->
      <div class="arrow-img-container">
        <img :src="replaceImgUrl(arrowImgList[0])" class="arrow-img left-arrow" @click="arrowFlag = !arrowFlag" />
        <img :src="replaceImgUrl(arrowImgList[1])" class="arrow-img" @click="arrowFlag = !arrowFlag" />
      </div>
    </div>
    <div class="banner12">
      <img
        :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_2x_fc7cb0db24.png?updated_at=2023-03-29T12:03:27.149Z')"
        alt=""
      />
      <div class="swiper-box">
        <client-only>
          <swiper
            :modules="modules"
            :space-between="50"
            :loop="false"
            :navigation="false"
            @slide-change="onSwiperChange"
            @swiper="onSwiper"
          >
            <swiper-slide v-for="item in paramsList" :key="item">
              <img :src="replaceImgUrl(item.carImg)" alt="" />
              <span class="colorText HYQiHei">{{ item.colorText }}</span>
            </swiper-slide>
          </swiper>
        </client-only>
        <div class="custom-pagination">
          <template v-for="(item, index) in paramsList" :key="item.id">
            <div
              class="custom-pagination-div fs-13-mvw"
              :style="{ borderColor: swiperActiveIndex === index ? item.bgColor : '' }"
              @click="handleClickIndex(index)"
            >
              <div class="custom-pagination-span" :style="{ background: item.bgColor }"></div>
            </div>
          </template>
        </div>
      </div>
      <img
        :src="replaceImgUrl('https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_2x_caa1576005.png?updated_at=2023-03-30T03:57:36.065Z')"
        alt=""
      />
    </div>
    <WjjFooter p="https://196051346.shop.n.weimob.com/bos/shop/196051346/6001683640346/2748822346/goods/detail/index?id=110201166249346" />
    <a-modal v-model:visible="visible" class="q9-detail-modal" :footer="null" @cancel="handleCloseVideoModal">
      <video
        ref="modalVideo"
        :src="
          replaceImgUrl(
            'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/Q9_100m_20230329_7ce8f8132f.mp4?updated_at=2023-03-29T13:16:45.817Z'
          )
        "
        muted
        loop
        controls
      ></video>
    </a-modal>
  </div>
</template>

<script setup>
import { useChangeOpacity } from '@/composables/animation-hooks/useChangeOpacity'
import { useTransform } from '@/composables/animation-hooks/useTransform'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Pagination } from 'swiper'
import WjjFooter from '../modern/components/wjj-footer.vue'
import _ from 'lodash'

// Import Swiper styles
import 'swiper/css'
import 'swiper/less/navigation'

useHead({
  meta: [
    { name: 'keywords', content: '雅迪Q9电动车_雅迪Q9多少钱_价格|图片-雅迪电动车官网' },
    {
      name: 'description',
      content: '本页面为雅迪Q9电动车产品介绍，了解更多雅迪电动车相关内容，欢迎访问雅迪电动车官方网站。'
    }
  ]
})

const modules = [FreeMode, Navigation, Pagination]

const arrowFlag = ref(true)

const visible = ref(false)
const modalVideo = ref()

// banner13数据
const banner13List = [
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/pc_6cb0a4f735.png?updated_at=2023-03-30T10:35:35.172Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/pc_6c4e5d6061.png?updated_at=2023-03-30T10:35:34.158Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/pc_6103a31315.png?updated_at=2023-03-30T10:35:33.817Z'
]

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

const paramsList = [
  {
    colorText: '海沫绿',
    bgColor: '#B6C1B1',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_b7675c1cd5.png?updated_at=2023-03-29T06:01:57.949Z'
  },
  {
    colorText: '梦露白',
    bgColor: '#FFFCEA',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_1_34d19b6ad0.png?updated_at=2023-03-29T06:00:59.551Z'
  },
  {
    colorText: '雾岛蓝',
    bgColor: '#9BAFB9',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_2_37906d621b.png?updated_at=2023-03-29T06:00:12.819Z'
  },
  {
    colorText: '铁塔灰',
    bgColor: '#9DA1A3',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_3_893a77a87b.png?updated_at=2023-03-29T05:59:56.701Z'
  }
]

// 打开视频弹框 播放视频
const handleOpenVideoModal = async () => {
  visible.value = true
  await nextTick()
  modalVideo.value.play()
}

// 关闭视频弹框 暂停视频
const handleCloseVideoModal = () => {
  modalVideo.value.pause()
}

// 定义选中颜色index
const colorActiveIndex = ref(0)

// 定义颜色集合
const colorGroup = ref([
  {
    bgColor: '#B6C1B1',
    colorText: '海沫绿',
    bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_5fc8ddf2bb.png?updated_at=2023-03-29T05:36:22.090Z',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_b7675c1cd5.png?updated_at=2023-03-29T06:01:57.949Z'
  },
  {
    bgColor: '#FFFCEA',
    colorText: '梦露白',
    bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_1_157ac53104.png?updated_at=2023-03-29T05:36:20.879Z',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_1_34d19b6ad0.png?updated_at=2023-03-29T06:00:59.551Z'
  },
  {
    bgColor: '#9BAFB9',
    colorText: '雾岛蓝',
    bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_2_039c939d84.png?updated_at=2023-03-29T05:36:20.999Z',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_2_37906d621b.png?updated_at=2023-03-29T06:00:12.819Z'
  },
  {
    bgColor: '#9DA1A3',
    colorText: '铁塔灰',
    bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_3_39fab80e50.png?updated_at=2023-03-29T05:36:21.310Z',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_3_893a77a87b.png?updated_at=2023-03-29T05:59:56.701Z'
  }
  // {
  //   bgColor: '#655A53',
  //   colorText: '卢浮棕',
  //   bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_4_53b5cdca6a.png?updated_at=2023-03-29T05:36:21.632Z',
  //   carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_4_ff3616ecd4.png?updated_at=2023-03-29T05:59:42.586Z'
  // },
  // {
  //   bgColor: '#6B7066',
  //   colorText: '罗勒绿',
  //   bgImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_5_0de5c4fa6e.png?updated_at=2023-03-29T05:36:21.795Z',
  //   carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_5_d138a702bd.png?updated_at=2023-03-29T05:59:08.188Z'
  // }
])

const banner4RightTopImg = ref()
// const timer = ref(null)
// 点击颜色切换车辆图片和背景颜色
const handleChangeColorItem = _.debounce(index => {
  colorActiveIndex.value = index
  const { animationFn } = useTransform(
    banner4RightTopImg,
    colorGroup.value[colorActiveIndex.value].carImg,
    'translateX',
    50,
    10,
    120,
    200,
    10,
    15
  )
  animationFn()
}, 200)

// banner10Tab切换index
const banner10ActiveIndex = ref(0)

// banner10数据集合
const banner10Middle = [
  '雅迪TTFAR<br />石墨烯3代Plus电池',
  '国际领先<br />雅迪TTFAR电机',
  '女性专属<br />雅迪TTFAR智驾电控核芯',
  '全新升级<br />雅迪TTFAR智能温感充电器'
]

const banner10MiddleContainer = [
  {
    text: '3倍寿命, 24个月换新, 低温也能大有可为。',
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/tiaose1_2x_023cfcf1f5.png?updated_at=2023-03-21T05:59:08.489Z'
  },
  {
    text: '动力充足，动力平顺，超级好骑。',
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/0000_2x_085635f78b.png?updated_at=2023-03-26T07:21:57.570Z'
  },
  {
    text: '优化调教油门曲线, 动力充足又柔和平顺。<br />TTFAR增程模式、SPORT动力模式,<br />满足各种心境下的骑行需求。 ',
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/33333_2x_41aec00f9e.png?updated_at=2023-03-29T09:14:59.863Z'
  },
  {
    text: '防尘、防震, 使用寿命更长, <br />冬天充得满、夏天充不鼓。',
    imgUrl: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/22222_2x_029dd75115.png?updated_at=2023-03-27T06:34:31.177Z'
  }
]

// banner11数据集合
const introduce3ParamList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_6b7e872207.png?updated_at=2023-03-29T08:24:13.321Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/3_6625d23fb9.png?updated_at=2023-03-29T08:24:13.271Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_0f231f6ff2.png?updated_at=2023-03-29T08:24:13.234Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/4_5398f76b49.png?updated_at=2023-03-29T08:24:13.243Z'
])
const introduce3ParamList2 = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/1_f2e428d7f5.png?updated_at=2023-03-29T08:24:00.270Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/3_adaba1028f.png?updated_at=2023-03-29T08:23:59.205Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2_aedcc070bf.png?updated_at=2023-03-29T08:23:59.156Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/4_666dc9ec60.png?updated_at=2023-03-29T08:24:00.355Z'
])

// 左右箭头
const arrowImgList = ref([
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/2x_2a5df8b8ee.png?updated_at=2023-03-29T08:30:02.055Z',
  'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/3_2x_ad2a9a5526.png?updated_at=2023-03-29T08:29:53.268Z'
])

// 动画实现
const banner2text = ref()
const banner2Desc = ref()
const banner2Desc2 = ref()
const banner2Desc3 = ref()
const banner2 = ref()
const banner2Title = ref()

useChangeOpacity(banner2, [banner2text, banner2Desc, banner2Desc2, banner2Desc3], 'opacityChange')
useChangeOpacity(banner2, [banner2Title], 'banner2-title-animation')

const banner3 = ref()
const banner3Top = ref()
const banner3TextBox = ref()
const banner3TextContnt = ref()
const banner3Img = ref()
useChangeOpacity(banner3, [banner3Top], 'opacityChange')
useChangeOpacity(banner3TextBox, [banner3TextContnt], 'opacityChange')
useChangeOpacity(banner3TextBox, [banner3Img], 'centerToLeft', true)

const banner4Top = ref()
const banner4TopLeft = ref()
useChangeOpacity(banner4Top, [banner4TopLeft], 'opacityChange')

const banner4Bottom = ref()
const banner4BottomLeft = ref()
useChangeOpacity(banner4Bottom, [banner4BottomLeft], 'leftChange')

const banner4BottomTitle = ref()
const banner4BottomDesc = ref()
useChangeOpacity(banner4Bottom, [banner4BottomTitle, banner4BottomDesc], 'topChange')

const topDelayChange1 = ref()
const topDelayChange2 = ref()
const topDelayChange3 = ref()
useChangeOpacity(banner4Bottom, [topDelayChange1], 'topDelayChange1')
useChangeOpacity(banner4Bottom, [topDelayChange2], 'topDelayChange2')
useChangeOpacity(banner4Bottom, [topDelayChange3], 'topDelayChange3')

const banner6 = ref()
const banner6Title = ref()
const banner6Desc = ref()
const banner6Middle = ref()
const banner6MiddleContent = ref()
const banner6ImgBox = ref()
const banner6Img = ref()
useChangeOpacity(banner6, [banner6Title, banner6Desc], 'onlyTop')
useChangeOpacity(banner6Middle, [banner6Middle, banner6MiddleContent], 'onlyOpcity')
useChangeOpacity(banner6ImgBox, [banner6Img], 'onlyTop')

// banner6-middle Tab栏数据集合
const banner6MiddleList = ref([
  {
    top: '软弹不塌',
    bot: '臀部无压力'
  },
  {
    top: '完美贴合',
    bot: '深陷其中'
  }
])

// banner6选中值
const banner6Active = ref(0)

// banner6图片集合
const banner6ImgList = [
  {
    text: '独家云朵海绵发泡工艺<br />坐垫承压更好, 不易变形, 柔软舒适。',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/125_5f06725467.png?updated_at=2023-03-29T06:26:15.753Z'
  },
  {
    text: '独特曲线设计, 完美贴合美臀, 形成嵌入式坐姿<br />一体成型，不前滑，每段骑乘都是享受。',
    carImg: 'https://yadeawebsite.oss-cn-hangzhou.aliyuncs.com/126_85e96733ee.png?updated_at=2023-03-29T06:26:17.769Z'
  }
]

// banner6 Tab栏点击事件
const handleClickBanner6Tab = _.debounce(index => {
  banner6Active.value = index
  // banner6MiddleContent.value.classList.remove('onlyOpcity')
  // banner6MiddleContent.value.classList.add('onlyOpcity')
  const { animationFn } = useTransform(banner6Img, banner6ImgList[banner6Active.value].carImg, 'translateY', 50, 10, 100, 200, 10, 10)
  animationFn()
}, 200)

const banner9 = ref()
const banner9Title = ref()
const banner9Desc = ref()
const banner9TextTitle = ref()
const banner9Text = ref()
useChangeOpacity(banner9, [banner9Title, banner9Desc], 'rightChange')
useChangeOpacity(banner9, [banner9TextTitle, banner9Text], 'rightChangeSurplus')

const isShowAnimate = ref(true)
// 轮播切换
const handleSlideChange = () => {
  isShowAnimate.value = false

  setTimeout(() => {
    isShowAnimate.value = true
  }, 50)
}

const banner10 = ref()
const banner10FirstTitle = ref()
const banner10SecondTitle = ref()
const banner10Desc = ref()
useChangeOpacity(banner10, [banner10FirstTitle, banner10SecondTitle, banner10Desc], 'opacityChange')
</script>

<style lang="less">
.q9-detail-container {
  .banner1 {
    width: 100%;
    height: 1024pxvw;
    background-size: cover;
    padding-top: 160pxvw;
    text-align: center;
    margin-bottom: -10pxvw;

    .main-title {
      font-size: 65pxvw;
      line-height: 104pxvw;
    }

    .less-title {
      font-size: 64pxvw;
      line-height: 104pxvw;
      margin-left: 25pxvw;
    }

    .banner1-desc {
      font-size: 32pxvw;
    }
    .banner1-selling-point {
      font-size: 24pxvw;
    }
  }
  .banner2 {
    width: 100%;
    height: 1084pxvw;
    background-size: cover;
    overflow: hidden;
    position: relative;

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1084pxvw;
      z-index: -1;
    }

    .title {
      text-align: center;
      color: #fff;
      font-size: 70pxvw;
      margin-top: 326pxvw;
      line-height: 70pxvw;
      margin-bottom: 78pxvw;
      z-index: 30;
    }

    .desc {
      text-align: center;
      color: #fff;
      font-size: 30pxvw;
      line-height: 50pxvw;
      z-index: 30;
    }

    .live-movie {
      margin: 0 auto;
      width: 201pxvw;
      height: 45pxvw;
      font-size: 18pxvw;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 92pxvw;
      z-index: 30;

      .live-svg {
        width: 19pxvw;
        height: 20pxvw;
        margin-right: 10pxvw;
        color: #a0d2b9;
        z-index: 30;
      }
    }
  }
  .banner3 {
    width: 100%;
    height: 1825pxvw;
    background-size: cover;
    position: relative;
    overflow: hidden;
    margin-top: -10pxvw;

    .banner3-top {
      padding-top: 92pxvw;
      .title,
      .desc {
        font-size: 55pxvw;
        color: #fff;
        text-align: center;
        line-height: 55pxvw;
      }

      .desc {
        margin-top: 24pxvw;
      }
    }

    .car-img {
      width: 1560pxvw;
      height: 1030pxvw;
      object-fit: contain;
      object-position: center;
      position: absolute;
      top: 350pxvw;
      left: 600pxvw;
    }

    .text-box {
      position: absolute;
      bottom: 80pxvw;
      left: 50%;
      transform: translateX(-50%);
      .title {
        line-height: 112pxvw;
        font-size: 50pxvw;
        color: #a0d2b9;
        text-align: center;
        margin-bottom: 42pxvw;
      }

      .desc {
        color: #737373;
        font-size: 24pxvw;
        line-height: 39pxvw;
        text-align: center;
      }
    }
  }

  .banner4 {
    width: 100%;
    height: 2020pxvw;
    overflow: hidden;

    .banner4-top {
      width: 100%;
      height: 700pxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      .banner4-top-left {
        width: 967pxvw;
        height: 100%;
        padding-top: 30pxvw;
        padding-left: 220pxvw;
        .title {
          color: #a0d2b9;
          font-size: 55pxvw;
          line-height: 70pxvw;
        }

        .desc {
          color: #737373;
          margin-top: 43pxvw;
          font-size: 30pxvw;
          color: #737373;
          line-height: 45pxvw;
        }

        .color-text {
          color: #cdd8df;
          font-size: 50pxvw;
          line-height: 50pxvw;
          margin: 30pxvw 0 20pxvw;
        }

        .color-group {
          display: flex;
          align-items: center;
          span {
            width: 65pxvw;
            height: 98pxvw;
            border-radius: 967pxvw;
            display: inline-block;
            cursor: pointer;
            z-index: 1000;

            &:nth-of-type(1) {
              border: 1px solid #c8c8c8;
            }
            &:nth-of-type(2) {
              border: 1px solid #c8c8c8;
            }
            &:nth-of-type(3) {
              border: 1px solid #c8c8c8;
            }
            &:nth-of-type(4) {
              border: 1px solid #c8c8c8;
            }
            &:nth-of-type(5) {
              border: 1px solid #c8c8c8;
            }
          }
          span.active {
            width: 83pxvw;
            height: 126pxvw;
          }
          span + span {
            margin-left: 24pxvw;
          }
        }
      }
      .banner4-top-right {
        width: 830pxvw;
        height: 100%;
        position: relative;
        margin-right: 221pxvw;
        overflow: hidden;

        .banner4-right-top-background {
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 335pxvw 528pxvw;
          background-position: right;
          border-bottom-right-radius: 270pxvw;
          overflow: hidden;
          // transition: all 1s;
          img {
            width: 790pxvw;
            height: 527pxvw;
            object-fit: contain;
            object-position: center;
            position: absolute;
            bottom: 20pxvw;
            right: -50pxvw;
          }
        }

        .banner4-right-top-car {
          position: absolute;
          right: 221pxvw;
          top: 120pxvw;
          width: 639pxvw;
          height: 738pxvw;
          background-size: cover;
          background-position: center center;
          // img {
          //   width: 639pxvw;
          //   height: 738pxvw;
          //   object-fit: contain;
          //   object-position: center;
          // }
        }
      }
    }
    .banner4-bottom {
      z-index: 20;
      width: 100%;
      height: 1534pxvw;
      margin-top: -210pxvw;
      position: relative;
      .banner4-bottom-left {
        height: 100%;
        width: 1258pxvw;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        background-size: cover;

        img {
          width: 1258pxvw;
          height: 2395pxvw;
          object-fit: cover;
          // object-position: -910pxvw -40pxvw;
          object-position: 0 -200pxvw;
        }
      }
      .banner4-bottom-right {
        width: 601pxvw;
        position: absolute;
        right: 220pxvw;
        bottom: 260pxvw;

        .title {
          color: #a0d2b9;
          text-align: right;
          font-size: 55pxvw;
          line-height: 70pxvw;
        }

        .desc {
          margin-top: 38pxvw;
          color: #737373;
          font-size: 30pxvw;
          line-height: 47px;
          margin-top: 38pxvw;
        }

        .brightened-dot-box {
          margin-top: 98pxvw;
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          .brightened-dot-item {
            width: 602pxvw;
            height: 129pxvw;
            border: 2px solid #a0d2b9;
            border-radius: 18pxvw;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .brightened-dot-title {
              font-size: 30pxvw;
              color: #a0d2b9;
              line-height: 54pxvw;
            }

            .brightened-dot-desc {
              font-size: 24pxvw;
              color: #737373;
              line-height: 36pxvw;
            }
          }
          .brightened-dot-item + .brightened-dot-item {
            margin-top: 71pxvw;
          }
        }
      }
    }
  }
  .banner5 {
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 926pxvw;

    .title {
      padding-top: 345pxvw;
      padding-left: 222pxvw;
      font-size: 55pxvw;
      color: #a0d2b9;
      line-height: 70pxvw;
    }

    .desc {
      margin-top: 46pxvw;
      color: #737373;
      padding-left: 222pxvw;
      line-height: 47pxvw;
    }
  }
  .banner6 {
    width: 100%;
    height: 1137pxvw;
    overflow: hidden;

    .banner6-top {
      width: 100%;
      height: 340pxvw;
      background-image: url('https://osswebsite.yadea.com.cn/2_2x_f0528b1a79.png?updated_at=2023-03-20T08:20:22.000Z');
      background-size: cover;
      background-position: center;
      padding-top: 188pxvw;
      text-align: center;
      margin-top: 28pxvw;

      .title {
        font-size: 55pxvw;
        color: #a0d2b9;
      }

      .desc {
        color: #737373;
      }
    }

    .banner6-middle {
      width: 710pxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      position: relative;
      border-bottom: 2px solid #bebebe;
      margin: 73pxvw auto 0;

      .banner6-middle-item {
        padding: 0 53pxvw 33pxvw;
        color: #bebebe;
        cursor: pointer;
      }
      .banner6-middle-item.active {
        position: relative;
        &::after {
          content: '';
          width: 100%;
          border-bottom: 5px solid #a0d2b9;
          position: absolute;
          bottom: -3px;
          left: 0;
        }
        color: #a0d2b9;
      }
    }

    .banner6-middle-content {
      .desc {
        color: #737373;
        line-height: 36pxvw;
        text-align: center;
        margin-top: 39pxvw;
      }

      .content-img {
        margin-top: 97pxvw;
        text-align: center;
        img {
          width: 100%;
          height: 385pxvw;
          object-fit: cover;
        }
      }

      // .content-img2 {
      //   margin-top: 97pxvw;
      //   text-align: center;
      //   img {
      //     width: 885pxvw;
      //     height: 385pxvw;
      //     object-fit: cover;
      //     margin: 0 auto;
      //   }
      // }
    }
  }
  .banner7,
  .banner8 {
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #393c3e;

    .banner7-left,
    .banner8-right {
      flex: 1;
      img {
        width: 986pxvw;
        height: 969pxvw;
        object-fit: contain;
      }
    }
    .banner7-right,
    .banner8-left {
      flex: 1;
      padding-right: 224pxvw;
      .title {
        color: #a0d2b9;
        font-size: 55pxvw;
        line-height: 55pxvw;
        text-align: right;
      }
      .desc {
        color: #fff;
        margin-top: 32pxvw;
        line-height: 30pxvw;
        text-align: right;
      }
      .text {
        line-height: 36pxvw;
        margin-top: 62pxvw;
        color: #fff;
        text-align: right;
      }
    }

    .banner8-left {
      padding-left: 222pxvw;
      padding-right: 0;
      .title,
      .desc,
      .text {
        text-align: left;
      }
    }
  }
  .banner9 {
    width: 100%;
    height: 1203pxvw;
    padding-top: 149pxvw;
    overflow: hidden;
    .swiper-button-disabled {
      display: none;
    }

    .swiper-button-prev {
      left: 80px;
    }

    .swiper-button-next {
      right: 80px;
    }
    .title {
      font-size: 55pxvw;
      color: #a0d2b9;
      line-height: 55pxvw;
      text-align: center;
      height: 55pxvw;
      overflow: hidden;
    }
    .desc {
      margin-top: 33pxvw;
      color: #a0d2b9;
      text-align: center;
      line-height: 30pxvw;
      height: 30pxvw;
      overflow: hidden;
    }

    .banner9-img {
      text-align: center;
      margin-top: 123pxvw;
      img {
        width: 1261pxvw;
        height: 517pxvw;
        object-fit: cover;
        object-position: center;
        border-radius: 45pxvw;
      }
    }
    .text-title {
      color: #a0d2b9;
      line-height: 30pxvw;
      margin-top: 68pxvw;
      padding-left: 359pxvw;
      height: 30pxvw;
      overflow: hidden;
    }
    .text {
      color: #737373;
      line-height: 36pxvw;
      margin-top: 15pxvw;
      padding-left: 359pxvw;
      height: 80pxvw;
      overflow: hidden;
    }
    .banner9-swiper {
      .text-box {
        opacity: 0;
      }
    }

    .banner9-swiper2 {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .text-box {
        margin-right: 217pxvw;
        .text-title,
        .text {
          padding-left: 0 !important;
        }
      }
      img {
        width: 587pxvw;
        height: 638pxvw;
      }
    }
    .banner9-swiper3 {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .text-box {
        margin-right: 96pxvw;
        margin-top: 200pxvw;
        .text-title,
        .text {
          padding-left: 0 !important;
        }
      }

      img {
        width: 632pxvw;
        height: 542pxvw;
      }
    }
    .banner9-swiper4 {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .text-box {
        margin-right: 157pxvw;
        .text-title,
        .text {
          padding-left: 0 !important;
        }

        .text {
          height: 100pxvw;
        }
      }

      img {
        width: 603pxvw;
        height: 777pxvw;
      }
    }
    .banner9-swiper5 {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;

      .text-box {
        margin-right: 237pxvw;
        margin-top: 123pxvw;
        .text-title,
        .text {
          padding-left: 0 !important;
        }

        .text {
          height: 200pxvw;
        }
      }

      img {
        width: 776pxvw;
        height: 603pxvw;
      }
    }
    .common-swiper-btn.prev,
    .common-swiper-btn.next {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .banner10 {
    .banner10-top {
      width: 100%;
      height: 340pxvw;
      background-image: url('https://osswebsite.yadea.com.cn/2_2x_f0528b1a79.png?updated_at=2023-03-20T08:20:22.000Z');
      background-size: cover;
      background-position: center;
      padding-top: 85pxvw;
      .first-title {
        text-align: center;
        font-size: 55pxvw;
        color: #a0d2b9;
        line-height: 90pxvw;
      }
      .second-title {
        text-align: center;
        font-size: 55pxvw;
        color: #a0d2b9;
        line-height: 90pxvw;
      }
      .desc {
        text-align: center;
        color: #737373;
        line-height: 47pxvw;
        letter-spacing: 2px;
      }
    }
    .banner10-middle {
      width: 1371pxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      position: relative;
      border-bottom: 2px solid #bebebe;
      margin: 58pxvw auto 0;

      .banner10-middle-item {
        padding: 0 32pxvw 30pxvw;
        color: #bebebe;
        cursor: pointer;
      }
      .banner10-middle-item.active {
        position: relative;
        &::after {
          content: '';
          width: 100%;
          border-bottom: 5px solid #a0d2b9;
          position: absolute;
          bottom: -3px;
          left: 0;
        }
        color: #a0d2b9;
      }
    }

    .banner10-middle-content {
      opacity: 0;
      height: 0;
      overflow: hidden;
      .desc {
        color: #737373;
        line-height: 36pxvw;
        text-align: center;
        margin-top: 30pxvw;
        height: 60pxvw;
      }

      .content-img {
        margin-top: 72pxvw;
        text-align: center;
        img {
          width: 864pxvw;
          height: 453pxvw;
          object-fit: cover;
          border-radius: 50pxvw;
        }
      }
    }
    .banner10-middle-content.active {
      opacity: 1;
      height: 100%;
      transition: 1500ms;
    }
    .banner10-bottom {
      width: 100%;
      height: 1019pxvw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .banner10-bottom-left {
        flex: 1;
        height: 100%;
        padding-left: 223pxvw;
        padding-top: 343pxvw;
        .title {
          font-size: 55pxvw;
          color: #a0d2b9;
          line-height: 70pxvw;
        }
        .desc {
          color: #737373;
          margin-top: 36pxvw;
          line-height: 30pxvw;
        }
        .text {
          color: #737373;
          line-height: 24pxvw;
          margin-top: 63pxvw;
        }
      }
      .banner10-bottom-right {
        flex: 1;
        height: 100%;
        position: relative;
        .banner10-bottom-right-back {
          position: absolute;
          top: 195pxvw;
          right: 238pxvw;
          width: 673pxvw;
          height: 673pxvw;
          object-fit: cover;
          object-position: center;
        }
        .banner10-bottom-right-front {
          position: absolute;
          top: 160pxvw;
          right: 238pxvw;
          width: 679pxvw;
          height: 765pxvw;
        }
      }
    }
  }

  .banner11.car-container {
    position: relative;
    .car-param-img-container {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 187pxvw 0 0;
      height: 672pxvw;
      animation: onlyOpcity 1s ease-in-out 0s 1;

      .param-left-img-container {
        display: inline-block;
        position: relative;
        text-align: right;
        & > img {
          width: 423pxvw;
          height: 672pxvw;
        }

        .top-desc {
          position: absolute;
          right: 28pxvw;
          bottom: 145pxvw;
          color: #fff;
          font-size: 30pxvw;
          z-index: 3;
        }

        .bottom-desc {
          position: absolute;
          right: 32pxvw;
          bottom: 47pxvw;
          color: #fff;
          font-size: 24pxvw;
          z-index: 3;
        }
      }

      .param-left-img-container-smart-car {
        & > img {
          width: 607pxvw;
        }
      }

      .param-center-container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 869pxvw;
        height: 100%;
        margin: 0 10pxvw 0 10pxvw;

        .title-position {
          position: absolute;
          color: #fff;

          z-index: 3;
        }

        .top-title {
          top: 231pxvw;
          left: 53pxvw;
          font-size: 30pxvw;
        }
        .top-subTitle {
          top: 288pxvw;
          left: 52pxvw;
          font-size: 24pxvw;
        }
        .bottom-title {
          right: 126pxvw;
          bottom: 99pxvw;
          font-size: 30pxvw;
        }
        .bottom-subTitle {
          right: 27pxvw;
          bottom: 47pxvw;
          font-size: 24pxvw;
        }
      }

      .param-center-container-smart-car {
        width: 683pxvw;
      }

      .param-right-img-container {
        position: relative;
        display: inline-block;
        & > img {
          width: 423pxvw;
          height: 672pxvw;
        }

        .title-position {
          position: absolute;
        }

        .top-title {
          top: 73pxvw;
          left: 31pxvw;
          color: #fff;
          font-size: 30pxvw;
          z-index: 3;
        }

        .top-SubTitle {
          top: 130pxvw;
          left: 30pxvw;
          color: #fff;
          font-size: 27pxvw;
          z-index: 3;
        }
      }

      .param-right-img-container-smart-car {
        & > img {
          width: 423pxvw;
        }
      }

      .container-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #000;
        opacity: 0.58;
        z-index: 2;
      }
    }

    .car-param-img-container-smart-car {
      margin: 80pxvw 0 0;
    }

    .car-img-title {
      display: inline-block;
      width: 100%;
      font-size: 55pxvw;
      color: #a0d2b9;
      text-align: center;
    }

    .arrow-img-container {
      display: flex;
      justify-content: center;
      .arrow-img {
        display: inline-block;
        width: 79pxvw;
        height: 79pxvw;
        margin: 49pxvw 0 49pxvw;
        cursor: pointer;
      }

      .left-arrow {
        margin-right: 11pxvw;
      }
    }
  }

  .banner12 {
    text-align: center;
    padding-bottom: 184pxvw;

    .swiper-slide {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 998pxvw;
      height: auto;
      object-fit: cover;
      object-position: center;
    }

    .colotText {
      color: #333;
      font-size: 12pxvw;
    }

    .swiper-box {
      padding: 30pxvw 0;
      .swiper {
        img {
          width: 474pxvw;
          height: 316pxvw;
        }
      }

      .custom-pagination {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .custom-pagination-div {
          width: 28pxvw;
          height: 28pxvw;
          margin: 0 5pxvw;
          border: 3px solid transparent;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-pagination-span {
          width: 20pxvw;
          height: 20pxvw;
          display: inline-block;
          border-radius: 100%;
          overflow: hidden;
          background: #000;
        }
      }
    }
  }

  .banner13 {
    padding-bottom: 50pxvw;
    .title {
      font-size: 55pxvw;
      color: #a0d2b9;
      text-align: center;
      margin-bottom: 30pxvw;
    }
    .swiper {
      height: 800pxvw;
      .swiper-slide {
        text-align: center;
        img {
          width: 1734pxvw;
          height: 671pxvw;
          object-fit: contain;
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

  .opacityChange {
    animation: opacity 1.5s ease-in-out 0s 1;
  }

  @keyframes opacity {
    0% {
      opacity: 0;
      position: relative;
      top: 100px;
    }
    100% {
      opacity: 1;
      position: relative;
      top: 0px;
    }
  }

  .banner2-title-animation {
    animation: fontGradual 2s ease-in-out 0s 1;
  }

  @keyframes fontGradual {
    0% {
      transform: scale(5);
      color: #a0d2b9;
    }
    100% {
      transform: scale(1);
      color: #fff;
    }
  }

  .leftChange {
    animation: leftChange 1.5s ease-in-out 0s 1;
  }

  @keyframes leftChange {
    0% {
      left: -1800px;
    }
    100% {
      left: 0;
    }
  }

  .topChange {
    animation: topChange 1.5s ease-in-out 0s 1;
  }

  .topDelayChange1 {
    animation: topChange 1.5s ease-in-out 0.25s 1;
  }

  .topDelayChange2 {
    animation: topChange 1.5s ease-in-out 0.5s 1;
  }

  .topDelayChange3 {
    animation: topChange 1.5s ease-in-out 0.75s 1;
  }

  @keyframes topChange {
    0% {
      position: relative;
      top: 500px;
    }
    100% {
      position: relative;
      top: 0;
    }
  }

  .rightChange {
    animation: rightChange 1.5s ease-in-out 0s 1;
  }

  @keyframes rightChange {
    0% {
      padding-left: 1000px;
    }
    100% {
      padding-left: 0;
    }
  }

  .rightChangeSurplus {
    animation: rightChangeSurplus 1.5s ease-in-out 0s 1;
  }

  @keyframes rightChangeSurplus {
    0% {
      padding-left: 1000px;
    }
    100% {
      padding-left: 359pxvw;
    }
  }

  .rightChangePos {
    animation: rightChangePos 0.75s ease-in-out 0s 1;
    animation-fill-mode: forwards;
  }

  @keyframes rightChangePos {
    0% {
      opacity: 1;
      position: relative;
      left: 500px;
      z-index: -1;
    }
    100% {
      opacity: 1;
      position: relative;
      left: 0;
      z-index: -1;
    }
  }

  .centerToLeft {
    animation: centerToLeft 1.5s ease-in-out 0s 1;
    animation-fill-mode: forwards;
  }

  @keyframes centerToLeft {
    // 0% {
    //   left: 600px;
    // }
    100% {
      left: 100px;
    }
  }

  .onlyOpcity {
    animation: onlyOpcity 2.5s ease-in-out 0s 1;
  }

  @keyframes onlyOpcity {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }

  .onlyTop {
    animation: onlyTop 1.5s ease-in-out 0s 1;
  }

  @keyframes onlyTop {
    0% {
      position: relative;
      top: 200px;
    }
    100% {
      position: relative;
      top: 0px;
    }
  }
}

.q9-detail-modal {
  max-width: 100% !important;
  width: 100% !important;
  height: 100vh;
  top: 0;
  padding-bottom: 0;

  .ant-modal-content {
    width: 100%;
    height: 100%;
    background: #000;

    .ant-modal-body {
      width: 100%;
      height: 100%;

      video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
    }

    .ant-modal-close {
      background-color: #6b6b6b;
      border-radius: 100%;
      opacity: 0.5;
      width: 50pxvw;
      height: 50pxvw;
      top: 20pxvw;
      right: 20pxvw;

      .ant-modal-close-x {
        width: 50pxvw;
        height: 50pxvw;
        line-height: 50pxvw;

        svg {
          color: #fff;
        }
      }
    }
  }
}
</style>
